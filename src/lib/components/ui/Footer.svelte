<script lang="ts">
  import * as m from '$lib/paraglide/messages.js';
  
  const currentYear = new Date().getFullYear().toString();
  const currentVersion = "1.0.0";
</script>

<footer class="border-t border-border-base mt-auto py-8 transition-colors bg-surface-card">
  <div class="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
    <p class="text-sm text-text-muted font-medium">
      {m.footer_copyright({ year: currentYear })}
    </p>
    <div class="flex items-center gap-6 text-sm text-text-muted font-medium">
      <a href="https://github.com/JvMeraki/korean-app" target="_blank" rel="noopener noreferrer" class="hover:text-korea-blue transition-colors">{m.footer_repo()}</a>
      <span class="px-2 py-1 bg-surface-alt rounded-md text-xs border border-border-light">{m.footer_version({ version: currentVersion })}</span>
    </div>
  </div>
</footer>
