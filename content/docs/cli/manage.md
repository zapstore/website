---
title: Managing packages
type: docs
prev: docs/cli
next: docs/cli/publish
---

## Install or update a package

```bash
zapstore install <package>
# or zapstore i
```

Attempting to install will trigger a web of trust check via [Vertex DVMs](https://vertexlab.io) if the signer is not known. You can skip this by: passing the `-t` argument, or by having no `SIGN_WITH` env var to sign the DVM request with.

## Discover new packages

An experimental command recently added:

```bash
zapstore discover
# or zapstore d
```

It will show recommended packages that are currently not installed.

## List installed packages

```bash
zapstore list <optional-filter>
# or zapstore l
```

If filter is provided it is treated as a regex to filter down installed packages.

## Remove a package

```bash
zapstore remove <package>
# or zapstore r
```

Run `zapstore --help` for more information.
