# Crypto Estate Health Check

**Environment:** `origin/devv` → dev.heir.es (as of 2026-07-30).  
**Auth:** **Public** by design; optional session merges live Estate Home readiness.  
**SPA:** `/estate-health-check`  
**API:** `/api/estate-health-check/*`

## Purpose

Multi-step quiz mapped to the same weight model as Estate Home. Pre-auth conversion wedge and meeting leave-behind PDF. **No legal-document pretence** — this is a configuration / readiness quiz, not a will.

## Endpoints

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| `GET` | `/api/estate-health-check/schema` | Public | Questionnaire + weight table for SPA |
| `POST` | `/api/estate-health-check/evaluate` | Public + optional session | Score answers; merge live readiness if signed in |
| `POST` | `/api/estate-health-check/pdf` | Public + optional session | Returns `application/pdf` (`%PDF` bytes via pdf-lib) |

### Evaluate

```bash
curl -sS -X POST 'https://dev.heir.es/api/estate-health-check/evaluate' \
  -H 'Content-Type: application/json' \
  -d '{"answers":{"has_deployed_estate":"yes","has_proof_of_life":"no"}}'
```

Invalid answers → `400` with `error` and optional `details`.  
Quiz answers are **not persisted** as an estate plan (by design).

### PDF

```bash
curl -sS -X POST 'https://dev.heir.es/api/estate-health-check/pdf' \
  -H 'Content-Type: application/json' \
  -d '{"answers":{...}}' \
  -o heir-estate-health-check.pdf
```

Body may be a prior evaluate result **or** `{ "answers": { ... } }`.  
Filename disposition: `heir-estate-health-check.pdf`.

## Optional session

If a valid `heir_auth` session is present, evaluate/pdf may merge live readiness from Estate Home. Missing or invalid tokens **do not** 401 — the check stays public.

## Honesty bounds

- Not a court document, not insurance, not a promise of inheritance success.  
- Authenticated merge improves accuracy for signed-in owners; anonymous results are quiz-only.  
- Does not flip production oracle or death-clearance gates.

## Source (devv)

- Routes: `server/routes/estateHealthCheck.js`  
- Service: `server/services/estateHealthCheckService.js`  
- PR: #752
