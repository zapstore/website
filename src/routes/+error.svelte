<script>
	import { page } from '$app/stores';
</script>

<svelte:head>
	<title>{$page.status} | zapstore</title>
</svelte:head>

<div class="min-h-[70vh] flex items-center justify-center px-6">
	<div class="text-center max-w-md">
		<!-- Error code -->
		<div class="mb-6">
			<span class="text-[8rem] sm:text-[10rem] font-display font-semibold leading-none tracking-tight text-muted-foreground/30">
				{$page.status}
			</span>
		</div>
		
		<!-- Error message -->
		<h1 class="text-2xl font-display font-semibold mb-3 text-foreground">
			{#if $page.status === 404}
				Page not found
			{:else if $page.status >= 500}
				Something went wrong
			{:else}
				An error occurred
			{/if}
		</h1>
		
		<p class="text-muted-foreground mb-8 text-lg">
			{#if $page.status === 404}
				The page you're looking for doesn't exist or has been moved.
			{:else if $page.status >= 500}
				We're having trouble on our end. Please try again later.
			{:else if $page.error?.message}
				{$page.error.message}
			{:else}
				Something unexpected happened.
			{/if}
		</p>
		
		<!-- Action buttons -->
		<div class="flex flex-col sm:flex-row gap-3 justify-center">
			<a href="/" class="btn-primary gap-2">
				<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
					<polyline points="9 22 9 12 15 12 15 22"/>
				</svg>
				Go home
			</a>
			<button onclick={() => history.back()} class="btn-secondary gap-2">
				<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<path d="m12 19-7-7 7-7"/>
					<path d="M19 12H5"/>
				</svg>
				Go back
			</button>
		</div>
	</div>
</div>

