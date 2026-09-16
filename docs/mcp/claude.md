# Claude Desktop setup

## Prerequisites

1. [Claude Desktop](https://claude.ai/desktop)
2. Node.js 18+
3. API key from [heir.es/developers/keys](https://heir.es/developers/keys)

## Config

`claude_desktop_config.json`:

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

Restart Claude Desktop.

## Verify

Ask Claude to call `heir_capabilities_search` (default) or, with `--tools=contracts,vaults,jurisdictions,legal,chat`, `heir_jurisdiction_list` (18 HTTP tools).

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| multiReligionDistributor / MODULE_NOT_FOUND | Pin `@morbidcorp/heir@2.0.5` (not 2.0.1). 2.0.4 also worked (`dist/cli.js`). |
| `@heir/mcp` not found | Use `@morbidcorp/heir` |
| 401 on legal/vault tools | Key must map to a user with scopes; those tools need `--tools=contracts,vaults,jurisdictions,legal,chat` |

## Support

- [Authentication](/mcp/authentication)
- [Tools](/mcp/tools)
- [Issues](https://github.com/heirlabs/apis/issues)
