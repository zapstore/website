<script>
	export let icon;
	export let title;
	export let description;
</script>

<div class="group relative rounded-lg border border-border bg-card p-6 transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5">
	<div class="mb-4">
		<div class="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
			<svelte:component this={icon} class="h-6 w-6" />
		</div>
	</div>
	<h3 class="mb-2 text-lg font-semibold">{title}</h3>
	<p class="text-sm text-muted-foreground">{description}</p>
</div> 