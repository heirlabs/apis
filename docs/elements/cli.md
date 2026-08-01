# CLI (`heir-element`)

`heir-element` — the CLI for building, validating, packing, signing, and
publishing HEIR Desk Elements. Package: **`@morbidcorp/elements-cli`**.

The companion [`@morbidcorp/element-sdk`](https://www.npmjs.com/package/@morbidcorp/element-sdk) is the source
of truth for the protocol, manifest schema, CSP, integrity, emulator, and scanner; this
CLI imports them and never reimplements them.

- [Getting started](/elements/getting-started)
- [Bridge API](/elements/api)
- [Manifest](/elements/manifest)

> Live `publish` (non–dry-run) targets a registry that is **not publicly open**. Prefer `--dry-run` until the marketplace is announced.

## Install

```sh
npm install -g @morbidcorp/elements-cli
heir-element --version
```

Requires Node.js >= 18.

Working from source instead? Clone and link (the repos are private — your git
https auth must have access to `heirlabs/elements-cli` and
`heirlabs/elements-sdk`):

```sh
git clone https://github.com/heirlabs/elements-cli.git
cd elements-cli
npm install
npm install -g .
```

> Avoid `npm install -g github:heirlabs/elements-cli`: npm prepares nested git
> dependencies without installing their devDependencies, so the TypeScript
> `prepare` build fails with `tsc: command not found`. Use the npm package or
> the clone route above.

## Commands

All commands support `--help`. Exit codes: `0` ok, `1` validation/user error,
`2` unexpected error. Config lives in `~/.config/heir-element/` (override with
`HEIR_ELEMENT_HOME`).

### `heir-element init <dir>`

Scaffold the "Hello Desk" template: a full valid `manifest.json`, an
`index.html` + `src/main.js` + `src/style.css` demo that exercises the bridge
surface (`getContext`, `ui.setTitle`, storage-persisted note, toast,
`ui.confirm`, `llm.complete`, theme events), plus `package.json`, `.gitignore`,
and a `README.md`.

| Flag | Meaning |
|---|---|
| `--id <id>` | element id (default `com.example.<dirname>`) |
| `--name <name>` | display name (default from dirname) |
| `--sdk-dep <spec>` | `@morbidcorp/element-sdk` dependency spec (default `^0.1.0`) |
| `--yes` | accept defaults, never prompt |
| `--force` | scaffold into a non-empty directory |

### `heir-element dev [dir]`

Local sandbox shell with cross-origin realism: mock desk chrome (title bar,
publisher identity strip, permission badges, toasts, host-drawn confirm
dialogs) at `http://localhost:<port>/`, the element in an
`<iframe sandbox="allow-scripts">` served from `http://127.0.0.1:<port>/element/`
— a different origin by host, with the exact production CSP from the SDK's
`generateElementCsp` plus `Cross-Origin-Resource-Policy: cross-origin`.

The bridge is the SDK's real `EmulatorCore` + `attachIframeHost`. Storage
persists to `.heir/dev-storage.json` (1 MB quota; delete the file to simulate
uninstall-deletes-data). The server binds loopback (`127.0.0.1`) only, and the
`/api/*` endpoints reject requests from foreign origins/hosts. Every bridge
call is logged to the terminal:

```
[bridge] llm.complete ok 812ms
```

Rebuilds on change (esbuild) and reloads the shell via SSE.

| Flag | Meaning |
|---|---|
| `--port <n>` | port (default 4820) |
| `--no-open` | do not open the browser |

`llm.complete` uses a deterministic offline stub by default. To use a real
model, set `HEIR_DEV_LLM_URL` to an OpenAI-compatible chat-completions
endpoint (plus optional `HEIR_DEV_LLM_KEY`, `HEIR_DEV_LLM_MODEL`). The key
lives in the CLI process only — it never reaches the browser or the frame,
mirroring production where BYO keys never cross the bridge.

### `heir-element validate [dir]`

Two local, synchronous stages that mirror the registry's submission checks, so
you never burn an immutable version number on a mechanical failure:

1. Manifest validation via the SDK's `validateManifest`.
2. Static scan of the **built** bundle:

| Check | Severity |
|---|---|
| `eval` / `new Function` / string-arg timers | error |
| `document.cookie`, `localStorage`, `sessionStorage`, `indexedDB`, `caches` | error |
| Remote `<script src>` / `import` from a URL | error |
| `navigator.serviceWorker` | error |
| Network URL literals with origins not in `manifest.endpoints` | error |
| Hidden iframes (`display:none`, zero-size, `srcdoc`) | error |
| Compressed bundle over 5 MB | error |
| Manifest `entry` missing from the bundle | error |
| High-entropy string literals (embedded-secret smell) | warning |
| `setInterval` / `requestAnimationFrame` tight loops (< 250 ms) | warning |
| `window.top` / `window.parent` access | warning |
| Inline base64 blobs over 100 KB | warning |

The scan is review-assist; the CSP is the actual boundary.

| Flag | Meaning |
|---|---|
| `--audience <aud>` | `third-party` (default) or `first-party` |
| `--json` | machine-readable `{ok, errors, warnings}` |

Exits 1 on any error.

### `heir-element pack [dir]`

Production build, then a **deterministic** `bundle.tar.gz`: entries sorted
lexicographically, portable tar, mtimes zeroed, gzip mtime 0 — packing twice
(or after touching file mtimes) yields the identical sha256. Excludes
`manifest.json`, `node_modules`, `src/`, `.git`, and `.heir` from the bundle,
plus dev metadata (`.gitignore`, `package.json`, `package-lock.json`,
`README.md`) — the bundle carries runtime assets only; the manifest travels
alongside it. Writes `.heir/publish/manifest.json` with
`integrity.bundleHash`/`sizeBytes` filled (signature still null), enforces the
5 MB cap, and prints the hash and size.

| Flag | Meaning |
|---|---|
| `-o <file>` | output path (default `.heir/publish/bundle.tar.gz`) |

### `heir-element keygen`

Generate an ed25519 publisher keypair via the SDK. The key file is written to
`~/.config/heir-element/keys/<publisher>.json` with mode `0600`. Only the
**public** key is printed — the registry needs it at publisher registration.
The private key is never printed or logged.

| Flag | Meaning |
|---|---|
| `--publisher <id>` | key file name (default `default`) |
| `--force` | overwrite an existing key file |

### `heir-element publish [dir]`

Fresh pack, sign (`manifestHash` + domain-separated ed25519 signature via the
SDK's `signSubmission`), validate in submission mode, then submit.

| Flag | Meaning |
|---|---|
| `--registry <url>` | registry base URL (or `HEIR_REGISTRY_URL`) |
| `--key <path\|id>` | key file path, or publisher id under the config dir |
| `--token <t>` | publish token (or `HEIR_PUBLISH_TOKEN`) — the 2FA step-up token |
| `--dry-run` | write `.heir/publish/{manifest.json, bundle.tar.gz, request.json}` and self-verify the signature; upload nothing |

`request.json` describes the exact HTTP call (method, URL, header **names**
only — never token values, multipart fields `manifest` + `bundle` +
`publisherSig`).

Live mode responses: `201` submitted (`in_review`); `401`/`403` auth guidance;
`409` the `(id, version)` pair was already submitted — versions are immutable,
bump the version; `422` prints the server's issue list. No retries on 4xx; a
single retry on network errors/5xx.

## Development

```sh
npm install       # resolves @morbidcorp/element-sdk from the npm registry
npm run build     # tsc -> dist/
npm test          # vitest
```

## License

Proprietary. Copyright (c) 2026 Heir Labs. All rights reserved. See LICENSE.
