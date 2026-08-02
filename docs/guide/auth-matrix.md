# Authentication matrix

HEIR exposes **three** auth models. Using the wrong one is the most common
integration failure.

## Models

| Model | How credentials are sent | Typical surfaces |
|-------|--------------------------|------------------|
| **Session JWT** | Cookie `heir_auth` (browser) or `Authorization: Bearer <session JWT>` | Product SPA: Estate Home, Legacy Interview, Memoir, Desk, Data Passport, Executor |
| **API key (hybrid)** | `Authorization: Bearer heir_pk_…` or `X-API-Key: heir_pk_…` | `/api/v1/*` partner mounts (contracts, legal, jurisdictions, user, billing, …) |
| **Public** | None | Health, some catalogs (`/api/heirlooms/catalog`), estate health-check quiz, openAPI assets |

API keys are created at [heir.es/developers](https://heir.es/developers).

Hybrid auth resolves a **user** for ownership-scoped routes (legal documents,
estates). A bare key without an associated account still fails those handlers
with 401/403 even if the key string is valid.

## Path prefixes

| Prefix | Auth default | Notes |
|--------|--------------|-------|
| `/api/v1/*` | Hybrid API key (scopes) | Partner/integrator surface |
| `/api/*` (non-v1) | Session JWT for product | Many routes; some public |
| `/mcp` (product helpers) | API key on data routes | Not a full MCP stdio server |
| npm `@morbidcorp/heir` | Key via env for tool calls | stdio MCP client → HTTP API |

## Scopes (API keys)

Common scopes used by hybrid mounts:

| Scope | Used for |
|-------|----------|
| `contracts` / `contracts:read` | Contract generate/compile/estimate |
| `legal` / `legal:read` | Legal documents |
| `vaults` / `vaults:read` | User/vault aliases |
| `users` / `users:read` | User profile / estates metadata |
| `chat` | Chat |
| `advisors` / `vip` | Professional surfaces |
| `all` | Internal-tier broad access |

Exact enforcement is middleware on each mount in the monorepo `server/server.js`.

## Rate limits vs plans

Two layers:

1. **Key tier window** (Public / Partner / Internal) — short 15-minute windows  
2. **Developer subscription plan** — daily/monthly request budgets  

See [API tiers](/pricing/api-tiers).

## CSRF

Browser session **state-changing** requests from heir.es origins require the app
CSRF token flow. Server-to-server API key calls do not use browser CSRF.

## Death-critical paths

Billing and Heirloom metering must not block oracle claim, proof-of-life check-in,
or vault unlock. See [Billing](/pricing/).

## Quick decision tree

1. Building a **website/app for end users** logged into heir.es → session JWT product APIs.  
2. Building a **headless integrator** → `/api/v1` + API key + required scopes.  
3. Building an **AI coding assistant plugin** → `@morbidcorp/heir` MCP + API key.  
4. Only need **public catalog/health** → no auth.

## Related

- [Authentication guide](/guide/authentication)
- [API keys](/guide/api-keys)
- [MCP authentication](/mcp/authentication)
- [Platform spine](/guide/platform-spine)
