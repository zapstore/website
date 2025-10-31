<script>
	import {
		ArrowRight,
		Package,
		Zap,
		Shield,
		Users,
		BarChart,
		Heart,
		FileText,
		Lock,
		BarChart3,
		Search,
		Network,
	} from "lucide-svelte";
	import FeatureCard from "$lib/components/FeatureCard.svelte";
	import MetricCard from "$lib/components/pro/MetricCard.svelte";
	import PreviewChart from "$lib/components/pro/PreviewChart.svelte";
	import CodeDemo from "$lib/components/CodeDemo.svelte";
	import { assets } from "$app/paths";

	let tab = "analytics";
	let zapping = false;
	function triggerZap() {
		zapping = true;
		setTimeout(() => (zapping = false), 1100);
	}
	const demo = {
		analytics: {
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
					label: "Conversion rate",
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
		},
	};
</script>

<svelte:head>
	<title>Developers - Zapstore</title>
</svelte:head>

<!-- Hero Section -->
<section class="relative overflow-hidden bg-brand-gradient-v">
	<div class="absolute inset-0 bg-brand-overlay-soft"></div>
	<div class="container mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
		<div
			class="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
		>
			<!-- Left: Heading and subheading -->
			<div class="max-w-2xl text-center lg:text-left">
				<h1
					class="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight mb-6"
				>
					Turn users into supporters
				</h1>
				<p class="text-lg sm:text-xl text-muted-foreground mb-6">
					Distribute your apps directly to users and monetize instantly.
				</p>
				<p class="text-lg sm:text-xl text-muted-foreground mb-6">
					No arbitrary rules, no platform fees or revenue cuts, no KYC. Your
					app, your community, your sats.
				</p>
				<div
					class="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
				>
					<a
						href="/docs/publish"
						class="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow transition-all hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
					>
						Publish your app
						<ArrowRight class="ml-2 h-4 w-4" />
					</a>
				</div>
			</div>

			<!-- Right: Image -->
			<div class="relative flex justify-center lg:justify-end">
				<div class="relative">
					<div
						class="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-purple-500/10 rounded-3xl blur-3xl scale-110"
					></div>
					<div
						class="relative transform hover:scale-105 transition-transform duration-500 ease-out"
					>
						<img
							src={`${assets}/images/zaps.png`}
							alt="Zaps on Zapstore"
							class="relative z-10 max-w-xs sm:max-w-sm lg:max-w-md xl:max-w-lg w-full h-auto drop-shadow-2xl"
						/>
						<div
							class="absolute inset-0 bg-gradient-to-b from-transparent via-black/5 to-black/20 rounded-2xl transform translate-y-2 blur-lg opacity-60"
						></div>
					</div>
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

<section class="py-20 border-t border-white/10">
	<div class="container mx-auto px-4 sm:px-6 lg:px-8">
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
			<div>
				<h2 class="text-3xl sm:text-4xl font-extrabold mb-6 text-white">
					Integrate in minutes
				</h2>
				<p class="text-lg text-gray-400 mb-6 leading-relaxed">
					Our Zapstore CLI tool makes it easy to publish apps to
					relays&mdash;whether they are locally or remotely hosted, including
					rich metadata that makes your app more discoverable.
				</p>
				<ul class="space-y-3 mb-8">
					<li class="flex items-start">
						<div
							class="h-6 w-6 rounded-full border border-white/10 flex items-center justify-center flex-shrink-0 mt-0.5"
						>
							<div class="h-2 w-2 rounded-full bg-primary"></div>
						</div>
						<span class="ml-3 text-gray-300"
							>Extract metadata from APK and remote sources</span
						>
					</li>
					<li class="flex items-start">
						<div
							class="h-6 w-6 rounded-full border border-white/10 flex items-center justify-center flex-shrink-0 mt-0.5"
						>
							<div class="h-2 w-2 rounded-full bg-primary"></div>
						</div>
						<span class="ml-3 text-gray-300"
							>Supports nsec, NIP-07 and bunker URLs for signing</span
						>
					</li>
					<li class="flex items-start">
						<div
							class="h-6 w-6 rounded-full border border-white/10 flex items-center justify-center flex-shrink-0 mt-0.5"
						>
							<div class="h-2 w-2 rounded-full bg-primary"></div>
						</div>
						<span class="ml-3 text-gray-300"
							>Publish and start receiving zaps in just a few lines of code</span
						>
					</li>
				</ul>

				<!-- CTA Buttons -->
				<div class="flex flex-col sm:flex-row gap-4">
					<a
						href="/docs/publish"
						class="inline-flex items-center justify-center rounded-md bg-primary px-8 py-4 text-base font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
					>
						View documentation
						<ArrowRight class="ml-2 h-5 w-5" />
					</a>
					<a
						href="/docs/faq"
						class="inline-flex items-center justify-center rounded-md border border-white/10 px-8 py-4 text-base font-medium text-white/90 transition-colors hover:bg-white/5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/20"
					>
						FAQ
					</a>
				</div>
			</div>
			<div>
				<CodeDemo />
			</div>
		</div>
	</div>
</section>

<section class="py-24 border-t border-border/40">
	<div class="container mx-auto px-4 sm:px-6 lg:px-8">
		<div class="max-w-3xl mx-auto text-center mb-12">
			<h2 class="text-3xl sm:text-4xl font-extra-bold mb-4">
				Global distribution
			</h2>
			<p class="text-lg text-muted-foreground">
				One submission reaches users on any Android device — borderless and
				location‑agnostic, no additional stores or approvals.
			</p>
		</div>
		<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
			<div class="rounded-xl border border-white/10 bg-white/5 p-6 text-left">
				<h3 class="text-white font-semibold mb-2">
					Your Privacy. Your Identity.
				</h3>
				<p class="text-sm text-muted-foreground">
					Zapstore uses cryptographic signatures — not identity checks — so
					developers stay anonymous by default while users remain secure.
				</p>
				<div class="mt-4 flex items-center justify-center">
					<svg
						viewBox="0 0 120 120"
						width="120"
						height="120"
						aria-hidden="true"
					>
						<defs>
							<radialGradient id="badgeGlow" cx="50%" cy="50%" r="60%">
								<stop offset="0%" stop-color="rgba(99,102,241,0.18)" />
								<stop offset="100%" stop-color="rgba(0,0,0,0)" />
							</radialGradient>
						</defs>
						<circle cx="60" cy="60" r="50" fill="url(#badgeGlow)" />
						<g
							stroke="hsl(var(--muted-foreground))"
							stroke-width="2"
							fill="none"
							stroke-linecap="round"
						>
							<!-- Lock body -->
							<rect
								x="40"
								y="55"
								width="40"
								height="30"
								rx="6"
								fill="hsl(var(--muted)/0.25)"
								stroke="hsl(var(--muted-foreground))"
							/>
							<!-- Shackle (animated close) -->
							<g
								style="transform-origin: 60px 52px; animation: lock-drop 1.2s ease-out infinite;"
							>
								<path d="M48 55 v-8 a12 12 0 0 1 24 0 v8" />
							</g>
						</g>
					</svg>
				</div>
			</div>
			<div class="rounded-xl border border-white/10 bg-white/5 p-6 text-left">
				<h3 class="text-white font-semibold mb-2">No borders</h3>
				<p class="text-sm text-muted-foreground">
					Nostr relays propagate your releases globally — not tied to a country
					or store region.
				</p>
				<!-- Minimal world distribution visual -->
				<div class="mt-4 relative h-36">
					<svg
						viewBox="0 0 400 140"
						class="absolute inset-0 w-full h-full"
						preserveAspectRatio="none"
						aria-hidden="true"
					>
						<defs>
							<pattern
								id="gridLines"
								width="40"
								height="40"
								patternUnits="userSpaceOnUse"
							>
								<path
									d="M 40 0 L 0 0 0 40"
									fill="none"
									stroke="hsl(var(--muted-foreground))"
									stroke-opacity="0.18"
									stroke-width="0.5"
								/>
							</pattern>
							<radialGradient id="mapGlow" cx="60%" cy="40%" r="70%">
								<stop offset="0%" stop-color="rgba(99,102,241,0.18)" />
								<stop offset="100%" stop-color="rgba(0,0,0,0)" />
							</radialGradient>
						</defs>
						<rect width="100%" height="100%" fill="url(#gridLines)" />
						<rect width="100%" height="100%" fill="url(#mapGlow)" />

						<!-- Arcs (animated stroke dash) -->
						<path
							d="M60,95 C140,20 220,20 300,85"
							fill="none"
							stroke="hsl(var(--muted-foreground))"
							stroke-width="1.8"
							stroke-linecap="round"
							style="stroke-dasharray: 240; stroke-dashoffset: 240; animation: arc-dash 2.6s ease-in-out infinite;"
						/>
						<path
							d="M160,60 C210,10 260,15 340,50"
							fill="none"
							stroke="hsl(var(--muted-foreground))"
							stroke-width="1.4"
							stroke-linecap="round"
							style="stroke-dasharray: 200; stroke-dashoffset: 200; animation: arc-dash 3.2s ease-in-out infinite; animation-delay: .3s;"
						/>
						<path
							d="M80,80 C170,40 230,60 320,40"
							fill="none"
							stroke="hsl(var(--muted-foreground))"
							stroke-width="1.2"
							stroke-linecap="round"
							style="stroke-dasharray: 200; stroke-dashoffset: 200; animation: arc-dash 2.2s ease-in-out infinite; animation-delay: .6s;"
						/>

						<!-- Nodes -->
						<g fill="hsl(var(--muted-foreground))">
							<circle
								cx="60"
								cy="95"
								r="3"
								fill="hsl(var(--muted-foreground))"
							/>
							<circle
								cx="160"
								cy="60"
								r="2.5"
								fill="hsl(var(--muted-foreground))"
							/>
							<circle
								cx="300"
								cy="85"
								r="3"
								fill="hsl(var(--muted-foreground))"
							/>
							<circle
								cx="340"
								cy="50"
								r="2.5"
								fill="hsl(var(--muted-foreground))"
							/>
							<circle
								cx="120"
								cy="70"
								r="2.2"
								fill="hsl(var(--muted-foreground))"
							/>
							<circle
								cx="210"
								cy="40"
								r="2.2"
								fill="hsl(var(--muted-foreground))"
							/>
							<circle
								cx="240"
								cy="75"
								r="2.2"
								fill="hsl(var(--muted-foreground))"
							/>
						</g>
					</svg>
				</div>
			</div>
			<div class="rounded-xl border border-white/10 bg-white/5 p-6 text-left">
				<h3 class="text-white font-semibold mb-2">Grow Your Audience</h3>
				<p class="text-sm text-muted-foreground">
					Leverage social discovery to reach new users. Engage with your
					community and receive direct feedback and support.
				</p>
				<div class="mt-4 flex items-center justify-center">
					<svg
						viewBox="0 0 160 100"
						width="160"
						height="100"
						aria-hidden="true"
					>
						<defs>
							<radialGradient id="gateGlow" cx="50%" cy="50%" r="60%">
								<stop offset="0%" stop-color="rgba(99,102,241,0.16)" />
								<stop offset="100%" stop-color="rgba(0,0,0,0)" />
							</radialGradient>
						</defs>
						<circle cx="80" cy="50" r="46" fill="url(#gateGlow)" />
						<!-- Pivot -->
						<circle cx="45" cy="68" r="6" fill="hsl(var(--muted-foreground))" />
						<!-- Barrier arm (lifts up) -->
						<rect
							x="51"
							y="66"
							width="70"
							height="4"
							rx="2"
							fill="hsl(var(--muted-foreground))"
							style="transform-origin: 51px 68px; animation: gate-lift 1.6s ease-in-out infinite;"
						/>
					</svg>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- Premium (Coming soon): Analytics -->
<section class="py-24 border-t border-white/10 bg-brand-gradient-v">
	<div class="container mx-auto px-4 sm:px-6 lg:px-8">
		<div class="text-center mb-10">
			<div
				class="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70 mb-3"
			>
				Premium (Coming soon)
			</div>
			<h2 class="text-3xl sm:text-4xl font-extrabold text-white">Analytics</h2>
			<p class="text-lg text-gray-400 mt-4">
				Preview of the developer dashboard. Aggregated, privacy‑preserving data.
			</p>
		</div>

		<div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
			<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
				{#each demo[tab].metrics as m}
					<MetricCard
						icon={m.icon}
						label={m.label}
						value={m.value}
						delta={m.delta}
					/>
				{/each}
			</div>
			<div class="rounded-xl border border-white/10 bg-white/5 p-6">
				<h3 class="text-white font-semibold mb-3">
					{tab === "analytics"
						? "Installs trend"
						: tab === "aso"
							? "Keyword visibility"
							: "Relay health"}
				</h3>
				<PreviewChart data={demo[tab].chart} />
			</div>
		</div>
	</div>
</section>
