# Mirath (Quranic Fixed Shares)

Mirath governs fixed shares for heirs. HEIR enforces shares and validates permissible combinations, after debts and funeral expenses.

## Core Rules

- **Spouse shares** depend on presence of children.
- **Children** receive fixed or residuary shares.
- **Parents** receive prescribed shares if living.
- **Debts and expenses** are settled first.

## API Usage

```json
{
  "inheritanceTemplate": "islamic-mirth",
  "beneficiaries": [
    { "name": "Spouse", "relationship": "spouse", "address": "0x..." },
    { "name": "Child", "relationship": "child", "address": "0x..." }
  ]
}
```

## Notes

- Shares are computed based on relationships, not arbitrary percentages.
- Use the estate interview tool to capture family structure.
