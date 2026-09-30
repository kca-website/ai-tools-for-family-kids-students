// One-command runner:  npm run qa            (full suite, local emulation of vercel.json; live steps auto-skip when the site is unreachable)
//                      npm run smoke         (< 2 min: API-handler tests + @smoke Playwright tests)
//                      BASE_URL=https://www.aitools4kids.gr npm run qa   (run browser tests + live checks against production)
// Flags: --smoke  --no-crawl  --lighthouse  --strict (unreachable live steps count as failures)
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { QA_DIR, RESULTS } from './lib.mjs';

const flags = new Set(process.argv.slice(2));
const smoke = flags.has('--smoke');
const steps = [];
const run = (name, cmd, args, { allowExit = [0], skipOn = [] } = {}) => {
  const t0 = Date.now();
  process.stdout.write(`\n▶ ${name}\n`);
  const r = spawnSync(cmd, args, { cwd: QA_DIR, stdio: 'inherit', env: process.env });
  const status = allowExit.includes(r.status) ? 'PASS' : skipOn.includes(r.status) ? (flags.has('--strict') ? 'FAIL' : 'SKIPPED (site unreachable from this runner)') : 'FAIL';
  steps.push({ name, status, seconds: Math.round((Date.now() - t0) / 1000), exit: r.status });
};
const pw = (project, extra = []) => ['playwright', 'test', `--project=${project}`, ...extra];

run('Inventory (routes / sitemaps / APIs)', 'node', ['scripts/inventory.mjs']);
const nodeTests = fs.readdirSync(path.join(QA_DIR, 'tests')).filter((f) => f.endsWith('.mjs')).map((f) => `tests/${f}`);
run('API handlers with mocked providers + self-tests of the QA scripts', 'node', ['--test', ...nodeTests]);
if (smoke) {
  run('Playwright @smoke (Chromium desktop)', 'npx', pw('smoke'));
} else {
  run('Playwright – Chromium desktop', 'npx', pw('chromium-desktop'));
  run('Playwright – Chromium mobile 375 px', 'npx', pw('chromium-mobile375'));
  if (fs.existsSync(path.join(process.env.PLAYWRIGHT_BROWSERS_PATH || `${process.env.HOME}/.cache/ms-playwright`)) && fs.readdirSync(process.env.PLAYWRIGHT_BROWSERS_PATH || `${process.env.HOME}/.cache/ms-playwright`).some((d) => d.startsWith('webkit'))) {
    run('Playwright – WebKit desktop + mobile', 'npx', ['playwright', 'test', '--project=webkit-desktop', '--project=webkit-mobile375']);
  } else steps.push({ name: 'Playwright – WebKit', status: 'SKIPPED (WebKit not installed: npx playwright install webkit)', seconds: 0 });
  if (!flags.has('--no-crawl')) run('Crawl every page (status/console/network/overflow, desktop + 375 px)', 'node', ['scripts/crawl.mjs']);
  if (flags.has('--lighthouse')) run('Lighthouse (8 pages × mobile/desktop)', 'node', ['scripts/lighthouse.mjs']);
  run('Live: security headers / redirects / CORS', 'node', ['scripts/security-headers.mjs'], { skipOn: [2] });
  run('Live: AI endpoints smoke (≤ 30 requests)', 'node', ['scripts/ai-smoke.mjs'], { skipOn: [2] });
  run('Live: link check (external + internal, ΕΝΓ + tools catalogue reported separately)', 'node', ['scripts/link-check.mjs'], { skipOn: [2] });
}
fs.writeFileSync(path.join(RESULTS, 'run-summary.json'), JSON.stringify({ at: new Date().toISOString(), smoke, steps }, null, 2));
console.log('\n──────── QA summary ────────');
for (const s of steps) console.log(`${s.status.startsWith('PASS') ? '✔' : s.status.startsWith('SKIP') ? '➖' : '✖'} ${s.name.padEnd(78)} ${s.status.padEnd(12)} ${s.seconds}s`);
console.log('Known findings are encoded as expected-failures (test.fail) – see REPORT.md; a test that starts PASSING unexpectedly means a finding was fixed.');
process.exit(steps.some((s) => s.status === 'FAIL') ? 1 : 0);
