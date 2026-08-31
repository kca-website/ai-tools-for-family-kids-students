from pathlib import Path

p = Path('site-postfix.js')
s = p.read_text()
marker = '  function loadPwaLayer(){'

if 'function ensureStartHere(){' not in s:
    block = r'''  function ensureStartHere(){
    const roleTabs=document.getElementById("roleTabs");
    if(!roleTabs) return;
    const {zone,role}=routeContext();
    let box=document.getElementById("startHereGuide");
    if(!zone || !role){ if(box) box.remove(); return; }
    if(!box){
      box=document.createElement("section");
      box.id="startHereGuide";
      box.setAttribute("role","note");
      box.style.cssText="margin:4px 0 14px;padding:14px 16px;border:1px solid #bfdbfe;border-radius:12px;background:linear-gradient(135deg,#eff6ff,#f8fafc);display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;";
      roleTabs.insertAdjacentElement("beforebegin",box);
    }
    const en=isEnglish();
    const title=en ? "Not sure where to start?" : "Δεν ξέρεις από πού να ξεκινήσεις;";
    const text=en ? "Take the 2-minute Diagnostic Map first. It shows what may need practice and then leads you to the relevant Learning Path." : "Κάνε πρώτα τον Διαγνωστικό Χάρτη των 2 λεπτών. Θα σου δείξει τι μπορεί να θέλει εξάσκηση και μετά θα σε οδηγήσει στο αντίστοιχο Μονοπάτι Μάθησης.";
    const cta=en ? "Start the 2-minute check →" : "Κάνε το διαγνωστικό (2') →";
    const href=`/${zone}/${role}/quiz`;
    const signature=[en,zone,role].join("|");
    if(box.dataset.signature===signature) return;
    box.dataset.signature=signature;
    box.innerHTML=`<div style="flex:1;min-width:min(100%,420px);"><div style="font-weight:800;color:#1f2937;margin-bottom:3px;">${title}</div><div style="font-size:.88rem;line-height:1.5;color:#475569;">${text}</div></div><a href="${href}" style="display:inline-flex;align-items:center;justify-content:center;min-height:40px;padding:9px 14px;border-radius:9px;background:#2e6ba3;color:#fff;text-decoration:none;font-weight:800;white-space:nowrap;">${cta}</a>`;
  }

  function ensureQuizPathFlow(){
    const root=document.getElementById("quizContent");
    if(!root) return;
    const title=root.querySelector(".quiz-results-title");
    if(!title){ root.querySelector(".quiz-path-flow-note")?.remove(); return; }
    let note=root.querySelector(".quiz-path-flow-note");
    if(!note){
      note=document.createElement("div");
      note.className="quiz-path-flow-note";
      note.setAttribute("role","note");
      note.style.cssText="max-width:720px;margin:0 auto 18px;padding:13px 15px;border:1px solid #bbf7d0;border-radius:10px;background:#f0fdf4;color:#334155;font-size:.88rem;line-height:1.5;text-align:left;";
      const disclaimer=root.querySelector(".quiz-formative-disclaimer");
      (disclaimer||title).insertAdjacentElement("afterend",note);
    }
    const en=isEnglish();
    const desired=en
      ? "What happens next: the Diagnostic Map identifies an area that may need practice. Open its Learning Path for the practical 3-step route — activity, guided tool use and an understanding check."
      : "Τι γίνεται μετά: ο Διαγνωστικός Χάρτης εντοπίζει ένα σημείο που μπορεί να θέλει εξάσκηση. Άνοιξε το Μονοπάτι Μάθησης αυτού του θέματος για την πρακτική διαδρομή 3 βημάτων — δραστηριότητα, καθοδηγούμενη χρήση εργαλείου και έλεγχο κατανόησης.";
    if(note.textContent!==desired) note.textContent=desired;
  }

  function ensureMethodologyFooter(){
    const footer=document.querySelector(".site-footer");
    if(!footer) return;
    let row=document.getElementById("methodologyFooterLinks");
    if(!row){
      row=document.createElement("p");
      row.id="methodologyFooterLinks";
      row.style.cssText="font-size:.82rem;margin-top:8px;";
      footer.appendChild(row);
    }
    const en=isEnglish();
    const signature=String(en);
    if(row.dataset.signature===signature) return;
    row.dataset.signature=signature;
    row.innerHTML=en
      ? '<a href="/methodology.html">How we select & verify tools</a> · <a href="https://github.com/kca-website/ai-tools-for-family-kids-students/issues/new" target="_blank" rel="noopener noreferrer">Report outdated information ↗</a>'
      : '<a href="/methodology.html">Πώς επιλέγουμε & ελέγχουμε τα εργαλεία</a> · <a href="https://github.com/kca-website/ai-tools-for-family-kids-students/issues/new" target="_blank" rel="noopener noreferrer">Βρήκες λάθος ή παλιωμένη πληροφορία; ↗</a>';
  }

'''
    if marker not in s:
        raise SystemExit('site-postfix marker missing')
    s = s.replace(marker, block + marker, 1)

old = '''    ensureRoleGuidance();
    ensureQuizDisclaimer();
    ensurePerfectScoreEnrichment();
    ensureSignLanguageEntry();'''
new = '''    ensureRoleGuidance();
    ensureStartHere();
    ensureQuizDisclaimer();
    ensureQuizPathFlow();
    ensurePerfectScoreEnrichment();
    ensureSignLanguageEntry();
    ensureMethodologyFooter();'''
if old in s:
    s = s.replace(old, new, 1)

oldobs = '''      ensureQuizDisclaimer();
      ensurePerfectScoreEnrichment();'''
newobs = '''      ensureQuizDisclaimer();
      ensureQuizPathFlow();
      ensurePerfectScoreEnrichment();'''
if oldobs in s:
    s = s.replace(oldobs, newobs, 1)

s = s.replace(
    'new MutationObserver(()=>ensureRoleGuidance()).observe(roleTabs,{childList:true});',
    'new MutationObserver(()=>{ensureRoleGuidance();ensureStartHere();}).observe(roleTabs,{childList:true});'
)
p.write_text(s)

feedback = '''
<div class="box" style="margin-top:28px">
  <p data-lang="el"><strong>Πώς ελέγχουμε τις πληροφορίες;</strong> Δες τη <a href="/methodology.html">μεθοδολογία επιλογής και επαλήθευσης εργαλείων</a>.</p>
  <p data-lang="en"><strong>How do we verify information?</strong> See our <a href="/methodology.html">tool selection and verification methodology</a>.</p>
  <p data-lang="el" style="margin-bottom:0"><a href="https://github.com/kca-website/ai-tools-for-family-kids-students/issues/new" target="_blank" rel="noopener noreferrer">Βρήκες κάτι λάθος ή παλιωμένο; Ανέφερέ το ↗</a></p>
  <p data-lang="en" style="margin-bottom:0"><a href="https://github.com/kca-website/ai-tools-for-family-kids-students/issues/new" target="_blank" rel="noopener noreferrer">Found outdated or incorrect information? Report it ↗</a></p>
</div>
'''

for f in Path('tools').glob('*.html'):
    t = f.read_text()
    if '/methodology.html' in t:
        continue
    anchor = '<p class="meta">'
    if anchor in t:
        t = t.replace(anchor, feedback + anchor, 1)
    elif '</body>' in t:
        t = t.replace('</body>', feedback + '\n</body>', 1)
    f.write_text(t)

sp = Path('sitemap.xml')
sm = sp.read_text()
if 'https://www.aitools4kids.gr/methodology.html' not in sm:
    entry = '''  <url>
    <loc>https://www.aitools4kids.gr/methodology.html</loc>
    <lastmod>2026-08-31</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
'''
    sm = sm.replace('</urlset>', entry + '</urlset>')
    sp.write_text(sm)
