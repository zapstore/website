<script>
	export let data;
	
	// Extract title from metadata or use default
	$: title = data.metadata?.title || 'Documentation';
	$: description = data.metadata?.description || 'Zapstore documentation';
</script>

<svelte:head>
	<title>{title} - Zapstore Documentation</title>
	<meta name="description" content={description} />
</svelte:head>

<article class="prose prose-slate dark:prose-invert max-w-none">
	{#if data.metadata?.title}
		<h1>{data.metadata.title}</h1>
	{/if}
	<svelte:component this={data.content} />
</article>
