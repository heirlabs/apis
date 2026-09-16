# Model Context Protocol (MCP)

Connect AI assistants to HEIR via [`@morbidcorp/heir`](https://www.npmjs.com/package/@morbidcorp/heir).

## Package facts

| Field | Value |
|-------|--------|
| npm | `@morbidcorp/heir` |
| Working version | **2.0.5** (`bin` → `dist/cli.js`) |
| Default tools | Capability projection (`heir_capabilities_search`, `heir_capabilities_describe`, `heir_guide_get`, `heir_action_invoke`, `heir_record_*`); resource `heir://compliance` always listed |
| Legacy HTTP tools | **18** via `--tools=contracts,vaults,jurisdictions,legal,chat` |
| Also worked | **2.0.4** (`dist/cli.js`) |
| Broken versions | **2.0.1** (and earlier bin) `bin` pointed at monorepo-coupled `index.js` (crashes on `npx`) |
| Wrong name | `@heir/mcp` — **404** on npm |

## Install (2.0.5)

```bash
npx -y @morbidcorp/heir@2.0.5
# or
npm i -g @morbidcorp/heir@2.0.5
heir-mcp
```

2.0.4 also worked (`dist/cli.js`). 2.0.1 bin is broken.

## IDE config

```json
{
  "mcpServers": {
    "heir": {
      "command": "npx",
      "args": ["-y", "@morbidcorp/heir@2.0.5"],
      "env": {
        "HEIR_API_KEY": "heir_pk_..."
      }
    }
  }
}
```

Keys: [heir.es/developers/keys](https://heir.es/developers/keys). See [Product paths](/guide/product-paths).

Optional: `--tools=contracts,vaults,jurisdictions,legal,chat` and `--api-key=` on the CLI.

## Default vs legacy modules

Default (`--tools=all` or omitted): read-only capability projection:

- `heir_capabilities_search`
- `heir_capabilities_describe`
- `heir_guide_get`
- `heir_action_invoke` (dark unless desk-agent actions enabled)
- `heir_record_*`
- resource `heir://compliance` always listed

Legacy 18 HTTP tools: `--tools=contracts,vaults,jurisdictions,legal,chat`

## Tool categories (legacy 18)

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
