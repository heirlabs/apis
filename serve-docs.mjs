/**
 * Static file server for the built VitePress docs (docs.heir.es).
 *
 * Zero dependencies on purpose: the runtime image ships only Node + the built
 * `dist/`, so the docs container carries none of this repo's API dependencies
 * (mongoose, express, jwt...) and has a correspondingly small attack surface.
 *
 * Two deploy lessons from this platform are baked in and must not be undone:
 *
 *   1. listen(PORT, '0.0.0.0') — incident #364: binding the IPv6 wildcard on a
 *      slim Debian base (bindv6only=1) silently black-holes Railway's IPv4
 *      proxy traffic. The container looks healthy and is unreachable.
 *   2. Every resolved path is confined to ROOT before it is opened. Decoding
 *      then joining user input is how directory traversal happens.
 */

import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, 'docs/.vitepress/dist');
const PORT = Number(process.env.PORT) || 3001;

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json',
};

/** Resolve a request path to a real file inside ROOT, or null. */
async function resolveFile(urlPath) {
  let decoded;
  try {
    decoded = decodeURIComponent(urlPath);
  } catch {
    return null; // malformed percent-encoding
  }
  if (decoded.includes('\0')) return null;

  // Normalise BEFORE resolving so `..` segments are collapsed, then confine to
  // ROOT. path.join alone would happily walk out of the directory.
  const normalised = path.normalize(decoded).replace(/^(\.\.[/\\])+/, '');
  const target = path.resolve(ROOT, `.${path.sep}${normalised}`);
  if (target !== ROOT && !target.startsWith(ROOT + path.sep)) return null;

  // VitePress emits real .html files: try exact, then `.html`, then dir index.
  const candidates = [target];
  if (!path.extname(target)) {
    candidates.push(`${target}.html`, path.join(target, 'index.html'));
  }

  for (const candidate of candidates) {
    try {
      const stats = await stat(candidate);
      if (stats.isFile()) return { file: candidate, size: stats.size };
    } catch {
      // try the next candidate
    }
  }
  return null;
}

function cacheControl(file) {
  // Asset filenames are content-hashed by Vite, so they can be cached hard.
  // HTML must revalidate or deploys won't be visible.
  if (file.endsWith('.html')) return 'public, max-age=0, must-revalidate';
  if (file.includes(`${path.sep}assets${path.sep}`)) return 'public, max-age=31536000, immutable';
  return 'public, max-age=3600';
}

// Carried over from vercel.json so the move off Vercel changes no response
// behaviour. If you drop these, the site silently loses its security headers.
const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
};

// Also from vercel.json — permanent redirects that existing links rely on.
const REDIRECTS = new Map([
  ['/docs', '/'],
  ['/api-reference', '/api/'],
]);

function send(res, status, file, size, method) {
  const type = TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream';
  res.writeHead(status, {
    ...SECURITY_HEADERS,
    'Content-Type': type,
    'Content-Length': size,
    'Cache-Control': cacheControl(file),
  });
  if (method === 'HEAD') return res.end();
  return createReadStream(file).pipe(res);
}

const server = http.createServer(async (req, res) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405, { Allow: 'GET, HEAD' });
    return res.end();
  }

  const rawUrl = req.url || '/';
  const urlPath = rawUrl.split('?')[0].split('#')[0];

  const redirectTo = REDIRECTS.get(urlPath.replace(/\/+$/, '') || '/');
  if (redirectTo && redirectTo !== urlPath) {
    res.writeHead(301, { ...SECURITY_HEADERS, Location: redirectTo });
    return res.end();
  }

  // Railway healthcheck. Answered before any filesystem work so it stays true
  // to "is this process serving?" and never depends on a docs page existing.
  if (urlPath === '/healthz') {
    const body = JSON.stringify({ ok: true, service: 'heir-docs' });
    res.writeHead(200, {
      'Content-Type': 'application/json; charset=utf-8',
      'Content-Length': Buffer.byteLength(body),
      'Cache-Control': 'no-store',
    });
    return res.end(req.method === 'HEAD' ? undefined : body);
  }

  const hit = await resolveFile(urlPath);
  if (hit) return send(res, 200, hit.file, hit.size, req.method);

  const notFound = await resolveFile('/404.html');
  if (notFound) return send(res, 404, notFound.file, notFound.size, req.method);

  res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
  return res.end('Not found');
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`[heir-docs] serving ${ROOT} on 0.0.0.0:${PORT}`);
});

for (const signal of ['SIGTERM', 'SIGINT']) {
  process.on(signal, () => server.close(() => process.exit(0)));
}
