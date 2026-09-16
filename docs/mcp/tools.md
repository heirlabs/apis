# MCP Tools Reference

Tools from [`@morbidcorp/heir@2.0.5`](https://www.npmjs.com/package/@morbidcorp/heir)
(`dist/cli.js` / `heir-mcp` bin).

```bash
npx -y @morbidcorp/heir@2.0.5
export HEIR_API_KEY="heir_pk_..."
```

Package `@heir/mcp` does **not** exist. Pin **2.0.5**. 2.0.4 also worked (`dist/cli.js`); 2.0.1 bin was broken.

Optional CLI: `--api-key=`, `--api-url=`, `--tools=all|contracts,vaults,jurisdictions,legal,chat`.

## Default vs legacy modules

Default (`--tools=all` or omitted): read-only capability projection:

- `heir_capabilities_search`
- `heir_capabilities_describe`
- `heir_guide_get`
- `heir_action_invoke` (dark unless desk-agent actions enabled)
- `heir_record_*`
- resource `heir://compliance` always listed

Legacy 18 HTTP tools: `--tools=contracts,vaults,jurisdictions,legal,chat`. **Count: 18.** Named tools below stay documented for that module list.

Hosted calculators (if any) are a **different process** from this npm bin — not guaranteed, not an SLA, and not a documented public host at `https://mcp.heir.es`.

---

## Contracts (3)

### `heir_contract_list_templates`
`GET /api/v1/contracts/templates` — no params.

### `heir_contract_generate`
| Parameter | Required |
|-----------|----------|
| `blockchain` | yes (`evm` \| `solana` \| `ton`) |
| `ownerAddress` | yes |
| `beneficiaries` | yes |
| `inheritanceTemplate` | no |
| `deadMansSwitch` | no |

`POST /api/v1/contracts/generate`

### `heir_contract_estimate_gas`
| Parameter | Required |
|-----------|----------|
| `blockchain` | yes |
| `network` | yes |
| `beneficiaryCount` | yes |

`POST /api/v1/contracts/estimate-gas`

---

## Estates / vaults (4)

Product stores drafts on `user.vaults` via **`/api/v1/user/estates`**. PIN-gated
full load (`/load/:id`) is not exposed as MCP tools.

### `heir_vault_list`
`GET /api/v1/user/estates` — metadata list. Optional `limit`.

### `heir_vault_get`
Requires `vaultId`. Returns metadata from the estates list only.

### `heir_vault_create` / `heir_vault_update`
`POST /api/v1/user/estates` with **client-encrypted** payload:

| Parameter | Required |
|-----------|----------|
| `encryptedData` | yes |
| `saltHex` | yes |
| `iv` | yes |
| `name` / `title` | no |
| `metadata` | no |

Without encryption fields the tool returns a structured error (does not invent plaintext vaults).

---

## Jurisdictions (4)

### `heir_jurisdiction_list`
`GET /api/v1/jurisdictions` — optional client filters `region`, `legalSystem`.

### `heir_jurisdiction_get`
`GET /api/v1/jurisdictions/:code` — `code` required.

### `heir_jurisdiction_compare`
Fetches each code in `codes[]` (min 2) and returns side-by-side payloads.

### `heir_jurisdiction_search`
Client-side filter over the list using `query` / `features`.

---

## Legal (4)

### `heir_legal_generate_will`

`POST /api/v1/legal/generate` with `type: "will"` and `formData`.

### `heir_legal_generate_trust`

`POST /api/v1/legal/generate` with `type: "trust"` and `formData`.

### `heir_legal_generate_poa`

`POST /api/v1/legal/generate` with `type: "poa"` and `formData`.

All three require an API key bound to a user (`HEIR_API_KEY`).

### `heir_legal_list_templates`
`GET /api/v1/legal/types/:jurisdiction` (default `us`).

E-sign is a separate REST flow (`POST /legal/sign`) and needs OpenSign env on the server.

---

## Chat (3)

All map to `POST /api/v1/chat` (fallback `/api/chat`):

| Tool | Behavior |
|------|----------|
| `heir_chat_estate_planning` | Passes `message` (+ optional context) |
| `heir_chat_explain_template` | Structured prompt from `template` |
| `heir_chat_recommend_plan` | Structured prompt from situation fields |

---

## Not claimed

| Item | Status |
|------|--------|
| “100+ MCP tools” | False |
| Legacy monorepo calculator tools on npm bin | Railway `index.js` only, not npm bin |
| Public hosted Streamable `mcp.heir.es` as guaranteed URL | Not documented as SLA |

## Rate limits

Tool HTTP calls use developer plan + API-key tier limits — [API tiers](/pricing/api-tiers).
