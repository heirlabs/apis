# Billing & credits

HEIR does **not** use a single gas-credit wallet. Product money is split into **four
real systems**, each with its own ledger and API. This page is the source of truth
for what is live on [heir.es](https://heir.es) / [api.heir.es](https://api.heir.es)
as of 2026-08-02.

Machine-readable snapshot: [`/structured/pricing.json`](/structured/pricing.json).

## At a glance

| System | What it pays for | Cycle | Status |
|--------|------------------|-------|--------|
| **Weekly Protection credits** | Proof-of-life / protection subscription (weekly debit) | Weekly | **Live** on heir.es |
| **Heirlooms** | Metered AI/API actions (desk, assay, harness, …) | Monthly allowance + packs | **Code live**; charge only when `HEIRLOOMS_METERING_ENABLED=true` |
| **Developer API plans** | Headless API request quotas + keys | Calendar month | **Live** (`/api/v1/billing`) |
| **Memoir / MyHeir packs** | Memoir media, inference, voice, chat | Pack validity (days) | **Live** (`/api/memoir/credits`) |

**Retired (do not implement against):** “Timer credits” / “Gas credits” / Basic–Family–Estate
trust-slot plans from older specs. Those were never fully built and were removed from
the monorepo (see in-repo `server/Credits.md`). They are **not** sold.

## Death floor

Billing state never paywalls death-critical paths: oracle claim, proof-of-life check-in,
vault unlock, funeral planning surfaces. Heirloom metering refuses to charge those route
prefixes even if mis-wired.

## Read next

- [Product credits & packs](/pricing/plans) — Weekly Protection, Heirlooms, Memoir packs
- [API tiers & developer plans](/pricing/api-tiers) — rate limits + Stripe developer plans
- [Comparison](/pricing/comparison) — feature matrix (not a price list)
- [Heirlooms API](/api/heirlooms) — catalog, summary, packs
- [Memoir credits API](/api/memoir-credits) — MyHeir wallet paths
