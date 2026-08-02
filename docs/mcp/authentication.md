# MCP Authentication

Use product developer API keys (`heir_pk_…`) with `@morbidcorp/heir@2.0.2+`.

## Get a key

1. [heir.es/developers](https://heir.es/developers)
2. Create key, copy once
3. Plan quotas: [API tiers](/pricing/api-tiers)

## Config

```json
{
  "mcpServers": {
    "heir": {
      "command": "npx",
      "args": ["-y", "@morbidcorp/heir@2.0.2"],
      "env": {
        "HEIR_API_KEY": "heir_pk_your_key_here"
      }
    }
  }
}
```

Also: `heir-mcp --api-key=heir_pk_...` or `HEIR_API_URL` for non-prod bases.

## Version notes

| Version | `npx @morbidcorp/heir` |
|---------|-------------------------|
| 2.0.2+ | Works (`bin` = `dist/cli.js`) |
| 2.0.1 | **Broken** monorepo `index.js` bin |
| `@heir/mcp` | Does not exist |

## Related

- [Tools](/mcp/tools)
- [Auth matrix](/guide/auth-matrix)
