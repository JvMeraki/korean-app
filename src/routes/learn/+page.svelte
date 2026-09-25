<script lang="ts">
  import { decomposeSyllable } from '@domain/hangul/unicode';
  import * as m from '$lib/paraglide/messages.js';
  
  let inputText = '한';
  
  // Reactively decompose the current input character
  $: decomposed = decomposeSyllable(inputText.charAt(0)) || decomposeSyllable('한');

  function handleInput(e: Event) {
    const target = e.target as HTMLInputElement;
    const val = target.value;
    
    // Only capture the last typed character for the syllable visualizer
    if (val.length > 0) {
      inputText = val.charAt(val.length - 1);
      target.value = inputText;
    } else {
      inputText = '';
    }
  }
</script>

<div class="max-w-4xl mx-auto w-full px-4 py-12 animate-in fade-in duration-500">
  <!-- Header -->
  <div class="text-center mb-16">
    <h1 class="text-4xl md:text-5xl font-black text-text-main mb-4">{m.learn_title()}</h1>
    <p class="text-text-muted text-lg max-w-2xl mx-auto">{m.learn_subtitle()}</p>
  </div>

  <!-- Educational Theory Cards -->
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
    <!-- Concept 1: Keyboard Mapping Layout -->
    <div class="bg-surface-card p-8 rounded-3xl shadow-sm border border-border-base flex flex-col">
      <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900/40 text-korea-blue rounded-2xl flex items-center justify-center mb-6 text-xl font-black">1</div>
      <h2 class="text-xl font-bold text-text-main mb-3">{m.learn_concept_1_title()}</h2>
      <p class="text-text-muted leading-relaxed grow text-sm">{m.learn_concept_1_desc()}</p>
      
      <div class="mt-8 flex gap-3 h-24">
        <div class="flex-1 bg-surface-alt rounded-2xl p-2 flex flex-col justify-center items-center border border-border-light border-l-4 border-l-korea-blue">
          <span class="text-xl font-black text-korea-blue">ㄱ ㄴ</span>
        </div>
        <div class="flex-1 bg-surface-alt rounded-2xl p-2 flex flex-col justify-center items-center border border-border-light border-r-4 border-r-korea-red">
          <span class="text-xl font-black text-korea-red">ㅏ ㅓ</span>
        </div>
      </div>
    </div>

    <!-- Concept 2: Syllable Assembly -->
    <div class="bg-surface-card p-8 rounded-3xl shadow-sm border border-border-base flex flex-col">
      <div class="w-12 h-12 bg-red-100 dark:bg-red-900/40 text-korea-red rounded-2xl flex items-center justify-center mb-6 text-xl font-black">2</div>
      <h2 class="text-xl font-bold text-text-main mb-3">{m.learn_concept_2_title()}</h2>
      <p class="text-text-muted leading-relaxed grow text-sm">{m.learn_concept_2_desc()}</p>
      
      <div class="mt-8 flex gap-1 justify-center items-center h-24 bg-surface-alt rounded-2xl border border-border-light">
        <span class="text-2xl font-black text-korea-blue">ㅎ</span>
        <span class="text-text-muted opacity-60 font-bold">+</span>
        <span class="text-2xl font-black text-korea-red">ㅏ</span>
        <span class="text-text-muted opacity-60 font-bold">+</span>
        <span class="text-2xl font-black text-korea-blue">ㄴ</span>
        <span class="text-text-muted opacity-60 font-bold mx-1">=</span>
        <span class="text-3xl font-black text-text-main">한</span>
      </div>
    </div>

    <!-- Concept 3: Shift Modifier -->
    <div class="bg-surface-card p-8 rounded-3xl shadow-sm border border-border-base flex flex-col">
      <div class="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/40 text-yellow-600 rounded-2xl flex items-center justify-center mb-6 text-xl font-black">3</div>
      <h2 class="text-xl font-bold text-text-main mb-3">{m.learn_concept_3_title()}</h2>
      <p class="text-text-muted leading-relaxed grow text-sm">{m.learn_concept_3_desc()}</p>
      
      <div class="mt-8 flex gap-2 justify-center items-center h-24 bg-surface-alt rounded-2xl border border-border-light">
        <kbd class="px-2 py-1 bg-gray-800 dark:bg-gray-100 text-white dark:text-gray-900 font-mono font-bold rounded shadow-sm text-sm">Shift</kbd>
        <span class="text-text-muted opacity-60 font-bold">+</span>
        <span class="text-2xl font-black text-korea-blue">ㅂ</span>
        <span class="text-text-muted opacity-60 font-bold mx-1">=</span>
        <span class="text-3xl font-black text-text-main">ㅃ</span>
      </div>
    </div>
  </div>

  <!-- Interactive Composition Engine Visualizer -->
  <div class="bg-surface-card p-8 md:p-12 rounded-3xl shadow-sm border border-border-base text-center">
    <h2 class="text-2xl font-black text-text-main mb-4">{m.learn_interactive_title()}</h2>
    <p class="text-text-muted mb-8 max-w-xl mx-auto">{m.learn_interactive_desc()}</p>

    <div class="max-w-[200px] mx-auto mb-6">
      <input 
        type="text" 
        value={inputText}
        on:input={handleInput}
        placeholder="한"
        class="w-full text-center text-6xl font-black bg-surface-alt text-text-main border-2 border-border-base rounded-2xl py-6 outline-none focus:border-korea-blue focus:ring-4 focus:ring-blue-500/20 transition-all shadow-inner"
      />
    </div>
    
    <div class="flex flex-wrap justify-center gap-2 mb-16">
      {#each ['한', '글', '안', '녕', '빵', '읽'] as preset}
        <button 
          on:click={() => inputText = preset}
          class="px-4 py-2 bg-surface-alt hover:bg-border-light border border-border-base rounded-xl font-bold text-text-main transition-colors text-lg"
        >
          {preset}
        </button>
      {/each}
    </div>

    {#if decomposed}
      <div class="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-10">
        
        <!-- Choseong (Initial Consonant) -->
        <div class="flex flex-col items-center gap-5">
          <div class="w-24 h-24 flex items-center justify-center bg-surface-alt border-2 border-korea-blue/20 rounded-3xl shadow-sm">
            <span class="text-5xl font-black text-korea-blue">{decomposed.cho.jamo}</span>
          </div>
          <div class="flex gap-1.5 h-10">
            {#each decomposed.cho.keys.split('') as k}
              {#if k === k.toUpperCase() && k.match(/[A-Z]/)}
                <kbd class="px-3 py-2 bg-yellow-100 text-yellow-800 dark:bg-yellow-900/60 dark:text-yellow-400 font-mono font-bold rounded-lg shadow-sm text-sm leading-none flex items-center justify-center">Shift</kbd>
                <kbd class="px-4 py-2 bg-gray-800 dark:bg-gray-100 text-white dark:text-gray-900 font-mono font-bold rounded-lg shadow-sm text-lg leading-none flex items-center justify-center">{k.toLowerCase()}</kbd>
              {:else}
                <kbd class="px-4 py-2 bg-gray-800 dark:bg-gray-100 text-white dark:text-gray-900 font-mono font-bold rounded-lg shadow-sm text-lg leading-none flex items-center justify-center">{k}</kbd>
              {/if}
            {/each}
          </div>
        </div>

        <span class="text-4xl text-text-muted opacity-60 font-black">+</span>

        <!-- Jungseong (Vowel) -->
        <div class="flex flex-col items-center gap-5">
          <div class="w-24 h-24 flex items-center justify-center bg-surface-alt border-2 border-korea-red/20 rounded-3xl shadow-sm">
            <span class="text-5xl font-black text-korea-red">{decomposed.jung.jamo}</span>
          </div>
          <div class="flex gap-1.5 h-10">
            {#each decomposed.jung.keys.split('') as k}
              {#if k === k.toUpperCase() && k.match(/[A-Z]/)}
                <kbd class="px-3 py-2 bg-yellow-100 text-yellow-800 dark:bg-yellow-900/60 dark:text-yellow-400 font-mono font-bold rounded-lg shadow-sm text-sm leading-none flex items-center justify-center">Shift</kbd>
                <kbd class="px-4 py-2 bg-gray-800 dark:bg-gray-100 text-white dark:text-gray-900 font-mono font-bold rounded-lg shadow-sm text-lg leading-none flex items-center justify-center">{k.toLowerCase()}</kbd>
              {:else}
                <kbd class="px-4 py-2 bg-gray-800 dark:bg-gray-100 text-white dark:text-gray-900 font-mono font-bold rounded-lg shadow-sm text-lg leading-none flex items-center justify-center">{k}</kbd>
              {/if}
            {/each}
          </div>
        </div>

        {#if decomposed.jong}
          <span class="text-4xl text-text-muted opacity-60 font-black">+</span>
          
          <!-- Jongseong (Final Consonant / Batchim) -->
          <div class="flex flex-col items-center gap-5">
            <div class="w-24 h-24 flex items-center justify-center bg-surface-alt border-2 border-korea-blue/20 rounded-3xl shadow-sm">
              <span class="text-5xl font-black text-korea-blue">{decomposed.jong.jamo}</span>
            </div>
            <div class="flex gap-1.5 h-10">
              {#each decomposed.jong.keys.split('') as k}
                {#if k === k.toUpperCase() && k.match(/[A-Z]/)}
                  <kbd class="px-3 py-2 bg-yellow-100 text-yellow-800 dark:bg-yellow-900/60 dark:text-yellow-400 font-mono font-bold rounded-lg shadow-sm text-sm leading-none flex items-center justify-center">Shift</kbd>
                  <kbd class="px-4 py-2 bg-gray-800 dark:bg-gray-100 text-white dark:text-gray-900 font-mono font-bold rounded-lg shadow-sm text-lg leading-none flex items-center justify-center">{k.toLowerCase()}</kbd>
                {:else}
                  <kbd class="px-4 py-2 bg-gray-800 dark:bg-gray-100 text-white dark:text-gray-900 font-mono font-bold rounded-lg shadow-sm text-lg leading-none flex items-center justify-center">{k}</kbd>
                {/if}
              {/each}
            </div>
          </div>
        {/if}

      </div>
    {:else}
      <div class="py-12 border-2 border-dashed border-border-base rounded-3xl bg-surface-alt">
        <p class="text-text-muted font-bold text-lg">{m.learn_interactive_empty()}</p>
      </div>
    {/if}

  </div>
</div>
