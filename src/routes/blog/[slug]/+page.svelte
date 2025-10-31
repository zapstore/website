<script>
	export let data;
	import { formatDisplayDate } from "$lib/date.js";

	// Extract metadata
	$: title = data.metadata?.title || "Blog Post";
	$: description = data.metadata?.description || "";
	$: author = data.metadata?.author || "Zapstore";
	$: date = data.metadata?.date || "";
	$: readTime = data.metadata?.readTime || "5 min read";
</script>

<svelte:head>
	<title>{title} - Zapstore Blog</title>
	<meta name="description" content={description} />
	<meta name="author" content={author} />
	{#if date}
		<meta name="article:published_time" content={date} />
	{/if}
</svelte:head>

<article class="prose prose-slate dark:prose-invert prose-lg max-w-none">
	<!-- Article header -->
	<header class="mb-8 not-prose">
		<h1 class="text-4xl font-bold tracking-tight mb-4">{title}</h1>
		<div class="flex items-center gap-4 text-muted-foreground text-sm">
			{#if date}
				<time datetime={date}>{formatDisplayDate(date)}</time>
			{/if}
		</div>
	</header>

	<!-- Article content -->
	<div class="prose-content">
		<svelte:component this={data.content} />
	</div>
</article>
