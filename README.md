# HEIR APIs

<p align="center">
  <strong>Open documentation &amp; integrator toolkit for the HEIR HTTP API</strong><br/>
  Digital inheritance infrastructure you can call from servers, agents, and products.
</p>

<p align="center">
  <a href="https://docs.heir.es"><img src="https://img.shields.io/badge/docs-docs.heir.es-0f172a?style=for-the-badge" alt="Documentation" /></a>
  <a href="https://api.heir.es/api/docs"><img src="https://img.shields.io/badge/API-Swagger_UI-2563eb?style=for-the-badge" alt="API docs" /></a>
  <a href="https://api.heir.es/api/docs/openapi.json"><img src="https://img.shields.io/badge/OpenAPI-3.0-85ea2d?style=for-the-badge" alt="OpenAPI" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue?style=for-the-badge" alt="MIT License" /></a>
</p>

<p align="center">
  <a href="https://github.com/heirlabs/apis/actions/workflows/ci.yml"><img src="https://github.com/heirlabs/apis/actions/workflows/ci.yml/badge.svg" alt="CI" /></a>
  <a href="https://status.heir.es"><img src="https://img.shields.io/badge/status-status.heir.es-22c55e?style=flat-square" alt="Status" /></a>
  <a href="https://api.heir.es/api/health"><img src="https://img.shields.io/badge/health-api.heir.es-14b8a6?style=flat-square" alt="API health" /></a>
  <a href="https://t.me/heir_es"><img src="https://img.shields.io/badge/community-Telegram-26A5E4?style=flat-square&logo=telegram&logoColor=white" alt="Telegram" /></a>
  <img src="https://img.shields.io/badge/node-%3E%3D18-339933?style=flat-square&logo=node.js&logoColor=white" alt="Node >= 18" />
</p>

<p align="center">
  <a href="https://docs.heir.es"><strong>Docs</strong></a>
  ·
  <a href="https://docs.heir.es/guide/quickstart"><strong>Quickstart</strong></a>
  ·
  <a href="https://api.heir.es/api/docs"><strong>Interactive API</strong></a>
  ·
  <a href="#examples"><strong>Examples</strong></a>
  ·
  <a href="https://heir.es/developers"><strong>Get an API key</strong></a>
  ·
  <a href="CONTRIBUTING.md"><strong>Contributing</strong></a>
</p>

---

## Why this repo exists

Most “API repos” are either a black-box SaaS marketing page or an abandoned OpenAPI dump.

This one is built for **integrators who ship**:

| You get | Detail |
|---------|--------|
| **Live docs** | [docs.heir.es](https://docs.heir.es) — guides, auth matrix, jurisdictions, security |
| **Live API** | [api.heir.es](https://api.heir.es/api/docs) — OpenAPI + Swagger UI |
| **Runnable examples** | [`examples/`](./examples/) against production |
| **Truth CI** | Docs fail CI if known false claims reappear; live probes on health paths |
| **Honest boundaries** | Session product vs headless `/api/v1` keys — [auth matrix](https://docs.heir.es/guide/auth-matrix) |
| **Agent-ready** | MCP package + OpenAPI codegen path (no phantom language SDKs) |

**Not legal advice.** Generated documents and contracts are tools for builders; court validity depends on jurisdiction, formalities, and counsel.

---

## Table of contents

- [60-second start](#60-second-start)
- [What you can build](#what-you-can-build)
- [Repository map](#repository-map)
- [Authentication](#authentication)
- [Examples](#examples)
- [OpenAPI & clients](#openapi--clients)
- [MCP for agents](#mcp-for-agents)
- [Rate limits & plans](#rate-limits--plans)
- [Local development](#local-development)
- [Documentation map](#documentation-map)
- [Contributing](#contributing)
- [Security](#security)
- [Project links](#project-links)
- [License](#license)

---

## 60-second start

```bash
# 1) Optional: public health (no key)
curl -sS https://api.heir.es/api/health | jq .

# 2) Create a key → https://heir.es/developers
export HEIR_API_KEY="heir_pk_xxxxxxxx"

# 3) List contract templates
curl -sS "https://api.heir.es/api/v1/contracts/templates" \
  -H "Authorization: Bearer $HEIR_API_KEY" | jq .

# 4) Or use the repo examples
./examples/01-health.sh
HEIR_API_KEY=$HEIR_API_KEY ./examples/02-list-templates.sh
```

| Resource | URL |
|----------|-----|
| Interactive API | https://api.heir.es/api/docs |
| OpenAPI JSON | https://api.heir.es/api/docs/openapi.json |
| Developer portal | https://heir.es/developers |

---

## What you can build

- **Contract generation** — inheritance-oriented contracts for EVM, Solana, and TON with legal-framework templates and optional dead-man’s-switch options  
- **Legal document APIs** — generate/store/encrypt drafts via `/api/v1/legal`  
- **Webhooks** — HMAC-signed lifecycle events (partner+ tiers)  
- **Jurisdictions & frameworks** — deep guide surface (common law, civil law, religious, customary)  
- **Desk Elements** — plugin surface (`@morbidcorp/element-sdk`, `heir-element` CLI)  
- **Agents** — MCP tools via `@morbidcorp/heir` (see [MCP docs](https://docs.heir.es/mcp/) for the current install pin)

---

## Repository map

```text
.
├── docs/                   # VitePress → docs.heir.es
│   ├── guide/              # Quickstart, auth, webhooks, platform spine
│   ├── api/                # Endpoint reference
│   ├── examples/           # Long-form tutorials
│   ├── jurisdictions/      # Country & region notes
│   ├── legal-frameworks/   # Inheritance models
│   ├── elements/           # Desk Element SDK & CLI
│   ├── mcp/                # Agent tooling
│   └── security/           # Architecture & practices
├── examples/               # Runnable shell scripts (production)
├── openapi/                # Snapshot via npm run openapi:fetch
├── scripts/                # Docs truth + OpenAPI fetch
├── src/                    # Headless API scaffold / reference modules
├── serve-docs.mjs          # Zero-dep static server for built docs
├── Dockerfile              # Multi-stage docs image
├── CONTRIBUTING.md
├── SECURITY.md
├── CODE_OF_CONDUCT.md
├── SUPPORT.md
└── CHANGELOG.md
```

| Piece | Role |
|-------|------|
| **This repo** | Public docs, examples, OpenAPI tooling, OSS community files |
| **Live HTTP API** | `https://api.heir.es` — production product surface |
| **Product app** | [heir.es](https://heir.es) |

When docs and production disagree, **prefer live OpenAPI + a measured response**, then [file a bug](https://github.com/heirlabs/apis/issues/new/choose).

`npm start` serves the **built documentation site**, not the full monorepo API process.

---

## Authentication

| Model | How credentials are sent | Typical use |
|-------|--------------------------|-------------|
| **API key** | `Authorization: Bearer heir_pk_…` or `X-API-Key` | Headless integrators on `/api/v1/*` |
| **Session JWT** | Browser cookie / product bearer | heir.es SPA (Estate Home, interview, memoir, …) |
| **Public** | None | Health, some catalogs, OpenAPI assets |

Ownership-scoped routes usually need a key **bound to a real user account** — a valid-looking key can still return 401/403.  
Full matrix: **[Authentication matrix](https://docs.heir.es/guide/auth-matrix)**.

---

## Examples

```bash
chmod +x examples/*.sh
./examples/01-health.sh                          # public
./examples/04-list-plans.sh                      # public plan catalog
HEIR_API_KEY=heir_pk_… ./examples/02-list-templates.sh
HEIR_API_KEY=heir_pk_… ./examples/03-generate-contract.sh
```

See [`examples/README.md`](./examples/README.md). Long-form tutorials: [docs.heir.es/examples](https://docs.heir.es/examples/).

---

## OpenAPI & clients

There is **no** official multi-language REST SDK on npm (`heir-js` / `heir-python` / `heir-go` are not published). Use the contract everyone else uses:

```bash
npm run openapi:fetch
npx openapi-typescript openapi/openapi.json -o ./heir-api.d.ts
# or any OpenAPI Generator language target
```

| Package | Purpose |
|---------|---------|
| [OpenAPI JSON](https://api.heir.es/api/docs/openapi.json) | Source of truth for HTTP |
| [`@morbidcorp/element-sdk`](https://www.npmjs.com/package/@morbidcorp/element-sdk) | Desk Element bridge |
| [`@morbidcorp/elements-cli`](https://www.npmjs.com/package/@morbidcorp/elements-cli) | `heir-element` CLI |
| [`@morbidcorp/heir`](https://www.npmjs.com/package/@morbidcorp/heir) | MCP server for agents |

---

## MCP for agents

```json
{
  "mcpServers": {
    "heir": {
      "command": "npx",
      "args": ["-y", "@morbidcorp/heir@2.0.5"],
      "env": {
        "HEIR_API_KEY": "heir_pk_xxxxxxxx"
      }
    }
  }
}
```

- Wrong package: `@heir/mcp` (404 on npm)  
- Prefer the version pin documented at [docs.heir.es/mcp](https://docs.heir.es/mcp/) (bin/`dist/cli.js` matters; check npm `latest` before locking)

---

## Rate limits & plans

**Per-key window** (15 minutes):

| Tier | General | Contract gen | AI chat |
|------|--------:|-------------:|--------:|
| Public | 100 | 10 | 5 |
| Partner | 1,000 | 100 | 50 |
| Internal | 10,000 | 1,000 | 200 |

**Developer plans** (account budgets): free → developer → partner → enterprise.  
List prices: `GET /api/v1/billing/plans` (public) · [pricing docs](https://docs.heir.es/pricing/api-tiers).

---

## Local development

Requires **Node.js 18+** (20 recommended — see `.nvmrc`).

```bash
git clone https://github.com/heirlabs/apis.git
cd apis
npm install

npm run docs:dev       # VitePress HMR
npm test               # docs truth + live probes
npm run docs:build     # static site → docs/.vitepress/dist
npm run docs:serve     # serve build on :3001
npm run openapi:fetch  # snapshot OpenAPI → openapi/openapi.json
```

| Script | Purpose |
|--------|---------|
| `npm run docs:dev` | Local docs with hot reload |
| `npm run docs:build` | Production static build |
| `npm start` / `docs:serve` | Serve built docs (`serve-docs.mjs`) |
| `npm test` | Anti-LARP + live probes |
| `npm run openapi:fetch` | Download live OpenAPI |

CI runs truth + build on every PR: [`.github/workflows/ci.yml`](./.github/workflows/ci.yml).

---

## Documentation map

| Topic | Link |
|-------|------|
| Introduction | [guide/introduction](https://docs.heir.es/guide/introduction) |
| Quickstart | [guide/quickstart](https://docs.heir.es/guide/quickstart) |
| Auth matrix | [guide/auth-matrix](https://docs.heir.es/guide/auth-matrix) |
| Platform spine | [guide/platform-spine](https://docs.heir.es/guide/platform-spine) |
| Webhooks | [guide/webhooks](https://docs.heir.es/guide/webhooks) |
| API reference | [api/](https://docs.heir.es/api/) |
| MCP | [mcp/](https://docs.heir.es/mcp/) |
| Elements | [elements/](https://docs.heir.es/elements/) |
| Pricing | [pricing](https://docs.heir.es/pricing/api-tiers) |
| Security | [security](https://docs.heir.es/security/) |
| Changelog (API/docs product) | [changelog](https://docs.heir.es/changelog) |

---

## Contributing

We optimize for **accuracy**, not hype.

1. Read [CONTRIBUTING.md](./CONTRIBUTING.md)  
2. Use an [issue template](https://github.com/heirlabs/apis/issues/new/choose)  
3. Branch from `main` (direct pushes are blocked)  
4. Run `npm test && npm run docs:build`  
5. Open a PR with the checklist  

Participation follows the [Code of Conduct](./CODE_OF_CONDUCT.md).  
Help / channels: [SUPPORT.md](./SUPPORT.md).

---

## Security

Report vulnerabilities **privately** — see [SECURITY.md](./SECURITY.md).  
Never put real API keys in issues, PRs, or screenshots.

---

## Project links

| | |
|--|--|
| Product | [heir.es](https://heir.es) |
| Docs | [docs.heir.es](https://docs.heir.es) |
| API | [api.heir.es](https://api.heir.es/api/docs) |
| Developer portal | [heir.es/developers](https://heir.es/developers) |
| Status | [status.heir.es](https://status.heir.es) |
| Community | [t.me/heir_es](https://t.me/heir_es) |
| Issues | [github.com/heirlabs/apis/issues](https://github.com/heirlabs/apis/issues) |

---

## License

[MIT](LICENSE) © HEIR Labs

---

<p align="center">
  <sub>
    Built for people who integrate inheritance as infrastructure —
    with docs that fail CI when they start lying.
  </sub>
</p>
