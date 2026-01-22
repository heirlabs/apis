# Claude Desktop Setup

Connect HEIR's estate planning tools to Claude Desktop through the Model Context Protocol.

## Prerequisites

1. **Claude Desktop App**: Download from [claude.ai/desktop](https://claude.ai/desktop)
2. **HEIR API Key**: Get yours at [app.heir.es/api-keys](https://app.heir.es/api-keys)
3. **Node.js**: Required for the HEIR MCP package (Download from [nodejs.org](https://nodejs.org))

## Quick Setup

### Step 1: Locate Config File

Find your Claude Desktop configuration file:

- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

### Step 2: Add HEIR MCP Server

Add the following to your config file:

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

### Step 3: Restart Claude Desktop

Close and reopen Claude Desktop to load the new configuration.

## Configuration Options

### Basic Configuration
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

### With Custom Tools
```json
{
  "mcpServers": {
    "heir": {
      "command": "npx",
      "args": ["-y", "@heir/mcp", "--tools=jurisdictions,contracts"],
      "env": {
        "HEIR_API_KEY": "heir_pk_your_key_here"
      }
    }
  }
}
```

### Multiple API Keys (Development)
```json
{
  "mcpServers": {
    "heir-dev": {
      "command": "npx",
      "args": ["-y", "@heir/mcp", "--env=development"],
      "env": {
        "HEIR_API_KEY": "heir_pk_test_your_dev_key"
      }
    },
    "heir-prod": {
      "command": "npx",
      "args": ["-y", "@heir/mcp", "--env=production"],
      "env": {
        "HEIR_API_KEY": "heir_pk_live_your_prod_key"
      }
    }
  }
}
```

## Environment Variables

For better security, use system environment variables:

### macOS/Linux
```bash
# Add to ~/.bashrc or ~/.zshrc
export HEIR_API_KEY="heir_pk_your_key_here"
```

### Windows
```cmd
# Set system environment variable
setx HEIR_API_KEY "heir_pk_your_key_here"
```

Then use in config:
```json
{
  "mcpServers": {
    "heir": {
      "command": "npx",
      "args": ["-y", "@heir/mcp"]
    }
  }
}
```

## Testing the Integration

Once configured, test by asking Claude:

### Legal Research
```
What are the inheritance laws in Switzerland?
```

### Smart Contract Generation
```
Generate an Ethereum inheritance smart contract for a family with two children, specifying equal distribution and a 6-month lockup period.
```

### Cost Estimation
```
How much would it cost to deploy an inheritance contract on Polygon vs Ethereum?
```

### Documentation Search
```
How should I handle NFTs in a digital estate plan?
```

## Available Tools

When HEIR MCP is connected, Claude gains access to:

| Tool | Description | Example Query |
|------|-------------|---------------|
| **get_jurisdiction** | Legal system details | "What are Germany's forced heirship rules?" |
| **list_jurisdictions** | All supported countries | "Which countries does HEIR support?" |
| **generate_contract** | Smart contract creation | "Create a Solana will contract" |
| **estimate_gas** | Deployment cost calculation | "Gas costs for Ethereum deployment?" |
| **search_heir_documentation** | Knowledge base search | "Best practices for crypto wills" |

## Advanced Configuration

### Custom Timeout
```json
{
  "mcpServers": {
    "heir": {
      "command": "npx",
      "args": ["-y", "@heir/mcp", "--timeout=60000"],
      "env": {
        "HEIR_API_KEY": "heir_pk_your_key_here"
      }
    }
  }
}
```

### Proxy Settings
```json
{
  "mcpServers": {
    "heir": {
      "command": "npx",
      "args": ["-y", "@heir/mcp"],
      "env": {
        "HEIR_API_KEY": "heir_pk_your_key_here",
        "HTTP_PROXY": "http://proxy.company.com:8080",
        "HTTPS_PROXY": "http://proxy.company.com:8080"
      }
    }
  }
}
```

### Debug Mode
```json
{
  "mcpServers": {
    "heir": {
      "command": "npx",
      "args": ["-y", "@heir/mcp", "--debug"],
      "env": {
        "HEIR_API_KEY": "heir_pk_your_key_here",
        "DEBUG": "heir:*"
      }
    }
  }
}
```

## Example Conversations

### Estate Planning Consultation

**You**: "I'm a US citizen living in Germany with assets in both countries. How should I structure my estate plan?"

**Claude with HEIR**: 
> Let me research the relevant jurisdictions for you.
> 
> *[Automatically calls get_jurisdiction("usa") and get_jurisdiction("germany")]*
> 
> Based on US and German inheritance laws, here's what you need to consider:
> 
> **US Considerations:**
> - Federal estate tax exemption: $12.92M (2023)
> - State taxes vary by state of residence/assets
> - No forced heirship rules
> 
> **German Considerations:**
> - Forced heirship applies (Pflichtteil)
> - Inheritance tax depends on relationship to deceased
> - Double taxation treaty exists with US
> 
> I recommend creating separate wills for each jurisdiction...

### Smart Contract Development

**You**: "Create a smart contract for my Ethereum estate with the following requirements:
- 3 beneficiaries: spouse (50%), child1 (25%), child2 (25%)
- 12-month lockup period
- Oracle-based dead man's switch"

**Claude with HEIR**:
> I'll generate an Ethereum inheritance smart contract for you.
> 
> *[Automatically calls generate_contract() with your specifications]*
> 
> Here's your custom inheritance smart contract:
> 
> ```solidity
> pragma solidity ^0.8.0;
> 
> contract FamilyInheritanceContract {
>     address public owner;
>     uint256 public lockupPeriod = 365 days;
>     
>     struct Beneficiary {
>         address addr;
>         uint256 percentage;
>         bool claimed;
>     }
>     
>     // ... [complete generated contract code]
> }
> ```
> 
> *[Also calls estimate_gas() for deployment costs]*
> 
> **Deployment Costs:**
> - Gas estimate: ~2.5M gas
> - Current cost: ~$45 USD (at 20 gwei)

## Troubleshooting

### Config File Issues

**Problem**: "HEIR MCP server not found"

1. **Check config file location**:
   ```bash
   # macOS
   ls -la ~/Library/Application\ Support/Claude/
   
   # Windows
   dir "%APPDATA%\Claude\"
   ```

2. **Validate JSON syntax**:
   ```bash
   # Use a JSON validator
   cat claude_desktop_config.json | python -m json.tool
   ```

3. **Check file permissions**:
   ```bash
   # Ensure Claude can read the file
   chmod 644 claude_desktop_config.json
   ```

### NPM/Node.js Issues

**Problem**: "npx command not found"

```bash
# Install Node.js from nodejs.org, then verify:
node --version
npm --version
npx --version
```

**Problem**: "Package @heir/mcp not found"

```bash
# Test NPM connectivity
npm ping

# Clear NPM cache
npm cache clean --force

# Try manual installation
npm install -g @heir/mcp
```

### Authentication Problems

**Problem**: "Invalid API key"

1. **Check key format**:
   ```bash
   echo $HEIR_API_KEY
   # Should start with: heir_pk_
   ```

2. **Test key directly**:
   ```bash
   curl -H "Authorization: Bearer $HEIR_API_KEY" \
        https://api.heir.es/api/jurisdictions
   ```

3. **Verify permissions** in [HEIR Dashboard](https://app.heir.es/api-keys)

### Debug Mode

Enable detailed logging:

```json
{
  "mcpServers": {
    "heir": {
      "command": "npx",
      "args": ["-y", "@heir/mcp", "--verbose"],
      "env": {
        "HEIR_API_KEY": "heir_pk_your_key_here",
        "DEBUG": "*"
      }
    }
  }
}
```

Check Claude Desktop logs:
- **macOS**: `~/Library/Logs/Claude/`
- **Windows**: `%LOCALAPPDATA%\Claude\logs\`

## Best Practices

### Security
- ✅ Use environment variables for API keys
- ✅ Use separate keys for development/production  
- ✅ Rotate keys regularly
- ❌ Don't commit config files with keys to version control

### Performance
- ✅ Use specific tool subsets if you don't need all tools
- ✅ Monitor rate limits in HEIR dashboard
- ✅ Cache common jurisdiction data locally

### Development
- ✅ Use development API keys for testing
- ✅ Enable debug mode during setup
- ✅ Test with simple queries first

## Updates

Keep the HEIR MCP package updated:

```bash
# Update to latest version
npx @heir/mcp@latest --version

# Or install globally
npm install -g @heir/mcp@latest
```

## Support

Need help with Claude Desktop integration?

- **Claude Help**: [support.claude.ai](https://support.claude.ai)
- **HEIR Support**: support@heir.es
- **Community**: [Telegram](https://t.me/heir_es)
- **Package Issues**: [GitHub](https://github.com/heirlabs/heir-mcp/issues)

## Next Steps

1. [Explore available tools](/mcp/tools)
2. [Learn about authentication](/mcp/authentication) 
3. [Try Cursor setup](/mcp/cursor)
4. [Try VS Code setup](/mcp/vscode)