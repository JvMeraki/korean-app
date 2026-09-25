<script lang="ts">
  import '../app.css';
  import Navbar from '@ui/Navbar.svelte';
  import Footer from '@ui/Footer.svelte';
  import { currentLang } from '@stores/lang';
</script>

<svelte:head>
  <title>Hangeul Type Lab</title>
  <meta name="description" content="A portfolio-grade Frontend application for practicing Korean typing while learning Hangul and the 2-Set keyboard layout." />
  <meta name="keywords" content="Korean, Hangul, Typing, Keyboard, 2-Set, Learn Korean, Typing Practice" />
  <meta name="author" content="Frontend Engineer" />
  
  <!-- Open Graph / Social -->
  <meta property="og:title" content="Hangeul Type Lab" />
  <meta property="og:description" content="Master the Korean 2-Set keyboard layout through interactive typing practice." />
  <meta property="og:type" content="website" />
</svelte:head>

{#key $currentLang}
<div class="min-h-screen flex flex-col bg-surface-bg transition-colors duration-300">
  <Navbar />

  <main class="grow flex flex-col w-full mx-auto">
    <slot />
  </main>

  <Footer />
</div>
{/key}
