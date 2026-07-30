# Heir package

**Environment:** `origin/devv` → dev.heir.es (as of 2026-07-30).  
**Auth:** Session required (heir or entitled identity as implemented by route).  
**SPA:** `/heir-package`  
**API:** `GET /api/estate-home/heir-package`

## Purpose

Heir-facing single surface: estates that name you, soft vault items when death gate allows, time capsules (content only after delivery rules). Completes the spine for the person who inherits — not only the owner.

## Endpoint

| Method | Path | Purpose |
|--------|------|---------|
| `GET` | `/api/estate-home/heir-package` | Contracts + soft legacy slice + next steps + `ops` |

Response includes the same **ops honesty** object as Estate Home so heirs are not told soft docs are live when clearance/oracle are off.

## Related heir paths

| Path | Role |
|------|------|
| `/claim` | Email / wallet claim portal (oracle-gated when configured) |
| `/if-someone-died` | Public bereavement checklist + deep links |
| Soft vault heir items | Death-gated vault reads (see [Soft legacy](/platform/soft-legacy)) |
| Time capsule inbox/open | Memoir capsule routes after delivery |

## Honesty bounds

- Soft vault inclusion is **death-gated**. No clearance in force → docs stay sealed.  
- On-chain claim still requires the relevant chain contract + wallet/oracle path.  
- Package is an aggregation UX, not a court filing.

## Source (devv)

- Routes: `server/routes/estateHome.js` (`/heir-package`)  
- Runbook: `docs/ESTATE_HOME_SPINE.md`  
- PR: #726
