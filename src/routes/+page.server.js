import { fetchAppsServer } from '$lib/nostr-server.js';

export async function load() {
	try {
		console.log('[Server] Loading homepage data...');
		const carouselApps = await fetchAppsServer({ limit: 24 });
		console.log('[Server] Loaded', carouselApps.length, 'apps for carousel');
		
		return {
			carouselApps,
			carouselLoading: false
		};
	} catch (e) {
		console.error('[Server] Failed to load carousel apps:', e);
		return {
			carouselApps: [],
			carouselLoading: false
		};
	}
}

