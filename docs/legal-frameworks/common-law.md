# Common Law

Common Law inheritance emphasizes testamentary freedom with limited statutory protections for close family. HEIR supports per-capita and per-stirpes distributions, along with optional constraints for reserved heirs.

## Core Principles

- **Testamentary freedom**: broad ability to allocate assets
- **Per-capita**: equal shares for all beneficiaries
- **Per-stirpes**: distribution by family branch
- **Limited family provisions**: jurisdiction-specific protections

## API Usage

```json
{
  "inheritanceTemplate": "common-law",
  "beneficiaries": [
    { "name": "Alice", "address": "0x...", "percentage": 60 },
    { "name": "Bob", "address": "0x...", "percentage": 40 }
  ]
}
```

## Best Practices

- Use `relationship` fields for clarity in legal documents.
- Ensure shares total 100%.
- Include alternate beneficiaries for resilience.

## Jurisdiction Notes

Common law templates are tuned for US/UK/Canada/Australia defaults, with local overrides in jurisdiction-specific documents.
