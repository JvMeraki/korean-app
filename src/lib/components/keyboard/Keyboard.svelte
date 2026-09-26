<script lang="ts">
  import { korean2SetMap } from '@domain/keyboard/layout';
  import Key from './Key.svelte';

  export let activeKeys: Set<string> = new Set();
  export let expectedKey: string | null = null;
  export let errorKey: string | null = null;
  export let isShiftActive: boolean = false;
  export let showHints: boolean = true;
  export let onVirtualKey: (key: string) => void = () => {};

  const rows = [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    ['z', 'x', 'c', 'v', 'b', 'n', 'm']
  ];
</script>

<div class="flex flex-col items-center gap-1.5 mobile-landscape:gap-1 sm:gap-2 w-full max-w-4xl p-3 mobile-landscape:p-1 sm:p-6 bg-surface-alt rounded-2xl border border-border-base shadow-inner overflow-x-hidden">
  {#each rows as row, i}
    <div class="flex justify-center items-stretch gap-1 sm:gap-2 w-full" style="margin-left: {i * 5}%;">
      {#if i === 2}
        <!-- Virtual Left Shift Key -->
        <div 
          role="button" tabindex="-1" on:pointerdown={(e) => { e.preventDefault(); onVirtualKey('Shift'); }}
          class="flex items-center justify-center p-1.5 sm:p-2 rounded-lg border-2 shadow-sm transition-all duration-75 select-none cursor-pointer px-2 sm:px-6 active:scale-90
          {isShiftActive ? 'bg-yellow-100 dark:bg-yellow-900/60 border-yellow-400 text-yellow-700 dark:text-yellow-400 scale-95' : 'bg-surface-card border-border-base text-text-muted'}
        ">
          <span class="text-[10px] sm:text-xs font-bold uppercase tracking-wider">Shift</span>
        </div>
      {/if}

      {#each row as keyId}
        {@const keyData = korean2SetMap[keyId]}
        {#if keyData}
          <Key 
            qwertyLabel={keyData.qwertyKey}
            jamoLabel={keyData.jamoBase}
            jamoShiftLabel={keyData.jamoShift}
            type={keyData.type}
            isActive={activeKeys.has(keyId)}
            isExpected={expectedKey === keyId}
            isErrorActive={errorKey === keyId}
            {isShiftActive}
            {showHints}
            onKeyPress={onVirtualKey}
          />
        {/if}
      {/each}

      {#if i === 0}
        <!-- Virtual Backspace Key -->
        <div 
          role="button" tabindex="-1" on:pointerdown={(e) => { e.preventDefault(); onVirtualKey('Backspace'); }}
          class="flex items-center justify-center p-1.5 sm:p-2 rounded-lg border-2 shadow-sm transition-all duration-75 select-none cursor-pointer px-2 sm:px-8 ml-1 sm:ml-2 active:scale-90
          {activeKeys.has('backspace') ? 'bg-gray-200 dark:bg-gray-700 scale-95' : 'bg-surface-card border-border-base text-text-muted'}
        ">
          <span class="text-[10px] sm:text-xs font-bold uppercase tracking-wider">Back</span>
        </div>
      {/if}

      {#if i === 2}
        <!-- Virtual Right Shift Key -->
        <div 
          role="button" tabindex="-1" on:pointerdown={(e) => { e.preventDefault(); onVirtualKey('Shift'); }}
          class="flex items-center justify-center p-1.5 sm:p-2 rounded-lg border-2 shadow-sm transition-all duration-75 select-none cursor-pointer px-2 sm:px-6 active:scale-90
          {isShiftActive ? 'bg-yellow-100 dark:bg-yellow-900/60 border-yellow-400 text-yellow-700 dark:text-yellow-400 scale-95' : 'bg-surface-card border-border-base text-text-muted'}
        ">
          <span class="text-[10px] sm:text-xs font-bold uppercase tracking-wider">Shift</span>
        </div>
      {/if}
    </div>
  {/each}
  
  <!-- 4th Row (Spacebar) -->
  <div class="flex justify-center w-full mt-1 sm:mt-2">
    <div 
      role="button" tabindex="-1" on:pointerdown={(e) => { e.preventDefault(); onVirtualKey(' '); }}
      class="flex items-center justify-center p-1.5 sm:p-2 rounded-lg border-2 shadow-sm transition-all duration-75 select-none cursor-pointer w-[60%] sm:w-1/2 min-h-[3rem] sm:min-h-[3.5rem] mobile-landscape:min-h-[2rem] active:scale-90
      {activeKeys.has(' ') ? 'bg-korea-blue/20 border-korea-blue scale-95' : 'bg-surface-card border-border-base text-text-muted'}
      {expectedKey === ' ' && showHints ? 'ring-2 ring-korea-red ring-offset-2 dark:ring-offset-slate-900' : ''}
    ">
      <span class="text-xs font-bold uppercase tracking-widest ">Space</span>
    </div>
  </div>
</div>
