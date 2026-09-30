// PHASE 1 – static inventory: pages, sitemap vs files, internal links, local asset refs, API endpoints, third-party hosts.
import fs from 'node:fs';
import path from 'node:path';
import { REPO, PROD, walkHtml, rel, write } from './lib.mjs';

const pages = walkHtml().map(rel).sort();
const sitemapFiles = fs.readdirSync(REPO).filter((f) => /sitemap.*\.xml$/.test(f));
const inSitemap = new Map();
for (const f of sitemapFiles) {
  if (f === 'sitemap-index.xml') continue;
  const xml = fs.readFileSync(path.join(REPO, f), 'utf8');
  for (const m of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) inSitemap.set(m[1].replace(PROD, '') || '/', f);
}
const sitemapDupes = [];
{ const seen = {}; for (const f of sitemapFiles) { if (f==='sitemap-index.xml') continue; const xml = fs.readFileSync(path.join(REPO,f),'utf8'); for (const m of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) { (seen[m[1]] ||= []).push(f);} } for (const [u,fs_] of Object.entries(seen)) if (fs_.length>1) sitemapDupes.push({url:u,files:fs_}); }
const sitemapMissingFile = [...inSitemap.keys()].filter((u) => u !== '/' && !fs.existsSync(path.join(REPO, u)));
const pagesNotInSitemap = pages.filter((p) => !inSitemap.has(p) && p !== '/index.html');

// internal link + asset scan
const broken = []; const linkGraph = {}; const hosts = {};
const fileExists = (u) => {
  let p = u.split('#')[0].split('?')[0];
  if (!p) return true;
  if (p === '/' ) return true;
  if (p === '/preschool') return true;
  return fs.existsSync(path.join(REPO, p)) && fs.statSync(path.join(REPO, p)).isFile();
};
for (const abs of walkHtml()) {
  const html = fs.readFileSync(abs, 'utf8');
  const here = rel(abs);
  for (const m of html.matchAll(/\b(?:href|src)=["']([^"']+)["']/g)) {
    let u = m[1].trim();
    if (/^(mailto:|tel:|javascript:|data:|blob:|#)/.test(u)) continue;
    if (/^https?:\/\//.test(u)) {
      const h = new URL(u).hostname; (hosts[h] ||= new Set()).add(here);
      if (h === 'www.aitools4kids.gr') u = new URL(u).pathname + new URL(u).search; else continue;
    } else if (u.startsWith('//')) { hosts[u.slice(2).split('/')[0]] = (hosts[u.slice(2).split('/')[0]] || new Set()).add(here); continue; }
    if (!u.startsWith('/')) u = path.posix.normalize(path.posix.join(path.posix.dirname(here), u));
    (linkGraph[here] ||= new Set()).add(u.split('#')[0]);
    if (!fileExists(u)) broken.push({ from: here, to: u });
  }
}
// script/asset references inside JS (quoted "/something.ext")
const jsRefs = [];
for (const f of fs.readdirSync(REPO).filter((f) => f.endsWith('.js'))) {
  const src = fs.readFileSync(path.join(REPO, f), 'utf8');
  for (const m of src.matchAll(/["'`](\/(?:[a-zA-Z0-9_\-./]+)\.(?:html|js|css|png|svg|webp|json|webmanifest|mp4))(?:[?#][^"'`]*)?["'`]/g)) {
    if (!fileExists(m[1])) jsRefs.push({ from: '/' + f, to: m[1] });
  }
}
// API endpoints called from the front-end
const apis = {};
for (const f of [...fs.readdirSync(REPO).filter((f) => /\.(js|html)$/.test(f)), ...fs.readdirSync(path.join(REPO,'tools')).map(f=>'tools/'+f)]) {
  const src = fs.readFileSync(path.join(REPO, f), 'utf8');
  for (const m of src.matchAll(/["'`](\/api\/[a-z\-]+)/g)) (apis[m[1]] ||= new Set()).add(f);
}
const apiFiles = fs.readdirSync(path.join(REPO, 'api')).map((f) => '/api/' + f.replace(/\.js$/, ''));
// third-party hosts in JS/HTML/CSS
const thirdparty = {};
for (const f of fs.readdirSync(REPO).filter((f) => /\.(js|css|html|webmanifest)$/.test(f))) {
  const src = fs.readFileSync(path.join(REPO, f), 'utf8');
  for (const m of src.matchAll(/https?:\/\/([a-zA-Z0-9.-]+)/g)) (thirdparty[m[1]] ||= new Set()).add(f);
}
const conv = (o) => Object.fromEntries(Object.entries(o).map(([k, v]) => [k, [...v]]));
const out = {
  generatedAt: new Date().toISOString(),
  htmlPages: pages, sitemapFiles, sitemapUrlCount: inSitemap.size, sitemapDupes, sitemapMissingFile, pagesNotInSitemap,
  brokenInternalLinks: broken, brokenJsAssetRefs: jsRefs,
  apiEndpointsCalledByFrontEnd: Object.fromEntries(Object.entries(conv(apis)).map(([k, v]) => [k, v.slice(0, 6)])),
  apiFilesInRepo: apiFiles,
  unusedApiFiles: apiFiles.filter((a) => !apis[a]),
  externalHostsInHtml: Object.fromEntries(Object.entries(conv(hosts)).map(([k, v]) => [k, v.length])),
  hostsAnywhereInSource: Object.fromEntries(Object.entries(conv(thirdparty)).map(([k, v]) => [k, v.length])),
};
write('inventory.json', out);
console.log(JSON.stringify({ pages: pages.length, sitemapUrls: inSitemap.size, dupes: sitemapDupes.length, sitemapMissingFile, pagesNotInSitemap, broken: broken.length, jsRefsBroken: jsRefs.length, apis: Object.keys(apis), unusedApiFiles: out.unusedApiFiles }, null, 1));
