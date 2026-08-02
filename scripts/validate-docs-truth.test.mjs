/**
 * Jest-compatible wrapper: executes the truth validator as a child process
 * so the real script path runs (not a mock).
 */
import { spawnSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import { describe, test, expect } from '@jest/globals';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const script = path.join(__dirname, 'validate-docs-truth.mjs');

describe('validate-docs-truth', () => {
  test('passes against current docs tree (live probes on)', () => {
    const result = spawnSync(process.execPath, [script], {
      encoding: 'utf8',
      env: { ...process.env, DOCS_TRUTH_SKIP_LIVE: '0' },
      timeout: 60000,
    });
    if (result.status !== 0) {
      // surface full output for CI diagnosis
      // eslint-disable-next-line no-console
      console.log(result.stdout);
      // eslint-disable-next-line no-console
      console.error(result.stderr);
    }
    expect(result.status).toBe(0);
    expect(result.stdout).toMatch(/OK — scanned/);
  });

  test('offline mode still validates static rules', () => {
    const result = spawnSync(process.execPath, [script], {
      encoding: 'utf8',
      env: { ...process.env, DOCS_TRUTH_SKIP_LIVE: '1' },
      timeout: 30000,
    });
    expect(result.status).toBe(0);
    expect(result.stdout).toMatch(/SKIP live probes|OK — scanned/);
  });
});
