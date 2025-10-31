import { WebSocket } from 'ws';

// Polyfill WebSocket for Node.js environment
if (typeof global !== 'undefined' && !global.WebSocket) {
	global.WebSocket = WebSocket;
}

// Now import nostr-tools (it will use our polyfilled WebSocket)
import { SimplePool } from 'nostr-tools/pool';
import * as nip19 from 'nostr-tools/nip19';
import { renderMarkdown } from '$lib/nostr.js';

const RELAY_URL = 'wss://relay.zapstore.dev';
const CONNECTION_TIMEOUT = 10000; // 10 seconds

/**
 * Server-side fetch apps from Nostr relay
 * @param {Object} options - Query options
 * @param {number} options.limit - Maximum number of apps to fetch
 * @param {string[]} options.authors - Filter by specific authors
 * @param {string[]} options.dTags - Filter by specific d-tags
 * @param {number} options.until - Fetch events created before this timestamp
 * @param {string} options.search - Free-text search (NIP-50)
 * @returns {Promise<Array>} Array of app objects
 */
export async function fetchAppsServer({ limit = 12, authors, dTags, until, search } = {}) {
	const pool = new SimplePool();
	
	return new Promise((resolve, reject) => {
		try {
			const filter = {
				kinds: [32267],
				limit,
				'#f': ['android-arm64-v8a']
			};

			if (authors) {
				filter.authors = authors;
			}

			if (dTags) {
				filter['#d'] = dTags;
			}

			if (until) {
				filter.until = until;
			}

			if (search && typeof search === 'string' && search.trim().length > 0) {
				filter.search = search.trim();
			}

			console.log('[Server] Fetching apps with filter:', filter);

			const events = [];
			let eoseReceived = false;
			
			const subscription = pool.subscribe(
				[RELAY_URL],
				filter,
				{
					onevent(event) {
						console.log('[Server] Received event:', event.id);
						events.push(parseAppEventServer(event));
					},
					oneose() {
						console.log('[Server] End of stored events, got', events.length, 'apps');
						eoseReceived = true;
						const sortedApps = events.sort((a, b) => b.createdAt - a.createdAt);
						subscription.close();
						pool.close([RELAY_URL]);
						resolve(sortedApps);
					},
					onclose() {
						if (!eoseReceived) {
							console.log('[Server] Subscription closed before EOSE');
							const sortedApps = events.sort((a, b) => b.createdAt - a.createdAt);
							pool.close([RELAY_URL]);
							resolve(sortedApps);
						}
					}
				}
			);

			setTimeout(() => {
				if (!eoseReceived) {
					console.log('[Server] Timeout reached, closing subscription');
					subscription.close();
					pool.close([RELAY_URL]);
					const sortedApps = events.sort((a, b) => b.createdAt - a.createdAt);
					resolve(sortedApps);
				}
			}, CONNECTION_TIMEOUT);

		} catch (err) {
			console.error('[Server] Error in fetchAppsServer:', err);
			resolve([]); // Return empty array on error
		}
	});
}

/**
 * Fetches a specific app by pubkey and d-tag (server-side)
 * @param {string} pubkey - The author's public key
 * @param {string} dTag - The app's d-tag identifier
 * @returns {Promise<Object|null>} App object or null if not found
 */
export async function fetchAppServer(pubkey, dTag) {
	const pool = new SimplePool();
	
	return new Promise((resolve, reject) => {
		try {
			const filter = {
				kinds: [32267],
				authors: [pubkey],
				'#d': [dTag]
			};

			console.log('[Server] Fetching app with filter:', filter);

			let foundApp = null;
			let eoseReceived = false;

			const subscription = pool.subscribe(
				[RELAY_URL],
				filter,
				{
					onevent(event) {
						console.log('[Server] Found app event:', event.id);
						foundApp = parseAppEventServer(event);
						eoseReceived = true;
						subscription.close();
						pool.close([RELAY_URL]);
						resolve(foundApp);
					},
					oneose() {
						console.log('[Server] EOSE received, app found:', !!foundApp);
						eoseReceived = true;
						subscription.close();
						pool.close([RELAY_URL]);
						resolve(foundApp);
					},
					onclose() {
						if (!eoseReceived) {
							console.log('[Server] Subscription closed before EOSE');
							pool.close([RELAY_URL]);
							resolve(foundApp);
						}
					}
				}
			);

			setTimeout(() => {
				if (!eoseReceived) {
					console.log('[Server] Timeout reached for app fetch');
					subscription.close();
					pool.close([RELAY_URL]);
					resolve(foundApp);
				}
			}, CONNECTION_TIMEOUT);

		} catch (err) {
			console.error('[Server] Error in fetchAppServer:', err);
			resolve(null);
		}
	});
}

/**
 * Fetch an app by d-tag (android app id) regardless of author (server-side)
 * @param {string} dTag - The app's d-tag identifier
 * @returns {Promise<Object|null>} App object or null if not found
 */
export async function fetchAppByDTagServer(dTag) {
	const pool = new SimplePool();
	
	return new Promise((resolve, reject) => {
		try {
			const filter = {
				kinds: [32267],
				'#d': [dTag],
				limit: 1
			};

			let foundApp = null;
			let eoseReceived = false;

			const subscription = pool.subscribe(
				[RELAY_URL],
				filter,
				{
					onevent(event) {
						foundApp = parseAppEventServer(event);
						eoseReceived = true;
						subscription.close();
						pool.close([RELAY_URL]);
						resolve(foundApp);
					},
					oneose() {
						eoseReceived = true;
						subscription.close();
						pool.close([RELAY_URL]);
						resolve(foundApp);
					},
					onclose() {
						if (!eoseReceived) {
							pool.close([RELAY_URL]);
							resolve(foundApp);
						}
					}
				}
			);

			setTimeout(() => {
				if (!eoseReceived) {
					subscription.close();
					pool.close([RELAY_URL]);
					resolve(foundApp);
				}
			}, CONNECTION_TIMEOUT);

		} catch (err) {
			console.error('[Server] Error in fetchAppByDTagServer:', err);
			resolve(null);
		}
	});
}

/**
 * Parses a nostr event into an app object (server-side)
 * @param {Object} event - Raw nostr event
 * @returns {Object} Parsed app object
 */
function parseAppEventServer(event) {
	const tagMap = {};
	const imageTags = [];
	
	event.tags.forEach(tag => {
		if (tag.length >= 2) {
			const [key, value] = tag;
			if (key === 'image') {
				imageTags.push(value);
			} else if (!tagMap[key]) {
				tagMap[key] = value;
			}
		}
	});
	
	let content = {};
	try {
		content = JSON.parse(event.content);
	} catch (e) {
		console.warn('[Server] Failed to parse content for event', event.id);
		content = { description: event.content };
	}

	const icon = tagMap.icon || content.icon || content.picture || '';
	const images = imageTags.length > 0 ? imageTags : (content.images || []);
	const description = content.description || content.about || content.summary || event.content || 'No description available';

	// Normalize license
	const rawLicense = content.license || tagMap.license || '';
	const license = (typeof rawLicense === 'string' && rawLicense.trim().toUpperCase() === 'NOASSERTION') ? '' : rawLicense;

	// Generate slug using naddr encoding
	let slug;
	try {
		slug = nip19.naddrEncode({
			kind: 32267,
			pubkey: event.pubkey,
			identifier: tagMap.d || ''
		});
	} catch (err) {
		console.warn('[Server] Failed to encode naddr:', err);
		const npub = nip19.npubEncode(event.pubkey);
		slug = `${npub}-${tagMap.d || ''}`;
	}

	return {
		id: event.id,
		pubkey: event.pubkey,
		npub: nip19.npubEncode(event.pubkey),
		dTag: tagMap.d || '',
		name: content.name || tagMap.name || 'Unknown App',
		description,
		descriptionHtml: renderMarkdown(description),
		icon,
		images,
		version: content.version || tagMap.version || '',
		url: content.url || content.website || tagMap.url || '',
		downloadUrl: content.downloadUrl || content.download || tagMap.download || '',
		repository: content.repository || content.repo || content.source || tagMap.repository || '',
		createdAt: event.created_at,
		category: content.category || tagMap.category || '',
		license,
		developer: content.developer || content.publisher || content.author || tagMap.developer || '',
		platform: content.platform || tagMap.platform || '',
		slug
	};
}

/**
 * Fetch profile information for a given pubkey (server-side)
 * @param {string} pubkey - The user's public key
 * @returns {Promise<Object|null>} Profile object or null if not found
 */
export async function fetchProfileServer(pubkey) {
	const PROFILE_RELAY_URL = 'wss://relay.vertexlab.io';
	const pool = new SimplePool();
	
	return new Promise((resolve, reject) => {
		try {
			const filter = {
				kinds: [0],
				authors: [pubkey],
				limit: 1
			};

			console.log('[Server] Fetching profile for:', pubkey);

			let foundProfile = null;
			let eoseReceived = false;

			const subscription = pool.subscribe(
				[PROFILE_RELAY_URL],
				filter,
				{
					onevent(event) {
						console.log('[Server] Found profile event:', event.id);
						
						let content = {};
						try {
							content = JSON.parse(event.content);
						} catch (e) {
							console.warn('[Server] Failed to parse profile content for', pubkey);
						}

						foundProfile = {
							pubkey: event.pubkey,
							name: content.name || content.display_name || '',
							displayName: content.display_name || content.name || '',
							picture: content.picture || '',
							about: content.about || '',
							nip05: content.nip05 || '',
							createdAt: event.created_at
						};
						
						eoseReceived = true;
						subscription.close();
						pool.close([PROFILE_RELAY_URL]);
						resolve(foundProfile);
					},
					oneose() {
						console.log('[Server] EOSE received for profile, found:', !!foundProfile);
						eoseReceived = true;
						subscription.close();
						pool.close([PROFILE_RELAY_URL]);
						resolve(foundProfile);
					},
					onclose() {
						if (!eoseReceived) {
							console.log('[Server] Profile subscription closed before EOSE');
							pool.close([PROFILE_RELAY_URL]);
							resolve(foundProfile);
						}
					}
				}
			);

			setTimeout(() => {
				if (!eoseReceived) {
					console.log('[Server] Timeout reached for profile fetch');
					subscription.close();
					pool.close([PROFILE_RELAY_URL]);
					resolve(foundProfile);
				}
			}, CONNECTION_TIMEOUT);

		} catch (err) {
			console.error('[Server] Error in fetchProfileServer:', err);
			resolve(null);
		}
	});
}

