#!/bin/bash

# Fetch testimonials (kind 1 notes) where zapstore is tagged
# zapstore npub: npub10r8xl2njyepcw2zwv3a6dyufj4e4ajx86hz6v4ehu4gnpupxxp7stjt2p8
# zapstore hex:  78ce6faa72264387284e647ba6938995735ec8c7d5c5a65737e55130f026307d

ZAPSTORE_PUBKEY="78ce6faa72264387284e647ba6938995735ec8c7d5c5a65737e55130f026307d"

RELAYS=(
    "wss://relay.damus.io"
    "wss://relay.primal.net"
    "wss://nos.lol"
    "wss://relay.nostr.band"
    "wss://purplepag.es"
    "wss://relay.snort.social"
)

OUTPUT_FILE="testimonials-raw.json"

echo "Fetching kind 1 notes tagging zapstore from ${#RELAYS[@]} relays..."
echo "Pubkey: $ZAPSTORE_PUBKEY"
echo ""

# Fetch events and dedupe by event id
nak req -k 1 -p "$ZAPSTORE_PUBKEY" --limit 500 "${RELAYS[@]}" 2>/dev/null | \
    jq -s 'unique_by(.id) | sort_by(-.created_at)' > "$OUTPUT_FILE"

COUNT=$(jq 'length' "$OUTPUT_FILE")
echo "Fetched $COUNT unique testimonials"
echo "Saved to $OUTPUT_FILE"
echo ""

# Show a preview with formatted output
echo "=== TESTIMONIALS PREVIEW ==="
echo ""

jq -r '.[] | "[\(.created_at | strftime("%Y-%m-%d"))] \(.id[0:8])... by \(.pubkey[0:16])...\n\(.content)\n---\n"' "$OUTPUT_FILE" | head -200









