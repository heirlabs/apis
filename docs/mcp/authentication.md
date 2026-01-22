# MCP Authentication

All HEIR MCP tools require authentication using your API key. This guide shows you how to set up authentication for different MCP clients.

## Getting Your API Key

1. **Sign up** at [heir.es](https://heir.es) if you don't have an account
2. **Navigate** to Settings → Developer → API Keys in your dashboard
3. **Create** a new API key with MCP permissions
4. **Copy** your API key (format: `heir_pk_...`)

::: tip Free Tier Available
You can start using HEIR MCP tools immediately with our free tier (100 requests/hour).
:::

## Environment Variables

For local development and most MCP clients, set your API key as an environment variable:

### macOS/Linux
```bash
export HEIR_API_KEY="heir_pk_your_key_here"
```

### Windows
```cmd
set HEIR_API_KEY=heir_pk_your_key_here
```

### .env File
```bash
# .env
HEIR_API_KEY=heir_pk_your_key_here
```

## Client-Specific Setup

### Cursor IDE

**Method 1: Environment Variable (Recommended)**
```bash
export HEIR_API_KEY="heir_pk_your_key_here"
# Restart Cursor
```

**Method 2: MCP Config**
```json
{
  "mcpServers": {
    "heir": {
      "url": "https://mcp.heir.es",
      "headers": {
        "Authorization": "Bearer heir_pk_your_key_here"
      }
    }
  }
}
```

### VS Code

**Method 1: Settings**
1. Open Settings (`Cmd/Ctrl + ,`)
2. Search for "MCP"
3. Add HEIR_API_KEY to environment variables

**Method 2: Extension Config**
```json
{
  "mcp.servers": {
    "heir": {
      "url": "https://mcp.heir.es",
      "apiKey": "heir_pk_your_key_here"
    }
  }
}
```

### Claude Desktop

Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "heir": {
      "command": "npx",
      "args": ["-y", "@heir/mcp"],
      "env": {
        "HEIR_API_KEY": "heir_pk_your_key_here"
      }
    }
  }
}
```

**Config file locations:**
- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

### Other MCP Clients

For custom MCP implementations, include the API key in the Authorization header:

```javascript
headers: {
  'Authorization': 'Bearer heir_pk_your_key_here'
}
```

## Testing Authentication

Once configured, test your authentication by asking your AI assistant:

```
"List all jurisdictions supported by HEIR"
```

If authentication is working, you'll see a list of 195+ supported countries and jurisdictions.

## API Key Permissions

HEIR API keys support granular permissions. For MCP usage, ensure your key has:

-  **Jurisdictions**: Access legal research tools
-  **Contracts**: Generate smart contracts
-  **Documentation**: Search knowledge base
-  **Gas Estimates**: Calculate deployment costs

## Security Best Practices

###  Do
- Store API keys in environment variables
- Use separate keys for different environments
- Rotate keys regularly
- Monitor usage in your dashboard

### L Don't  
- Hardcode keys in source code
- Share keys in chat or email
- Commit keys to version control
- Use production keys in development

## Troubleshooting

### "Authentication failed" Error

1. **Check format**: API key should start with `heir_pk_`
2. **Verify permissions**: Key must have MCP permissions enabled
3. **Environment variables**: Restart your IDE after setting env vars
4. **Spelling**: Double-check `HEIR_API_KEY` spelling

### "Rate limit exceeded" Error

1. **Check tier**: Free tier is limited to 100 requests/hour
2. **Upgrade**: Consider upgrading to Pro (10,000 requests/hour)
3. **Usage**: Monitor usage in your dashboard at heir.es

### Config File Issues

**Claude Desktop:**
- Check file exists at the correct location
- Validate JSON syntax using [jsonlint.com](https://jsonlint.com)
- Restart Claude Desktop after changes

**Cursor/VS Code:**
- Clear extension cache
- Check console for error messages
- Verify MCP extension is enabled

## Rate Limits

| Tier | Rate Limit | Features |
|------|------------|----------|
| **Free** | 100 req/hour | All MCP tools |
| **Pro** | 10,000 req/hour | All MCP tools + priority support |
| **Enterprise** | Unlimited | All MCP tools + custom integration |

## Support

Need help with authentication?

- **Documentation**: Check our [troubleshooting guide](/guide/errors)
- **Community**: Ask in [Telegram](https://t.me/heir_es)
- **Email**: support@heir.es
- **Status**: Check [status.heir.es](https://status.heir.es)

## Next Steps

Once authentication is working:

1. [Explore available tools](/mcp/tools)
2. [Configure your IDE](/mcp/cursor)
3. Start building with AI assistance!