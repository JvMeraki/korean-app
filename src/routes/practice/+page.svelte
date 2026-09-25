<script lang="ts">
  import { onMount } from 'svelte';
  import Keyboard from '@components/keyboard/Keyboard.svelte';
  import { session, currentExercise, expectedNextKey, accuracy, sessionStats, showHints } from '@stores/session';
  import { generateSession } from '@domain/practice/exercise';
  import { db } from '@domain/database/db';
  import { renderLiveComposition } from '@domain/hangul/unicode';
  import * as m from '$lib/paraglide/messages.js';
  
  let activeKeys = new Set<string>();
  let isShiftActive = false;
  let sessionSaved = false;

  onMount(() => {
    startNewSession();
  });

  // Automatically save session when completed
  $: if ($session.isCompleted && !sessionSaved && $session.validKeystrokes > 0) {
    saveSessionToDB();
  }

  async function saveSessionToDB() {
    sessionSaved = true;
    try {
      await db.sessions.add({
        date: new Date(),
        accuracy: $accuracy,
        cpm: $sessionStats.cpm,
        timeSeconds: $sessionStats.timeSeconds,
        errors: $session.errors,
        validKeystrokes: $session.validKeystrokes,
        missedKeys: $session.missedKeys
      });
      console.log('Session saved successfully!');
    } catch (e) {
      console.error('Failed to save session', e);
    }
  }

  function startNewSession() {
    sessionSaved = false;
    // Pick 10 random words from both commonWords and phrases for the MVP
    const exercises = [
      ...generateSession('commonWords', 7),
      ...generateSession('phrases', 3)
    ].sort(() => 0.5 - Math.random());
    session.start(exercises);
  }

  function getPhysicalKey(e: KeyboardEvent): string | null {
    if (e.code.startsWith('Key')) {
      return e.code.replace('Key', '').toLowerCase();
    }
    if (e.key.match(/^[a-z]$/i)) {
      return e.key.toLowerCase();
    }
    // Support spaces
    if (e.code === 'Space') {
      return ' ';
    }
    return null;
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Backspace') {
      e.preventDefault();
      activeKeys.add('backspace');
      activeKeys = activeKeys;
      session.handleBackspace();
      return;
    }
    if (e.key === 'Shift') {
      isShiftActive = true;
      return;
    }
    if (e.ctrlKey || e.altKey || e.metaKey) return;

    const physicalKey = getPhysicalKey(e);
    
    if (physicalKey) {
      e.preventDefault(); 
      
      activeKeys.add(physicalKey);
      activeKeys = activeKeys;

      // If Shift is active, send uppercase to validate ㄲ, ㅃ, ㅒ, etc.
      const inputKey = isShiftActive && physicalKey !== ' ' ? physicalKey.toUpperCase() : physicalKey;
      session.handleInput(inputKey);
    }
  }

  function handleKeyup(e: KeyboardEvent) {
    if (e.key === 'Backspace') {
      activeKeys.delete('backspace');
      activeKeys = activeKeys;
      return;
    }
    if (e.key === 'Shift') {
      isShiftActive = false;
      return;
    }
    
    const physicalKey = getPhysicalKey(e);
    if (physicalKey) {
      activeKeys.delete(physicalKey);
      activeKeys = activeKeys;
    }
  }
  $: hasError = $session.currentTypedKeys.length > $session.currentKeyIndex;
  $: errorKey = hasError ? $session.currentTypedKeys[$session.currentKeyIndex].toLowerCase() : null;
</script>

<svelte:window on:keydown={handleKeydown} on:keyup={handleKeyup} />

<div class="w-full flex flex-col items-center gap-10 mt-6">
  <div class="text-center space-y-6 w-full max-w-xl">
    <!-- Live Stats -->
    <div class="flex justify-between items-center w-full px-4 text-sm text-gray-500 font-semibold tracking-wide">
      <span>{m.practice_errors()}: <span class="text-korea-red">{$session.errors}</span></span>
      <span>{m.practice_accuracy()}: <span class="text-korea-blue">{$accuracy}%</span></span>
      <span>{m.practice_progress()}: {$session.currentExerciseIndex} / {$session.exercises.length}</span>
      
      <!-- iOS-style Toggle Switch -->
      <label class="flex items-center gap-3 cursor-pointer group">
        <span class="text-sm font-bold text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors uppercase tracking-widest">Hints</span>
        <div class="relative">
          <input type="checkbox" bind:checked={$showHints} class="sr-only peer">
          <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-korea-blue"></div>
        </div>
      </label>
    </div>

    <!-- Active Area -->
    <div class="flex flex-col items-center justify-center w-full min-h-[16rem] bg-surface-card border border-border-base rounded-3xl p-8 shadow-sm">
      {#if $currentExercise}
        <div class="space-y-6 w-full">
          <p class="text-gray-500 dark:text-gray-400 uppercase tracking-widest text-xs font-bold">{m.practice_title()}</p>
          
          <div class="flex flex-col items-center gap-4">
            <!-- Target word (Reference) -->
            <span class="text-5xl font-black select-none tracking-widest transition-colors duration-200
              {$session.currentTypedKeys.length > $session.currentKeyIndex ? 'text-korea-red opacity-80' : 'text-text-muted opacity-40'}">
              {$currentExercise.target}
            </span>
            
            <!-- Live composing word -->
            <span class="text-7xl font-black tracking-widest min-h-[5rem] transition-all duration-300 transform
              {$session.isTransitioning ? 'text-green-500 dark:text-green-400 scale-110 drop-shadow-lg' : 
               $session.currentTypedKeys.length > $session.currentKeyIndex ? 'text-korea-red' : 'text-korea-blue dark:text-blue-400 scale-100'}"
            >
              {renderLiveComposition($session.currentTypedKeys) || ' '}
            </span>
          </div>
          
          <div class="flex justify-center gap-2 mt-4 min-h-[2.5rem] flex-wrap">
            {#if $showHints}
              {#each $currentExercise.expectedSequence as expectedKey, index}
                {@const isShift = expectedKey === expectedKey.toUpperCase() && /[A-Z]/.test(expectedKey)}
                {@const isError = $session.currentTypedKeys.length > index && index === $session.currentKeyIndex}
                {@const wrongKey = isError ? $session.currentTypedKeys[index] : null}
                <span class="px-3 h-10 min-w-[2.5rem] flex items-center justify-center rounded-lg border-2 text-lg font-bold transition-colors
                  {index < $session.currentKeyIndex ? 'bg-korea-blue text-white border-korea-blue' : 
                   isError ? 'bg-korea-red text-white border-korea-red shadow-lg animate-pulse' :
                   index === $session.currentKeyIndex ? 'border-korea-red text-korea-red shadow-sm bg-red-50 dark:bg-red-900/20' : 
                   'border-border-base text-text-muted'}">
                  {#if isError && wrongKey}
                    <span class="line-through opacity-80">{wrongKey.toUpperCase()}</span>
                  {:else if isShift}
                    <span class="text-xs mr-1 {index === $session.currentKeyIndex ? 'text-yellow-600 dark:text-yellow-400' : 'opacity-60'}">⇧</span> {expectedKey.toUpperCase()}
                  {:else}
                    {expectedKey.toLowerCase()}
                  {/if}
                </span>
              {/each}
            {/if}
          </div>
        </div>
      {/if}
    </div>
  </div>

  <Keyboard {activeKeys} expectedKey={$expectedNextKey} {errorKey} {isShiftActive} showHints={$showHints} />
</div>

{#if $session.isCompleted}
  <!-- Full-screen Completion Modal -->
  <div class="fixed inset-0 z-[100] flex items-center justify-center bg-white/60 dark:bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
    <div class="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-3xl border border-border-base max-w-lg w-full shadow-2xl animate-in zoom-in-95 duration-300">
      <h2 class="text-4xl font-black text-korea-blue dark:text-blue-400 mb-8 text-center">{m.practice_completed()}</h2>
      
      <div class="grid grid-cols-2 gap-4 mb-8">
        <div class="bg-surface-alt p-6 rounded-2xl shadow-sm text-center">
          <p class="text-xs text-gray-500 uppercase tracking-widest font-bold mb-1">{m.practice_cpm()}</p>
          <p class="text-4xl font-black text-text-main">{$sessionStats.cpm}</p>
        </div>
        <div class="bg-surface-alt p-6 rounded-2xl shadow-sm text-center">
          <p class="text-xs text-gray-500 uppercase tracking-widest font-bold mb-1">{m.practice_accuracy()}</p>
          <p class="text-4xl font-black text-text-main">{$accuracy}%</p>
        </div>
        <div class="bg-surface-alt p-6 rounded-2xl shadow-sm col-span-2 flex justify-between items-center">
          <div class="text-left">
            <p class="text-xs text-gray-500 uppercase tracking-widest font-bold mb-1">{m.practice_time()}</p>
            <p class="text-2xl font-bold text-text-main">{$sessionStats.timeSeconds} <span class="text-base font-medium text-gray-500">{m.practice_seconds()}</span></p>
          </div>
          <div class="text-right">
            <p class="text-xs text-gray-500 uppercase tracking-widest font-bold mb-1">{m.practice_errors()}</p>
            <p class="text-2xl font-bold text-korea-red">{$session.errors}</p>
          </div>
        </div>
      </div>

      <button on:click={startNewSession} class="w-full px-6 py-4 bg-korea-blue text-white rounded-xl hover:bg-blue-700 font-bold text-lg transition-all shadow-md hover:scale-105 active:scale-95">
        {m.practice_restart()}
      </button>
    </div>
  </div>
{/if}
