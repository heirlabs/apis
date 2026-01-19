# Wasiyyah (Bequests)

Wasiyyah allows a bequest of up to 1/3 of the estate to non-heirs. HEIR models Wasiyyah as a pre-distribution allocation.

## Core Rules

- Maximum of **1/3** of estate
- Must not override fixed shares for heirs
- Can be combined with Mirath

## API Usage

```json
{
  "inheritanceTemplate": "islamic-wasiyyah",
  "wasiyyah": {
    "beneficiary": "0x...",
    "percentage": 33.33
  }
}
```
