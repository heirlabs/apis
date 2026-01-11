# HEIR API

> Headless API for the HEIR Protocol - Digital inheritance infrastructure

[![Documentation](https://img.shields.io/badge/docs-docs.heir.es-blue)](https://docs.heir.es)
[![API Status](https://img.shields.io/badge/status-operational-green)](https://status.heir.es)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## Overview

The HEIR API provides programmatic access to smart contract generation, vault management, and estate planning tools. Build inheritance solutions for any blockchain.

**Documentation:** [docs.heir.es](https://docs.heir.es)

## Quick Start

```bash
# Get your API key from https://api.heir.es/api/developer

# Generate an inheritance contract
curl -X POST https://api.heir.es/api/v1/contracts/generate \
  -H "Authorization: Bearer heir_pk_xxx..." \
  -H "Content-Type: application/json" \
  -d '{
    "blockchain": "evm",
    "ownerAddress": "0x...",
    "beneficiaries": [
      { "name": "Alice", "address": "0xabc...", "percentage": 100 }
    ]
  }'
```

## Features

- **Multi-Chain Support** - Ethereum, Solana, TON
- **Legal Templates** - Common Law, Civil Law, Islamic Law, and more
- **Dead Man's Switch** - Automatic inheritance distribution
- **Webhooks** - Real-time event notifications
- **Embeddable Wizard** - White-label contract builder

## API Tiers

| Tier | Rate Limit | Webhooks | Embedding |
|------|------------|----------|-----------|
| Public | 100/15min | ❌ | ❌ |
| Partner | 1,000/15min | ✅ | ✅ |
| Internal | 10,000/15min | ✅ | ✅ |

## Documentation

Visit [docs.heir.es](https://docs.heir.es) for:

- [Quick Start Guide](https://docs.heir.es/guide/quickstart)
- [API Reference](https://docs.heir.es/api/)
- [Webhook Integration](https://docs.heir.es/guide/webhooks)
- [Embedding Guide](https://docs.heir.es/guide/embedding)

## Development

```bash
# Install dependencies
npm install

# Run API server
npm run dev

# Run documentation site
npm run docs:dev

# Build documentation
npm run docs:build
```

## SDKs

- [JavaScript/TypeScript](https://github.com/heirlabs/heir-js)
- [Python](https://github.com/heirlabs/heir-python)
- [Go](https://github.com/heirlabs/heir-go)

## Support

- 📚 [Documentation](https://docs.heir.es)
- 💬 [Discord](https://discord.gg/heir)
- 📧 [api@heir.es](mailto:api@heir.es)
- 🐛 [GitHub Issues](https://github.com/heirlabs/apis/issues)

## License

MIT License - see [LICENSE](LICENSE) for details.

