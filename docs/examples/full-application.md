# Full Application Example

A complete inheritance management application using the HEIR API.

## Overview

This tutorial builds a full-stack application that:

1. Authenticates users with wallet connection
2. Generates inheritance contracts via the API
3. Deploys contracts to the blockchain
4. Monitors contract status via webhooks
5. Displays a dashboard of user contracts

## Project Structure

```
heir-app/
├── src/
│   ├── pages/
│   │   ├── index.tsx        # Landing page
│   │   ├── dashboard.tsx    # User dashboard
│   │   ├── create.tsx       # Contract creation
│   │   └── api/
│   │       └── webhooks/
│   │           └── heir.ts  # Webhook handler
│   ├── components/
│   │   ├── WalletConnect.tsx
│   │   ├── ContractCard.tsx
│   │   └── CreateWizard.tsx
│   ├── lib/
│   │   ├── heir.ts          # API client
│   │   └── db.ts            # Database
│   └── types/
│       └── index.ts
├── package.json
└── .env.local
```

## Setup

### 1. Initialize the Project

```bash
npx create-next-app@latest heir-app --typescript --tailwind
cd heir-app
npm install ethers @heirlabs/sdk
```

### 2. Environment Variables

```env
# .env.local
HEIR_API_KEY=heir_pt_xxx...
HEIR_WEBHOOK_SECRET=whsec_xxx...
DATABASE_URL=postgresql://...
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=...
```

### 3. API Client

```typescript
// src/lib/heir.ts
import { HeirClient } from '@heirlabs/sdk';

export const heir = new HeirClient(process.env.HEIR_API_KEY!);
```

## Dashboard Page

```tsx
// src/pages/dashboard.tsx
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import ContractCard from '../components/ContractCard';

interface Contract {
  id: string;
  address: string;
  beneficiaries: number;
  status: 'pending' | 'deployed' | 'active';
  createdAt: string;
}

export default function Dashboard() {
  const { address, isConnected } = useAccount();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (address) {
      fetchContracts(address);
    }
  }, [address]);

  async function fetchContracts(ownerAddress: string) {
    setLoading(true);
    const res = await fetch(`/api/contracts?owner=${ownerAddress}`);
    const data = await res.json();
    setContracts(data.contracts);
    setLoading(false);
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Please connect your wallet to view your contracts.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Your Inheritance Plans</h1>
        <a
          href="/create"
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
        >
          Create New Plan
        </a>
      </div>

      {loading ? (
        <p>Loading contracts...</p>
      ) : contracts.length === 0 ? (
        <div className="text-center py-12 bg-slate-800 rounded-lg">
          <p className="text-lg mb-4">No inheritance plans yet</p>
          <a href="/create" className="text-indigo-400 hover:underline">
            Create your first plan →
          </a>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contracts.map((contract) => (
            <ContractCard key={contract.id} contract={contract} />
          ))}
        </div>
      )}
    </div>
  );
}
```

## Contract Creation

```tsx
// src/pages/create.tsx
import { useState } from 'react';
import { useAccount, useSignTypedData } from 'wagmi';
import { useRouter } from 'next/router';

interface Beneficiary {
  name: string;
  address: string;
  percentage: number;
}

export default function CreateContract() {
  const { address } = useAccount();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([
    { name: '', address: '', percentage: 100 }
  ]);
  const [deadMansSwitch, setDeadMansSwitch] = useState({
    enabled: true,
    intervalDays: 365
  });

  async function handleSubmit() {
    setLoading(true);
    
    try {
      // 1. Generate contract via API
      const generateRes = await fetch('/api/contracts/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ownerAddress: address,
          beneficiaries,
          deadMansSwitch: {
            enabled: deadMansSwitch.enabled,
            interval: deadMansSwitch.intervalDays * 24 * 60 * 60
          }
        })
      });
      
      const { contractCode, compiled, contractInfo } = await generateRes.json();
      
      // 2. Deploy (handled by separate component/page)
      router.push({
        pathname: '/deploy',
        query: {
          abi: JSON.stringify(compiled.abi),
          bytecode: compiled.bytecode,
          contractInfo: JSON.stringify(contractInfo)
        }
      });
    } catch (error) {
      console.error('Failed to generate contract:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8">Create Inheritance Plan</h1>
      
      {/* Step 1: Beneficiaries */}
      {step === 1 && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Add Beneficiaries</h2>
          
          {beneficiaries.map((b, i) => (
            <div key={i} className="bg-slate-800 p-4 rounded-lg space-y-4">
              <input
                type="text"
                placeholder="Name"
                value={b.name}
                onChange={(e) => {
                  const updated = [...beneficiaries];
                  updated[i].name = e.target.value;
                  setBeneficiaries(updated);
                }}
                className="w-full bg-slate-700 rounded px-3 py-2"
              />
              <input
                type="text"
                placeholder="Wallet Address"
                value={b.address}
                onChange={(e) => {
                  const updated = [...beneficiaries];
                  updated[i].address = e.target.value;
                  setBeneficiaries(updated);
                }}
                className="w-full bg-slate-700 rounded px-3 py-2"
              />
              <input
                type="number"
                placeholder="Percentage"
                value={b.percentage}
                onChange={(e) => {
                  const updated = [...beneficiaries];
                  updated[i].percentage = parseInt(e.target.value);
                  setBeneficiaries(updated);
                }}
                className="w-full bg-slate-700 rounded px-3 py-2"
              />
            </div>
          ))}
          
          <button
            onClick={() => setBeneficiaries([...beneficiaries, { name: '', address: '', percentage: 0 }])}
            className="text-indigo-400"
          >
            + Add another beneficiary
          </button>
          
          <button
            onClick={() => setStep(2)}
            className="w-full bg-indigo-600 py-3 rounded-lg"
          >
            Continue
          </button>
        </div>
      )}
      
      {/* Step 2: Dead Man's Switch */}
      {step === 2 && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Dead Man's Switch</h2>
          
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={deadMansSwitch.enabled}
              onChange={(e) => setDeadMansSwitch({ ...deadMansSwitch, enabled: e.target.checked })}
            />
            Enable automatic inheritance trigger
          </label>
          
          {deadMansSwitch.enabled && (
            <div>
              <label className="block mb-2">Check-in interval (days)</label>
              <input
                type="number"
                value={deadMansSwitch.intervalDays}
                onChange={(e) => setDeadMansSwitch({ ...deadMansSwitch, intervalDays: parseInt(e.target.value) })}
                className="w-full bg-slate-700 rounded px-3 py-2"
              />
            </div>
          )}
          
          <div className="flex gap-4">
            <button onClick={() => setStep(1)} className="px-4 py-2">
              Back
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 bg-indigo-600 py-3 rounded-lg disabled:opacity-50"
            >
              {loading ? 'Generating...' : 'Generate Contract'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
```

## Webhook Handler

```typescript
// src/pages/api/webhooks/heir.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';
import { db } from '../../../lib/db';

const WEBHOOK_SECRET = process.env.HEIR_WEBHOOK_SECRET!;

function verifySignature(payload: string, signature: string): boolean {
  const expected = crypto
    .createHmac('sha256', WEBHOOK_SECRET)
    .update(payload)
    .digest('hex');
  return signature === expected;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const signature = req.headers['x-webhook-signature'] as string;
  const payload = JSON.stringify(req.body);

  if (!verifySignature(payload, signature)) {
    return res.status(401).json({ error: 'Invalid signature' });
  }

  const { event, data, timestamp, webhookId } = req.body;

  console.log(`Received ${event} webhook at ${timestamp}`);

  try {
    switch (event) {
      case 'contract.deployed':
        await db.contract.update({
          where: { tempId: data.tempId },
          data: {
            address: data.contractAddress,
            transactionHash: data.transactionHash,
            status: 'deployed',
            deployedAt: new Date(timestamp)
          }
        });
        break;

      case 'deadman.warning':
        // Send notification to owner
        await sendNotification(data.ownerAddress, {
          type: 'deadman_warning',
          message: 'Please check in to confirm you are still active',
          contractAddress: data.contractAddress
        });
        break;

      case 'deadman.triggered':
        await db.contract.update({
          where: { address: data.contractAddress },
          data: { status: 'triggered' }
        });
        
        // Notify beneficiaries
        for (const beneficiary of data.beneficiaries) {
          await sendNotification(beneficiary.address, {
            type: 'inheritance_available',
            message: 'You have assets available to claim',
            contractAddress: data.contractAddress
          });
        }
        break;
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(500).json({ error: 'Processing failed' });
  }
}
```

## API Route for Contract Generation

```typescript
// src/pages/api/contracts/generate.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { heir } from '../../../lib/heir';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { ownerAddress, beneficiaries, deadMansSwitch } = req.body;

    const result = await heir.contracts.generate({
      blockchain: 'evm',
      ownerAddress,
      beneficiaries,
      inheritanceTemplate: 'common-law',
      deadMansSwitch
    });

    res.status(200).json(result);
  } catch (error: any) {
    console.error('Contract generation error:', error);
    res.status(500).json({ error: error.message });
  }
}
```

## Running the Application

```bash
npm run dev
```

Visit `http://localhost:3000` to see your application.

## Deployment

Deploy to Vercel:

```bash
vercel deploy
```

Make sure to:
1. Set environment variables in Vercel dashboard
2. Update webhook URL to your production domain
3. Configure domain whitelisting for embed features

## Next Steps

- Add email notifications for important events
- Implement contract claiming interface
- Add multi-chain support
- Create mobile app with React Native

