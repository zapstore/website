<script>
	import DocsNavigation from '$lib/components/DocsNavigation.svelte';
	import { page } from '$app/stores';

	export let data;

	let mobileMenuOpen = false;

	function toggleMobileMenu() {
		mobileMenuOpen = !mobileMenuOpen;
	}
</script>

<!-- Add top spacing to account for fixed header -->
<div class="pt-16">
	<div class="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
		<!-- Mobile menu toggle button (removed for testing) -->
		
		<div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
			<!-- Navigation -->
			<div class="lg:col-span-1">
				{#if data.navigation && data.navigation.length > 0}
					<DocsNavigation
						navigation={data.navigation}
						{mobileMenuOpen}
						{toggleMobileMenu}
					/>
				{:else}
					<div class="p-6 text-muted-foreground">
						Loading navigation...
					</div>
				{/if}
			</div>
			
			<!-- Content -->
			<main class="lg:col-span-3 lg:pl-8">
				<slot />
			</main>
		</div>
	</div>
</div>

<style>
	:global(.prose .heading-link) {
		text-decoration: none;
		color: inherit;
	}

	:global(.prose .heading-link:hover) {
		text-decoration: none;
	}

	/* Force headings to not be clickable links */
	:global(.prose :is(h1,h2,h3,h4,h5,h6) a) {
		text-decoration: none;
		color: inherit;
		pointer-events: none;
	}

	:global(.prose :is(h1,h2,h3,h4,h5,h6) a:hover) {
		text-decoration: none;
	}
</style>
