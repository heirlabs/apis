# Memoir (MyHeir) guide

MyHeir is the memoir / life-story agent surface: journals, questionnaires, media
inference, optional voice clone, chat, and insights.

## Base path

All routes: **`https://api.heir.es/api/memoir/...`**

| Wrong | Right |
|-------|-------|
| `/api/heirloom/*` | `/api/memoir/*` |
| Confusing with Heirlooms meter | Heirlooms = `/api/heirlooms/*` (AI meter) |
| Memoir pack wallet | `/api/memoir/credits/*` |

## Auth

Every memoir route runs behind **session auth** (`verifyAuth`). Use a logged-in
browser session (cookie JWT) or an equivalent user-bound token accepted by the
main app. Unauthenticated calls return **401**.

State-changing methods from the browser also require the app CSRF flow.

## Typical flow

1. **Name the agent** — `POST /api/memoir/setup`
2. **Daily prompt + journal** — `GET /api/memoir/prompt`, `POST /api/memoir/journal`
3. **Questionnaires** — `GET/POST /api/memoir/questionnaire/:category`
4. **Upload media** — `POST /api/memoir/media/upload`
5. **Chat** — `POST /api/memoir/chat`
6. **Insights** — `GET /api/memoir/insights`
7. **Optional voice** — `GET /api/memoir/voice/status`, `POST /api/memoir/voice/synthesize`

## Credits

- **Memoir packs** (media / voice / chat wallet): [Memoir credits API](/api/memoir-credits)
- **Heirlooms** (platform AI meter, separate ledger): [Heirlooms API](/api/heirlooms)

Some actions call `meterAction(...)` when `HEIRLOOMS_METERING_ENABLED=true`.

## Operational notes

- Agent runtime may depend on Eliza / Venice configuration on the server. If the
  agent subsystem is not configured, agent endpoints can return demo or error
  payloads — check response body rather than assuming a live LLM.
- Media upload limit is 25MB at the route multer layer.
- IPFS storage is used when Pinata (or configured IPFS) is available; otherwise
  local/file fallback paths apply per server config.

## Full endpoint list

See [Memoir API reference](/api/memoir).
