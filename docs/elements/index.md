# Desk Elements

Build small apps that run in windows on the **HEIR Legacy Desk** — inside a closed, validated capability surface.

| Package | Purpose |
|---------|---------|
| [`@morbidcorp/element-sdk`](https://www.npmjs.com/package/@morbidcorp/element-sdk) | Bridge client, manifest schema/validator, CSP, integrity, emulator, static scanner |
| [`@morbidcorp/elements-cli`](https://www.npmjs.com/package/@morbidcorp/elements-cli) | `heir-element` CLI: init, dev, validate, pack, keygen, publish |

## Maturity (honest)

| Area | Status |
|------|--------|
| Local SDK + CLI | **Available** — npm packages, local emulator, pack/sign dry-run |
| Public registry / third-party installs on production desks | **Not open** — operator-gated dark launch; not a public marketplace |
| Host desk sandbox for third-party elements | **In progress** — local `heir-element dev` is the supported surface today |

> **Do not describe registry submission, public install, or third-party desk distribution as live product** until `ELEMENTS_PUBLIC` and registry open criteria are met. Local tooling is real; marketplace open is not.

## Security model (one screen)

- An element is static HTML/JS/CSS in a **sandboxed, cross-origin iframe** with a locked-down CSP (`default-src 'none'`; network only to origins declared in the manifest).
- The only I/O path is the **host-relayed bridge**: a `MessageChannel` port handed at init. Calls are schema-validated, permission-checked, rate-limited, and logged.
- The frame **never holds credentials**. `llm.complete` is host-proxied; keys never cross the bridge.
- `element.getContext` contains **zero user data** — no name, email, or desk name.
- Elements **cannot** access estate data, PII, wallets, proof-of-life, or auth. Scope prefixes `estate.`, `identity.`, `wallet.`, `auth.`, `payments.`, `settings.`, `agent.`, `pol.` are reserved and rejected at schema level.
- Sensitive UI (`ui.confirm`, `ui.openExternal`) is drawn by the host **outside** the frame.
- Bundles are content-addressed (`sha256`) and signed (ed25519).

## Capability surface (`heir-element-api@1`)

| Method | Permission | Notes |
|--------|------------|--------|
| `element.getContext` | none | Install metadata only — no user PII |
| `storage.get` / `set` / `delete` / `list` | `storage.element` | 1 MB element-scoped quota |
| `ui.setTitle` | none | Host-sanitized |
| `ui.requestResize` | none | Host-clamped |
| `ui.toast` | `notifications` | Host-rendered |
| `ui.confirm` | none | Host-drawn dialog |
| `ui.openExternal` | none | Host confirm with full URL |
| `clipboard.writeText` | `clipboard.write` | Fresh user gesture |
| `llm.complete` | `llm.completion` | Host-proxied LLM |

Host→element events: `theme-changed`, `visibility-changed`, `resize`.

## Docs in this section

| Page | Contents |
|------|----------|
| [Getting started](/elements/getting-started) | Zero to validated pack in ~30 minutes |
| [Bridge API](/elements/api) | `connectElement` and every method |
| [Manifest](/elements/manifest) | Manifest v1 fields and error codes |
| [CLI](/elements/cli) | `heir-element` commands and scan rules |

## Quick start

```bash
npm install -g @morbidcorp/elements-cli
heir-element init my-timer
cd my-timer
heir-element dev
```

```ts
import { connectElement } from '@morbidcorp/element-sdk';

const api = await connectElement();
const ctx = await api.getContext();
await api.storage.set('count', '1');
```

Source repos (may be private): [elements-sdk](https://github.com/heirlabs/elements-sdk) · [elements-cli](https://github.com/heirlabs/elements-cli).
