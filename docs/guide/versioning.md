# API Versioning

How the HEIR API handles versioning and deprecation.

## Current Version

The current partner API version is **v1**. Partner/integrator endpoints are prefixed with `/api/v1/`.

```
https://api.heir.es/api/v1/
```

Unversioned `/api/*` product mounts (estate home, interview, memoir, desk) are **current**. They are not a deprecated alias of v1. See [Product paths](/guide/product-paths) and [Platform spine](/guide/platform-spine).

## Version Header

The response includes the API version:

```http
X-API-Version: v1
```

## Unversioned `/api/*` vs `/api/v1/*`

| Family | Who | Status |
|--------|-----|--------|
| `/api/v1/*` | Partner/integrator HTTP (API key) | Current partner API |
| `/api/*` (non-v1) | Product SPA mounts (session) | Current product spine |

Do not migrate estate-home, interview, memoir, or desk off `/api/*`. Those mounts are not a sunset of v1.

## Migration Guide (partner generate only)

If you called `/api/contracts/generate` for the **partner** generate route, use `/api/v1/contracts/generate`.

### Partner generate — previous

```bash
curl https://api.heir.es/api/contracts/generate
```

### Partner generate — current

```bash
curl https://api.heir.es/api/v1/contracts/generate
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

