from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]


def read(path):
    return (ROOT / path).read_text(encoding="utf-8")


def write(path, text):
    target = ROOT / path
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(text, encoding="utf-8")


def replace_once(text, old, new, label):
    if new in text:
        return text
    count = text.count(old)
    if count != 1:
        raise SystemExit(f"{label}: expected exactly one match, found {count}")
    return text.replace(old, new, 1)


# Canonical public catalogue-review metadata. This is deliberately separate from deploy/update dates.
write(
    "site-meta.js",
    '''/** Canonical public maintenance metadata. Do not use deploy dates as tool-review dates. */
window.AITOOLSKIDS_SITE_META = Object.freeze({
  version: 1,
  toolCatalogAuditDate: "2026-09-05",
  toolCatalogAuditLabelEl: "Τελευταίος πλήρης έλεγχος καταλόγου εργαλείων: 5 Σεπτεμβρίου 2026",
  toolCatalogAuditLabelEn: "Last full tool-catalog review: 5 September 2026"
});
''',
)

# Homepage: load metadata before app/data strings, make navigator promise primary, and clarify catalogue-review wording.
index = read("index.html")
if '/site-meta.js' not in index:
    m = re.search(r'(?m)^\s*<script\b[^>]*\bsrc="/data\.js"[^>]*></script>\s*$', index)
    if not m:
        raise SystemExit("index.html: could not find /data.js script tag")
    index = index[:m.start()] + '  <script defer src="/site-meta.js"></script>\n' + index[m.start():]

old_el_sub = (
    "Δες σε 2 λεπτά πού χρειάζεται λίγη παραπάνω εξάσκηση ο μαθητής ή ο γονιός\n"
    "          και ποιο δωρεάν AI εργαλείο ταιριάζει ακριβώς εκεί. Για γονείς, μαθητές 6 έως 18\n"
    "          αλλά και εκπαιδευτικούς."
)
new_el_sub = "Βρες το κατάλληλο AI εργαλείο για αυτό που θέλεις να κάνεις και δες πώς να το χρησιμοποιήσεις σωστά. Για γονείς, μαθητές 6 έως 18 και εκπαιδευτικούς."
if new_el_sub not in index:
    if old_el_sub not in index:
        raise SystemExit("index.html: hero subtitle source text not found")
    index = index.replace(old_el_sub, new_el_sub, 1)
index = replace_once(
    index,
    "Τελευταίος έλεγχος στοιχείων εργαλείων: 5 Σεπτεμβρίου 2026",
    "Τελευταίος πλήρης έλεγχος καταλόγου εργαλείων: 5 Σεπτεμβρίου 2026",
    "index footer fallback",
)
write("index.html", index)

# app.js: same positioning copy; footer date comes from the canonical metadata object.
app = read("app.js")
app = replace_once(
    app,
    'heroSubtitle: "Δες σε 2 λεπτά πού χρειάζεται λίγη παραπάνω εξάσκηση ο μαθητής ή ο γονιός και ποιο δωρεάν AI εργαλείο ταιριάζει ακριβώς εκεί. Για γονείς, μαθητές 6 έως 18 αλλά και εκπαιδευτικούς.",',
    'heroSubtitle: "Βρες το κατάλληλο AI εργαλείο για αυτό που θέλεις να κάνεις και δες πώς να το χρησιμοποιήσεις σωστά. Για γονείς, μαθητές 6 έως 18 και εκπαιδευτικούς.",',
    "app Greek hero subtitle",
)
app = replace_once(
    app,
    'heroSubtitle: "See in 2 minutes where the student or the parent could use a bit more practice, and which free AI tool fits exactly there. For parents, students 6 to 18, and educators.",',
    'heroSubtitle: "Find the right AI tool for what you want to do and see how to use it properly. For parents, students 6 to 18, and educators.",',
    "app English hero subtitle",
)
app = replace_once(
    app,
    'footerLastChecked: "Τελευταίος έλεγχος στοιχείων εργαλείων: 5 Σεπτεμβρίου 2026",',
    'footerLastChecked: window.AITOOLSKIDS_SITE_META?.toolCatalogAuditLabelEl || "Τελευταίος πλήρης έλεγχος καταλόγου εργαλείων: 5 Σεπτεμβρίου 2026",',
    "app Greek footer metadata",
)
app = replace_once(
    app,
    'footerLastChecked: "Tools last checked: September 5, 2026",',
    'footerLastChecked: window.AITOOLSKIDS_SITE_META?.toolCatalogAuditLabelEn || "Last full tool-catalog review: 5 September 2026",',
    "app English footer metadata",
)
write("app.js", app)

# Remove the old GEL curriculum script's MutationObserver footer-date guard entirely.
gel = read("gel-2026-2027-update.js")
if "function syncLastCheckedDate()" in gel:
    gel, n = re.subn(
        r'\n  // Correct the visible \\"last checked\\" date.*?\n  function installDateGuard\(\) \{.*?\n  \}\n',
        "\n",
        gel,
        count=1,
        flags=re.S,
    )
    if n != 1:
        # Fallback when the comment wording differs.
        gel, n = re.subn(
            r'\n  function syncLastCheckedDate\(\) \{.*?\n  \}\n\n  function installDateGuard\(\) \{.*?\n  \}\n',
            "\n",
            gel,
            count=1,
            flags=re.S,
        )
    if n != 1:
        raise SystemExit(f"gel date guard: expected one removable block, got {n}")
gel = re.sub(r'(?m)^\s*installDateGuard\(\);\s*$', "", gel)
gel = re.sub(r'(?m)^\s*document\.addEventListener\([^\n]*installDateGuard[^\n]*\);\s*$', "", gel)
if "syncLastCheckedDate" in gel or "installDateGuard" in gel:
    raise SystemExit("gel date guard references remain after cleanup")
write("gel-2026-2027-update.js", gel)

# Remove pwa.js clone/replace workaround and all ownership of the audit date.
pwa = read("pwa.js")
if "function auditDateText()" in pwa:
    pwa, n = re.subn(
        r'\n  function auditDateText\(\)\{.*?\n  function initPagePolish\(\)',
        "\n  function initPagePolish()",
        pwa,
        count=1,
        flags=re.S,
    )
    if n != 1:
        raise SystemExit(f"pwa date workaround: expected one removable block, got {n}")
pwa = re.sub(r'(?m)^\s*(?:detachLegacyFooterDateGuard|refreshAuditDate)\(\);\s*$', "", pwa)
if any(token in pwa for token in ("detachLegacyFooterDateGuard", "refreshAuditDate", "auditDateText", "data-footer-audit-date")):
    raise SystemExit("pwa legacy footer-date workaround references remain")
write("pwa.js", pwa)

# site-postfix may refresh the displayed footer after language switches, but only from canonical metadata.
postfix = read("site-postfix.js")
if "window.AITOOLSKIDS_SITE_META" not in postfix:
    postfix, n = re.subn(
        r'  function fixFooter\(\)\{.*?\n  \}\n\n  function ensureRoleGuidance',
        '''  function fixFooter(){
    const el=document.querySelector(".site-footer__last-checked");
    const meta=window.AITOOLSKIDS_SITE_META;
    if(!el || !meta) return;
    const desired=isEnglish() ? meta.toolCatalogAuditLabelEn : meta.toolCatalogAuditLabelEl;
    if(desired && el.textContent.trim() !== desired) el.textContent=desired;
  }

  function ensureRoleGuidance''',
        postfix,
        count=1,
        flags=re.S,
    )
    if n != 1:
        raise SystemExit(f"site-postfix fixFooter: expected one function, got {n}")
if "Tool information last checked: 5 September 2026" in postfix or "Τελευταίος έλεγχος στοιχείων εργαλείων: 5 Σεπτεμβρίου 2026" in postfix:
    raise SystemExit("site-postfix still contains hard-coded audit wording")
write("site-postfix.js", postfix)

# A loaded audit file must not imply every tool was reviewed that day.
audit = read("september-2026-tool-audit.js")
audit = audit.replace('  Object.keys(TOOLS).forEach((id) => patch(id, {}));\n\n', '', 1)
if 'Object.keys(TOOLS).forEach((id) => patch(id, {}));' in audit:
    raise SystemExit("tool audit blanket review assignment remains")
write("september-2026-tool-audit.js", audit)

# The 9 Sep deep-research pass genuinely rechecked only its explicitly corrected tools.
report = read("report-link.js")
if 'lastReviewed:"2026-09-09"' not in report:
    report = replace_once(
        report,
        '''  function patchTool(id,data){
    if(typeof TOOLS==="undefined" || !TOOLS[id]) return;
    Object.assign(TOOLS[id],data);
  }''',
        '''  function patchTool(id,data){
    if(typeof TOOLS==="undefined" || !TOOLS[id]) return;
    Object.assign(TOOLS[id],data,{
      lastReviewed:"2026-09-09",
      lastReviewedEl:"9 Σεπτεμβρίου 2026",
      lastReviewedEn:"9 September 2026"
    });
  }''',
        "deep-research per-tool review metadata",
    )
write("report-link.js", report)

# Navigator-first homepage: add one clear primary CTA; keep Practice Map secondary; move AI Help/learning-loop lower.
nav = read("navigator-home.js")
nav = nav.replace(
    '/* Homepage task routes + Special Education placement.\n * Important: this file must NOT rewrite the agreed hero, Practice Map or AI Help copy.\n * The visible top-of-homepage source of truth remains index.html/app.js.\n */',
    '/* Homepage navigator positioning + task routes + Special Education placement.\n * Product contract: primary = find the right tool; Practice Map = secondary; AI Help = lower/supporting.\n */',
)
if "function ensurePrimaryCta()" not in nav:
    anchor = "  function ensureSpecialSchoolCard(){\n"
    if anchor not in nav:
        raise SystemExit("navigator-home: insertion anchor missing")
    helper = '''  function ensurePrimaryCta(){
    const hero=document.querySelector("#zoneSelectView .hero");
    if(!hero) return null;
    let cta=document.getElementById("navigatorPrimaryCta");
    if(!cta){
      cta=document.createElement("a");
      cta.id="navigatorPrimaryCta";
      cta.className="navigator-primary-cta";
      cta.href="#navigatorNeeds";
    }
    const badges=hero.querySelector(".hero__badges");
    if(cta.parentElement!==hero){
      if(badges) badges.insertAdjacentElement("afterend",cta);
      else hero.prepend(cta);
    }
    const en=isEnglish();
    cta.innerHTML=en
      ? '<span class="navigator-primary-cta__icon" aria-hidden="true">🧭</span><span><strong>Find the right AI tool</strong><small>Choose what you want to do and go straight to the most suitable route.</small></span><span aria-hidden="true">→</span>'
      : '<span class="navigator-primary-cta__icon" aria-hidden="true">🧭</span><span><strong>Βρες το σωστό AI εργαλείο</strong><small>Διάλεξε τι θέλεις να κάνεις και πήγαινε κατευθείαν στην κατάλληλη διαδρομή.</small></span><span aria-hidden="true">→</span>';
    cta.setAttribute("aria-label",en ? "Find the right AI tool" : "Βρες το σωστό AI εργαλείο");
    return cta;
  }

  function repositionSecondaryFlows(section){
    if(!section) return;
    const ai=document.querySelector(".hero__ai-help, .navigator-secondary-ai");
    const loop=document.querySelector(".hero__learning-loop, .navigator-secondary-loop");
    if(ai){
      ai.classList.add("navigator-secondary-ai");
      section.insertAdjacentElement("afterend",ai);
    }
    if(loop){
      loop.classList.add("navigator-secondary-loop");
      (ai || section).insertAdjacentElement("afterend",loop);
    }
  }

'''
    nav = nav.replace(anchor, helper + anchor, 1)

if "ensurePrimaryCta();" not in nav:
    nav = replace_once(
        nav,
        "    const c=isEnglish()?COPY.en:COPY.el;\n\n    const card=ensureSpecialSchoolCard();",
        "    const c=isEnglish()?COPY.en:COPY.el;\n    ensurePrimaryCta();\n\n    const card=ensureSpecialSchoolCard();",
        "navigator primary CTA call",
    )
if "repositionSecondaryFlows(section);" not in nav:
    marker = "    }\n  }\n\n  function scheduleApply(){"
    nav = replace_once(
        nav,
        marker,
        "    }\n    repositionSecondaryFlows(section);\n  }\n\n  function scheduleApply(){",
        "navigator secondary-flow reposition call",
    )
write("navigator-home.js", nav)

css = read("navigator-home.css")
if "/* Navigator-primary positioning contract */" not in css:
    css += '''

/* Navigator-primary positioning contract */
.navigator-primary-cta{
  display:flex;align-items:center;gap:12px;width:min(100%,720px);margin:18px auto 14px;
  padding:15px 17px;border-radius:14px;background:#174A72;color:#fff;text-decoration:none;
  box-shadow:0 8px 22px rgba(23,74,114,.16);font-weight:700
}
.navigator-primary-cta>span:nth-child(2){display:flex;flex:1;flex-direction:column;gap:2px;min-width:0}
.navigator-primary-cta strong{font-size:1rem;line-height:1.3}
.navigator-primary-cta small{font-size:.8rem;line-height:1.4;font-weight:500;color:rgba(255,255,255,.9)}
.navigator-primary-cta__icon{font-size:1.35rem}
.navigator-primary-cta:focus-visible{outline:3px solid #111827;outline-offset:3px}
.hero__quiz-cta-wrap{margin-top:10px}
.hero__quiz-cta{background:#fff!important;color:#174A72!important;border:2px solid #B8CCE0!important;box-shadow:none!important}
.navigator-secondary-ai{max-width:980px;margin:22px auto 0}
.navigator-secondary-loop{max-width:860px;margin:18px auto 0}
@media(max-width:600px){
  .navigator-primary-cta{align-items:flex-start;margin-top:14px;padding:14px}
  .navigator-primary-cta small{font-size:.76rem}
}
'''
write("navigator-home.css", css)

# Browser regression contract: navigator first, Practice Map secondary, AI Help available lower on page.
write(
    "tests/home-positioning-smoke.mjs",
    r'''import { chromium } from 'playwright';
import assert from 'node:assert/strict';

const URL = 'http://127.0.0.1:4173/';
const browser = await chromium.launch({ headless: true });
const foldLabel = (text, locale) => text.trim().normalize('NFD').replace(/\p{M}/gu, '').toLocaleLowerCase(locale);

try {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const errors = [];
  page.on('pageerror', (error) => errors.push(String(error)));

  await page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForSelector('#navigatorPrimaryCta', { timeout: 10000 });
  await page.waitForSelector('#specialSchoolZoneCard', { timeout: 10000 });
  await page.waitForSelector('#navigatorNeeds', { timeout: 10000 });

  assert.equal((await page.locator('.hero__title').innerText()).trim(), 'Μαθαίνω Έξυπνα με AI');
  assert.equal((await page.locator('.hero__subtitle').innerText()).replace(/\s+/g, ' ').trim(), 'Βρες το κατάλληλο AI εργαλείο για αυτό που θέλεις να κάνεις και δες πώς να το χρησιμοποιήσεις σωστά. Για γονείς, μαθητές 6 έως 18 και εκπαιδευτικούς.');
  assert.equal((await page.locator('#navigatorPrimaryCta strong').innerText()).trim(), 'Βρες το σωστό AI εργαλείο');
  assert.equal(await page.locator('#navigatorPrimaryCta').getAttribute('href'), '#navigatorNeeds');
  assert.equal(await page.locator('.hero #navigatorPrimaryCta').count(), 1);

  assert.equal((await page.locator('.hero__quiz-cta-title').innerText()).trim(), 'Χάρτης Εξάσκησης · ξεκίνα εδώ');
  assert.equal(await page.locator('.hero .hero__quiz-cta-wrap').count(), 1);
  assert.equal(await page.locator('.hero .hero__ai-help').count(), 0, 'AI Help must not dominate the hero');
  assert.equal(await page.locator('.hero .hero__learning-loop').count(), 0, 'Learning loop must not dominate the hero');
  assert.equal(await page.locator('.navigator-secondary-ai').count(), 1);
  assert.equal(await page.locator('.navigator-secondary-loop').count(), 1);
  assert.equal(foldLabel(await page.locator('.hero__ai-help-badge').innerText(), 'el-GR'), foldLabel('Κόλλησα εδώ', 'el-GR'));

  assert.equal(await page.locator('#zoneGrid .zone-card').count(), 4);
  assert.equal(await page.locator('#zoneGrid #specialSchoolZoneCard').count(), 1);
  assert.equal(await page.locator('#specialSchoolZoneCard').getAttribute('href'), '/special-education.html');
  assert.equal(await page.locator('#navigatorNeeds .navigator-needs-card').count(), 6);
  assert.ok(await page.locator('#navigatorNeeds a[href="/meleti-pdf-me-ai.html"]').count());
  assert.ok(await page.locator('#navigatorNeeds a[href="/erevna-me-piges-ai.html"]').count());
  assert.ok(await page.locator('#heroGslBadge').count());
  assert.ok(await page.locator('#heroHelpSpecialEducation').count());
  assert.ok(await page.locator('#curriculumMapFeature').count());

  const overflow = await page.evaluate(() => Math.max(0, document.documentElement.scrollWidth - document.documentElement.clientWidth));
  assert.ok(overflow <= 1, `Homepage positioning introduces horizontal overflow on mobile: ${overflow}px`);

  await page.click('#langEn');
  await page.waitForFunction(() => document.documentElement.lang === 'en');
  await page.waitForFunction(() => document.querySelector('#navigatorPrimaryCta strong')?.textContent?.includes('Find the right AI tool'));
  assert.equal((await page.locator('.hero__subtitle').innerText()).replace(/\s+/g, ' ').trim(), 'Find the right AI tool for what you want to do and see how to use it properly. For parents, students 6 to 18, and educators.');
  assert.equal((await page.locator('#navigatorPrimaryCta strong').innerText()).trim(), 'Find the right AI tool');
  assert.equal((await page.locator('.hero__quiz-cta-title').innerText()).trim(), 'Practice Map · start here');
  assert.match(await page.locator('#specialSchoolZoneCard').innerText(), /Special schools/);
  assert.equal(await page.locator('#navigatorNeeds .navigator-needs-card').count(), 6);
  assert.ok(await page.locator('#navigatorNeeds a[href="/en/study-pdf-with-ai.html"]').count());
  assert.ok(await page.locator('#navigatorNeeds a[href="/en/what-do-you-want-to-do-with-ai.html"]').count());

  assert.deepEqual(errors, [], `Homepage browser errors:\n${errors.join('\n')}`);
  console.log('Navigator-first homepage positioning smoke passed.');
} finally {
  await browser.close();
}
''',
)

# Static regression test for review-date architecture.
write(
    "tests/date-architecture-smoke.mjs",
    r'''import fs from 'node:fs';
import assert from 'node:assert/strict';

const read = (p) => fs.readFileSync(new URL(`../${p}`, import.meta.url), 'utf8');
const meta = read('site-meta.js');
const index = read('index.html');
const app = read('app.js');
const gel = read('gel-2026-2027-update.js');
const pwa = read('pwa.js');
const postfix = read('site-postfix.js');
const audit = read('september-2026-tool-audit.js');
const report = read('report-link.js');

assert.match(meta, /toolCatalogAuditDate:\s*"2026-09-05"/);
assert.match(meta, /Τελευταίος πλήρης έλεγχος καταλόγου εργαλείων/);
assert.ok(index.indexOf('/site-meta.js') < index.indexOf('/data.js'));
assert.match(app, /AITOOLSKIDS_SITE_META\?\.toolCatalogAuditLabelEl/);
assert.match(postfix, /AITOOLSKIDS_SITE_META/);
for (const [name, text] of [['gel', gel], ['pwa', pwa]]) {
  assert.doesNotMatch(text, /detachLegacyFooterDateGuard|syncLastCheckedDate|installDateGuard|auditDateText|data-footer-audit-date/, `${name} still owns legacy footer-date patching`);
}
assert.doesNotMatch(audit, /Object\.keys\(TOOLS\)\.forEach\(\(id\) => patch\(id, \{\}\)\)/);
assert.match(report, /lastReviewed:"2026-09-09"/);
assert.doesNotMatch(postfix, /Tool information last checked: 5 September 2026|Τελευταίος έλεγχος στοιχείων εργαλείων: 5 Σεπτεμβρίου 2026/);
console.log('Date architecture smoke passed.');
''',
)

# Bring documentation back in line with current main.
tutor_doc = read("docs/tutor-consolidation-audit.md")
status_note = """

## Status update — 2026-09-09
The original branch-status section above is now historical. The transitional lifecycle architecture (`tutor-render-host.js` plus event-based extensions) is already present on `main`. Do **not** merge the old consolidation branch wholesale. Any remaining consolidation must start from current `main`, preserve the existing smoke coverage, and move lifecycle ownership into canonical `tutor.js` in a separate behavior-preserving refactor.
"""
if "## Status update — 2026-09-09" not in tutor_doc:
    tutor_doc += status_note
write("docs/tutor-consolidation-audit.md", tutor_doc)

write(
    "docs/special-education-status.md",
    '''# Ειδική Εκπαίδευση — κατάσταση υλοποίησης

Τελευταία ενημέρωση: 7 Σεπτεμβρίου 2026

## Πηγή αλήθειας

Το machine-readable `special-education-status.js` είναι η τρέχουσα πηγή κατάστασης. Τα δεδομένα μάθησης/quiz εκτίθενται μόνο όταν περνούν τα quality gates του `tests/special-education-data-smoke.mjs`.

## Τρέχουσα εικόνα

- ✅ ΕΝ.Ε.Ε.ΓΥ.-Λ. Α΄ Λυκείου — Ζώνη Δημιουργικών Δραστηριοτήτων: curriculum + learning + quiz + tutor context verified.
- ✅ ΕΝ.Ε.Ε.ΓΥ.-Λ. Β΄ Λυκείου — Υγεία και Διατροφή: verified βασικές έννοιες.
- ✅ ΕΝ.Ε.Ε.ΓΥ.-Λ. Β΄ Λυκείου — Στοιχεία Τεχνικής Θερμοδυναμικής – Εφαρμογές: verified βασικές έννοιες.
- ✅ ΕΝ.Ε.Ε.ΓΥ.-Λ. Β΄ Λυκείου — Τοπογραφία: verified βασικές έννοιες και μετρήσεις.
- ✅ ΕΝ.Ε.Ε.ΓΥ.-Λ. Β΄ Λυκείου — Φυτική Παραγωγή: verified βασικές έννοιες.
- 🔵 Οι υπόλοιπες καταγεγραμμένες επίσημες πηγές/τομείς παραμένουν indexed ή pending μέχρι να ολοκληρωθεί η χαρτογράφηση ένα-ένα.
- ⏳ Ειδικό Γυμνάσιο Α΄ — Μαθηματικά και Νεοελληνική Γλώσσα: δεν παρουσιάζονται ως πλήρης επαληθευμένη ύλη· χρησιμοποιούνται μόνο οι τεκμηριωμένες δομές/υποστηρικτικές δεξιότητες που επιτρέπουν τα quality gates.

## Κανόνας ποιότητας

Κανένα learning path ή quiz δεν θεωρείται επαληθευμένο μόνο επειδή υπάρχει τίτλος ή θεματικό anchor. Απαιτούνται επίσημη πηγή, verification metadata και επιτυχής έλεγχος των automated quality gates.
''',
)

print("Source corrections prepared successfully.")
