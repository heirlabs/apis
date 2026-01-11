# Security Best Practices

Secure your integration with the HEIR API.

## API Key Security

### Never Expose Keys

```javascript
// ❌ Bad - key in client-side code
const client = new HeirClient('heir_pk_xxx...'); // Exposed!

// ✅ Good - key on server only
// Client calls your backend, which calls HEIR API
```

### Use Environment Variables

```bash
# .env
HEIR_API_KEY=heir_pk_xxx...
```

```javascript
// server.js
const client = new HeirClient(process.env.HEIR_API_KEY);
```

### Rotate Keys Regularly

Recommended rotation schedule:
- **Production keys**: Every 90 days
- **Development keys**: Every 30 days
- **After any incident**: Immediately

### Use IP Whitelisting

Restrict keys to known IP addresses:

```bash
curl -X PUT https://api.heir.es/api/v1/api-keys/KEY_ID \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"ip_whitelist": ["203.0.113.10"]}'
```

## Webhook Security

### Verify Signatures

Always verify the `X-Webhook-Signature` header:

```javascript
const crypto = require('crypto');

function verifyWebhook(payload, signature, secret) {
  const expected = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
  
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expected)
  );
}
```

### Use HTTPS Only

Webhook URLs must use HTTPS. HTTP URLs will be rejected.

### Validate Event Types

Only process expected event types:

```javascript
const ALLOWED_EVENTS = [
  'contract.deployed',
  'deadman.triggered'
];

if (!ALLOWED_EVENTS.includes(event.type)) {
  return res.status(400).send('Unknown event');
}
```

## Secure Communication

### TLS/HTTPS

All API requests must use HTTPS. HTTP requests will be rejected.

### Certificate Pinning (Optional)

For high-security applications, pin the HEIR API certificate:

```javascript
const https = require('https');
const tls = require('tls');

const agent = new https.Agent({
  checkServerIdentity: (host, cert) => {
    // Verify certificate fingerprint
    const fingerprint = cert.fingerprint256;
    if (fingerprint !== 'EXPECTED_FINGERPRINT') {
      throw new Error('Certificate mismatch');
    }
  }
});
```

## Rate Limiting

### Implement Client-Side Limits

Don't rely solely on API rate limits:

```javascript
const Bottleneck = require('bottleneck');

const limiter = new Bottleneck({
  minTime: 100, // 10 requests per second max
  maxConcurrent: 5
});

const result = await limiter.schedule(() => 
  heir.contracts.generate(params)
);
```

### Handle 429 Responses

```javascript
async function apiCall(fn, retries = 3) {
  try {
    return await fn();
  } catch (error) {
    if (error.status === 429 && retries > 0) {
      const delay = error.retryAfter || 60;
      await sleep(delay * 1000);
      return apiCall(fn, retries - 1);
    }
    throw error;
  }
}
```

## Input Validation

### Validate Addresses

```javascript
import { isAddress, getAddress } from 'viem';

function validateBeneficiary(beneficiary) {
  if (!isAddress(beneficiary.address)) {
    throw new Error('Invalid Ethereum address');
  }
  
  // Normalize to checksum address
  beneficiary.address = getAddress(beneficiary.address);
  
  if (beneficiary.percentage < 0 || beneficiary.percentage > 100) {
    throw new Error('Invalid percentage');
  }
}
```

### Sanitize User Input

Never pass unsanitized user input to the API:

```javascript
// ❌ Bad
const result = await heir.contracts.generate({
  ownerAddress: req.body.address // Could be anything!
});

// ✅ Good
const address = sanitizeAddress(req.body.address);
if (!address) return res.status(400).send('Invalid address');
const result = await heir.contracts.generate({ ownerAddress: address });
```

## Audit Logging

Log all API interactions:

```javascript
async function apiCall(endpoint, params) {
  const startTime = Date.now();
  
  try {
    const result = await heir.request(endpoint, params);
    
    logger.info('API call succeeded', {
      endpoint,
      duration: Date.now() - startTime,
      requestId: result.meta.requestId
    });
    
    return result;
  } catch (error) {
    logger.error('API call failed', {
      endpoint,
      error: error.message,
      duration: Date.now() - startTime
    });
    throw error;
  }
}
```

## Security Checklist

- [ ] API keys stored in environment variables
- [ ] Keys rotated quarterly
- [ ] IP whitelisting enabled for production
- [ ] Webhook signatures verified
- [ ] All requests use HTTPS
- [ ] Input validation on all user data
- [ ] Rate limiting implemented client-side
- [ ] Audit logging enabled
- [ ] Error messages don't leak sensitive info
- [ ] Dependencies regularly updated

