# Model Context Protocol (MCP)

Connect AI assistants to HEIR via [`@morbidcorp/heir`](https://www.npmjs.com/package/@morbidcorp/heir).

## Package facts

| Field | Value |
|-------|--------|
| npm | `@morbidcorp/heir` |
| Working version | **2.0.4** (`bin` → `dist/cli.js`) |
| Tools | **18** — contracts, estates, jurisdictions, legal, chat |
| Broken versions | **2.0.1** (and earlier bin) `bin` pointed at monorepo-coupled `index.js` (crashes on `npx`) |
| Wrong name | `@heir/mcp` — **404** on npm |

## Install (2.0.4+)

```bash
npx -y @morbidcorp/heir@2.0.4
# or
npm i -g @morbidcorp/heir@2.0.4
heir-mcp
```

## IDE config

```json
{
  "mcpServers": {
    "heir": {
      "command": "npx",
      "args": ["-y", "@morbidcorp/heir@2.0.4"],
      "env": {
        "HEIR_API_KEY": "heir_pk_..."
      }
    }
  }
}
```

Keys: [heir.es/developers](https://heir.es/developers).

Optional: `--tools=contracts,legal` and `--api-key=` on the CLI.

## Tool categories

| Category | Prefix | Count | HTTP |
|----------|--------|------:|------|
| Contracts | `heir_contract_*` | 3 | `/api/v1/contracts/*` |
| Estates | `heir_vault_*` | 4 | `/api/v1/user/estates` |
| Jurisdictions | `heir_jurisdiction_*` | 4 | `/api/v1/jurisdictions` |
| Legal | `heir_legal_*` | 4 | `/api/v1/legal/generate`, `/types/:j` |
| Chat | `heir_chat_*` | 3 | `/api/v1/chat` |

Schemas: [Available Tools](/mcp/tools).

## Related

- [Authentication](/mcp/authentication)
- [Cursor](/mcp/cursor) · [Claude](/mcp/claude) · [VS Code](/mcp/vscode)
- [Auth matrix](/guide/auth-matrix) · [Platform spine](/guide/platform-spine)
- Issues: [heirlabs/apis](https://github.com/heirlabs/apis/issues)
