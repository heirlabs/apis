# MCP Tools Reference

Tools from the **working** entrypoint of [`@morbidcorp/heir@2.0.1`](https://www.npmjs.com/package/@morbidcorp/heir):
`dist/cli.js` (stdio). **Count: 18.**

Verified 2026-08-02: after `npm i @morbidcorp/heir@2.0.1`,
`node node_modules/@morbidcorp/heir/dist/cli.js` prints
`HEIR MCP server running on stdio` and registers these tools.

::: danger Broken package bin
The package `bin` field points at legacy `index.js`, which **crashes** on import
(missing `services/` / `generators/` files).  
`npx @morbidcorp/heir` / `heir-mcp` therefore **fails**.  
Always start **`dist/cli.js`** until a fixed release rewires `bin`.
:::

## Install and run (working)

```bash
npm i @morbidcorp/heir@2.0.1
export HEIR_API_KEY="heir_pk_..."
node node_modules/@morbidcorp/heir/dist/cli.js
```

Optional CLI flags supported by `dist/cli.js`:

| Flag | Meaning |
|------|---------|
| `--api-key=heir_pk_...` | Product API key (or `HEIR_API_KEY` env) |
| `--api-url=https://api.heir.es` | API base (or `HEIR_API_URL`) |
| `--tools=all` | All categories (default) |
| `--tools=contracts,vaults,jurisdictions,legal,chat` | Subset by category prefix |

IDE config:

```json
{
  "mcpServers": {
    "heir": {
      "command": "node",
      "args": ["node_modules/@morbidcorp/heir/dist/cli.js"],
      "env": {
        "HEIR_API_KEY": "heir_pk_your_key_here"
      }
    }
  }
}
```

Run from a directory where `@morbidcorp/heir` is installed (project root after
`npm i @morbidcorp/heir`). Absolute path to `dist/cli.js` also works.

Package name `@heir/mcp` does **not** exist on npm.

---

## Contracts (3)

### `heir_contract_list_templates`

List inheritance contract templates / legal frameworks. No parameters.

### `heir_contract_generate`

| Parameter | Required | Description |
|-----------|----------|-------------|
| `blockchain` | yes | e.g. EVM / Solana / TON family |
| `ownerAddress` | yes | Owner wallet |
| `beneficiaries` | yes | Addresses and percentages |
| `inheritanceTemplate` | no | Framework template |
| `deadMansSwitch` | no | Check-in configuration |

### `heir_contract_estimate_gas`

| Parameter | Required |
|-----------|----------|
| `blockchain` | yes |
| `network` | yes |
| `beneficiaryCount` | yes |

---

## Vaults (4)

### `heir_vault_list`

| Parameter | Required |
|-----------|----------|
| `status` | no |
| `limit` | no |

### `heir_vault_get`

| Parameter | Required |
|-----------|----------|
| `vaultId` | yes |

### `heir_vault_create`

| Parameter | Required |
|-----------|----------|
| `name` | yes |
| `blockchain` | yes |
| `description` | no |
| `beneficiaries` | no |

### `heir_vault_update`

| Parameter | Required |
|-----------|----------|
| `vaultId` | yes |
| `name` | no |
| `beneficiaries` | no |

---

## Jurisdictions (4)

### `heir_jurisdiction_list`

| Parameter | Required |
|-----------|----------|
| `region` | no |
| `legalSystem` | no |

### `heir_jurisdiction_get`

| Parameter | Required |
|-----------|----------|
| `code` | yes |

### `heir_jurisdiction_compare`

| Parameter | Required |
|-----------|----------|
| `codes` | yes |
| `aspects` | no |

### `heir_jurisdiction_search`

| Parameter | Required |
|-----------|----------|
| `query` | no |
| `features` | no |

---

## Legal documents (4)

These tools call the product API with the configured API key. Legal generate on
the server still requires a **user-bound** credential; without a valid key/user,
calls fail honestly.

### `heir_legal_generate_will`

| Parameter | Required |
|-----------|----------|
| `jurisdiction` | yes |
| `testator` | yes |
| `beneficiaries` | yes |
| `executor` / `guardian` / `residuaryClause` | no |

### `heir_legal_generate_trust`

| Parameter | Required |
|-----------|----------|
| `jurisdiction` | yes |
| `trustType` | yes |
| `grantor` | yes |
| `trustee` | yes |
| `beneficiaries` | yes |
| `assets` | no |

### `heir_legal_generate_poa`

| Parameter | Required |
|-----------|----------|
| `jurisdiction` | yes |
| `type` | yes |
| `principal` | yes |
| `agent` | yes |
| `powers` / `limitations` / `effectiveDate` | no |

### `heir_legal_list_templates`

| Parameter | Required |
|-----------|----------|
| `jurisdiction` | no |
| `documentType` | no |

---

## Chat (3)

### `heir_chat_estate_planning`

| Parameter | Required |
|-----------|----------|
| `message` | yes |
| `context` | no |
| `conversationId` | no |

### `heir_chat_explain_template`

| Parameter | Required |
|-----------|----------|
| `template` | yes |
| `aspects` | no |

### `heir_chat_recommend_plan`

| Parameter | Required |
|-----------|----------|
| `jurisdiction` | yes |
| `familySituation` | yes |
| `assetTypes` | yes |
| `concerns` / `religiousLaw` | no |

---

## Not claimed

| Surface | Status |
|---------|--------|
| Legacy root `index.js` calculators (`heir_calculate_*`, `heir_health`, …) | Present in package tree but **not** the working `bin`/`dist/cli` surface; do not document as install path |
| monorepo `billing-mcp.js` extra tools | Not in `dist/cli` tool list |
| “100+ MCP tools” | False |

## Related HTTP

- REST: [API reference](/api/)
- Product helpers: `https://api.heir.es/mcp` (health / jurisdiction HTTP; not full MCP stdio)

## Rate limits

Tool calls that hit `api.heir.es` use developer plan + API-key tier limits.
See [API tiers](/pricing/api-tiers).
