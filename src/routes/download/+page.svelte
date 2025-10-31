<script>
	import { Download, Smartphone, Terminal, Shield } from "lucide-svelte";
	import { assets } from "$app/paths";

	// Android APK
	const ANDROID_APK_URL =
		"https://cdn.zapstore.dev/800b9048974dfcac4e1e1b9afe0812d15e42a08264ba0b8877e22c2e6d2221ae";
	const ANDROID_APK_SHA256 =
		"800b9048974dfcac4e1e1b9afe0812d15e42a08264ba0b8877e22c2e6d2221ae";

	// CLI Binaries
	const CLI_MAC_URL =
		"https://cdn.zapstore.dev/88c82772eee5c262a0a2553f85a569004ebee54b1636f080ec930f314ac01b1d";
	const CLI_MAC_SHA256 =
		"88c82772eee5c262a0a2553f85a569004ebee54b1636f080ec930f314ac01b1d";

	const CLI_LINUX_AMD64_URL =
		"https://cdn.zapstore.dev/6e2c7cf6da53c3f1a78b523a6aacd6316dce3d74ace6f859c2676729ee439990";
	const CLI_LINUX_AMD64_SHA256 =
		"6e2c7cf6da53c3f1a78b523a6aacd6316dce3d74ace6f859c2676729ee439990";

	const CLI_LINUX_AARCH64_URL =
		"https://cdn.zapstore.dev/26ee91aa165695b6d5e81a56c0e095ef681d30843c3fa5a9177edca436b1730d";
	const CLI_LINUX_AARCH64_SHA256 =
		"26ee91aa165695b6d5e81a56c0e095ef681d30843c3fa5a9177edca436b1730d";
</script>

<svelte:head>
	<title>Download Zapstore</title>
</svelte:head>

<!-- Hero -->
<section class="relative overflow-hidden border-b border-white/10">
	<div class="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
		<div class="text-center max-w-3xl mx-auto">
			<h1
				class="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-4"
			>
				Download Zapstore
			</h1>
			<p class="text-lg sm:text-xl text-gray-300 leading-relaxed">
				Get the Android app or the Zapstore CLI for macOS and Linux.
			</p>
		</div>
	</div>
</section>

<!-- Android App -->
<section class="py-16">
	<div class="container mx-auto px-4 sm:px-6 lg:px-8">
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
			<div class="max-w-2xl">
				<div class="flex items-center gap-3 mb-3">
					<Smartphone class="h-6 w-6" />
					<h2 class="text-2xl sm:text-3xl font-bold">Android App</h2>
				</div>
				<p class="text-gray-300 mb-6">Android 10+ (arm64-v8a).</p>
				<div class="flex flex-col sm:flex-row gap-4">
					<a
						href={ANDROID_APK_URL}
						class="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary shadow-lg hover:shadow-xl"
						download
					>
						Download APK
						<Download class="ml-2 h-4 w-4" />
					</a>
				</div>
				<div class="mt-6 text-xs text-gray-400">
					<p class="mt-3">
						<span class="font-bold">Optional:</span> Verify on your terminal:
					</p>
					<pre
						class="mt-1 rounded-md border border-white/10 bg-white/5 p-3 overflow-x-auto text-[12px]"><code
							>shasum -a 256 &lt;downloaded apk file&gt;
# must equal:
{ANDROID_APK_SHA256}</code
						></pre>
					<p class="mt-3">
						APK certificate/hash details are published on our Nostr profile (<a
							class="underline"
							target="_blank"
							rel="noopener noreferrer"
							href="https://npub.world/npub10r8xl2njyepcw2zwv3a6dyufj4e4ajx86hz6v4ehu4gnpupxxp7stjt2p8"
							>open in client</a
						>).
					</p>
				</div>
			</div>
			<div class="relative flex justify-center lg:justify-end">
				<div class="relative">
					<div
						class="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-purple-500/10 rounded-3xl blur-3xl scale-110"
					></div>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- CLI -->
<section class="py-10 border-t border-white/10">
	<div class="container mx-auto px-4 sm:px-6 lg:px-8">
		<div class="flex items-center gap-3 mb-6">
			<Terminal class="h-6 w-6" />
			<h2 class="text-2xl sm:text-3xl font-bold">Zapstore CLI</h2>
		</div>
		<p class="text-gray-300 mb-8">
			Download the standalone binary for your platform. After download, run
			<code class="px-1 py-0.5 rounded bg-white/10">chmod +x zapstore</code> to make
			it executable. Linux binaries should also work in Windows via WSL.
		</p>

		<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
			<!-- macOS (arm64) -->
			<div class="rounded-xl border border-white/10 bg-white/5 p-6">
				<div class="flex items-center gap-2 mb-2">
					<span class="text-md font-bold text-gray-300">macOS (arm64)</span>
				</div>
				<a
					href={CLI_MAC_URL}
					class="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
					download
				>
					Download
					<Download class="ml-2 h-4 w-4" />
				</a>
				<div class="mt-4 text-xs text-gray-400">
					<div class="mb-1 font-semibold text-white/80">SHA-256:</div>
					<pre
						class="whitespace-pre-wrap break-all rounded-md border border-white/10 bg-white/5 p-3 text-[11px]">{CLI_MAC_SHA256}</pre>
					<div class="mt-2">Verify:</div>
					<pre
						class="mt-1 rounded-md border border-white/10 bg-white/5 p-3 overflow-x-auto text-[12px]"><code
							>curl -sL {CLI_MAC_URL} -o zapstore
shasum -a 256 zapstore # must equal
{CLI_MAC_SHA256}
chmod +x zapstore</code
						></pre>
				</div>
			</div>

			<!-- Linux amd64 -->
			<div class="rounded-xl border border-white/10 bg-white/5 p-6">
				<div class="flex items-center gap-2 mb-2">
					<span class="text-md font-bold text-gray-300">Linux (amd64)</span>
				</div>
				<a
					href={CLI_LINUX_AMD64_URL}
					class="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
					download
				>
					Download
					<Download class="ml-2 h-4 w-4" />
				</a>
				<div class="mt-4 text-xs text-gray-400">
					<div class="mb-1 font-semibold text-white/80">SHA-256:</div>
					<pre
						class="whitespace-pre-wrap break-all rounded-md border border-white/10 bg-white/5 p-3 text-[11px]">{CLI_LINUX_AMD64_SHA256}</pre>
					<div class="mt-2">Verify:</div>
					<pre
						class="mt-1 rounded-md border border-white/10 bg-white/5 p-3 overflow-x-auto text-[12px]"><code
							>curl -sL {CLI_LINUX_AMD64_URL} -o zapstore
shasum -a 256 zapstore # must equal
{CLI_LINUX_AMD64_SHA256}
chmod +x zapstore</code
						></pre>
					<p class="mt-2 text-[11px] text-gray-400">
						Requires SQLite! On Debian-based systems you can install via: <code
							class="px-1 py-0.5 rounded bg-white/10"
							>sudo apt install libsqlite3-dev</code
						>
					</p>
				</div>
			</div>

			<!-- Linux aarch64 -->
			<div class="rounded-xl border border-white/10 bg-white/5 p-6">
				<div class="flex items-center gap-2 mb-2">
					<span class="text-md font-bold text-gray-300">Linux (aarch64)</span>
				</div>
				<a
					href={CLI_LINUX_AARCH64_URL}
					class="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
					download
				>
					Download
					<Download class="ml-2 h-4 w-4" />
				</a>
				<div class="mt-4 text-xs text-gray-400">
					<div class="mb-1 font-semibold text-white/80">SHA-256:</div>
					<pre
						class="whitespace-pre-wrap break-all rounded-md border border-white/10 bg-white/5 p-3 text-[11px]">{CLI_LINUX_AARCH64_SHA256}</pre>
					<div class="mt-2">Verify:</div>
					<pre
						class="mt-1 rounded-md border border-white/10 bg-white/5 p-3 overflow-x-auto text-[12px]"><code
							>curl -sL {CLI_LINUX_AARCH64_URL} -o zapstore
shasum -a 256 zapstore # must equal
{CLI_LINUX_AARCH64_SHA256}
chmod +x zapstore</code
						></pre>
					<p class="mt-2 text-[11px] text-gray-400">
						Requires SQLite! On Debian-based systems you can install via: <code
							class="px-1 py-0.5 rounded bg-white/10"
							>sudo apt install libsqlite3-dev</code
						>
					</p>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- Security note -->
<section class="py-10 border-t border-white/10">
	<div class="container mx-auto px-4 sm:px-6 lg:px-8">
		<div
			class="rounded-xl border border-white/10 bg-white/5 p-6 flex items-start gap-4"
		>
			<div
				class="w-10 h-10 rounded-lg border border-white/10 bg-white/5 flex items-center justify-center"
			>
				<Shield class="h-5 w-5" />
			</div>
			<div class="text-sm text-gray-300">
				<p class="mb-1 font-semibold text-white/90">
					Verification best practices
				</p>
				<p class="text-gray-400">
					For cryptographic verification, ensure hashes are published on a
					domain different from the file host. The SHA-256 values above are
					embedded in the CDN URL path for convenience and published here for
					visibility.
				</p>
			</div>
		</div>
	</div>
</section>
