# API Reference

Complete REST API reference for direct integration with HEIR MCP services.

## Base URL

```
https://api.heir.es
```

## Authentication

All API requests require authentication using an API key in the Authorization header:

```http
Authorization: Bearer heir_sk_your_api_key_here
```

### Getting an API Key

1. Sign up at https://heir.es
2. Navigate to Settings → API Keys
3. Click "Create New Key"
4. Copy and secure your key (shown only once)

## Core Endpoints

### Generate Smart Contract

Generate inheritance smart contracts for multiple blockchains.

```http
POST /api/generate
```

#### Request Body

```json
{
  "blockchain": "evm",
  "network": "ethereum",
  "ownerAddress": "0x742d35Cc6634C0532925a3b8D2b9abcCDCc78EbC",
  "beneficiaries": [
    {
      "name": "Alice Smith",
      "address": "0x8ba1f109551bD432803012645Hac136c52F010c1",
      "percentage": 50,
      "relationship": "daughter"
    },
    {
      "name": "Bob Smith",
      "address": "0x9ca2f109551bD432803012645Aac136c52B020d1",
      "percentage": 50,
      "relationship": "son"
    }
  ],
  "assets": [
    {
      "type": "native",
      "amount": "10.5",
      "symbol": "ETH"
    },
    {
      "type": "token",
      "address": "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      "amount": "50000",
      "symbol": "USDC",
      "decimals": 6
    }
  ],
  "inheritanceTemplate": {
    "type": "perStirpes",
    "jurisdiction": "california",
    "forcedHeirship": false
  },
  "deadMansSwitch": {
    "type": "timeout",
    "lockupPeriod": 365,
    "gracePeriod": 30
  }
}
```

#### Response

```json
{
  "success": true,
  "contractCode": "pragma solidity ^0.8.19;...",
  "contractAddress": null,
  "deploymentInstructions": {
    "estimatedGas": "2,450,000",
    "costInUSD": "45.20",
    "network": "ethereum",
    "steps": [...]
  },
  "auditReport": {
    "score": 95,
    "issues": [],
    "recommendations": []
  },
  "metadata": {
    "requestId": "req_abc123",
    "timestamp": "2024-01-22T10:00:00Z",
    "version": "1.0.0"
  }
}
```

### Estimate Gas Costs

Calculate deployment and execution costs for contracts.

```http
POST /api/estimate-gas
```

#### Request Body

```json
{
  "blockchain": "evm",
  "network": "ethereum",
  "contractType": "inheritance-vault",
  "features": ["multi-sig", "time-lock", "erc20-support"],
  "beneficiaryCount": 5,
  "assetCount": 10
}
```

#### Response

```json
{
  "success": true,
  "estimates": {
    "deployment": {
      "gas": 2500000,
      "gasPrice": "20 gwei",
      "totalETH": "0.05",
      "totalUSD": 125.50
    },
    "execution": {
      "claimAssets": {
        "gas": 150000,
        "totalETH": "0.003",
        "totalUSD": 7.50
      },
      "updateBeneficiaries": {
        "gas": 80000,
        "totalETH": "0.0016",
        "totalUSD": 4.00
      }
    }
  },
  "recommendations": [
    "Consider deploying on Polygon for 90% lower fees",
    "Batch operations to save on gas costs"
  ]
}
```

### Get Jurisdiction Information

Retrieve detailed legal framework information for any jurisdiction.

```http
GET /api/jurisdictions/{jurisdiction}
```

#### Path Parameters

- `jurisdiction` (string): Jurisdiction code (e.g., "california", "germany", "uae")

#### Response

```json
{
  "success": true,
  "jurisdiction": {
    "code": "california",
    "name": "California, United States",
    "legalSystem": "common-law",
    "inheritanceLaws": {
      "intestateSuccession": {
        "spouse": "50% community property + 1/3 separate property",
        "children": "2/3 separate property divided equally",
        "parents": "If no children, parents inherit"
      },
      "forcedHeirship": false,
      "probateRequired": true,
      "probateThreshold": 184500
    },
    "taxLaws": {
      "estateTax": {
        "federal": {
          "exemption": 13610000,
          "rates": [0.18, 0.40]
        },
        "state": null
      },
      "inheritanceTax": null,
      "giftTax": {
        "annual_exclusion": 18000,
        "lifetime_exemption": 13610000
      }
    },
    "recognizedDocuments": [
      "will",
      "revocable-trust",
      "irrevocable-trust",
      "power-of-attorney",
      "healthcare-directive"
    ],
    "witnessRequirements": {
      "will": 2,
      "trust": 1,
      "notarization": "recommended"
    }
  }
}
```

### List All Jurisdictions

Get a complete list of supported jurisdictions.

```http
GET /api/jurisdictions
```

#### Query Parameters

- `region` (optional): Filter by region (e.g., "north-america", "europe", "asia")
- `legalSystem` (optional): Filter by legal system (e.g., "common-law", "civil-law", "islamic")
- `search` (optional): Search term for jurisdiction name

#### Response

```json
{
  "success": true,
  "total": 255,
  "jurisdictions": [
    {
      "code": "usa",
      "name": "United States (Federal)",
      "region": "north-america",
      "legalSystem": "common-law",
      "hasStates": true
    },
    {
      "code": "usa-california",
      "name": "California, United States",
      "region": "north-america",
      "legalSystem": "common-law",
      "parent": "usa"
    },
    {
      "code": "germany",
      "name": "Germany",
      "region": "europe",
      "legalSystem": "civil-law",
      "hasStates": false
    }
  ]
}
```

### Validate Legal Document

Check if a legal document meets jurisdiction requirements.

```http
POST /api/validate-document
```

#### Request Body

```json
{
  "documentType": "will",
  "jurisdiction": "new-york",
  "documentContent": "Last Will and Testament...",
  "metadata": {
    "witnessCount": 2,
    "notarized": true,
    "dateExecuted": "2024-01-15"
  }
}
```

#### Response

```json
{
  "success": true,
  "valid": true,
  "issues": [],
  "warnings": [
    {
      "code": "SELF_PROVING_AFFIDAVIT",
      "message": "Consider adding a self-proving affidavit for easier probate",
      "severity": "info"
    }
  ],
  "recommendations": [
    "Store original in fireproof safe",
    "Provide copies to executor",
    "Register with state registry if available"
  ]
}
```

### Create Document Vault

Create a secure vault for storing estate documents.

```http
POST /api/vault/create
```

#### Request Body

```json
{
  "name": "Smith Family Estate Vault",
  "owner": {
    "name": "John Smith",
    "email": "john@example.com",
    "walletAddress": "0x742d35Cc6634C0532925a3b8D2b9abcCDCc78EbC"
  },
  "accessPolicy": {
    "type": "time-locked",
    "unlockDate": "2025-01-01T00:00:00Z",
    "authorizedUsers": [
      {
        "email": "alice@example.com",
        "role": "beneficiary",
        "permissions": ["read"]
      }
    ]
  },
  "encryption": {
    "type": "AES-256-GCM",
    "keyDerivation": "PBKDF2"
  }
}
```

#### Response

```json
{
  "success": true,
  "vault": {
    "id": "vault_abc123xyz",
    "publicKey": "-----BEGIN PUBLIC KEY-----...",
    "accessUrl": "https://vault.heir.es/abc123xyz",
    "backup": {
      "recoveryCode": "HEIR-VAULT-XXXX-XXXX-XXXX-XXXX",
      "mnemonicPhrase": "word1 word2 word3..."
    }
  }
}
```

### Upload Document to Vault

Upload encrypted documents to a vault.

```http
POST /api/vault/{vaultId}/documents
```

#### Request Body (multipart/form-data)

```
document: (file)
metadata: {
  "type": "will",
  "name": "Last Will and Testament",
  "encryption": "client-side",
  "checksum": "sha256:abc123..."
}
```

#### Response

```json
{
  "success": true,
  "document": {
    "id": "doc_xyz789",
    "vaultId": "vault_abc123xyz",
    "name": "Last Will and Testament",
    "type": "will",
    "size": 125000,
    "uploadedAt": "2024-01-22T10:00:00Z",
    "encryptedChecksum": "sha256:def456...",
    "accessUrl": "https://vault.heir.es/abc123xyz/docs/xyz789"
  }
}
```

### Calculate Life Expectancy

AI-powered life expectancy calculation for estate planning.

```http
POST /api/actuarial/life-expectancy
```

#### Request Body

```json
{
  "age": 65,
  "gender": "male",
  "country": "usa",
  "healthFactors": {
    "smoker": false,
    "bmi": 24.5,
    "chronicConditions": [],
    "familyHistory": {
      "heartDisease": false,
      "cancer": false,
      "diabetes": true
    }
  },
  "lifestyle": {
    "exercise": "moderate",
    "diet": "mediterranean",
    "alcohol": "moderate",
    "stress": "low"
  }
}
```

#### Response

```json
{
  "success": true,
  "analysis": {
    "lifeExpectancy": 84.3,
    "confidenceInterval": {
      "lower": 79.5,
      "upper": 89.1
    },
    "probabilityOfReaching": {
      "70": 0.95,
      "75": 0.87,
      "80": 0.72,
      "85": 0.48,
      "90": 0.23
    },
    "healthSpan": 76.8,
    "recommendations": [
      "Regular diabetes monitoring could add 1.2 years",
      "Increasing exercise to vigorous could add 2.1 years"
    ]
  }
}
```

### Find Estate Planning Attorney

Locate qualified attorneys in a specific area.

```http
GET /api/professionals/attorneys
```

#### Query Parameters

- `location` (required): City, state, or zip code
- `specialization` (optional): "estate-planning", "tax", "probate", "elder-law"
- `radius` (optional): Search radius in miles (default: 25)
- `minRating` (optional): Minimum rating (1-5)
- `maxRate` (optional): Maximum hourly rate

#### Response

```json
{
  "success": true,
  "total": 12,
  "attorneys": [
    {
      "id": "atty_123",
      "name": "Jane Doe, Esq.",
      "firm": "Doe & Associates",
      "specializations": ["estate-planning", "tax"],
      "location": {
        "address": "123 Main St, Suite 100",
        "city": "San Francisco",
        "state": "CA",
        "zip": "94105",
        "distance": 2.3
      },
      "rating": 4.8,
      "reviews": 127,
      "hourlyRate": 450,
      "languages": ["English", "Spanish"],
      "barAdmissions": ["California", "Nevada"],
      "experience": "15 years",
      "availability": "accepting-clients"
    }
  ]
}
```

### Create AI Agent Workflow

Orchestrate multiple AI agents for complex tasks.

```http
POST /api/agents/workflow
```

#### Request Body

```json
{
  "name": "Complete Estate Plan",
  "workflow": "sequential",
  "agents": [
    {
      "type": "legal-research",
      "task": "analyze-jurisdiction",
      "parameters": {
        "jurisdiction": "california"
      }
    },
    {
      "type": "due-diligence",
      "task": "asset-discovery",
      "parameters": {
        "includeDigitalAssets": true
      }
    },
    {
      "type": "document-drafting",
      "task": "generate-will",
      "parameters": {
        "template": "comprehensive"
      }
    },
    {
      "type": "smart-contract",
      "task": "generate-contract",
      "parameters": {
        "blockchain": "ethereum"
      }
    },
    {
      "type": "review",
      "task": "final-validation"
    }
  ],
  "context": {
    "clientId": "client_789",
    "estateValue": 5000000,
    "urgency": "normal"
  }
}
```

#### Response

```json
{
  "success": true,
  "workflow": {
    "id": "wf_abc123",
    "status": "in-progress",
    "startedAt": "2024-01-22T10:00:00Z",
    "estimatedCompletion": "2024-01-22T10:05:00Z",
    "agents": {
      "completed": ["legal-research"],
      "inProgress": ["due-diligence"],
      "pending": ["document-drafting", "smart-contract", "review"]
    },
    "artifacts": {
      "jurisdiction-report": "artifact_001"
    },
    "websocket": "wss://api.heir.es/workflows/wf_abc123"
  }
}
```

## Error Responses

All endpoints follow a consistent error format:

```json
{
  "success": false,
  "error": {
    "code": "INVALID_JURISDICTION",
    "message": "The jurisdiction 'xyz' is not supported",
    "details": {
      "providedValue": "xyz",
      "supportedValues": ["See /api/jurisdictions endpoint"]
    },
    "documentation": "https://docs.heir.es/errors/INVALID_JURISDICTION"
  },
  "requestId": "req_xyz789",
  "timestamp": "2024-01-22T10:00:00Z"
}
```

### Common Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `UNAUTHORIZED` | 401 | Invalid or missing API key |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `VALIDATION_ERROR` | 400 | Invalid request parameters |
| `RATE_LIMITED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Server error |
| `SERVICE_UNAVAILABLE` | 503 | Service temporarily unavailable |

## Rate Limits

Rate limits are enforced per API key:

| Tier | Requests/Hour | Burst | Concurrent |
|------|---------------|-------|------------|
| Free | 100 | 10/min | 2 |
| Pro | 10,000 | 100/min | 10 |
| Business | 100,000 | 1,000/min | 50 |
| Enterprise | Unlimited | Unlimited | Unlimited |

Rate limit headers are included in all responses:

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1705920000
```

## Webhooks

Configure webhooks to receive real-time updates:

### Webhook Events

- `contract.deployed` - Smart contract successfully deployed
- `document.uploaded` - Document added to vault
- `vault.accessed` - Vault accessed by beneficiary
- `workflow.completed` - AI workflow finished
- `alert.triggered` - Important event occurred

### Webhook Payload

```json
{
  "id": "evt_abc123",
  "type": "contract.deployed",
  "timestamp": "2024-01-22T10:00:00Z",
  "data": {
    "contractAddress": "0x...",
    "network": "ethereum",
    "transactionHash": "0x..."
  },
  "signature": "sha256=abc123..."
}
```

### Webhook Security

All webhooks include an HMAC signature for verification:

```javascript
const crypto = require('crypto');

function verifyWebhook(payload, signature, secret) {
  const expected = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
  
  return `sha256=${expected}` === signature;
}
```

## SDKs

Official SDKs are available for popular languages:

### JavaScript/TypeScript

```bash
npm install @heir/sdk
```

```javascript
import { HeirClient } from '@heir/sdk';

const client = new HeirClient('heir_sk_your_api_key');

const contract = await client.generateContract({
  blockchain: 'evm',
  network: 'ethereum',
  // ... other parameters
});
```

### Python

```bash
pip install heir-sdk
```

```python
from heir import HeirClient

client = HeirClient('heir_sk_your_api_key')

contract = client.generate_contract(
    blockchain='evm',
    network='ethereum',
    # ... other parameters
)
```

### Go

```bash
go get github.com/heirlabs/heir-go
```

```go
import "github.com/heirlabs/heir-go"

client := heir.NewClient("heir_sk_your_api_key")

contract, err := client.GenerateContract(&heir.ContractParams{
    Blockchain: "evm",
    Network: "ethereum",
    // ... other parameters
})
```

## Postman Collection

Download our Postman collection for easy API testing:

[Download Postman Collection](https://api.heir.es/postman-collection.json)

## OpenAPI Specification

Access the complete OpenAPI 3.0 specification:

[OpenAPI Spec](https://api.heir.es/openapi.json)

## Changelog

### v1.2.0 (2024-01-15)
- Added TON blockchain support
- New actuarial endpoints
- Webhook event system
- Performance improvements

### v1.1.0 (2023-12-01)
- Multi-language document generation
- Enhanced vault encryption
- Batch operations support
- Bug fixes

### v1.0.0 (2023-10-01)
- Initial public release
- 255 jurisdictions support
- EVM and Solana contracts
- Document vault system

## Support

- Documentation: https://docs.heir.es
- Status Page: https://status.heir.es
- Support: support@heir.es
- GitHub: https://github.com/heirlabs/apis