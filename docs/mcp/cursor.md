# Cursor setup

```json
{
  "mcpServers": {
    "heir": {
      "command": "npx",
      "args": ["-y", "@morbidcorp/heir@2.0.5"],
      "env": {
        "HEIR_API_KEY": "heir_pk_your_key_here"
      }
    }
  }
}
```

Pin **2.0.5**. 2.0.4 also worked (`dist/cli.js`). Do not use `@heir/mcp` or unpinned 2.0.1.

Default (`--tools=all` or omitted): capability projection (`heir_capabilities_search`, …). Legacy 18 HTTP tools: `--tools=contracts,vaults,jurisdictions,legal,chat`.

## Example prompts

- “Call heir_capabilities_search for interview checkout.”
- “Call heir_jurisdiction_get with code usa-california.” (needs `--tools=jurisdictions` or the contracts,vaults,jurisdictions,legal,chat set)
- “heir_contract_estimate_gas for ethereum with 3 beneficiaries.”
- “heir_chat_recommend_plan for married couple in germany with crypto assets.”

## Support

- [Authentication](/mcp/authentication)
- [Tools](/mcp/tools)
