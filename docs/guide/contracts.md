# Contracts

Learn how to generate and manage inheritance smart contracts via the API.

## Overview

The HEIR API enables you to generate legally-compliant inheritance smart contracts for multiple blockchain platforms. Each contract is customized based on your chosen inheritance template and beneficiary configuration.

## Supported Blockchains

| Platform | Status | Networks |
|----------|--------|----------|
| **EVM** | ✅ Available | Ethereum, Polygon, Arbitrum, Base, BSC |
| **Solana** | ✅ Available | Mainnet, Devnet |
| **TON** | ✅ Available | Mainnet, Testnet |
| **Midnight** | 🔜 Coming Soon | - |

## Inheritance Templates

Templates define how assets are distributed:

### Common Law
- Default equal distribution among beneficiaries
- Supports percentage-based allocations
- Spouse receives primary share

### Civil Law
- Fixed portions for forced heirs
- Reserved portions for family members
- Based on European legal frameworks

### Islamic Law (Mirth)
- Follows Shariah inheritance rules
- Automatic calculation of shares
- Gender-specific allocations

### Custom
- Define your own distribution rules
- Full flexibility over percentages
- Supports complex family structures

## Contract Generation Flow

```
1. Configure beneficiaries
         ↓
2. Select inheritance template
         ↓
3. Configure dead man's switch (optional)
         ↓
4. Call API to generate contract
         ↓
5. Review generated code
         ↓
6. Deploy to blockchain
```

## Basic Example

```javascript
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
      { name: 'Spouse', address: '0xabc...', percentage: 60 },
      { name: 'Child', address: '0xdef...', percentage: 40 }
    ],
    inheritanceTemplate: 'common-law'
  })
});
```

## Dead Man's Switch

The dead man's switch automatically triggers inheritance if the owner doesn't check in within a specified period.

### Configuration

```javascript
deadMansSwitch: {
  enabled: true,
  interval: 365 * 24 * 60 * 60, // 1 year in seconds
  checkInMethod: 'manual' // or 'transaction', 'oracle'
}
```

### Check-in Methods

| Method | Description |
|--------|-------------|
| `manual` | Owner must explicitly call check-in function |
| `transaction` | Any transaction from owner wallet resets timer |
| `oracle` | External oracle verifies owner activity |

## Contract Compilation

The API returns compiled bytecode ready for deployment:

```json
{
  "compiled": {
    "abi": [...],
    "bytecode": "0x608060405...",
    "sourceMap": "..."
  }
}
```

## Gas Estimation

Estimate deployment costs before deploying:

```bash
curl -X POST https://api.heir.es/api/v1/contracts/estimate-gas \
  -H "Authorization: Bearer heir_pk_xxx..." \
  -H "Content-Type: application/json" \
  -d '{
    "bytecode": "0x608060405...",
    "chain": "ethereum"
  }'
```

## Related

- [API Reference: Contracts](/api/contracts)
- [Example: Generate Contract](/examples/generate-contract)
- [Webhooks](/guide/webhooks) - Get notified on deployment

