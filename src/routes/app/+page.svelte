<script>
	import { Download, Smartphone, Shield } from "lucide-svelte";
	import { assets } from "$app/paths";

	let showVerifyInfo = false;
</script>

<svelte:head>
	<title>Zapstore App</title>
</svelte:head>

<!-- Hero -->
<section class="relative overflow-hidden border-b border-white/10">
	<div class="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
			<!-- Left Column - Text Content -->
			<div class="max-w-2xl text-center lg:text-left">
				<h1
					class="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6"
				>
					Discover amazing apps and support developers
				</h1>
				<p class="text-lg sm:text-xl text-gray-300 mb-8 leading-relaxed">
					With thousands of apps, cryptographic authenticity and a social layer,
					the app store experience is redefined. Private by design and fully
					open source.
				</p>
				<div class="flex flex-col items-center lg:items-start">
					<div
						class="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
					>
						<a
							href="https://cdn.zapstore.dev/800b9048974dfcac4e1e1b9afe0812d15e42a08264ba0b8877e22c2e6d2221ae"
							class="inline-flex items-center justify-center rounded-lg bg-primary px-8 py-4 text-base font-semibold text-primary-foreground transition-all duration-300 hover:bg-primary/90 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary shadow-lg hover:shadow-xl"
							download
						>
							Download APK
							<Download class="ml-3 h-5 w-5" />
						</a>
						<a
							href="/docs/quickstart"
							class="inline-flex items-center justify-center rounded-lg border border-white/20 px-8 py-4 text-base font-semibold text-white/90 transition-all duration-300 hover:bg-white/10 hover:border-white/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 backdrop-blur-sm"
						>
							Getting started guide
						</a>
					</div>
					<div
						class="mt-4 flex items-center justify-center lg:justify-start gap-2 text-xs text-gray-400"
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
					{#if !showVerifyInfo}
						<div class="mt-2 text-xs text-gray-400 text-center lg:text-left">
							<button
								type="button"
								class="underline hover:text-gray-300"
								on:click={() => (showVerifyInfo = true)}
							>
								Verify Zapstore APK
							</button>
						</div>
					{:else}
						<div class="mt-2 text-md text-gray-400">
							<p class="mb-2">
								For cryptographic verification of any file ensure its hashes are <strong
									>always hosted on a separate server/domain</strong
								>.
							</p>
							<p class="mb-2">
								File and APK certificate hashes for the Zapstore installer APK
								can be found on the
								<a
									href="https://npub.world/npub10r8xl2njyepcw2zwv3a6dyufj4e4ajx86hz6v4ehu4gnpupxxp7stjt2p8"
									target="_blank"
									rel="noopener noreferrer"
									class="underline"
									>Zapstore Nostr profile
								</a>. Open it in your favorite client and make sure you are
								looking at the real Zapstore profile.
							</p>
							<p class="mb-2 font-bold">
								npub10r8xl2njyepcw2zwv3a6dyufj4e4ajx86hz6v4ehu4gnpupxxp7stjt2p8
							</p>
						</div>
					{/if}
					<img
						src={`${assets}/images/qr.png`}
						alt="QR code for https://zapstore.dev/app"
						class="mt-4"
						loading="lazy"
					/>
					<a
						href="https://github.com/zapstore/zapstore"
						class="mt-6 inline-flex items-center text-sm text-gray-300 hover:text-white transition-colors"
						target="_blank"
						rel="noopener noreferrer"
					>
						<svg height="24" fill="currentColor" viewBox="3 3 18 18">
							<path
								d="M12 3C7.0275 3 3 7.12937 3 12.2276C3 16.3109 5.57625 19.7597 9.15374 20.9824C9.60374 21.0631 9.77249 20.7863 9.77249 20.5441C9.77249 20.3249 9.76125 19.5982 9.76125 18.8254C7.5 19.2522 6.915 18.2602 6.735 17.7412C6.63375 17.4759 6.19499 16.6569 5.8125 16.4378C5.4975 16.2647 5.0475 15.838 5.80124 15.8264C6.51 15.8149 7.01625 16.4954 7.18499 16.7723C7.99499 18.1679 9.28875 17.7758 9.80625 17.5335C9.885 16.9337 10.1212 16.53 10.38 16.2993C8.3775 16.0687 6.285 15.2728 6.285 11.7432C6.285 10.7397 6.63375 9.9092 7.20749 9.26326C7.1175 9.03257 6.8025 8.08674 7.2975 6.81794C7.2975 6.81794 8.05125 6.57571 9.77249 7.76377C10.4925 7.55615 11.2575 7.45234 12.0225 7.45234C12.7875 7.45234 13.5525 7.55615 14.2725 7.76377C15.9937 6.56418 16.7475 6.81794 16.7475 6.81794C17.2424 8.08674 16.9275 9.03257 16.8375 9.26326C17.4113 9.9092 17.76 10.7281 17.76 11.7432C17.76 15.2843 15.6563 16.0687 13.6537 16.2993C13.98 16.5877 14.2613 17.1414 14.2613 18.0065C14.2613 19.2407 14.25 20.2326 14.25 20.5441C14.25 20.7863 14.4188 21.0746 14.8688 20.9824C16.6554 20.364 18.2079 19.1866 19.3078 17.6162C20.4077 16.0457 20.9995 14.1611 21 12.2276C21 7.12937 16.9725 3 12 3Z"
							></path>
						</svg>
						<span class="ml-2"
							>Source code: https://github.com/zapstore/zapstore</span
						>
					</a>
				</div>
			</div>

			<!-- Right Column - App Image -->
			<div class="relative flex justify-center lg:justify-end">
				<div class="relative">
					<!-- Background glow effect -->
					<div
						class="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-purple-500/10 rounded-3xl blur-3xl scale-110"
					></div>

					<!-- Phone mockup container with shadow -->
					<div
						class="relative transform hover:scale-105 transition-transform duration-500 ease-out"
					>
						<img
							src={`${assets}/images/app1.png`}
							alt="Zapstore App Interface"
							class="relative z-10 max-w-xs sm:max-w-sm lg:max-w-md xl:max-w-lg drop-shadow-2xl"
						/>

						<!-- Additional shadow layer -->
						<div
							class="absolute inset-0 bg-gradient-to-b from-transparent via-black/5 to-black/20 rounded-2xl transform translate-y-2 blur-lg opacity-60"
						></div>
					</div>

					<!-- Floating accent elements -->
					<div
						class="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-primary/30 to-purple-500/30 rounded-full blur-xl opacity-60 animate-pulse"
					></div>
					<div
						class="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-tr from-blue-500/20 to-primary/20 rounded-full blur-2xl opacity-40"
					></div>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- Platforms / Info -->
<section class="py-16">
	<div class="container mx-auto px-4 sm:px-6 lg:px-8">
		<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
			<div class="rounded-xl border border-white/10 bg-white/5 p-6">
				<div
					class="w-12 h-12 rounded-lg border border-white/10 bg-white/5 flex items-center justify-center mb-4"
				>
					<Smartphone class="h-6 w-6 text-white" />
				</div>
				<h3 class="text-lg font-semibold text-white mb-2">Built for Android</h3>
				<p class="text-sm text-gray-400">
					Works great on stock Android, GrapheneOS and others (arm64-v8a
					architecture only)
				</p>
			</div>
			<div class="rounded-xl border border-white/10 bg-white/5 p-6">
				<div
					class="w-12 h-12 rounded-lg border border-white/10 bg-white/5 flex items-center justify-center mb-4"
				>
					<img
						src={`${assets}/images/logo-dark.svg`}
						alt="Zapstore"
						class="h-6 w-auto"
					/>
				</div>
				<h3 class="text-lg font-semibold text-white mb-2">Open and secure</h3>
				<p class="text-sm text-gray-400">
					Every app is cryptographically verified. Find great ones from curators
					you trust.
				</p>
			</div>
			<div class="rounded-xl border border-white/10 bg-white/5 p-6">
				<div
					class="w-12 h-12 rounded-lg border border-white/10 bg-white/5 flex items-center justify-center mb-4"
				>
					<Shield class="h-6 w-6 text-white" />
				</div>
				<h3 class="text-lg font-semibold text-white mb-2">Private by design</h3>
				<p class="text-sm text-gray-400">
					No identity required. Built on the decentralized Nostr protocol.
				</p>
			</div>
		</div>
	</div>
</section>
