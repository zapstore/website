<script>
	import { onMount } from "svelte";
	import {
		Package,
		Download,
		ExternalLink,
		User,
		Calendar,
		Globe,
		Star,
		ArrowLeft,
		Tag,
		Github,
		Code,
		PackagePlus,
	} from "lucide-svelte";
	import {
		formatDate,
		fetchLatestReleaseForApp,
	} from "$lib/nostr.js";
	import ProfileInfo from "$lib/components/ProfileInfo.svelte";

	// Receive server-rendered data
	export let data;
	
	let app = data.app;
	let loading = data.loading;
	let error = data.error;
	let latestRelease = null;
	let loadingRelease = false;

	// Fetch latest release client-side (this is dynamic/supplementary data)
	onMount(async () => {
		if (app) {
			loadingRelease = true;
			try {
				latestRelease = await fetchLatestReleaseForApp(app);
			} catch (e) {
				console.warn("Failed to load latest release:", e);
				latestRelease = null;
			} finally {
				loadingRelease = false;
			}
		}
	});

	// Keep the retry function for the error state
	async function retryLoad() {
		// Reload the page to trigger server fetch again
		window.location.reload();
	}

	// Build Android Intent URL for opening in app with fallback
	function getIntentUrl(slug) {
		// Android Intent URL format
		// If app is installed: opens the app
		// If not installed: uses browser_fallback_url to redirect to download
		return `intent://zapstore.dev/apps/${slug}#Intent;scheme=https;package=dev.zapstore.app;S.browser_fallback_url=https%3A%2F%2Fzapstore.dev%2Fdownload;end`;
	}
</script>

<svelte:head>
	{#if app}
		<title>{app.name} - Zapstore</title>
		<meta name="description" content={app.description} />
		{#if app.icon}
			<meta property="og:image" content={app.icon} />
		{/if}
	{:else}
		<title>App Details - Zapstore</title>
	{/if}
</svelte:head>

{#if loading}
	<div class="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
		<div class="flex items-center justify-center py-24">
			<div class="text-center">
				<div
					class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"
				></div>
				<p class="text-muted-foreground">Loading app details...</p>
			</div>
		</div>
	</div>
{:else if error}
	<div class="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
		<div class="flex items-center justify-center py-24">
			<div class="text-center">
				<div
					class="rounded-lg bg-destructive/10 border border-destructive/20 p-6 max-w-md"
				>
					<Package class="h-16 w-16 text-destructive mx-auto mb-4" />
					<h3 class="text-lg font-semibold text-destructive mb-2">
						App Not Found
					</h3>
					<p class="text-muted-foreground mb-4">{error}</p>
					<div class="space-y-2">
						<button
							on:click={retryLoad}
							class="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 w-full"
						>
							Try Again
						</button>
						<a
							href="/apps"
							class="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground w-full"
						>
							<ArrowLeft class="h-4 w-4 mr-2" />
							Back to apps
						</a>
					</div>
				</div>
			</div>
		</div>
	</div>
{:else if app}
	<div class="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
		<!-- Breadcrumb -->
		<div class="mb-8">
			<a
				href="/apps"
				class="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
			>
				<ArrowLeft class="h-4 w-4 mr-1" />
				Back to apps
			</a>
		</div>

		<!-- App Header -->
		<div class="bg-card border border-border rounded-lg p-8 mb-8">
			<!-- App Icon and Name -->
			<div class="flex items-center gap-6 mb-6">
				{#if app.icon}
					<img
						src={app.icon}
						alt={app.name}
						class="w-24 h-24 lg:w-32 lg:h-32 rounded-xl object-cover flex-shrink-0"
					/>
				{:else}
					<div
						class="w-24 h-24 lg:w-32 lg:h-32 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0"
					>
						<Package class="h-12 w-12 lg:h-16 lg:w-16 text-primary" />
					</div>
				{/if}
				<div class="min-w-0 flex-1 flex items-center">
					<h1 class="text-3xl lg:text-4xl font-black">{app.name}</h1>
				</div>
			</div>

			<!-- Publisher Profile -->
			<div class="mb-6">
				<ProfileInfo pubkey={app.pubkey} npub={app.npub} size="lg" />
			</div>

			<!-- Description -->
			<div
				class="text-muted-foreground mb-6 leading-relaxed prose prose-invert max-w-none"
			>
				{@html app.descriptionHtml}
			</div>

			<!-- App Meta -->
			<div class="flex flex-wrap gap-4 text-sm text-muted-foreground mb-6">
				{#if app.version}
					<div class="flex items-center gap-1">
						<Tag class="h-4 w-4" />
						<span>Version {app.version}</span>
					</div>
				{/if}

				{#if app.category}
					<div class="flex items-center gap-1">
						<Tag class="h-4 w-4" />
						<span>{app.category}</span>
					</div>
				{/if}
				<div class="flex items-center gap-1">
					<Calendar class="h-4 w-4" />
					<span>Updated {formatDate(app.createdAt)}</span>
				</div>
			</div>

			<!-- Action Buttons -->
			<div class="flex flex-col sm:flex-row gap-3">
				<a
					href={getIntentUrl(data.slug)}
					class="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 font-medium text-primary-foreground shadow transition-all hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25"
				>
					<PackagePlus class="h-4 w-4 mr-2" />
					Open in Zapstore
				</a>
				{#if app.url}
					<a
						href={app.url}
						target="_blank"
						rel="noopener noreferrer"
						class="inline-flex items-center justify-center rounded-md border border-input bg-background px-6 py-3 font-medium shadow-sm transition-all hover:bg-accent hover:text-accent-foreground hover:shadow-md"
					>
						<Globe class="h-4 w-4 mr-2" />
						Website
					</a>
				{/if}
				{#if app.repository}
					<a
						href={app.repository}
						target="_blank"
						rel="noopener noreferrer"
						class="inline-flex items-center justify-center rounded-md border border-input bg-background px-6 py-3 font-medium shadow-sm transition-all hover:bg-accent hover:text-accent-foreground hover:shadow-md"
					>
						{#if app.repository.includes("github.com")}
							<Github class="h-4 w-4 mr-2" />
						{:else}
							<Code class="h-4 w-4 mr-2" />
						{/if}
						Source Code
					</a>
				{/if}
			</div>
		</div>

		<!-- App Images -->
		{#if app.images && app.images.length > 0}
			<div class="mb-8">
				<h2 class="text-2xl font-bold mb-4">Screenshots</h2>
				<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
					{#each app.images as image, index}
						<div class="relative overflow-hidden rounded-lg bg-muted">
							<img
								src={image}
								alt="Screenshot {index + 1}"
								class="w-full h-64 object-cover hover:scale-105 transition-transform duration-200"
								loading="lazy"
							/>
						</div>
					{/each}
				</div>
			</div>
		{/if}

		<!-- App Details Sections -->
		<div class="space-y-8">
			<!-- Latest Release Notes -->
			{#if loadingRelease}
				<div class="bg-card border border-border rounded-lg p-6">
					<h2 class="text-xl font-bold mb-2">Latest Release</h2>
					<p class="text-muted-foreground">Loading release notes...</p>
				</div>
			{:else if latestRelease}
				<div class="bg-card border border-border rounded-lg p-6">
					<div class="flex items-center justify-between mb-2">
						<h2 class="text-xl font-bold">
							Latest Release: {latestRelease.version}
						</h2>
					</div>
					<div class="text-xs text-muted-foreground mb-4">
						{formatDate(latestRelease.createdAt)}
					</div>
					<div class="text-muted-foreground prose prose-invert max-w-none">
						{@html latestRelease.notesHtml}
					</div>
					{#if latestRelease.url}
						<div class="mt-4">
							<a
								href={latestRelease.url}
								target="_blank"
								rel="noopener noreferrer"
								class="inline-flex items-center gap-1 text-sm text-primary hover:text-primary/80"
							>
								Release Link
								<ExternalLink class="h-3 w-3" />
							</a>
						</div>
					{/if}
				</div>
			{/if}

			{#if app.changelog}
				<div class="bg-card border border-border rounded-lg p-6">
					<h2 class="text-xl font-bold mb-4">What's New</h2>
					<div class="text-muted-foreground prose prose-invert max-w-none">
						{@html app.changelog}
					</div>
				</div>
			{/if}

			{#if app.requirements}
				<div class="bg-card border border-border rounded-lg p-6">
					<h2 class="text-xl font-bold mb-4">Requirements</h2>
					<div class="text-muted-foreground prose prose-invert max-w-none">
						{@html app.requirements}
					</div>
				</div>
			{/if}

			<!-- App Information -->
			<div class="bg-card border border-border rounded-lg p-6">
				<h3 class="text-lg font-semibold mb-4">App Information</h3>
				<dl class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{#if app.version}
						<div>
							<dt class="text-sm font-medium text-muted-foreground">Version</dt>
							<dd class="mt-1 text-sm">{app.version}</dd>
						</div>
					{/if}

					{#if app.category}
						<div>
							<dt class="text-sm font-medium text-muted-foreground">
								Category
							</dt>
							<dd class="mt-1 text-sm">{app.category}</dd>
						</div>
					{/if}
					{#if app.license}
						<div>
							<dt class="text-sm font-medium text-muted-foreground">License</dt>
							<dd class="mt-1 text-sm">
								<a
									href={`https://spdx.org/licenses/${encodeURIComponent(app.license)}.html`}
									target="_blank"
									rel="noopener noreferrer"
									class="text-sm text-primary hover:text-primary/80 inline-flex items-center gap-1"
								>
									{app.license}
									<ExternalLink class="h-3 w-3" />
								</a>
							</dd>
						</div>
					{/if}
					{#if app.platform}
						<div>
							<dt class="text-sm font-medium text-muted-foreground">
								Platform
							</dt>
							<dd class="mt-1 text-sm">{app.platform}</dd>
						</div>
					{/if}
					{#if app.developer}
						<div>
							<dt class="text-sm font-medium text-muted-foreground">
								Developer
							</dt>
							<dd class="mt-1 text-sm">{app.developer}</dd>
						</div>
					{/if}
				</dl>
			</div>

			<!-- Technical Details -->
			<div class="bg-card border border-border rounded-lg p-6">
				<h3 class="text-lg font-semibold mb-4">Technical Details</h3>
				<dl class="space-y-3">
					<div>
						<dt class="text-sm font-medium text-muted-foreground">Publisher</dt>
						<dd class="mt-1">
							<ProfileInfo
								pubkey={app.pubkey}
								npub={app.npub}
								size="sm"
								showLabel={false}
							/>
						</dd>
					</div>
					<div>
						<dt class="text-sm font-medium text-muted-foreground">App ID</dt>
						<dd class="mt-1 text-sm font-mono">{app.dTag}</dd>
					</div>
					{#if app.repository}
						<div>
							<dt class="text-sm font-medium text-muted-foreground">
								Source Code
							</dt>
							<dd class="mt-1">
								<a
									href={app.repository}
									target="_blank"
									rel="noopener noreferrer"
									class="text-sm text-primary hover:text-primary/80 inline-flex items-center gap-1"
								>
									{#if app.repository.includes("github.com")}
										<Github class="h-3 w-3" />
									{:else}
										<Code class="h-3 w-3" />
									{/if}
									View Repository
									<ExternalLink class="h-3 w-3" />
								</a>
							</dd>
						</div>
					{/if}
				</dl>
			</div>

			<!-- Raw Data -->
			<details class="bg-card border border-border rounded-lg p-6">
				<summary
					class="text-lg font-semibold cursor-pointer hover:text-primary transition-colors"
					>Raw Event Data</summary
				>
				<div class="mt-4">
					<div
						class="bg-muted rounded p-4 overflow-auto max-h-96 custom-scrollbar"
					>
						<pre class="text-xs leading-relaxed"><code class="json-highlight"
								>{JSON.stringify(app.fullEvent, null, 2)}</code
							></pre>
					</div>
					{#if latestRelease}
						<div class="mt-6">
							<h4 class="text-md font-semibold mb-2">
								Latest Release (30063){#if latestRelease.version}
									- v{latestRelease.version}{/if}
							</h4>
							<div
								class="bg-muted rounded p-4 overflow-auto max-h-96 custom-scrollbar"
							>
								<pre class="text-xs leading-relaxed"><code
										class="json-highlight"
										>{JSON.stringify(latestRelease.fullEvent, null, 2)}</code
									></pre>
							</div>
						</div>
					{/if}
				</div>
			</details>
		</div>
	</div>
{/if}

<style>
	.json-highlight {
		color: hsl(var(--muted-foreground));
	}

	/* JSON syntax highlighting */
	:global(.json-highlight) {
		font-family: "Geist Mono", monospace;
	}

	/* Highlight JSON keys */
	:global(.json-highlight) {
		/* Use regex-like highlighting for JSON structure */
		background: transparent;
	}

	/* Style markdown content */
	:global(.prose) {
		color: hsl(var(--muted-foreground));
	}

	:global(.prose h1, .prose h2, .prose h3, .prose h4, .prose h5, .prose h6) {
		color: hsl(var(--foreground));
	}

    :global(.prose a) {
        color: hsl(var(--muted-foreground));
        text-decoration: underline;
        text-underline-offset: 2px;
    }

    :global(.prose a:hover) {
        color: hsl(var(--foreground));
    }

	:global(.prose code) {
		background-color: hsl(var(--muted));
		padding: 0.2rem 0.4rem;
		border-radius: 0.25rem;
		font-size: 0.875em;
	}

	:global(.prose pre) {
		background-color: hsl(var(--muted));
		border-radius: 0.5rem;
		padding: 1rem;
		overflow-x: auto;
	}

	:global(.prose blockquote) {
		border-left: 4px solid hsl(var(--primary));
		padding-left: 1rem;
		color: hsl(var(--muted-foreground));
		font-style: italic;
	}
</style>
