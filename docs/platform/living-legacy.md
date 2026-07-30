# Living Legacy

**Environment:** `origin/devv` → dev.heir.es (as of 2026-07-30).  
**Auth:** Session for owner dashboard and interview; public verify/share paths where mounted.  
**SPA:** `/legacy`, `/interview`, related plan verify / share routes  
**API (primary mounts):** `/api/legacy/*`, `/api/legacy-interview/*`, `/api/legal/formalities`

## Purpose

Guided interview (Arthur), case file, completeness scoring, plan issue/PDF, invites, refinement, and export package. Structured soft estate and roles (executor, healthcare proxy) with real completeness math — not a proxy checkbox.

Estate Home's `living_legacy` dimension uses this completeness score (threshold via `LIVING_LEGACY_MET_PERCENT`).

## Surfaces

| Area | Notes |
|------|-------|
| Living Legacy dashboard | Case file registry (`/api/legacy`) |
| Interview + commerce | `/api/legacy-interview` (checkout, pricing, webhook) |
| Plan verify | Dedicated verify routes (public scan-friendly paths exist for strangers/hospitals in design) |
| Legal formalities | `GET` style formalities under `/api/legal/formalities` — **lawyer-ready draft guidance** |
| Export package | Full export after completeness (CAS / revision discipline in recent PRs) |

## Recent engineering themes (devv)

- Case file CAS and export package  
- Completeness quality tests in CI  
- Refine/revision CAS wiring  
- Formalities rules + encrypt save for legal docs  
- Living-legacy health monitor  

Exact path inventory evolves; treat monorepo route files as source of truth and rebaseline after large merges.

## Honesty bounds

- Output is a living legacy / planning package — **not** a court-executed will by itself.  
- Jurisdiction formalities are checklists, not 50-state legal mills.  
- Midnight or other anchor features that refuse mocks are intentional anti-LARP.

## Related

- [Estate Home](/platform/estate-home) readiness weight  
- [Soft legacy](/platform/soft-legacy) for post-death delivery of vault items  
- [Executor](/platform/executor) for after-death checklist  

## Source (devv)

- Routes: `legacyDashboard.js`, `legacy-interview.js`, will formalities mounts  
- Docs: `docs/INTERVIEW_LEGACY_COMPLETENESS_AUDIT_2026-07-29.md`, `docs/legacy-interview/*`  
- PR range: #715–#735, #738, #745, #749 (representative)
