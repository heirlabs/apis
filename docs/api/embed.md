# Embed

Embed the HEIR wizard in your application.

## Overview

Partner and Internal tier API keys can embed the HEIR contract wizard directly into their applications, providing a white-label experience for their users.

## Wizard Iframe {#wizard}

Render the wizard in an iframe.

```http
GET /api/v1/embed/wizard
```

### Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `key` | string | Required | Your Partner or Internal API key |
| `theme` | string | `auto` | `light`, `dark`, or `auto` |
| `blockchain` | string | - | Pre-select: `evm`, `solana`, `ton` |
| `template` | string | - | Pre-select inheritance template |
| `steps` | string | - | Comma-separated wizard steps |
| `logo` | string | - | URL to your logo |
| `primaryColor` | string | - | Hex color without `#` |
| `hideHeader` | boolean | `false` | Hide HEIR header |
| `hideFooter` | boolean | `false` | Hide "Powered by HEIR" footer |
| `callback` | string | - | URL to POST results to |

### Example

```html
<iframe 
  src="https://api.heir.es/api/embed/wizard?key=heir_pt_xxx&theme=dark&primaryColor=6366f1"
  width="100%" 
  height="800"
  frameborder="0"
  allow="clipboard-write"
></iframe>
```

## JavaScript SDK {#sdk}

Use the SDK for more control over the embedded wizard.

```http
GET /api/v1/embed/sdk.js
```

### Usage

```html
<script src="https://api.heir.es/api/embed/sdk.js"></script>
<div id="heir-wizard-container"></div>

<script>
const wizard = new HeirWizard({
  apiKey: 'heir_pt_xxx...',
  container: '#heir-wizard-container',
  theme: 'dark',
  blockchain: 'evm',
  primaryColor: '6366f1',
  onComplete: (result) => {
    console.log('Contract generated:', result);
    // result contains: { contractCode, compiled, contractInfo }
  }
});

// Pre-fill data
wizard.setData({
  ownerAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f5bA2e',
  beneficiaries: [
    { name: 'Alice', percentage: 100 }
  ]
});
</script>
```

## PostMessage Events

The iframe communicates via `postMessage`. Listen for these events:

### Outgoing Events (from wizard)

| Event | Description | Payload |
|-------|-------------|---------|
| `heir:wizard:ready` | Wizard loaded | `{ version }` |
| `heir:wizard:step` | Step changed | `{ step, total }` |
| `heir:wizard:complete` | Contract generated | `{ contractCode, compiled, contractInfo }` |
| `heir:wizard:error` | Error occurred | `{ code, message }` |

### Incoming Events (to wizard)

| Event | Description | Payload |
|-------|-------------|---------|
| `heir:wizard:setData` | Pre-fill form data | Form data object |
| `heir:wizard:setTheme` | Change theme | `{ theme: 'dark' }` |
| `heir:wizard:reset` | Reset wizard | - |

### Example: Listening for Completion

```javascript
window.addEventListener('message', (event) => {
  if (event.data?.type === 'heir:wizard:complete') {
    const { contractCode, compiled, contractInfo } = event.data.payload;
    
    // Deploy the contract
    deployContract(compiled.abi, compiled.bytecode);
  }
});
```

## Styling

### Custom CSS Variables

When embedding, you can customize the look via URL parameters or CSS variables:

```html
<style>
  #heir-wizard-container iframe {
    --heir-primary: #6366f1;
    --heir-background: #0f172a;
    --heir-text: #f8fafc;
    --heir-border-radius: 12px;
  }
</style>
```

### Responsive Sizing

The iframe automatically adapts to its container. For best results:

```css
#heir-wizard-container {
  width: 100%;
  min-height: 600px;
  max-width: 800px;
  margin: 0 auto;
}
```

## Requirements

- **API Key Tier**: Partner or Internal
- **Required Scope**: `embed`
- **Allowed Origins**: Configure allowed domains in your API key settings

## Security

1. **Domain Whitelisting** - Only allow embedding on your domains
2. **Callback Validation** - Callback URLs must be HTTPS
3. **Key Rotation** - Rotate embed keys regularly
4. **CSP Headers** - Configure Content Security Policy appropriately

```html
<!-- Your page CSP -->
<meta http-equiv="Content-Security-Policy" 
      content="frame-src https://api.heir.es;">
```

