<script>
	import { page } from "$app/stores";
	import { Menu, X } from "lucide-svelte";
	import { cn } from "$lib/utils";
	import { assets } from "$app/paths";

	let mobileMenuOpen = false;

	function isActive(href) {
		const path = $page.url.pathname;
		if (href === "/") return path === "/";
		return path === href || path.startsWith(href + "/");
	}

	const navigation = [
		{ name: "Zapstore App", href: "/app" },
		{ name: "Developers", href: "/developers" },
		{ name: "Publish", href: "/publish" },
		{ name: "Documentation", href: "/docs" },
		{ name: "Blog", href: "/blog" },
		{ name: "Browse Apps", href: "/apps" },
	];
</script>

<header class="sticky top-0 z-50 w-full border-b border-border/40 bg-header">
	<nav class="container mx-auto px-4 sm:px-6 lg:px-8">
		<div class="flex h-16 items-center justify-between">
			<!-- Logo -->
			<div class="flex items-center">
				<a href="/" class="flex items-center space-x-3">
					<img
						src={`${assets}/images/logo-dark.svg`}
						alt="Zapstore"
						class="h-6 w-auto"
					/>
					<span class="font-semibold text-xl">Zapstore</span>
				</a>
			</div>

			<!-- Desktop Navigation -->
			<div class="hidden md:flex md:items-center md:space-x-8">
				{#each navigation as item}
					<a
						href={item.href}
						class={cn(
							"text-sm font-medium transition-colors hover:text-foreground",
							isActive(item.href) ? "text-foreground" : "text-muted-foreground",
						)}
					>
						{item.name}
					</a>
				{/each}
				<a
					href="https://github.com/zapstore/zapstore"
					class="text-muted-foreground hover:text-foreground transition-colors"
					target="_blank"
					rel="noopener noreferrer"
					aria-label="GitHub"
					title="GitHub"
				>
					<svg
						height="20"
						fill="currentColor"
						viewBox="3 3 18 18"
						class="h-5 w-5"
					>
						<path
							d="M12 3C7.0275 3 3 7.12937 3 12.2276C3 16.3109 5.57625 19.7597 9.15374 20.9824C9.60374 21.0631 9.77249 20.7863 9.77249 20.5441C9.77249 20.3249 9.76125 19.5982 9.76125 18.8254C7.5 19.2522 6.915 18.2602 6.735 17.7412C6.63375 17.4759 6.19499 16.6569 5.8125 16.4378C5.4975 16.2647 5.0475 15.838 5.80124 15.8264C6.51 15.8149 7.01625 16.4954 7.18499 16.7723C7.99499 18.1679 9.28875 17.7758 9.80625 17.5335C9.885 16.9337 10.1212 16.53 10.38 16.2993C8.3775 16.0687 6.285 15.2728 6.285 11.7432C6.285 10.7397 6.63375 9.9092 7.20749 9.26326C7.1175 9.03257 6.8025 8.08674 7.2975 6.81794C7.2975 6.81794 8.05125 6.57571 9.77249 7.76377C10.4925 7.55615 11.2575 7.45234 12.0225 7.45234C12.7875 7.45234 13.5525 7.55615 14.2725 7.76377C15.9937 6.56418 16.7475 6.81794 16.7475 6.81794C17.2424 8.08674 16.9275 9.03257 16.8375 9.26326C17.4113 9.9092 17.76 10.7281 17.76 11.7432C17.76 15.2843 15.6563 16.0687 13.6537 16.2993C13.98 16.5877 14.2613 17.1414 14.2613 18.0065C14.2613 19.2407 14.25 20.2326 14.25 20.5441C14.25 20.7863 14.4188 21.0746 14.8688 20.9824C16.6554 20.364 18.2079 19.1866 19.3078 17.6162C20.4077 16.0457 20.9995 14.1611 21 12.2276C21 7.12937 16.9725 3 12 3Z"
						></path>
					</svg>
				</a>
			</div>

			<!-- Mobile menu button -->
			<div class="flex md:hidden">
				<button
					type="button"
					class="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white/10"
					on:click={() => (mobileMenuOpen = !mobileMenuOpen)}
				>
					<span class="sr-only">Open main menu</span>
					{#if mobileMenuOpen}
						<X class="h-6 w-6" />
					{:else}
						<Menu class="h-6 w-6" />
					{/if}
				</button>
			</div>
		</div>
	</nav>

	<!-- Mobile menu -->
	{#if mobileMenuOpen}
		<div class="md:hidden">
			<div class="space-y-1 px-4 pb-3 pt-2">
				{#each navigation as item}
					<a
						href={item.href}
						class={cn(
							"block rounded-md px-3 py-2 text-base font-medium transition-colors",
							isActive(item.href)
								? "bg-muted text-foreground"
								: "text-muted-foreground hover:bg-muted hover:text-foreground",
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
