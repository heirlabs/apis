# Estate Health Check API

Public crypto estate readiness quiz and PDF one-pager.

::: warning Environment
Shipped on `heirlabs/web` **`origin/devv`** (dev.heir.es) as of **2026-07-30**.
:::

**Base path:** `/api/estate-health-check`  
**Auth:** None required. Optional session merges live Estate Home readiness.

## GET `/api/estate-health-check/schema`

Returns questionnaire definition and weight table for clients.

```json
{ "success": true, "schema": { } }
```

## POST `/api/estate-health-check/evaluate`

**Body:**

```json
{
  "answers": {
    "<questionId>": "yes"
  }
}
```

Answers may also be sent as the top-level object (server accepts `answers` or body).

| Status | Meaning |
|--------|---------|
| `200` | Evaluation result JSON |
| `400` | Validation failure (`error`, optional `details`) |

## POST `/api/estate-health-check/pdf`

**Body:** evaluate result **or** `{ "answers": { … } }`

**Success:** `Content-Type: application/pdf` with attachment filename `heir-estate-health-check.pdf`.

| Status | Meaning |
|--------|---------|
| `200` | PDF bytes |
| `400` | Invalid report payload |

## Notes

- Does not persist quiz answers as an estate plan.  
- Never returns 401 solely because session is missing.  
- Not a legal instrument.

## See also

- [Platform: Health Check](/platform/health-check)
