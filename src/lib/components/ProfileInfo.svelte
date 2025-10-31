<script>
	import { onMount } from 'svelte';
	import { User } from 'lucide-svelte';
	import { fetchProfile } from '$lib/nostr.js';

	export let pubkey;
	export let npub = '';
	export let size = 'sm'; // 'sm' or 'lg'
	export let showLabel = true; // Whether to show "Signed by:" label
	export let disableLink = false; // Whether to disable the link functionality

	let profile = null;
	let loading = true;

	onMount(async () => {
		if (pubkey) {
			try {
				profile = await fetchProfile(pubkey);
			} catch (err) {
				console.error('Error fetching profile:', err);
			}
			loading = false;
		}
	});

	$: displayName = profile?.displayName || profile?.name || '';
	$: avatarUrl = profile?.picture || '';
	$: profileUrl = npub ? `/apps/developer/${npub}` : '#';
	$: shouldHideProfile = !loading && !displayName;
	$: shouldShowProfile = !loading && displayName && pubkey !== '78ce6faa72264387284e647ba6938995735ec8c7d5c5a65737e55130f026307d';

	// Size classes per variant
	$: sizeClasses =
		size === 'lg'
			? 'h-10 w-10 text-base'
			: size === 'sm'
			? 'h-8 w-8 text-sm'
			: 'h-6 w-6 text-[10px]';
	$: iconSize =
		size === 'lg' ? 'h-5 w-5' : size === 'sm' ? 'h-4 w-4' : 'h-3 w-3';
	$: labelClass = size === 'lg' ? 'text-sm text-muted-foreground' : 'text-xs text-muted-foreground';
	$: nameClass =
		size === 'lg'
			? 'font-bold text-foreground text-base'
			: size === 'sm'
			? 'font-medium text-foreground text-sm'
			: 'font-medium text-foreground text-xs';
</script>

{#if shouldShowProfile}
	{#if disableLink}
		<div class="flex items-center gap-2">
			{#if showLabel}
				<span class="{labelClass}">Signed by:</span>
			{/if}
			
			<!-- Avatar -->
			<div class="flex-shrink-0">
				{#if avatarUrl}
					<img 
						src={avatarUrl} 
						alt={displayName || 'User avatar'} 
						class="{sizeClasses} rounded-full object-cover bg-muted"
						loading="lazy"
					/>
				{:else}
					<div class="{sizeClasses} rounded-full bg-primary/10 flex items-center justify-center">
						<User class="{iconSize} text-primary" />
					</div>
				{/if}
			</div>

			<!-- Profile Name -->
			<div class="min-w-0 flex-1">
				<div class="{nameClass}">
					{displayName}
				</div>
			</div>
		</div>
	{:else}
		<div class="flex items-center gap-2">
			{#if showLabel}
				<span class="{labelClass}">Signed by:</span>
			{/if}
			
			<a 
				href={profileUrl} 
				class="flex items-center gap-2 hover:opacity-80 transition-opacity"
			>
				<!-- Avatar -->
				<div class="flex-shrink-0">
					{#if avatarUrl}
						<img 
							src={avatarUrl} 
							alt={displayName || 'User avatar'} 
							class="{sizeClasses} rounded-full object-cover bg-muted"
							loading="lazy"
						/>
					{:else}
						<div class="{sizeClasses} rounded-full bg-primary/10 flex items-center justify-center">
							<User class="{iconSize} text-primary" />
						</div>
					{/if}
				</div>

				<!-- Profile Name -->
				<div class="min-w-0 flex-1">
				<div class="{nameClass}">
						{displayName}
					</div>
				</div>
			</a>
		</div>
	{/if}
{/if} 