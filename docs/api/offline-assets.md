# Offline Assets API

Non-on-chain asset inventory for hybrid estates.

::: warning Environment
Shipped on `heirlabs/web` **`origin/devv`** as of **2026-07-30**.
:::

**Base path:** `/api/offline-assets`  
**Auth:** Session

| Method | Path | Purpose |
|--------|------|---------|
| `GET` | `/` | List inventory items |
| `GET` | `/summary` | Summary aggregates |
| `POST` | `/` | Create item |
| `PATCH` | `/:id` | Update item |
| `DELETE` | `/:id` | Delete item |

## Honesty

- User-asserted inventory and POD/TOD **notes** only.  
- **No** automated institution transfer rails.  
- Complements on-chain estate contracts, does not replace them.

## See also

- [Platform: Executor & offline assets](/platform/executor)
