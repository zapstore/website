<script>
	import { Github, Twitter, MessageSquare } from "lucide-svelte";
	import { assets } from "$app/paths";
</script>

<footer class="border-t border-border/40 bg-background">
	<div class="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
		<div class="grid grid-cols-1 md:grid-cols-4 gap-8">
			<!-- Brand -->
			<div class="col-span-1 md:col-span-2">
				<div class="flex items-center space-x-3 mb-4">
					<img
						src={`${assets}/images/logo-dark.svg`}
						alt="Zapstore"
						class="h-6 w-auto"
					/>
					<span class="font-semibold text-xl">Zapstore</span>
				</div>
			</div>

			<!-- Product -->
			<div>
				<h3 class="font-semibold text-sm mb-4">Product</h3>
				<ul class="space-y-3">
					<li>
						<a
							href="/apps"
							class="text-muted-foreground hover:text-foreground text-sm transition-colors"
						>
							Browse Apps
						</a>
					</li>
					<li>
						<a
							href="/developers"
							class="text-muted-foreground hover:text-foreground text-sm transition-colors"
						>
							For Developers
						</a>
					</li>
					<li>
						<a
							href="/docs"
							class="text-muted-foreground hover:text-foreground text-sm transition-colors"
						>
							Documentation
						</a>
					</li>
					<li>
						<a
							href="/blog"
							class="text-muted-foreground hover:text-foreground text-sm transition-colors"
						>
							Blog
						</a>
					</li>
				</ul>
			</div>

			<!-- Resources -->
			<div>
				<h3 class="font-semibold text-sm mb-4">Resources</h3>
				<ul class="space-y-3">
					<li>
						<a
							href="/docs/quickstart"
							class="text-muted-foreground hover:text-foreground text-sm transition-colors"
						>
							Getting Started
						</a>
					</li>
					<li>
						<a
							href="/docs/faq"
							class="text-muted-foreground hover:text-foreground text-sm transition-colors"
						>
							FAQ
						</a>
					</li>
					<li>
						<a
							href="https://nostr.com"
							class="text-muted-foreground hover:text-foreground text-sm transition-colors"
						>
							Nostr Protocol
						</a>
					</li>
					<li>
						<a
							href="https://github.com/zapstore/zapstore"
							class="text-muted-foreground hover:text-foreground text-sm transition-colors"
						>
							Our Github
						</a>
					</li>
					<li>
						<a
							href="https://signal.group/#CjQKIK20nMOglqNT8KYw4ZeyChsvA14TTcjtjuC2VF6j6nB5EhDLZ7pQHvOeopr36jq431ow"
							class="text-muted-foreground hover:text-foreground text-sm transition-colors"
						>
							Support
						</a>
					</li>
				</ul>
			</div>
		</div>

		<div
			class="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground"
		>
			© {new Date().getFullYear()} Zapstore. Built with freedom tech.
		</div>
	</div>
</footer>
