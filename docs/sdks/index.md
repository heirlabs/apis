# SDKs & Libraries

Official SDKs make it easy to integrate the HEIR API into your application.

## Official SDKs

### JavaScript / TypeScript

```bash
npm install @heirlabs/sdk
```

```javascript
import { HeirClient } from '@heirlabs/sdk';

const heir = new HeirClient('heir_pk_xxx...');

const contract = await heir.contracts.generate({
  blockchain: 'evm',
  ownerAddress: '0x...',
  beneficiaries: [
    { name: 'Alice', address: '0xabc...', percentage: 100 }
  ]
});
```

[View on GitHub](https://github.com/heirlabs/heir-js) | [NPM](https://npmjs.com/package/@heirlabs/sdk)

---

### Python

```bash
pip install heir-sdk
```

```python
from heir import HeirClient

heir = HeirClient('heir_pk_xxx...')

contract = heir.contracts.generate(
    blockchain='evm',
    owner_address='0x...',
    beneficiaries=[
        {'name': 'Alice', 'address': '0xabc...', 'percentage': 100}
    ]
)
```

[View on GitHub](https://github.com/heirlabs/heir-python) | [PyPI](https://pypi.org/project/heir-sdk/)

---

### Go

```bash
go get github.com/heirlabs/heir-go
```

```go
package main

import (
    "github.com/heirlabs/heir-go"
)

func main() {
    client := heir.NewClient("heir_pk_xxx...")
    
    contract, err := client.Contracts.Generate(&heir.GenerateParams{
        Blockchain:   "evm",
        OwnerAddress: "0x...",
        Beneficiaries: []heir.Beneficiary{
            {Name: "Alice", Address: "0xabc...", Percentage: 100},
        },
    })
}
```

[View on GitHub](https://github.com/heirlabs/heir-go)

---

## OpenAPI Generator

Generate a client for any language using our OpenAPI specification:

```bash
# Download the spec
curl -o openapi.json https://api.heir.es/api/docs/openapi.json

# Generate a client (example: Ruby)
openapi-generator generate -i openapi.json -g ruby -o ./heir-ruby
```

[OpenAPI Specification](https://api.heir.es/api/docs/openapi.json)

## Community Libraries

::: tip Contributing
Built an SDK? [Let us know](https://github.com/heirlabs/apis/issues) and we'll list it here!
:::

| Language | Library | Author |
|----------|---------|--------|
| Rust | Coming soon | - |
| PHP | Coming soon | - |
| Ruby | Coming soon | - |

## Direct HTTP

You can also use the API directly with any HTTP client:

```bash
curl -X POST https://api.heir.es/api/v1/contracts/generate \
  -H "Authorization: Bearer heir_pk_xxx..." \
  -H "Content-Type: application/json" \
  -d '{"blockchain": "evm", ...}'
```

See [cURL Examples](/sdks/curl) for more.

