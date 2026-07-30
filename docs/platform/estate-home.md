# Estate Home

**Environment:** `origin/devv` → dev.heir.es (as of 2026-07-30).  
**Auth:** Session required.  
**SPA:** `/estate-home`  
**API:** `/api/estate-home/*`

## Purpose

Single owner view: weighted readiness across on-chain estate, proof-of-life, soft vault, offline inventory, platforms, legal drafts, living legacy, and funeral. Surfaces priority gaps with CTAs and an **ops honesty** banner so a high setup score cannot be mistaken for live death clearance or oracle.

## Endpoints

| Method | Path | Purpose |
|--------|------|---------|
| `GET` | `/api/estate-home/readiness` | Full weighted score, gaps, CTA routes, `ops` |
| `GET` | `/api/estate-home/summary` | Percent + top 3 gaps + `ops` (dashboard chip) |
| `GET` | `/api/estate-home/heir-package` | Heir-facing package (see [Heir package](/platform/heir-package)) |
| `GET` | `/api/estate-home/metrics` | Process-local spine view counters (last hour) |

### Example (session)

```bash
curl -sS 'https://dev.heir.es/api/estate-home/summary' \
  -H 'Cookie: heir_auth=<session-jwt>'
```

Typical success shape (fields abbreviated):

```json
{
  "success": true,
  "percent": 72,
  "gaps": [],
  "publicPromise": "Self-custody that can be inherited.",
  "ops": {
    "status": "degraded",
    "deathClearanceEnabled": false,
    "oracleConfigured": false,
    "issues": ["Death clearance is not enabled in this environment."],
    "publicNote": "Setup score measures configuration, not live claim operations."
  }
}
```

## Scoring

Dimensions live in monorepo `server/config/estateReadinessConfig.js`.

- Items marked `not_applicable` (e.g. empty optional funeral, empty vault) do **not** reduce the score.  
- `living_legacy` uses real completeness scoring (threshold `LIVING_LEGACY_MET_PERCENT`), not a proxy flag.

## Related UI

| Surface | Role |
|---------|------|
| Dashboard readiness chip | Calls `/summary` |
| Navigation drawer | Links to Estate Home + Heir Package |
| Funnel / inbox (gap P1) | `/api/analytics/funnel`, `/api/notifications/inbox` when present |

## Tests / demos (operators, monorepo)

```bash
cd server && npm test -- --testPathPatterns=estate-home --forceExit
cd server && node scripts/demo-estate-home-spine.mjs
```

## Honesty bounds

- Readiness is **setup completeness**, not a legal opinion and not a guarantee of claim success.  
- When `ops.status !== ready`, product UI must surface `publicNote` / issues.  
- Full soft-release and email-claim behavior still depends on [ops gates](/platform/ops-gates).

## Source (devv)

- Routes: `server/routes/estateHome.js`  
- Runbook: `docs/ESTATE_HOME_SPINE.md`  
- PRs: #726–#728, related spine work through #752
