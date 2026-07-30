# Python

::: warning No published package (2026-07-30)
`heir-sdk` is **not** on PyPI. `heirlabs/heir-python` is **not** a public repo. Use `httpx` or `requests`.
:::

## Generate a contract

```python
import os
import httpx

API = "https://api.heir.es/api/v1"
headers = {
    "Authorization": f"Bearer {os.environ['HEIR_API_KEY']}",
    "Content-Type": "application/json",
}

payload = {
    "blockchain": "evm",
    "ownerAddress": "0x...",
    "beneficiaries": [
        {"name": "Alice", "address": "0xabc...", "percentage": 100},
    ],
    "inheritanceTemplate": "common-law",
}

with httpx.Client(timeout=60.0) as client:
    r = client.post(f"{API}/contracts/generate", headers=headers, json=payload)
    r.raise_for_status()
    print(r.json())
```

## Public health check schema

```python
import httpx

r = httpx.get("https://dev.heir.es/api/estate-health-check/schema")
r.raise_for_status()
print(r.json())
```

## See also

- [SDKs overview](/sdks/)  
- [cURL](/sdks/curl)  
- [Contracts API](/api/contracts)
