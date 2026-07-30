# VIP Professionals

HEIR includes professional tracks for attorneys, CPAs, CFPs, and advisors. **Maturity is partial (engineering grade C as of 2026-07-30 on devv):** modules exist; this is not a finished Vanilla-class advisor OS.

## Surfaces

| Doc | Product theme |
|-----|----------------|
| [Certification](/professionals/certification) | Training modules, quizzes, credentials |
| [VIP Copilot](/professionals/copilot) | Copilot-oriented workflows |
| [Advisor Dashboard](/professionals/dashboard) | Client / practice surfaces |
| [Lead Management](/professionals/leads) | Lead capture and routing |
| [Credential Verification](/professionals/credential-verification) | License / bar-style verification queues |

## Honesty

- Bar / CPA / partner verification often uses **manual review** by design — fake automatic `VERIFIED` is worse than a queue.  
- Multiple tracks (VIP, certification, advisor marketplace) still compete; do not document them as one finished OS.  
- Death/life **verifier** jobs and payouts are operationally complex — see product verifier routes, not this brochure alone.  

## API entry points (monorepo)

Typical mounts (session / hybrid; confirm on branch):

- `/api/vip`  
- Certification commerce and partner routes  
- `/api/advisors`  
- Bar verification admin queues  

Headless integrators: prefer documented `/api/v1` hybrid mounts where present.

## Related

- [Platform overview](/platform/) for the consumer inheritance spine pros support  
- [Credential verification](/professionals/credential-verification)  
