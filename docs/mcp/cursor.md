# Cursor setup

```json
{
  "mcpServers": {
    "heir": {
      "command": "npx",
      "args": ["-y", "@morbidcorp/heir@2.0.2"],
      "env": {
        "HEIR_API_KEY": "heir_pk_your_key_here"
      }
    }
  }
}
```

Pin **2.0.3+**. Do not use `@heir/mcp` or unpinned 2.0.1.

## Example prompts

- “Call heir_jurisdiction_get with code usa-california.”
- “heir_contract_estimate_gas for ethereum with 3 beneficiaries.”
- “heir_chat_recommend_plan for married couple in germany with crypto assets.”

## Support

- [Authentication](/mcp/authentication)
- [Tools](/mcp/tools)
