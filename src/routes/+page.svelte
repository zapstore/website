<script>
	import {
		ArrowRight,
		Download,
		Users,
		Zap,
		Shield,
		ChevronRight,
		Globe,
	} from "lucide-svelte";
	import { getAppSlug } from "$lib/nostr.js";
	import { assets } from "$app/paths";
	import DownloadModal from "$lib/components/DownloadModal.svelte";

	export let data;

	let carouselApps = data.carouselApps;
	let testimonials = data.testimonials || [];
	let showDownloadModal = false;
	let expandedCards = new Set();
	let iosWaitlistStatus = "idle";
	let iosWaitlistMessage = "";
	let iosSubmitting = false;

	const CHAR_LIMIT = 120;
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	const npubRegex = /^npub1[ac-hj-np-z0-9]{58}$/i;

	$: visibleTestimonials = testimonials;

	async function handleIosWaitlistSubmit(event) {
		event.preventDefault();
		const form = event.currentTarget;
		const formData = new FormData(form);
		const contact = formData.get("contact")?.toString().trim();

		if (!contact) {
			iosWaitlistStatus = "error";
			iosWaitlistMessage = "Please enter an email or npub.";
			return;
		}

		if (!emailRegex.test(contact) && !npubRegex.test(contact)) {
			iosWaitlistStatus = "error";
			iosWaitlistMessage =
				"Enter a valid email or Nostr npub (starts with npub1).";
			return;
		}

		iosSubmitting = true;
		iosWaitlistStatus = "idle";
		iosWaitlistMessage = "";

		try {
			const response = await fetch("https://formspree.io/f/mldqprpn", {
				method: "POST",
				headers: {
					Accept: "application/json",
				},
				body: formData,
			});

			if (!response.ok) {
				throw new Error("Request failed");
			}

			iosWaitlistStatus = "success";
			iosWaitlistMessage = "Thanks! We'll share more as soon as it's ready.";
			form.reset();
		} catch (error) {
			iosWaitlistStatus = "error";
			iosWaitlistMessage = "Something went wrong. Please try again.";
		} finally {
			iosSubmitting = false;
		}
	}

	// Format date for display
	function formatDate(timestamp) {
		const date = new Date(timestamp * 1000);
		return date.toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric",
		});
	}

	// Get display name for a testimonial
	function getDisplayName(testimonial) {
		if (testimonial.profile?.displayName)
			return testimonial.profile.displayName;
		if (testimonial.profile?.name) return testimonial.profile.name;
		if (testimonial.profile?.nip05)
			return testimonial.profile.nip05.split("@")[0];
		return testimonial.npub?.slice(0, 12) + "...";
	}

	// Check if content should be truncated
	function shouldTruncate(content) {
		return content.length > CHAR_LIMIT;
	}

	// Get truncated content
	function getTruncatedContent(content) {
		if (content.length <= CHAR_LIMIT) return content;
		return content.slice(0, CHAR_LIMIT).trim() + "...";
	}

	// Toggle card expansion
	function toggleExpand(id) {
		if (expandedCards.has(id)) {
			expandedCards.delete(id);
		} else {
			expandedCards.add(id);
		}
		expandedCards = expandedCards; // trigger reactivity
	}
</script>

<svelte:head>
	<title>Zapstore</title>
	<meta name="description" content="" />
</svelte:head>

<DownloadModal bind:open={showDownloadModal} />

<!-- Hero Section -->
<section class="relative overflow-hidden pt-12 pb-6 lg:pt-16 lg:pb-8">
	<!-- Background gradient orbs -->
	<div
		class="absolute top-0 left-1/4 w-[600px] h-[600px] gradient-orb bg-primary/20"
	></div>
	<div
		class="absolute top-40 right-1/3 w-[400px] h-[400px] gradient-orb bg-primary/10"
		style="animation-delay: -4s;"
	></div>
	<div
		class="absolute bottom-0 right-0 w-[500px] h-[500px] gradient-orb bg-primary/15"
		style="animation-delay: -2s;"
	></div>

	<div class="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-start">
			<!-- Left side: Text content -->
			<div class="max-w-xl mx-auto lg:mx-0 text-center lg:text-left">
				<!-- Headline -->
				<h1
					class="text-display-lg text-[2.75rem] sm:text-[3.25rem] lg:text-[3.5rem] xl:text-[3.85rem] mb-6 animate-fade-in-up delay-100"
				>
					The open app store
					<span class="text-primary">powered by your social network</span>
				</h1>

				<!-- Subheadline -->
				<p
					class="text-lg sm:text-xl text-muted-foreground mb-10 leading-relaxed animate-fade-in-up delay-200"
				>
					Discover apps through your connections – no walled gardens, no shady
					algorithms. Built on open protocols and fully decentralized.
				</p>

				<!-- CTA Buttons -->
				<div
					class="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in-up delay-300"
				>
					<button
						on:click={() => (showDownloadModal = true)}
						class="group inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3.5 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25"
					>
						Download Android app
						<Download
							class="ml-2 h-4 w-4 transition-transform group-hover:translate-y-0.5"
						/>
					</button>
					<a
						href="/developers"
						class="group inline-flex items-center justify-center rounded-lg border border-border px-6 py-3.5 text-sm font-medium text-foreground transition-all hover:bg-card hover:border-border/80"
					>
						For Developers
						<ArrowRight
							class="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5"
						/>
					</a>
				</div>
			</div>

			<!-- Right side: Phone mockup -->
			<div
				class="relative flex justify-center lg:justify-end animate-fade-in-up delay-400"
			>
				<!-- Phone container with perspective -->
				<div class="phone-showcase">
					<!-- Ambient glow behind phone -->
					<div
						class="absolute inset-0 blur-3xl bg-primary/20 rounded-full scale-75 translate-y-8"
					></div>

					<!-- Phone device -->
					<div class="phone-device">
						<!-- Device frame -->
						<div class="phone-frame">
							<!-- Top notch/speaker area -->
							<div class="phone-notch">
								<div class="phone-speaker"></div>
							</div>

							<!-- Screen -->
							<div class="phone-screen">
								<img
									src="{assets}/images/app1.png"
									alt="Zapstore app showing app discovery interface"
									class="phone-screenshot"
								/>
							</div>

							<!-- Side buttons -->
							<div class="phone-button-volume"></div>
							<div class="phone-button-power"></div>
						</div>

						<!-- Reflection overlay -->
						<div class="phone-reflection"></div>
					</div>

					<!-- Floor reflection -->
					<div class="phone-shadow"></div>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- Pillars Section -->
<section class="py-12 lg:py-16 border-t border-border/50">
	<div class="container mx-auto px-4 sm:px-6 lg:px-8">
		<div
			class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto"
		>
			<!-- Social Discovery -->
			<div class="group">
				<div
					class="relative h-full overflow-hidden rounded-2xl border border-border/50 bg-card/70 backdrop-blur-sm p-6 card-glow card-highlight"
				>
					<div
						class="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/5 to-card opacity-90"
					></div>
					<div
						class="absolute -right-10 -top-10 w-32 h-32 bg-primary/20 blur-3xl opacity-70"
					></div>
					<div class="relative">
						<div
							class="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4"
						>
							<Users class="h-5 w-5 text-primary" />
						</div>
						<h3 class="text-lg font-semibold text-foreground mb-2">
							Social discovery
						</h3>
						<p class="text-sm text-muted-foreground leading-relaxed">
							Find apps through catalogs and people you trust, not opaque
							algorithms. See what your network is using and recommending.
						</p>
					</div>
				</div>
			</div>

			<!-- Verified Apps -->
			<div class="group">
				<div
					class="relative h-full overflow-hidden rounded-2xl border border-border/50 bg-card/70 backdrop-blur-sm p-6 card-glow card-highlight"
				>
					<div
						class="absolute inset-0 bg-gradient-to-br from-emerald-500/20 via-emerald-500/5 to-card opacity-90"
					></div>
					<div
						class="absolute -right-10 -top-10 w-32 h-32 bg-emerald-400/25 blur-3xl opacity-70"
					></div>
					<div class="relative">
						<div
							class="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4"
						>
							<Shield class="h-5 w-5 text-primary" />
						</div>
						<h3 class="text-lg font-semibold text-foreground mb-2">
							Verified apps
						</h3>
						<p class="text-sm text-muted-foreground leading-relaxed">
							Releases are cryptographically signed by the developer. You always
							know exactly who built the software you're installing.
						</p>
					</div>
				</div>
			</div>

			<!-- Support Developers -->
			<div class="group">
				<div
					class="relative h-full overflow-hidden rounded-2xl border border-border/50 bg-card/70 backdrop-blur-sm p-6 card-glow card-highlight"
				>
					<div
						class="absolute inset-0 bg-gradient-to-br from-amber-400/20 via-amber-500/5 to-card opacity-90"
					></div>
					<div
						class="absolute -right-10 -top-10 w-32 h-32 bg-amber-400/25 blur-3xl opacity-70"
					></div>
					<div class="relative">
						<div
							class="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-4"
						>
							<Zap class="h-5 w-5 text-amber-500" />
						</div>
						<h3 class="text-lg font-semibold text-foreground mb-2">
							Support developers
						</h3>
						<p class="text-sm text-muted-foreground leading-relaxed">
							Pay developers in bitcoin with zero fees or middlemen. They keep
							100% – as it should be.
						</p>
					</div>
				</div>
			</div>

			<!-- Open & Decentralized -->
			<div class="group">
				<div
					class="relative h-full overflow-hidden rounded-2xl border border-border/50 bg-card/70 backdrop-blur-sm p-6 card-glow card-highlight"
				>
					<div
						class="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-cyan-500/5 to-card opacity-90"
					></div>
					<div
						class="absolute -right-10 -top-10 w-32 h-32 bg-sky-400/25 blur-3xl opacity-70"
					></div>
					<div class="relative">
						<div
							class="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4"
						>
							<Globe class="h-5 w-5 text-primary" />
						</div>
						<h3 class="text-lg font-semibold text-foreground mb-2">
							Fully open
						</h3>
						<p class="text-sm text-muted-foreground leading-relaxed">
							Open source and built on open protocols. Manage app catalogs or
							create your own. No accounts, no KYC, no vendor lock-in.
						</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- Testimonials Section -->
{#if testimonials.length > 0}
	<section class="py-16 lg:py-20 border-t border-border/50">
		<div class="container mx-auto px-4 sm:px-6 lg:px-8">
			<div class="max-w-2xl mx-auto text-center mb-10">
				<h2 class="text-display text-4xl sm:text-5xl mb-3">
					What people are saying
				</h2>
				<p class="text-muted-foreground">Real posts from the Nostr community</p>
			</div>

			<!-- Masonry Testimonials Grid -->
			<div class="max-w-5xl mx-auto relative pb-16">
				<div class="masonry-grid">
					{#each visibleTestimonials as testimonial (testimonial.id)}
						<a
							href="https://primal.net/e/{testimonial.nevent}"
							target="_blank"
							rel="noopener noreferrer"
							class="note-card group"
						>
							<!-- Author header -->
							<div class="flex items-center gap-3 mb-3">
								<!-- Profile Picture -->
								{#if testimonial.profile?.picture}
									<img
										src={testimonial.profile.picture}
										alt={getDisplayName(testimonial)}
										class="w-10 h-10 rounded-full object-cover"
										loading="lazy"
									/>
								{:else}
									<div
										class="w-10 h-10 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center"
									>
										<span class="text-primary font-semibold">
											{getDisplayName(testimonial).charAt(0).toUpperCase()}
										</span>
									</div>
								{/if}

								<div class="flex-1 min-w-0">
									<div class="flex items-center gap-1.5">
										<span class="font-semibold text-foreground truncate">
											{getDisplayName(testimonial)}
										</span>
									</div>
									{#if testimonial.profile?.nip05}
										<span class="text-sm text-muted-foreground truncate block">
											{testimonial.profile.nip05}
										</span>
									{/if}
								</div>
							</div>

							<!-- Note content -->
							<p
								class="text-base text-foreground leading-relaxed whitespace-pre-wrap"
							>
								{testimonial.content}
							</p>

							<!-- Date -->
							<div class="mt-3">
								<span class="text-sm text-muted-foreground">
									{formatDate(testimonial.created_at)}
								</span>
							</div>
						</a>
					{/each}
				</div>
			</div>
		</div>
	</section>
{/if}

<!-- How It Works Section -->
<section class="py-16 lg:py-20 border-t border-border/50">
	<div class="container mx-auto px-4 sm:px-6 lg:px-8">
		<div class="max-w-2xl mx-auto text-center mb-12">
			<h2 class="text-display text-4xl sm:text-5xl mb-3">How it works</h2>
			<p class="text-muted-foreground">
				Built on Nostr relays — an open network you can customize or self-host.
			</p>
		</div>

		<!-- Steps -->
		<div class="max-w-4xl mx-auto">
			<div class="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 relative">
				<!-- Connector line (desktop only) -->
				<div
					class="hidden md:block absolute top-10 left-[16.67%] right-[16.67%] h-px bg-gradient-to-r from-transparent via-border to-transparent"
				></div>

				<!-- Step 1 -->
				<div class="text-center relative">
					<div
						class="w-20 h-20 mx-auto mb-5 rounded-2xl bg-card border border-border/50 flex items-center justify-center relative z-10"
					>
						<svg
							class="w-8 h-8 text-primary"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="1.5"
								d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
							/>
						</svg>
					</div>
					<h3 class="text-lg font-semibold text-foreground mb-1.5">
						Developers publish to relays
					</h3>
					<p class="text-sm text-muted-foreground">
						Apps are signed and broadcast to the relay network.
					</p>
				</div>

				<!-- Step 2 -->
				<div class="text-center relative">
					<div
						class="w-20 h-20 mx-auto mb-5 rounded-2xl bg-card border border-border/50 flex items-center justify-center relative z-10"
					>
						<svg
							class="w-8 h-8 text-primary"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="1.5"
								d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
							/>
						</svg>
					</div>
					<h3 class="text-lg font-semibold text-foreground mb-1.5">
						Your network shares
					</h3>
					<p class="text-sm text-muted-foreground">
						Apps spread through recommendations from people you follow.
					</p>
				</div>

				<!-- Step 3 -->
				<div class="text-center relative">
					<div
						class="w-20 h-20 mx-auto mb-5 rounded-2xl bg-card border border-border/50 flex items-center justify-center relative z-10"
					>
						<svg
							class="w-8 h-8 text-primary"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="1.5"
								d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
							/>
						</svg>
					</div>
					<h3 class="text-lg font-semibold text-foreground mb-1.5">
						You verify & install
					</h3>
					<p class="text-sm text-muted-foreground">
						Signatures verified automatically. Choose your own relays.
					</p>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- CTA Section -->
<section class="py-16 lg:py-20">
	<div class="container mx-auto px-4 sm:px-6 lg:px-8">
		<div class="relative max-w-3xl mx-auto">
			<!-- Background -->
			<div
				class="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/10 via-card to-card border border-border/50 overflow-hidden"
			>
				<div
					class="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"
				></div>
			</div>

			<!-- Content -->
			<div class="relative px-6 py-12 lg:px-12 lg:py-14 text-center">
				<h2 class="text-display text-4xl sm:text-5xl mb-3">Ready to try it?</h2>
				<p class="text-muted-foreground mb-6 max-w-md mx-auto">
					Download Zapstore and start discovering apps through your network.
				</p>
				<div class="flex flex-col sm:flex-row gap-3 justify-center">
					<button
						on:click={() => (showDownloadModal = true)}
						class="group inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25"
					>
						Download now
						<Download
							class="ml-2 h-4 w-4 transition-transform group-hover:translate-y-0.5"
						/>
					</button>
					<a
						href="/apps"
						class="group inline-flex items-center justify-center rounded-lg border border-border px-6 py-3 text-sm font-medium text-foreground transition-all hover:bg-card hover:border-border/80"
					>
						Browse apps
						<ChevronRight
							class="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5"
						/>
					</a>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- iOS Waitlist Callout -->
<section class="py-14 lg:py-16">
	<div class="container mx-auto px-4 sm:px-6 lg:px-8">
		<div class="relative max-w-4xl mx-auto">
			<!-- Background -->
			<div
				class="absolute inset-0 rounded-3xl bg-gradient-to-br from-sky-500/15 via-slate-900/60 to-card border border-sky-500/25 overflow-hidden"
			>
				<div
					class="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"
				></div>
			</div>

			<!-- Content -->
			<div class="relative px-8 py-12 lg:px-14 lg:py-14">
				<div class="flex flex-col lg:flex-row lg:items-center gap-8">
					<div class="flex-1">
						<div
							class="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-sky-400/30 bg-sky-500/10 text-sm text-sky-100 mb-4"
						>
							<span class="w-2 h-2 rounded-full bg-sky-400 animate-pulse"
							></span>
							Join the waitlist
						</div>
						<h3 class="text-display text-3xl sm:text-4xl lg:text-[2.5rem] mb-3">
							Are you on iOS?
						</h3>
						<p class="text-muted-foreground max-w-2xl leading-relaxed">
							We're designing Zapstore iOS to bypass the App Store and deliver
							an even better UX. Drop an email or npub and we'll share more as
							it gets ready.
						</p>
						<ul
							class="mt-4 space-y-2 text-sm text-muted-foreground list-disc list-inside"
						>
							<li>No 30% cuts, no arbitrary review rules</li>
							<li>
								An Apple Developer account ($99/yr, KYC) will be required for
								users, but not for developers
							</li>
						</ul>
					</div>

					<div class="w-full lg:w-[360px]">
						<form
							class="space-y-3"
							on:submit|preventDefault={handleIosWaitlistSubmit}
						>
							<label class="sr-only" for="ios-contact">Email or npub</label>
							<input
								id="ios-contact"
								name="contact"
								type="text"
								inputmode="text"
								autocomplete="off"
								placeholder="you@example.com or npub1..."
								class="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/60 focus:ring-2 focus:ring-primary/40 transition-colors"
							/>
							<button
								type="submit"
								class="group w-full inline-flex items-center justify-center rounded-lg bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25 disabled:opacity-70 disabled:cursor-not-allowed"
								disabled={iosSubmitting}
							>
								{#if iosSubmitting}
									Submitting...
								{:else}
									Notify me
								{/if}
								<ArrowRight
									class="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5"
								/>
							</button>
							{#if iosWaitlistStatus === "error"}
								<p class="text-sm text-rose-400">{iosWaitlistMessage}</p>
							{:else if iosWaitlistStatus === "success"}
								<p class="text-sm text-emerald-400">{iosWaitlistMessage}</p>
							{/if}
						</form>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

<style>
	/* Phone showcase container */
	.phone-showcase {
		position: relative;
		perspective: 1200px;
		padding: 1rem;
	}

	/* Phone device wrapper with 3D transform */
	.phone-device {
		position: relative;
		transform: rotateY(-8deg) rotateX(2deg) rotateZ(2deg);
		transform-style: preserve-3d;
		transition: transform 0.5s cubic-bezier(0.23, 1, 0.32, 1);
	}

	.phone-device:hover {
		transform: rotateY(-4deg) rotateX(1deg) rotateZ(1deg);
	}

	/* Device frame - premium dark titanium look */
	.phone-frame {
		position: relative;
		width: 220px;
		height: 456px;
		background: linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 50%, #1a1a1a 100%);
		border-radius: 35px;
		padding: 10px;
		box-shadow: 
			/* Inner highlight */
			inset 0 1px 1px rgba(255, 255, 255, 0.1),
			inset 0 -1px 1px rgba(0, 0, 0, 0.3),
			/* Outer frame shadow */ 0 0 0 1px rgba(255, 255, 255, 0.05),
			/* Ambient shadow */ 0 25px 50px -12px rgba(0, 0, 0, 0.8),
			0 12px 24px -8px rgba(0, 0, 0, 0.6),
			/* Primary glow */ 0 0 80px -20px hsl(var(--primary) / 0.3);
	}

	/* Top notch area */
	.phone-notch {
		position: absolute;
		top: 10px;
		left: 50%;
		transform: translateX(-50%);
		width: 94px;
		height: 22px;
		background: #0a0a0a;
		border-radius: 0 0 12px 12px;
		z-index: 10;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.phone-speaker {
		width: 40px;
		height: 3px;
		background: linear-gradient(90deg, #1a1a1a, #252525, #1a1a1a);
		border-radius: 2px;
	}

	/* Screen area */
	.phone-screen {
		width: 100%;
		height: 100%;
		background: #000;
		border-radius: 27px;
		overflow: hidden;
		position: relative;
	}

	.phone-screenshot {
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: top center;
	}

	/* Side buttons */
	.phone-button-volume {
		position: absolute;
		left: -3px;
		top: 94px;
		width: 3px;
		height: 47px;
		background: linear-gradient(180deg, #2a2a2a, #1a1a1a);
		border-radius: 2px 0 0 2px;
	}

	.phone-button-power {
		position: absolute;
		right: -3px;
		top: 118px;
		width: 3px;
		height: 32px;
		background: linear-gradient(180deg, #2a2a2a, #1a1a1a);
		border-radius: 0 2px 2px 0;
	}

	/* Glass reflection overlay */
	.phone-reflection {
		position: absolute;
		inset: 10px;
		border-radius: 27px;
		background: linear-gradient(
			135deg,
			rgba(255, 255, 255, 0.12) 0%,
			rgba(255, 255, 255, 0.05) 20%,
			transparent 40%,
			transparent 100%
		);
		pointer-events: none;
		z-index: 20;
	}

	/* Floor shadow/reflection */
	.phone-shadow {
		position: absolute;
		bottom: -30px;
		left: 50%;
		transform: translateX(-50%) rotateX(80deg) scale(0.9);
		width: 175px;
		height: 80px;
		background: radial-gradient(
			ellipse at center,
			hsl(var(--primary) / 0.15) 0%,
			transparent 70%
		);
		filter: blur(20px);
		opacity: 0.8;
	}

	/* Responsive adjustments */
	@media (max-width: 1024px) {
		.phone-device {
			transform: rotateY(0deg) rotateX(0deg) rotateZ(0deg);
		}

		.phone-device:hover {
			transform: rotateY(0deg) rotateX(0deg) rotateZ(0deg);
		}

		.phone-frame {
			width: 190px;
			height: 395px;
			border-radius: 30px;
			padding: 8px;
		}

		.phone-screen {
			border-radius: 24px;
		}

		.phone-notch {
			width: 82px;
			height: 19px;
			border-radius: 0 0 10px 10px;
		}

		.phone-reflection {
			inset: 8px;
			border-radius: 24px;
		}
	}

	/* Masonry grid layout */
	.masonry-grid {
		columns: 1;
		column-gap: 1rem;
	}

	@media (min-width: 640px) {
		.masonry-grid {
			columns: 2;
		}
	}

	@media (min-width: 1024px) {
		.masonry-grid {
			columns: 3;
		}
	}

	/* Note card - tweet style */
	.note-card {
		display: block;
		break-inside: avoid;
		margin-bottom: 1rem;
		padding: 1.25rem;
		background: hsl(var(--card) / 0.4);
		border: 1px solid hsl(var(--border) / 0.4);
		border-radius: 1rem;
		transition: all 0.2s ease;
		text-decoration: none;
	}

	.note-card:hover {
		border-color: hsl(var(--primary) / 0.3);
		background: hsl(var(--card) / 0.6);
		box-shadow: 0 4px 20px -4px hsl(var(--primary) / 0.1);
	}
</style>
