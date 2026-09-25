<script lang="ts">
  import { korean2SetMap } from '@domain/keyboard/layout';
  import Key from './Key.svelte';

  export let activeKeys: Set<string> = new Set();
  export let expectedKey: string | null = null;
  export let errorKey: string | null = null;
  export let isShiftActive: boolean = false;
  export let showHints: boolean = true;

  const rows = [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    ['z', 'x', 'c', 'v', 'b', 'n', 'm']
  ];
</script>

<div class="flex flex-col items-center gap-2 w-full max-w-4xl p-6 bg-surface-alt rounded-2xl border border-border-base shadow-inner">
  {#each rows as row, i}
    <div class="flex justify-center gap-1 sm:gap-2 w-full" style="margin-left: {i * 1.5}rem;">
      {#if i === 2}
        <!-- Virtual Shift Key -->
        <div class="flex items-center justify-center p-2 rounded-lg border-2 shadow-sm transition-all duration-75 select-none h-14 sm:h-16 px-4 sm:px-6
          {isShiftActive ? 'bg-yellow-100 dark:bg-yellow-900/60 border-yellow-400 text-yellow-700 dark:text-yellow-400 scale-95' : 'bg-surface-card border-border-base text-text-muted'}
        ">
          <span class="text-xs font-bold uppercase tracking-wider">Shift</span>
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
          />
        {/if}
      {/each}

      {#if i === 0}
        <!-- Virtual Backspace Key -->
        <div class="flex items-center justify-center p-2 rounded-lg border-2 shadow-sm transition-all duration-75 select-none h-14 sm:h-16 px-4 sm:px-8 ml-1 sm:ml-2
          {activeKeys.has('backspace') ? 'bg-gray-200 dark:bg-gray-700 scale-95' : 'bg-surface-card border-border-base text-text-muted'}
        ">
          <span class="text-xs font-bold uppercase tracking-wider">Back</span>
        </div>
      {/if}

      {#if i === 2}
        <!-- Virtual Right Shift Key -->
        <div class="flex items-center justify-center p-2 rounded-lg border-2 shadow-sm transition-all duration-75 select-none h-14 sm:h-16 px-4 sm:px-6
          {isShiftActive ? 'bg-yellow-100 dark:bg-yellow-900/60 border-yellow-400 text-yellow-700 dark:text-yellow-400 scale-95' : 'bg-surface-card border-border-base text-text-muted'}
        ">
          <span class="text-xs font-bold uppercase tracking-wider">Shift</span>
        </div>
      {/if}
    </div>
  {/each}
  
  <!-- 4th Row (Spacebar) -->
  <div class="flex justify-center w-full mt-2">
    <div class="flex items-center justify-center p-2 rounded-lg border-2 shadow-sm transition-all duration-75 select-none h-14 sm:h-16 w-3/5 sm:w-1/2
      {activeKeys.has(' ') ? 'bg-korea-blue/20 border-korea-blue scale-95' : 'bg-surface-card border-border-base text-text-muted'}
      {expectedKey === ' ' && showHints ? 'ring-2 ring-korea-red ring-offset-2 dark:ring-offset-slate-900' : ''}
    ">
      <span class="text-xs font-bold uppercase tracking-widest ">Space</span>
    </div>
  </div>
</div>
