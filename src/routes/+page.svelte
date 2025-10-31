<script>
	import {
		ArrowRight,
		Shield,
		Zap,
		Users,
		Code,
		Lock,
		Globe,
		ChevronLeft,
		ChevronRight,
		Download,
	} from "lucide-svelte";
	import FeatureCard from "$lib/components/FeatureCard.svelte";
	import CodeDemo from "$lib/components/CodeDemo.svelte";
	import { getAppSlug } from "$lib/nostr.js";
	import { assets } from "$app/paths";

	// Receive server-rendered data
	export let data;
	
	let carouselApps = data.carouselApps;
	let carouselLoading = data.carouselLoading;
	let carouselEl;

	function getAppUrl(app) {
		// Use pre-computed slug from server if available
		return `/apps/${app.slug || getAppSlug(app.pubkey, app.dTag)}`;
	}

	function scrollLeft() {
		carouselEl && carouselEl.scrollBy({ left: -360, behavior: "smooth" });
	}

	function scrollRight() {
		carouselEl && carouselEl.scrollBy({ left: 360, behavior: "smooth" });
	}
</script>

<svelte:head>
	<title>Zapstore</title>
</svelte:head>

<!-- Hero Section -->
<section class="relative overflow-hidden">
	<div class="container mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
		<div class="relative z-10 max-w-4xl mx-auto text-center">
			<h1
				class="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 text-white"
			>
				The app store powered by your social graph
			</h1>
			<p
				class="text-lg sm:text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed"
			>
				Zapstore is built on the open Nostr protocol. Discover great apps
				through your social connections&mdash;or in a completely private way.
				Support your favorite developers directly in bitcoin without middlemen.
			</p>
			<div class="flex flex-col sm:flex-row gap-4 justify-center">
				<a
					href="/app"
					class="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition-all hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
				>
					Download Zapstore
					<Download class="ml-2 h-4 w-4" />
				</a>
				<a
					href="/developers"
					class="inline-flex items-center justify-center rounded-md border border-white/10 px-6 py-3 text-sm font-medium text-white/90 transition-all hover:bg-white/5 hover:shadow-[0_0_0_3px_rgba(255,255,255,0.08)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/20"
				>
					For Developers
				</a>
			</div>
			<div
				class="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400"
			>
				<span>Available on: </span>
				<svg
					class="w-4 h-4"
					viewBox="0 0 32 32"
					fill="currentColor"
					aria-hidden="true"
				>
					<path
						d="M23.35 12.653l2.496-4.323c0.044-0.074 0.070-0.164 0.070-0.26 0-0.287-0.232-0.519-0.519-0.519-0.191 0-0.358 0.103-0.448 0.257l-0.001 0.002-2.527 4.377c-1.887-0.867-4.094-1.373-6.419-1.373s-4.532 0.506-6.517 1.413l0.098-0.040-2.527-4.378c-0.091-0.156-0.259-0.26-0.45-0.26-0.287 0-0.519 0.232-0.519 0.519 0 0.096 0.026 0.185 0.071 0.262l-0.001-0.002 2.496 4.323c-4.286 2.367-7.236 6.697-7.643 11.744l-0.003 0.052h29.991c-0.41-5.099-3.36-9.429-7.57-11.758l-0.076-0.038zM9.098 20.176c-0 0-0 0-0 0-0.69 0-1.249-0.559-1.249-1.249s0.559-1.249 1.249-1.249c0.69 0 1.249 0.559 1.249 1.249v0c-0.001 0.689-0.559 1.248-1.249 1.249h-0zM22.902 20.176c-0 0-0 0-0 0-0.69 0-1.249-0.559-1.249-1.249s0.559-1.249 1.249-1.249c0.69 0 1.249 0.559 1.249 1.249v0c-0.001 0.689-0.559 1.248-1.249 1.249h-0z"
					></path>
				</svg>
				<span class="font-bold">Android 10+</span>
				<span>(arm64-v8a)</span>
			</div>
		</div>
	</div>
</section>

<section class="relative overflow-hidden py-20">
	<div class="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
		<div class="text-center mb-14 max-w-4xl mx-auto">
			<h2
				class="text-4xl sm:text-5xl font-extrabold mb-4 text:white leading-tight"
			>
				Secure by default, always decentralized.
			</h2>
			<p class="text-lg text-gray-400 leading-relaxed">
				Big Tech app stores are walled gardens where a single gatekeeper decides
				what gets in. Powered by Nostr, Zapstore is open source, permissionless
				and censorship-resistant. Anyone can publish and switch relays. To
				preserve quality in an open network, we use web-of-trust and other
				metrics to surface signal and obliterate spam.
			</p>
		</div>
		<div
			class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto"
		>
			<!-- Secure by default -->
			<div class="group relative">
				<div class="h-full rounded-2xl p-6 border border-white/10 bg-card">
					<div class="relative z-10">
						<div class="relative mb-4">
							<div
								class="relative w-12 h-12 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center"
							>
								<Lock class="h-6 w-6 text-white" />
							</div>
						</div>
						<h3 class="text-lg font-semibold text-white mb-2">
							Secure by default
						</h3>
						<p class="text-gray-400 leading-relaxed text-sm">
							Everything you install comes from your trusted sources and is
							cryptographically verified. Not satisfied with our default? Choose
							your own curators, or mix and match! Censorship has no place.
						</p>
					</div>
				</div>
			</div>

			<!-- Relevant to you -->
			<div class="group relative">
				<div class="h-full rounded-2xl p-6 border border-white/10 bg-card">
					<div class="relative z-10">
						<div class="relative mb-4">
							<div
								class="relative w-12 h-12 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center"
							>
								<Users class="h-6 w-6 text-white" />
							</div>
						</div>
						<h3 class="text-lg font-semibold text-white mb-2">
							Relevant to you
						</h3>
						<p class="text-gray-400 leading-relaxed text-sm">
							Supercharged by the nostr open protocol, recommendations come
							right from your social connections — or use it in totally private
							way. With our growing catalog, you will never run out of great
							apps.
						</p>
					</div>
				</div>
			</div>

			<!-- Support your devs -->
			<div class="group relative">
				<div class="h-full rounded-2xl p-6 border border-white/10 bg-card">
					<div class="relative z-10">
						<div class="relative mb-4">
							<div
								class="relative w-12 h-12 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center"
							>
								<Zap class="h-6 w-6 text-white" />
							</div>
						</div>
						<h3 class="text-lg font-semibold text-white mb-2">
							Support your devs
						</h3>
						<p class="text-gray-400 leading-relaxed text-sm">
							Connect with your favorite developers: send them feedback, request
							features and support them directly with bitcoin zaps, all without
							any middlemen.
						</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

<section
	class="relative py-20 border-t border-border/40 bg-background overflow-hidden"
>
	<div class="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
		<div class="text-center mb-16">
			<h2 class="text-3xl sm:text-4xl font-extrabold mb-6 text-white">
				Powered by Nostr relays
			</h2>
			<p class="text-lg text-gray-400 max-w-3xl mx-auto leading-relaxed">
				Zapstore uses a decentralized relay network for secure,
				censorship-resistant distribution.
			</p>
		</div>

		<!-- How It Works Diagram - Better aligned -->
		<div class="mb-16">
			<div
				class="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16"
			>
				<!-- Step 1: User Publishes -->
				<div class="text-center">
					<div
						class="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center border border-white/10 bg-white/5"
					>
						<svg
							class="w-10 h-10 text-white"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
							/>
						</svg>
					</div>
					<h3 class="text-lg font-semibold text-white mb-2">
						Developers publish
					</h3>
					<p class="text-sm text-gray-400">
						App metadata is created and signed
					</p>
				</div>

				<!-- Arrow 1 -->
				<div class="hidden md:flex items-center">
					<svg
						class="w-8 h-8 text-primary"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M17 8l4 4m0 0l-4 4m4-4H3"
						/>
					</svg>
				</div>

				<!-- Step 2: Relay Transmits -->
				<div class="text-center">
					<div
						class="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center border border-white/10 bg-white/5"
					>
						<svg
							class="w-10 h-10 text-white"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
							/>
						</svg>
					</div>
					<h3 class="text-lg font-semibold text-white mb-2">Relays transmit</h3>
					<p class="text-sm text-gray-400">Content is broadcasted</p>
				</div>

				<!-- Arrow 2 -->
				<div class="hidden md:flex items-center">
					<svg
						class="w-8 h-8 text-primary"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M17 8l4 4m0 0l-4 4m4-4H3"
						/>
					</svg>
				</div>

				<!-- Step 3: Users Receive -->
				<div class="text-center">
					<div
						class="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center border border-white/10 bg-white/5"
					>
						<svg
							class="w-10 h-10 text-white"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
							/>
						</svg>
					</div>
					<h3 class="text-lg font-semibold text-white mb-2">Users receive</h3>
					<p class="text-sm text-gray-400">Apps are delivered and verified</p>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- CTA Section -->
<section class="py-20 border-t border-white/10">
	<div class="container mx-auto px-4 sm:px-6 lg:px-8">
		<div
			class="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-12 lg:p-16"
		>
			<div class="relative z-10 max-w-2xl">
				<h2 class="text-3xl sm:text-4xl font-extrabold mb-4 text-white">
					Ready to join?
				</h2>
				<p class="text-lg text-gray-400 mb-8">
					With our growing catalog, you will never run out of great apps. Start
					discovering today!
				</p>
				<div class="flex flex-col sm:flex-row gap-4">
					<a
						href="/app"
						class="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
					>
						Download now
						<ArrowRight class="ml-2 h-4 w-4" />
					</a>
					<a
						href="/apps"
						class="inline-flex items-center justify-center rounded-md border border-white/10 px-6 py-3 text-sm font-medium text-white/90 transition-colors hover:bg-white/5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/20"
					>
						Browse apps
					</a>
				</div>
			</div>
			<!-- subtle corners -->
			<div
				class="absolute -top-12 -right-12 h-40 w-40 rounded-full bg-primary/10 blur-3xl"
			></div>
			<div
				class="absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-secondary/10 blur-3xl"
			></div>
		</div>
	</div>
</section>
