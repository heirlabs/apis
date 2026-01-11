# Embedding the Wizard

Partner and Internal tier customers can embed the HEIR contract builder wizard directly in their applications. This allows you to offer inheritance contract creation with your own branding.

::: tip Tier Requirement
Embedding is available on **Partner** and **Internal** tiers only.
:::

## Quick Start

### Basic Iframe

The simplest way to embed the wizard:

```html
<iframe 
  src="https://api.heir.es/api/embed/wizard?key=heir_pt_xxx..."
  width="100%" 
  height="800"
  frameborder="0"
  allow="clipboard-write"
></iframe>
```

### Using the JavaScript SDK

For more control, use our JavaScript SDK:

```html
<div id="heir-wizard"></div>

<script src="https://api.heir.es/api/embed/sdk.js"></script>
<script>
  const wizard = new HeirWizard({
    apiKey: 'heir_pt_xxx...',
    container: '#heir-wizard',
    theme: 'dark',
    onReady: () => {
      console.log('Wizard loaded');
    },
    onComplete: (result) => {
      console.log('Contract generated:', result);
    },
    onError: (error) => {
      console.error('Error:', error);
    }
  });
</script>
```

## Customization Options

### URL Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `key` | string | **Required.** Your API key |
| `theme` | string | `light`, `dark`, or `auto` |
| `blockchain` | string | Pre-select: `evm`, `solana`, `ton` |
| `template` | string | Pre-select: `common-law`, `islamic-mirth`, etc. |
| `steps` | string | Comma-separated steps to include |
| `logo` | string | Custom logo URL |
| `primaryColor` | string | Brand color (hex without #) |
| `hideHeader` | boolean | Hide the header |
| `hideFooter` | boolean | Hide the "Powered by HEIR" footer |
| `callback` | string | URL to POST results to |

### Examples

**Dark theme with custom branding:**

```
https://api.heir.es/api/embed/wizard
  ?key=heir_pt_xxx
  &theme=dark
  &logo=https://your-company.com/logo.png
  &primaryColor=ff6600
```

**Pre-selected blockchain, minimal UI:**

```
https://api.heir.es/api/embed/wizard
  ?key=heir_pt_xxx
  &blockchain=evm
  &hideHeader=true
  &hideFooter=true
```

**Specific steps only:**

```
https://api.heir.es/api/embed/wizard
  ?key=heir_pt_xxx
  &steps=beneficiaries,review
```

## Communication with Parent Window

The embedded wizard communicates with your application via `postMessage`.

### Events from Wizard

```javascript
window.addEventListener('message', (event) => {
  // Verify origin
  if (event.origin !== 'https://api.heir.es') return;
  
  switch (event.data.type) {
    case 'heir:wizard:ready':
      // Wizard has loaded
      console.log('Wizard ready');
      break;
      
    case 'heir:wizard:complete':
      // User completed the wizard
      const { config, result } = event.data.data;
      console.log('Contract:', result.contractCode);
      console.log('Compiled:', result.compiled);
      break;
      
    case 'heir:wizard:error':
      // An error occurred
      console.error('Error:', event.data.error);
      break;
  }
});
```

### Sending Data to Wizard

Pre-populate wizard fields from your application:

```javascript
const iframe = document.querySelector('iframe');

// Set initial data
iframe.contentWindow.postMessage({
  type: 'heir:wizard:setData',
  data: {
    ownerAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f5bA2e',
    beneficiaries: [
      { name: 'Alice', address: '0xabc...', percentage: 60 },
      { name: 'Bob', address: '0xdef...', percentage: 40 }
    ]
  }
}, 'https://api.heir.es');
```

## Callback URL

Receive results via server-side callback:

```
https://api.heir.es/api/embed/wizard
  ?key=heir_pt_xxx
  &callback=https://your-app.com/api/heir-callback
```

When the user completes the wizard, HEIR will POST to your callback URL:

```json
{
  "config": {
    "blockchain": "evm",
    "ownerAddress": "0x...",
    "beneficiaries": [...],
    "inheritanceTemplate": "common-law"
  },
  "result": {
    "contractCode": "// SPDX-License-Identifier...",
    "compiled": { "abi": [...], "bytecode": "0x..." }
  }
}
```

The request includes a signature header for verification:

```http
X-HEIR-Signature: t=1705312800,v1=5d41402abc4b2a76b9719d911017c592...
```

## Styling

### Responsive Design

The wizard is responsive by default. Set the iframe to 100% width:

```css
.wizard-container {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
}

.wizard-container iframe {
  width: 100%;
  height: 800px;
  border: none;
  border-radius: 12px;
}
```

### Dark/Light Mode

Match your app's theme:

```javascript
// Detect user preference
const theme = window.matchMedia('(prefers-color-scheme: dark)').matches 
  ? 'dark' 
  : 'light';

const src = `https://api.heir.es/api/embed/wizard?key=heir_pt_xxx&theme=${theme}`;
```

Or use `theme=auto` to automatically match.

## Security

### Allowed Origins

By default, the wizard can be embedded from any origin. For additional security, configure allowed origins in your API key settings:

```bash
curl -X PATCH https://api.heir.es/api/v1/api-keys/key_id \
  -H "Authorization: Bearer heir_pt_xxx..." \
  -d '{
    "metadata": {
      "embedOrigins": ["https://your-app.com", "https://staging.your-app.com"]
    }
  }'
```

### Content Security Policy

If your site uses CSP, add HEIR to your frame-src:

```http
Content-Security-Policy: frame-src 'self' https://api.heir.es;
```

## Full Example

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Create Inheritance Contract</title>
  <style>
    body {
      font-family: -apple-system, sans-serif;
      max-width: 900px;
      margin: 0 auto;
      padding: 2rem;
    }
    
    h1 { margin-bottom: 1rem; }
    
    #wizard-container {
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
    }
    
    #result {
      display: none;
      margin-top: 2rem;
      padding: 1rem;
      background: #f0fdf4;
      border: 1px solid #86efac;
      border-radius: 8px;
    }
  </style>
</head>
<body>
  <h1>Create Your Inheritance Contract</h1>
  
  <div id="wizard-container"></div>
  
  <div id="result">
    <h2>✅ Contract Generated!</h2>
    <p>Your contract is ready. <button onclick="downloadContract()">Download</button></p>
  </div>
  
  <script src="https://api.heir.es/api/embed/sdk.js"></script>
  <script>
    let contractResult = null;
    
    const wizard = new HeirWizard({
      apiKey: 'heir_pt_xxx...',
      container: '#wizard-container',
      theme: 'dark',
      
      onReady: () => {
        console.log('Wizard loaded');
        
        // Pre-fill with user's connected wallet
        if (window.ethereum?.selectedAddress) {
          wizard.setData({
            ownerAddress: window.ethereum.selectedAddress
          });
        }
      },
      
      onComplete: (result) => {
        contractResult = result;
        document.getElementById('result').style.display = 'block';
        
        // Send to your backend
        fetch('/api/save-contract', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(result)
        });
      },
      
      onError: (error) => {
        alert('Error: ' + error.message);
      }
    });
    
    function downloadContract() {
      const blob = new Blob([contractResult.result.contractCode], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'InheritanceVault.sol';
      a.click();
    }
  </script>
</body>
</html>
```

