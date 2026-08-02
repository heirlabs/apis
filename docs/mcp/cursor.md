# Cursor setup

## Install package once

```bash
cd /path/to/your/project
npm i @morbidcorp/heir@2.0.1
```

## MCP config

```json
{
  "mcpServers": {
    "heir": {
      "command": "node",
      "args": ["node_modules/@morbidcorp/heir/dist/cli.js"],
      "env": {
        "HEIR_API_KEY": "heir_pk_your_key_here"
      }
    }
  }
}
```

Cursor’s working directory must be the project where the package is installed,
or use an absolute path to `dist/cli.js`.

Do **not** use `npx @morbidcorp/heir` as the command (broken `bin` on 2.0.1).
Do **not** point at a fictional hosted `mcp.heir.es` URL.

## Example prompts

- “Call heir_jurisdiction_get with code usa-california.”
- “Use heir_contract_estimate_gas for ethereum mainnet with 3 beneficiaries.”
- “heir_chat_recommend_plan for a married couple in germany with crypto assets.”

## Support

- [Authentication](/mcp/authentication)
- [Tools](/mcp/tools)
- [Issues](https://github.com/heirlabs/apis/issues)
