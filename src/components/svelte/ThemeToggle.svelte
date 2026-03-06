<script lang="ts">
  type Theme = 'light' | 'dark' | 'system';
  let theme = $state<Theme>('system');

  $effect(() => {
    const stored = localStorage.getItem('theme') as Theme | null;
    if (stored === 'light' || stored === 'dark') {
      theme = stored;
    }
    applyTheme();

    // Listen for system preference changes
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => {
      if (theme === 'system') applyTheme();
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  });

  function applyTheme() {
    const isDark =
      theme === 'dark' ||
      (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  }

  function cycle() {
    const order: Theme[] = ['light', 'dark', 'system'];
    const idx = order.indexOf(theme);
    theme = order[(idx + 1) % order.length];
    if (theme === 'system') {
      localStorage.removeItem('theme');
    } else {
      localStorage.setItem('theme', theme);
    }
    applyTheme();
  }
</script>

<button
  onclick={cycle}
  class="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
  aria-label="Toggle theme ({theme})"
  title="Theme: {theme}"
>
  {#if theme === 'light'}
    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  {:else if theme === 'dark'}
    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
  {:else}
    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  {/if}
</button>
