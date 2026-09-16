# VS Code setup

```json
{
  "mcp": {
    "servers": {
      "heir": {
        "command": "npx",
        "args": ["-y", "@morbidcorp/heir@2.0.5"],
        "env": {
          "HEIR_API_KEY": "heir_pk_your_key_here"
        }
      }
    }
  }
}
```

Exact nesting depends on the MCP extension. Pin **2.0.5**. 2.0.4 also worked (`dist/cli.js`).

Default: capability projection (`heir_capabilities_search`, …). Legacy 18 HTTP tools: `--tools=contracts,vaults,jurisdictions,legal,chat`.

## Verify

Default tool list includes `heir_capabilities_search`. With `--tools=contracts,vaults,jurisdictions,legal,chat`, the list should include `heir_contract_generate`, `heir_jurisdiction_get`, `heir_legal_generate_will`, `heir_chat_estate_planning` (18 total).

## Related

- [Authentication](/mcp/authentication)
- [Tools](/mcp/tools)
