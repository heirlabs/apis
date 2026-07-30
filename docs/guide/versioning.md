# API Versioning

How the HEIR API handles versioning and deprecation.

## Current Version

The current API version is **v1**. All endpoints are prefixed with `/api/v1/`.

```
https://api.heir.es/api/v1/
```

## Version Header

The response includes the API version:

```http
X-API-Version: v1
```

## Unversioned `/api/*` vs `/api/v1/*`

The production monorepo still mounts **both**:

| Pattern | Typical use |
|---------|-------------|
| `/api/v1/*` | Headless integrators (API key hybrid) |
| `/api/*` (no v1) | Product SPA session routes (Estate Home, executor, …) and some legacy integrator paths |

Some unversioned integrator routes may emit deprecation **headers** encouraging `/api/v1`. That is not a calendar guarantee that all unversioned product routes will disappear.

::: info As of 2026-07-30
Do not hardcode a single “sunset” date for every unversioned path. Integrators should prefer `/api/v1/*` for contracts/legal/webhooks. Platform spine docs use session `/api/estate-home/*` etc. on purpose.
:::

## Migration Guide (integrator contract generate)

### Prefer versioned

```bash
curl https://api.heir.es/api/v1/contracts/generate \
  -H "Authorization: Bearer heir_pk_xxx..." \
  -H "Content-Type: application/json" \
  -d '{"blockchain":"evm",...}'
```

### Legacy unversioned (may send deprecation headers)

```bash
curl https://api.heir.es/api/contracts/generate \
  -H "Authorization: Bearer heir_pk_xxx..."
```

## Breaking Changes Policy

We follow semantic versioning principles:

- **Major version** (v1 → v2): Breaking changes
- **Minor updates**: New features, backward compatible
- **Patches**: Bug fixes

### What's Considered Breaking

- Removing endpoints
- Removing required request fields
- Changing response structure
- Changing authentication methods
- Reducing rate limits significantly

### What's Not Breaking

- Adding new endpoints
- Adding optional request fields
- Adding new response fields
- Increasing rate limits
- Adding new error codes

## Version Lifecycle

| Status | Description | Support |
|--------|-------------|---------|
| **Current** | Latest stable version | Full |
| **Deprecated** | Scheduled for removal | Bug fixes only |
| **Sunset** | Removed | None |

## Notification Policy

Before any breaking change:

1. **6 months notice** via deprecation headers
2. **Email notification** to all API key holders
3. **Documentation updates** with migration guides
4. **Sunset date** in `X-API-Sunset` header

## Staying Updated

Subscribe to API updates:

- [Status Page](https://status.heir.es)
- [Changelog](/changelog)
- [GitHub Releases](https://github.com/heirlabs/apis/releases)
- [Developer Newsletter](https://heir.es/newsletter)

