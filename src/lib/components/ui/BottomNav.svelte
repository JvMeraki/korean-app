<script lang="ts">
  import { page } from '$app/stores';
  import * as m from '$lib/paraglide/messages.js';
</script>

<nav class="fixed bottom-0 left-0 w-full bg-surface-card border-t border-border-base sm:hidden z-50 flex justify-around items-center h-16 pb-safe">
  <a href="/learn" class="flex flex-col items-center justify-center w-full h-full gap-1 {$page.url.pathname.startsWith('/learn') ? 'text-korea-blue dark:text-blue-400' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}">
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
    <span class="text-[10px] font-bold uppercase tracking-widest">{m.nav_learn()}</span>
  </a>

  <a href="/practice" class="flex flex-col items-center justify-center w-full h-full gap-1 {$page.url.pathname.startsWith('/practice') ? 'text-korea-red dark:text-red-400' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}">
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4 Z"/></svg>
    <span class="text-[10px] font-bold uppercase tracking-widest">{m.nav_practice()}</span>
  </a>

  <a href="/progress" class="flex flex-col items-center justify-center w-full h-full gap-1 {$page.url.pathname.startsWith('/progress') ? 'text-korea-blue dark:text-blue-400' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}">
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
    <span class="text-[10px] font-bold uppercase tracking-widest">{m.nav_progress()}</span>
  </a>
</nav>
