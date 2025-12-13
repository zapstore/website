<script>
	import {
		Download,
		X,
		Lock,
		ChevronDown,
		ChevronUp,
		ExternalLink,
		Monitor,
		Smartphone,
	} from "lucide-svelte";
	import { assets } from "$app/paths";
	import { slide, fade } from "svelte/transition";
	import { browser } from "$app/environment";

	export let open = false;

	let showVerifyInfo = false;
	let isAndroid = browser && /android/i.test(navigator.userAgent);
	let verifyTab = isAndroid ? "mobile" : "desktop";
	let downloading = false;

	// Android APK
	const ANDROID_APK_VERSION = "0.2.7";
	const ANDROID_APK_URL =
		`https://cdn.zapstore.dev/zapstore-${ANDROID_APK_VERSION}.apk`;
	const ANDROID_APK_SHA256 =
		"800b9048974dfcac4e1e1b9afe0812d15e42a08264ba0b8877e22c2e6d2221ae";
	const APK_CERT_HASH =
		"99e33b0c2d07e75fcd9df7e40e886646ff667e3aa6648e1a1160b036cf2b9320";

	function closeModal() {
		open = false;
		showVerifyInfo = false;
	}

	function handleKeydown(e) {
		if (e.key === "Escape") {
			closeModal();
		}
	}

	function handleBackdropClick(e) {
		if (e.target === e.currentTarget) {
			closeModal();
		}
	}

	async function downloadApk() {
		downloading = true;
		try {
			const response = await fetch(ANDROID_APK_URL);
			const blob = await response.blob();
			const url = window.URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = "zapstore.apk";
			document.body.appendChild(a);
			a.click();
			window.URL.revokeObjectURL(url);
			document.body.removeChild(a);
		} catch (err) {
			// Fallback to direct link if fetch fails
			window.location.href = ANDROID_APK_URL;
		} finally {
			downloading = false;
		}
	}
</script>

<svelte:window on:keydown={handleKeydown} />

{#if open}
	<!-- Backdrop -->
	<!-- svelte-ignore a11y_click_events_have_key_events a11y_interactive_supports_focus -->
	<div
		class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
		transition:fade={{ duration: 150 }}
		on:click={handleBackdropClick}
		role="dialog"
		aria-modal="true"
		aria-labelledby="download-modal-title"
	>
		<!-- Modal -->
		<div
			class="relative w-full max-w-lg bg-card border border-border/50 rounded-2xl shadow-2xl overflow-hidden"
			transition:fade={{ duration: 150 }}
		>
			<!-- Close button -->
			<button
				type="button"
				class="absolute top-4 right-4 p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors z-10"
				on:click={closeModal}
				aria-label="Close"
			>
				<X class="w-5 h-5" />
			</button>

			<!-- Content -->
			<div class="p-8">
				<h2
					id="download-modal-title"
					class="text-display text-2xl text-foreground mb-6"
				>
					Download Zapstore {ANDROID_APK_VERSION}
				</h2>

				<!-- Android Download -->
				<div class="space-y-5">
					<div>
						<button
							on:click={downloadApk}
							disabled={downloading}
							class="group relative inline-flex items-center justify-center rounded-xl bg-primary px-8 py-4 text-base font-semibold text-primary-foreground transition-all hover:bg-primary/90 w-full overflow-hidden disabled:opacity-70"
						>
							<span
								class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"
							></span>
							{#if downloading}
								<div
									class="animate-spin rounded-full h-5 w-5 border-2 border-primary-foreground border-t-transparent mr-3"
								></div>
								Downloading...
							{:else}
								<Download class="mr-3 h-5 w-5" />
								Download APK
							{/if}
						</button>

						<div
							class="flex items-center justify-center gap-1.5 mt-3 text-sm text-muted-foreground"
						>
							<svg
								class="w-4 h-4 text-green-500"
								viewBox="0 0 32 32"
								fill="currentColor"
							>
								<path
									d="M23.35 12.653l2.496-4.323c0.044-0.074 0.070-0.164 0.070-0.26 0-0.287-0.232-0.519-0.519-0.519-0.191 0-0.358 0.103-0.448 0.257l-0.001 0.002-2.527 4.377c-1.887-0.867-4.094-1.373-6.419-1.373s-4.532 0.506-6.517 1.413l0.098-0.040-2.527-4.378c-0.091-0.156-0.259-0.26-0.45-0.26-0.287 0-0.519 0.232-0.519 0.519 0 0.096 0.026 0.185 0.071 0.262l-0.001-0.002 2.496 4.323c-4.286 2.367-7.236 6.697-7.643 11.744l-0.003 0.052h29.991c-0.41-5.099-3.36-9.429-7.57-11.758l-0.076-0.038zM9.098 20.176c-0 0-0 0-0 0-0.69 0-1.249-0.559-1.249-1.249s0.559-1.249 1.249-1.249c0.69 0 1.249 0.559 1.249 1.249v0c-0.001 0.689-0.559 1.248-1.249 1.249h-0zM22.902 20.176c-0 0-0 0-0 0-0.69 0-1.249-0.559-1.249-1.249s0.559-1.249 1.249-1.249c0.69 0 1.249 0.559 1.249 1.249v0c-0.001 0.689-0.559 1.248-1.249 1.249h-0z"
								></path>
							</svg>
							<span>Android 10+ (<strong>arm64-v8a</strong> only)</span>
						</div>
					</div>

					<!-- QR Code -->
					<div
						class="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-border/30"
					>
						<img
							src={`${assets}/images/qr.png`}
							alt={`QR code to download Zapstore v${ANDROID_APK_VERSION} APK`}
							class="w-20 h-20 rounded-lg border border-border/40 bg-white p-1"
							loading="lazy"
						/>
						<div>
							<p class="text-sm font-medium text-foreground mb-1">
								Scan to download APK
							</p>
							<p class="text-xs text-muted-foreground">
								Open this page on your phone to download the APK directly.
							</p>
						</div>
					</div>

					<!-- Verification -->
					<div class="border-t border-border/30 pt-4">
						<button
							type="button"
							class="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group w-full"
							on:click={() => (showVerifyInfo = !showVerifyInfo)}
						>
							<Lock
								class="w-4 h-4 group-hover:text-primary transition-colors"
							/>
							<span>Verify APK authenticity (optional)</span>
							{#if showVerifyInfo}
								<ChevronUp class="w-4 h-4 ml-auto" />
							{:else}
								<ChevronDown class="w-4 h-4 ml-auto" />
							{/if}
						</button>

						{#if showVerifyInfo}
							<div
								transition:slide={{ duration: 200 }}
								class="mt-3 rounded-xl bg-white/5 border border-border/30 text-sm overflow-hidden"
							>
								<!-- Tabs -->
								<div class="flex border-b border-border/30">
									<button
										type="button"
										class="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-medium transition-colors {verifyTab ===
										'desktop'
											? 'text-foreground bg-white/5'
											: 'text-muted-foreground hover:text-foreground'}"
										on:click={() => (verifyTab = "desktop")}
									>
										<Monitor class="w-3.5 h-3.5" />
										Desktop
									</button>
									<button
										type="button"
										class="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-medium transition-colors {verifyTab ===
										'mobile'
											? 'text-foreground bg-white/5'
											: 'text-muted-foreground hover:text-foreground'}"
										on:click={() => (verifyTab = "mobile")}
									>
										<Smartphone class="w-3.5 h-3.5" />
										Mobile
									</button>
								</div>

								<!-- Tab content -->
								<div class="p-4">
									{#if verifyTab === "desktop"}
										<p class="text-xs text-muted-foreground mb-2">
											Run in terminal:
										</p>
										<div
											class="font-mono text-xs text-muted-foreground bg-muted/30 p-2.5 rounded-lg border border-border/30 mb-3"
										>
											shasum -a 256 zapstore-{ANDROID_APK_VERSION}.apk
										</div>
										<p class="text-xs text-muted-foreground mb-1.5">
											Should equal:
										</p>
										<div
											class="font-mono text-[11px] text-muted-foreground break-all bg-muted/30 p-2.5 rounded-lg border border-border/30 mb-3"
										>
											{ANDROID_APK_SHA256}
										</div>
										<p class="text-[11px] text-muted-foreground/70">
											Always check the hash in
											<a
												href="https://npub.world/npub10r8xl2njyepcw2zwv3a6dyufj4e4ajx86hz6v4ehu4gnpupxxp7stjt2p8"
												target="_blank"
												rel="noopener noreferrer"
												class="text-primary hover:underline"
												>Zapstore's Nostr profile</a
											>
										</p>
									{:else}
										<p class="text-xs text-muted-foreground mb-2">
											Use
											<a
												href="https://github.com/nicman23/appverifier"
												target="_blank"
												rel="noopener noreferrer"
												class="text-primary hover:underline">AppVerifier</a
											>
											to verify the APK certificate:
										</p>
										<p class="text-xs text-muted-foreground mb-1.5">
											Certificate hash:
										</p>
										<div
											class="font-mono text-[11px] text-muted-foreground break-all bg-muted/30 p-2.5 rounded-lg border border-border/30 mb-3"
										>
											{APK_CERT_HASH}
										</div>
										<p class="text-[11px] text-muted-foreground/70">
											Always check the hash in
											<a
												href="https://npub.world/npub10r8xl2njyepcw2zwv3a6dyufj4e4ajx86hz6v4ehu4gnpupxxp7stjt2p8"
												target="_blank"
												rel="noopener noreferrer"
												class="text-primary hover:underline"
												>Zapstore's Nostr profile</a
											>
										</p>
									{/if}
								</div>
							</div>
						{/if}
					</div>

					<!-- Source -->
					<div class="flex justify-center pt-2">
						<a
							href="https://github.com/zapstore/zapstore"
							class="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
							target="_blank"
							rel="noopener noreferrer"
						>
							<svg height="16" fill="currentColor" viewBox="3 3 18 18">
								<path
									d="M12 3C7.0275 3 3 7.12937 3 12.2276C3 16.3109 5.57625 19.7597 9.15374 20.9824C9.60374 21.0631 9.77249 20.7863 9.77249 20.5441C9.77249 20.3249 9.76125 19.5982 9.76125 18.8254C7.5 19.2522 6.915 18.2602 6.735 17.7412C6.63375 17.4759 6.19499 16.6569 5.8125 16.4378C5.4975 16.2647 5.0475 15.838 5.80124 15.8264C6.51 15.8149 7.01625 16.4954 7.18499 16.7723C7.99499 18.1679 9.28875 17.7758 9.80625 17.5335C9.885 16.9337 10.1212 16.53 10.38 16.2993C8.3775 16.0687 6.285 15.2728 6.285 11.7432C6.285 10.7397 6.63375 9.9092 7.20749 9.26326C7.1175 9.03257 6.8025 8.08674 7.2975 6.81794C7.2975 6.81794 8.05125 6.57571 9.77249 7.76377C10.4925 7.55615 11.2575 7.45234 12.0225 7.45234C12.7875 7.45234 13.5525 7.55615 14.2725 7.76377C15.9937 6.56418 16.7475 6.81794 16.7475 6.81794C17.2424 8.08674 16.9275 9.03257 16.8375 9.26326C17.4113 9.9092 17.76 10.7281 17.76 11.7432C17.76 15.2843 15.6563 16.0687 13.6537 16.2993C13.98 16.5877 14.2613 17.1414 14.2613 18.0065C14.2613 19.2407 14.25 20.2326 14.25 20.5441C14.25 20.7863 14.4188 21.0746 14.8688 20.9824C16.6554 20.364 18.2079 19.1866 19.3078 17.6162C20.4077 16.0457 20.9995 14.1611 21 12.2276C21 7.12937 16.9725 3 12 3Z"
								></path>
							</svg>
							View source on GitHub
						</a>
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}
