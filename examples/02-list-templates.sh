#!/usr/bin/env bash
# List inheritance contract templates (API key).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")" && pwd)"
# shellcheck source=lib.sh
source "${ROOT}/lib.sh"
require_key

echo "==> GET ${HEIR_API_BASE}/api/v1/contracts/templates"
curl -sS --fail-with-body \
  -H "Authorization: Bearer ${HEIR_API_KEY}" \
  -H "Accept: application/json" \
  "${HEIR_API_BASE}/api/v1/contracts/templates" | json_pp
