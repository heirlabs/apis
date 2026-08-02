# MCP Authentication

Use product developer API keys (`heir_pk_…`) with the working MCP entrypoint
`@morbidcorp/heir` → **`dist/cli.js`**.

## Get a key

1. Sign in at [heir.es](https://heir.es)
2. Open [Developers](https://heir.es/developers)
3. Create a key and copy it once

Plan quotas: [API tiers](/pricing/api-tiers).

## Pass the key

Preferred: environment variable in the MCP client config:

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

Also accepted by `dist/cli.js`:

```bash
node node_modules/@morbidcorp/heir/dist/cli.js --api-key=heir_pk_...
```

Optional: `HEIR_API_URL` or `--api-url=` (default `https://api.heir.es`).

## Working vs broken start commands

| Command | Result (2.0.1) |
|---------|----------------|
| `node node_modules/@morbidcorp/heir/dist/cli.js` | **Works** (stdio server) |
| `npx @morbidcorp/heir` / `heir-mcp` | **Fails** — `bin` points at legacy `index.js` |
| `npx @heir/mcp` | **Fails** — package does not exist |

Install the package in the project (or globally) so `node_modules/@morbidcorp/heir/dist/cli.js` resolves, or pass an absolute path to that file.

## Shell smoke test

```bash
npm i @morbidcorp/heir@2.0.1
export HEIR_API_KEY="heir_pk_..."
# Should log: HEIR MCP server running on stdio
node node_modules/@morbidcorp/heir/dist/cli.js
```

## Next

- [Tools](/mcp/tools)
- [Cursor](/mcp/cursor) · [Claude](/mcp/claude) · [VS Code](/mcp/vscode)
