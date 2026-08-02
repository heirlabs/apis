# Memoir (MyHeir) API

Session-authenticated product API for the MyHeir memoir agent: journals,
questionnaires, media, voice, chat, and insights.

**Base path:** `/api/memoir`  
**Auth:** Session JWT (`verifyAuth` on the whole router). Not mounted as a public
anonymous API. Hybrid API-key callers must present a user-bound credential the
same way as other session product routes.

::: warning Path name
The base path is **`/api/memoir`**, not `/api/heirloom`.  
`/api/heirloom` returns **404** on production.  
Do not confuse this with **Heirlooms** (metered AI credits) at `/api/heirlooms`.
:::

Credits / packs for memoir media and voice live under
[`/api/memoir/credits`](/api/memoir-credits).

---

## Setup and agent

### GET /api/memoir/setup

Return setup status for the authenticated user.

### POST /api/memoir/setup

Set agent display name / initial setup fields.

### GET /api/memoir/agent

Current agent/character payload.

### GET /api/memoir/agent/status

Progress / readiness status for the agent.

### GET /api/memoir/character

Character card / built character for the agent.

### GET /api/memoir/prompt

Daily prompt content for journaling.

---

## Journal and questionnaires

### POST /api/memoir/journal

Submit a journal entry.

### GET /api/memoir/journal

List journal entries for the user.

### GET /api/memoir/questionnaire/:category

Fetch questionnaire schema for a category.

### POST /api/memoir/questionnaire/:category

Submit answers for a questionnaire category.

---

## Chat and insights

### POST /api/memoir/chat

Chat with the memoir agent (may meter Heirlooms / memoir credits depending on
server flags and credit service).

### GET /api/memoir/insights

Summarized insights from journals and media.

---

## Media

### POST /api/memoir/media/upload

Upload media (`multipart`). Server accepts image/audio/video within size limits
(25MB upload limit in route config).

### GET /api/memoir/media

List media items.

### DELETE /api/memoir/media/:id

Delete a media item.

### GET /api/memoir/media/:id/inference

Fetch inference result for a media item.

---

## Voice and avatar

### GET /api/memoir/voice/status

Voice clone profile status.

### POST /api/memoir/voice/synthesize

Synthesize speech. Metered as `voice_generation_minute` when Heirloom metering
is enabled.

### POST /api/memoir/avatar/generate

Generate avatar video assets when configured.

---

## Auth and errors

| Status | Meaning |
|--------|---------|
| 401 | Missing or invalid session |
| 400 | Validation / missing fields |
| 413 / multer errors | File too large or wrong type |
| 503 / service errors | Downstream voice/IPFS/agent not configured |

CSRF protection applies to cookie session flows for state-changing methods on the
main app origin (same as other session APIs).

---

## Related

- [Memoir credits](/api/memoir-credits)
- [Heirlooms (AI meter)](/api/heirlooms)
- [Memoir guide](/guide/memoir)
- [Billing overview](/pricing/)
