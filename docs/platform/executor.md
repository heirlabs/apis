# Executor cockpit & offline assets

**Environment:** `origin/devv` → dev.heir.es (as of 2026-07-30).  
**Auth:** Session required.  
**SPA:** `/executor`, `/executor/:caseId`, `/offline-assets`  
**API:** `/api/executor/*`, `/api/offline-assets/*`

## Executor cockpit

After-death administrative workspace: checklist, institutions, death-certificate handling, links to soft legacy and on-chain claims.

### Endpoints (verified mounts)

| Method | Path | Purpose |
|--------|------|---------|
| `GET` | `/api/executor/cases` | List cases |
| `POST` | `/api/executor/cases` | Create case |
| `GET` | `/api/executor/cases/:id` | Case detail |
| `GET` | `/api/executor/cases/:id/workspace` | Offline assets + contracts for deceased user |
| `PATCH` | `/api/executor/cases/:id` | Update case / checklist fields |
| `POST` | `/api/executor/cases/:id/institutions` | Add institution contact |
| `PATCH` | `/api/executor/cases/:id/institutions/:instId` | Update institution |
| `GET` | `/api/executor/cases/:id/death-certificate` | Certificate access path |
| `DELETE` | `/api/executor/cases/:id` | Delete case |

Checklist themes (product): death cert, institutions, inventory, heirs, soft legacy, on-chain claims.

## Offline assets

Inventory for banks, property, insurance, and similar **non-on-chain** holdings. POD/TOD designation notes only — **no transfer rails**.

| Method | Path | Purpose |
|--------|------|---------|
| `GET` | `/api/offline-assets` | List inventory |
| `GET` | `/api/offline-assets/summary` | Summary counts |
| `POST` | `/api/offline-assets` | Create item |
| `PATCH` | `/api/offline-assets/:id` | Update item |
| `DELETE` | `/api/offline-assets/:id` | Delete item |

## Claim mobile UX

`/claim` and beneficiary surfaces emphasize WalletConnect / no MetaMask-extension requirement and soft-legacy panels when release is in force.

## Honesty bounds

- Executor tools organize work; they do not replace courts or banks.  
- Institution notification completeness is partial.  
- Offline inventory is user-asserted data unless otherwise integrated.

## Source (devv)

- `server/routes/executor.js`, `server/routes/offlineAssets.js`  
- Runbook: `docs/INHERITANCE_OPS_AND_EXECUTOR.md`  
- PRs: #719–#721
