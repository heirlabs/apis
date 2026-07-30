# JavaScript / TypeScript

::: warning No published package (2026-07-30)
`@heirlabs/sdk` is **not** on npm. `heirlabs/heir-js` is **not** a public repo. Use `fetch` (or any HTTP client) against the headless API.
:::

## Generate a contract

```javascript
const API = 'https://api.heir.es/api/v1';
const apiKey = process.env.HEIR_API_KEY;

const res = await fetch(`${API}/contracts/generate`, {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    blockchain: 'evm',
    ownerAddress: '0x...',
    beneficiaries: [
      { name: 'Alice', address: '0xabc...', percentage: 100 },
    ],
    inheritanceTemplate: 'common-law',
  }),
});

if (!res.ok) {
  const err = await res.json().catch(() => ({}));
  throw new Error(err?.error?.message || res.statusText);
}

const data = await res.json();
console.log(data);
```

## List contract templates

```javascript
const res = await fetch('https://api.heir.es/api/v1/contracts/templates', {
  headers: { Authorization: `Bearer ${process.env.HEIR_API_KEY}` },
});
const data = await res.json();
```

## Platform session example (browser)

Estate Home and most spine routes need the product session cookie, not an API key:

```javascript
const res = await fetch('/api/estate-home/summary', {
  credentials: 'include',
});
const summary = await res.json();
// summary.ops.status — ready | degraded | not_ready
```

Public health check (no auth):

```javascript
const schema = await fetch('/api/estate-health-check/schema').then((r) => r.json());
```

## OpenAPI codegen

When your environment serves OpenAPI:

```bash
npx openapi-typescript https://api.heir.es/api/docs/openapi.json -o heir-api.ts
```

Verify the URL returns 200 in your environment first.

## See also

- [SDKs overview](/sdks/)  
- [cURL](/sdks/curl)  
- [Contracts API](/api/contracts)  
- [Platform](/platform/)
