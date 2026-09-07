import { chromium } from 'playwright';
import axe from 'axe-core';

const LOCAL = 'http://127.0.0.1:4173/';
const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

function focusDescriptor(value) {
  if (!value) return '<none>';
  const id = value.id ? `#${value.id}` : '';
  const cls = value.className ? `.${String(value.className).trim().split(/\s+/).filter(Boolean).join('.')}` : '';
  return `${value.tagName?.toLowerCase() || 'unknown'}${id}${cls}`;
}

async function injectAxe(page) {
  await page.addScriptTag({ content: axe.source });
}

async function scan(page, label) {
  await injectAxe(page);
  const result = await page.evaluate(async (tags) => {
    const output = await window.axe.run(document, {
      runOnly: { type: 'tag', values: tags },
      resultTypes: ['violations', 'incomplete'],
    });
    return {
      violations: output.violations.map((item) => ({
        id: item.id,
        impact: item.impact,
        help: item.help,
        helpUrl: item.helpUrl,
        nodes: item.nodes.map((node) => ({
          target: node.target,
          html: node.html,
          failureSummary: node.failureSummary,
        })),
      })),
      incomplete: output.incomplete.map((item) => ({
        id: item.id,
        impact: item.impact,
        help: item.help,
        helpUrl: item.helpUrl,
        nodeCount: item.nodes.length,
      })),
    };
  }, WCAG_TAGS);

  console.log(`\n=== AXE ${label} ===`);
  console.log(`violations=${result.violations.length} incomplete=${result.incomplete.length}`);
  for (const violation of result.violations) {
    console.log(`VIOLATION ${violation.id} impact=${violation.impact || 'unknown'} nodes=${violation.nodes.length}`);
    console.log(`  ${violation.help}`);
    for (const node of violation.nodes.slice(0, 6)) {
      console.log(`  target: ${JSON.stringify(node.target)}`);
      console.log(`  html: ${node.html.replace(/\s+/g, ' ').slice(0, 260)}`);
      console.log(`  why: ${(node.failureSummary || '').replace(/\s+/g, ' ').slice(0, 420)}`);
    }
  }
  for (const item of result.incomplete) {
    console.log(`REVIEW ${item.id} impact=${item.impact || 'unknown'} nodes=${item.nodeCount} — ${item.help}`);
  }
  return result;
}

async function setTutorAge(page, value) {
  await page.evaluate((nextValue) => {
    const age = document.getElementById('tutorAge');
    if (!age) throw new Error('Missing #tutorAge');
    age.value = nextValue;
    age.dispatchEvent(new Event('change', { bubbles: true }));
  }, value);
}

async function renderMiddleStudentTutor(page) {
  await page.waitForFunction(() => window.AITutor?.render && document.getElementById('tutorMount'), null, { timeout: 30000 });
  await page.evaluate(() => {
    history.replaceState({}, '', '/middle/student/tutor');
    const tutorView = document.getElementById('tutorView');
    if (tutorView) tutorView.hidden = false;
    window.dispatchEvent(new PopStateEvent('popstate'));
    window.AITutor.render({ zoneId: 'middle', roleId: 'student', lang: 'el' });
  });
  await page.waitForSelector('#tutorAge');
}

async function disclosureKeyboardCheck(page) {
  const root = page.locator('#aiHelpTrustBoundary:not([hidden])');
  await root.waitFor();

  const initial = await page.evaluate(() => {
    const el = document.activeElement;
    return { tagName: el?.tagName, id: el?.id, className: el?.className || '' };
  });

  const sequence = [];
  let escaped = false;
  for (let i = 0; i < 8; i += 1) {
    await page.keyboard.press('Tab');
    const state = await page.evaluate(() => {
      const el = document.activeElement;
      return {
        inside: !!el?.closest?.('#aiHelpTrustBoundary'),
        tagName: el?.tagName,
        id: el?.id,
        className: el?.className || '',
      };
    });
    sequence.push(focusDescriptor(state));
    if (!state.inside) escaped = true;
  }

  await page.keyboard.press('Escape');
  await page.waitForFunction(() => document.getElementById('aiHelpTrustBoundary')?.hidden === true);
  const returnedTo = await page.evaluate(() => {
    const el = document.activeElement;
    return { tagName: el?.tagName, id: el?.id, className: el?.className || '' };
  });

  console.log('\n=== KEYBOARD disclosure ===');
  console.log(`initialFocus=${focusDescriptor(initial)}`);
  console.log(`tabSequence=${sequence.join(' -> ')}`);
  console.log(`focusEscapedModal=${escaped}`);
  console.log(`afterEscapeFocus=${focusDescriptor(returnedTo)}`);
  console.log(`escapeClosed=true focusReturned=${returnedTo.id === 'tutorSignIn' || returnedTo.id === 'tutorSwitchAccount'}`);

  return {
    focusEscapedModal: escaped,
    escapeClosed: true,
    focusReturned: returnedTo.id === 'tutorSignIn' || returnedTo.id === 'tutorSwitchAccount',
  };
}

const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const pageErrors = [];
  page.on('pageerror', (error) => pageErrors.push(error.message));
  await page.route('**/_vercel/insights/script.js', (route) => route.fulfill({
    status: 200,
    contentType: 'application/javascript',
    body: '',
  }));

  const reports = [];

  await page.goto(LOCAL, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForFunction(() => document.querySelectorAll('.zone-card').length >= 3, null, { timeout: 30000 });
  reports.push(['homepage', await scan(page, 'homepage')]);

  await page.goto(`${LOCAL}accessibility.html`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForSelector('#a11yTableBody tr');
  reports.push(['accessibility.html', await scan(page, 'accessibility.html')]);

  await page.goto(LOCAL, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForSelector('.zone-card[data-zone="primary"]');
  await page.click('.zone-card[data-zone="primary"]');
  await page.waitForTimeout(200);
  reports.push(['primary zone', await scan(page, 'primary zone')]);

  await page.goto(LOCAL, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await renderMiddleStudentTutor(page);
  reports.push(['middle student tutor', await scan(page, 'middle student tutor')]);

  await setTutorAge(page, '15');
  await page.click('#tutorSignIn');
  await page.waitForFunction(() => window.AITOOLSKIDS_AI_HELP_TRUST_BOUNDARY?.disclosureBeforePuter === true, null, { timeout: 10000 });
  await page.waitForSelector('#aiHelpTrustBoundary:not([hidden])');
  reports.push(['AI Help disclosure', await scan(page, 'AI Help disclosure')]);
  const keyboard = await disclosureKeyboardCheck(page);

  const noJs = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 1280, height: 900 } });
  const noJsPage = await noJs.newPage();
  await noJsPage.goto(`${LOCAL}accessibility.html`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  const noJsTableText = (await noJsPage.locator('#a11yTableBody').textContent())?.trim() || '';
  const noJsRowCount = await noJsPage.locator('#a11yTableBody tr').count();
  console.log('\n=== RESILIENCE accessibility.html without JavaScript ===');
  console.log(`rows=${noJsRowCount} textLength=${noJsTableText.length}`);
  console.log(`hasUsefulFallback=${noJsRowCount > 0 || noJsTableText.length > 20}`);
  await noJs.close();

  const totalViolations = reports.reduce((sum, [, report]) => sum + report.violations.length, 0);
  const uniqueViolationIds = [...new Set(reports.flatMap(([, report]) => report.violations.map((item) => item.id)))];
  console.log('\n=== WCAG 2.2 AUDIT SUMMARY ===');
  console.log(`scans=${reports.length} totalViolationGroups=${totalViolations}`);
  console.log(`uniqueViolationIds=${uniqueViolationIds.join(', ') || '<none>'}`);
  console.log(`disclosureFocusTrap=${keyboard.focusEscapedModal ? 'FAIL' : 'PASS'}`);
  console.log(`disclosureEscape=${keyboard.escapeClosed ? 'PASS' : 'FAIL'}`);
  console.log(`disclosureFocusReturn=${keyboard.focusReturned ? 'PASS' : 'FAIL'}`);
  console.log(`accessibilityNoJsFallback=${noJsRowCount > 0 || noJsTableText.length > 20 ? 'PASS' : 'FAIL'}`);

  if (pageErrors.length) {
    throw new Error(`Page errors during audit:\n${pageErrors.join('\n')}`);
  }
} finally {
  await browser.close();
}
