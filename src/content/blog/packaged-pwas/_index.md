---
title: "Packaged PWAs: A New Standard for Web App Distribution"
date: 2025-10-29
draft: true
---

Progressive Web Apps promised to bridge the gap between web and native applications, offering app-like experiences without the friction of app stores. While PWAs have delivered on many fronts—offline capabilities, push notifications, home screen installation—they haven't quite escaped the fundamental constraints of the web platform itself.

Today, we're introducing a new standard that addresses these limitations: **Packaged PWAs**. And Zapstore will be the first runtime to support it.

## The PWA Paradox

PWAs represent a significant step forward in web technology, but they come with inherent tradeoffs that limit their potential:

**Installation requires domain access.** Users must visit a specific web address before they can install the app. If that domain goes down, becomes compromised, or changes hands, users lose access. There's no way to share an app directly with someone or install it from alternative sources.

**No versioning or integrity verification.** A PWA is fundamentally a collection of files served from a web server. There's no single artifact that can be versioned, no hash that can verify the entire application's integrity. When you "update" a PWA, you're trusting that the server is delivering the correct files, without any cryptographic guarantees.

**Limited user control.** Users can't truly own their PWA installations. They can't back them up, share them with others, or run them independently of the original server. Even with service workers caching assets locally, the app remains tethered to its origin domain.

**Online dependency.** While PWAs can work offline after initial installation, that first visit requires internet connectivity. In regions with poor connectivity or for users who want to install apps via alternative means (USB drives, local networks, etc.), this is a significant barrier.

These aren't just theoretical concerns. They represent real limitations that prevent PWAs from being a true alternative to native app distribution.

## Enter Packaged PWAs

What if we could take all the benefits of PWAs—web technologies, cross-platform compatibility, no compilation required—but package them in a way that addresses these limitations?

That's exactly what Packaged PWAs do.

A Packaged PWA is a complete web application bundled into a single, compressed archive (essentially a ZIP file with a specific structure). This archive contains everything the app needs to run: HTML, CSS, JavaScript, images, manifest, service worker, and any other assets.

The key difference? This package can be:

- **Versioned explicitly** - Each release has a clear version number
- **Cryptographically signed** - Developers sign packages with their keys
- **Verified entirely** - A single hash represents the complete application
- **Distributed freely** - Shared via any channel: HTTP downloads, torrents, USB drives, Nostr events
- **Installed offline** - No internet required after download
- **Truly owned** - Users control their copies completely

Think of it as bringing the best parts of APK distribution to web applications, but without the platform lock-in.

## How It Works

The concept is elegantly simple:

1. Developers build their web app as they normally would
2. They bundle it into a standardized package format
3. They sign the package with their cryptographic key
4. Users download and verify the package signature
5. Compatible runtimes (like Zapstore) extract and execute the web app

The runtime provides a secure sandbox—similar to a browser—where the packaged web app runs. Users get the familiar PWA experience, but with the benefits of packaged distribution.

Importantly, this doesn't require reinventing the wheel. Packaged PWAs use the same web technologies developers already know: HTML, CSS, JavaScript, Web APIs. The only difference is the packaging and distribution mechanism.

## Why Now?

The timing for this standard couldn't be more critical.

In August 2025, Google announced new requirements for Android app development that fundamentally change the landscape. Starting in 2026, anyone developing apps for certified Android devices must register as a verified developer with Google. This involves:

- Paying registration fees to Google
- Accepting Google's Terms and Conditions
- Providing government-issued identification
- Uploading evidence of your app's private signing key
- Pre-registering all current and future application identifiers

While framed as a security measure, these requirements create significant barriers:

**Financial barriers.** Not everyone can afford registration fees, especially developers in developing nations or those just starting out.

**Privacy concerns.** Many developers are uncomfortable providing government ID and detailed personal information to a corporation.

**Sovereignty issues.** Requiring submission of signing key evidence creates a single point of compromise. If Google's systems are breached or compelled by governments, all registered developers are at risk.

**Innovation constraints.** Pre-registering application identifiers stifles experimentation. What if you want to prototype multiple app ideas? What about AI-generated applications or autonomous software systems?

These requirements effectively mean that **building even a simple APK for personal use or internal distribution now requires registering with Google and accepting their oversight.**

This represents a fundamental shift from Android's original openness. The platform that once allowed anyone to compile and install apps freely is now gating that ability behind corporate registration and surveillance.

## The Web App Alternative

This is where Packaged PWAs shine as an alternative path forward.

By leveraging web technologies, developers can create sophisticated applications without:

- Needing platform-specific SDKs
- Compiling to native code
- Registering with gatekeepers
- Submitting to corporate oversight
- Paying platform taxes

And with the Packaged PWA standard, they don't sacrifice the benefits that traditionally required going native:

- Offline-first operation
- Verifiable integrity
- Direct distribution
- User ownership
- Version control

A developer in any country, with any level of resources, can build a web app, package it, sign it with their Nostr key, and distribute it to users—no registration, no fees, no gatekeepers.

## Trust in a Decentralized World

One challenge with direct distribution has always been trust: how do users know the software they're downloading is legitimate?

Traditional solutions involve complex certificate authorities, key servers, and trust hierarchies. But Zapstore already has a better answer: the Nostr social graph.

When you download a Packaged PWA through Zapstore:

1. The package signature is verified against the developer's Nostr pubkey
2. You can see the developer's social presence and reputation
3. Reviews and recommendations come from your web of trust
4. If a key is compromised, developers can quickly rotate using NIP-41
5. Curators can create trusted collections (NIP-51) of verified apps

This isn't theoretical trust infrastructure we need to build—it's leveraging the social graph that already exists on Nostr. Your trust in an application can derive from your trust in the developer as a person within your social network.

## Beyond Mobile: A Cross-Platform Future

While much of this discussion has focused on Android (given Google's recent announcement), Packaged PWAs aren't platform-specific.

The same packaged web app can run on:

- Android (via Zapstore)
- Desktop Linux (future runtimes)
- Windows (future runtimes)
- macOS (future runtimes)
- Any platform with a compatible runtime

This is the original promise of the web: write once, run anywhere. But with the added benefits of packaged distribution, cryptographic verification, and decentralized trust.

As more runtimes adopt the standard, developers can reach users across all platforms with a single codebase and packaging format. No more maintaining separate builds for Android, iOS, Windows, Mac, and Linux. Just bundle once and let compatible runtimes handle the rest.

## What This Means for Developers

If you're a developer, Packaged PWAs offer compelling advantages:

**Lower barriers to entry.** No registration fees, no gatekeepers, no mandatory IDs. Just build and ship.

**True ownership.** You control your signing keys, your distribution, your relationship with users. No platform can delist you or take 30% of your revenue.

**Simplified development.** One codebase using web technologies you already know. No need to learn Swift, Kotlin, or platform-specific APIs.

**Direct monetization.** Integrate Lightning payments, Nostr Wallet Connect, or other open payment systems. Keep 100% of what users pay you.

**Authentic relationships.** Engage with users directly through Nostr. Get feedback, provide support, build community—all without platform intermediaries.

## What This Means for Users

For users, the benefits are equally significant:

**True ownership.** When you download a Packaged PWA, it's yours. Back it up, share it with friends, keep using it even if the developer stops maintaining it.

**Privacy.** No app store tracking what you download and use. No mandatory accounts or data harvesting.

**Security.** Cryptographic verification ensures the app hasn't been tampered with. Social trust helps you avoid malicious software.

**Choice.** Install apps from anywhere: direct from developers, curated collections, recommendations from friends. No artificial restrictions.

**Resilience.** Apps don't disappear because a platform decided to delist them or a domain expired. Your installed apps continue working.

## The Road Ahead

We're launching Zapstore as the first runtime for Packaged PWAs, but the goal is much larger than a single application.

We want to establish an open standard that anyone can implement. The specification will be public, the format will be documented, and we'll encourage others to build compatible runtimes.

Some open questions we're still exploring:

**How do we handle permissions?** Web APIs already have permission models, but do packaged apps need additional controls?

**What about updates?** How can we balance automatic updates (for security) with user control and verification?

**Progressive enhancement?** Should packages be able to declare optional features that may not be available in all runtimes?

**Plugin architectures?** Can Packaged PWAs support extensions or plugins, and how should those be secured?

We don't have all the answers yet, and we're eager to collaborate with the community to refine the standard.

## Getting Started

We're currently in the early stages of rolling out Packaged PWA support in Zapstore. If you're a developer interested in being part of the pilot program, or if you're curious about building a compatible runtime, we'd love to hear from you.

The future of app distribution doesn't have to be controlled by corporations demanding fees, IDs, and submission. It can be open, decentralized, and built on trust networks that users and developers create together.

Packaged PWAs are our contribution to that future. We hope you'll join us in building it.

---

_Interested in learning more? Join the conversation on [Nostr](https://zapstore.dev) or check out our [documentation](/docs) to start building with Packaged PWAs._



