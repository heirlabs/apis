# Claude Desktop setup

## Prerequisites

1. [Claude Desktop](https://claude.ai/desktop)
2. Node.js 18+
3. API key from [heir.es/developers](https://heir.es/developers)
4. Package installed where Claude can resolve the path:

```bash
cd ~/heir-mcp-host   # any directory you control
npm init -y
npm i @morbidcorp/heir@2.0.1
```

## Config

`claude_desktop_config.json`:

- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "heir": {
      "command": "node",
      "args": [
        "/ABSOLUTE/PATH/TO/heir-mcp-host/node_modules/@morbidcorp/heir/dist/cli.js"
      ],
      "env": {
        "HEIR_API_KEY": "heir_pk_your_key_here"
      }
    }
  }
}
```

Use an **absolute** path to `dist/cli.js`. Do not set `args` to
`["-y", "@morbidcorp/heir"]` — the package bin is broken on 2.0.1.

Restart Claude Desktop after saving.

## Verify

Ask: “List HEIR MCP tools you can call” or invoke `heir_jurisdiction_list`.

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| Module not found / multiReligionDistributor | You are on legacy `index.js` — switch to `dist/cli.js` |
| Package `@heir/mcp` not found | Use `@morbidcorp/heir` |
| No tools | Wrong path; confirm file exists and Claude restarted |
| API errors | Set `HEIR_API_KEY` |

## Support

- [Authentication](/mcp/authentication)
- [Tools](/mcp/tools)
- [Issues](https://github.com/heirlabs/apis/issues)
