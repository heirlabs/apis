#!/usr/bin/env bash
# Shared helpers for HEIR API examples.
set -euo pipefail

HEIR_API_BASE="${HEIR_API_BASE:-https://api.heir.es}"

json_pp() {
  if command -v jq >/dev/null 2>&1; then
    jq .
  else
    cat
  fi
}

require_key() {
  if [[ -z "${HEIR_API_KEY:-}" ]]; then
    echo "error: set HEIR_API_KEY to a heir_pk_… key from https://heir.es/developers" >&2
    exit 1
  fi
}

auth_headers() {
  require_key
  echo -H "Authorization: Bearer ${HEIR_API_KEY}"
  echo -H "Accept: application/json"
}
