<script>
	import { onMount } from 'svelte';
	import { 
		AlertCircle, 
		CheckCircle, 
		Loader2, 
		Upload, 
		FileCode,
		Image as ImageIcon,
		GitBranch,
		FileText,
		Scale,
		Zap
	} from 'lucide-svelte';

	// Connection state
	let nostrExtensionFound = false;
	let userPubkey = null;
	let isLoading = false;
	let statusMessage = 'Checking for NIP-07 extension...';
	let statusType = 'info'; // 'info', 'success', 'error', 'loading'
	
	// Form state
	let apkUrl = '';
	let iconUrl = '';
	let repository = '';
	let description = '';
	let license = '';
	let isExistingApp = false;
	
	// Publishing state
	let currentSessionData = null;
	let events = [];

	// Reactive derived state
	$: nostrConnected = !!userPubkey;
	$: showUploadForm = nostrConnected;
	$: showEvents = events.length > 0 && currentSessionData;
	$: canConnect = nostrExtensionFound && !nostrConnected;

	onMount(() => {
		checkNostrExtension();
	});

	async function checkNostrExtension() {
		if (typeof window.nostr !== 'undefined') {
			nostrExtensionFound = true;
			statusMessage = 'Ready to publish! Connect your Nostr extension to get started.\n\nInstructions:\n1. Connect your NIP-07 extension (Alby, nos2x, etc.)\n2. Fill out the form\n3. Review the generated events\n4. Sign and publish!';
			statusType = 'info';
		} else {
			nostrExtensionFound = false;
			statusMessage = 'No NIP-07 extension found. Please install Alby, nos2x, or similar extension.';
			statusType = 'error';
			setTimeout(checkNostrExtension, 2000);
		}
	}

	async function connectNostr() {
		try {
			userPubkey = await window.nostr.getPublicKey();
			if (!userPubkey) {
				throw new Error('No public key returned from extension');
			}

			statusMessage = 'Connected to extension, verifying access...';
			statusType = 'loading';
			
			const response = await fetch('https://publisher.zapstore.dev/api/accept', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ npub: userPubkey })
			});

			// Check if response is JSON
			const contentType = response.headers.get('content-type');
			if (!contentType || !contentType.includes('application/json')) {
				const text = await response.text();
				console.error('Non-JSON response:', text);
				throw new Error(`API endpoint not available (got ${response.status}). Is the backend running?`);
			}

			const data = await response.json();
			if (!response.ok) {
				throw new Error(data.error || 'Access check failed');
			}

			if (data.accept === true || data.exists === true) {
				statusMessage = `Connected to Nostr!\n\nYour pubkey: ${userPubkey}\n\nAccess granted. You can now publish APK files!`;
				statusType = 'success';
			} else {
				userPubkey = null;
				statusMessage = 'Access denied. Please contact Zapstore for publishing access.';
				statusType = 'error';
			}
		} catch (error) {
			console.error('Nostr connection error:', error);
			userPubkey = null;
			
			statusMessage = error.message.includes('User rejected')
				? 'Connection rejected. Please approve the connection request in your Nostr extension.'
				: `Failed to connect: ${error.message}`;
			statusType = 'error';
		}
	}

	function validateUrl(url, fieldName) {
		if (!url) {
			throw new Error(`Please provide ${fieldName}!`);
		}
		if (!url.startsWith('http://') && !url.startsWith('https://')) {
			throw new Error(`${fieldName} must be a valid HTTP/HTTPS URL!`);
		}
	}

	async function publishApk() {
		if (!nostrConnected) {
			statusMessage = 'Please connect your Nostr extension first!';
			statusType = 'error';
			return;
		}

		try {
			// Validate required fields
			validateUrl(apkUrl, 'APK URL');
			
			if (!isExistingApp) {
				validateUrl(repository, 'Repository URL');
				validateUrl(iconUrl, 'Icon URL');
			}

			isLoading = true;
			statusMessage = 'Fetching APK from URL...';
			statusType = 'loading';

			const requestData = {
				apkUrl,
				npub: userPubkey,
				isExistingApp
			};

			if (!isExistingApp) {
				Object.assign(requestData, { 
					repository, 
					iconUrl,
					...(description && { description }),
					...(license && { license })
				});
			}

			const response = await fetch('https://publisher.zapstore.dev/api/process', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(requestData)
			});

			const result = await response.json();
			if (!response.ok) {
				throw new Error(result.error || 'Processing failed');
			}

			currentSessionData = result;
			events = result.events;
			statusMessage = 'APK processed! Please review the events below and click SIGN to continue.';
			statusType = 'success';
		} catch (error) {
			statusMessage = `Error: ${error.message}`;
			statusType = 'error';
		} finally {
			isLoading = false;
		}
	}

	async function signAndPublishEvents() {
		if (!currentSessionData) {
			statusMessage = 'No session data available. Please upload an APK first.';
			statusType = 'error';
			return;
		}

		try {
			isLoading = true;
			statusMessage = 'Please approve each event in your Nostr extension...';
			statusType = 'loading';

			const signedEvents = await Promise.all(
				currentSessionData.events.map((event, i) => {
					statusMessage = `Signing event ${i + 1}/${currentSessionData.events.length}...`;
					return window.nostr.signEvent(event);
				})
			);

			statusMessage = 'Sending signed events to relays...';
			
			const response = await fetch('https://publisher.zapstore.dev/api/publish', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					sessionId: currentSessionData.sessionId,
					signedEvents
				})
			});

			const result = await response.json();
			if (!response.ok) {
				throw new Error(result.error || 'Publishing failed');
			}

			statusMessage = `Success! APK published to Zapstore!\n\n${result.message}\n\nYour app is now available on the decentralized app store!`;
			statusType = 'success';

			// Reset form
			clearForm();
		} catch (error) {
			statusMessage = `Error: ${error.message}`;
			statusType = 'error';
		} finally {
			isLoading = false;
		}
	}

	function clearForm() {
		apkUrl = '';
		repository = '';
		iconUrl = '';
		description = '';
		license = '';
		isExistingApp = false;
		currentSessionData = null;
		events = [];
	}

	const eventKindDescriptions = {
		32267: 'Application Description',
		30063: 'Release Event',
		1063: 'Asset Event (File Metadata)'
	};

	function getKindDescription(kind) {
		return eventKindDescriptions[kind] || `Unknown Kind ${kind}`;
	}
</script>

<svelte:head>
	<title>Publish APK - Zapstore</title>
	<meta name="description" content="Publish your Android app to Zapstore's decentralized app store powered by Nostr" />
</svelte:head>

<div class="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-4xl">
	<!-- Header -->
	<div class="text-center mb-12">
		<h1 class="text-4xl sm:text-5xl font-extrabold mb-4 text-white">
			Publish APK
		</h1>
		<p class="text-lg text-gray-400 max-w-2xl mx-auto">
			Publish your Android app to Zapstore
		</p>
		<div class="mt-4 text-sm text-gray-500">
			For more publishing options, download <a href="/download" class="text-primary hover:text-primary/80 underline">Zapstore CLI</a>
		</div>
	</div>

	<!-- Nostr Connection Status -->
	<div class="mb-8 rounded-xl border border-white/10 bg-card p-6">
		<div class="flex items-start gap-3 mb-4">
			<div class="flex-shrink-0 mt-1">
				{#if nostrConnected}
					<CheckCircle class="h-5 w-5 text-green-500" />
				{:else if nostrExtensionFound}
					<CheckCircle class="h-5 w-5 text-green-500" />
				{:else}
					<AlertCircle class="h-5 w-5 text-red-500" />
				{/if}
			</div>
			<div class="flex-1">
				<h3 class="text-lg font-semibold text-white mb-2">Nostr Connection Status</h3>
				<p class="text-sm text-gray-400">
					{#if nostrConnected}
						Connected: <code class="text-xs bg-muted px-2 py-1 rounded">{userPubkey.substring(0, 16)}...</code>
					{:else if nostrExtensionFound}
						NIP-07 extension detected!
					{:else}
						No NIP-07 extension found
					{/if}
				</p>
			</div>
		</div>
		
		{#if !nostrConnected}
			<button
				on:click={connectNostr}
				disabled={!canConnect}
				class="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
			>
				<Zap class="mr-2 h-4 w-4" />
				Connect Nostr Extension
			</button>
		{/if}
	</div>

	<!-- Upload Form -->
	{#if showUploadForm}
		<div class="mb-8 rounded-xl border border-white/10 bg-card p-6">
			<h3 class="text-lg font-semibold text-white mb-6">App Details</h3>
			
			<!-- APK URL -->
			<div class="mb-6">
				<label for="apk-url" class="block text-sm font-medium text-white mb-2">
					<div class="flex items-center gap-2">
						<Upload class="h-4 w-4" />
						APK URL *
					</div>
				</label>
				<input
					type="url"
					id="apk-url"
					bind:value={apkUrl}
					placeholder="https://example.com/app.apk"
					required
					class="w-full px-4 py-3 bg-muted border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
				/>
			</div>

			<!-- Existing App Checkbox -->
			<div class="mb-6">
				<label class="flex items-start gap-3 cursor-pointer">
					<input
						type="checkbox"
						bind:checked={isExistingApp}
						class="mt-1 h-4 w-4 rounded border-white/10 bg-muted text-primary focus:ring-2 focus:ring-primary focus:ring-offset-0"
					/>
					<span class="text-sm text-gray-400">
						App already exists on relay, I am publishing a new release
					</span>
				</label>
			</div>

			<!-- Remaining Fields (hidden when publishing to existing app) -->
			{#if !isExistingApp}
				<div class="space-y-6">
					<!-- Icon URL -->
					<div>
						<label for="icon-url" class="block text-sm font-medium text-white mb-2">
							<div class="flex items-center gap-2">
								<ImageIcon class="h-4 w-4" />
								App Icon URL *
							</div>
						</label>
						<input
							type="url"
							id="icon-url"
							bind:value={iconUrl}
							placeholder="https://example.com/icon.png"
							required
							class="w-full px-4 py-3 bg-muted border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
						/>
					</div>

					<!-- Repository URL -->
					<div>
						<label for="repository" class="block text-sm font-medium text-white mb-2">
							<div class="flex items-center gap-2">
								<GitBranch class="h-4 w-4" />
								Source Code Repository URL *
							</div>
						</label>
						<input
							type="url"
							id="repository"
							bind:value={repository}
							placeholder="https://github.com/user/repo"
							required
							class="w-full px-4 py-3 bg-muted border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
						/>
					</div>

					<!-- Description -->
					<div>
						<label for="description" class="block text-sm font-medium text-white mb-2">
							<div class="flex items-center gap-2">
								<FileText class="h-4 w-4" />
								Description (Optional, Markdown allowed)
							</div>
						</label>
						<textarea
							id="description"
							bind:value={description}
							placeholder="Detailed description of your app features and functionality"
							rows="4"
							class="w-full px-4 py-3 bg-muted border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-vertical"
						></textarea>
					</div>

					<!-- License -->
					<div>
						<label for="license" class="block text-sm font-medium text-white mb-2">
							<div class="flex items-center gap-2">
								<Scale class="h-4 w-4" />
								License (Optional, as SPDX ID)
								<a 
									href="https://spdx.org/licenses/" 
									target="_blank" 
									rel="noopener noreferrer"
									class="text-xs text-primary hover:text-primary/80"
								>
									[SPDX IDs]
								</a>
							</div>
						</label>
						<input
							type="text"
							id="license"
							bind:value={license}
							placeholder="e.g., MIT, GPL-3.0-or-later, Apache-2.0"
							class="w-full px-4 py-3 bg-muted border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
						/>
					</div>
				</div>
			{/if}

			<!-- Publish Button -->
			<div class="mt-8">
				<button
					on:click={publishApk}
					disabled={isLoading}
					class="w-full inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
				>
					<Upload class="mr-2 h-4 w-4" />
					Publish
				</button>
			</div>
		</div>
	{/if}

	<!-- Loading Indicator -->
	{#if isLoading}
		<div class="mb-8 rounded-xl border border-primary/50 bg-card p-6 text-center">
			<Loader2 class="h-8 w-8 text-primary animate-spin mx-auto mb-3" />
			<p class="text-sm text-gray-400">Processing your APK... Please wait...</p>
		</div>
	{/if}

	<!-- Events Section -->
	{#if showEvents}
		<div class="mb-8 rounded-xl border border-white/10 bg-card p-6">
			<h3 class="text-lg font-semibold text-white mb-4">Review Events Before Signing</h3>
			<div class="space-y-4 max-h-96 overflow-y-auto custom-scrollbar mb-6">
				{#each events as event, index}
					<div class="rounded-lg border border-white/10 bg-muted p-4">
						<div class="font-semibold text-white mb-2 text-sm">
							Event {index + 1} - {getKindDescription(event.kind)} (Kind {event.kind})
						</div>
						<pre class="text-xs text-gray-400 overflow-x-auto custom-scrollbar p-3 bg-background/50 rounded">{JSON.stringify(event, null, 2)}</pre>
					</div>
				{/each}
			</div>
			<button
				on:click={signAndPublishEvents}
				disabled={isLoading}
				class="w-full inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
			>
				<FileCode class="mr-2 h-4 w-4" />
				Sign Events
			</button>
		</div>
	{/if}

	<!-- Status Display -->
	<div class="rounded-xl border border-white/10 bg-card p-6">
		<div class="flex items-start gap-3">
			<div class="flex-shrink-0 mt-1">
				{#if statusType === 'success'}
					<CheckCircle class="h-5 w-5 text-green-500" />
				{:else if statusType === 'error'}
					<AlertCircle class="h-5 w-5 text-red-500" />
				{:else if statusType === 'loading'}
					<Loader2 class="h-5 w-5 text-primary animate-spin" />
				{:else}
					<AlertCircle class="h-5 w-5 text-blue-500" />
				{/if}
			</div>
			<div class="flex-1">
				<h3 class="text-sm font-semibold text-white mb-2">Status</h3>
				<pre class="text-sm text-gray-400 whitespace-pre-wrap font-sans">{statusMessage}</pre>
			</div>
		</div>
	</div>
</div>

