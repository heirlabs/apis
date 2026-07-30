# SDKs & Libraries

**As of 2026-07-30:** there is **no published official npm/PyPI/Go module** for HEIR under `@heirlabs/sdk`, `heir-sdk`, or `github.com/heirlabs/heir-js` (packages and those repos return 404). Integrate with **HTTP + OpenAPI**, or generate a client yourself.

## Recommended: direct HTTP

```bash
curl -X POST https://api.heir.es/api/v1/contracts/generate \
  -H "Authorization: Bearer heir_pk_xxx..." \
  -H "Content-Type: application/json" \
  -d '{
    "blockchain": "evm",
    "ownerAddress": "0x...",
    "beneficiaries": [
      { "name": "Alice", "address": "0xabc...", "percentage": 100 }
    ]
  }'
```

More patterns: [cURL examples](/sdks/curl) · [Quick start](/guide/quickstart) · [Generate contract example](/examples/generate-contract).

## OpenAPI client generation

If your deployment exposes OpenAPI:

```bash
# Adjust URL if your environment serves the spec elsewhere
curl -o openapi.json https://api.heir.es/api/docs/openapi.json

openapi-generator generate -i openapi.json -g typescript-fetch -o ./heir-ts
```

Confirm the OpenAPI URL returns 200 in your environment before wiring CI to it.

## Language notes (planned, not published)

| Language | Status |
|----------|--------|
| JavaScript / TypeScript | **Use fetch/HTTP.** No published `@heirlabs/sdk` |
| Python | **Use requests/httpx.** No published `heir-sdk` |
| Go | **Use net/http.** No published `heir-go` module |
| Other | Generate from OpenAPI when available |

Historical sample snippets that imported `@heirlabs/sdk` or `heir-sdk` were aspirational and have been removed from the homepage and this index so they cannot be copy-pasted as working installs.

## Platform session APIs

Estate Home, executor, offline assets, and living legacy are primarily **session** routes. SDKs (when published) should document cookie/JWT session flows separately from API keys. See [Platform](/platform/) and [API overview](/api/).

## Community libraries

::: tip Contributing
Built a maintained client? Open an issue on [heirlabs/apis](https://github.com/heirlabs/apis/issues) with install proof (registry URL + version) and we will list it here.
:::

| Language | Library | Status |
|----------|---------|--------|
| — | — | None listed with registry proof yet |

## See also

- [Authentication](/guide/authentication)  
- [Contracts API](/api/contracts)  
- [Examples](/examples/)
