# JavaScript / TypeScript SDK

Official JavaScript SDK for the HEIR API.

## Installation

```bash
npm install @heirlabs/sdk
# or
yarn add @heirlabs/sdk
# or
pnpm add @heirlabs/sdk
```

## Quick Start

```typescript
import { HeirClient } from '@heirlabs/sdk';

const heir = new HeirClient('heir_pk_xxx...');

// Generate a contract
const contract = await heir.contracts.generate({
  blockchain: 'evm',
  ownerAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f5bA2e',
  beneficiaries: [
    { name: 'Alice', address: '0xabc...', percentage: 100 }
  ]
});

console.log(contract.contractCode);
```

## Configuration

```typescript
const heir = new HeirClient('heir_pk_xxx...', {
  baseUrl: 'https://api.heir.es/api/v1', // Default
  timeout: 30000, // 30 seconds
  retries: 3,
  onRateLimit: (retryAfter) => {
    console.log(`Rate limited, retrying in ${retryAfter}s`);
  }
});
```

## API Reference

### Contracts

#### Generate Contract

```typescript
const result = await heir.contracts.generate({
  blockchain: 'evm', // 'evm' | 'solana' | 'ton'
  ownerAddress: '0x...',
  beneficiaries: [
    {
      name: 'Alice',
      address: '0xabc...',
      percentage: 50,
      relationship: 'spouse'
    },
    {
      name: 'Bob',
      address: '0xdef...',
      percentage: 50,
      relationship: 'child'
    }
  ],
  inheritanceTemplate: 'common-law',
  deadMansSwitch: {
    enabled: true,
    interval: 365 * 24 * 60 * 60, // 1 year in seconds
    checkInMethod: 'manual'
  }
});

// Returns: { contractCode, compiled, contractInfo, analysis }
```

#### List Templates

```typescript
const templates = await heir.contracts.templates();

// Returns: [{ id, name, description, jurisdiction }]
```

#### Compile Contract

```typescript
const compiled = await heir.contracts.compile({
  sourceCode: '// Solidity code...',
  compiler: '0.8.19'
});

// Returns: { abi, bytecode }
```

#### Estimate Gas

```typescript
const estimate = await heir.contracts.estimateGas({
  bytecode: '0x...',
  chain: 'ethereum',
  constructorArgs: ['0x...', [...]]
});

// Returns: { gasEstimate, gasPriceGwei, totalCostEth }
```

### API Keys

```typescript
// List your API keys
const keys = await heir.apiKeys.list();

// Create a new key
const newKey = await heir.apiKeys.create({
  name: 'Production Key',
  tier: 'partner',
  scopes: ['contracts', 'webhooks']
});

// Revoke a key
await heir.apiKeys.revoke('key_id');
```

### Webhooks

```typescript
// List subscriptions
const webhooks = await heir.webhooks.list();

// Create subscription
const webhook = await heir.webhooks.create({
  event: 'contract.deployed',
  url: 'https://your-app.com/webhooks',
  secret: 'your_secret'
});

// Test a webhook
const test = await heir.webhooks.test('webhook_id');

// Delete subscription
await heir.webhooks.delete('webhook_id');
```

## TypeScript Support

Full TypeScript support with complete type definitions:

```typescript
import type { 
  GenerateContractParams,
  ContractResult,
  Beneficiary,
  DeadMansSwitchConfig
} from '@heirlabs/sdk';

const params: GenerateContractParams = {
  blockchain: 'evm',
  ownerAddress: '0x...',
  beneficiaries: [{
    name: 'Alice',
    address: '0xabc...',
    percentage: 100
  }]
};

const result: ContractResult = await heir.contracts.generate(params);
```

## Error Handling

```typescript
import { HeirError, RateLimitError, ValidationError } from '@heirlabs/sdk';

try {
  await heir.contracts.generate(params);
} catch (error) {
  if (error instanceof RateLimitError) {
    console.log(`Rate limited. Retry after ${error.retryAfter}s`);
  } else if (error instanceof ValidationError) {
    console.log('Validation errors:', error.details);
  } else if (error instanceof HeirError) {
    console.log(`API error: ${error.code} - ${error.message}`);
  }
}
```

## Webhook Verification

```typescript
import { verifyWebhookSignature } from '@heirlabs/sdk';

app.post('/webhooks/heir', (req, res) => {
  const isValid = verifyWebhookSignature(
    req.body,
    req.headers['x-webhook-signature'],
    WEBHOOK_SECRET
  );
  
  if (!isValid) {
    return res.status(401).send('Invalid signature');
  }
  
  // Process webhook...
  res.status(200).send('OK');
});
```

## Browser Usage

The SDK works in browsers with bundlers:

```typescript
// Vite, webpack, etc.
import { HeirClient } from '@heirlabs/sdk';
```

For direct browser usage:

```html
<script src="https://unpkg.com/@heirlabs/sdk"></script>
<script>
  const heir = new HeirSDK.HeirClient('heir_pk_xxx...');
</script>
```

## Links

- [NPM Package](https://npmjs.com/package/@heirlabs/sdk)
- [GitHub Repository](https://github.com/heirlabs/heir-js)
- [TypeScript Docs](https://heirlabs.github.io/heir-js)

