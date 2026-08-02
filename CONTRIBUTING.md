# Contributing to HEIR APIs

Thanks for helping make the public HEIR API surface accurate and useful.

This repository is primarily **documentation and integrator reference** for the live HTTP API at [api.heir.es](https://api.heir.es). The production monorepo that deploys the API is separate. Contributions here should improve **truth, clarity, and DX** — not invent product that is not live.

## Ways to contribute

| Kind | Examples | Notes |
|------|----------|--------|
| **Doc fix** | Wrong path, stale auth note, broken link | Highest value; usually fastest merge |
| **Example** | Shell/JS snippet that works against production | Must run with a real or clearly mocked key |
| **Guide** | New tutorial for a supported surface | Cite OpenAPI or a live endpoint |
| **Scaffold** | Hardening `src/` reference modules | Keep scope small; no secret commits |
| **Issue** | Report doc/API mismatch | Include request id, path, timestamp if possible |

## Before you start

1. Read the [README](./README.md) and [auth matrix](https://docs.heir.es/guide/auth-matrix).
2. Prefer fixing the **live** OpenAPI or docs over adding aspirational SDKs.
3. Do **not** claim: unpublished REST SDKs, audit badges, quantum-safe *chain* assets, token/yield/TGE marketing, or `mcp.heir.es` as a guaranteed host.
4. Never commit API keys, webhook secrets, or private keys.

## Development setup

```bash
git clone https://github.com/heirlabs/apis.git
cd apis
npm install
npm run docs:dev      # http://localhost:5173 (VitePress default)
```

### Required checks before a PR

```bash
npm test              # docs truth + live probes (anti-LARP)
npm run docs:build    # VitePress must build clean
```

Optional:

```bash
npm run openapi:fetch # snapshot live OpenAPI → openapi/openapi.json
./examples/01-health.sh
HEIR_API_KEY=heir_pk_… ./examples/02-list-templates.sh
```

## Pull request process

1. **Branch from `main`** — direct pushes are blocked by branch protection.
2. Use a descriptive branch name: `docs/fix-webhook-hmac`, `examples/list-plans`, `chore/ci`.
3. Keep PRs small and reviewable (one topic when possible).
4. Fill out the PR template: what changed, how you verified it.
5. Link related issues with `Fixes #123` when applicable.
6. Expect review for claim accuracy. “It builds” is not enough for API docs.

### Commit messages

Conventional Commits, imperative mood, short subject:

```text
docs: correct memoir base path in webhooks guide
fix(examples): handle empty templates list
chore(ci): build docs on pull_request
```

## Reporting a docs vs production mismatch

Open a **Documentation issue** and include:

- Endpoint / doc page URL  
- Expected behavior (quote the doc)  
- Actual response (status + redacted body)  
- Time (UTC) and region if known  
- Whether you used API key, session, or public access  

We treat “docs lie” as a high-severity bug for integrators.

## Code of conduct

Participation is governed by [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md).

## Security

Do not file public issues for vulnerabilities that expose user data or allow unauthorized access. See [SECURITY.md](./SECURITY.md).

## License

By contributing, you agree that your contributions are licensed under the [MIT License](./LICENSE).
