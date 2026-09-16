# Quick Start

Get up and running with the HEIR API in under 5 minutes.

## Step 1: Get an API Key

1. Sign in at [heir.es/login](https://heir.es/login) → `/welcome`
2. Open the Developer Portal [heir.es/developers](https://heir.es/developers) → [heir.es/developers/keys](https://heir.es/developers/keys)
3. Click **Create API Key**
4. Copy your key (it won't be shown again!)

```
heir_pk_aBcDeFgHiJkLmNoPqRsTuVwXyZ...
```

::: tip API Key Prefixes
- `heir_pk_` - Public tier
- `heir_pt_` - Partner tier  
- `heir_sk_` - Internal tier
:::

## Step 2: Make Your First Request

Test your API key by fetching available contract templates:

::: code-group

```bash [cURL]
curl https://api.heir.es/api/v1/contracts/templates \
  -H "Authorization: Bearer heir_pk_xxx..."
```

```javascript [JavaScript]
const response = await fetch('https://api.heir.es/api/v1/contracts/templates', {
  headers: {
    'Authorization': 'Bearer heir_pk_xxx...'
  }
});
const { templates } = await response.json();
console.log(templates);
```

```python [Python]
import requests

response = requests.get(
    'https://api.heir.es/api/v1/contracts/templates',
    headers={'Authorization': 'Bearer heir_pk_xxx...'}
)
templates = response.json()['templates']
print(templates)
```

:::

**Response:**

```json
{
  "templates": [
    { "type": "common-law", "name": "Common Law", "description": "Freedom of testation" },
    { "type": "civil-law", "name": "Civil Law", "description": "Forced heirship rules" },
    { "type": "islamic-mirth", "name": "Islamic Inheritance", "description": "Quranic distribution" },
    // ...
  ]
}
```

## Step 3: Generate a Contract

Now let's generate an actual inheritance smart contract:

::: code-group

```bash [cURL]
curl -X POST https://api.heir.es/api/v1/contracts/generate \
  -H "Authorization: Bearer heir_pk_xxx..." \
  -H "Content-Type: application/json" \
  -d '{
    "blockchain": "evm",
    "ownerAddress": "0x742d35Cc6634C0532925a3b844Bc9e7595f5bA2e",
    "beneficiaries": [
      {
        "name": "Alice",
        "address": "0xabc123...",
        "percentage": 60
      },
      {
        "name": "Bob", 
        "address": "0xdef456...",
        "percentage": 40
      }
    ],
    "inheritanceTemplate": "common-law",
    "deadMansSwitch": {
      "enabled": true,
      "intervalDays": 365
    }
  }'
```

```javascript [JavaScript]
const response = await fetch('https://api.heir.es/api/v1/contracts/generate', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer heir_pk_xxx...',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    blockchain: 'evm',
    ownerAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f5bA2e',
    beneficiaries: [
      { name: 'Alice', address: '0xabc123...', percentage: 60 },
      { name: 'Bob', address: '0xdef456...', percentage: 40 }
    ],
    inheritanceTemplate: 'common-law',
    deadMansSwitch: { enabled: true, intervalDays: 365 }
  })
});

const result = await response.json();
console.log(result.contractCode);
console.log(result.compiled); // ABI and bytecode
```

:::

**Response:**

```json
{
  "success": true,
  "contractCode": "// SPDX-License-Identifier: MIT\npragma solidity ^0.8.19;\n\ncontract InheritanceVault {\n  ...",
  "contractInfo": {
    "blockchain": "evm",
    "distribution": {
      "0xabc123...": 60,
      "0xdef456...": 40
    }
  },
  "compiled": {
    "abi": [...],
    "bytecode": "0x608060405234801561001..."
  },
  "analysis": {
    "securityScore": 95,
    "warnings": []
  }
}
```

## Step 4: Deploy the Contract

Use the compiled ABI and bytecode to deploy using ethers.js, web3.js, or any Ethereum library:

```javascript
import { ethers } from 'ethers';

// Connect to provider
const provider = new ethers.JsonRpcProvider('https://rpc.ankr.com/eth');
const wallet = new ethers.Wallet(privateKey, provider);

// Deploy contract
const factory = new ethers.ContractFactory(
  result.compiled.abi,
  result.compiled.bytecode,
  wallet
);

const contract = await factory.deploy();
await contract.waitForDeployment();

console.log('Contract deployed at:', await contract.getAddress());
```

## Next Steps

- [Product paths](/guide/product-paths) - SPA funnel (`/login` → `/welcome` → pay; paid home `/interview`)
- [MCP](/mcp/) - `@morbidcorp/heir@2.0.5`
- [Authentication](/guide/authentication) - Learn about API key tiers and scopes
- [Webhooks](/guide/webhooks) - Set up real-time event notifications
- [Embedding](/guide/embedding) - White-label the wizard in your app
- [API Reference](/api/) - Complete endpoint documentation

