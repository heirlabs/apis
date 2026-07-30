# Soft legacy release

**Environment:** `origin/devv` (as of 2026-07-30).  
**Auth:** Owner session for setup; heir reads after death gate.  
**Runbook in monorepo:** `docs/SOFT_LEGACY_RELEASE.md`

## What this is

When an estate owner's **death is cleared** by the platform, soft legacy unlocks:

1. **Vault items** assigned to an heir email become readable via heir vault endpoints (existing death gate).  
2. **Time capsules** with `deliveryTrigger: 'death'` are delivered (email + mark delivered).  
3. **Heirs are emailed once** that documents/messages are ready.

This is **not** probate and **not** automatic bank transfer. It is the same death signal used for vault release: VIP verifier assignment **or** non-VIP `DeathClearance` (inactivity timer mirror / operator attestation) with challenge window elapsed.

## Configuration

| Env | Effect |
|-----|--------|
| `DEATH_CLEARANCE_ENABLED=true` | Non-VIP `DeathClearance` path readable by gates |
| `ENABLE_TIMECAPSULE_SCHEDULER` | Default on; set `false` to disable sweeps |
| `ENABLE_DEATH_CLEARANCE_SWEEP` | Default on when death clearance enabled |
| `HEIR_PORTAL_URL` | Base URL in heir soft-legacy emails (default product host) |

## Schedulers

- Time-capsule scheduler: date, death, missed check-in, then soft-legacy releases  
- Death-clearance sweep: mirror on-chain timers, then soft-legacy pass  

## Idempotency

`SoftLegacyRelease` is unique on estate owner user id. Concurrent sweeps must not double-notify.

## Related

| Topic | Doc |
|-------|-----|
| Ops verification | [Ops gates](/platform/ops-gates) |
| Heir aggregation | [Heir package](/platform/heir-package) |
| Formalities | Lawyer-ready checklists only — never “court-valid will” claims |

## Honesty bounds

- Fail-closed when death clearance is off for non-VIP paths.  
- Capsules still need recipient email for email delivery.  
- Formalities APIs are draft guidance for counsel, not executed legal instruments.

## Source (devv)

- Services + schedulers under monorepo `server/`  
- Doc: `docs/SOFT_LEGACY_RELEASE.md`  
- Stack builds on soft-legacy work (#717+) and ops honesty (#728)
