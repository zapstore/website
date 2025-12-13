/**
 * IndexedDB-based event cache with LRU eviction
 * Caches nostr events (kinds 32267, 30063, 1063, 0) for offline/instant loading
 */

const DB_NAME = 'zapstore-events';
const DB_VERSION = 1;
const STORE_NAME = 'events';

// Cache limits - reasonable for casual browsing
const MAX_EVENTS = 500;
const EVICTION_BATCH = 50; // Remove this many when limit is reached

let dbPromise = null;
// Simple in-memory fallback for SSR/server environments
const memoryStore = new Map();

/**
 * Check if we're in a browser environment with IndexedDB
 * @returns {boolean}
 */
function isBrowser() {
    return typeof window !== 'undefined' && typeof indexedDB !== 'undefined';
}

/**
 * Opens or creates the IndexedDB database
 * @returns {Promise<IDBDatabase>}
 */
function openDB() {
    if (!isBrowser()) {
        return Promise.reject(new Error('IndexedDB not available (SSR)'));
    }

    if (dbPromise) return dbPromise;

    dbPromise = new Promise((resolve, reject) => {

        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = () => {
            console.error('Failed to open IndexedDB:', request.error);
            reject(request.error);
        };

        request.onsuccess = () => {
            resolve(request.result);
        };

        request.onupgradeneeded = (event) => {
            const db = event.target.result;

            // Create object store with composite key (kind + id)
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                const store = db.createObjectStore(STORE_NAME, { keyPath: 'cacheKey' });
                // Index for LRU eviction (by last accessed time)
                store.createIndex('lastAccessed', 'lastAccessed', { unique: false });
                // Index for querying by kind
                store.createIndex('kind', 'kind', { unique: false });
                // Index for querying by kind + lookup key (e.g., pubkey:dTag for apps)
                store.createIndex('lookupKey', 'lookupKey', { unique: false });
            }
        };
    });

    return dbPromise;
}

/**
 * Generates a cache key for an event
 * @param {number} kind - Event kind
 * @param {string} id - Event ID or lookup key
 * @returns {string} Cache key
 */
function getCacheKey(kind, id) {
    return `${kind}:${id}`;
}

// In-memory fallback implementations for SSR
function cacheEventMemory(kind, lookupKey, data) {
    const cacheKey = getCacheKey(kind, lookupKey);
    const now = Date.now();

    memoryStore.set(cacheKey, {
        cacheKey,
        kind,
        lookupKey,
        data,
        lastAccessed: now,
        createdAt: now
    });

    evictMemoryIfNeeded();
}

function getCachedEventMemory(kind, lookupKey) {
    const cacheKey = getCacheKey(kind, lookupKey);
    const record = memoryStore.get(cacheKey);
    if (!record) return null;

    record.lastAccessed = Date.now();
    memoryStore.set(cacheKey, record);
    return record.data;
}

function getCachedEventsByKindMemory(kind) {
    const results = [];
    for (const record of memoryStore.values()) {
        if (record.kind === kind) {
            results.push(record.data);
        }
    }
    return results;
}

function evictMemoryIfNeeded() {
    if (memoryStore.size <= MAX_EVENTS) return;

    const records = Array.from(memoryStore.values()).sort((a, b) => a.lastAccessed - b.lastAccessed);
    const toDelete = records.slice(0, Math.min(EVICTION_BATCH, records.length));

    for (const record of toDelete) {
        memoryStore.delete(record.cacheKey);
    }
}

function clearMemoryCache() {
    memoryStore.clear();
}

function getMemoryCacheStats() {
    const byKind = {};
    for (const record of memoryStore.values()) {
        byKind[record.kind] = (byKind[record.kind] || 0) + 1;
    }
    return { total: memoryStore.size, byKind };
}

/**
 * Stores an event in the cache
 * @param {number} kind - Event kind (32267, 30063, 1063, 0)
 * @param {string} lookupKey - Key for looking up (e.g., pubkey:dTag, pubkey, eventId)
 * @param {Object} data - The parsed event data to cache
 * @returns {Promise<void>}
 */
export async function cacheEvent(kind, lookupKey, data) {
    if (!isBrowser()) {
        cacheEventMemory(kind, lookupKey, data);
        return;
    }

    try {
        const db = await openDB();
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);

        const cacheKey = getCacheKey(kind, lookupKey);
        const record = {
            cacheKey,
            kind,
            lookupKey,
            data,
            lastAccessed: Date.now(),
            createdAt: Date.now()
        };

        store.put(record);

        await new Promise((resolve, reject) => {
            tx.oncomplete = resolve;
            tx.onerror = () => reject(tx.error);
        });

        // Check if we need to evict
        await evictIfNeeded();
    } catch (err) {
        console.warn('Failed to cache event:', err);
    }
}

/**
 * Retrieves an event from the cache
 * @param {number} kind - Event kind
 * @param {string} lookupKey - Key for looking up
 * @returns {Promise<Object|null>} Cached data or null
 */
export async function getCachedEvent(kind, lookupKey) {
    if (!isBrowser()) {
        return getCachedEventMemory(kind, lookupKey);
    }

    try {
        const db = await openDB();
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);

        const cacheKey = getCacheKey(kind, lookupKey);
        const request = store.get(cacheKey);

        const record = await new Promise((resolve, reject) => {
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });

        if (record) {
            // Update last accessed time (LRU)
            record.lastAccessed = Date.now();
            store.put(record);
            return record.data;
        }

        return null;
    } catch (err) {
        console.warn('Failed to get cached event:', err);
        return null;
    }
}

/**
 * Retrieves multiple events by kind
 * @param {number} kind - Event kind
 * @returns {Promise<Array>} Array of cached data objects
 */
export async function getCachedEventsByKind(kind) {
    if (!isBrowser()) {
        return getCachedEventsByKindMemory(kind);
    }

    try {
        const db = await openDB();
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const index = store.index('kind');

        const request = index.getAll(kind);

        const records = await new Promise((resolve, reject) => {
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });

        return records.map(r => r.data);
    } catch (err) {
        console.warn('Failed to get cached events by kind:', err);
        return [];
    }
}

/**
 * Evicts least recently used events if cache exceeds limit
 * @returns {Promise<void>}
 */
async function evictIfNeeded() {
    if (!isBrowser()) {
        evictMemoryIfNeeded();
        return;
    }

    try {
        const db = await openDB();
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);

        // Count total events
        const countRequest = store.count();
        const count = await new Promise((resolve, reject) => {
            countRequest.onsuccess = () => resolve(countRequest.result);
            countRequest.onerror = () => reject(countRequest.error);
        });

        if (count <= MAX_EVENTS) return;

        // Get oldest accessed events
        const index = store.index('lastAccessed');
        const cursorRequest = index.openCursor();
        let deleted = 0;

        await new Promise((resolve, reject) => {
            cursorRequest.onsuccess = (event) => {
                const cursor = event.target.result;
                if (cursor && deleted < EVICTION_BATCH) {
                    store.delete(cursor.primaryKey);
                    deleted++;
                    cursor.continue();
                } else {
                    resolve();
                }
            };
            cursorRequest.onerror = () => reject(cursorRequest.error);
        });

        console.log(`Evicted ${deleted} old events from cache`);
    } catch (err) {
        console.warn('Failed to evict events:', err);
    }
}

/**
 * Clears all cached events
 * @returns {Promise<void>}
 */
export async function clearCache() {
    if (!isBrowser()) {
        clearMemoryCache();
        return;
    }

    try {
        const db = await openDB();
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        store.clear();

        await new Promise((resolve, reject) => {
            tx.oncomplete = resolve;
            tx.onerror = () => reject(tx.error);
        });

        console.log('Event cache cleared');
    } catch (err) {
        console.warn('Failed to clear cache:', err);
    }
}

/**
 * Gets cache statistics
 * @returns {Promise<Object>} Stats object with counts by kind
 */
export async function getCacheStats() {
    if (!isBrowser()) {
        return getMemoryCacheStats();
    }

    try {
        const db = await openDB();
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);

        const allRequest = store.getAll();
        const records = await new Promise((resolve, reject) => {
            allRequest.onsuccess = () => resolve(allRequest.result);
            allRequest.onerror = () => reject(allRequest.error);
        });

        const stats = {
            total: records.length,
            byKind: {}
        };

        for (const record of records) {
            stats.byKind[record.kind] = (stats.byKind[record.kind] || 0) + 1;
        }

        return stats;
    } catch (err) {
        console.warn('Failed to get cache stats:', err);
        return { total: 0, byKind: {} };
    }
}

