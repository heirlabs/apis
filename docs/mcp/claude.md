# Claude Desktop setup

## Prerequisites

1. [Claude Desktop](https://claude.ai/desktop)
2. Node.js 18+
3. API key from [heir.es/developers](https://heir.es/developers)

## Config

`claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "heir": {
      "command": "npx",
      "args": ["-y", "@morbidcorp/heir@2.0.3"],
      "env": {
        "HEIR_API_KEY": "heir_pk_your_key_here"
      }
    }
  }
}
```

Restart Claude Desktop.

## Verify

Ask Claude to call `heir_jurisdiction_list` or list available HEIR tools (18).

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| multiReligionDistributor / MODULE_NOT_FOUND | Pin `@morbidcorp/heir@2.0.3` (not 2.0.1) |
| `@heir/mcp` not found | Use `@morbidcorp/heir` |
| 401 on legal/vault tools | Key must map to a user with scopes |

## Support

- [Authentication](/mcp/authentication)
- [Tools](/mcp/tools)
- [Issues](https://github.com/heirlabs/apis/issues)
