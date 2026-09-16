# Product paths

Honest map of heir.es SPA URLs vs api.heir.es mounts. As of 2026-09-16.

## Two surfaces

| Surface | URL | Auth |
|---------|-----|------|
| Product app | `https://heir.es` | Session cookie `heir_auth` |
| Headless API | `https://api.heir.es/api/v1/*` | API key `heir_pk_` / `heir_pt_` / `heir_sk_` |
| Docs (this site) | `https://docs.heir.es` | Public |

Use the product app for humans. Use `/api/v1/*` for partner/integrator HTTP.

## Public funnel (everyone)

| Path | Who | Notes |
|------|-----|-------|
| `/login` | public | HEIR ID (email/social + phone OTP). Not a waitlist. |
| `/welcome` | after sign-in | cinematic; then branches |
| `/dashboard` | unpaid signed-in hub | referral + pay offer. No Estate Dashboard. |
| `/pricing` | public | live product SKUs |
| `/interview/try` | public | local-only try-out, then signup into `/login` → `/welcome` → pay. Not a free interview. |
| `/early` | referral | not product home |
| `/inv/:id` | referral / My Profile | |

Funnel: **`/login` → `/welcome` → pay**. Unpaid signed-in hub is `/dashboard`.

## Paid / entitled (`@h3ir.com` or purchase / seat / testGrant)

| Path | Who | Notes |
|------|-----|-------|
| `/interview` | **paid cinematic / purchase / redeem home** | Do not send new product flows to `/swarm` |
| `/legacy` | after interview completes; paid menu | `POST_INTERVIEW_COMPLETE_PATH` |
| `/desk` | paid HeirOS shell | unpaid blocked → `/dashboard`. Do not use as post-welcome default. |
| `/myheir` | memoir | session |

Paid cinematic / purchase / redeem home is **`/interview`**.

## Developer portal

| Path | Use |
|------|-----|
| `/developers` | keys + overview |
| `/developers/keys` | API keys |
| `/developers/webhooks` | webhook subscriptions UI |
| `/developers/usage` | usage |
| `/developers/billing` | developer plan billing |
| `/developers/elements` | Desk Elements docs (registry not open) |

Create keys at `https://heir.es/developers/keys`.

## Do not use as product home

- `/swarm` — older advisor-console / multi-tab surface. Do not send paying interviewees or new product flows there.
- `/early` — referral, not home
- `/desk` as the post-welcome default for a just-purchased interview

## Auth for product vs API

- Session JWT / cookie for SPA and `/api/estate-home`, `/api/legacy-interview`, `/api/executor`, `/api/memoir`, `/api/desk-agent`, `/api/desk-access`
- API key for `/api/v1/*`
- Phone OTP is product login (`/api/auth/phone/...`), not a partner API.

See [Auth matrix](/guide/auth-matrix) and [Platform spine](/guide/platform-spine).
