<script>
	export let data;
	import { formatDisplayDate } from "$lib/date.js";

	$: title = data.metadata?.title || "Blog Post";
	$: description = data.metadata?.description || "";
	$: author = data.metadata?.author || "Zapstore";
	$: date = data.metadata?.date || "";
	$: draft = data.metadata?.draft || false;
</script>

<svelte:head>
	<title>{title} — Zapstore Blog</title>
	<meta name="description" content={description} />
	<meta name="author" content={author} />
	{#if date}
		<meta name="article:published_time" content={date} />
	{/if}
</svelte:head>

<article>
	<!-- Article header -->
	<header class="mb-12">
		<div class="flex items-center gap-3 text-sm text-muted-foreground mb-4">
			{#if date}
				<time datetime={date}>{formatDisplayDate(date)}</time>
			{/if}
			{#if draft}
				<span class="px-2 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full text-xs font-medium">
					Draft
				</span>
			{/if}
		</div>
		<h1 class="text-display-lg text-3xl sm:text-4xl lg:text-5xl mb-4">{title}</h1>
		{#if description}
			<p class="text-lg text-muted-foreground">{description}</p>
		{/if}
	</header>

	<!-- Article content -->
	<div class="prose">
		<svelte:component this={data.content} />
	</div>
</article>
