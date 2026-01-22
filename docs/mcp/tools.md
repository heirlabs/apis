# MCP Tools Reference

Complete reference for all 100+ MCP tools available in the HEIR platform.

## Tool Categories

- **Legal & Compliance**: 20+ tools for jurisdiction analysis and legal compliance
- **Smart Contracts**: 15+ tools for multi-blockchain contract generation
- **Document Vault**: 10+ tools for secure document management
- **Actuarial & Analytics**: 12+ tools for AI-powered analysis
- **Professional Services**: 8+ tools for connecting with attorneys and CPAs
- **Blockchain Integration**: 18+ tools for wallet and transaction management
- **AI Agents**: 10+ tools for orchestrating AI agent swarms
- **Utilities**: 15+ helper tools for common operations

## Legal & Compliance Tools

### `get_jurisdiction`

Get detailed legal system information for any country or jurisdiction.

**Parameters:**
- `country` (string): Country code or name (e.g., "usa", "germany", "usa-california")

**Example Usage:**
```
AI Assistant: What are the inheritance laws in Germany?
� Calls get_jurisdiction("germany")
� Returns: German BGB inheritance law details, forced heirship rules, etc.
```

**Response:**
```json
{
  "jurisdiction": "germany",
  "legalSystem": "civil-law",
  "forcedHeirshipRules": {
    "spouse": 0.5,
    "children": 0.5,
    "parents": 0.25
  },
  "inheritanceTax": {
    "exempt_threshold_spouse": 500000,
    "exempt_threshold_children": 400000,
    "rates": [7, 11, 15, 19, 23, 27, 30]
  }
}
```

### `list_jurisdictions`

Get a complete list of all supported legal jurisdictions.

**Parameters:** None

**Example Usage:**
```
AI Assistant: Which countries does HEIR support?
� Calls list_jurisdictions()
� Returns: Array of 195+ supported jurisdictions
```

**Response:**
```json
[
  "usa", "usa-california", "usa-texas", "usa-new-york",
  "germany", "france", "united-kingdom", "canada",
  "australia", "japan", "singapore", "saudi-arabia",
  ...
]
```

## Smart Contract Tools

### `generate_contract`

Generate inheritance smart contracts based on user requirements.

**Parameters:**
- `formData` (object): Complete contract specification including:
  - `blockchain`: "evm" or "solana"
  - `network`: Target network name
  - `ownerAddress`: Wallet address of the estate owner
  - `assets`: Array of digital assets to include
  - `beneficiaries`: Array of inheritance recipients
  - `inheritanceTemplate`: Legal framework and rules
  - `deadMansSwitch`: Activation conditions

**Example Usage:**
```
AI Assistant: Create a smart contract for my Ethereum estate
� Calls generate_contract(formData)
� Returns: Solidity contract code, deployment instructions, gas estimate
```

### `estimate_gas`

Calculate deployment and execution costs for smart contracts.

**Parameters:**
- `blockchain`: "evm" or "solana"
- `network`: Network name (e.g., "ethereum", "polygon")
- `contractSize` (optional): Contract size in bytes

**Example Usage:**
```
AI Assistant: How much will it cost to deploy on Ethereum?
� Calls estimate_gas({blockchain: "evm", network: "ethereum"})
� Returns: Gas estimate and USD cost
```

**Response:**
```json
{
  "gasEstimate": 2500000,
  "gasPrice": 20000000000,
  "totalCostETH": "0.05",
  "totalCostUSD": 125.50,
  "networkFees": {
    "deployment": "0.035 ETH",
    "execution": "0.015 ETH"
  }
}
```

## Knowledge Base Tools

### `search_heir_documentation`

Search HEIR's comprehensive estate planning knowledge base.

**Parameters:**
- `query` (string): Search terms
- `category` (optional): Filter by category (legal, technical, tutorials)

**Example Usage:**
```
AI Assistant: How do I handle crypto assets in a will?
� Calls search_heir_documentation("crypto assets will")
� Returns: Relevant documentation and best practices
```

## Template Tools

### `list_templates`

Get available inheritance contract templates.

**Parameters:** None

**Example Usage:**
```
AI Assistant: What inheritance templates are available?
� Calls list_templates()
� Returns: Available legal frameworks and templates
```

**Response:**
```json
{
  "templates": [
    {
      "id": "common-law-basic",
      "name": "Common Law Basic Will",
      "jurisdiction": "usa",
      "features": ["simple_distribution", "residuary_clause"]
    },
    {
      "id": "islamic-compliant",
      "name": "Sharia-Compliant Inheritance",
      "jurisdiction": "global",
      "features": ["forced_heirship", "religious_compliance"]
    }
  ]
}
```

## Error Handling

All tools return structured responses with error handling:

```json
{
  "success": true,
  "data": { ... },
  "error": null
}
```

On error:
```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "JURISDICTION_NOT_FOUND",
    "message": "Jurisdiction 'xyz' not supported"
  }
}
```

## Rate Limits

MCP tools respect the same rate limits as the REST API:
- **Free Tier**: 100 requests/hour
- **Pro Tier**: 10,000 requests/hour  
- **Enterprise**: Unlimited

## Authentication

All tools require a valid HEIR API key. See the [Authentication](/mcp/authentication) guide for setup instructions.

## Tool Combinations

AI assistants can combine multiple tools for complex workflows:

1. **Research � Generate � Estimate**
   ```
   User: "Create an Islamic-compliant will for my UAE estate"
   AI: 
   1. get_jurisdiction("uae") � Research UAE laws
   2. generate_contract(...) � Create Sharia-compliant contract  
   3. estimate_gas(...) � Calculate deployment costs
   ```

2. **Explore � Compare � Recommend**
   ```
   User: "Compare inheritance taxes across Europe"
   AI:
   1. list_jurisdictions() � Get European countries
   2. get_jurisdiction() for each � Fetch tax rates
   3. analyze and present comparison
   ```

## Next Steps

- [Set up authentication](/mcp/authentication)
- [Configure Cursor IDE](/mcp/cursor)
- [Configure VS Code](/mcp/vscode)  
- [Configure Claude Desktop](/mcp/claude)