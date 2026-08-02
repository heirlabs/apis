#!/usr/bin/env node
/**
 * Download the live OpenAPI document into openapi/openapi.json.
 * Used by integrators offline and by CI as a best-effort snapshot.
 */
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'openapi');
const OUT_FILE = path.join(OUT_DIR, 'openapi.json');
const URL =
  process.env.HEIR_OPENAPI_URL ||
  'https://api.heir.es/api/docs/openapi.json';

const res = await fetch(URL, {
  headers: { Accept: 'application/json' },
  signal: AbortSignal.timeout(30_000),
});

if (!res.ok) {
  console.error(`fetch failed: ${res.status} ${res.statusText} for ${URL}`);
  process.exit(1);
}

const text = await res.text();
let parsed;
try {
  parsed = JSON.parse(text);
} catch {
  console.error('response is not valid JSON');
  process.exit(1);
}

const pathCount = Object.keys(parsed.paths || {}).length;
await mkdir(OUT_DIR, { recursive: true });
await writeFile(OUT_FILE, `${JSON.stringify(parsed, null, 2)}\n`, 'utf8');

console.log(
  `wrote ${OUT_FILE} (openapi ${parsed.openapi || '?'}, ${pathCount} paths)`,
);
