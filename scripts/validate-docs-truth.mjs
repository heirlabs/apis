#!/usr/bin/env node
/**
 * Fail the build/test if docs reintroduce known LARP / wrong-path claims.
 * Scans markdown under docs/ (excluding jurisdiction country bulk pages).
 *
 * Run: node scripts/validate-docs-truth.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const DOCS = path.join(ROOT, 'docs');

/** @type {{ id: string, re: RegExp, allow?: (file: string, line: string) => boolean, message: string }[]} */
const RULES = [
  {
    id: 'wrong-mcp-package',
    re: /@heir\/mcp/,
    // Allow explicit "do not use @heir/mcp" warnings
    allow: (_f, line) =>
      /does\s+\*\*not\*\*|does not exist|not published|Do not use|not `@heir\/mcp`|not @heir\/mcp|Wrong name|remove `@heir\/mcp`|Wrong package|Package `@heir\/mcp`|Use `@morbidcorp\/heir`|404/i.test(
        line
      ),
    message: 'Use @morbidcorp/heir; @heir/mcp is not on npm',
  },
  {
    id: 'memoir-wrong-base',
    re: /\/api\/heirloom(?:\/|"|'|`|\s|\*|$)/,
    allow: (_f, line) =>
      /not\s+`?\/api\/heirloom|wrong|returns \*\*404\*\*|not `\/api\/heirloom|older drafts said|`\/api\/heirloom\/\*`\s*\||\| `\/api\/heirloom/i.test(
        line
      ) || /\/api\/heirlooms/.test(line),
    message: 'Memoir base path is /api/memoir (not /api/heirloom)',
  },
  {
    id: 'mcp-100-plus',
    re: /100\+\s*MCP\s*tools|all 100\+\s*MCP/i,
    allow: (_f, line) => /False|not claimed|do not|remove|LARP|false/i.test(line),
    message: 'Published MCP package has 18 tools, not 100+',
  },
  {
    id: 'official-rest-sdks',
    re: /Official SDKs for JavaScript,\s*Python,\s*and Go/i,
    message: 'No official REST language SDKs are published',
  },
  {
    id: 'legal-coming-soon',
    re: /Legal document generation endpoints are coming in v1\.1/,
    message: 'Legal API is live; do not mark as coming soon',
  },
  {
    id: 'mcp-heir-es-host',
    // bare URL as recommended host; allow "fictional" / "do not" / "not a" prose
    re: /https:\/\/mcp\.heir\.es/,
    allow: (_f, line) =>
      /fictional|do not|Do not|not a documented|unless you|not guaranteed|broken|not point/i.test(
        line
      ),
    message: 'Do not document mcp.heir.es as a guaranteed public host',
  },
  {
    id: 'npx-bin-unpinned-legacy',
    re: /@morbidcorp\/heir(?![@\/]|\s|`|"|'|\)|,)/,
    allow: (_f, line) =>
      /2\.0\.5|2\.0\.4|2\.0\.2|dist\/cli|broken|2\.0\.1|bin|package|@morbidcorp\/heir@/i.test(line),
    message: 'Prefer pinned @morbidcorp/heir@2.0.5 in install examples',
  },
  {
    id: 'heir-sk-prefix',
    re: /heir_sk_your_api_key/,
    message: 'Document heir_pk_ product keys, not heir_sk_',
  },
  {
    id: 'internal-key-prefix',
    re: /heir_in_/,
    allow: (_f, line) =>
      /wrong|not used|not the prefix|do not|don't|incorrect|not `heir_in_`/i.test(line),
    message: 'Internal keys use `heir_sk_`.',
  },
  {
    id: 'false-v1-sunset',
    re: /2026-07-01|July 1, 2026/,
    allow: (_f, line) =>
      /wrong|not removed|not a sunset|not sunset|never sunset|false|not a \S+ sunset|did not happen|was copy|stale until/i.test(
        line
      ),
    message: 'Do not claim `/api/*` was sunset 2026-07-01.',
  },
  {
    id: 'swarm-as-home',
    re: /\/swarm/,
    allow: (_f, line) =>
      /never|not [`'"]?\/swarm|do not send|don't send|do not go|do not use|not product home|older advisor|multi-tab|do not use as/i.test(
        line
      ),
    message: 'Paid home is `/interview`.',
  },
];

/** Working dist/cli.js tool names (18) — source of truth for docs */
const MCP_REQUIRED_TOOLS = [
  'heir_contract_list_templates',
  'heir_contract_generate',
  'heir_contract_estimate_gas',
  'heir_vault_list',
  'heir_vault_get',
  'heir_vault_create',
  'heir_vault_update',
  'heir_jurisdiction_list',
  'heir_jurisdiction_get',
  'heir_jurisdiction_compare',
  'heir_jurisdiction_search',
  'heir_legal_generate_will',
  'heir_legal_generate_trust',
  'heir_legal_generate_poa',
  'heir_legal_list_templates',
  'heir_chat_estate_planning',
  'heir_chat_explain_template',
  'heir_chat_recommend_plan',
];
function walk(dir, out = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      if (ent.name === 'countries' || ent.name === 'node_modules' || ent.name === 'dist' || ent.name === 'cache') {
        continue;
      }
      walk(full, out);
    } else if (ent.isFile() && /\.(md|js|mjs|json)$/.test(ent.name)) {
      out.push(full);
    }
  }
  return out;
}

function main() {
  const files = walk(DOCS);
  const configJs = path.join(DOCS, '.vitepress', 'config.js');
  if (fs.existsSync(configJs)) files.push(configJs);
  const srcOpenapi = path.join(ROOT, 'src', 'docs', 'openapi.js');
  if (fs.existsSync(srcOpenapi)) files.push(srcOpenapi);

  /** @type {{ file: string, line: number, id: string, text: string, message: string }[]} */
  const violations = [];

  for (const file of files) {
    const rel = path.relative(ROOT, file);
    const text = fs.readFileSync(file, 'utf8');
    const lines = text.split(/\r?\n/);
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      for (const rule of RULES) {
        if (!rule.re.test(line)) continue;
        if (rule.allow?.(rel, line)) continue;
        violations.push({
          file: rel,
          line: i + 1,
          id: rule.id,
          text: line.trim().slice(0, 160),
          message: rule.message,
        });
      }
    }
  }

  // Social X link must be heirlegacy
  if (fs.existsSync(configJs)) {
    const cfg = fs.readFileSync(configJs, 'utf8');
    if (!cfg.includes("https://x.com/heirlegacy")) {
      violations.push({
        file: 'docs/.vitepress/config.js',
        line: 0,
        id: 'x-link',
        text: 'socialLinks x icon',
        message: 'X social link must be https://x.com/heirlegacy',
      });
    }
    if (cfg.includes('https://x.com/heir_es')) {
      violations.push({
        file: 'docs/.vitepress/config.js',
        line: 0,
        id: 'x-link-old',
        text: 'heir_es',
        message: 'Remove https://x.com/heir_es social link',
      });
    }
  }

  // MCP tools page must document all 18 published tools
  const toolsPath = path.join(DOCS, 'mcp', 'tools.md');
  if (fs.existsSync(toolsPath)) {
    const toolsMd = fs.readFileSync(toolsPath, 'utf8');
    for (const name of MCP_REQUIRED_TOOLS) {
      if (!toolsMd.includes(`\`${name}\``) && !toolsMd.includes(`### \`${name}\``)) {
        violations.push({
          file: 'docs/mcp/tools.md',
          line: 0,
          id: 'missing-tool',
          text: name,
          message: `MCP tools page must document tool ${name}`,
        });
      }
    }
    if (!/18/.test(toolsMd)) {
      violations.push({
        file: 'docs/mcp/tools.md',
        line: 0,
        id: 'tool-count',
        text: 'missing 18',
        message: 'MCP tools page must state the 18-tool count',
      });
    }
    if (!toolsMd.includes('2.0.5')) {
      violations.push({
        file: 'docs/mcp/tools.md',
        line: 0,
        id: 'mcp-pin',
        text: 'missing 2.0.5',
        message: 'MCP tools page must mention 2.0.5',
      });
    }
    if (!toolsMd.includes('heir_capabilities_search')) {
      violations.push({
        file: 'docs/mcp/tools.md',
        line: 0,
        id: 'mcp-default-tools',
        text: 'missing heir_capabilities_search',
        message: 'MCP tools page must mention heir_capabilities_search',
      });
    }
  } else {
    violations.push({
      file: 'docs/mcp/tools.md',
      line: 0,
      id: 'missing-file',
      text: '',
      message: 'docs/mcp/tools.md is required',
    });
  }

  // Product paths page is required
  const productPaths = path.join(DOCS, 'guide', 'product-paths.md');
  if (!fs.existsSync(productPaths)) {
    violations.push({
      file: 'docs/guide/product-paths.md',
      line: 0,
      id: 'product-paths-missing',
      text: '',
      message: 'docs/guide/product-paths.md is required',
    });
  } else {
    const pathsMd = fs.readFileSync(productPaths, 'utf8');
    for (const required of ['/interview', '/login', '/welcome', '/dashboard', '/desk', '/developers']) {
      if (!pathsMd.includes(required)) {
        violations.push({
          file: 'docs/guide/product-paths.md',
          line: 0,
          id: 'product-paths-missing-url',
          text: required,
          message: `docs/guide/product-paths.md must contain ${required}`,
        });
      }
    }
  }

  // Memoir page must use /api/memoir endpoints
  const memoirPath = path.join(DOCS, 'api', 'memoir.md');
  if (fs.existsSync(memoirPath)) {
    const memoir = fs.readFileSync(memoirPath, 'utf8');
    if (!memoir.includes('/api/memoir/setup')) {
      violations.push({
        file: 'docs/api/memoir.md',
        line: 0,
        id: 'memoir-setup',
        text: '',
        message: 'memoir.md must document /api/memoir/setup',
      });
    }
    if (/GET \/api\/heirloom\//.test(memoir)) {
      violations.push({
        file: 'docs/api/memoir.md',
        line: 0,
        id: 'memoir-live-heirloom',
        text: '',
        message: 'memoir.md must not list live GET /api/heirloom/* endpoints',
      });
    }
  }

  // Legal must not be coming soon only
  const legalPath = path.join(DOCS, 'api', 'legal.md');
  if (fs.existsSync(legalPath)) {
    const legal = fs.readFileSync(legalPath, 'utf8');
    if (!legal.includes('/api/v1/legal/generate') && !legal.includes('POST /api/v1/legal/generate')) {
      violations.push({
        file: 'docs/api/legal.md',
        line: 0,
        id: 'legal-generate',
        text: '',
        message: 'legal.md must document POST /api/v1/legal/generate',
      });
    }
    if (/::: info Coming Soon/.test(legal)) {
      violations.push({
        file: 'docs/api/legal.md',
        line: 0,
        id: 'legal-coming-soon-block',
        text: '',
        message: 'legal.md must not use Coming Soon info block',
      });
    }
  }

  // Live path probes (optional network — skip if offline)
  const liveChecks = [
    { url: 'https://api.heir.es/api/heirloom', expectStatus: 404, id: 'live-heirloom-404' },
    { url: 'https://api.heir.es/api/memoir', expectStatus: 401, id: 'live-memoir-401' },
    { url: 'https://api.heir.es/api/heirlooms/catalog', expectStatus: 200, id: 'live-heirlooms-catalog' },
    { url: 'https://registry.npmjs.org/@morbidcorp/heir', expectStatus: 200, id: 'npm-morbidcorp-heir' },
    { url: 'https://registry.npmjs.org/@heir/mcp', expectStatus: 404, id: 'npm-heir-mcp-404' },
  ];

  const skipLive = process.env.DOCS_TRUTH_SKIP_LIVE === '1';
  const liveResults = [];

  async function runLive() {
    if (skipLive) {
      console.log('SKIP live probes (DOCS_TRUTH_SKIP_LIVE=1)');
      return;
    }
    for (const check of liveChecks) {
      const res = await fetch(check.url, { method: 'GET', redirect: 'manual' });
      const status = res.status;
      liveResults.push({ ...check, status });
      if (status !== check.expectStatus) {
        violations.push({
          file: '(live)',
          line: 0,
          id: check.id,
          text: `${check.url} → ${status}`,
          message: `Expected HTTP ${check.expectStatus}`,
        });
      }
    }
  }

  return runLive().then(() => {
    if (violations.length) {
      console.error('docs truth validation FAILED\n');
      for (const v of violations) {
        console.error(`- [${v.id}] ${v.file}:${v.line} — ${v.message}`);
        if (v.text) console.error(`    ${v.text}`);
      }
      console.error(`\n${violations.length} violation(s)`);
      process.exit(1);
    }
    console.log(`OK — scanned ${files.length} files, ${RULES.length} rules, live=${skipLive ? 'skipped' : liveResults.length}`);
    if (!skipLive) {
      for (const r of liveResults) {
        console.log(`  live ${r.id}: ${r.url} → ${r.status}`);
      }
    }
    process.exit(0);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(2);
});
