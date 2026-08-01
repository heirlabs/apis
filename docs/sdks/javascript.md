# JavaScript / TypeScript

## Published: Desk Elements SDK

The only published JavaScript package is the Desk Elements bridge SDK:

| Package | Install | npm |
|---------|---------|-----|
| `@morbidcorp/element-sdk` | `npm i @morbidcorp/element-sdk` | [npmjs.com](https://www.npmjs.com/package/@morbidcorp/element-sdk) |
| `@morbidcorp/elements-cli` | `npm i -g @morbidcorp/elements-cli` | [npmjs.com](https://www.npmjs.com/package/@morbidcorp/elements-cli) |

```bash
npm install @morbidcorp/element-sdk
# companion CLI
npm install -g @morbidcorp/elements-cli
```

```typescript
import { connectElement } from '@morbidcorp/element-sdk';

const api = await connectElement();
const ctx = await api.element.getContext();
// { elementId, installId, version, locale, theme, ... } — no user PII
```

Full reference:

- [Elements overview](/elements/)
- [Getting started](/elements/getting-started)
- [Bridge API](/elements/api)
- [Manifest](/elements/manifest)
- [CLI (`heir-element`)](/elements/cli)

Subpath exports (see package docs):

- `@morbidcorp/element-sdk/manifest` — schema + `validateManifest`
- `@morbidcorp/element-sdk/emulator` — `EmulatorCore` for Node tests
- `@morbidcorp/element-sdk/csp` — production CSP generation
- `@morbidcorp/element-sdk/integrity` — pack signing helpers

---

## Headless REST API (no npm client)

There is **no** `@heirlabs/sdk` (or similar) REST client on npm. Call the API over HTTP, or generate a client from OpenAPI:

```bash
curl -o openapi.json https://api.heir.es/api/docs/openapi.json
npx openapi-typescript openapi.json -o ./heir-api.d.ts
```

```typescript
// Example: raw fetch (no official SDK)
const res = await fetch('https://api.heir.es/api/v1/contracts/generate', {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${process.env.HEIR_API_KEY}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    blockchain: 'evm',
    ownerAddress: '0x...',
    beneficiaries: [{ name: 'Alice', address: '0xabc...', percentage: 100 }],
  }),
});
const contract = await res.json();
```

See [Authentication](/api/authentication), [Contracts](/api/contracts), and [cURL examples](/sdks/curl).

---

## Links

- [@morbidcorp/element-sdk on npm](https://www.npmjs.com/package/@morbidcorp/element-sdk)
- [@morbidcorp/elements-cli on npm](https://www.npmjs.com/package/@morbidcorp/elements-cli)
- [OpenAPI spec](https://api.heir.es/api/docs/openapi.json)
