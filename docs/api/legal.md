# Legal Documents

Generate legal documents for inheritance planning.

::: info Coming Soon
Legal document generation endpoints are coming in v1.1.
:::

## Overview

The Legal Documents API will enable generation of complementary legal documents to accompany your smart contracts, including:

- **Will Templates** - Legally-compliant will documents
- **Trust Documents** - Living trust formations
- **Power of Attorney** - Digital asset POA forms
- **Beneficiary Designations** - Formal beneficiary forms

## Planned Endpoints

### Generate Document

```http
POST /api/v1/legal/generate
```

Generate a legal document based on contract configuration.

### List Templates

```http
GET /api/v1/legal/templates
```

List available legal document templates by jurisdiction.

### Sign Document

```http
POST /api/v1/legal/documents/:id/sign
```

Initiate e-signature flow for a document.

## Jurisdiction Support

Planned jurisdiction support:

| Jurisdiction | Status |
|-------------|--------|
| United States (per state) | 🔜 Coming |
| United Kingdom | 🔜 Coming |
| European Union | 🔜 Coming |
| Canada | 🔜 Coming |
| Australia | 🔜 Coming |
| Singapore | 🔜 Coming |
| UAE | 🔜 Coming |

## Integration with OpenSign

Legal documents will be integrated with OpenSign for e-signature capabilities:

- Multi-party signing
- Notarization integration
- Audit trail
- Legal validity

## Notify Me

Want to be notified when Legal Documents API launches?

- [Join the waitlist](https://heir.es/legal-api-waitlist)
- [Watch GitHub releases](https://github.com/heirlabs/apis/releases)

