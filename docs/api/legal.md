# Legal Documents API

Generate, store, encrypt, and e-sign complementary legal documents that sit
alongside smart contracts (wills, trusts, POA, healthcare directives, and more).

**Base paths:**

| Prefix | Auth |
|--------|------|
| `/api/legal/*` | Session JWT (`router.use(authenticateToken)`) |
| `/api/v1/legal/*` | Hybrid auth with scopes `legal` or `legal:read` (still requires a resolved user for ownership) |

::: tip Live API
This surface is **live** on production (`api.heir.es`). It is not a future v1.1
placeholder. E-signature returns **503** with `OPENSIGN_UNAVAILABLE` when
`OPENSIGN_API_KEY` is unset — that is intentional fail-closed behavior, not a
fake “pending signature” state.
:::

**Not legal advice.** Generated PDFs are drafting aids. Formalities, witnesses,
notaries, and court validity are jurisdiction-specific; see also
`/api/legal/formalities` on the product app for formality workflows (session).

---

## Document types (generate)

`POST .../generate` accepts `type` in:

| type | Description |
|------|-------------|
| `will` | Last will & testament |
| `trust` | Living trust |
| `poa` | Power of attorney |
| `healthcare_directive` | Healthcare directive |
| `hipaa` | HIPAA release |
| `digital-asset-list` | Digital asset inventory |
| `beneficiary-designations` | Account beneficiary tracking |
| `pod-tod` | POD / TOD designations |
| `letter-of-intent` | Letter of intent |
| `ethical-will` | Ethical will |
| `gifts-memories` | Gifts and memories |
| `disposition-of-remains` | Disposition of remains |

---

## POST /api/v1/legal/generate

Generate and store a document for the authenticated user.

```http
POST /api/v1/legal/generate
Authorization: Bearer heir_pk_...
Content-Type: application/json
```

```json
{
  "type": "will",
  "jurisdiction": "us",
  "formData": { },
  "encryption": true,
  "estateId": "optional-estate-id"
}
```

| Field | Required | Notes |
|-------|----------|-------|
| `type` | yes | One of the generatable types above |
| `formData` | yes | Type-specific form payload |
| `jurisdiction` | no | Defaults per service |
| `encryption` | no | Server-side AES-GCM PDF encryption when enabled |
| `estateId` | no | Link document to an estate |

**Success (shape):**

```json
{
  "documentId": "...",
  "pdfUrl": "https://... or data URL",
  "isEncrypted": false
}
```

When `isEncrypted` is true, `pdfUrl` is null — use preview/download endpoints to
stream decrypted bytes to the owner.

**Errors:** `400` missing type/formData or invalid type; `401` unauthenticated;
`500` generation failure.

Equivalent session path: `POST /api/legal/generate`.

---

## GET /api/v1/legal/types/:jurisdiction

List document type catalog for a jurisdiction (ids, names, witness/notary hints).

```http
GET /api/v1/legal/types/us
Authorization: Bearer heir_pk_...
```

---

## Document CRUD

### GET /api/v1/legal/documents

List the authenticated user’s legal documents.

### GET /api/v1/legal/documents/:id

Fetch one document owned by the user.

### PUT /api/v1/legal/documents/:id

Update a **draft** document (`formData`, encryption options).

### DELETE /api/v1/legal/documents/:id

Delete a document owned by the user.

### POST /api/v1/legal/documents/upload

Upload an existing PDF or image (JPEG/PNG/WebP, max 20MB). Body is multipart
with fields `type`, optional `name`, `jurisdiction`, `estateId`. Uploaded files
are encrypted at rest.

Uploadable `type` values include the generate list plus
`identity-verification`, `family-status`, `property-documents`,
`insurance-documents`.

---

## Preview, download, status

### GET /api/v1/legal/preview/:id

Owner preview of decrypted content (stream or redirect).

### GET /api/v1/legal/download/:id

Owner download of decrypted content.

### GET /api/v1/legal/status/:id

Signature / lifecycle status for a document.

### POST /api/v1/legal/cancel/:id

Cancel an in-flight signature request when applicable.

### POST /api/v1/legal/resend

Resend signing invitations (body identifies document / signers per route).

---

## POST /api/v1/legal/sign

Start e-signature via OpenSign when configured.

```json
{
  "documentId": "...",
  "signers": [
    { "email": "a@example.com", "name": "Alice", "role": "signer" }
  ]
}
```

| Condition | Response |
|-----------|----------|
| Missing `OPENSIGN_API_KEY` | **503** `{ "code": "OPENSIGN_UNAVAILABLE" }` |
| Document not draft | **400** |
| Not owner / missing | **404** |

---

## Estate linking

### POST /api/v1/legal/link

Link a document to an estate / contract context.

### POST /api/v1/legal/unlink

Remove a link.

---

## Life-stage helpers

### GET /api/v1/legal/life-stage

### PUT /api/v1/legal/life-stage

### POST /api/v1/legal/recommendations/:lifeStage

### POST /api/v1/legal/auto-populate

Life-stage recommendations and form auto-populate for the authenticated user.

---

## Encryption helpers

### POST /api/v1/legal/encrypt/:id

Encrypt stored PDF material for a document when using server-side encryption.

### GET /api/v1/legal/encryption-status

Encryption configuration / status for the user’s documents.

PDF encryption uses HKDF-derived keys from `PDF_ENCRYPTION_MASTER_KEY` plus a
per-document salt (salt stored; master key only in env).

---

## Formalities (related, separate mount)

Will formality workflows mount at **`/api/legal/formalities/*`** (session product
API, registered **before** `/api/legal` so the path is not swallowed). Document
them under product/session guides; they are not aliases of the generate route.

---

## Related

- [Contracts](/api/contracts) — on-chain vault generation  
- [Webhooks](/api/webhooks) — includes OpenSign inbound when configured  
- [Authentication](/api/authentication)  
- [Security](/security/)  
