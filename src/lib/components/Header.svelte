<script>
	import { page } from "$app/stores";
	import {
		Menu,
		X,
		User,
		LogIn,
		LogOut,
		Loader2,
		ChevronDown,
	} from "lucide-svelte";
	import { cn } from "$lib/utils";
	import { assets } from "$app/paths";
	import { onMount } from "svelte";
	import { authStore, connect, disconnect } from "$lib/stores/auth.js";

	let mobileMenuOpen = false;
	let scrolled = false;
	let dropdownOpen = false;

	// Close dropdown when clicking outside
	function handleClickOutside(event) {
		if (dropdownOpen && !event.target.closest(".profile-dropdown")) {
			dropdownOpen = false;
		}
	}

	onMount(() => {
		const handleScroll = () => {
			scrolled = window.scrollY > 10;
		};
		window.addEventListener("scroll", handleScroll, { passive: true });
		document.addEventListener("click", handleClickOutside);
		return () => {
			window.removeEventListener("scroll", handleScroll);
			document.removeEventListener("click", handleClickOutside);
		};
	});

	function isActive(href) {
		const path = $page.url.pathname;
		if (href === "/") return path === "/";
		return path === href || path.startsWith(href + "/");
	}

	async function handleSignIn() {
		try {
			await connect();
		} catch (err) {
			console.error("Sign in failed:", err);
		}
	}

	function handleSignOut() {
		disconnect();
		dropdownOpen = false;
	}

	function toggleDropdown(e) {
		e.stopPropagation();
		dropdownOpen = !dropdownOpen;
	}

	const navigation = [
		{ name: "Developers", href: "/developers" },
		{ name: "Docs", href: "/docs" },
		{ name: "Blog", href: "/blog" },
		{ name: "Apps", href: "/apps" },
	];
</script>

<header
	class={cn(
		"sticky top-0 z-50 w-full transition-all duration-300",
		scrolled
			? "bg-background/80 backdrop-blur-xl border-b border-border/50"
			: "bg-transparent border-b border-transparent",
	)}
>
	<nav class="container mx-auto px-4 sm:px-6 lg:px-8">
		<div class="flex h-16 items-center justify-between">
			<!-- Logo -->
			<div class="flex items-center">
				<a href="/" class="flex items-center gap-2.5 group">
					<img
						src={`${assets}/images/logo-dark.svg`}
						alt="Zapstore"
						class="h-6 w-auto"
					/>
					<span class="font-semibold text-lg tracking-tight">Zapstore</span>
				</a>
			</div>

			<!-- Desktop Navigation -->
			<div class="hidden md:flex md:items-center md:gap-1">
				{#each navigation as item}
					<a
						href={item.href}
						class={cn(
							"group relative px-3 py-2 text-sm font-medium transition-colors",
							isActive(item.href)
								? "text-foreground"
								: "text-muted-foreground hover:text-foreground",
						)}
					>
						{item.name}
						<span
							class={cn(
								"absolute bottom-0 left-3 right-3 bg-primary transition-all duration-200",
								isActive(item.href)
									? "h-[2px] opacity-100"
									: "h-px opacity-0 group-hover:opacity-100",
							)}
						></span>
					</a>
				{/each}

				<div class="ml-2 pl-2 flex items-center gap-3">
					<!-- Auth Section -->
					{#if $authStore.isConnecting}
						<div class="p-2">
							<Loader2 class="h-5 w-5 animate-spin text-muted-foreground" />
						</div>
					{:else if $authStore.isConnected}
						<!-- Profile Avatar with Dropdown -->
						<div class="relative profile-dropdown">
							<button
								type="button"
								on:click={toggleDropdown}
								class="flex items-center gap-1.5 p-1 rounded-full hover:bg-white/5 transition-colors"
								aria-label="User menu"
							>
								{#if $authStore.profile?.picture}
									<img
										src={$authStore.profile.picture}
										alt={$authStore.profile.displayName ||
											$authStore.profile.name ||
											"Profile"}
										class="h-8 w-8 rounded-full object-cover bg-muted ring-2 ring-transparent hover:ring-primary/50 transition-all"
									/>
								{:else}
									<div
										class="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center ring-2 ring-transparent hover:ring-primary/50 transition-all"
									>
										<User class="h-4 w-4 text-primary" />
									</div>
								{/if}
								<ChevronDown class="h-3 w-3 text-muted-foreground" />
							</button>

							<!-- Dropdown Menu -->
							{#if dropdownOpen}
								<div
									class="absolute right-0 mt-2 w-48 rounded-lg bg-card border border-border shadow-lg py-1 z-50"
								>
									<a
										href="/p/{$authStore.npub}"
										class="flex items-center gap-2 px-4 py-2.5 text-sm text-foreground hover:bg-white/5 transition-colors"
										on:click={() => (dropdownOpen = false)}
									>
										<User class="h-4 w-4" />
										View my profile
									</a>
									<div class="border-t border-border my-1"></div>
									<button
										type="button"
										on:click={handleSignOut}
										class="flex items-center gap-2 px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors w-full text-left"
									>
										<LogOut class="h-4 w-4" />
										Disconnect
									</button>
								</div>
							{/if}
						</div>
					{:else}
						<!-- Sign In Button -->
						<button
							type="button"
							on:click={handleSignIn}
							class="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-white/5"
						>
							<LogIn class="h-4 w-4" />
							<span class="hidden sm:inline">Sign in</span>
						</button>
					{/if}
				</div>
			</div>

			<!-- Mobile menu button -->
			<div class="flex items-center gap-2 md:hidden">
				<!-- Mobile Auth -->
				{#if $authStore.isConnecting}
					<div class="p-2">
						<Loader2 class="h-5 w-5 animate-spin text-muted-foreground" />
					</div>
				{:else if $authStore.isConnected}
					<div class="relative profile-dropdown">
						<button
							type="button"
							on:click={toggleDropdown}
							class="p-1 rounded-full"
							aria-label="User menu"
						>
							{#if $authStore.profile?.picture}
								<img
									src={$authStore.profile.picture}
									alt="Profile"
									class="h-8 w-8 rounded-full object-cover bg-muted"
								/>
							{:else}
								<div
									class="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center"
								>
									<User class="h-4 w-4 text-primary" />
								</div>
							{/if}
						</button>

						{#if dropdownOpen}
							<div
								class="absolute right-0 mt-2 w-48 rounded-lg bg-card border border-border shadow-lg py-1 z-50"
							>
								<a
									href="/p/{$authStore.npub}"
									class="flex items-center gap-2 px-4 py-2.5 text-sm text-foreground hover:bg-white/5 transition-colors"
									on:click={() => {
										dropdownOpen = false;
										mobileMenuOpen = false;
									}}
								>
									<User class="h-4 w-4" />
									View my profile
								</a>
								<div class="border-t border-border my-1"></div>
								<button
									type="button"
									on:click={handleSignOut}
									class="flex items-center gap-2 px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors w-full text-left"
								>
									<LogOut class="h-4 w-4" />
									Disconnect
								</button>
							</div>
						{/if}
					</div>
				{:else}
					<button
						type="button"
						on:click={handleSignIn}
						class="p-2 text-muted-foreground hover:text-foreground transition-colors"
						aria-label="Sign in"
					>
						<LogIn class="h-5 w-5" />
					</button>
				{/if}

				<button
					type="button"
					class="inline-flex items-center justify-center rounded-lg p-2 text-muted-foreground hover:bg-white/5 hover:text-foreground transition-colors"
					on:click={() => (mobileMenuOpen = !mobileMenuOpen)}
				>
					<span class="sr-only">Open main menu</span>
					{#if mobileMenuOpen}
						<X class="h-5 w-5" />
					{:else}
						<Menu class="h-5 w-5" />
					{/if}
				</button>
			</div>
		</div>
	</nav>

	<!-- Mobile menu -->
	{#if mobileMenuOpen}
		<div
			class="md:hidden border-t border-border/50 bg-background/95 backdrop-blur-xl"
		>
			<div class="space-y-1 px-4 py-4">
				{#each navigation as item}
					<a
						href={item.href}
						class={cn(
							"block rounded-lg px-4 py-2.5 text-base font-medium transition-colors",
							isActive(item.href)
								? "bg-primary/10 text-foreground"
								: "text-muted-foreground hover:bg-white/5 hover:text-foreground",
						)}
						on:click={() => (mobileMenuOpen = false)}
					>
						{item.name}
					</a>
				{/each}
			</div>
		</div>
	{/if}
</header>
