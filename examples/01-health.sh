#!/usr/bin/env bash
# Public health check — no API key required.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")" && pwd)"
# shellcheck source=lib.sh
source "${ROOT}/lib.sh"

echo "==> GET ${HEIR_API_BASE}/api/health"
curl -sS --fail-with-body "${HEIR_API_BASE}/api/health" | json_pp
