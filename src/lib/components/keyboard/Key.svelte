<script lang="ts">
  import type { JamoType } from '@domain/keyboard/layout';

  export let qwertyLabel: string;
  export let jamoLabel: string;
  export let jamoShiftLabel: string | undefined = undefined;
  export let type: JamoType;
  
  export let isActive: boolean = false;
  export let isExpected: boolean = false;
  export let isShiftActive: boolean = false;
  export let showHints: boolean = true;
  export let isErrorActive: boolean = false;
  export let onKeyPress: (key: string) => void = () => {};

  $: primaryColor = type === 'consonant' ? 'text-korea-blue dark:text-blue-400' : 'text-korea-red dark:text-red-400';
  $: secondaryColor = 'text-text-muted opacity-50';
</script>

<div 
  role="button"
  tabindex="-1"
  on:pointerdown={(e) => { e.preventDefault(); onKeyPress(qwertyLabel); }}
  class="relative flex flex-col justify-between p-1 sm:p-2 rounded-lg border-2 shadow-sm transition-all duration-75 select-none cursor-pointer w-[8vw] max-w-[3rem] sm:max-w-none sm:w-12 md:w-16 aspect-[4/5] sm:aspect-square active:scale-90 overflow-hidden
    {isErrorActive ? 'bg-red-50 dark:bg-red-900/40 border-korea-red scale-95 animate-pulse' :
     isActive ? 'bg-blue-50/50 dark:bg-blue-900/30 border-korea-blue scale-95' : 'bg-surface-card border-border-base'}
    {isExpected && showHints ? 'ring-2 ring-korea-red ring-offset-2 dark:ring-offset-slate-900' : ''}
  "
>
  <div class="flex justify-between items-start w-full leading-none mt-0.5">
    <span class="text-[9px] sm:text-xs font-semibold text-text-muted uppercase leading-none">{qwertyLabel}</span>
    {#if jamoShiftLabel}
      <span class="text-[10px] sm:text-sm font-bold transition-all duration-200 origin-top-right leading-none {isShiftActive ? primaryColor + ' scale-110 sm:scale-125' : secondaryColor}">
        {jamoShiftLabel}
      </span>
    {/if}
  </div>
  
  <span class="text-sm sm:text-lg font-black self-end transition-all duration-200 origin-bottom-right leading-none mb-0.5 {isShiftActive && jamoShiftLabel ? secondaryColor + ' scale-75' : primaryColor + ' scale-100 sm:scale-110'}">
    {jamoLabel}
  </span>
</div>
