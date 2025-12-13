import { writable, get } from 'svelte/store';
import { browser } from '$app/environment';
import { fetchProfile, pubkeyToNpub } from '$lib/nostr.js';

const STORAGE_KEY = 'zapstore_auth_pubkey';

// Initial state
const initialState = {
	pubkey: null,
	npub: null,
	profile: null,
	isConnected: false,
	isConnecting: false,
	error: null
};

// Create the store
function createAuthStore() {
	const { subscribe, set, update } = writable(initialState);

	// Try to restore session from localStorage on init
	if (browser) {
		const savedPubkey = localStorage.getItem(STORAGE_KEY);
		if (savedPubkey) {
			// Attempt to reconnect with saved pubkey
			reconnect(savedPubkey);
		}
	}

	async function reconnect(savedPubkey) {
		update(state => ({ ...state, isConnecting: true }));

		try {
			// Verify we still have NIP-07 extension available
			if (typeof window.nostr === 'undefined') {
				// Extension not available, clear saved state
				localStorage.removeItem(STORAGE_KEY);
				set(initialState);
				return;
			}

			// Try to get current pubkey from extension
			const currentPubkey = await window.nostr.getPublicKey();
			
			// If pubkey matches saved one, restore session
			if (currentPubkey === savedPubkey) {
				const npub = pubkeyToNpub(currentPubkey);
				const profile = await fetchProfile(currentPubkey);
				
				update(state => ({
					...state,
					pubkey: currentPubkey,
					npub,
					profile,
					isConnected: true,
					isConnecting: false,
					error: null
				}));
			} else {
				// Different account, update localStorage
				localStorage.setItem(STORAGE_KEY, currentPubkey);
				const npub = pubkeyToNpub(currentPubkey);
				const profile = await fetchProfile(currentPubkey);
				
				update(state => ({
					...state,
					pubkey: currentPubkey,
					npub,
					profile,
					isConnected: true,
					isConnecting: false,
					error: null
				}));
			}
		} catch (err) {
			console.warn('Failed to reconnect:', err);
			localStorage.removeItem(STORAGE_KEY);
			set(initialState);
		}
	}

	async function connect() {
		if (!browser) return;

		update(state => ({ ...state, isConnecting: true, error: null }));

		try {
			// Check for NIP-07 extension
			if (typeof window.nostr === 'undefined') {
				throw new Error('No Nostr extension found. Please install Alby, nos2x, or similar.');
			}

			// Get public key from extension
			const pubkey = await window.nostr.getPublicKey();
			const npub = pubkeyToNpub(pubkey);

			// Save to localStorage for session persistence
			localStorage.setItem(STORAGE_KEY, pubkey);

			// Fetch user profile
			const profile = await fetchProfile(pubkey);

			update(state => ({
				...state,
				pubkey,
				npub,
				profile,
				isConnected: true,
				isConnecting: false,
				error: null
			}));

			return { pubkey, npub, profile };
		} catch (err) {
			console.error('Failed to connect:', err);
			update(state => ({
				...state,
				isConnecting: false,
				error: err.message || 'Failed to connect to Nostr extension'
			}));
			throw err;
		}
	}

	function disconnect() {
		if (browser) {
			localStorage.removeItem(STORAGE_KEY);
		}
		set(initialState);
	}

	// Check if NIP-07 extension is available
	function isExtensionAvailable() {
		return browser && typeof window.nostr !== 'undefined';
	}

	return {
		subscribe,
		connect,
		disconnect,
		isExtensionAvailable,
		// Get current state synchronously
		getState: () => get({ subscribe })
	};
}

export const authStore = createAuthStore();

// Convenience exports
export const connect = () => authStore.connect();
export const disconnect = () => authStore.disconnect();
export const isExtensionAvailable = () => authStore.isExtensionAvailable();


