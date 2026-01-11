# Examples

Learn by example with complete, runnable code samples.

## Quick Examples

### Generate a Simple Contract

```javascript
const response = await fetch('https://api.heir.es/api/v1/contracts/generate', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer heir_pk_xxx...',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    blockchain: 'evm',
    ownerAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f5bA2e',
    beneficiaries: [
      { name: 'Alice', address: '0xabc...', percentage: 100 }
    ]
  })
});

const { contractCode, compiled } = await response.json();
console.log('Contract generated!');
```

### Set Up a Webhook

```javascript
const webhook = await fetch('https://api.heir.es/api/v1/webhooks/subscriptions', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer heir_pt_xxx...',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    url: 'https://your-app.com/webhooks/heir',
    events: ['contract.deployed', 'deadman.triggered']
  })
});

const { data, meta } = await webhook.json();
console.log('Webhook secret:', meta.secret); // Save this!
```

### Embed the Wizard

```html
<iframe 
  src="https://api.heir.es/api/embed/wizard?key=heir_pt_xxx&theme=dark"
  width="100%" 
  height="800"
/>
```

## Full Tutorials

- [Generate Contract](/examples/generate-contract) - Step-by-step contract generation
- [Embed Wizard](/examples/embed-wizard) - White-label the wizard in your app
- [Webhook Integration](/examples/webhook-integration) - Set up real-time notifications
- [Full Application](/examples/full-application) - Complete inheritance management app

## Sample Projects

| Project | Description | Link |
|---------|-------------|------|
| heir-nextjs-starter | Next.js app with contract generation | [GitHub](https://github.com/heirlabs/heir-nextjs-starter) |
| heir-react-widget | Embeddable React component | [GitHub](https://github.com/heirlabs/heir-react-widget) |
| heir-webhook-handler | Express webhook handler | [GitHub](https://github.com/heirlabs/heir-webhook-handler) |

