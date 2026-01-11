# Contracts API

Generate, compile, and manage inheritance smart contracts.

## List Templates

Get available inheritance templates.

```http
GET /api/v1/contracts/templates
```

### Response

```json
{
  "templates": [
    {
      "type": "common-law",
      "name": "Common Law",
      "description": "Freedom of testation with some restrictions."
    },
    {
      "type": "civil-law",
      "name": "Civil Law",
      "description": "Forced heirship rules."
    },
    {
      "type": "islamic-mirth",
      "name": "Islamic Inheritance (Mirth)",
      "description": "Fixed shares based on Quranic rules."
    },
    {
      "type": "islamic-wasiyyah",
      "name": "Islamic Inheritance (Wasiyyah)",
      "description": "Will-based Islamic inheritance."
    },
    {
      "type": "custom",
      "name": "Custom Distribution",
      "description": "User-defined distribution."
    }
  ]
}
```

---

## Generate Contract

Generate an inheritance smart contract based on specified parameters.

```http
POST /api/v1/contracts/generate
```

### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `blockchain` | string | Yes | `evm`, `solana`, or `ton` |
| `ownerAddress` | string | Yes | Wallet address of contract owner |
| `beneficiaries` | array | Yes | List of beneficiaries |
| `inheritanceTemplate` | string | No | Template type (defaults to `custom`) |
| `deadMansSwitch` | object | No | Dead man's switch configuration |
| `assets` | array | No | Specific assets to include |

#### Beneficiary Object

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Beneficiary name |
| `address` | string | Yes | Wallet address |
| `percentage` | number | Yes | Share percentage (0-100) |
| `relationship` | string | No | Relationship to owner |
| `email` | string | No | Email for notifications |

#### Dead Man's Switch Object

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `enabled` | boolean | false | Enable the switch |
| `intervalDays` | number | 365 | Check-in interval in days |

### Example Request

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
        "address": "0xabc123def456789...",
        "percentage": 60,
        "relationship": "spouse"
      },
      {
        "name": "Bob",
        "address": "0xdef456abc789012...",
        "percentage": 40,
        "relationship": "child"
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
      { name: 'Alice', address: '0xabc...', percentage: 60 },
      { name: 'Bob', address: '0xdef...', percentage: 40 }
    ],
    inheritanceTemplate: 'common-law',
    deadMansSwitch: { enabled: true, intervalDays: 365 }
  })
});

const result = await response.json();
```

:::

### Response

```json
{
  "success": true,
  "contractCode": "// SPDX-License-Identifier: MIT\npragma solidity ^0.8.19;\n\n/**\n * @title InheritanceVault\n * @notice Secure inheritance distribution with dead man's switch\n */\ncontract InheritanceVault {\n    ...\n}",
  "contractInfo": {
    "blockchain": "evm",
    "network": "ethereum",
    "distribution": {
      "0xabc123def456789...": 60,
      "0xdef456abc789012...": 40
    },
    "features": ["deadMansSwitch", "multiSig"],
    "estimatedGas": "~500000"
  },
  "compiled": {
    "abi": [
      {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
      },
      ...
    ],
    "bytecode": "0x608060405234801561001057600080fd5b50..."
  },
  "analysis": {
    "securityScore": 95,
    "warnings": [],
    "suggestions": ["Consider adding a multi-sig requirement for large withdrawals"]
  }
}
```

### Error Responses

**400 Bad Request** - Invalid input

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Beneficiary percentages must sum to 100",
    "details": [
      { "field": "beneficiaries", "reason": "Sum is 90, expected 100" }
    ]
  }
}
```

**429 Rate Limited**

```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Contract generation limit exceeded. Your tier: public, limit: 10 per 15 minutes."
  }
}
```

---

## Compile Contract

Compile Solidity source code to ABI and bytecode.

```http
POST /api/v1/contracts/compile
```

### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `sourceCode` | string | Yes | Solidity source code |
| `blockchain` | string | Yes | Must be `evm` |

### Example

```bash
curl -X POST https://api.heir.es/api/v1/contracts/compile \
  -H "Authorization: Bearer heir_pk_xxx..." \
  -H "Content-Type: application/json" \
  -d '{
    "sourceCode": "// SPDX-License-Identifier: MIT\npragma solidity ^0.8.19;\n\ncontract Simple { ... }",
    "blockchain": "evm"
  }'
```

### Response

```json
{
  "success": true,
  "compiled": {
    "abi": [...],
    "bytecode": "0x608060405234801561001057600080fd5b50..."
  }
}
```

---

## Estimate Gas

Get estimated gas costs for contract operations.

```http
POST /api/v1/contracts/estimate-gas
```

### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `blockchain` | string | Yes | `evm` or `solana` |
| `contractCode` | string | No | Contract source for accurate estimate |

### Response

```json
{
  "estimate": {
    "deployment": "~500000",
    "claim": "~100000",
    "update": "~50000",
    "currency": "ETH"
  }
}
```

---

## Blockchain Support

### EVM (Ethereum, Polygon, Base, etc.)

- **Output:** Solidity smart contract
- **Compilation:** ABI and bytecode included
- **Networks:** Mainnet, testnets, L2s

### Solana

- **Output:** Rust/Anchor program
- **Compilation:** Requires Solana toolchain
- **Networks:** Mainnet, devnet

### TON (The Open Network)

- **Output:** FunC contract + deployment script
- **Compilation:** Requires TON compiler
- **Networks:** Mainnet, testnet

