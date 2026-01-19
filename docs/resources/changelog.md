# Changelog

All notable changes to the HEIR API.

## [1.0.0] - 2024-01-15

### Added

- 🎉 Initial public release of HEIR API v1
- **API Key Management**
  - Create, list, update, and revoke API keys
  - Three tiers: Public, Partner, Internal
  - Scope-based permissions
  - IP whitelisting support
- **Contract Generation**
  - EVM (Ethereum, Polygon, Arbitrum, Base, BSC)
  - Solana
  - TON
  - Multiple inheritance templates (Common Law, Civil Law, Islamic Law)
  - Dead man's switch configuration
- **Webhook System**
  - Subscribe to events
  - HMAC signature verification
  - Exponential backoff retries
  - Event types: contract.*, deadman.*, verification.*, payment.*
- **Embeddable Wizard**
  - Iframe embedding for Partner/Internal tiers
  - JavaScript SDK
  - Customizable theming
  - PostMessage communication
- **OpenAPI Documentation**
  - Interactive Swagger UI at `/api/docs`
  - Downloadable OpenAPI 3.0 spec
- **Official SDKs**
  - JavaScript/TypeScript
  - Python
  - Go

### Security

- API key hashing with SHA-256
- Webhook signature verification
- IP whitelisting
- Rate limiting per tier

---

## [Unreleased]

### Planned

- Legal document generation API
- Midnight (Cardano L2) support
- GraphQL API
- Additional SDK languages (Rust, PHP, Ruby)
- Advanced analytics endpoints
- Multi-signature support

---

## Versioning

This API follows [Semantic Versioning](https://semver.org/).

- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes

## API Deprecation Policy

- 6-month notice before removing endpoints
- Deprecation headers on affected requests
- Email notification to API key holders
- Migration guides in documentation

## Reporting Issues

- [GitHub Issues](https://github.com/heirlabs/apis/issues)
- [api@heir.es](mailto:api@heir.es)

