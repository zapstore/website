<script>
	export let data;
	import { formatDisplayDate } from "$lib/date.js";
	import { ArrowRight } from "lucide-svelte";
</script>

<svelte:head>
	<title>Blog — Zapstore</title>
	<meta name="description" content="Latest news, updates and insights from the Zapstore team." />
</svelte:head>

<header class="mb-16">
	<h1 class="text-display-lg text-4xl sm:text-5xl mb-4">Blog</h1>
	<p class="text-lg text-muted-foreground">
		Latest news, updates and insights from the Zapstore team.
	</p>
</header>

<div class="space-y-12">
	{#each data.posts as post, i}
		<article class="group">
			<a href="/blog/{post.path}" class="block">
				<div class="flex flex-col gap-3">
					<!-- Meta -->
					<div class="flex items-center gap-3 text-sm text-muted-foreground">
						{#if post.meta.date}
							<time datetime={post.meta.date}>
								{formatDisplayDate(post.meta.date)}
							</time>
						{/if}
						{#if post.meta.draft}
							<span class="px-2 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full text-xs font-medium">
								Draft
							</span>
						{/if}
						{#if post.meta.category}
							<span class="px-2 py-0.5 bg-primary/10 text-primary border border-primary/20 rounded-full text-xs">
								{post.meta.category}
							</span>
						{/if}
					</div>
					
					<!-- Title -->
					<h2 class="text-2xl font-semibold text-foreground group-hover:text-primary transition-colors">
						{post.meta.title}
					</h2>
					
					<!-- Description -->
					{#if post.meta.description}
						<p class="text-muted-foreground leading-relaxed">
							{post.meta.description}
						</p>
					{/if}
					
					<!-- Read more -->
					<span class="inline-flex items-center text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors">
						Read article
						<ArrowRight class="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
					</span>
				</div>
			</a>
			
			{#if i < data.posts.length - 1}
				<div class="mt-12 border-b border-border/50"></div>
			{/if}
		</article>
	{/each}
</div>
