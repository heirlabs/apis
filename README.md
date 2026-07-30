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
# Get your API key from https://heir.es/developers

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

- **Inheritance platform docs** — Estate Home, health check, soft legacy, executor (product spine on `heirlabs/web` `devv`)
- **Multi-chain contract generation** — EVM primary; Solana, TON, and others at varying maturity
- **Legal templates** — Common Law, Civil Law, Islamic Law, and more (draft guidance, not court execution)
- **Dead man's switch / PoL** — Timer and multi-verification patterns
- **Webhooks** — Event notification model for integrators
- **Embeddable wizard** — White-label contract builder

## API Tiers

| Tier | Rate Limit | Webhooks | Embedding |
|------|------------|----------|-----------|
| Public | 100/15min | ❌ | ❌ |
| Partner | 1,000/15min | ✅ | ✅ |
| Internal | 10,000/15min | ✅ | ✅ |

Confirm live plan limits on [heir.es/pricing](https://heir.es/pricing).

## Documentation

Visit [docs.heir.es](https://docs.heir.es) for:

- [Inheritance Platform](https://docs.heir.es/platform/)
- [Quick Start Guide](https://docs.heir.es/guide/quickstart)
- [API Reference](https://docs.heir.es/api/)
- [Webhook Integration](https://docs.heir.es/guide/webhooks)
- [Embedding Guide](https://docs.heir.es/guide/embedding)

**Integration:** use HTTP + API keys. Published multi-language SDKs are not available as npm/PyPI packages as of 2026-07-30.

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

## Clients

Prefer [cURL / HTTP](https://docs.heir.es/sdks/curl) and OpenAPI client generation. See [SDKs docs](https://docs.heir.es/sdks/) for current publish status.

## Support

- [Documentation](https://docs.heir.es)
- [api@heir.es](mailto:api@heir.es)
- [GitHub Issues](https://github.com/heirlabs/apis/issues)

## License

MIT License - see [LICENSE](LICENSE) for details.

