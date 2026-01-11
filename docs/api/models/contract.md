# Contract Model

The contract object represents a generated inheritance smart contract.

## Object Structure

```json
{
  "contractCode": "// SPDX-License-Identifier: MIT\npragma solidity ^0.8.19;\n...",
  "compiled": {
    "abi": [...],
    "bytecode": "0x608060405...",
    "sourceMap": "..."
  },
  "contractInfo": {
    "name": "InheritanceVault",
    "blockchain": "evm",
    "template": "common-law",
    "beneficiaryCount": 2,
    "hasDeadMansSwitch": true,
    "version": "1.0.0"
  },
  "analysis": {
    "warnings": [],
    "gasEstimate": "2500000",
    "securityScore": "A"
  }
}
```

## Properties

### Root Object

| Property | Type | Description |
|----------|------|-------------|
| `contractCode` | string | Human-readable Solidity/Rust source code |
| `compiled` | object | Compilation output |
| `contractInfo` | object | Contract metadata |
| `analysis` | object | Security analysis results |

### Compiled Object

| Property | Type | Description |
|----------|------|-------------|
| `abi` | array | Contract ABI for interaction |
| `bytecode` | string | Compiled bytecode for deployment |
| `sourceMap` | string | Source mapping for debugging |

### ContractInfo Object

| Property | Type | Description |
|----------|------|-------------|
| `name` | string | Contract name |
| `blockchain` | string | Target blockchain platform |
| `template` | string | Inheritance template used |
| `beneficiaryCount` | number | Number of beneficiaries |
| `hasDeadMansSwitch` | boolean | Dead man's switch enabled |
| `version` | string | Contract version |

### Analysis Object

| Property | Type | Description |
|----------|------|-------------|
| `warnings` | array | Compilation/security warnings |
| `gasEstimate` | string | Estimated deployment gas |
| `securityScore` | string | Security rating (A-F) |

## Blockchain Values

| Value | Description |
|-------|-------------|
| `evm` | Ethereum Virtual Machine chains |
| `solana` | Solana blockchain |
| `ton` | TON blockchain |

## Template Values

| Value | Description |
|-------|-------------|
| `common-law` | Common law inheritance |
| `civil-law` | Civil law (European) inheritance |
| `islamic-mirth` | Islamic inheritance (Mirth) |
| `custom` | Custom distribution rules |

## Beneficiary Object

Within the generation request:

```json
{
  "name": "Alice Smith",
  "address": "0x742d35Cc6634C0532925a3b844Bc9e7595f5bA2e",
  "percentage": 60,
  "relationship": "spouse"
}
```

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `name` | string | Yes | Beneficiary name |
| `address` | string | Yes | Wallet address |
| `percentage` | number | Yes | Inheritance percentage (0-100) |
| `relationship` | string | No | Relationship to owner |

## Dead Man's Switch Object

```json
{
  "enabled": true,
  "interval": 31536000,
  "checkInMethod": "manual"
}
```

| Property | Type | Description |
|----------|------|-------------|
| `enabled` | boolean | Whether switch is active |
| `interval` | number | Seconds until trigger |
| `checkInMethod` | string | `manual`, `transaction`, `oracle` |

