// Serves the REAL /api handlers from the repo over HTTP with a MOCKED provider fetch (Cloudflare/Groq calls never leave the machine).
// Used to self-test scripts/ai-smoke.mjs and scripts/security-headers.mjs offline.
import http from 'node:http';
import path from 'node:path';
import { createRequire } from 'node:module';
import { REPO } from './lib.mjs';
const require = createRequire(import.meta.url);

export async function startMockApi({ port = 0, providerMode = 'ok' } = {}) {
  process.env.CLOUDFLARE_LLM_ACCOUNT_ID = 'mock'; process.env.CLOUDFLARE_LLM_AI_TOKEN = 'mock-token'; process.env.GROQ_API_KEY = 'mock-groq';
  process.env.CLOUDFLARE_ACCOUNT_ID = 'mock'; process.env.CLOUDFLARE_AI_TOKEN = 'mock-token';
  const stats = { providerCalls: 0 };
  const realFetch = globalThis.fetch;
  globalThis.fetch = async (url, init) => {
    const u = String(url);
    if (/api\.cloudflare\.com|api\.groq\.com/.test(u)) {
      stats.providerCalls++;
      if (providerMode === '500') return new Response('{"error":{"message":"boom"}}', { status: 500 });
      return u.includes('groq') ? new Response(JSON.stringify({ choices: [{ message: { content: 'Το κλάσμα δείχνει ένα μέρος ενός όλου.' } }] }), { status: 200 })
        : new Response(JSON.stringify({ success: true, result: { response: 'Το κλάσμα δείχνει ένα μέρος ενός όλου.' } }), { status: 200 });
    }
    return realFetch(url, init);
  };
  const server = http.createServer(async (req, res) => {
    const url = new URL(req.url, 'http://x'); const m = url.pathname.match(/^\/api\/([a-z-]+)$/);
    if (!m) { res.writeHead(404); return res.end('not found'); }
    let raw = ''; for await (const c of req) raw += c;
    let body; try { body = raw ? JSON.parse(raw) : undefined; } catch { body = undefined; }
    const fake = { method: req.method, body, query: Object.fromEntries(url.searchParams), headers: req.headers };
    const out = { status: 200, headers: { 'Content-Type': 'application/json' }, json: (b) => { res.writeHead(out.status, out.headers); res.end(JSON.stringify(b)); return out; }, status_: 200 };
    const r = { setHeader: (k, v) => { out.headers[k] = v; }, status: (c) => { out.status = c; return r; }, json: (b) => out.json(b) };
    try { await require(path.join(REPO, 'api', m[1] + '.js'))(fake, r); } catch (e) { res.writeHead(500); res.end('handler crash ' + e.message); }
  });
  await new Promise((r) => server.listen(port, '127.0.0.1', r));
  return { server, url: `http://127.0.0.1:${server.address().port}`, stats, close: () => { globalThis.fetch = realFetch; server.close(); } };
}
if (process.argv[1] === new URL(import.meta.url).pathname) { const s = await startMockApi({ port: Number(process.env.PORT || 4174) }); console.log('mock API on', s.url); }
