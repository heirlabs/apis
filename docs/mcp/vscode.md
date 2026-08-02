# VS Code setup

```json
{
  "mcp": {
    "servers": {
      "heir": {
        "command": "npx",
        "args": ["-y", "@morbidcorp/heir@2.0.4"],
        "env": {
          "HEIR_API_KEY": "heir_pk_your_key_here"
        }
      }
    }
  }
}
```

Exact nesting depends on the MCP extension. Pin **2.0.4+**.

## Verify

Tool list should include `heir_contract_generate`, `heir_jurisdiction_get`,
`heir_legal_generate_will`, `heir_chat_estate_planning` (18 total).

## Related

- [Authentication](/mcp/authentication)
- [Tools](/mcp/tools)
