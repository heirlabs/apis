# Security policy

## Supported surfaces

| Surface | Status |
|---------|--------|
| Production HTTP API (`https://api.heir.es`) | Actively maintained |
| Documentation site (`https://docs.heir.es`, this repo) | Actively maintained |
| npm `@morbidcorp/heir` MCP package | Version pins and install notes live in [docs](https://docs.heir.es/mcp/) — verify current tags on [npm](https://www.npmjs.com/package/@morbidcorp/heir) |
| Desk Element packages (`@morbidcorp/element-sdk`, `@morbidcorp/elements-cli`) | Separate repos; security issues should target those packages |

This repository mainly ships **docs and examples**. A vulnerability in production API behavior should still be reported so we can route it to the right owners.

## Reporting a vulnerability

**Please do not open a public GitHub issue for security vulnerabilities.**

Preferred:

1. Email **security@heir.es** (or **api@heir.es** if security@ bounces) with:
   - Description of the issue  
   - Impact (auth bypass, data exposure, injection, SSRF, etc.)  
   - Steps to reproduce or a proof of concept  
   - Affected URL/path and approximate time  
2. If email is unavailable, use the in-product support channels on [heir.es](https://heir.es) and mark the message **SECURITY**.

We will acknowledge receipt when we can and may ask for more detail. Please give us a reasonable window before public disclosure.

## Scope (examples)

**In scope**

- Authentication / authorization bypass on `api.heir.es`
- Cross-tenant data leakage
- Injection in documented API inputs that reaches production
- Webhook signature verification flaws
- Secrets or private keys committed in this repo or docs examples
- XSS or open redirects on docs.heir.es that can steal integrator keys

**Out of scope (typical)**

- Social engineering / phishing against end users  
- Denial of service without a clear application bug  
- Issues only on third-party infrastructure we do not control  
- Findings that require already-compromised user machines  
- Theoretical issues with no practical impact  

## Safe harbor

If you research in good faith, avoid privacy violations and service degradation, and report privately first, we will not pursue legal action for that research.

## Secrets hygiene for contributors

- Never put real `heir_pk_…` keys, webhook secrets, or private keys in PRs, screenshots, or docs.  
- Use redacted placeholders: `heir_pk_xxxxxxxx`.  
- Rotate any key that may have leaked.  

## Thank you

Responsible disclosure keeps integrators and estates safer. We appreciate researchers who report issues carefully.
