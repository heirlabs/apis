#!/usr/bin/env bash
# Public developer plan catalog (no API key required).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")" && pwd)"
# shellcheck source=lib.sh
source "${ROOT}/lib.sh"

echo "==> GET ${HEIR_API_BASE}/api/v1/billing/plans"
curl -sS --fail-with-body \
  -H "Accept: application/json" \
  "${HEIR_API_BASE}/api/v1/billing/plans" | json_pp
