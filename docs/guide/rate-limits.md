# Rate Limits

The HEIR API uses rate limiting to ensure fair usage and maintain service quality.

## Tier Limits

| Tier | General | Contract Gen | AI Chat | Window |
|------|---------|--------------|---------|--------|
| **Public** | 100 | 10 | 5 | 15 min |
| **Partner** | 1,000 | 100 | 50 | 15 min |
| **Internal** | 10,000 | 1,000 | 200 | 15 min |

## Rate Limit Headers

Every API response includes rate limit information:

```http
HTTP/1.1 200 OK
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 2024-01-15T12:30:00.000Z
```

| Header | Description |
|--------|-------------|
| `X-RateLimit-Limit` | Maximum requests allowed in window |
| `X-RateLimit-Remaining` | Requests remaining in current window |
| `X-RateLimit-Reset` | When the rate limit window resets (ISO 8601) |

## Handling Rate Limits

When you exceed rate limits, you'll receive a `429 Too Many Requests` response:

```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Rate limit exceeded for contract generation. Your tier: public, limit: 10 per 15 minutes.",
    "tier": "public",
    "limit": 10,
    "category": "contracts",
    "retryAfter": "2024-01-15T12:30:00.000Z"
  }
}
```

### Best Practices

1. **Check headers** - Monitor `X-RateLimit-Remaining` to avoid hitting limits
2. **Implement backoff** - Use exponential backoff when rate limited
3. **Cache responses** - Cache contract templates and other static data
4. **Batch requests** - Combine multiple operations where possible

### Example: Exponential Backoff

```javascript
async function fetchWithRetry(url, options, maxRetries = 3) {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const response = await fetch(url, options);
    
    if (response.status === 429) {
      const retryAfter = response.headers.get('X-RateLimit-Reset');
      const delay = retryAfter 
        ? new Date(retryAfter) - Date.now()
        : Math.pow(2, attempt) * 1000;
      
      await new Promise(resolve => setTimeout(resolve, delay));
      continue;
    }
    
    return response;
  }
  
  throw new Error('Max retries exceeded');
}
```

## Burst Protection

In addition to windowed rate limits, the API includes burst protection to prevent sudden spikes:

| Tier | Burst Limit |
|------|-------------|
| Public | 5/second |
| Partner | 20/second |
| Internal | 100/second |

## Upgrading Your Tier

Need higher limits? [Upgrade your plan](https://heir.es/pricing) or contact us for enterprise options.

