# SDKs & Libraries

## Published packages

These are the only HEIR packages currently on npm:

| Package | Install | npm | Docs |
|---------|---------|-----|------|
| [`@morbidcorp/element-sdk`](https://www.npmjs.com/package/@morbidcorp/element-sdk) | `npm i @morbidcorp/element-sdk` | [npm](https://www.npmjs.com/package/@morbidcorp/element-sdk) | [Elements overview](/elements/) · [Bridge API](/elements/api) · [Manifest](/elements/manifest) |
| [`@morbidcorp/elements-cli`](https://www.npmjs.com/package/@morbidcorp/elements-cli) | `npm i -g @morbidcorp/elements-cli` | [npm](https://www.npmjs.com/package/@morbidcorp/elements-cli) | [CLI](/elements/cli) · [Getting started](/elements/getting-started) |

```bash
# Element bridge + manifest tooling
npm i @morbidcorp/element-sdk

# heir-element CLI (init, dev, validate, pack, publish)
npm i -g @morbidcorp/elements-cli
heir-element --version
```

Local emulator (`heir-element dev`) and pack/sign work today. The **production registry is not open** for third-party marketplace installs.

::: warning No headless REST SDK on npm
There is **no** `@heirlabs/sdk`, `heir-sdk`, or language-specific REST client published today. Use the [OpenAPI spec](https://api.heir.es/api/docs/openapi.json) or [cURL examples](/sdks/curl) against the HTTP API.
:::

---

## OpenAPI client generation

Generate a typed client for any language from the OpenAPI specification:

```bash
curl -o openapi.json https://api.heir.es/api/docs/openapi.json

# Example: TypeScript (openapi-typescript + fetch)
npx openapi-typescript openapi.json -o ./heir-api.d.ts

# Example: any generator language
openapi-generator-cli generate -i openapi.json -g typescript-fetch -o ./heir-client
```

[OpenAPI Specification](https://api.heir.es/api/docs/openapi.json)

---

## Direct HTTP

```bash
curl -X POST https://api.heir.es/api/v1/contracts/generate \
  -H "Authorization: Bearer heir_pk_xxx..." \
  -H "Content-Type: application/json" \
  -d '{"blockchain": "evm", ...}'
```

See [cURL Examples](/sdks/curl) for more.

---

## Community libraries

::: tip Contributing
Built a client? [Open an issue](https://github.com/heirlabs/apis/issues) and we can list it here once it is published and maintained.
:::
