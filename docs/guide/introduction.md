# Introduction

Welcome to HEIR documentation. HEIR is a self-custody inheritance protocol and product: generate multi-chain estate contracts, measure readiness, deliver soft legacy (docs/messages) on death clearance, and expose headless APIs for integrators.

**Public promise:** Self-custody that can be inherited.

## Two surfaces

| Surface | Who | Where | Auth |
|---------|-----|-------|------|
| **Platform** | Owners, heirs, executors, professionals | Product SPA + session `/api/*` | Session JWT / cookie; some public routes |
| **Headless API** | Integrators & partners | `https://api.heir.es/api/v1/*` | API key and/or session (hybrid) |

Start with the [Inheritance Platform](/platform/) for product behavior on **`origin/devv`** (dev.heir.es as of 2026-07-30). Use the [API Reference](/api/) for endpoint details. Use [Quick Start](/guide/quickstart) for headless contract generation.

## What HEIR does

- **Estate readiness spine** — Estate Home weighted score, gaps, CTAs, and ops honesty (`ops` object) so setup score ≠ live oracle/death clearance  
- **Crypto Estate Health Check** — Public quiz + PDF leave-behind; optional auth merges live readiness  
- **Multi-chain estate contracts** — EVM primary; Solana, TON, TRON, Midnight, Bitcoin (flagged) at varying maturity  
- **Proof-of-life / dead-man coupling** — Multi-method verification feeding inheritance timers  
- **Soft legacy release** — Vault items and death-triggered capsules open on the same death clearance signal as claims  
- **Heir package & executor cockpit** — Heir aggregation + offline asset inventory (no bank rails)  
- **Living Legacy** — Interview, completeness, plan/export (lawyer-ready drafts, not court-executed wills alone)  
- **Headless API** — Contract generate/compile, legal, webhooks, embed wizard under `/api/v1`  

## What HEIR is not

- Not automatic probate or bank transfer  
- Not a guarantee that every chain is equally mainnet-ready  
- Not “quantum-safe coins” marketing (on-chain assets use each chain’s cryptography)  
- Not a published multi-language SDK product yet — use HTTP + OpenAPI until packages ship  

## Who is this for?

- **Individuals** building a crypto + hybrid estate  
- **Heirs and executors** after death clearance  
- **Professionals** (attorneys, CPAs, advisors) via VIP/cert tracks (partial maturity)  
- **Fintech / wallet / custodian integrators** via API keys  
- **Developers** embedding the contract wizard  

## Base URLs

| Environment | Product | API |
|-------------|---------|-----|
| Production | `https://heir.es` | `https://api.heir.es` |
| Dev / staging (devv) | `https://dev.heir.es` | same API host or env-specific — confirm for your deployment |

Headless requests:

```
https://api.heir.es/api/v1/
```

Platform session routes (examples):

```
https://dev.heir.es/api/estate-home/summary
https://dev.heir.es/api/estate-health-check/schema
```

## API versioning

Current headless version prefix: **`v1`**.

Many product routes also exist under unversioned `/api/*` with **session** auth. Prefer documenting both honestly:

| Pattern | Typical auth | Notes |
|---------|--------------|-------|
| `/api/v1/*` | API key hybrid | Integrator surface |
| `/api/estate-home/*`, `/api/executor/*`, … | Session | Platform spine |
| `/api/estate-health-check/*` | Public (+ optional session) | Conversion quiz |

::: info Legacy `/api/*` without API key
Unversioned routes remain part of the product SPA backend. Integrators should use `/api/v1/*` with API keys where hybrid mounts exist. Deprecation is **route-class dependent** — do not assume a single calendar kill date for all unversioned paths.
:::

## Ops honesty

Death clearance and email oracle claims are **env-gated** and fail closed when unset. See [Ops gates](/platform/ops-gates).

## Need help?

- [Platform overview](/platform/) — product spine  
- [API Reference](/api/) — endpoints  
- [Changelog](/changelog) — what changed in 2026-07  
- [api@heir.es](mailto:api@heir.es) — API support  
- [GitHub Issues](https://github.com/heirlabs/apis/issues) — docs issues  

*Not legal or financial advice.*
