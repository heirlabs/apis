# Pagination

Handle large result sets with cursor and offset pagination.

## Overview

List endpoints return paginated results. The HEIR API supports both offset-based and cursor-based pagination.

## Offset Pagination

Use `page` and `limit` query parameters:

```bash
GET /api/v1/api-keys?page=1&limit=20
```

### Response

```json
{
  "success": true,
  "data": [...],
  "meta": {
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "pages": 8,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

### Parameters

| Parameter | Default | Max | Description |
|-----------|---------|-----|-------------|
| `page` | 1 | - | Page number (1-indexed) |
| `limit` | 20 | 100 | Items per page |

## Cursor Pagination

For real-time data or large datasets, use cursor pagination:

```bash
GET /api/v1/webhooks/events?cursor=eyJpZCI6MTIzfQ&limit=50
```

### Response

```json
{
  "success": true,
  "data": [...],
  "meta": {
    "pagination": {
      "cursor": "eyJpZCI6MTc1fQ",
      "nextCursor": "eyJpZCI6MjI1fQ",
      "hasMore": true
    }
  }
}
```

### When to Use Cursor Pagination

- Webhook event logs
- Real-time data streams
- Very large datasets (>10,000 items)
- When data may be added/removed during pagination

## SDK Examples

### JavaScript

```javascript
// Offset pagination
const page1 = await heir.apiKeys.list({ page: 1, limit: 20 });
const page2 = await heir.apiKeys.list({ page: 2, limit: 20 });

// Cursor pagination
let cursor = null;
do {
  const result = await heir.webhooks.events({ cursor, limit: 50 });
  processEvents(result.data);
  cursor = result.meta.pagination.nextCursor;
} while (result.meta.pagination.hasMore);
```

### Python

```python
# Offset pagination
page1 = heir.api_keys.list(page=1, limit=20)
page2 = heir.api_keys.list(page=2, limit=20)

# Cursor pagination
cursor = None
while True:
    result = heir.webhooks.events(cursor=cursor, limit=50)
    process_events(result.data)
    if not result.meta.pagination.has_more:
        break
    cursor = result.meta.pagination.next_cursor
```

## Best Practices

1. **Use reasonable page sizes** - 20-50 items is typically optimal
2. **Handle empty pages** - Check `data.length` or `hasMore`
3. **Cache when appropriate** - Offset pagination is cacheable
4. **Use cursors for real-time** - Avoids missing or duplicate items

