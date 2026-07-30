# Changelog

Notable documentation and product surfaces as reflected on docs.heir.es.  
Product code of record for the inheritance spine: `heirlabs/web` **`origin/devv`** unless noted.

## [2026.7] - 2026-07-30

### Platform (devv) — documentation added

Documented the inheritance spine shipped on `origin/devv` (representative PRs #717–#756):

- **Estate Home** — readiness, summary chip, metrics, ops honesty (`/api/estate-home/*`, SPA `/estate-home`)
- **Crypto Estate Health Check** — public schema/evaluate/pdf (`/api/estate-health-check/*`, SPA `/estate-health-check`) — PR #752
- **Heir package** — heir aggregation (`GET /api/estate-home/heir-package`, SPA `/heir-package`)
- **Soft legacy release** — vault + death capsules on death clearance (fail-closed without ops gates)
- **Executor cockpit & offline assets** — `/api/executor/*`, `/api/offline-assets/*`
- **Living Legacy** — interview/dashboard/formalities overview
- **Multi-chain** maturity table + e2e harness note (#734)
- **Ops gates** — `ORACLE_PRIVATE_KEY`, `DEATH_CLEARANCE_ENABLED`, verification scripts

New nav section: **Platform**. New API ref group: **Platform (session)**.

### Documentation honesty fixes

- Removed claims of published official SDKs (`@heirlabs/sdk`, heir-js, heir-python) — packages/repos not published as of 2026-07-30
- Replaced absolute “legacy routes removed July 1, 2026” future-tense framing with accurate dual-surface auth model
- Introduction rewritten for platform + headless split
- Individual quickstart aligned to Health Check → Estate Home spine

### Product context (not all on production main)

As of 2026-07-30, `server/routes/estateHome.js` and related spine routes exist on **`origin/devv`**, not necessarily on `origin/main` / heir.es. Production API health still tracks monorepo `main` commits. Docs date-stamp this split.

## [1.0.0] - 2024-01-15

### Added (historical headless brochure)

- API key management (create, list, update, revoke); tier and scope model
- Contract generation (EVM, Solana, TON) and templates
- Webhook subscriptions and signature verification model
- Embeddable wizard documentation
- OpenAPI / Swagger documentation paths
- Legal frameworks and jurisdiction content corpus

### Security (documented model)

- API key hashing
- Webhook signature verification
- IP whitelisting
- Rate limiting per tier

---

## Versioning

Headless API aims to follow [Semantic Versioning](https://semver.org/) for `/api/v1` breaking changes.

Docs site labels (e.g. `2026.7`) track **documentation releases**, not necessarily npm package versions.

## API deprecation policy

- Breaking removals should carry advance notice and migration notes  
- Prefer additive `/api/v1` changes  
- Platform session routes may evolve faster than headless v1 — pin integrations to documented response fields  

## Reporting issues

- [GitHub Issues](https://github.com/heirlabs/apis/issues)  
- [api@heir.es](mailto:api@heir.es)
