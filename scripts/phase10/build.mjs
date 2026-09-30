// Phase 10: generates the SEO landing pages and keeps seo-sitemap.xml / sitemap-index.xml in sync.
//   node scripts/phase10/build.mjs          write pages + sitemap
//   node scripts/phase10/build.mjs --check  fail if the committed files differ from the data-driven output
import fs from 'node:fs';
import path from 'node:path';
import { REPO, ORIGIN, MODIFIED, loadData, renderPage } from './lib.mjs';
import { subjectPages } from './pages-subjects.mjs';
import { audiencePages } from './pages-audience.mjs';

export function buildAll() {
  const d = loadData();
  const specs = [...audiencePages.map((f) => f(d)), ...subjectPages];
  const seen = new Set();
  const out = specs.map((spec) => {
    if (seen.has(spec.slug)) throw new Error(`duplicate slug ${spec.slug}`);
    seen.add(spec.slug);
    return { spec, file: `${spec.slug}.html`, html: renderPage(d, spec) };
  });
  return out;
}

const sitemapPath = path.join(REPO, 'seo-sitemap.xml');
const indexPath = path.join(REPO, 'sitemap-index.xml');

export function buildSitemap(slugs) {
  let xml = fs.readFileSync(sitemapPath, 'utf8');
  for (const slug of slugs) {
    const loc = `${ORIGIN}/${slug}.html`;
    const entry = `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${MODIFIED}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
    const re = new RegExp(`  <url>\\s*<loc>${loc.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}</loc>[\\s\\S]*?</url>\\n`);
    xml = re.test(xml) ? xml.replace(re, entry) : xml.replace('</urlset>', `${entry}</urlset>`);
  }
  let idx = fs.readFileSync(indexPath, 'utf8');
  idx = idx.replace(/(<loc>https:\/\/www\.aitools4kids\.gr\/seo-sitemap\.xml<\/loc><lastmod>)[^<]*(<\/lastmod>)/, `$1${MODIFIED}$2`);
  return { xml, idx };
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(new URL(import.meta.url).pathname)) {
  const check = process.argv.includes('--check');
  const pages = buildAll();
  const { xml, idx } = buildSitemap(pages.map((p) => p.spec.slug));
  const files = [...pages.map((p) => [p.file, p.html]), ['seo-sitemap.xml', xml], ['sitemap-index.xml', idx]];
  let stale = 0;
  for (const [name, content] of files) {
    const full = path.join(REPO, name);
    const cur = fs.existsSync(full) ? fs.readFileSync(full, 'utf8') : null;
    if (cur === content) continue;
    if (check) { console.error(`STALE ${name}`); stale++; } else { fs.writeFileSync(full, content); console.log(`wrote ${name}`); }
  }
  if (check && stale) { console.error('Run: node scripts/phase10/build.mjs'); process.exit(1); }
  if (check) console.log(`phase10 build check ok (${pages.length} pages)`);
}
