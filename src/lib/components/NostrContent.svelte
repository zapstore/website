<script>
	import { onMount } from 'svelte';
	import * as nip27 from 'nostr-tools/nip27';
	import * as nip19 from 'nostr-tools/nip19';
	import { fetchProfile, pubkeyToNpub } from '$lib/nostr.js';

	export let content = '';

	// Parsed tokens from nip27
	let tokens = [];
	// Map of pubkey -> profile data (for resolved names)
	let profiles = new Map();
	// Track loading state
	let loading = true;

	// Parse content and fetch profiles for any references
	async function parseAndResolve() {
		if (!content) {
			tokens = [];
			loading = false;
			return;
		}

		// Parse content using nip27
		const parsed = [...nip27.parse(content)];
		tokens = parsed;

		// Find all profile references that need resolving
		const pubkeysToFetch = [];
		for (const token of parsed) {
			if (token.type === 'reference' && token.pointer?.pubkey) {
				pubkeysToFetch.push(token.pointer.pubkey);
			}
		}

		// Fetch profiles in parallel
		if (pubkeysToFetch.length > 0) {
			const profileResults = await Promise.all(
				pubkeysToFetch.map(async (pubkey) => {
					try {
						const profile = await fetchProfile(pubkey);
						return { pubkey, profile };
					} catch (err) {
						console.warn('Failed to fetch profile for', pubkey, err);
						return { pubkey, profile: null };
					}
				})
			);

			// Build profiles map
			for (const { pubkey, profile } of profileResults) {
				profiles.set(pubkey, profile);
			}
			profiles = profiles; // Trigger reactivity
		}

		loading = false;
	}

	onMount(() => {
		parseAndResolve();
	});

	// Re-parse when content changes
	$: if (content !== undefined) {
		parseAndResolve();
	}

	// Get display name for a pubkey
	function getDisplayName(pubkey) {
		const profile = profiles.get(pubkey);
		if (profile?.displayName) return profile.displayName;
		if (profile?.name) return profile.name;
		// Fallback to shortened npub
		const npub = pubkeyToNpub(pubkey);
		return npub.slice(0, 12) + '…';
	}

	// Get profile URL for a pubkey
	function getProfileUrl(pubkey) {
		const npub = pubkeyToNpub(pubkey);
		return `/p/${npub}`;
	}

	// Split text by newlines for proper rendering
	function splitByNewlines(text) {
		return text.split('\n');
	}
</script>

{#if loading}
	<span class="text-muted-foreground">{content}</span>
{:else}
	{#each tokens as token}
		{@const lines = token.type === 'text' ? splitByNewlines(token.text) : []}
		{#if token.type === 'text'}
			{#each lines as line, i}
				{line}{#if i < lines.length - 1}<br />{/if}
			{/each}
		{:else if token.type === 'reference' && token.pointer?.pubkey}
			<a 
				href={getProfileUrl(token.pointer.pubkey)} 
				class="text-primary hover:text-primary/80 hover:underline font-medium"
			>@{getDisplayName(token.pointer.pubkey)}</a>
		{:else if token.type === 'url'}
			<a 
				href={token.url} 
				target="_blank" 
				rel="noopener noreferrer" 
				class="text-primary hover:text-primary/80 hover:underline break-all"
			>{token.url}</a>
		{:else if token.type === 'relay'}
			<span class="font-mono text-sm text-muted-foreground">{token.url}</span>
		{:else if token.type === 'image'}
			<img 
				src={token.url} 
				alt="embedded image" 
				class="max-w-full h-auto rounded-lg my-2" 
				loading="lazy"
			/>
		{:else if token.type === 'video'}
			<video 
				src={token.url} 
				controls 
				class="max-w-full h-auto rounded-lg my-2"
			>
				<track kind="captions" />
			</video>
		{:else if token.type === 'audio'}
			<audio src={token.url} controls class="w-full my-2">
				<track kind="captions" />
			</audio>
		{/if}
	{/each}
{/if}

