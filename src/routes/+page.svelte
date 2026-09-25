<script lang="ts">
  import * as m from '$lib/paraglide/messages.js';
</script>

<svelte:head>
  <title>Hangeul Type Lab</title>
</svelte:head>

<div class="grow flex flex-col items-center justify-center text-center space-y-12 max-w-4xl mx-auto py-20 px-4">
  
  <!-- Hero Section -->
  <div class="space-y-6">
    <h1 class="text-5xl font-black tracking-tight sm:text-7xl">
      <span class="block text-text-main">{m.landing_title_1()}</span>
      <span class="block text-korea-blue dark:text-blue-500 mt-2">{m.landing_title_2()}</span>
      <span class="block text-korea-red dark:text-red-500 mt-2">{m.landing_title_3()}</span>
    </h1>
    
    <p class="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed mt-6">
      {m.landing_subtitle()}
    </p>
  </div>
  
  <!-- Call to Actions -->
  <div class="flex flex-col sm:flex-row justify-center gap-4 pt-4 w-full sm:w-auto">
    <a href="/learn" class="px-8 py-4 rounded-xl bg-korea-blue text-white font-bold text-lg hover:bg-blue-700 hover:scale-105 transition-all shadow-md">
      {m.landing_btn_learn()}
    </a>
    <a href="/practice" class="px-8 py-4 rounded-xl border-2 border-korea-red text-korea-red dark:text-red-400 dark:border-red-500 font-bold text-lg hover:bg-red-50 dark:hover:bg-red-950 hover:scale-105 transition-all">
      {m.landing_btn_practice()}
    </a>
  </div>

  <!-- Features Grid -->
  <div class="grid md:grid-cols-3 gap-8 pt-16 w-full text-left">
    <div class="p-6 bg-surface-card rounded-2xl border border-border-light shadow-sm hover:shadow-md transition-shadow">
      <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-korea-blue rounded-xl flex items-center justify-center mb-4">
        <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
      </div>
      <h3 class="text-xl font-bold text-text-main mb-2">{m.feature_1_title()}</h3>
      <p class="text-gray-600 dark:text-gray-400">{m.feature_1_desc()}</p>
    </div>

    <div class="p-6 bg-surface-card rounded-2xl border border-border-light shadow-sm hover:shadow-md transition-shadow">
      <div class="w-12 h-12 bg-red-100 dark:bg-red-900/30 text-korea-red rounded-xl flex items-center justify-center mb-4">
        <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
      </div>
      <h3 class="text-xl font-bold text-text-main mb-2">{m.feature_2_title()}</h3>
      <p class="text-gray-600 dark:text-gray-400">{m.feature_2_desc()}</p>
    </div>

    <div class="p-6 bg-surface-card rounded-2xl border border-border-light shadow-sm hover:shadow-md transition-shadow">
      <div class="w-12 h-12 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl flex items-center justify-center mb-4">
        <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
      </div>
      <h3 class="text-xl font-bold text-text-main mb-2">{m.feature_3_title()}</h3>
      <p class="text-gray-600 dark:text-gray-400">{m.feature_3_desc()}</p>
    </div>
  </div>
</div>
