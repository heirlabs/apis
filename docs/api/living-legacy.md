# Living Legacy API (overview)

Session-oriented living legacy and interview mounts on the monorepo.

::: warning Environment
Heavily developed on `heirlabs/web` **`origin/devv`** as of **2026-07-30**. Path inventory evolves; treat route source as truth.
:::

## Primary mounts

| Base path | Role |
|-----------|------|
| `/api/legacy` | Living Legacy dashboard / case file registry |
| `/api/legacy-interview` | Interview flow, pricing, checkout, webhooks |
| `/api/legal/formalities` | Jurisdiction formalities checklists (draft guidance) |

Headless integrators may also use `/api/v1/legal` (hybrid auth) for legal document generation — see [Legal Documents API](/api/legal).

## Completeness

Interview completeness feeds Estate Home's `living_legacy` dimension. Export packages and CAS revision rules are enforced in server services; clients must send revision tokens where the API requires them (refine endpoints return `caseFileRevision` / related fields).

## Honesty

- Planning and soft-estate packages — **not** court-executed wills by themselves.  
- Formalities = lawyer-ready checklists, not automatic multi-state filings.

## See also

- [Platform: Living Legacy](/platform/living-legacy)  
- [Estate Home API](/api/estate-home)
