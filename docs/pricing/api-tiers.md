# API tiers & developer plans

Two layers:

1. **API key tier** — rate limits and scope class on each `heir_…` key  
2. **Developer subscription plan** — monthly request budget on the account (Stripe)

---

## API key tiers (per-key window)

| Tier | General | Contract gen | AI chat | Window |
|------|--------:|-------------:|--------:|--------|
| **Public** | 100 | 10 | 5 | 15 min |
| **Partner** | 1,000 | 100 | 50 | 15 min |
| **Internal** | 10,000 | 1,000 | 200 | 15 min |

Returned on responses as `X-RateLimit-*` headers when API-key auth is used.

Partner/internal keys can hold scopes such as `contracts`, `webhooks`, `chat`,
`harness:read`, `harness:invoke`, `harness:export`, `all`.

---

## Developer subscription plans

Managed at **heir.es/developers/billing** and ` /api/v1/billing/* `.

| Plan ID | List price | Requests / day | Requests / month | API keys |
|---------|-----------:|---------------:|-----------------:|---------:|
| `free` | $0 | 100 | 3,000 | 5 |
| `developer` | $29/mo | 1,000 | 25,000 | 5 |
| `partner` | $99/mo | 10,000 | 250,000 | unlimited |
| `enterprise` | Custom | Unlimited | Unlimited | Custom |

Source of list prices in API: `GET /api/v1/billing/plans` (public).  
Checkout: `POST /api/v1/billing/checkout` with body `{ "plan": "developer" | "partner" }`  
(session or API key with user scope). Requires Stripe price env vars
`STRIPE_PRICE_DEVELOPER` / `STRIPE_PRICE_PARTNER` on the server.

Plan limits are enforced via `Subscription.canMakeRequest()` on API-key traffic.

---

## Heirlooms vs developer plans

| | Developer plan | Heirlooms |
|--|----------------|-----------|
| Unit | HTTP requests | Action-weighted Heirlooms |
| Typical use | Contract gen, webhooks, CRUD | LLM / vision / voice / harness invoke |
| Kill switch | Plan inactive / over quota → 429 | `HEIRLOOMS_METERING_ENABLED` |

An integration may need **both**: plan for traffic, Heirlooms for AI actions when metering is on.

---

## Related

- [Rate limits guide](/guide/rate-limits)
- [API keys](/guide/api-keys)
- [Heirlooms API](/api/heirlooms)
