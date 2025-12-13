<script>
	import DocsNavigation from '$lib/components/DocsNavigation.svelte';
	import { page } from '$app/stores';
	import { Menu, X } from 'lucide-svelte';

	export let data;

	let mobileMenuOpen = false;

	function toggleMobileMenu() {
		mobileMenuOpen = !mobileMenuOpen;
	}
</script>

<div class="py-12 lg:py-16">
	<div class="container mx-auto px-4 sm:px-6 lg:px-8">
		<!-- Mobile menu toggle -->
		<button
			type="button"
			class="lg:hidden flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 -ml-1 px-3 py-2 rounded-lg hover:bg-card transition-colors"
			on:click={toggleMobileMenu}
		>
			{#if mobileMenuOpen}
				<X class="h-4 w-4" />
				<span>Close menu</span>
			{:else}
				<Menu class="h-4 w-4" />
				<span>Documentation menu</span>
			{/if}
		</button>
		
		<div class="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-8 lg:gap-12">
			<!-- Navigation -->
			<div class="lg:col-span-1">
				{#if data.navigation && data.navigation.length > 0}
					<DocsNavigation
						navigation={data.navigation}
						{mobileMenuOpen}
						{toggleMobileMenu}
					/>
				{:else}
					<div class="p-4 text-muted-foreground text-sm">
						Loading navigation...
					</div>
				{/if}
			</div>
			
			<!-- Content -->
			<main class="lg:col-span-1 min-w-0">
				<div class="prose max-w-none w-[90%]">
					<slot />
				</div>
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

	:global(.prose :is(h1,h2,h3,h4,h5,h6) a) {
		text-decoration: none;
		color: inherit;
		pointer-events: none;
	}

	:global(.prose :is(h1,h2,h3,h4,h5,h6) a:hover) {
		text-decoration: none;
	}
</style>
