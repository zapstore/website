#!/usr/bin/env node

import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { nip19, SimplePool } from 'nostr-tools';

const RELAYS = [
	'wss://relay.damus.io',
	'wss://relay.primal.net',
	'wss://nos.lol',
	'wss://relay.nostr.band',
	'wss://purplepag.es',
	'wss://relay.snort.social'
];

const [, , input] = process.argv;

if (!input) {
	console.error('Usage: add-testimonial <nevent|note|hex-id>');
	process.exit(1);
}

function decodeEventId(value) {
	try {
		const decoded = nip19.decode(value);
		if (decoded.type === 'nevent' && decoded.data.id) return decoded.data.id;
		if (decoded.type === 'note' && decoded.data) return decoded.data;
		throw new Error(`Unsupported type "${decoded.type}"`);
	} catch (error) {
		if (/^[0-9a-f]{64}$/i.test(value)) {
			return value.toLowerCase();
		}
		console.error('Could not decode event id from input:', error.message);
		process.exit(1);
	}
}

const eventId = decodeEventId(input);

const scriptDir = dirname(fileURLToPath(import.meta.url));
const rawPath = resolve(scriptDir, 'testimonials-raw.json');
const searchPath = resolve(scriptDir, 'testimonials-search.json');
const curatedPath = resolve(scriptDir, '../src/lib/data/testimonials.json');

function loadJson(path) {
	if (!existsSync(path)) return [];
	try {
		return JSON.parse(readFileSync(path, 'utf8'));
	} catch (error) {
		console.error(`Failed to parse ${path}:`, error.message);
		process.exit(1);
	}
}

async function fetchEvent(eventId) {
	const pool = new SimplePool();
	try {
		const event = await pool.get(RELAYS, { ids: [eventId] });
		return event || null;
	} catch (error) {
		console.error('Failed to fetch event from relays:', error.message);
		return null;
	} finally {
		pool.close(RELAYS);
	}
}

async function main() {
	const curated = loadJson(curatedPath);
	if (curated.some(item => item.id === eventId)) {
		console.log(`Event ${eventId} is already in testimonials.json`);
		return;
	}

	const rawEvents = loadJson(rawPath);
	const searchEvents = loadJson(searchPath);
	let candidate = [...rawEvents, ...searchEvents].find(event => event.id === eventId);

	if (!candidate) {
		console.log(`Event ${eventId} not found locally. Fetching from relays...`);
		candidate = await fetchEvent(eventId);
	}

	if (!candidate) {
		console.error(`Event ${eventId} not found. Update local caches or try another relay.`);
		process.exit(1);
	}

	const newEntry = {
		id: candidate.id,
		pubkey: candidate.pubkey,
		content: (candidate.content || '').trim(),
		created_at: candidate.created_at || Math.floor(Date.now() / 1000)
	};

	curated.unshift(newEntry);
	writeFileSync(curatedPath, JSON.stringify(curated, null, 2) + '\n');

	const preview =
		newEntry.content.length > 80 ? `${newEntry.content.slice(0, 80)}...` : newEntry.content;
	console.log(`Added testimonial ${eventId}: ${preview}`);
}

await main();

