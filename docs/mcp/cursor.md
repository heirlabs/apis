# Cursor IDE Setup

Connect HEIR's estate planning tools to Cursor IDE through the Model Context Protocol.

## Quick Install

<div class="install-section">
  <div class="install-button">
    <a href="cursor://anysphere.cursor-deeplink/mcp/install?name=heir&config=eyJ1cmwiOiJodHRwczovL21jcC5oZWlyLmVzIiwiYXBpS2V5IjoiaGVpcl9wa19fX1lPVVJfS0VZX0hFUkVfXyJ9" class="button primary large">
      📲 One-Click Install in Cursor
    </a>
  </div>
  <p class="install-note">
    This will add HEIR to your MCP servers and prompt for your API key.
  </p>
</div>

## Manual Setup

### Step 1: Get Your API Key

1. Sign up at [app.heir.es](https://app.heir.es)
2. Go to [API Keys](https://app.heir.es/api-keys)
3. Create a new key and copy it

### Step 2: Configure MCP

Open your Cursor MCP configuration file:

**macOS**: `~/.cursor/mcp.json`  
**Windows**: `%APPDATA%\Cursor\mcp.json`

Add HEIR to your `mcpServers`:

```json
{
  "mcpServers": {
    "heir": {
      "url": "https://mcp.heir.es",
      "apiKey": "heir_pk_your_key_here"
    }
  }
}
```

### Step 3: Set Environment Variable

For better security, use an environment variable instead of hardcoding your API key:

**macOS/Linux:**
```bash
export HEIR_API_KEY="heir_pk_your_key_here"
```

**Windows:**
```cmd
set HEIR_API_KEY=heir_pk_your_key_here
```

Then update your config to:
```json
{
  "mcpServers": {
    "heir": {
      "url": "https://mcp.heir.es"
    }
  }
}
```

### Step 4: Restart Cursor

Close and restart Cursor for the changes to take effect.

## Testing the Connection

Once configured, test the integration by asking Cursor:

```
"What are the inheritance laws in Germany?"
```

If working correctly, Cursor will:
1. Automatically call the HEIR jurisdiction API
2. Return detailed German inheritance law information
3. Explain forced heirship rules and tax thresholds

## Available Commands

With HEIR MCP connected, you can ask Cursor questions like:

### Legal Research
- *"What are the inheritance laws in [country]?"*
- *"List all supported jurisdictions"*
- *"Compare estate planning in USA vs Germany"*

### Smart Contracts
- *"Generate an Ethereum inheritance contract"*
- *"Create a Solana will for my crypto assets"*
- *"What networks does HEIR support?"*

### Cost Estimation
- *"How much does it cost to deploy on Ethereum?"*
- *"Compare gas costs across different networks"*
- *"Estimate deployment costs for Polygon"*

### Documentation
- *"How do I handle NFTs in a will?"*
- *"Search HEIR docs for Islamic inheritance"*
- *"Show me estate planning best practices"*

## Advanced Configuration

### Custom Timeout
```json
{
  "mcpServers": {
    "heir": {
      "url": "https://mcp.heir.es",
      "timeout": 30000
    }
  }
}
```

### Proxy Settings
```json
{
  "mcpServers": {
    "heir": {
      "url": "https://mcp.heir.es",
      "proxy": "http://proxy.company.com:8080"
    }
  }
}
```

### Custom Headers
```json
{
  "mcpServers": {
    "heir": {
      "url": "https://mcp.heir.es",
      "headers": {
        "User-Agent": "MyApp/1.0",
        "Authorization": "Bearer heir_pk_your_key_here"
      }
    }
  }
}
```

## Troubleshooting

### Connection Issues

**Problem**: "Cannot connect to HEIR MCP server"
```bash
# Check if config file exists
ls ~/.cursor/mcp.json

# Validate JSON syntax
cat ~/.cursor/mcp.json | python -m json.tool
```

**Problem**: "Authentication failed"
```bash
# Check API key format (should start with heir_pk_)
echo $HEIR_API_KEY

# Test API key directly
curl -H "Authorization: Bearer $HEIR_API_KEY" https://api.heir.es/api/jurisdictions
```

### Performance Issues

**Problem**: Slow responses
- Increase timeout in configuration
- Check your internet connection
- Verify you're not hitting rate limits

**Problem**: Rate limit errors  
- Upgrade to Pro tier (10,000 req/hour)
- Monitor usage in [dashboard](https://app.heir.es/api-keys)

### Debug Mode

Enable debug logging by setting environment variable:
```bash
export CURSOR_MCP_DEBUG=true
```

Check Cursor's developer console (`Cmd/Ctrl + Shift + I`) for MCP logs.

## Example Workflows

### 1. Estate Planning Research
```
User: "I need to create a will for assets in California"

Cursor with HEIR MCP:
1. Calls get_jurisdiction("usa-california")
2. Shows California Probate Code details
3. Explains community property rules
4. Suggests appropriate contract templates
```

### 2. Cross-Border Estate Planning
```
User: "Compare inheritance taxes in USA, UK, and Germany"

Cursor with HEIR MCP:
1. Calls get_jurisdiction() for each country
2. Extracts tax rate information
3. Creates comparison table
4. Highlights key differences and planning opportunities
```

### 3. Smart Contract Development
```
User: "Create a smart contract for my Ethereum estate"

Cursor with HEIR MCP:
1. Asks for asset details and beneficiaries
2. Calls generate_contract() with specifications
3. Returns Solidity code
4. Calls estimate_gas() for deployment costs
5. Provides deployment instructions
```

## Integration with Other Tools

HEIR MCP works alongside other Cursor integrations:

- **GitHub Copilot**: For general code assistance
- **Codeium**: For code completion
- **HEIR MCP**: For estate planning intelligence

## Best Practices

### Security
- ✅ Use environment variables for API keys
- ✅ Rotate API keys regularly
- ✅ Monitor usage dashboards
- ❌ Don't hardcode keys in config files

### Performance
- ✅ Cache jurisdiction data locally when possible
- ✅ Use specific queries instead of broad searches
- ✅ Monitor rate limits in dashboard

### Development
- ✅ Test with free tier before upgrading
- ✅ Use staging keys for development
- ✅ Set appropriate timeouts for your network

## Support

Need help with Cursor integration?

- **Cursor Documentation**: [cursor.sh/docs](https://cursor.sh/docs)
- **HEIR Support**: support@heir.es
- **Community**: [Telegram](https://t.me/heir_es)
- **Issues**: [GitHub](https://github.com/heirlabs/heir-mcp/issues)

## Next Steps

1. [Explore available tools](/mcp/tools)
2. [Set up authentication](/mcp/authentication)
3. [Try VS Code setup](/mcp/vscode)
4. [Configure Claude Desktop](/mcp/claude)

<style>
.install-section {
  text-align: center;
  margin: 2rem 0;
  padding: 2rem;
  border: 2px solid var(--vp-c-brand-1);
  border-radius: 12px;
  background: linear-gradient(135deg, var(--vp-c-bg-alt) 0%, var(--vp-c-bg-soft) 100%);
}

.install-button {
  margin: 1rem 0;
}

.button {
  display: inline-block;
  padding: 0.75rem 2rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  font-size: 1.1rem;
  transition: all 0.2s ease;
  border: 2px solid transparent;
}

.button.large {
  padding: 1rem 2.5rem;
  font-size: 1.2rem;
}

.button.primary {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: white;
}

.button.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(99, 102, 241, 0.3);
}

.install-note {
  color: var(--vp-c-text-2);
  font-size: 0.9rem;
  margin: 0.5rem 0 0 0;
}
</style>