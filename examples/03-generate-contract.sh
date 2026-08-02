#!/usr/bin/env bash
# Generate a sample EVM inheritance contract (API key + contracts scope).
# Uses placeholder addresses — replace with real ones in your app.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")" && pwd)"
# shellcheck source=lib.sh
source "${ROOT}/lib.sh"
require_key

OWNER="${HEIR_OWNER_ADDRESS:-0x0000000000000000000000000000000000000001}"
HEIR_ADDR="${HEIR_BENEFICIARY_ADDRESS:-0x0000000000000000000000000000000000000002}"

echo "==> POST ${HEIR_API_BASE}/api/v1/contracts/generate"
curl -sS --fail-with-body \
  -X POST \
  -H "Authorization: Bearer ${HEIR_API_KEY}" \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  "${HEIR_API_BASE}/api/v1/contracts/generate" \
  -d "$(cat <<EOF
{
  "blockchain": "evm",
  "ownerAddress": "${OWNER}",
  "beneficiaries": [
    {
      "name": "Example Heir",
      "address": "${HEIR_ADDR}",
      "percentage": 100
    }
  ]
}
EOF
)" | json_pp
