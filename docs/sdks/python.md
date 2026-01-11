# Python SDK

Official Python SDK for the HEIR API.

## Installation

```bash
pip install heir-sdk
```

## Quick Start

```python
from heir import HeirClient

heir = HeirClient('heir_pk_xxx...')

# Generate a contract
contract = heir.contracts.generate(
    blockchain='evm',
    owner_address='0x742d35Cc6634C0532925a3b844Bc9e7595f5bA2e',
    beneficiaries=[
        {'name': 'Alice', 'address': '0xabc...', 'percentage': 100}
    ]
)

print(contract.contract_code)
```

## Configuration

```python
from heir import HeirClient

heir = HeirClient(
    api_key='heir_pk_xxx...',
    base_url='https://api.heir.es/api/v1',  # Default
    timeout=30,  # seconds
    max_retries=3
)
```

## API Reference

### Contracts

#### Generate Contract

```python
result = heir.contracts.generate(
    blockchain='evm',  # 'evm', 'solana', or 'ton'
    owner_address='0x...',
    beneficiaries=[
        {
            'name': 'Alice',
            'address': '0xabc...',
            'percentage': 50,
            'relationship': 'spouse'
        },
        {
            'name': 'Bob',
            'address': '0xdef...',
            'percentage': 50,
            'relationship': 'child'
        }
    ],
    inheritance_template='common-law',
    dead_mans_switch={
        'enabled': True,
        'interval': 365 * 24 * 60 * 60,  # 1 year in seconds
        'check_in_method': 'manual'
    }
)

# Access results
print(result.contract_code)
print(result.compiled.abi)
print(result.compiled.bytecode)
```

#### List Templates

```python
templates = heir.contracts.templates()

for template in templates:
    print(f"{template.id}: {template.name}")
```

#### Compile Contract

```python
compiled = heir.contracts.compile(
    source_code='// Solidity code...',
    compiler='0.8.19'
)

print(compiled.abi)
print(compiled.bytecode)
```

### API Keys

```python
# List API keys
keys = heir.api_keys.list()

# Create a new key
new_key = heir.api_keys.create(
    name='Production Key',
    tier='partner',
    scopes=['contracts', 'webhooks']
)
print(f"New key: {new_key.raw_key}")  # Save this!

# Revoke a key
heir.api_keys.revoke('key_id')
```

### Webhooks

```python
# List subscriptions
webhooks = heir.webhooks.list()

# Create subscription
webhook = heir.webhooks.create(
    event='contract.deployed',
    url='https://your-app.com/webhooks',
    secret='your_secret'
)

# Test a webhook
result = heir.webhooks.test(webhook.id)
print(f"Delivered: {result.delivered}")

# Delete subscription
heir.webhooks.delete(webhook.id)
```

## Async Support

```python
from heir import AsyncHeirClient
import asyncio

async def main():
    heir = AsyncHeirClient('heir_pk_xxx...')
    
    contract = await heir.contracts.generate(
        blockchain='evm',
        owner_address='0x...',
        beneficiaries=[...]
    )
    
    print(contract.contract_code)

asyncio.run(main())
```

## Error Handling

```python
from heir import HeirError, RateLimitError, ValidationError

try:
    result = heir.contracts.generate(...)
except RateLimitError as e:
    print(f"Rate limited. Retry after {e.retry_after}s")
except ValidationError as e:
    print(f"Validation errors: {e.details}")
except HeirError as e:
    print(f"API error: {e.code} - {e.message}")
```

## Webhook Verification

```python
from heir import verify_webhook_signature
from flask import Flask, request

app = Flask(__name__)

@app.route('/webhooks/heir', methods=['POST'])
def webhook_handler():
    signature = request.headers.get('X-Webhook-Signature')
    payload = request.get_data(as_text=True)
    
    if not verify_webhook_signature(payload, signature, WEBHOOK_SECRET):
        return 'Invalid signature', 401
    
    data = request.json
    event = data['event']
    
    # Process webhook...
    
    return 'OK', 200
```

## Type Hints

The SDK includes full type hints for IDE support:

```python
from heir.types import GenerateContractParams, Beneficiary

params: GenerateContractParams = {
    'blockchain': 'evm',
    'owner_address': '0x...',
    'beneficiaries': [
        Beneficiary(name='Alice', address='0xabc...', percentage=100)
    ]
}
```

## Links

- [PyPI Package](https://pypi.org/project/heir-sdk/)
- [GitHub Repository](https://github.com/heirlabs/heir-python)
- [API Documentation](https://heirlabs.github.io/heir-python)

