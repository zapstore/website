<script>
	import { createEventDispatcher } from 'svelte';
	import { Zap } from 'lucide-svelte';
	import ZapModal from './ZapModal.svelte';

	export let app;
	export let size = 'md'; // 'sm' | 'md' | 'lg'
	export let showLabel = true;

	const dispatch = createEventDispatcher();

	let isModalOpen = false;

	function openModal() {
		isModalOpen = true;
	}

	function closeModal() {
		isModalOpen = false;
	}

	function handleZapReceived(event) {
		// Forward the zapReceived event to parent
		dispatch('zapReceived', event.detail);
	}

	// Size classes
	$: sizeClasses = size === 'lg'
		? 'px-4 py-2.5 text-sm'
		: size === 'sm'
		? 'px-2.5 py-1.5 text-xs'
		: 'px-3 py-2 text-sm';

	$: iconSize = size === 'lg' ? 'h-5 w-5' : size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4';
</script>

<button
	type="button"
	on:click={openModal}
	class="inline-flex items-center gap-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-500 font-medium hover:bg-amber-500/20 hover:border-amber-500/50 transition-all {sizeClasses}"
	title="Zap this app"
>
	<Zap class={iconSize} />
	{#if showLabel}
		<span>Zap</span>
	{/if}
</button>

<ZapModal {app} bind:isOpen={isModalOpen} on:close={closeModal} on:zapReceived={handleZapReceived} />
