---
title: NIPs
weight: 60
---

Nostr implementation possibilities, better known as [NIPs](https://github.com/nostr-protocol/nips) utilized in Zapstore are listed below. 

Listed are below are both existing and new NIPs.

### New event types

Zapstore extends the Nostr ecosystem with purpose-built kinds to model applications, releases, and curated collections:

- [**Kind 32267 – App**](/docs/nips/app): Describes a software project, its media, supported platforms, and latest release pointer.
- [**Kind 30063 – Release**](/docs/nips/release): A bundle of artifacts for a particular version, referencing file metadata and the parent app.
- [**Kind 1063 – File metadata**](/docs/nips/file-metadata): Hashes, APK manifest values, MIME types, and download URLs for a single artifact.
- [**Kind 30267 – App curation set**](/docs/nips/app-curation-set): Lists of recommended apps curated by a signer or community.
