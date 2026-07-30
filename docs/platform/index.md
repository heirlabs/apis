# Inheritance platform

**As of 2026-07-30** this section documents the inheritance product surfaces shipped on `heirlabs/web` branch **`origin/devv`** (deploy intent: **dev.heir.es**). Production (`heir.es` / `api.heir.es` on `origin/main`) may lag until these routes are promoted.

> **Public promise:** Self-custody that can be inherited.

This is not a legal document service and not automatic probate. Soft vaults and messages open on the same **death clearance** signal as the inheritance claim path. On-chain assets remain governed by each chain's contracts and cryptography.

## Two surfaces

| Surface | Audience | Base | Auth |
|---------|----------|------|------|
| **Platform (this section)** | Owners, heirs, executors, pros using the product | `https://dev.heir.es` SPA + `/api/*` session routes | Session cookie / JWT; some public endpoints |
| **Headless API** | Integrators | `https://api.heir.es/api/v1/*` | API key and/or session (hybrid) |

Document session platform APIs here so integrators and operators share one map. Do not assume every platform route is available under `/api/v1/` with an API key unless listed under [API Reference](/api/).

## Spine journey (recommended narrative)

```
Health Check (public) → Estate Home (owner readiness)
  → Deploy multi-chain estate + Proof-of-life
  → Soft vault + offline inventory + living legacy
  → Death clearance → Soft legacy release + claim
  → Heir package / Executor / If someone died
```

| Step | SPA | Primary API |
|------|-----|-------------|
| Pre-auth conversion | `/estate-health-check` | [`/api/estate-health-check`](/api/estate-health-check) |
| Owner readiness | `/estate-home` | [`/api/estate-home`](/api/estate-home) |
| Heir view | `/heir-package` | `GET /api/estate-home/heir-package` |
| Soft docs/messages | Vault + capsules | [Soft legacy](/platform/soft-legacy) |
| After death admin | `/executor` | [`/api/executor`](/api/executor) |
| Traditional assets list | `/offline-assets` | [`/api/offline-assets`](/api/offline-assets) |
| Living legacy interview | `/legacy`, `/interview` | [Living legacy](/platform/living-legacy) |
| Bereavement entry | `/if-someone-died` | Content + deep links |

## Maturity (engineering judgment, not an audit)

| Area | Level | Meaning |
|------|-------|---------|
| Estate Home + readiness math | **B** | Real Mongo scoring; ops honesty payload |
| Crypto Estate Health Check + PDF | **A–B** | Public quiz; pure PDF generation |
| Heir package | **B** | Aggregates contracts + soft release view |
| Soft legacy death release | **B–C** | Real code; **fail-closed** without ops gates |
| Executor + offline assets | **B** | Inventory and checklist — no bank rails |
| Living Legacy interview | **A–B** | Completeness + export heavily invested |
| Multi-chain deploy | **C–B** | Coverage uneven; Bitcoin dark by default |
| VIP / certification | **C** | Real modules; not a finished advisor OS |
| Grow / trading / social | **D–E** | Not part of the inheritance spine; do not lead GTM |

Levels: **A** production-shaped · **B** dev-complete · **C** partial · **D** dark/gated · **E** residual LARP risk · **R** research.

## Ops honesty (anti-LARP)

Setup completeness is **not** the same as live death clearance or oracle claims.

Every Estate Home readiness/summary/heir-package response includes an `ops` object:

- `status`: `ready` | `degraded` | `not_ready`
- `deathClearanceEnabled`, `oracleConfigured`
- `issues[]`, `publicNote` when status ≠ `ready`

Operator-required for full spine behavior:

| Env var | Effect if missing / false |
|---------|---------------------------|
| `ORACLE_PRIVATE_KEY` | Email claim paths **fail closed** (503) |
| `DEATH_CLEARANCE_ENABLED=true` | Non-VIP soft vault release stays sealed |
| Chain RPC / relayer config | Deploy/claim stuck |
| Stripe secrets | Monetization paths dead |

See [Ops gates](/platform/ops-gates) and in-repo `docs/INHERITANCE_OPS_AND_EXECUTOR.md` on `origin/devv`.

## What we deliberately do **not** lead with

- Growth / staking / trading APY narratives  
- Social community as core product  
- Government filings as fully automated when provider keys are unset (mock risk)  
- Quantum-safe **asset** claims (inheritance crypto layer is research-grade; marketing is audit-gated)  
- Token migration as the consumer story  

## Next

- [Estate Home](/platform/estate-home)  
- [Crypto Estate Health Check](/platform/health-check)  
- [Heir package](/platform/heir-package)  
- [Soft legacy](/platform/soft-legacy)  
- [Executor & offline assets](/platform/executor)  
- [Living legacy](/platform/living-legacy)  
- [Multi-chain estates](/platform/multi-chain)  
- [Ops gates](/platform/ops-gates)  
- [Headless API quick start](/guide/quickstart)  

*Not legal or financial advice. Maturity grades are engineering judgments from code and recent PRs on `origin/devv`.*
