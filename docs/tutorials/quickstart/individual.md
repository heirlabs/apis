# Quickstart: Individual

**Goal:** Go from zero to a measured inheritance setup in under 30 minutes on the product (dev.heir.es / heir.es).

**Environment note (2026-07-30):** Estate Home and Health Check are documented from **`origin/devv`**. Use the host where those routes are deployed.

## 1. Run the Crypto Estate Health Check (no account required)

1. Open `/estate-health-check`.  
2. Answer the quiz (weights match Estate Home).  
3. Download the PDF leave-behind if offered.  

API equivalent:

```bash
curl -sS https://dev.heir.es/api/estate-health-check/schema
curl -sS -X POST https://dev.heir.es/api/estate-health-check/evaluate \
  -H 'Content-Type: application/json' \
  -d '{"answers":{}}'
```

This is a **readiness quiz**, not a will.

## 2. Create an account and open Estate Home

1. Sign in on the product.  
2. Open `/estate-home`.  
3. Read the **ops honesty** banner — a high percent with degraded ops means setup is incomplete for live claims.  

## 3. Close the highest-weight gaps

Typical order:

1. **Deploy or register** an estate contract on a chain you actually use (start testnet if learning).  
2. **Proof-of-life** — enable at least one verification method.  
3. **Soft vault** — add heir-assigned items you want released on death clearance.  
4. **Offline assets** — list banks/property/insurance for executors (`/offline-assets`).  
5. **Living Legacy interview** — roles and wishes (`/legacy`, `/interview`).  
6. **Legal formalities** — lawyer-ready checklists only; engage counsel for execution.  

## 4. Name heirs and verify the heir package view

1. Ensure beneficiaries/heirs are correct on-chain and in soft assignment.  
2. Open `/heir-package` as the heir identity (or review next steps).  
3. Bookmark `/if-someone-died` for family.  

## 5. Understand what is still gated

Even with 100% setup score:

| Gate | If off |
|------|--------|
| Oracle key | Email claim may 503 |
| Death clearance enabled | Soft vault may stay sealed for non-VIP paths |
| Chain RPC / funds | Deploy/claim stuck |

See [Ops gates](/platform/ops-gates).

## Tips

- Prefer one chain and a simple beneficiary split for the first deploy.  
- Do not treat filings mocks or grow/trading surfaces as the inheritance product.  
- Soft legacy is documents/messages — not bank wires.  

## Next

- [Estate Home](/platform/estate-home)  
- [Soft legacy](/platform/soft-legacy)  
- [Developer quickstart](/tutorials/quickstart/developer)  

*Not legal or financial advice.*
