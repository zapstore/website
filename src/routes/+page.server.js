import { fetchAppsServer, fetchProfileServer } from '$lib/nostr-server.js';
import testimonials from '$lib/data/testimonials.json';
import * as nip19 from 'nostr-tools/nip19';

export async function load() {
	try {
		console.log('[Server] Loading homepage data...');
		
		// Fetch carousel apps and testimonial profiles in parallel
		const carouselAppsPromise = fetchAppsServer({ limit: 24 });
		
		// Get unique pubkeys from testimonials
		const uniquePubkeys = [...new Set(testimonials.map(t => t.pubkey))];
		console.log('[Server] Fetching profiles for', uniquePubkeys.length, 'testimonial authors');
		
		// Fetch profiles in parallel (limit concurrency to avoid overwhelming relays)
		const profilePromises = uniquePubkeys.slice(0, 20).map(pubkey => 
			fetchProfileServer(pubkey).catch(() => null)
		);
		
		const [carouselApps, ...profiles] = await Promise.all([
			carouselAppsPromise,
			...profilePromises
		]);
		
		// Create a map of pubkey -> profile
		const profileMap = {};
		profiles.forEach((profile, index) => {
			if (profile) {
				profileMap[uniquePubkeys[index]] = profile;
			}
		});
		
		// Enrich testimonials with profile data and npub/nevent
		const enrichedTestimonials = testimonials.map(t => {
			const profile = profileMap[t.pubkey];
			let npub, nevent;
			try {
				npub = nip19.npubEncode(t.pubkey);
				nevent = nip19.neventEncode({ id: t.id, author: t.pubkey });
			} catch (e) {
				npub = t.pubkey.slice(0, 12) + '...';
				nevent = t.id;
			}
			return {
				...t,
				npub,
				nevent,
				profile: profile || {
					name: npub.slice(0, 12) + '...',
					picture: null,
					nip05: null
				}
			};
		});
		
		console.log('[Server] Loaded', carouselApps.length, 'apps for carousel');
		console.log('[Server] Loaded', Object.keys(profileMap).length, 'profiles for testimonials');
		
		return {
			carouselApps,
			carouselLoading: false,
			testimonials: enrichedTestimonials
		};
	} catch (e) {
		console.error('[Server] Failed to load homepage data:', e);
		return {
			carouselApps: [],
			carouselLoading: false,
			testimonials: []
		};
	}
}

