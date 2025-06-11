---
title: Download Zapstore
date: 2025-06-11
draft: false
---

{{< tabs items="Zapstore for Android, Zapstore CLI" >}}

{{< tab >}}

## 0.2.6 for Android

Download [here](https://cdn.zapstore.dev/b15e06ae0d516d70777a94b96f24e0cda1dc05285bf8e20890a2b8e3524b9bc3) and install on your device.

{{< callout type="warning" >}}
If this is the first time you install Zapstore on your device, it's important to verify this download.<br><br>
If you are updating, Android will take care of the verification for you.
{{< /callout >}}

### Verification

Are you on a computer? Open a terminal and run `shasum -a 256` on the downloaded file. It should show the following SHA-256 hash:

```text
b15e06ae0d516d70777a94b96f24e0cda1dc05285bf8e20890a2b8e3524b9bc3 
```

Are you on your Android device? Use [AppVerifier](https://github.com/soupslurpr/AppVerifier/releases/latest) and input the following APK certificate hash:

```
99e33b0c2d07e75fcd9df7e40e886646ff667e3aa6648e1a1160b036cf2b9320
```

This can also be done in a computer if you have Android Tools installed, with `apksigner verify --print-certs zapstore.apk`.

For extra assurances, make sure to double check these hashes on [Zapstore's profile on nostr](https://nosta.me/npub10r8xl2njyepcw2zwv3a6dyufj4e4ajx86hz6v4ehu4gnpupxxp7stjt2p8).

{{< /tab >}}

{{< tab >}}
  
## 0.2.0-rc3 CLI for Mac and Linux

Download the file and open a terminal to run `shasum -a 256` on the downloaded file. The corresponding SHA-256 hash should match.

### MacOS (arm64)

[Download](http://cdn.zapstore.dev/6aab4ed12f057739f8f8d37530c197302339bb99d3653ed935017199aa06f344) 

```
6aab4ed12f057739f8f8d37530c197302339bb99d3653ed935017199aa06f344
```

### Linux (x86_64)

[Download](http://cdn.zapstore.dev/facdf270a5808b3b1e49491004c0db1b4e59b25e1849d5bec1ae86cfc9f75cc3) 

```
facdf270a5808b3b1e49491004c0db1b4e59b25e1849d5bec1ae86cfc9f75cc3
```

### Linux (aarch64)

[Download](http://cdn.zapstore.dev/c1445caff3cf6b2dc868434625a0d12fc7054eb65bb9ce3c684aaa34a69f4992) 

```
c1445caff3cf6b2dc868434625a0d12fc7054eb65bb9ce3c684aaa34a69f4992
```

{{< /tab >}}

{{< /tabs >}}