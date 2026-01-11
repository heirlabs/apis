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

## Legacy Endpoints

::: warning Deprecation Notice
Endpoints without version prefix (`/api/*`) are deprecated and will be removed on **July 1, 2026**.
:::

Legacy requests return deprecation headers:

```http
X-API-Deprecation: true
X-API-Sunset: 2026-07-01T00:00:00Z
```

## Migration Guide

### Before (deprecated)

```bash
curl https://api.heir.es/api/contracts/generate
```

### After (current)

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

