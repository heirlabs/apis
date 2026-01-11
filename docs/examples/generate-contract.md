# Generate a Contract

Step-by-step guide to generating an inheritance smart contract via the API.

## Overview

This tutorial walks through generating an EVM-compatible inheritance contract with two beneficiaries and a dead man's switch.

## Prerequisites

- An HEIR API key ([Get one here](/guide/quickstart))
- Basic understanding of Ethereum addresses
- Node.js 18+ (for the JavaScript examples)

## Step 1: Prepare Beneficiary Data

First, gather the information for your beneficiaries:

```javascript
const beneficiaries = [
  {
    name: 'Alice Smith',
    address: '0x742d35Cc6634C0532925a3b844Bc9e7595f5bA2e',
    percentage: 60,
    relationship: 'spouse'
  },
  {
    name: 'Bob Smith',
    address: '0x8ba1f109551bD432803012645Ac136ddd64DBA72',
    percentage: 40,
    relationship: 'child'
  }
];
```

::: tip
Percentages must add up to exactly 100.
:::

## Step 2: Configure Dead Man's Switch

Optionally configure a dead man's switch that triggers inheritance if the owner doesn't check in:

```javascript
const deadMansSwitch = {
  enabled: true,
  interval: 365 * 24 * 60 * 60, // 1 year in seconds
  checkInMethod: 'manual' // 'manual', 'transaction', or 'oracle'
};
```

## Step 3: Generate the Contract

Make the API call to generate the contract:

```javascript
const response = await fetch('https://api.heir.es/api/v1/contracts/generate', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer heir_pk_xxx...',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    blockchain: 'evm',
    ownerAddress: '0xYourWalletAddress...',
    beneficiaries,
    inheritanceTemplate: 'common-law',
    deadMansSwitch
  })
});

const result = await response.json();

if (result.success) {
  console.log('Contract generated successfully!');
  console.log('Contract code:', result.data.contractCode);
  console.log('ABI:', result.data.compiled.abi);
  console.log('Bytecode:', result.data.compiled.bytecode);
} else {
  console.error('Error:', result.error.message);
}
```

## Step 4: Review the Generated Contract

The response includes:

| Field | Description |
|-------|-------------|
| `contractCode` | Human-readable Solidity source code |
| `compiled.abi` | Contract ABI for interacting with it |
| `compiled.bytecode` | Compiled bytecode for deployment |
| `contractInfo` | Metadata about the contract |
| `analysis` | Security analysis results |

Example response:

```json
{
  "success": true,
  "data": {
    "contractCode": "// SPDX-License-Identifier: MIT\npragma solidity ^0.8.19;\n\ncontract InheritanceVault {\n  // ...\n}",
    "compiled": {
      "abi": [...],
      "bytecode": "0x608060405..."
    },
    "contractInfo": {
      "name": "InheritanceVault",
      "beneficiaryCount": 2,
      "hasDeadMansSwitch": true,
      "template": "common-law"
    },
    "analysis": {
      "warnings": [],
      "gasEstimate": "2500000"
    }
  }
}
```

## Step 5: Deploy the Contract

Use the compiled bytecode to deploy via your preferred method:

### Using ethers.js

```javascript
import { ethers } from 'ethers';

const provider = new ethers.BrowserProvider(window.ethereum);
const signer = await provider.getSigner();

const factory = new ethers.ContractFactory(
  result.data.compiled.abi,
  result.data.compiled.bytecode,
  signer
);

const contract = await factory.deploy(
  '0xYourWalletAddress...',
  beneficiaries.map(b => b.address)
);

await contract.waitForDeployment();
console.log('Deployed to:', await contract.getAddress());
```

### Using viem

```javascript
import { createWalletClient, custom } from 'viem';
import { mainnet } from 'viem/chains';

const client = createWalletClient({
  chain: mainnet,
  transport: custom(window.ethereum)
});

const hash = await client.deployContract({
  abi: result.data.compiled.abi,
  bytecode: result.data.compiled.bytecode,
  args: ['0xYourWalletAddress...', beneficiaries.map(b => b.address)]
});
```

## Complete Example

Here's the full code in one file:

```javascript
// generate-and-deploy.js
import { ethers } from 'ethers';

const API_KEY = process.env.HEIR_API_KEY;
const OWNER_ADDRESS = process.env.OWNER_ADDRESS;

async function main() {
  // 1. Generate the contract
  const response = await fetch('https://api.heir.es/api/v1/contracts/generate', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      blockchain: 'evm',
      ownerAddress: OWNER_ADDRESS,
      beneficiaries: [
        {
          name: 'Alice',
          address: '0x742d35Cc6634C0532925a3b844Bc9e7595f5bA2e',
          percentage: 100
        }
      ],
      inheritanceTemplate: 'common-law'
    })
  });

  const { data } = await response.json();
  
  // 2. Deploy the contract
  const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  
  const factory = new ethers.ContractFactory(
    data.compiled.abi,
    data.compiled.bytecode,
    wallet
  );
  
  console.log('Deploying...');
  const contract = await factory.deploy(OWNER_ADDRESS, [
    '0x742d35Cc6634C0532925a3b844Bc9e7595f5bA2e'
  ]);
  
  await contract.waitForDeployment();
  console.log('Deployed to:', await contract.getAddress());
}

main().catch(console.error);
```

## Next Steps

- [Set up webhooks](/examples/webhook-integration) to track deployment events
- [Embed the wizard](/examples/embed-wizard) in your application
- Review [API reference](/api/contracts) for all options

