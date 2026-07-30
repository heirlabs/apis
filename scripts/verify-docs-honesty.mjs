#!/usr/bin/env node
/**
 * Fail if docs re-introduce known LARP install claims as working instructions.
 * Honesty pages may mention package names while declaring they do not exist.
 */
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'docs');
const bannedInstall = [
  /npm install @heirlabs\/sdk/,
  /npm install @heir\/sdk/,
  /yarn add @heirlabs\/sdk/,
  /pnpm add @heirlabs\/sdk/,
  /pip install heir-sdk/,
  /go get github.com\/heirlabs\/heir-go/,
];
const bannedFutureSunset = [
  /will be removed on \*\*July 1, 2026\*\*/,
  /will be removed on 2026-07-01/,
];

async function walk(dir) {
  const out = [];
  for (const ent of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) out.push(...(await walk(p)));
    else if (/\.(md|mdx|js)$/.test(ent.name)) out.push(p);
  }
  return out;
}

const files = await walk(root);
const failures = [];
for (const file of files) {
  const text = await readFile(file, 'utf8');
  const rel = path.relative(root, file);
  for (const re of bannedInstall) {
    if (re.test(text)) failures.push(`${rel}: banned install pattern ${re}`);
  }
  for (const re of bannedFutureSunset) {
    if (re.test(text)) failures.push(`${rel}: banned sunset claim ${re}`);
  }
}

if (failures.length) {
  console.error('docs honesty check FAILED:');
  for (const f of failures) console.error(' -', f);
  process.exit(1);
}
console.log(`docs honesty check OK (${files.length} files)`);
