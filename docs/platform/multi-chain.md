# Multi-chain estates

**Environment:** `origin/devv` (as of 2026-07-30).  
**Auth:** Session for product deploy paths; headless `/api/v1/contracts` (+ chain routers) for API keys where hybrid auth applies.

## Purpose

Generate, deploy, and register inheritance contracts across chains under self-custody. This is the unique product cell versus PDF-will competitors — **coverage is uneven**.

## Chain maturity (engineering judgment)

| Chain / path | Maturity | Notes |
|--------------|----------|-------|
| EVM estates | **B–C** | Primary path |
| Solana | **C** | Separate route module |
| TON | **C** | Separate module |
| TRON | **C** | Deploy path present |
| Midnight | **C–E** | Privacy chain; historical mock-on-failure risk — prefer refuse-mock |
| Bitcoin Taproot vault | **D** | Dark unless `BITCOIN_ENABLED` |
| RWA / STBL | **D** | `STBL_ENABLED` gate |

## Headless API entry

Integrators still use:

```
POST https://api.heir.es/api/v1/contracts/generate
```

See [Contracts API](/api/contracts) and [Contracts guide](/guide/contracts). Product SPA paths (`/estate/new`, builder flows) wrap monorepo contract routes and `DeployedContract` registry.

## Engineering harness

`docs/MULTICHAIN_ESTATE_E2E.md` and PR **#734** add multi-chain e2e harness plus death false-positive/false-negative suite. That is **test depth**, not a claim that every mainnet chain is operator-ready.

## Honesty bounds

- Mainnet ops, RPCs, and relayers are operator concerns — generate ≠ funded deploy.  
- Do not market “every chain equal.”  
- Bitcoin and STBL remain feature-flagged dark by default.

## Related

- [Estate Home](/platform/estate-home) on-chain dimension  
- [Ops gates](/platform/ops-gates)  
- [Headless quick start](/guide/quickstart)
