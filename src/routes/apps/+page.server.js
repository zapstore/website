import { fetchAppsServer } from '$lib/nostr-server.js';

const PAGE_SIZE = 12;

export async function load({ url }) {
	try {
		const searchQuery = url.searchParams.get('q') || '';
		console.log('[Server] Loading apps page data with search:', searchQuery);
		
		const options = { limit: PAGE_SIZE + 1 };
		if (searchQuery) {
			options.search = searchQuery;
		}
		
		// Fetch one extra to check if there are more pages
		const allApps = await fetchAppsServer(options);
		
		// Determine if we have more pages
		const hasMore = allApps.length > PAGE_SIZE;
		const apps = allApps.slice(0, PAGE_SIZE);
		
		console.log('[Server] Loaded', apps.length, 'apps, hasMore:', hasMore);
		
		return {
			apps,
			hasMore,
			loading: false,
			initialQuery: searchQuery
		};
	} catch (err) {
		console.error('[Server] Failed to load apps:', err);
		return {
			apps: [],
			hasMore: false,
			loading: false,
			error: err.message,
			initialQuery: ''
		};
	}
}

