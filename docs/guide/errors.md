# Error Handling

The HEIR API uses standard HTTP status codes and returns structured error responses.

## Error Response Format

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Human-readable error message",
    "details": [
      { "field": "beneficiaries[0].address", "reason": "Invalid checksum" }
    ]
  },
  "meta": {
    "requestId": "req_abc123xyz",
    "timestamp": "2024-01-15T12:00:00.000Z"
  }
}
```

## HTTP Status Codes

| Status | Description |
|--------|-------------|
| `200` | Success |
| `201` | Created |
| `400` | Bad Request - Invalid parameters |
| `401` | Unauthorized - Missing or invalid authentication |
| `403` | Forbidden - Insufficient permissions |
| `404` | Not Found - Resource doesn't exist |
| `429` | Too Many Requests - Rate limited |
| `500` | Internal Server Error |

## Error Codes

### Authentication Errors

| Code | Description |
|------|-------------|
| `API_KEY_MISSING` | No API key provided |
| `API_KEY_INVALID` | Invalid or expired API key |
| `API_KEY_INVALID_FORMAT` | Key doesn't match expected format |
| `UNAUTHORIZED` | Authentication required |

### Authorization Errors

| Code | Description |
|------|-------------|
| `INSUFFICIENT_SCOPE` | API key lacks required scope |
| `TIER_NOT_ALLOWED` | Feature requires higher tier |
| `IP_NOT_ALLOWED` | Request IP not in whitelist |

### Validation Errors

| Code | Description |
|------|-------------|
| `VALIDATION_ERROR` | Request parameters invalid |
| `INVALID_ADDRESS` | Wallet address format invalid |
| `INVALID_PERCENTAGE` | Percentage out of range |
| `PERCENTAGE_SUM` | Beneficiary percentages don't sum to 100 |

### Resource Errors

| Code | Description |
|------|-------------|
| `NOT_FOUND` | Resource not found |
| `ALREADY_EXISTS` | Resource already exists |
| `LIMIT_REACHED` | Maximum limit reached |

### Rate Limit Errors

| Code | Description |
|------|-------------|
| `RATE_LIMIT_EXCEEDED` | Too many requests |
| `BURST_LIMIT_EXCEEDED` | Too many requests per second |

## Handling Errors

```javascript
async function makeRequest(endpoint, options) {
  const response = await fetch(`https://api.heir.es/api/v1${endpoint}`, {
    ...options,
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
      ...options.headers
    }
  });
  
  const data = await response.json();
  
  if (!data.success) {
    const error = new Error(data.error.message);
    error.code = data.error.code;
    error.details = data.error.details;
    error.requestId = data.meta.requestId;
    throw error;
  }
  
  return data;
}

// Usage
try {
  const result = await makeRequest('/contracts/generate', {
    method: 'POST',
    body: JSON.stringify(contractData)
  });
} catch (error) {
  console.error(`Error ${error.code}: ${error.message}`);
  console.error('Request ID:', error.requestId); // For support
  
  if (error.code === 'VALIDATION_ERROR') {
    error.details.forEach(d => {
      console.error(`  ${d.field}: ${d.reason}`);
    });
  }
}
```

## Request ID

Every response includes a unique `requestId` in the `meta` object. Include this when contacting support for faster resolution.

