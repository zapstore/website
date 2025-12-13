import { SimplePool } from 'nostr-tools/pool';
import * as nip19 from 'nostr-tools/nip19';
import { bech32 } from '@scure/base';
import { cacheEvent, getCachedEvent } from './event-cache.js';
// Note: marked removed, using simple fallback for renderMarkdown

const RELAY_URL = 'wss://relay.zapstore.dev';
const PROFILE_RELAY_URL = 'wss://relay.vertexlab.io';
const SOCIAL_RELAYS = [
	'wss://relay.damus.io',
	'wss://relay.primal.net',
	'wss://relay.nostr.band',
	'wss://nos.lol'
];
const PROFILE_RELAYS = Array.from(new Set([PROFILE_RELAY_URL, RELAY_URL, ...SOCIAL_RELAYS]));
// Comments should only go to social relays (exclude primary relay)
const COMMENT_RELAYS = Array.from(new Set(SOCIAL_RELAYS));
const CONNECTION_TIMEOUT = 10000; // 10 seconds

// Event kinds
const KIND_PROFILE = 0;
const KIND_COMMENT = 1111;
const KIND_FILE_METADATA = 1063;
const KIND_RELEASE = 30063;
const KIND_APP = 32267;

// Create a global pool instance
let pool = null;

// Apps list cache for discover page state persistence
let discoverPageState = {
	apps: [],
	hasMore: true,
	expanded: false,
	query: ''
};

/**
 * Gets the discover page state
 * @returns {Object} The current discover page state
 */
export function getDiscoverPageState() {
	return discoverPageState;
}

/**
 * Sets the discover page state
 * @param {Object} state - The state to save
 */
export function setDiscoverPageState(state) {
	discoverPageState = { ...discoverPageState, ...state };
}

/**
 * Gets a cached app by pubkey and dTag
 * @param {string} pubkey - The app's pubkey
 * @param {string} dTag - The app's d-tag
 * @returns {Promise<Object|null>} Cached app or null
 */
export async function getCachedApp(pubkey, dTag) {
	const cacheKey = `${pubkey}:${dTag}`;
	return await getCachedEvent(KIND_APP, cacheKey);
}

/**
 * Caches an app in IndexedDB
 * @param {Object} app - The app to cache
 */
export function cacheApp(app) {
	if (app && app.pubkey && app.dTag) {
		const cacheKey = `${app.pubkey}:${app.dTag}`;
		cacheEvent(KIND_APP, cacheKey, app);
	}
}

/**
 * Gets a cached release by pubkey and dTag
 * @param {string} pubkey - The release's pubkey
 * @param {string} dTag - The app's d-tag
 * @returns {Promise<Object|null>} Cached release or null
 */
export async function getCachedRelease(pubkey, dTag) {
	const cacheKey = `${pubkey}:${dTag}`;
	return await getCachedEvent(KIND_RELEASE, cacheKey);
}

/**
 * Caches a release in IndexedDB
 * @param {Object} release - The release to cache
 * @param {string} appDTag - The app's d-tag (for cache key)
 */
export function cacheRelease(release, appDTag) {
	if (release && release.pubkey && appDTag) {
		const cacheKey = `${release.pubkey}:${appDTag}`;
		cacheEvent(KIND_RELEASE, cacheKey, release);
	}
}

/**
 * Gets or creates the global SimplePool instance
 * @returns {SimplePool} Pool instance
 */
function getPool() {
	if (!pool) {
		pool = new SimplePool();
	}
	return pool;
}

/**
 * Fetches profile information for a given pubkey
 * @param {string} pubkey - The user's public key
 * @returns {Promise<Object|null>} Profile object or null if not found
 */
export async function fetchProfile(pubkey) {
	// Check IndexedDB cache
	const cached = await getCachedEvent(KIND_PROFILE, pubkey);
	if (cached) {
		return cached;
	}

	return new Promise((resolve, reject) => {
		try {
			const pool = getPool();

			const filter = {
				kinds: [KIND_PROFILE],
				authors: [pubkey],
				limit: 1
			};

			console.log('Fetching profile for:', pubkey);

			let foundProfile = null;
			let eoseReceived = false;

			const subscription = pool.subscribe(
				PROFILE_RELAYS,
				filter,
				{
					onevent(event) {
						console.log('Found profile event:', event);
						
						let content = {};
						try {
							content = JSON.parse(event.content);
						} catch (e) {
							console.warn('Failed to parse profile content for', pubkey);
						}

						foundProfile = {
							pubkey: event.pubkey,
							name: content.name || content.display_name || '',
							displayName: content.display_name || content.name || '',
							picture: content.picture || '',
							about: content.about || '',
							nip05: content.nip05 || '',
							lud16: content.lud16 || '', // Lightning Address
							lud06: content.lud06 || '', // LNURL
							createdAt: event.created_at
						};

						// Cache in IndexedDB
						cacheEvent(KIND_PROFILE, pubkey, foundProfile);
						
						eoseReceived = true;
						subscription.close();
						resolve(foundProfile);
					},
					oneose() {
						console.log('EOSE received for profile, found:', !!foundProfile);
						eoseReceived = true;
						subscription.close();
						resolve(foundProfile);
					},
					onclose() {
						if (!eoseReceived) {
							console.log('Profile subscription closed before EOSE');
							resolve(foundProfile);
						}
					}
				}
			);

			// Set a timeout
			setTimeout(() => {
				if (!eoseReceived) {
					console.log('Timeout reached for profile fetch');
					subscription.close();
					resolve(foundProfile);
				}
			}, CONNECTION_TIMEOUT);

		} catch (err) {
			console.error('Error in fetchProfile:', err);
			reject(err);
		}
	});
}

/**
 * Fetches profile information for a given pubkey, bypassing cache
 * Used when we need fresh data (e.g., for zapping to ensure lud16 is present)
 * @param {string} pubkey - The user's public key
 * @returns {Promise<Object|null>} Profile object or null if not found
 */
export async function fetchProfileFresh(pubkey) {
	return new Promise((resolve, reject) => {
		try {
			const pool = getPool();

			const filter = {
				kinds: [KIND_PROFILE],
				authors: [pubkey],
				limit: 1
			};

			console.log('Fetching profile fresh (no cache) for:', pubkey);

			let foundProfile = null;
			let eoseReceived = false;

			const subscription = pool.subscribe(
				PROFILE_RELAYS,
				filter,
				{
					onevent(event) {
						console.log('Found profile event:', event);
						
						let content = {};
						try {
							content = JSON.parse(event.content);
						} catch (e) {
							console.warn('Failed to parse profile content for', pubkey);
						}

						foundProfile = {
							pubkey: event.pubkey,
							name: content.name || content.display_name || '',
							displayName: content.display_name || content.name || '',
							picture: content.picture || '',
							about: content.about || '',
							nip05: content.nip05 || '',
							lud16: content.lud16 || '', // Lightning Address
							lud06: content.lud06 || '', // LNURL
							createdAt: event.created_at
						};

						// Update cache with fresh data
						cacheEvent(KIND_PROFILE, pubkey, foundProfile);
						
						eoseReceived = true;
						subscription.close();
						resolve(foundProfile);
					},
					oneose() {
						console.log('EOSE received for profile, found:', !!foundProfile);
						eoseReceived = true;
						subscription.close();
						resolve(foundProfile);
					},
					onclose() {
						if (!eoseReceived) {
							console.log('Profile subscription closed before EOSE');
							resolve(foundProfile);
						}
					}
				}
			);

			// Set a timeout
			setTimeout(() => {
				if (!eoseReceived) {
					console.log('Timeout reached for profile fetch');
					subscription.close();
					resolve(foundProfile);
				}
			}, CONNECTION_TIMEOUT);

		} catch (err) {
			console.error('Error in fetchProfileFresh:', err);
			reject(err);
		}
	});
}

/**
 * Converts a hex pubkey to npub format
 * @param {string} pubkey - Hex public key
 * @returns {string} npub encoded public key
 */
export function pubkeyToNpub(pubkey) {
	try {
		return nip19.npubEncode(pubkey);
	} catch (err) {
		console.warn('Failed to encode pubkey to npub:', err);
		return pubkey;
	}
}

/**
 * Renders markdown content to HTML (simple fallback without marked)
 * @param {string} markdown - Markdown content
 * @returns {string} HTML content
 */
export function renderMarkdown(markdown) {
    if (!markdown) return '';

    try {
        const text = String(markdown).replace(/\r\n?/g, '\n');
        const lines = text.split('\n');
        const htmlParts = [];

        let inCodeBlock = false;
        let codeFenceLang = '';
        let inUL = false;
        let inOL = false;
        let paraBuffer = [];

        function flushParagraph() {
            if (paraBuffer.length > 0) {
                const content = paraBuffer.join(' ').trim();
                if (content.length > 0) {
                    htmlParts.push(`<p>${applyInlineMarkdown(content)}</p>`);
                }
                paraBuffer = [];
            }
        }

        function closeLists() {
            if (inUL) { htmlParts.push('</ul>'); inUL = false; }
            if (inOL) { htmlParts.push('</ol>'); inOL = false; }
        }

        function applyInlineMarkdown(s) {
            // Fix existing <a> tags without target="_blank" - add target and rel attributes
            s = s.replace(/<a\s+href=["']([^"']+)["'](?![^>]*target=)([^>]*)>/gi, '<a href="$1" target="_blank" rel="noopener noreferrer"$2>');
            // Links [text](url)
            s = s.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
            // Plain URLs (not already in an anchor tag) - use placeholder approach for safety
            s = s.replace(/(^|[^"'>])(https?:\/\/[^\s<>"'\)]+)/g, function(match, prefix, url) {
                // Don't convert if it appears to be inside an existing tag attribute
                if (prefix === '=' || prefix === '/') return match;
                return prefix + '<a href="' + url + '" target="_blank" rel="noopener noreferrer">' + url + '</a>';
            });
            // Bold **text**
            s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
            // Italic *text*
            s = s.replace(/\*([^*]+)\*/g, '<em>$1</em>');
            // Inline code `code`
            s = s.replace(/`([^`]+)`/g, '<code>$1</code>');
            return s;
        }

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];

            // Fenced code blocks
            const fenceMatch = line.match(/^```\s*([\w-]*)\s*$/);
            if (fenceMatch) {
                if (!inCodeBlock) {
                    flushParagraph();
                    closeLists();
                    inCodeBlock = true;
                    codeFenceLang = fenceMatch[1] || '';
                    htmlParts.push(`<pre><code${codeFenceLang ? ` class="language-${codeFenceLang}"` : ''}>`);
                } else {
                    inCodeBlock = false;
                    codeFenceLang = '';
                    htmlParts.push('</code></pre>');
                }
                continue;
            }

            if (inCodeBlock) {
                // Escape HTML inside code blocks minimally
                const escaped = line
                    .replace(/&/g, '&amp;')
                    .replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;');
                htmlParts.push(`${escaped}\n`);
                continue;
            }

            // Blank line: close paragraph and lists if applicable
            if (/^\s*$/.test(line)) {
                flushParagraph();
                closeLists();
                continue;
            }

            // Headings
            const heading = line.match(/^(#{1,6})\s+(.*)$/);
            if (heading) {
                flushParagraph();
                closeLists();
                const level = heading[1].length;
                const content = applyInlineMarkdown(heading[2].trim());
                htmlParts.push(`<h${level}>${content}</h${level}>`);
                continue;
            }

            // Ordered list
            const olMatch = line.match(/^\s*(\d+)[.)]\s+(.*)$/);
            if (olMatch) {
                flushParagraph();
                if (inUL) { htmlParts.push('</ul>'); inUL = false; }
                if (!inOL) { htmlParts.push('<ol>'); inOL = true; }
                htmlParts.push(`<li>${applyInlineMarkdown(olMatch[2].trim())}</li>`);
                continue;
            }

            // Unordered list
            const ulMatch = line.match(/^\s*[-*+]\s+(.*)$/);
            if (ulMatch) {
                flushParagraph();
                if (inOL) { htmlParts.push('</ol>'); inOL = false; }
                if (!inUL) { htmlParts.push('<ul>'); inUL = true; }
                htmlParts.push(`<li>${applyInlineMarkdown(ulMatch[1].trim())}</li>`);
                continue;
            }

            // Default: part of a paragraph
            paraBuffer.push(line.trim());
        }

        // Flush any remaining structures
        flushParagraph();
        closeLists();
        if (inCodeBlock) {
            htmlParts.push('</code></pre>');
            inCodeBlock = false;
        }

        return htmlParts.join('');
    } catch (err) {
        console.warn('Failed to parse markdown:', err);
        return String(markdown).replace(/\n/g, '<br>');
    }
}

/**
 * Fetches apps from the relay with optional filters
 * @param {Object} options - Query options
 * @param {number} options.limit - Maximum number of apps to fetch
 * @param {string[]} options.authors - Filter by specific authors
 * @param {string[]} options.dTags - Filter by specific d-tags
 * @param {number} options.until - Fetch events created before this timestamp
 * @param {string} options.search - Free-text search (NIP-50) against app metadata/content
 * @returns {Promise<Array>} Array of app objects
 */
export async function fetchApps({ limit = 12, authors, dTags, until, search } = {}) {
	return new Promise((resolve, reject) => {
		try {
			const pool = getPool();

            const filter = {
				kinds: [32267],
				limit
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

            // NIP-50 free-text search support (relay must support it)
            if (search && typeof search === 'string' && search.trim().length > 0) {
                filter.search = search.trim();
            }

            // Filter by platform/arch tag 'f'
            filter['#f'] = ['android-arm64-v8a'];

			console.log('Fetching apps with filter:', filter);

			const events = [];
			let eoseReceived = false;
			
			// Use subscribe method with callback approach
			const subscription = pool.subscribe(
				[RELAY_URL],
				filter,
				{
					onevent(event) {
						console.log('Received event:', event.id);
						events.push(parseAppEvent(event));
					},
					oneose() {
						console.log('End of stored events, got', events.length, 'apps');
						eoseReceived = true;
						
						// Sort by creation date (newest first)
						const sortedApps = events.sort((a, b) => b.createdAt - a.createdAt);
						
						subscription.close();
						resolve(sortedApps);
					},
					onclose() {
						if (!eoseReceived) {
							console.log('Subscription closed before EOSE');
							const sortedApps = events.sort((a, b) => b.createdAt - a.createdAt);
							resolve(sortedApps);
						}
					}
				}
			);

			// Set a timeout to close connection
			setTimeout(() => {
				if (!eoseReceived) {
					console.log('Timeout reached, closing subscription');
					subscription.close();
					const sortedApps = events.sort((a, b) => b.createdAt - a.createdAt);
					resolve(sortedApps);
				}
			}, CONNECTION_TIMEOUT);

		} catch (err) {
			console.error('Error in fetchApps:', err);
			reject(err);
		}
	});
}

/**
 * Fetches a specific app by pubkey and d-tag
 * @param {string} pubkey - The author's public key
 * @param {string} dTag - The app's d-tag identifier
 * @returns {Promise<Object|null>} App object or null if not found
 */
export async function fetchApp(pubkey, dTag) {
	return new Promise((resolve, reject) => {
		try {
			const pool = getPool();

			const filter = {
				kinds: [32267],
				authors: [pubkey],
				'#d': [dTag]
			};

			console.log('Fetching app with filter:', filter);

			let foundApp = null;
			let eoseReceived = false;

			// Use subscribe method with callback approach
			const subscription = pool.subscribe(
				[RELAY_URL],
				filter,
				{
					onevent(event) {
						console.log('Found app event:', event);
						foundApp = parseAppEvent(event);
						eoseReceived = true;
						subscription.close();
						resolve(foundApp);
					},
					oneose() {
						console.log('EOSE received, app found:', !!foundApp);
						eoseReceived = true;
						subscription.close();
						resolve(foundApp);
					},
					onclose() {
						if (!eoseReceived) {
							console.log('Subscription closed before EOSE');
							resolve(foundApp);
						}
					}
				}
			);

			// Set a timeout to close connection
			setTimeout(() => {
				if (!eoseReceived) {
					console.log('Timeout reached for app fetch');
					subscription.close();
					resolve(foundApp);
				}
			}, CONNECTION_TIMEOUT);

		} catch (err) {
			console.error('Error in fetchApp:', err);
			reject(err);
		}
	});
}

/**
 * Fetch an app by d-tag (android app id) regardless of author
 * Used for resolving plain IDs to their canonical naddr
 * @param {string} dTag - The app's d-tag identifier
 * @returns {Promise<Object|null>} App object or null if not found
 */
export async function fetchAppByDTag(dTag) {
    return new Promise((resolve, reject) => {
        try {
            const pool = getPool();

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
                        foundApp = parseAppEvent(event);
                        eoseReceived = true;
                        subscription.close();
                        resolve(foundApp);
                    },
                    oneose() {
                        eoseReceived = true;
                        subscription.close();
                        resolve(foundApp);
                    },
                    onclose() {
                        if (!eoseReceived) {
                            resolve(foundApp);
                        }
                    }
                }
            );

            setTimeout(() => {
                if (!eoseReceived) {
                    subscription.close();
                    resolve(foundApp);
                }
            }, CONNECTION_TIMEOUT);

        } catch (err) {
            console.error('Error in fetchAppByDTag:', err);
            reject(err);
        }
    });
}

/**
 * Parses a nostr event into an app object
 * @param {Object} event - Raw nostr event
 * @returns {Object} Parsed app object
 */
export function parseAppEvent(event) {
	// Convert tags array to a more usable format for lookups
	const tagMap = {};
	const imageTags = [];
	
	// Process tags to extract specific information
	event.tags.forEach(tag => {
		if (tag.length >= 2) {
			const [key, value] = tag;
			
			if (key === 'image') {
				// Collect all image tags
				imageTags.push(value);
			} else if (!tagMap[key]) {
				// Store first occurrence of other tags
				tagMap[key] = value;
			}
		}
	});
	
	let content = {};
	try {
		content = JSON.parse(event.content);
	} catch (e) {
		console.warn('Failed to parse content for event', event.id);
		// If JSON parsing fails, treat the content as plain text description
		content = { description: event.content };
	}

	// Extract icon from tags first, then fallback to content
	const icon = tagMap.icon || content.icon || content.picture || '';
	
	// Use images from tags, fallback to content if no tag images
	const images = imageTags.length > 0 ? imageTags : (content.images || []);
	
	// Get description from content (this is the primary source)
	const description = content.description || content.about || content.summary || event.content || 'No description available';

	// Normalize license: treat "NOASSERTION" as undefined/empty
	const rawLicense = content.license || tagMap.license || '';
	const license = (typeof rawLicense === 'string' && rawLicense.trim().toUpperCase() === 'NOASSERTION') ? '' : rawLicense;

	return {
		id: event.id,
		pubkey: event.pubkey,
		npub: pubkeyToNpub(event.pubkey),
		dTag: tagMap.d || '',
		name: content.name || tagMap.name || 'Unknown App',
		description: description,
		descriptionHtml: renderMarkdown(description),
		icon: icon,
		images: images,
		url: content.url || content.website || tagMap.url || '',
		downloadUrl: content.downloadUrl || content.download || tagMap.download || '',
		repository: content.repository || content.repo || content.source || tagMap.repository || '',
		createdAt: event.created_at,
		tags: event.tags,
		content: content,
		fullContent: event.content,
		fullEvent: event, // Add the complete nostr event for Raw Event Data
		// Additional fields that might be in the content
		category: content.category || tagMap.category || '',
		license: license,
		developer: content.developer || content.publisher || content.author || tagMap.developer || '',
		requirements: content.requirements || content.systemRequirements || '',
		changelog: content.changelog || content.releaseNotes || '',
		// Platform information
		platform: content.platform || tagMap.platform || '',
		// Additional metadata
		price: content.price || tagMap.price || '',
		rating: content.rating || tagMap.rating || '',
		downloads: content.downloads || tagMap.downloads || ''
	};
}

/**
 * Formats a timestamp into a readable date string
 * @param {number} timestamp - Unix timestamp
 * @param {Object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date string
 */
import { formatTimestampSeconds, formatDisplayDate } from '$lib/date.js';

export function formatDate(timestamp, options = {}) {
    // Keep signature compatible; underlying format now matches site-wide style
    // Accept seconds (nostr created_at) or milliseconds
    const seconds = typeof timestamp === 'number' && timestamp > 1e12
        ? Math.floor(timestamp / 1000)
        : timestamp;
    const month = options.month === 'long' ? 'long' : options.month === 'short' ? 'short' : 'short';
    return formatTimestampSeconds(seconds, { month });
}

/**
 * Formats a file size into a human-readable string
 * @param {number|string} size - File size in bytes or string
 * @returns {string} Formatted size string
 */
// removed size formatting helper

/**
 * Generates an app URL slug using naddr encoding
 * @param {string} pubkey - Hex public key
 * @param {string} dTag - App d-tag identifier
 * @returns {string} URL slug as naddr
 */
export function getAppSlug(pubkey, dTag) {
	try {
		return nip19.naddrEncode({
			kind: 32267,
			pubkey: pubkey,
			identifier: dTag
		});
	} catch (err) {
		console.warn('Failed to encode naddr:', err);
		// Fallback to old format if encoding fails
		const npub = pubkeyToNpub(pubkey);
		return `${npub}-${dTag}`;
	}
}

/**
 * Parses an app URL slug to extract pubkey and d-tag
 * @param {string} slug - URL slug (naddr format or legacy npub-appid format)
 * @returns {Object} Object with pubkey and dTag properties
 */
export function parseAppSlug(slug) {
	// Try to decode as naddr first
	if (slug.startsWith('naddr1')) {
		try {
			const decoded = nip19.decode(slug);
			if (decoded.type === 'naddr' && decoded.data.kind === 32267) {
				return {
					pubkey: decoded.data.pubkey,
					dTag: decoded.data.identifier
				};
			}
		} catch (err) {
			console.warn('Failed to decode naddr, trying legacy format:', err);
		}
	}
	
	// Fallback to legacy npub-appid format for backward compatibility
	const npubLength = 63;
	
	if (slug.length < npubLength + 2) { // +2 for dash and at least 1 char for appid
		throw new Error('Invalid app URL format: too short');
	}
	
	if (!slug.startsWith('npub1')) {
		throw new Error('Invalid app URL format: must start with npub or naddr');
	}

	const npub = slug.substring(0, npubLength);
	const dTag = slug.substring(npubLength + 1); // +1 to skip the dash

	// Convert npub back to hex pubkey
	let pubkey;
	try {
		const decoded = nip19.decode(npub);
		if (decoded.type !== 'npub') {
			throw new Error('Invalid npub format');
		}
		pubkey = decoded.data;
	} catch (err) {
		throw new Error('Failed to decode npub: ' + err.message);
	}

	return { pubkey, dTag };
}

/**
 * Fetches zap events for a specific app
 * @param {string} pubkey - The app publisher's public key
 * @param {string} appId - The app's d-tag identifier
 * @returns {Promise<Array>} Array of zap events
 */
export async function fetchAppZaps(pubkey, appId) {
	return new Promise((resolve, reject) => {
		try {
			const pool = getPool();
			
			// Create the 'a' tag value for the app: 32267:pubkey:appId
			const aTagValue = `32267:${pubkey}:${appId}`;
			
			const filter = {
				kinds: [9735],
				'#a': [aTagValue],
				limit: 100
			};

			console.log('Fetching zaps with filter:', filter);

			const zapEvents = [];
			let eoseCount = 0;
			const totalRelays = SOCIAL_RELAYS.length;
			
			// Use subscribe method with callback approach
			const subscription = pool.subscribe(
				SOCIAL_RELAYS,
				filter,
				{
					onevent(event) {
						console.log('Received zap event:', event.id);
						zapEvents.push(parseZapEvent(event));
					},
					oneose() {
						eoseCount++;
						console.log(`EOSE received from ${eoseCount}/${totalRelays} relays`);
						
						// Wait for all relays to finish
						if (eoseCount >= totalRelays) {
							console.log('All relays finished, got', zapEvents.length, 'zaps');
							
							// Sort by creation date (newest first) and remove duplicates
							const uniqueZaps = removeDuplicateZaps(zapEvents);
							const sortedZaps = uniqueZaps.sort((a, b) => b.createdAt - a.createdAt);
							
							subscription.close();
							resolve(sortedZaps);
						}
					},
					onclose() {
						if (eoseCount < totalRelays) {
							console.log('Subscription closed before all relays finished');
							const uniqueZaps = removeDuplicateZaps(zapEvents);
							const sortedZaps = uniqueZaps.sort((a, b) => b.createdAt - a.createdAt);
							resolve(sortedZaps);
						}
					}
				}
			);

			// Set a timeout to close connection
			setTimeout(() => {
				if (eoseCount < totalRelays) {
					console.log('Timeout reached for zap fetch');
					subscription.close();
					const uniqueZaps = removeDuplicateZaps(zapEvents);
					const sortedZaps = uniqueZaps.sort((a, b) => b.createdAt - a.createdAt);
					resolve(sortedZaps);
				}
			}, CONNECTION_TIMEOUT);

		} catch (err) {
			console.error('Error in fetchAppZaps:', err);
			reject(err);
		}
	});
}

/**
 * Parses a zap event into a usable object
 * @param {Object} event - Raw zap event
 * @returns {Object} Parsed zap object
 */
export function parseZapEvent(event) {
	// Convert tags array to a more usable format
	const tagMap = {};
	event.tags.forEach(tag => {
		if (tag.length >= 2) {
			const [key, value] = tag;
			if (!tagMap[key]) {
				tagMap[key] = value;
			}
		}
	});

	// Extract amount from bolt11 invoice if available
	let amountSats = 0;
	const bolt11 = tagMap.bolt11;
	if (bolt11) {
		try {
			// BOLT11 format: lnbc<amount><multiplier>...
			// Multipliers: m=milli (0.001), u=micro (0.000001), n=nano (0.000000001), p=pico (0.000000000001)
			const amountMatch = bolt11.match(/lnbc(\d+)([munp]?)/i);
			if (amountMatch) {
				const value = parseInt(amountMatch[1]);
				const unit = amountMatch[2]?.toLowerCase() || '';
				
				// Convert to satoshis (1 BTC = 100,000,000 sats)
				switch (unit) {
					case 'm': amountSats = value * 100000; break;      // milli-bitcoin: 1 mBTC = 100,000 sats
					case 'u': amountSats = value * 100; break;         // micro-bitcoin: 1 uBTC = 100 sats
					case 'n': amountSats = Math.floor(value / 10); break;  // nano-bitcoin: 10 nBTC = 1 sat
					case 'p': amountSats = Math.floor(value / 10000); break; // pico-bitcoin: 10000 pBTC = 1 sat
					default: amountSats = value * 100000000; break;    // bitcoin: 1 BTC = 100,000,000 sats
				}
			}
		} catch (e) {
			console.warn('Failed to parse bolt11 amount:', e);
		}
	}

	// Extract description (zap note content)
	let description = '';
	try {
		const descriptionTag = event.tags.find(tag => tag[0] === 'description');
		if (descriptionTag && descriptionTag[1]) {
			const descEvent = JSON.parse(descriptionTag[1]);
			description = descEvent.content || '';
		}
	} catch (e) {
		console.warn('Failed to parse zap description:', e);
	}

	return {
		id: event.id,
		pubkey: event.pubkey,
		npub: pubkeyToNpub(event.pubkey),
		createdAt: event.created_at,
		amountSats: amountSats,
		description: description,
		preimage: tagMap.preimage || '',
		bolt11: bolt11 || '',
		fullEvent: event
	};
}

/**
 * Removes duplicate zap events based on event ID
 * @param {Array} zapEvents - Array of zap events
 * @returns {Array} Array of unique zap events
 */
function removeDuplicateZaps(zapEvents) {
	const seen = new Set();
	return zapEvents.filter(zap => {
		if (seen.has(zap.id)) {
			return false;
		}
		seen.add(zap.id);
		return true;
	});
}

/**
 * Formats satoshi amount to a human-readable string
 * @param {number} sats - Amount in satoshis
 * @returns {string} Formatted amount string
 */
export function formatSats(sats) {
	if (sats >= 100000000) {
		return `${(sats / 100000000).toFixed(2)} BTC`;
	} else if (sats >= 1000000) {
		return `${(sats / 1000000).toFixed(1)}M sats`;
	} else if (sats >= 1000) {
		return `${(sats / 1000).toFixed(1)}K sats`;
	}
	return `${sats} sats`;
}

/**
 * Closes the global pool and cleans up connections
 */
export function closePool() {
	if (pool) {
		pool.close(PROFILE_RELAYS);
		pool = null;
	}
} 

/**
 * Fetches the latest release (kind 30063) for an app via its 'a' tag
 * The app event should include an 'a' tag like: 30063:<pubkey>:<app-id>@<version>
 * @param {Object} app - Parsed app object returned by parseAppEvent
 * @param {Object} options - Options
 * @param {boolean} options.skipCache - Skip cache lookup and force fetch
 * @returns {Promise<Object|null>} Parsed release object or null
 */
export async function fetchLatestReleaseForApp(app, { skipCache = false } = {}) {
    if (!app || !app.pubkey || !app.dTag) return null;

    // Check cache first (unless skipCache is true)
    if (!skipCache) {
        const cached = await getCachedRelease(app.pubkey, app.dTag);
        if (cached) {
            console.log('Using cached release for', app.dTag);
            return cached;
        }
    }

    // Kind 30063 release events point back to the app via '#a' = '32267:<pubkey>:<app-id>'
    // Query by that reference and optionally by author
    const aValue = `32267:${app.pubkey}:${app.dTag}`;

    return new Promise((resolve, reject) => {
        try {
            const pool = getPool();
            const filter = {
                kinds: [KIND_RELEASE],
                '#a': [aValue],
                authors: [app.pubkey],
                limit: 5
            };

            let releases = [];
            let eoseReceived = false;

            const subscription = pool.subscribe(
                [RELAY_URL],
                filter,
                {
                    onevent(event) {
                        releases.push(parseReleaseEvent(event));
                    },
                    oneose() {
                        eoseReceived = true;
                        releases.sort((a, b) => b.createdAt - a.createdAt);
                        const latestRelease = releases[0] || null;
                        
                        // Cache the release
                        if (latestRelease) {
                            cacheRelease(latestRelease, app.dTag);
                        }
                        
                        subscription.close();
                        resolve(latestRelease);
                    },
                    onclose() {
                        if (!eoseReceived) {
                            releases.sort((a, b) => b.createdAt - a.createdAt);
                            const latestRelease = releases[0] || null;
                            if (latestRelease) {
                                cacheRelease(latestRelease, app.dTag);
                            }
                            resolve(latestRelease);
                        }
                    }
                }
            );

            setTimeout(() => {
                if (!eoseReceived) {
                    subscription.close();
                    releases.sort((a, b) => b.createdAt - a.createdAt);
                    const latestRelease = releases[0] || null;
                    if (latestRelease) {
                        cacheRelease(latestRelease, app.dTag);
                    }
                    resolve(latestRelease);
                }
            }, CONNECTION_TIMEOUT);
        } catch (err) {
            console.error('Error fetching latest release:', err);
            resolve(null);
        }
    });
}

/**
 * Parses a 30063 release event
 * @param {Object} event - Raw nostr event
 * @returns {Object} Parsed release object
 */
export function parseReleaseEvent(event) {
    // Extract tags into a map (first occurrence)
    const tagMap = {};
    const allATags = [];
    const allETags = [];
    for (const tag of event.tags || []) {
        if (Array.isArray(tag) && tag.length >= 2) {
            const [k, v] = tag;
            if (k === 'a') allATags.push(v);
            if (k === 'e') allETags.push(v);
            if (!tagMap[k]) tagMap[k] = v;
        }
    }

    const dTag = tagMap.d || '';
    const url = tagMap.url || '';
    const content = event.content || '';

    return {
        id: event.id,
        kind: event.kind,
        createdAt: event.created_at,
        pubkey: event.pubkey,
        npub: pubkeyToNpub(event.pubkey),
        dTag: dTag,
        aTags: allATags,
        eTags: allETags,  // References to 1063 file metadata events
        url: url,
        notes: content,
        notesHtml: renderMarkdown(content),
        fullEvent: event
    };
}

/**
 * Gets a cached file metadata event by event ID
 * @param {string} eventId - The event ID
 * @returns {Promise<Object|null>} Cached file metadata or null
 */
export async function getCachedFileMetadata(eventId) {
    return await getCachedEvent(KIND_FILE_METADATA, eventId);
}

/**
 * Caches a file metadata event in IndexedDB
 * @param {Object} fileMeta - The file metadata to cache
 */
export function cacheFileMetadata(fileMeta) {
    if (fileMeta && fileMeta.id) {
        cacheEvent(KIND_FILE_METADATA, fileMeta.id, fileMeta);
    }
}

/**
 * Fetches file metadata events (kind 1063) by their event IDs
 * @param {string[]} eventIds - Array of event IDs to fetch
 * @returns {Promise<Array>} Array of parsed file metadata objects
 */
export async function fetchFileMetadata(eventIds) {
    if (!eventIds || eventIds.length === 0) return [];

    // Check cache first for each event ID
    const results = [];
    const missingIds = [];
    
    for (const eventId of eventIds) {
        const cached = await getCachedFileMetadata(eventId);
        if (cached) {
            results.push(cached);
        } else {
            missingIds.push(eventId);
        }
    }
    
    // If all were cached, return immediately
    if (missingIds.length === 0) {
        console.log('All file metadata found in cache');
        return results;
    }

    return new Promise((resolve, reject) => {
        try {
            const pool = getPool();

            const filter = {
                kinds: [KIND_FILE_METADATA],
                ids: missingIds
            };

            console.log('Fetching file metadata with filter:', filter);

            const events = [];
            let eoseReceived = false;

            const subscription = pool.subscribe(
                [RELAY_URL],
                filter,
                {
                    onevent(event) {
                        console.log('Received file metadata event:', event.id);
                        const parsed = parseFileMetadataEvent(event);
                        events.push(parsed);
                        // Cache it
                        cacheFileMetadata(parsed);
                    },
                    oneose() {
                        console.log('EOSE received for file metadata, got', events.length, 'events');
                        eoseReceived = true;
                        subscription.close();
                        resolve([...results, ...events]);
                    },
                    onclose() {
                        if (!eoseReceived) {
                            console.log('File metadata subscription closed before EOSE');
                            resolve([...results, ...events]);
                        }
                    }
                }
            );

            setTimeout(() => {
                if (!eoseReceived) {
                    console.log('Timeout reached for file metadata fetch');
                    subscription.close();
                    resolve([...results, ...events]);
                }
            }, CONNECTION_TIMEOUT);

        } catch (err) {
            console.error('Error in fetchFileMetadata:', err);
            reject(err);
        }
    });
}

/**
 * Fetches the version for an app from its FileMetadata
 * @param {Object} app - The app object
 * @returns {Promise<string|null>} The version string or null
 */
export async function fetchAppVersion(app) {
    if (!app || !app.pubkey || !app.dTag) return null;
    
    try {
        // Get the latest release for this app
        const release = await fetchLatestReleaseForApp(app);
        if (!release || !release.eTags || release.eTags.length === 0) {
            return null;
        }
        
        // Fetch file metadata from the release
        const fileMetadata = await fetchFileMetadata(release.eTags);
        if (!fileMetadata || fileMetadata.length === 0) {
            return null;
        }
        
        // Find the first file metadata with a version
        for (const f of fileMetadata) {
            // Try parsed version first
            if (f?.version && String(f.version).trim().length > 0) {
                return f.version;
            }
            // Fallback: extract from fullEvent tags if available
            if (f?.fullEvent?.tags) {
                const versionTag = f.fullEvent.tags.find(t => t[0] === 'version');
                if (versionTag && versionTag[1] && String(versionTag[1]).trim().length > 0) {
                    return versionTag[1];
                }
            }
        }
        
        return null;
    } catch (err) {
        console.warn('Error fetching app version:', err);
        return null;
    }
}

/**
 * Parses a file metadata event (kind 1063)
 * @param {Object} event - Raw nostr event
 * @returns {Object} Parsed file metadata object
 */
export function parseFileMetadataEvent(event) {
    const tagMap = {};
    for (const tag of event.tags || []) {
        if (Array.isArray(tag) && tag.length >= 2) {
            const [k, v] = tag;
            if (!tagMap[k]) tagMap[k] = v;
        }
    }

    return {
        id: event.id,
        kind: event.kind,
        createdAt: event.created_at,
        pubkey: event.pubkey,
        npub: pubkeyToNpub(event.pubkey),
        url: tagMap.url || '',
        mimeType: tagMap.m || '',
        hash: tagMap.x || '',
        size: tagMap.size || '',
        version: tagMap.version || '',
        fullEvent: event
    };
}

/**
 * Fetches zaps for app (32267) and file metadata (1063) events
 * @param {string} appEventId - The app event ID
 * @param {string} pubkey - The app publisher's public key
 * @param {string} appId - The app's d-tag identifier
 * @param {string[]} fileEventIds - Optional array of file metadata event IDs
 * @returns {Promise<Object>} Object containing zaps array and total amount
 */
export async function fetchAppAndFileZaps(appEventId, pubkey, appId, fileEventIds = []) {
    return new Promise((resolve, reject) => {
        try {
            const pool = getPool();
            
            const aTagValue = `32267:${pubkey}:${appId}`;
            const allEventIds = [appEventId, ...fileEventIds].filter(Boolean);
            
            // Query zap receipts by recipient pubkey
            const filter = {
                kinds: [9735],
                '#p': [pubkey],
                limit: 200
            };

            console.log('Fetching zaps with filter:', JSON.stringify(filter));
            console.log('Looking for zaps with a tag:', aTagValue);
            console.log('Or e tags:', allEventIds);

            const zapEvents = [];
            let eoseCount = 0;
            let resolved = false;
            const totalRelays = SOCIAL_RELAYS.length;
            
            function finalize() {
                if (resolved) return;
                resolved = true;
                
                const uniqueZaps = removeDuplicateZaps(zapEvents);
                const sortedZaps = uniqueZaps.sort((a, b) => b.createdAt - a.createdAt);
                const totalSats = sortedZaps.reduce((sum, zap) => sum + zap.amountSats, 0);
                
                console.log('Zap fetch complete:', sortedZaps.length, 'unique zaps, total:', totalSats, 'sats');
                
                resolve({
                    zaps: sortedZaps,
                    totalSats: totalSats,
                    count: sortedZaps.length
                });
            }
            
            const subscription = pool.subscribe(
                SOCIAL_RELAYS,
                filter,
                {
                    onevent(event) {
                        // Check if this zap is relevant to our app (has matching 'a' or 'e' tag)
                        const hasMatchingATag = event.tags.some(t => t[0] === 'a' && t[1] === aTagValue);
                        const hasMatchingETag = allEventIds.length > 0 && event.tags.some(t => t[0] === 'e' && allEventIds.includes(t[1]));
                        
                        if (hasMatchingATag || hasMatchingETag) {
                            console.log('Received relevant zap event:', event.id);
                            zapEvents.push(parseZapEventWithSender(event));
                        }
                    },
                    oneose() {
                        eoseCount++;
                        console.log(`EOSE received from ${eoseCount}/${totalRelays} relays, have ${zapEvents.length} zaps so far`);
                        
                        if (eoseCount >= totalRelays) {
                            subscription.close();
                            finalize();
                        }
                    },
                    onclose(reason) {
                        console.log('Zap subscription closed:', reason);
                        if (!resolved) {
                            finalize();
                        }
                    }
                }
            );

            // Timeout - resolve with whatever we have
            setTimeout(() => {
                if (!resolved) {
                    console.log('Timeout reached for zap fetch, got', zapEvents.length, 'zaps');
                    subscription.close();
                    finalize();
                }
            }, CONNECTION_TIMEOUT);

        } catch (err) {
            console.error('Error in fetchAppAndFileZaps:', err);
            reject(err);
        }
    });
}

/**
 * Parses a zap event and extracts the sender pubkey from description
 * @param {Object} event - Raw zap event
 * @returns {Object} Parsed zap object with sender info
 */
export function parseZapEventWithSender(event) {
    const baseZap = parseZapEvent(event);
    
    // Extract sender pubkey from the description (zap request)
    let senderPubkey = '';
    try {
        const descriptionTag = event.tags.find(tag => tag[0] === 'description');
        if (descriptionTag && descriptionTag[1]) {
            const descEvent = JSON.parse(descriptionTag[1]);
            senderPubkey = descEvent.pubkey || '';
        }
    } catch (e) {
        console.warn('Failed to parse zap sender:', e);
    }
    
    return {
        ...baseZap,
        senderPubkey: senderPubkey,
        senderNpub: senderPubkey ? pubkeyToNpub(senderPubkey) : ''
    };
}

/**
 * Publish a signed event to the default relays (waits for at least one OK)
 * @param {Object} event - Signed nostr event
 * @param {string[]} relays - Relays to publish to
 * @returns {Promise<Object>} Publish result info
 */
export async function publishToRelays(
    event,
    relays = COMMENT_RELAYS
) {
    const pool = getPool();
    const uniqueRelays = Array.from(new Set(relays));

    // Publish to each relay individually so we can track failures
    const results = await Promise.allSettled(
        uniqueRelays.map((url) => pool.publish([url], event))
    );

    const okCount = results.filter((r) => r.status === 'fulfilled').length;
    const failCount = results.length - okCount;

    if (okCount === 0) {
        throw new Error('Failed to publish event to any relay');
    }

    return { okCount, failCount };
}

/**
 * Fetch comments (kind 1111) for an app using its 'a' tag reference
 * @param {string} pubkey - App publisher pubkey
 * @param {string} appId - App d-tag identifier
 * @param {Object} options - Additional options
 * @param {number} options.limit - Max events to fetch
 * @returns {Promise<Array>} Parsed comment objects
 */
export async function fetchAppComments(pubkey, appId, { limit = 200 } = {}) {
    if (!pubkey || !appId) return [];

    return new Promise((resolve, reject) => {
        try {
            const pool = getPool();
            const appAddress = `32267:${pubkey}:${appId}`;

            const filter = {
                kinds: [KIND_COMMENT],
                '#A': [appAddress],
                limit
            };

            const events = [];
            let eoseCount = 0;
            let resolved = false;
            const totalRelays = COMMENT_RELAYS.length;

            function finalize() {
                if (resolved) return;
                resolved = true;

                // Deduplicate by event id only (same event from multiple relays)
                const uniqueById = new Map();
                for (const evt of events) {
                    if (!uniqueById.has(evt.id)) {
                        uniqueById.set(evt.id, evt);
                    }
                }

                const finalEvents = Array.from(uniqueById.values()).sort(
                    (a, b) => b.createdAt - a.createdAt
                );

                resolve(finalEvents);
            }

            const subscription = pool.subscribe(
                COMMENT_RELAYS,
                filter,
                {
                    onevent(event) {
                        events.push(parseCommentEvent(event));
                    },
                    oneose() {
                        eoseCount++;
                        if (eoseCount >= totalRelays) {
                            subscription.close();
                            finalize();
                        }
                    },
                    onclose() {
                        finalize();
                    }
                }
            );

            setTimeout(() => {
                if (!resolved) {
                    subscription.close();
                    finalize();
                }
            }, CONNECTION_TIMEOUT);
        } catch (err) {
            reject(err);
        }
    });
}

/**
 * Publish a comment (kind 1111) for an app using the browser nostr extension
 * @param {Object} app - App object containing pubkey and dTag
 * @param {string} content - Comment text
 * @param {any} signer - NIP-07 signer (defaults to window.nostr when available)
 * @param {string} version - Optional version string to tag the comment
 * @returns {Promise<Object>} The signed event
 */
/**
 * Publishes a comment on an app (kind 1111) following NIP-22
 * 
 * Tag structure:
 * - Root comment on App:
 *   - Root scope (uppercase): A=32267:<pubkey>:<identifier>, K=32267, P=<app_pubkey>
 *   - Parent (lowercase, same as root because no nesting UI): a=<address>, e=<event_id>, k=32267, p=<app_pubkey>
 *   - Version thread tag: v=<version>
 * - Reply to comment:
 *   - Same root scope A/K/P/v
 *   - Parent comment: e=<parent_id>, k=1111, p=<parent_pubkey>
 * 
 * @param {Object} app - The app object with pubkey and dTag
 * @param {string} content - Comment text
 * @param {Object} signer - NIP-07 signer (window.nostr)
 * @param {string} version - Version string used as thread key (from FileMetadata)
 * @param {Object} [parentComment] - Optional parent comment for replies
 * @param {string} [parentComment.id] - Parent comment event id
 * @param {string} [parentComment.pubkey] - Parent comment author pubkey
 */
export async function publishAppComment(app, content, signer, version, parentComment = null) {
    const nostrSigner = signer || (typeof window !== 'undefined' ? window.nostr : null);
    if (!nostrSigner?.signEvent) {
        throw new Error('Nostr extension not available. Please install/enable it.');
    }

    const trimmed = (content || '').trim();
    if (!trimmed) {
        throw new Error('Comment cannot be empty.');
    }

    if (!app?.pubkey || !app?.dTag) {
        throw new Error('Missing app information for comment.');
    }

    if (!version) {
        throw new Error('Version is required as thread key.');
    }

    const appAddress = `32267:${app.pubkey}:${app.dTag}`;
    const rootKind = String(KIND_APP);
    const tags = [
        ['A', appAddress, RELAY_URL],
        ['K', rootKind],
        ['P', app.pubkey, RELAY_URL],
        ['v', version]
    ];

    // Parent references (lowercase) - for top-level comments the parent is the app event itself
    if (parentComment?.id && parentComment?.pubkey) {
        tags.push(['e', parentComment.id, RELAY_URL, parentComment.pubkey]);
        tags.push(['k', String(KIND_COMMENT)]);
        tags.push(['p', parentComment.pubkey, RELAY_URL]);
    } else {
        tags.push(['a', appAddress, RELAY_URL, app.pubkey]);
        if (app.id) {
            tags.push(['e', app.id, RELAY_URL, app.pubkey]);
        }
        tags.push(['k', rootKind]);
        tags.push(['p', app.pubkey, RELAY_URL]);
    }

    const unsignedEvent = {
        kind: KIND_COMMENT,
        created_at: Math.floor(Date.now() / 1000),
        tags,
        content: trimmed
    };

    const signedEvent = await nostrSigner.signEvent(unsignedEvent);
    await publishToRelays(signedEvent);
    return signedEvent;
}

/**
 * Parses a comment event (kind 1111)
 * 
 * Tag structure:
 * - A: App address (32267:<pubkey>:<identifier>) - root anchor
 * - K: App kind (32267)
 * - P: App pubkey
 * - v: Version/thread key
 * - a/e: Parent item reference (app or comment)
 * - k: Parent kind (32267 for top-level, 1111 for replies)
 * - p: Parent author pubkey
 * 
 * @param {Object} event - Raw nostr event
 * @returns {Object} Parsed comment object
 */
export function parseCommentEvent(event) {
    const tagMap = {};
    for (const tag of event.tags || []) {
        if (Array.isArray(tag) && tag.length >= 2) {
            const [k, v] = tag;
            if (!tagMap[k]) tagMap[k] = v;
        }
    }

    return {
        id: event.id,
        pubkey: event.pubkey,
        npub: pubkeyToNpub(event.pubkey),
        createdAt: event.created_at,
        content: event.content || '',
        contentHtml: renderMarkdown(event.content || ''),
        // Root anchor (App)
        appAddress: tagMap.A || '',
        appKind: tagMap.K || '',
        appPubkey: tagMap.P || '',
        // Thread key (version) - NIP-22 requires `v`
        version: tagMap.v || '',
        // Parent reference
        parentAddress: tagMap.a || '',
        parentId: tagMap.e || null,
        parentKind: tagMap.k || null,
        parentPubkey: tagMap.p || null,
        // Is this a reply?
        isReply: String(tagMap.k || '') === String(KIND_COMMENT),
        fullEvent: event
    };
}

// ============================================================================
// NIP-57 Zapping Functions
// ============================================================================

const KIND_ZAP_REQUEST = 9734;

/**
 * Parses a Lightning Address (lud16) to get the LNURL endpoint
 * @param {string} lud16 - Lightning address (e.g., user@domain.com)
 * @returns {string} LNURL endpoint URL
 */
function parseLud16ToUrl(lud16) {
    if (!lud16 || typeof lud16 !== 'string') return null;
    const [name, domain] = lud16.split('@');
    if (!name || !domain) return null;
    return `https://${domain}/.well-known/lnurlp/${name}`;
}

/**
 * Decodes a bech32-encoded LNURL (lud06) to get the endpoint URL
 * Uses the bech32 library from nostr-tools
 * @param {string} lud06 - Bech32-encoded LNURL
 * @returns {string} LNURL endpoint URL
 */
function decodeLud06(lud06) {
    if (!lud06 || typeof lud06 !== 'string') return null;
	const normalized = lud06.trim().toLowerCase();
	if (!normalized.startsWith('lnurl1')) return null;
    
    try {
		const { words } = bech32.decode(normalized, 2000);
		const data = bech32.fromWords(words);
		const url = new TextDecoder().decode(Uint8Array.from(data));
		
		if (!url.startsWith('http')) {
			console.warn('Decoded lud06 is not a valid http(s) URL:', url);
			return null;
		}

		return url;
    } catch (err) {
        console.warn('Failed to decode lud06:', err);
        return null;
    }
}

/**
 * Gets the zap endpoint URL for a given pubkey by fetching their profile
 * Forces a fresh fetch to ensure we have lud16/lud06 fields
 * @param {string} pubkey - The recipient's public key
 * @returns {Promise<Object|null>} Object with endpoint URL and other LNURL data, or null
 */
export async function getZapEndpoint(pubkey) {
    if (!pubkey) return null;

    try {
        // Fetch the profile fresh (skip cache to ensure we have lud16/lud06)
        const profile = await fetchProfileFresh(pubkey);
        if (!profile) {
            console.warn('No profile found for pubkey:', pubkey);
            return null;
        }

        console.log('Profile for zap:', { pubkey, lud16: profile.lud16, lud06: profile.lud06 });

        // Try lud16 first (Lightning Address), then lud06 (LNURL)
        let lnurlEndpoint = null;
        if (profile.lud16) {
            lnurlEndpoint = parseLud16ToUrl(profile.lud16);
        } else if (profile.lud06) {
            lnurlEndpoint = decodeLud06(profile.lud06);
        }

        if (!lnurlEndpoint) {
            console.warn('No lightning address found in profile:', profile);
            return null;
        }

        // Fetch LNURL metadata
        const response = await fetch(lnurlEndpoint);
        if (!response.ok) {
            throw new Error(`LNURL fetch failed: ${response.status}`);
        }

        const lnurlData = await response.json();
        
        // Verify it supports zaps (must have allowsNostr and nostrPubkey)
        if (!lnurlData.allowsNostr || !lnurlData.nostrPubkey) {
            console.warn('LNURL endpoint does not support Nostr zaps');
            return null;
        }

        return {
            callback: lnurlData.callback,
            minSendable: lnurlData.minSendable || 1000, // millisats
            maxSendable: lnurlData.maxSendable || 100000000000, // millisats
            nostrPubkey: lnurlData.nostrPubkey,
            allowsNostr: lnurlData.allowsNostr,
            lnurlEndpoint
        };
    } catch (err) {
        console.error('Error getting zap endpoint:', err);
        return null;
    }
}

/**
 * Creates and signs a zap request event (kind 9734) for an app
 * @param {Object} app - The app object with pubkey and dTag
 * @param {number} amountSats - Amount in satoshis
 * @param {string} comment - Optional zap comment
 * @param {Object} signer - NIP-07 signer (window.nostr)
 * @returns {Promise<Object>} Signed zap request event
 */
export async function createZapRequest(app, amountSats, comment = '', signer = null) {
    const nostrSigner = signer || (typeof window !== 'undefined' ? window.nostr : null);
    if (!nostrSigner?.signEvent) {
        throw new Error('Nostr extension not available. Please install/enable it.');
    }

    if (!app?.pubkey || !app?.dTag) {
        throw new Error('Missing app information for zap request.');
    }

    if (!amountSats || amountSats <= 0) {
        throw new Error('Invalid zap amount.');
    }

    const amountMillisats = amountSats * 1000;
    const appAddress = `32267:${app.pubkey}:${app.dTag}`;

    const tags = [
        ['p', app.pubkey],
        ['a', appAddress],
        ['amount', String(amountMillisats)],
        ['relays', ...SOCIAL_RELAYS]
    ];

    // Add event ID if available
    if (app.id) {
        tags.push(['e', app.id]);
    }

    const unsignedEvent = {
        kind: KIND_ZAP_REQUEST,
        created_at: Math.floor(Date.now() / 1000),
        tags,
        content: comment.trim()
    };

    const signedEvent = await nostrSigner.signEvent(unsignedEvent);
    return signedEvent;
}

/**
 * Requests a Lightning invoice from the LNURL callback with the zap request
 * @param {string} callback - The LNURL callback URL
 * @param {Object} zapRequest - Signed zap request event
 * @param {number} amountSats - Amount in satoshis
 * @returns {Promise<Object>} Object containing the invoice (pr) and other data
 */
export async function requestZapInvoice(callback, zapRequest, amountSats) {
    if (!callback || !zapRequest) {
        throw new Error('Missing callback or zap request.');
    }

    const amountMillisats = amountSats * 1000;
    const zapRequestJson = JSON.stringify(zapRequest);

    // Build callback URL with params
    const url = new URL(callback);
    url.searchParams.set('amount', String(amountMillisats));
    // URLSearchParams will handle encoding - avoid double-encoding the zap request
    url.searchParams.set('nostr', zapRequestJson);

    try {
        const response = await fetch(url.toString());
        if (!response.ok) {
            throw new Error(`Invoice request failed: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.status === 'ERROR') {
            throw new Error(data.reason || 'Failed to get invoice');
        }

        if (!data.pr) {
            throw new Error('No invoice returned from LNURL endpoint');
        }

        return {
            invoice: data.pr,
            successAction: data.successAction,
            routes: data.routes
        };
    } catch (err) {
        console.error('Error requesting zap invoice:', err);
        throw err;
    }
}

/**
 * Full zap flow: get endpoint, create request, get invoice
 * @param {Object} app - The app to zap
 * @param {number} amountSats - Amount in satoshis
 * @param {string} comment - Optional comment
 * @param {Object} signer - NIP-07 signer
 * @returns {Promise<Object>} Object with invoice and other details
 */
export async function createZap(app, amountSats, comment = '', signer = null) {
    // 1. Get zap endpoint from publisher's profile
    const endpoint = await getZapEndpoint(app.pubkey);
    if (!endpoint) {
        throw new Error('This publisher has not set up a Lightning address for receiving zaps.');
    }

    // 2. Validate amount
    const amountMillisats = amountSats * 1000;
    if (amountMillisats < endpoint.minSendable) {
        throw new Error(`Minimum zap amount is ${Math.ceil(endpoint.minSendable / 1000)} sats.`);
    }
    if (amountMillisats > endpoint.maxSendable) {
        throw new Error(`Maximum zap amount is ${Math.floor(endpoint.maxSendable / 1000)} sats.`);
    }

    // 3. Create and sign zap request
    const zapRequest = await createZapRequest(app, amountSats, comment, signer);

    // 4. Request invoice from LNURL endpoint
    const invoiceData = await requestZapInvoice(endpoint.callback, zapRequest, amountSats);

    return {
        invoice: invoiceData.invoice,
        zapRequest,
        endpoint,
        amountSats,
        successAction: invoiceData.successAction
    };
}

/**
 * Subscribe to zap receipts (kind 9735) for a specific recipient
 * Used to detect when a zap payment has been completed
 * @param {string} recipientPubkey - The pubkey receiving the zap
 * @param {string} zapRequestId - The ID of our zap request event
 * @param {Function} onReceipt - Callback when receipt is received
 * @param {Object} options - Extra matching hints
 * @param {string} options.invoice - Optional BOLT11 invoice to match via bolt11 tag
 * @param {string} options.appAddress - Optional a-tag (app address) to match
 * @param {string} options.appEventId - Optional e-tag (app event id) to match
 * @returns {Function} Unsubscribe function
 */
export function subscribeToZapReceipt(recipientPubkey, zapRequestId, onReceipt, options = {}) {
    const pool = getPool();
    let closed = false;
    let foundReceipt = false;
    const { invoice, appAddress, appEventId } = options;
    
    // Subscribe to all relays where zap receipts might appear
    // Include common wallet/zap relays in addition to social relays
    const zapRelays = [
        ...SOCIAL_RELAYS,
        RELAY_URL,
        'wss://nos.lol',
        'wss://relay.nostr.band',
        'wss://nostr.wine'
    ];
    // Dedupe
    const allRelays = [...new Set(zapRelays)];
    
    // Use a recent since to avoid getting flooded with old events
    // But keep it open for new events after EOSE
    const since = Math.floor(Date.now() / 1000) - 300; // Last 5 minutes
    
    // NOTE: Standard is lowercase 'p' tag, but we'll subscribe to both
    // in case some implementations incorrectly use uppercase
    const filters = [
        {
            kinds: [9735],
            '#p': [recipientPubkey],
            since
        },
        {
            kinds: [9735],
            '#P': [recipientPubkey],
            since
        }
    ];

    console.log('=== ZAP RECEIPT SUBSCRIPTION ===');
    console.log('Relays:', allRelays);
    console.log('Recipient pubkey:', recipientPubkey);
    console.log('Zap request ID to match:', zapRequestId);
    console.log('Filters:', JSON.stringify(filters));

    const subscription = pool.subscribeMany(
        allRelays,
        filters,
        {
            onevent(event) {
                if (closed || foundReceipt) return;
                
                console.log('=== RECEIVED ZAP RECEIPT ===');
                console.log('Event ID:', event.id);
                console.log('Event kind:', event.kind);
                console.log('Event tags:', JSON.stringify(event.tags));
                
                // Helper to finalize on match
                const finalizeMatch = () => {
                    console.log('*** MATCHING ZAP RECEIPT FOUND! ***');
                    foundReceipt = true;
                    const parsedZap = parseZapEventWithSender(event);
                    onReceipt(parsedZap);
                };
                
                // 1) Primary match: description tag contains zap request JSON with matching id
                const descriptionTag = event.tags.find(t => t[0] === 'description');
                if (descriptionTag && descriptionTag[1]) {
                    try {
                        const zapRequest = JSON.parse(descriptionTag[1]);
                        console.log('Embedded zap request ID:', zapRequest.id);
                        if (zapRequest.id === zapRequestId) {
                            finalizeMatch();
                            return;
                        }
                    } catch (e) {
                        console.log('Failed to parse description tag:', e);
                    }
                }
                
                // 2) Fallback: bolt11 tag matches the invoice we requested
                if (invoice) {
                    const bolt11Tag = event.tags.find(t => t[0] === 'bolt11');
                    if (bolt11Tag && bolt11Tag[1] && bolt11Tag[1].toLowerCase() === invoice.toLowerCase()) {
                        console.log('Matched via bolt11 tag');
                        finalizeMatch();
                        return;
                    }
                }
                
                // 3) Fallback: a-tag matches app address
                if (appAddress) {
                    const aTag = event.tags.find(t => t[0] === 'a' && t[1] === appAddress);
                    if (aTag) {
                        console.log('Matched via a-tag');
                        finalizeMatch();
                        return;
                    }
                }
                
                // 4) Fallback: e-tag matches app event id
                if (appEventId) {
                    const eTag = event.tags.find(t => t[0] === 'e' && t[1] === appEventId);
                    if (eTag) {
                        console.log('Matched via e-tag');
                        finalizeMatch();
                        return;
                    }
                }
            },
            oneose() {
                console.log('EOSE received - subscription will continue listening for new events');
            },
            onclose(reasons) {
                console.log('Zap receipt subscription closed:', reasons);
            }
        }
    );

    // Return unsubscribe function
    return () => {
        if (!closed) {
            closed = true;
            subscription.close();
            console.log('Unsubscribed from zap receipts');
        }
    };
}