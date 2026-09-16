# Changelog

All notable changes to the HEIR public API and docs site.

## [Unreleased]

### Documentation (2026-09-16)

- Product paths page (SPA funnel `/login` → `/welcome` → pay; paid home `/interview`; `/legacy` after complete; `/desk` shell; `/developers/*`)
- Unversioned `/api/*` is the product spine, not a 2026-07-01 sunset
- Internal API key prefix documented as `heir_sk_` (not `heir_in_`)
- MCP pin 2.0.5 + default capability-projection usage
- Live product SKUs on pricing overview
- Developer API plans aligned with live `GET /api/v1/billing/plans` (partner $99, not $199)
- Webhook reference payload/create/retry aligned with `webhookDispatcher.js`

### Documentation (2026-08-02)

- Auth matrix + platform spine product map
- OpenAPI honesty page; MCP 2.0.3 bin docs
- Correct MCP package to `@morbidcorp/heir` (18 tools on working `dist/cli.js`); document broken package `bin` → `index.js`; remove `@heir/mcp` and “100+ tools” claims
- Correct Memoir base path to `/api/memoir` (not `/api/heirloom`)
- Document live Legal Documents API (was wrongly labeled “coming soon”)
- Align homepage developer pricing with `/pricing/api-tiers`
- Remove false “official REST SDKs shipped” claims from homepage and historical release notes
- Point docs social X link to `@heirlegacy`

### Already live on product API (documenting reality)

- Legal document generate / store / encrypt / OpenSign-gated sign (`/api/legal`, `/api/v1/legal`)
- Memoir MyHeir session API (`/api/memoir`) and memoir credit packs (`/api/memoir/credits`)
- Heirlooms meter (`/api/heirlooms`) with dark-launch flag `HEIRLOOMS_METERING_ENABLED`
- Midnight estate routes on the monorepo (`/api/midnight`) — product/session oriented; not a separate “coming soon” brochure claim
- Desk Elements npm packages (`@morbidcorp/element-sdk`, `@morbidcorp/elements-cli`)

### Still not shipped as public packages

- Language REST SDKs (`@heirlabs/sdk`, heir-python, heir-go, etc.)
- GraphQL API
- Public Elements marketplace registry

---

## [1.0.0] - 2024-01-15

### Added

- Initial public release of HEIR API v1
- **API key management** — create, list, update, revoke; Public / Partner / Internal tiers; scopes; IP allowlists
- **Contract generation** — EVM (Ethereum, Polygon, Arbitrum, Base, BSC), Solana, TON; inheritance templates; dead man's switch configuration
- **Webhook system** — subscriptions, HMAC signatures, retries; event types including contract.*, deadman.*, verification.*, payment.*
- **Embeddable wizard** — iframe embedding for Partner/Internal tiers; theming; postMessage
- **OpenAPI** — Swagger UI at `/api/docs` and downloadable OpenAPI 3.0 spec

### Security

- API key hashing with SHA-256
- Webhook signature verification
- IP whitelisting
- Rate limiting per tier

### Clarification (added 2026-08-02)

Release notes previously claimed “official SDKs” for JavaScript, Python, and Go.
**Those packages were never published on npm/PyPI.** Clients should use HTTP,
OpenAPI codegen, MCP (`@morbidcorp/heir`), or Desk Element packages only.

---

## Versioning

This API follows [Semantic Versioning](https://semver.org/).

- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes

## API deprecation policy

- Notice before removing endpoints
- Deprecation headers on affected requests when applicable
- Migration notes in documentation

## Reporting issues

- [GitHub Issues](https://github.com/heirlabs/apis/issues)
- [api@heir.es](mailto:api@heir.es)
