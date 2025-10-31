<script>
	import '../app.css';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import NavigationProgress from '$lib/components/NavigationProgress.svelte';
	
	// Fonts are now loaded directly from static/fonts with preload hints
	// See app.css for font-face declarations and app.html for preload links
</script>

<NavigationProgress />

<div class="min-h-screen relative">
	<div class="absolute inset-0 bg-svg-gradient"></div>
	<div class="absolute inset-0 bg-dither pointer-events-none mix-blend-overlay opacity-60"></div>
	<div class="relative z-10 flex flex-col min-h-screen">
		<Header />
		<main class="flex-1">
			<slot />
		</main>
		<Footer />
	</div>
</div> 