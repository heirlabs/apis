# Model Context Protocol (MCP)

Connect AI assistants to HEIR via [`@morbidcorp/heir`](https://www.npmjs.com/package/@morbidcorp/heir).

## Package facts (verified 2026-08-02)

| Field | Value |
|-------|--------|
| npm | `@morbidcorp/heir` **2.0.1** (exists) |
| Working entry | `dist/cli.js` (stdio) |
| Tools | **18** — contracts, vaults, jurisdictions, legal, chat |
| Broken entry | package `bin` → `index.js` (import crash) — do not use `npx @morbidcorp/heir` until fixed |
| Wrong name | `@heir/mcp` — **404** on npm |

## Working install

```bash
npm i @morbidcorp/heir@2.0.1
export HEIR_API_KEY="heir_pk_..."
node node_modules/@morbidcorp/heir/dist/cli.js
```

Claude Desktop / Cursor / VS Code:

```json
{
  "mcpServers": {
    "heir": {
      "command": "node",
      "args": ["node_modules/@morbidcorp/heir/dist/cli.js"],
      "env": {
        "HEIR_API_KEY": "heir_pk_..."
      }
    }
  }
}
```

Create keys at [heir.es/developers](https://heir.es/developers).

Optional: `--tools=contracts,legal` and `--api-key=` are supported by **`dist/cli.js` only**.

## Tool categories

| Category | Prefix | Count |
|----------|--------|------:|
| Contracts | `heir_contract_*` | 3 |
| Vaults | `heir_vault_*` | 4 |
| Jurisdictions | `heir_jurisdiction_*` | 4 |
| Legal | `heir_legal_*` | 4 |
| Chat | `heir_chat_*` | 3 |

Full schemas: [Available Tools](/mcp/tools).

## Related

- [Authentication](/mcp/authentication)
- [Cursor](/mcp/cursor) · [Claude](/mcp/claude) · [VS Code](/mcp/vscode)
- REST: [API reference](/api/)
- Issues: [heirlabs/apis](https://github.com/heirlabs/apis/issues)
