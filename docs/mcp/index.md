# Model Context Protocol Integration

Connect AI coding assistants directly to HEIR's estate planning tools through the Model Context Protocol (MCP).

## What is MCP?

The Model Context Protocol (MCP) is an open standard that enables AI assistants to securely connect to external services. HEIR's MCP server allows AI coding tools like Cursor, VS Code, and Claude Desktop to access our estate planning and legal intelligence capabilities.

## Quick Start

### For Cursor IDE

<div class="install-button">
  <a href="cursor://settings/extensions/heir-mcp" class="button primary">
    📲 Configure in Cursor
  </a>
</div>

Or manually add to `~/.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "heir": {
      "url": "https://mcp.heir.es"
    }
  }
}
```

### For VS Code

Install the MCP extension and then configure HEIR:

```json
{
  "mcp.servers": {
    "heir": {
      "url": "https://mcp.heir.es"
    }
  }
}
```

### For Claude Desktop

Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "heir": {
      "command": "npx",
      "args": ["-y", "@heir/mcp", "--tools=all"],
      "env": {
        "HEIR_API_KEY": "<<YOUR_API_KEY>>"
      }
    }
  }
}
```

## Available Tools

| Tool | Description | Use Case |
|------|-------------|----------|
| `get_jurisdiction` | Get legal system information for any country | Research inheritance laws |
| `list_jurisdictions` | List all supported legal jurisdictions | Explore global coverage |
| `generate_contract` | Generate inheritance smart contracts | Create blockchain wills |
| `estimate_gas` | Calculate deployment costs | Budget contract deployment |
| `search_heir_documentation` | Search HEIR knowledge base | Find answers about estate planning |

## Authentication

All MCP tools require authentication using your HEIR API key. [Get your API key here](https://app.heir.es/api-keys).

```bash
export HEIR_API_KEY="heir_pk_..."
```

## Example Usage

Once connected, you can ask your AI assistant questions like:

- *"What are the inheritance laws in Germany?"*
- *"Generate a smart contract for my crypto estate"*
- *"How much will it cost to deploy a contract on Ethereum?"*
- *"Show me estate planning options for Islamic law"*

The AI assistant will automatically use the appropriate HEIR tools to provide accurate, up-to-date information.

## Benefits

### For Developers
- **Seamless Integration**: No manual API calls or documentation lookup
- **Real-time Data**: Always current legal information and gas prices  
- **Multi-chain Support**: Ethereum, Polygon, Base, Avalanche, and Solana
- **Legal Intelligence**: 11 legal frameworks across 195+ jurisdictions

### For Legal Professionals
- **AI-Powered Research**: Instant access to global inheritance laws
- **Client Solutions**: Generate contracts and documents on demand
- **Compliance**: Up-to-date regulatory information
- **Efficiency**: Reduce manual research time by 90%

## Next Steps

1. [Set up authentication](/mcp/authentication)
2. [Explore available tools](/mcp/tools) 
3. [Configure your IDE](/mcp/cursor)

## Support

- **Documentation**: This site
- **Community**: [Telegram](https://t.me/heir_es)
- **Issues**: [GitHub](https://github.com/heirlabs/heir-mcp/issues)
- **Email**: support@heir.es

<style>
.install-button {
  margin: 1rem 0;
}

.button {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.2s ease;
  border: 2px solid transparent;
}

.button.primary {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: white;
}

.button.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(99, 102, 241, 0.3);
}
</style>