# Embed the Wizard

White-label the HEIR contract builder in your application.

## Overview

Partner and Internal tier API keys can embed the full HEIR wizard experience directly in their applications, providing a seamless inheritance planning tool for their users.

## Prerequisites

- A **Partner** or **Internal** tier API key
- The `embed` scope enabled on your key
- An HTTPS-enabled website

## Basic Embedding

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

## Customization Options

Customize the wizard appearance and behavior via URL parameters:

### Theme

```html
<!-- Dark theme -->
<iframe src="https://api.heir.es/api/embed/wizard?key=...&theme=dark"></iframe>

<!-- Light theme -->
<iframe src="https://api.heir.es/api/embed/wizard?key=...&theme=light"></iframe>

<!-- Auto (follows system preference) -->
<iframe src="https://api.heir.es/api/embed/wizard?key=...&theme=auto"></iframe>
```

### Branding

```html
<iframe src="https://api.heir.es/api/embed/wizard?key=...&logo=https://your-site.com/logo.png&primaryColor=6366f1&hideFooter=true"></iframe>
```

| Parameter | Description |
|-----------|-------------|
| `logo` | URL to your logo (displayed in header) |
| `primaryColor` | Hex color without `#` |
| `hideHeader` | Set to `true` to hide HEIR header |
| `hideFooter` | Set to `true` to hide "Powered by HEIR" |

### Pre-filling

```html
<iframe src="https://api.heir.es/api/embed/wizard?key=...&blockchain=evm&template=common-law"></iframe>
```

| Parameter | Description |
|-----------|-------------|
| `blockchain` | Pre-select: `evm`, `solana`, `ton` |
| `template` | Pre-select inheritance template |
| `steps` | Comma-separated steps to show |

## Using the JavaScript SDK

For more control, use the JavaScript SDK:

```html
<!DOCTYPE html>
<html>
<head>
  <title>Create Your Inheritance Plan</title>
  <style>
    #wizard-container {
      width: 100%;
      max-width: 800px;
      height: 800px;
      margin: 0 auto;
    }
  </style>
</head>
<body>
  <h1>Secure Your Digital Assets</h1>
  
  <div id="wizard-container"></div>
  
  <script src="https://api.heir.es/api/embed/sdk.js"></script>
  <script>
    const wizard = new HeirWizard({
      apiKey: 'heir_pt_xxx...',
      container: '#wizard-container',
      theme: 'dark',
      primaryColor: '6366f1',
      hideFooter: true,
      onComplete: (result) => {
        console.log('Contract generated!', result);
        // Save to your backend
        saveContract(result);
      }
    });
  </script>
</body>
</html>
```

## Handling Events

Listen for wizard events via `postMessage`:

```javascript
window.addEventListener('message', (event) => {
  // Verify origin in production!
  // if (event.origin !== 'https://api.heir.es') return;
  
  const { type, payload } = event.data || {};
  
  switch (type) {
    case 'heir:wizard:ready':
      console.log('Wizard loaded');
      break;
      
    case 'heir:wizard:step':
      console.log(`Step ${payload.step} of ${payload.total}`);
      updateProgressBar(payload.step, payload.total);
      break;
      
    case 'heir:wizard:complete':
      console.log('Contract generated:', payload);
      handleContractGenerated(payload);
      break;
      
    case 'heir:wizard:error':
      console.error('Wizard error:', payload);
      showErrorMessage(payload.message);
      break;
  }
});
```

## Pre-filling User Data

Send data to the wizard to pre-fill forms:

```javascript
const iframe = document.querySelector('iframe');

// Wait for wizard to be ready
window.addEventListener('message', (event) => {
  if (event.data?.type === 'heir:wizard:ready') {
    // Pre-fill owner address from connected wallet
    iframe.contentWindow.postMessage({
      type: 'heir:wizard:setData',
      payload: {
        ownerAddress: userWalletAddress,
        beneficiaries: [
          {
            name: 'Primary Beneficiary',
            address: '',
            percentage: 100
          }
        ]
      }
    }, '*');
  }
});
```

## Callback URL

Automatically send results to your server:

```html
<iframe src="https://api.heir.es/api/embed/wizard?key=...&callback=https://your-api.com/contracts/created"></iframe>
```

Your endpoint will receive a POST request with:

```json
{
  "event": "heir:wizard:complete",
  "contractCode": "// SPDX-License-Identifier...",
  "compiled": {
    "abi": [...],
    "bytecode": "0x..."
  },
  "contractInfo": {...},
  "apiKeyOwnerId": "user_abc123"
}
```

## Full Integration Example

Complete example with React:

```jsx
import { useEffect, useRef, useState } from 'react';

function HeirWizardEmbed({ apiKey, onComplete }) {
  const containerRef = useRef(null);
  const [isReady, setIsReady] = useState(false);
  
  useEffect(() => {
    const handleMessage = (event) => {
      const { type, payload } = event.data || {};
      
      if (type === 'heir:wizard:ready') {
        setIsReady(true);
      }
      
      if (type === 'heir:wizard:complete') {
        onComplete?.(payload);
      }
    };
    
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onComplete]);
  
  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      {!isReady && (
        <div style={{ 
          position: 'absolute', 
          inset: 0, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center' 
        }}>
          Loading...
        </div>
      )}
      <iframe
        src={`https://api.heir.es/api/embed/wizard?key=${apiKey}&theme=dark`}
        style={{ width: '100%', height: '800px', border: 'none' }}
        allow="clipboard-write"
      />
    </div>
  );
}

// Usage
function App() {
  const handleComplete = (result) => {
    console.log('Contract ready:', result);
    // Deploy, save, or process the contract
  };
  
  return (
    <HeirWizardEmbed 
      apiKey="heir_pt_xxx..." 
      onComplete={handleComplete}
    />
  );
}
```

## Security Considerations

1. **Domain Whitelisting**: Configure allowed domains in your API key settings
2. **HTTPS Only**: The wizard only loads on HTTPS pages
3. **CSP Headers**: Add appropriate Content-Security-Policy headers:

```http
Content-Security-Policy: frame-src https://api.heir.es;
```

4. **Origin Verification**: Always verify `event.origin` in production:

```javascript
window.addEventListener('message', (event) => {
  if (event.origin !== 'https://api.heir.es') return;
  // Process event...
});
```

## Next Steps

- Set up [webhooks](/examples/webhook-integration) for deployment notifications
- Review the [Embed API reference](/api/embed)
- Check [SDK documentation](/sdks/javascript) for TypeScript types

