# HEIR APIs

**Public documentation and integrator reference for the HEIR HTTP API** — digital inheritance tooling you can call from servers, agents, and products.

[![Docs](https://img.shields.io/badge/docs-docs.heir.es-0f172a?style=flat-square)](https://docs.heir.es)
[![API](https://img.shields.io/badge/API-api.heir.es-2563eb?style=flat-square)](https://api.heir.es/api/docs)
[![OpenAPI](https://img.shields.io/badge/OpenAPI-3.0-85ea2d?style=flat-square)](https://api.heir.es/api/docs/openapi.json)
[![Status](https://img.shields.io/badge/status-status.heir.es-22c55e?style=flat-square)](https://status.heir.es)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue?style=flat-square)](LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D18-339933?style=flat-square&logo=node.js&logoColor=white)](package.json)

<p align="center">
  <a href="https://docs.heir.es"><strong>Documentation</strong></a>
  ·
  <a href="https://docs.heir.es/guide/quickstart"><strong>Quickstart</strong></a>
  ·
  <a href="https://api.heir.es/api/docs"><strong>Interactive API</strong></a>
  ·
  <a href="https://heir.es/developers"><strong>Get an API key</strong></a>
  ·
  <a href="https://t.me/heir_es"><strong>Community</strong></a>
</p>

---

## What this is

| Piece | Role |
|-------|------|
| **This repo** | Source for [docs.heir.es](https://docs.heir.es) (VitePress), guide content, OpenAPI-oriented reference material, and a small headless-API scaffold under `src/` |
| **Live HTTP API** | Hosted at **`https://api.heir.es`** — production product surface used by [heir.es](https://heir.es) and integrators |
| **Product app** | [heir.es](https://heir.es) — vaults, interview, desk, developer portal |

This repository is the **open docs + integrator front door**. The multi-service monorepo that powers production deploys is separate; when docs and behavior disagree, **treat the live OpenAPI + auth matrix as truth** and open an issue here.

---

## 60-second start

1. Create a key at [heir.es/developers](https://heir.es/developers) (prefix `heir_pk_…`).
2. Call the public templates list (or generate a contract):

```bash
export HEIR_API_KEY="heir_pk_xxxxxxxx"

# List contract templates
curl -sS "https://api.heir.es/api/v1/contracts/templates" \
  -H "Authorization: Bearer $HEIR_API_KEY" | jq .

# Generate an inheritance contract (EVM example)
curl -sS -X POST "https://api.heir.es/api/v1/contracts/generate" \
  -H "Authorization: Bearer $HEIR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "blockchain": "evm",
    "ownerAddress": "0x0000000000000000000000000000000000000001",
    "beneficiaries": [
      { "name": "Alice", "address": "0x0000000000000000000000000000000000000002", "percentage": 100 }
    ]
  }' | jq .
```

Interactive explorer: [api.heir.es/api/docs](https://api.heir.es/api/docs)  
Machine-readable spec: [openapi.json](https://api.heir.es/api/docs/openapi.json)

---

## What you can build

- **Contract generation** — inheritance-oriented smart contracts for EVM chains, Solana, and TON, with legal-framework templates and optional dead-man’s-switch configuration  
- **Legal document APIs** — generate/store/encrypt drafts (wills, trusts, POA-class documents) via `/api/v1/legal`  
- **Webhooks** — HMAC-signed events for deploys, verification, and related lifecycle hooks (partner+ tiers)  
- **Jurisdictions & frameworks** — large guide surface for common-law, civil-law, religious, and customary inheritance models  
- **Desk Elements** — package surface for HEIR Desk plugins (`@morbidcorp/element-sdk`, `heir-element` CLI)  
- **MCP for agents** — 18 tools via [`@morbidcorp/heir@2.0.2`](https://www.npmjs.com/package/@morbidcorp/heir) (pin **2.0.2+**; older `bin` paths break under `npx`)

**Not legal advice.** Generated documents and contracts are tools for builders; court validity depends on jurisdiction, formalities, and counsel.

---

## Authentication (three models)

| Model | How | Use when |
|-------|-----|----------|
| **API key** | `Authorization: Bearer heir_pk_…` or `X-API-Key` | Headless integrators on `/api/v1/*` |
| **Session JWT** | Browser cookie / product bearer | heir.es SPA, Estate Home, interview, memoir |
| **Public** | None | Health, some catalogs, OpenAPI assets |

Most ownership-scoped routes need a key **bound to a real user** — a bare key string can still 401/403. Full matrix: [Authentication matrix](https://docs.heir.es/guide/auth-matrix).

---

## Rate limits & plans

**Per-key window** (15 minutes):

| Tier | General | Contract gen | AI chat |
|------|--------:|-------------:|--------:|
| Public | 100 | 10 | 5 |
| Partner | 1,000 | 100 | 50 |
| Internal | 10,000 | 1,000 | 200 |

**Developer plans** (account budgets; list prices from `GET /api/v1/billing/plans`): free → developer ($29/mo) → partner ($199/mo) → enterprise. Details: [API tiers](https://docs.heir.es/pricing/api-tiers).

---

## Client libraries

There is **no** official multi-language REST SDK on npm today. Prefer:

| Tool | Install | Purpose |
|------|---------|---------|
| OpenAPI | [openapi.json](https://api.heir.es/api/docs/openapi.json) | Generate typed clients (`openapi-typescript`, openapi-generator, …) |
| cURL examples | [docs](https://docs.heir.es/sdks/curl) | Copy-paste HTTP |
| MCP | `npx -y @morbidcorp/heir@2.0.2` | AI assistant tools (18) |
| Element SDK | `npm i @morbidcorp/element-sdk` | Desk Element bridge |
| Elements CLI | `npm i -g @morbidcorp/elements-cli` | `heir-element` init/dev/pack |

```bash
# Typed TS types from live OpenAPI
curl -fsSL -o openapi.json https://api.heir.es/api/docs/openapi.json
npx openapi-typescript openapi.json -o ./heir-api.d.ts
```

---

## MCP (agents)

```json
{
  "mcpServers": {
    "heir": {
      "command": "npx",
      "args": ["-y", "@morbidcorp/heir@2.0.2"],
      "env": {
        "HEIR_API_KEY": "heir_pk_xxxxxxxx"
      }
    }
  }
}
```

Guide: [MCP documentation](https://docs.heir.es/mcp/).  
Wrong package name: `@heir/mcp` (404). Prefer pinned **`@morbidcorp/heir@2.0.2`**.

---

## Repository layout

```text
.
├── docs/                 # VitePress site → docs.heir.es
│   ├── guide/            # Quickstart, auth, webhooks, spine honesty
│   ├── api/              # Endpoint reference
│   ├── jurisdictions/    # Country & regional notes
│   ├── legal-frameworks/ # Common / civil / religious models
│   ├── elements/         # Desk Element SDK & CLI
│   ├── mcp/              # Agent tooling
│   └── examples/         # Integration sketches
├── scripts/              # Doc truth checks, OpenAPI helpers
├── src/                  # Headless API scaffold / reference modules
├── serve-docs.mjs        # Zero-dep static server for built docs
├── Dockerfile            # Multi-stage docs image (Railway)
└── vercel.json           # Static docs deploy config
```

`npm start` / production containers serve the **built docs**, not the full production monorepo API.

---

## Local development (docs)

Requires **Node.js 18+**.

```bash
git clone https://github.com/heirlabs/apis.git
cd apis
npm install

# Live docs with HMR
npm run docs:dev

# Production build + local static server
npm run docs:build
npm run docs:serve   # http://localhost:3001

# Fail the build if docs reintroduce known false claims
npm test
```

| Script | Purpose |
|--------|---------|
| `npm run docs:dev` | VitePress dev server |
| `npm run docs:build` | Static site → `docs/.vitepress/dist` |
| `npm run docs:serve` / `npm start` | Serve built site (`serve-docs.mjs`) |
| `npm test` | `scripts/validate-docs-truth.mjs` (anti-LARP guardrails) |

---

## Documentation map

| Topic | Link |
|-------|------|
| Introduction | [guide/introduction](https://docs.heir.es/guide/introduction) |
| Quickstart | [guide/quickstart](https://docs.heir.es/guide/quickstart) |
| Auth matrix | [guide/auth-matrix](https://docs.heir.es/guide/auth-matrix) |
| Platform spine (what is session vs key) | [guide/platform-spine](https://docs.heir.es/guide/platform-spine) |
| Webhooks | [guide/webhooks](https://docs.heir.es/guide/webhooks) |
| API reference | [api/](https://docs.heir.es/api/) |
| Pricing / tiers | [pricing](https://docs.heir.es/pricing/api-tiers) |
| Security | [security](https://docs.heir.es/security/) |
| Changelog | [changelog](https://docs.heir.es/changelog) |

---

## Contributing

We welcome fixes that make the docs **more accurate**, not more marketing.

1. Open an issue for large structural changes.  
2. Branch from `main` (direct pushes are blocked).  
3. Prefer small PRs: one topic, one claim correction, or one example.  
4. Run `npm test` before opening a PR — it blocks known false paths (`@heir/mcp`, wrong memoir bases, “official JS/Python/Go SDKs”, etc.).  
5. Do not invent endpoints, SDKs, audit badges, or token/yield promises.

Security-sensitive reports: prefer private contact via the product support channels rather than a public issue if the report includes secrets or exploit detail.

---

## Project links

| | |
|--|--|
| Product | [heir.es](https://heir.es) |
| Docs | [docs.heir.es](https://docs.heir.es) |
| Developer portal | [heir.es/developers](https://heir.es/developers) |
| API health | [api.heir.es/api/health](https://api.heir.es/api/health) |
| Status | [status.heir.es](https://status.heir.es) |
| Community | [t.me/heir_es](https://t.me/heir_es) |
| Issues | [github.com/heirlabs/apis/issues](https://github.com/heirlabs/apis/issues) |

---

## License

[MIT](LICENSE) © HEIR Labs

---

<p align="center">
  <sub>
    Built for integrators who need inheritance infrastructure as an API —
    not a black box.
  </sub>
</p>
