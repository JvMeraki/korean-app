<script lang="ts">
  import { onMount } from 'svelte';
  import { availableLanguageTags } from '$lib/paraglide/runtime.js';
  import * as m from '$lib/paraglide/messages.js';
  import { currentLang, changeLanguage } from '@stores/lang';
  import { page } from '$app/stores';

  let isDarkMode = false;

  if (typeof window !== 'undefined') {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      isDarkMode = true;
      document.documentElement.classList.add('dark');
    } else {
      isDarkMode = false;
      document.documentElement.classList.remove('dark');
    }
  }

  function toggleTheme() {
    isDarkMode = !isDarkMode;
    
    document.documentElement.classList.add('theme-transition');
    
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
    
    setTimeout(() => {
      document.documentElement.classList.remove('theme-transition');
    }, 500);
  }
</script>

<header class="sticky top-0 z-50 w-full border-b border-border-base bg-surface-card/80 backdrop-blur-md transition-colors">
  <div class="flex h-16 items-center justify-between px-4 w-full max-w-6xl mx-auto">
    <!-- Logo -->
    <a href="/" class="flex items-center gap-1 group">
      <span class="text-xl font-black tracking-tight transition-transform group-hover:scale-105">
        <span class="text-korea-blue">Hangeul</span><span class="text-korea-red">Type</span><span class="text-text-main">Lab</span>
      </span>
    </a>

    <!-- Navigation -->
    <nav class="hidden md:flex items-center gap-8 text-sm font-bold">
      <a href="/learn" class="relative uppercase tracking-widest transition-colors {$page.url.pathname.startsWith('/learn') ? 'text-korea-blue dark:text-blue-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}">
        {m.nav_learn()}
        {#if $page.url.pathname.startsWith('/learn')}
          <span class="absolute -bottom-2 left-0 w-full h-0.5 bg-korea-blue dark:bg-blue-400 rounded-full"></span>
        {/if}
      </a>
      
      <a href="/practice" class="relative uppercase tracking-widest transition-colors {$page.url.pathname.startsWith('/practice') ? 'text-korea-red dark:text-red-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}">
        {m.nav_practice()}
        {#if $page.url.pathname.startsWith('/practice')}
          <span class="absolute -bottom-2 left-0 w-full h-0.5 bg-korea-red dark:bg-red-400 rounded-full"></span>
        {/if}
      </a>
      
      <a href="/progress" class="relative uppercase tracking-widest transition-colors {$page.url.pathname.startsWith('/progress') ? 'text-korea-blue dark:text-blue-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}">
        {m.nav_progress()}
        {#if $page.url.pathname.startsWith('/progress')}
          <span class="absolute -bottom-2 left-0 w-full h-0.5 bg-korea-blue dark:bg-blue-400 rounded-full"></span>
        {/if}
      </a>
    </nav>

    <!-- Controls -->
    <div class="flex items-center gap-6">
      <!-- Language Pills -->
      <div class="flex items-center bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
        {#each availableLanguageTags as tag}
          <button 
            on:click={() => changeLanguage(tag)}
            class="px-3 py-1 text-xs font-bold rounded-md uppercase transition-all duration-200 { $currentLang === tag ? 'bg-white dark:bg-slate-600 text-text-main shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200' }"
          >
            {tag}
          </button>
        {/each}
      </div>

      <!-- Theme Toggle -->
      <button on:click={toggleTheme} class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-300" aria-label="Toggle theme">
        {#if isDarkMode}
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
        {:else}
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
        {/if}
      </button>
    </div>
  </div>
</header>
