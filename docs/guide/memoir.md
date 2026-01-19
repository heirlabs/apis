# Memoir

Memoir is a legacy-capture feature that builds a personalized AI companion from your journals, questionnaires, and media. The output is a structured personality profile and a contextual chat agent that can preserve intent, values, and family guidance.

## Agent-Facing Summary

- **Purpose**: Capture and preserve personal intent, values, and memories to augment estate plans.
- **Core Inputs**: journal entries, questionnaire answers, media uploads (photo/audio/video), voice samples.
- **Core Outputs**: personalized agent character profile, insights summary, chat responses, voice status.
- **Auth**: user session (JWT cookies) + CSRF for non-GET requests.
- **Credits**: media inference, voice cloning, and chat consume credits via `/api/heirloom/credits`.

## Primary User Flow

1. **Name the agent** (`POST /api/heirloom/setup`).
2. **Collect daily prompts** (`GET /api/heirloom/prompt`) and submit journals (`POST /api/heirloom/journal`).
3. **Complete questionnaires** (`GET/POST /api/heirloom/questionnaire/:category`).
4. **Upload media** (`POST /api/heirloom/media/upload`) for inference and voice cloning.
5. **Chat with the agent** (`POST /api/heirloom/chat`).
6. **Review insights** (`GET /api/heirloom/insights`).

## Capabilities

- **Legacy journaling** with topic extraction.
- **Guided questionnaires** by category.
- **Media inference** (photo/video description) and audio transcription.
- **Voice cloning** and synthesis (credit-gated).
- **Personality insights** summary.
- **Agent chat** backed by ElizaOS when configured (falls back to demo mode otherwise).

## Data Contracts (Key Fields)

- `agentName`: user-defined name for the Memoir agent.
- `journals[]`: entries with content, mood, prompt, insights.
- `questionnaires[]`: category-based questions and answers.
- `media[]`: IPFS-backed assets with inference metadata.
- `voiceStatus`: voice profile readiness and sample counts.

## Notes for AI Agents

- Memoir endpoints are **not API-key** endpoints; they rely on user session auth.
- Non-GET requests require a valid CSRF token.
- Chat/media actions can return `402` for insufficient credits.
- Endpoints are served under legacy paths (`/api/heirloom/*`) for compatibility.
- `GET /api/heirloom/agent` returns demo mode if ElizaOS is not configured.
