# Ops gates & inheritance honesty

**Date stamped:** 2026-07-30  
**Applies to:** platform spine on `origin/devv` and any environment running the same code.

## Why this page exists

So nobody mistakes **setup completeness** for **live death operations**. Returning “ready to inherit” without oracle keys or death clearance is the failure mode this product is designed to avoid.

## Operator verification (read-only)

Monorepo scripts (not part of this docs site):

```bash
# Local / CI — env only
cd server && node scripts/verify-inheritance-ops.mjs

# Against a Railway production env (operator only; read-only counts)
# Use sanctioned railway run patterns from ops runbooks — never railway up
```

Exit codes (script convention): `0` ready · `1` degraded · `2` not ready / error.

Also exposed under product health:

- `GET /api/health` — coarse process health  
- `GET /api/health/detailed` → `checks.inheritance` when present (oracle, death clearance, soft-legacy counts, schedulers)

## Gate table

| Env / switch | Role if on | Failure mode if off |
|--------------|------------|---------------------|
| `ORACLE_PRIVATE_KEY` | Email `claimByEmail` signatures | Fail closed **503** |
| `DEATH_CLEARANCE_ENABLED=true` | Non-VIP DeathClearance + soft vault release | Soft release sealed |
| `ENABLE_TIMECAPSULE_SCHEDULER` | Capsule sweeps (default on) | Capsules stall |
| `ENABLE_DEATH_CLEARANCE_SWEEP` | Clearance sweep (default on when clearance enabled) | Timers not mirrored |
| `HEIR_PORTAL_URL` | Links in heir emails | Wrong/default host in mail |
| Chain RPC / relayer | Deploy & claim | Stuck transactions |
| Stripe secrets | Credits / packs | Checkout fails |
| `BITCOIN_ENABLED` / `STBL_ENABLED` / `TRADING_ENABLED` | Optional surfaces | Stay dark (intentional) |

**Docs and PRs do not flip production secrets.** Operators enable after challenge-window policy is accepted.

## Product surface: `ops` object

Estate Home readiness, summary, and heir-package responses include:

```json
{
  "ops": {
    "status": "ready | degraded | not_ready",
    "deathClearanceEnabled": false,
    "oracleConfigured": false,
    "issues": ["…"],
    "publicNote": "…"
  }
}
```

UI must show degradation. A 100% setup score with `ops.status = not_ready` is still **not** a live claim environment.

## What is fully real when gates are green

- Soft legacy release plumbing and idempotent release records  
- Heir package aggregation  
- Executor checklist and offline inventory  
- Health check PDF generation  
- Multi-method proof-of-life (product modules)

## What remains operator / research

- False-positive / false-negative death protocol at policy level  
- Per-chain mainnet ops quality  
- Full professional network SLAs  

## Source

- `docs/INHERITANCE_OPS_AND_EXECUTOR.md`  
- `docs/ESTATE_HOME_SPINE.md`  
- `docs/SOFT_LEGACY_RELEASE.md`  
- `server/scripts/verify-inheritance-ops.mjs`  
- PRs #717, #728, and follow-ons
