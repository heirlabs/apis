# Python

::: warning No published Python package
`heir-sdk` is **not** on PyPI. Call the REST API with any HTTP client, or generate a client from the [OpenAPI spec](https://api.heir.es/api/docs/openapi.json).

The only published HEIR packages today are on npm:
[`@morbidcorp/element-sdk`](https://www.npmjs.com/package/@morbidcorp/element-sdk) and
[`@morbidcorp/elements-cli`](https://www.npmjs.com/package/@morbidcorp/elements-cli)
(Desk Elements, not a headless REST SDK).
:::

## HTTP example

```python
import os
import requests

res = requests.post(
    'https://api.heir.es/api/v1/contracts/generate',
    headers={
        'Authorization': f"Bearer {os.environ['HEIR_API_KEY']}",
        'Content-Type': 'application/json',
    },
    json={
        'blockchain': 'evm',
        'ownerAddress': '0x742d35Cc6634C0532925a3b844Bc9e7595f5bA2e',
        'beneficiaries': [
            {'name': 'Alice', 'address': '0xabc...', 'percentage': 100}
        ],
    },
)
res.raise_for_status()
contract = res.json()
print(contract)
```

## Generate a client from OpenAPI

```bash
curl -o openapi.json https://api.heir.es/api/docs/openapi.json
# example with openapi-generator
openapi-generator-cli generate -i openapi.json -g python -o ./heir-client
```

See also: [Authentication](/api/authentication) · [Contracts](/api/contracts) · [cURL](/sdks/curl)
