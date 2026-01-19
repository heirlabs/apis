# Heirloom API

Heirloom endpoints are user-session endpoints (JWT cookies) protected by CSRF for state-changing operations.

## Authentication & CSRF

- **Auth**: user session via cookies.
- **CSRF**: required on non-GET requests.

## Endpoints

### GET /api/heirloom/setup
Get setup status and current agent name.

### POST /api/heirloom/setup
Set or update agent name.

**Body:**
```json
{ "agentName": "Eleanor" }
```

### GET /api/heirloom/agent
Fetch agent metadata and character profile. Returns demo mode if ElizaOS is not configured.

### GET /api/heirloom/agent/status
Get journal count and questionnaire completion.

### GET /api/heirloom/prompt
Get a daily prompt for journaling.

### POST /api/heirloom/journal
Create a journal entry and update character profile.

**Body:**
```json
{ "content": "...", "mood": "neutral", "promptUsed": "..." }
```

### GET /api/heirloom/journal
List journal entries.

### GET /api/heirloom/questionnaire/:category
Get or initialize a questionnaire by category.

### POST /api/heirloom/questionnaire/:category
Save questionnaire answers.

**Body:**
```json
{ "answers": [{ "questionId": "q1", "answer": "..." }] }
```

### POST /api/heirloom/chat
Send a message to the Heirloom agent.

**Body:**
```json
{ "message": "What do you want future heirs to know?" }
```

### GET /api/heirloom/insights
Summarize personality insights derived from journals and questionnaires.

### GET /api/heirloom/character
Return the full character model used to power the agent.

### POST /api/heirloom/media/upload
Upload photo/audio/video. Requires `multipart/form-data`.

**Fields:**
- `file`: binary media file
- `durationMinutes` (optional)

### GET /api/heirloom/media
List uploaded media items.

### DELETE /api/heirloom/media/:id
Delete a media item.

### GET /api/heirloom/media/:id/inference
Get inference metadata for a media item.

### GET /api/heirloom/voice/status
Get voice profile status and sample counts.

### POST /api/heirloom/voice/synthesize
Synthesize voice audio from text. Returns audio buffer.

**Body:**
```json
{ "text": "..." }
```

### POST /api/heirloom/avatar/generate
Generate a short avatar video using a photo and synthesized audio.

**Body:**
```json
{ "photoUrl": "https://...", "text": "...", "style": "stylized", "durationSeconds": 10 }
```

## Common Errors

- `401` Unauthorized (no session)
- `403` CSRF failure
- `402` Insufficient credits
- `404` Unknown category or media item
