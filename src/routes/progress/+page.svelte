<script lang="ts">
  import { onMount } from 'svelte';
  import { db, type PracticeResult } from '@domain/database/db';
  import { korean2SetMap } from '@domain/keyboard/layout';
  import * as m from '$lib/paraglide/messages.js';

  let sessions: PracticeResult[] = [];
  let totalSessions = 0;
  let avgCpm = 0;
  let avgAccuracy = 0;
  
  // Heatmap data
  let totalMisses: Record<string, number> = {};
  let maxMisses = 1;

  onMount(async () => {
    sessions = await db.sessions.toArray();
    
    if (sessions.length > 0) {
      totalSessions = sessions.length;
      avgCpm = Math.round(sessions.reduce((acc, s) => acc + s.cpm, 0) / totalSessions);
      avgAccuracy = Math.round(sessions.reduce((acc, s) => acc + s.accuracy, 0) / totalSessions);

      // Aggregating missed keys
      for (const s of sessions) {
        for (const [key, count] of Object.entries(s.missedKeys)) {
          // Normalize to lowercase for mapping
          const normalizedKey = key.toLowerCase();
          totalMisses[normalizedKey] = (totalMisses[normalizedKey] || 0) + count;
        }
      }
      
      const counts = Object.values(totalMisses);
      if (counts.length > 0) {
        maxMisses = Math.max(...counts);
      }
    }
  });

  const keyboardRows = [
    ['q','w','e','r','t','y','u','i','o','p'],
    ['a','s','d','f','g','h','j','k','l'],
    ['z','x','c','v','b','n','m']
  ];

  function getKeyBgColor(key: string) {
    const misses = totalMisses[key] || 0;
    if (misses === 0) return 'bg-surface-card text-gray-500 border-border-base';
    
    const ratio = misses / maxMisses;
    // Map ratio to softer tailwind colors
    if (ratio < 0.33) return 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-400 border-yellow-200 dark:border-yellow-700';
    if (ratio < 0.66) return 'bg-orange-200 dark:bg-orange-900/60 text-orange-900 dark:text-orange-300 border-orange-300 dark:border-orange-600';
    // Soft red instead of aggressive opaque red
    return 'bg-red-200 dark:bg-red-900/60 text-red-900 dark:text-red-300 border-red-300 dark:border-red-800 font-bold shadow-sm';
  }

  async function clearData() {
    if (confirm(m.progress_reset_confirm())) {
      await db.sessions.clear();
      sessions = [];
      totalSessions = 0;
      avgCpm = 0;
      avgAccuracy = 0;
      totalMisses = {};
      maxMisses = 1;
    }
  }
</script>

<div class="max-w-4xl mx-auto w-full px-4 py-8 animate-in fade-in duration-500">
  <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
    <h1 class="text-3xl font-black text-text-main">{m.progress_title()}</h1>
    {#if sessions.length > 0}
      <button on:click={clearData} class="px-4 py-2 bg-surface-card border border-border-base text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 text-sm font-bold rounded-lg transition-colors shadow-sm">
        {m.progress_reset_data()}
      </button>
    {/if}
  </div>

  {#if sessions.length === 0}
    <div class="bg-surface-alt rounded-2xl p-12 text-center border border-border-base">
      <p class="text-text-muted text-lg">{m.progress_no_data()}</p>
      <a href="/practice" class="inline-block mt-6 px-6 py-3 bg-korea-blue text-white rounded-xl font-bold hover:bg-blue-700 transition-colors">
        {m.nav_practice()}
      </a>
    </div>
  {:else}
    <!-- Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
      <div class="bg-surface-card p-6 rounded-3xl shadow-sm border border-border-light flex flex-col justify-center items-center text-center">
        <p class="text-sm text-gray-500 uppercase tracking-widest font-bold mb-2">{m.progress_total_sessions()}</p>
        <p class="text-4xl font-black text-text-main">{totalSessions}</p>
      </div>
      <div class="bg-surface-card p-6 rounded-3xl shadow-sm border border-border-light flex flex-col justify-center items-center text-center">
        <p class="text-sm text-gray-500 uppercase tracking-widest font-bold mb-2">{m.progress_avg_cpm()}</p>
        <p class="text-4xl font-black text-text-main">{avgCpm}</p>
      </div>
      <div class="bg-surface-card p-6 rounded-3xl shadow-sm border border-border-light flex flex-col justify-center items-center text-center">
        <p class="text-sm text-gray-500 uppercase tracking-widest font-bold mb-2">{m.progress_avg_accuracy()}</p>
        <p class="text-4xl font-black text-text-main">{avgAccuracy}%</p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      
      <!-- Recent Performance Chart (Pure CSS) -->
      <div class="bg-surface-card p-8 rounded-3xl shadow-sm border border-border-light flex flex-col">
        <h2 class="text-xl font-bold text-text-main mb-6">{m.progress_recent_performance()}</h2>
        <div class="grow flex flex-col justify-end">
          <div class="h-48 flex items-end justify-between gap-3 border-b border-border-base pb-2">
            {#each sessions.slice(-15) as s}
              <div class="w-full flex flex-col items-center gap-2 group relative h-full justify-end">
                <div class="absolute -top-10 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10 font-bold">
                  {s.cpm} CPM
                </div>
                <div 
                  class="w-full bg-korea-blue/80 hover:bg-korea-blue rounded-t-sm transition-all duration-500" 
                  style="height: {Math.max((s.cpm / Math.max(...sessions.map(x => x.cpm))) * 100, 2)}%"
                ></div>
              </div>
            {/each}
          </div>
          <div class="flex justify-center mt-4">
            <p class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-widest font-bold">{m.practice_cpm()}</p>
          </div>
        </div>
      </div>

      <!-- Heatmap -->
      <div class="bg-surface-card p-8 rounded-3xl shadow-sm border border-border-light">
        <h2 class="text-xl font-bold text-text-main mb-2">{m.progress_heatmap_title()}</h2>
        <p class="text-sm text-text-muted mb-8 h-10">{m.progress_heatmap_desc()}</p>
        
        <div class="flex flex-col gap-2 items-center">
          {#each keyboardRows as row}
            <div class="flex gap-2 justify-center w-full">
              {#each row as key}
                <div class="flex flex-col justify-between p-1.5 sm:p-2 rounded-lg border transition-colors select-none w-10 h-12 sm:w-12 sm:h-14 {getKeyBgColor(key)}">
                  <span class="text-[10px] font-semibold opacity-70 uppercase leading-none">{key}</span>
                  <span class="text-sm sm:text-base font-bold self-end leading-none">{korean2SetMap[key]?.jamoBase || key.toUpperCase()}</span>
                </div>
              {/each}
            </div>
          {/each}
        </div>
        
        <!-- Legend -->
        <div class="flex items-center justify-center gap-4 mt-8 text-xs font-bold text-gray-500 uppercase tracking-widest">
          <span>{m.progress_heatmap_legend_good()}</span>
          <div class="flex gap-1">
            <div class="w-4 h-4 rounded-sm bg-surface-card border border-border-base"></div>
            <div class="w-4 h-4 rounded-sm bg-yellow-100 border border-yellow-200 dark:bg-yellow-900/40 dark:border-yellow-700"></div>
            <div class="w-4 h-4 rounded-sm bg-orange-200 border border-orange-300 dark:bg-orange-900/60 dark:border-orange-600"></div>
            <div class="w-4 h-4 rounded-sm bg-red-200 border border-red-300 dark:bg-red-900/60 dark:border-red-800"></div>
          </div>
          <span>{m.progress_heatmap_legend_weak()}</span>
        </div>
      </div>
    </div>
  {/if}
</div>
