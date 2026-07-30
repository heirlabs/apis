# Executor API

After-death executor cockpit.

::: warning Environment
Shipped on `heirlabs/web` **`origin/devv`** as of **2026-07-30**.
:::

**Base path:** `/api/executor`  
**Auth:** Session

## Cases

| Method | Path | Purpose |
|--------|------|---------|
| `GET` | `/cases` | List executor cases |
| `POST` | `/cases` | Create case |
| `GET` | `/cases/:id` | Case detail |
| `GET` | `/cases/:id/workspace` | Workspace: offline assets + contracts for deceased user |
| `PATCH` | `/cases/:id` | Update case / checklist |
| `DELETE` | `/cases/:id` | Delete case |

## Institutions

| Method | Path | Purpose |
|--------|------|---------|
| `POST` | `/cases/:id/institutions` | Add institution |
| `PATCH` | `/cases/:id/institutions/:instId` | Update institution |

## Death certificate

| Method | Path | Purpose |
|--------|------|---------|
| `GET` | `/cases/:id/death-certificate` | Access certificate material |

Additional upload routes may exist on the same router; verify against `server/routes/executor.js` on your branch before integrating.

## Honesty

Organizes executor work. Does **not** move bank assets or replace probate.

## See also

- [Platform: Executor](/platform/executor)  
- [Offline assets API](/api/offline-assets)
