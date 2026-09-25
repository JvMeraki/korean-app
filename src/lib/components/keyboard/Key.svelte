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

  $: primaryColor = type === 'consonant' ? 'text-korea-blue dark:text-blue-400' : 'text-korea-red dark:text-red-400';
  $: secondaryColor = 'text-text-muted opacity-50';
</script>

<div 
  class="relative flex flex-col justify-between p-2 rounded-lg border-2 shadow-sm transition-all duration-75 select-none w-12 h-14 sm:w-16 sm:h-16
    {isErrorActive ? 'bg-red-50 dark:bg-red-900/40 border-korea-red scale-95 animate-pulse' :
     isActive ? 'bg-blue-50/50 dark:bg-blue-900/30 border-korea-blue scale-95' : 'bg-surface-card border-border-base'}
    {isExpected && showHints ? 'ring-2 ring-korea-red ring-offset-2 dark:ring-offset-slate-900' : ''}
  "
>
  <div class="flex justify-between items-start w-full">
    <span class="text-xs font-semibold text-text-muted uppercase">{qwertyLabel}</span>
    {#if jamoShiftLabel}
      <span class="text-sm font-bold transition-all duration-200 origin-top-right {isShiftActive ? primaryColor + ' scale-125' : secondaryColor}">
        {jamoShiftLabel}
      </span>
    {/if}
  </div>
  
  <span class="text-lg font-black self-end transition-all duration-200 origin-bottom-right {isShiftActive && jamoShiftLabel ? secondaryColor + ' scale-75' : primaryColor + ' scale-110'}">
    {jamoLabel}
  </span>
</div>
