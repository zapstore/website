<script>
	import { ArrowRight, Zap, Lock, Globe, BarChart3 } from "lucide-svelte";
	import MetricCard from "$lib/components/pro/MetricCard.svelte";
	import PreviewChart from "$lib/components/pro/PreviewChart.svelte";
	import CodeDemo from "$lib/components/CodeDemo.svelte";
	import { assets } from "$app/paths";

	const demo = {
		chart: [4, 6, 5, 7, 9, 11, 10, 12, 14],
		metrics: [
			{
				icon: BarChart3,
				label: "Listings",
				value: "12,438",
				delta: { pct: 8, up: true },
			},
			{
				icon: BarChart3,
				label: "Installs",
				value: "3,219",
				delta: { pct: 3, up: true },
			},
			{
				icon: BarChart3,
				label: "Conversion",
				value: "25.9%",
				delta: { pct: 1.2, up: true },
			},
			{
				icon: BarChart3,
				label: "DAU",
				value: "8,421",
				delta: { pct: 5, up: true },
			},
		],
	};
</script>

<svelte:head>
	<title>Developers — Zapstore</title>
	<meta name="description" content="Publish without permission" />
</svelte:head>

<!-- Hero Section -->
<section class="relative overflow-hidden py-16 lg:py-20">
	<div
		class="absolute top-0 right-1/4 w-[500px] h-[400px] gradient-orb bg-primary/15"
	></div>

	<div class="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
			<!-- Left: Text -->
			<div class="max-w-xl">
				<h1
					class="text-display-lg text-4xl sm:text-5xl lg:text-6xl mb-6"
				>
					Publish <span class="text-primary">without permission</span>
				</h1>

				<p class="text-lg text-muted-foreground mb-8 leading-relaxed">
					No arbitrary review rules, no permissioned accounts, no 30% cuts — sign your app, ship it to
					users and keep all of your revenue.
				</p>

				<div class="flex flex-col sm:flex-row gap-4">
					<a
						href="/docs/publish"
						class="group inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3.5 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25"
					>
						Start publishing
						<ArrowRight
							class="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5"
						/>
					</a>
				</div>
			</div>

			<!-- Right: Image -->
			<div class="relative flex justify-center lg:justify-end">
				<div class="relative">
					<!-- Ambient glow -->
					<div
						class="absolute inset-0 bg-gradient-to-br from-amber-500/20 via-transparent to-primary/10 rounded-3xl blur-3xl scale-110"
					></div>

					<!-- Decorative frame -->
					<div class="relative p-4">
						<!-- Corner accents -->
						<div
							class="absolute top-0 left-0 w-16 h-16 border-l-2 border-t-2 border-amber-500/40 rounded-tl-2xl"
						></div>
						<div
							class="absolute top-0 right-0 w-16 h-16 border-r-2 border-t-2 border-primary/40 rounded-tr-2xl"
						></div>
						<div
							class="absolute bottom-0 left-0 w-16 h-16 border-l-2 border-b-2 border-primary/40 rounded-bl-2xl"
						></div>
						<div
							class="absolute bottom-0 right-0 w-16 h-16 border-r-2 border-b-2 border-amber-500/40 rounded-br-2xl"
						></div>

						<!-- Floating zap icons -->
						<div
							class="absolute -top-3 -right-3 w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center"
						>
							<Zap class="w-4 h-4 text-amber-500" />
						</div>
						<div
							class="absolute -bottom-3 -left-3 w-8 h-8 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center"
						>
							<Zap class="w-4 h-4 text-primary" />
						</div>

						<!-- Image -->
						<img
							src={`${assets}/images/zaps.png`}
							alt="Zaps on Zapstore"
							class="relative z-10 max-w-xs sm:max-w-sm lg:max-w-md drop-shadow-2xl"
						/>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- Integration Section -->
<section class="py-16 lg:py-20 border-t border-border/50">
	<div class="container mx-auto px-4 sm:px-6 lg:px-8">
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
			<div class="max-w-xl">
				<h2 class="text-display text-3xl sm:text-4xl mb-6">
					Publish in minutes
				</h2>
				<p class="text-lg text-muted-foreground mb-8 leading-relaxed">
					The CLI extracts metadata from your APK and publishes to relays. One
					command and you're live.
				</p>

				<ul class="space-y-4 mb-8">
					<li class="flex items-start gap-3">
						<div
							class="w-6 h-6 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5"
						>
							<div class="w-2 h-2 rounded-full bg-primary"></div>
						</div>
						<span class="text-muted-foreground"
							>Auto-extracts icons, descriptions, and screenshots</span
						>
					</li>
					<li class="flex items-start gap-3">
						<div
							class="w-6 h-6 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5"
						>
							<div class="w-2 h-2 rounded-full bg-primary"></div>
						</div>
						<span class="text-muted-foreground"
							>Sign with your Nostr key (nsec, NIP-07, or bunker)</span
						>
					</li>
					<li class="flex items-start gap-3">
						<div
							class="w-6 h-6 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5"
						>
							<div class="w-2 h-2 rounded-full bg-primary"></div>
						</div>
						<span class="text-muted-foreground"
							>Your app is live and discoverable immediately</span
						>
					</li>
				</ul>

				<div class="flex flex-col sm:flex-row gap-4">
					<a
						href="/docs/publish"
						class="group inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3.5 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25"
					>
						Read the docs
						<ArrowRight
							class="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5"
						/>
					</a>
				</div>
			</div>

			<div>
				<CodeDemo />
			</div>
		</div>
	</div>
</section>

<!-- Value Props Section -->
<section class="py-16 lg:py-20 border-t border-border/50">
	<div class="container mx-auto px-4 sm:px-6 lg:px-8">
		<div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
			<!-- No Gatekeepers -->
			<div
				class="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-8 card-glow"
			>
				<div
					class="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6"
				>
					<Globe class="h-6 w-6 text-primary" />
				</div>
				<h3 class="text-lg font-semibold text-foreground mb-3">
					No gatekeepers, no KYC
				</h3>
				<p class="text-sm text-muted-foreground leading-relaxed">
					Publish directly to relays. Your app goes live when you say so — no
					approval queue, no waiting.
				</p>
			</div>

			<!-- Keep 100% -->
			<div
				class="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-8 card-glow"
			>
				<div
					class="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-6"
				>
					<Zap class="h-6 w-6 text-amber-500" />
				</div>
				<h3 class="text-lg font-semibold text-foreground mb-3">Keep 100%</h3>
				<p class="text-sm text-muted-foreground leading-relaxed">
					Receive bitcoin zaps directly from users. No platform cut, no payment
					processing fees.
				</p>
			</div>

			<!-- Build Community -->
			<div
				class="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-8 card-glow"
			>
				<div
					class="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6"
				>
					<Lock class="h-6 w-6 text-primary" />
				</div>
				<h3 class="text-lg font-semibold text-foreground mb-3">
					Build your community
				</h3>
				<p class="text-sm text-muted-foreground leading-relaxed">
					Engage users directly on Nostr. Get feedback, announce updates, and
					grow your audience organically.
				</p>
			</div>
		</div>
	</div>
</section>

<!-- Analytics Preview Section -->
<section class="py-16 lg:py-20 border-t border-border/50">
	<div class="container mx-auto px-4 sm:px-6 lg:px-8">
		<div class="text-center mb-12">
			<div
				class="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border/50 bg-card/50 text-sm text-muted-foreground mb-4"
			>
				Pro &bull; Coming soon
			</div>
			<h2 class="text-display text-3xl sm:text-4xl mb-4">
				Developer analytics
			</h2>
			<p class="text-lg text-muted-foreground max-w-xl mx-auto">
				Aggregated, privacy-preserving insights into your app's performance.
			</p>
		</div>

		<div class="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
			<div class="grid grid-cols-2 gap-4">
				{#each demo.metrics as m}
					<MetricCard
						icon={m.icon}
						label={m.label}
						value={m.value}
						delta={m.delta}
					/>
				{/each}
			</div>
			<div
				class="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-6"
			>
				<h3 class="text-foreground font-semibold mb-4">Installs trend</h3>
				<PreviewChart data={demo.chart} />
			</div>
		</div>
	</div>
</section>

<!-- ReachKit Callout Section -->
<section class="py-16 lg:py-20 border-t border-border/50">
	<div class="container mx-auto px-4 sm:px-6 lg:px-8">
		<div class="relative max-w-4xl mx-auto">
			<!-- Background glow -->
			<div
				class="absolute inset-0 rounded-3xl bg-gradient-to-br from-amber-500/10 via-card to-card border border-amber-500/20 overflow-hidden"
			>
				<div
					class="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"
				></div>
			</div>

			<!-- Content -->
			<div class="relative px-8 py-12 lg:px-16 lg:py-16">
				<div class="flex flex-col lg:flex-row lg:items-center gap-8">
					<div class="flex-1">
						<div
							class="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 text-sm text-amber-400 mb-4"
						>
							<span class="w-2 h-2 rounded-full bg-amber-400 animate-pulse"
							></span>
							Coming Soon
						</div>
						<h2
							class="text-display text-3xl sm:text-4xl lg:text-[2.75rem] mb-4"
						>
							Need to distribute everywhere?
						</h2>
						<p class="text-muted-foreground mb-6 max-w-xl leading-relaxed">
							<strong class="text-foreground">ReachKit</strong> uses AI to
							predict app store rejections before you submit. Validate once,
							ship to
							<strong class="text-foreground">every major mobile store</strong> —
							App Store, Google Play, F-Droid, Zapstore, and more.
						</p>
						<a
							href="/developers/reachkit"
							class="group inline-flex items-center gap-2 text-amber-400 font-medium hover:text-amber-300 transition-colors"
						>
							Learn about ReachKit
							<ArrowRight
								class="h-4 w-4 transition-transform group-hover:translate-x-0.5"
							/>
						</a>
					</div>

					<div class="lg:w-72 flex-shrink-0">
						<!-- ReachKit Logo -->
						<div
							class="w-20 h-20 mx-auto lg:mx-0 rounded-2xl bg-card border border-amber-500/30 flex items-center justify-center shadow-lg shadow-amber-500/10"
						>
							<svg width="48" height="48" viewBox="0 0 32 32" fill="none">
								<defs>
									<linearGradient
										id="callout-gradient"
										x1="0%"
										y1="0%"
										x2="100%"
										y2="100%"
									>
										<stop offset="0%" style="stop-color:#FFB800" />
										<stop offset="100%" style="stop-color:#FF6B35" />
									</linearGradient>
								</defs>
								<path
									d="M4 16L12 8L20 16L12 24L4 16Z"
									fill="url(#callout-gradient)"
								/>
								<path
									d="M12 16L20 8L28 16L20 24L12 16Z"
									fill="url(#callout-gradient)"
									opacity="0.6"
								/>
							</svg>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>
