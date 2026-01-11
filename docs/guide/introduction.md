# Introduction

Welcome to the HEIR API documentation. The HEIR API provides programmatic access to the HEIR Protocol's digital inheritance infrastructure, enabling you to build applications that generate smart contracts, manage vaults, and integrate estate planning tools.

## What is HEIR?

HEIR is a decentralized inheritance protocol that enables:

- **Smart Contract Generation** - Create legally-compliant inheritance contracts for multiple blockchains
- **Dead Man's Switch** - Automatic asset distribution if the owner becomes unresponsive
- **Multi-Jurisdictional Support** - Templates for Common Law, Civil Law, Islamic Law, and more
- **Secure Vault Storage** - Encrypted storage for beneficiary information and documents

## Who is this for?

The HEIR API is designed for:

- **Fintech Companies** - Integrate inheritance planning into wealth management platforms
- **Crypto Custodians** - Offer succession planning to institutional clients
- **Estate Planning Attorneys** - Automate smart contract generation for clients
- **DeFi Protocols** - Add inheritance features to wallets and vaults
- **Insurance Companies** - Create blockchain-based beneficiary designations

## API Features

### Contract Generation

Generate smart contracts for inheritance distribution with a single API call:

```javascript
const response = await fetch('https://api.heir.es/api/v1/contracts/generate', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer heir_pk_xxx...',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    blockchain: 'evm',
    ownerAddress: '0x...',
    beneficiaries: [...],
    inheritanceTemplate: 'common-law'
  })
});

const { contractCode, compiled } = await response.json();
```

### Webhook Subscriptions

Receive real-time notifications for important events:

```javascript
// Subscribe to contract deployment events
await fetch('https://api.heir.es/api/v1/webhooks/subscriptions', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer heir_pt_xxx...',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    url: 'https://your-app.com/webhooks/heir',
    events: ['contract.deployed', 'deadman.triggered']
  })
});
```

### Embeddable Wizard

White-label the contract builder for your customers:

```html
<iframe 
  src="https://api.heir.es/api/embed/wizard?key=heir_pt_xxx&theme=dark&logo=https://your-logo.png"
  width="100%" 
  height="800"
/>
```

## Base URL

All API requests are made to:

```
https://api.heir.es/api/v1/
```

## API Versioning

The current API version is `v1`. All endpoints are prefixed with `/api/v1/`.

::: warning Deprecation Notice
Legacy `/api/*` endpoints (without version prefix) are deprecated and will be removed on **July 1, 2026**. Please migrate to `/api/v1/*`.
:::

## Need Help?

- 📚 [API Reference](/api/) - Complete endpoint documentation
- 💬 [Discord Community](https://discord.gg/heir) - Get help from the community
- 📧 [api@heir.es](mailto:api@heir.es) - Enterprise support
- 🐛 [GitHub Issues](https://github.com/heirlabs/apis/issues) - Report bugs

