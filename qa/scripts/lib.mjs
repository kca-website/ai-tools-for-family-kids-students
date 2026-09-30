// Shared helpers for the QA suite. Read-only against the site sources.
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { fileURLToPath } from 'node:url';

export const QA_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const REPO = path.resolve(QA_DIR, '..');
export const RESULTS = process.env.QA_RESULTS_DIR ? path.resolve(process.env.QA_RESULTS_DIR) : path.join(QA_DIR, 'results');
export const PROD = 'https://www.aitools4kids.gr';
fs.mkdirSync(RESULTS, { recursive: true });

export function walkHtml(dir = REPO, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (['node_modules', '.git', 'qa', 'benchmark', 'tests', 'docs'].includes(e.name)) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walkHtml(p, out);
    else if (e.name.endsWith('.html')) out.push(p);
  }
  return out;
}
export const rel = (p) => '/' + path.relative(REPO, p).split(path.sep).join('/');

const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json', '.xml': 'application/xml', '.png': 'image/png', '.svg': 'image/svg+xml', '.webmanifest': 'application/manifest+json', '.txt': 'text/plain', '.mp4': 'video/mp4', '.webp': 'image/webp', '.jpg': 'image/jpeg' };

/** Local server emulating vercel.json routing (filesystem first, /primary|middle|high/* -> "/", catch-all -> "/").
 *  Deliberately adds NO security headers: it reproduces what the repo config would serve. */
export function startLocalServer(port = 0) {
  const server = http.createServer((req, res) => {
    const url = new URL(req.url, 'http://x');
    let p = decodeURIComponent(url.pathname);
    if (p === '/preschool') p = '/preschool.html';
    let file = path.join(REPO, p);
    const inRepo = file.startsWith(REPO) && !file.startsWith(QA_DIR) && !file.includes(`${path.sep}.git`);
    const headers = {};
    let status = 200;
    if (!(inRepo && fs.existsSync(file) && fs.statSync(file).isFile())) {
      if (/^\/(primary|middle|high)\//.test(p)) headers['X-Robots-Tag'] = 'noindex, follow';
      file = path.join(REPO, 'index.html'); // catch-all -> "/" with status 200 (soft-404)
    }
    if (p.startsWith('/api/')) {
      // Static server has no functions. GET returns a stub status (with no-store like the real handlers); everything else 405.
      if (req.method === 'GET') { res.writeHead(200, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }); return res.end(JSON.stringify({ configured: true, provider: 'stub', model: 'stub', providers: [], stubAt: Date.now() })); }
      res.writeHead(405, { 'Content-Type': 'application/json' }); return res.end('{"error":"method_not_allowed"}');
    }
    const buf = fs.readFileSync(file);
    headers['Content-Type'] = MIME[path.extname(file)] || 'application/octet-stream';
    res.writeHead(status, headers);
    res.end(buf);
  });
  return new Promise((resolve) => server.listen(port, '127.0.0.1', () => resolve({ server, url: `http://127.0.0.1:${server.address().port}` })));
}
export function write(name, data) {
  fs.writeFileSync(path.join(RESULTS, name), typeof data === 'string' ? data : JSON.stringify(data, null, 2));
}
