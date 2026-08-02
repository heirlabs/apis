# Changelog

All notable changes to **this repository** (docs site, examples, OSS scaffolding)
are documented here.

The **HTTP API** behavior changelog for integrators lives in the docs:
[docs.heir.es/changelog](https://docs.heir.es/changelog).

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project aims to follow [Semantic Versioning](https://semver.org/) for
tagged releases of the docs package when tags are cut.

## [Unreleased]

### Added

- Full OSS community health files (`CONTRIBUTING`, `SECURITY`, `CODE_OF_CONDUCT`, `SUPPORT`)
- GitHub issue/PR templates, CI (docs truth + build), Dependabot
- Runnable `examples/` scripts against production
- `npm run openapi:fetch` to snapshot live OpenAPI
- MIT `LICENSE` and integrator-focused README

## [1.0.0] — 2026-08-02

### Added

- Public documentation site source (VitePress) for docs.heir.es
- Guide, API reference, jurisdictions, legal frameworks, MCP, Elements
- Docs truth validator (`scripts/validate-docs-truth.mjs`)
- Static docs server (`serve-docs.mjs`) and production Docker image
