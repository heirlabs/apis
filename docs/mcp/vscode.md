# VS Code setup

## Install

```bash
npm i @morbidcorp/heir@2.0.1
```

## Server definition

```json
{
  "mcp": {
    "servers": {
      "heir": {
        "command": "node",
        "args": ["${workspaceFolder}/node_modules/@morbidcorp/heir/dist/cli.js"],
        "env": {
          "HEIR_API_KEY": "heir_pk_your_key_here"
        }
      }
    }
  }
}
```

Exact key nesting depends on the MCP extension. Always invoke **`dist/cli.js`**,
not the package binary name `heir-mcp`.

## Verify

Tool list should include `heir_contract_generate`, `heir_jurisdiction_get`,
`heir_legal_generate_will`, `heir_chat_estate_planning`, etc. (18 tools total).

## Related

- [Authentication](/mcp/authentication)
- [Tools](/mcp/tools)
