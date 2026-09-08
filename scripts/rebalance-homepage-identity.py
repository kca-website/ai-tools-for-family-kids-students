from pathlib import Path


def rep(path, old, new, label):
    text = path.read_text(encoding='utf-8')
    if old not in text:
        raise SystemExit(f'missing {label} in {path}')
    path.write_text(text.replace(old, new, 1), encoding='utf-8')

# app.js: keep hero title/subtitle exactly as-is. Rebalance the copy below it.
p = Path('app.js')
rep(p,
'''      chooseZoneSubheading: "Αν ξέρεις ήδη τη σχολική βαθμίδα, μπες από εδώ. Σε κάθε ζώνη θα βρεις Χάρτη Εξάσκησης, Μονοπάτια Μάθησης, καθοδήγηση και επιλεγμένα εργαλεία.",
      heroFlowLabel: "Η διαδρομή μάθησης",
      heroFlowDifficulty: "Δυσκολία",
      heroFlowSpot: "Εντοπισμός",
      heroFlowPractice: "Εξάσκηση",
      heroFlowGuidance: "Καθοδήγηση",
      heroFlowRetry: "Ξαναδοκιμή",
      heroQuizCta: "Χάρτης Εξάσκησης · ξεκίνα εδώ",
      heroQuizCtaSub: "Λίγες σύντομες ερωτήσεις για να δεις ποια σημεία αξίζει να δουλέψεις περισσότερο και να πας στο επόμενο Μονοπάτι Μάθησης. Χωρίς βαθμό και χωρίς διάγνωση.",''',
'''      chooseZoneSubheading: "Κάθε ζώνη έχει διαφορετικά κατάλληλα εργαλεία και διαφορετικό βαθμό αυτονομίας.",
      guidedStartTitle: "Δεν ξέρεις από πού να ξεκινήσεις;",
      guidedStartSub: "Χρησιμοποίησε τον Χάρτη Εξάσκησης για να εντοπίσεις τι θέλει δουλειά. Αν έχεις ήδη κολλήσει σε άσκηση, η AI Βοήθεια μπορεί να σε καθοδηγήσει χωρίς να σου δώσει έτοιμη λύση.",
      heroQuizCta: "Χάρτης Εξάσκησης σε 2 λεπτά",
      heroQuizCtaSub: "Λίγες σύντομες ερωτήσεις για να δεις ποια σημεία αξίζει να εξασκήσεις περισσότερο. Χωρίς βαθμό και χωρίς διάγνωση. Μόνο ένα σημείο εκκίνησης για το επόμενο Μονοπάτι Μάθησης.",''', 'Greek strings')
rep(p,
'''      chooseZoneSubheading: "If you already know the school level, start here. Each zone includes the Practice Map, Learning Paths, guidance and a curated set of tools.",
      heroFlowLabel: "The learning route",
      heroFlowDifficulty: "Difficulty",
      heroFlowSpot: "Spot the gap",
      heroFlowPractice: "Practice",
      heroFlowGuidance: "Guidance",
      heroFlowRetry: "Try again",
      heroQuizCta: "Practice Map · start here",
      heroQuizCtaSub: "A few short questions to spot what is worth practising more and move to the next Learning Path. No grade and no diagnosis.",''',
'''      chooseZoneSubheading: "Each zone has different suitable tools and a different level of independence.",
      guidedStartTitle: "Not sure where to start?",
      guidedStartSub: "Use the Practice Map to spot what needs work. If you are already stuck on an exercise, AI Help can guide you without handing over a finished answer.",
      heroQuizCta: "Practice Map in 2 minutes",
      heroQuizCtaSub: "A few short questions to spot what may be worth practising more. No grade and no diagnosis. Just a starting point for the next Learning Path.",''', 'English strings')

# index.html: tool-forward SEO identity; top visible hero wording is deliberately untouched.
p = Path('index.html')
for old, new, label in [
('<title>Μαθαίνω Έξυπνα με AI | Χάρτης Εξάσκησης & AI Εργαλεία για Μαθητές</title>', '<title>Μαθαίνω Έξυπνα με AI | AI Εργαλεία για Μαθητές: Δημοτικό, Γυμνάσιο, Λύκειο</title>', 'title'),
('<meta name="description" content="Δωρεάν ελληνικός χάρτης μάθησης με AI για μαθητές 6–18, γονείς και εκπαιδευτικούς: Χάρτης Εξάσκησης, learning paths, επιλεγμένα AI εργαλεία και AI Βοήθεια που καθοδηγεί χωρίς έτοιμες λύσεις." />', '<meta name="description" content="Δωρεάν, δίγλωσσος οδηγός AI για Δημοτικό, Γυμνάσιο και Λύκειο: Χάρτης Εξάσκησης, learning paths, προτάσεις εργαλείων και προαιρετική AI Βοήθεια με καθοδήγηση αντί για έτοιμες λύσεις." />', 'meta'),
('<meta property="og:title" content="Μαθαίνω Έξυπνα με AI · Χάρτης Εξάσκησης" />', '<meta property="og:title" content="Μαθαίνω Έξυπνα με AI" />', 'og title'),
('<meta property="og:description" content="Όταν ένα παιδί δεν έχει καταλάβει κάτι, δες τι χρειάζεται εξάσκηση και ποιο είναι το επόμενο σωστό βήμα, με ή χωρίς AI. Χάρτης Εξάσκησης, learning paths, επιλεγμένα εργαλεία και καθοδηγούμενη AI Βοήθεια." />', '<meta property="og:description" content="Δες πού χρειάζεται εξάσκηση, βρες το κατάλληλο AI εργαλείο και χρησιμοποίησε προαιρετική AI Βοήθεια που καθοδηγεί χωρίς να δίνει έτοιμη λύση. Για γονείς, μαθητές 6-18 και εκπαιδευτικούς." />', 'og description'),
('<meta name="twitter:title" content="Μαθαίνω Έξυπνα με AI · Χάρτης Εξάσκησης" />', '<meta name="twitter:title" content="Μαθαίνω Έξυπνα με AI" />', 'twitter title'),
('<meta name="twitter:description" content="Βρες τι χρειάζεται εξάσκηση και το επόμενο σωστό βήμα, με ή χωρίς AI. Για μαθητές 6–18, γονείς και εκπαιδευτικούς." />', '<meta name="twitter:description" content="Δωρεάν, δίγλωσσος οδηγός AI για μαθητές 6-18, γονείς και εκπαιδευτικούς, με Χάρτη Εξάσκησης και προαιρετική AI Βοήθεια." />', 'twitter description'),
('"description": "Δωρεάν ελληνικός χάρτης μάθησης με AI για μαθητές 6–18, γονείς και εκπαιδευτικούς. Περιλαμβάνει Χάρτη Εξάσκησης, learning paths, επιλεγμένα εργαλεία και προαιρετική AI Βοήθεια που καθοδηγεί χωρίς έτοιμες λύσεις."', '"description": "Δωρεάν, δίγλωσσος οδηγός AI για Δημοτικό, Γυμνάσιο και Λύκειο. Περιλαμβάνει Χάρτη Εξάσκησης, learning paths, προτάσεις εργαλείων και προαιρετική AI Βοήθεια με καθοδήγηση αντί για έτοιμες λύσεις."', 'schema'),
('        και εκπαιδευτικούς να εντοπίσουν τι χρειάζεται εξάσκηση και ποιο είναι το επόμενο σωστό βήμα, με ή χωρίς AI.\n        Περιλαμβάνει Χάρτη Εξάσκησης, Μονοπάτια Μάθησης, επιλεγμένα εργαλεία και προαιρετική AI Βοήθεια. Ο βασικός οδηγός λειτουργεί χωρίς λογαριασμό.', '        και εκπαιδευτικούς να βρουν ποιο συγκεκριμένο AI εργαλείο ταιριάζει σε ποια σχολική δουλειά, ανά ηλικία.\n        Ο οδηγός και ο Χάρτης Εξάσκησης λειτουργούν χωρίς λογαριασμό. Η προαιρετική AI Βοήθεια απαιτεί JavaScript και σύνδεση σε Puter.', 'noscript'),
('      <p class="section-subheading" data-i18n="chooseZoneSubheading">\n        Αν ξέρεις ήδη τη σχολική βαθμίδα, μπες από εδώ. Σε κάθε ζώνη θα βρεις Χάρτη Εξάσκησης, Μονοπάτια Μάθησης, καθοδήγηση και επιλεγμένα εργαλεία.\n      </p>', '      <p class="section-subheading" data-i18n="chooseZoneSubheading">\n        Κάθε ζώνη έχει διαφορετικά κατάλληλα εργαλεία και διαφορετικό βαθμό αυτονομίας.\n      </p>', 'zone subtitle'),
]: rep(p, old, new, label)

block_start = text = p.read_text(encoding='utf-8')
start = text.index('        <div class="hero__learning-loop"')
end_marker = '        </section>\n      </div>\n\n      <h2 class="section-heading"'
end = text.index(end_marker, start)
# preserve hero closing div and the following heading, remove loop/quiz/help from inside hero
text = text[:start] + '      </div>\n\n      <h2 class="section-heading"' + text[end + len(end_marker):]
p.write_text(text, encoding='utf-8')

# Insert guided support after the age-zone cards.
text = p.read_text(encoding='utf-8')
marker = '''      <div class="zone-grid" id="zoneGrid">
        <!-- Γεμίζει δυναμικά από το app.js με βάση το ZONES -->
      </div>
'''
if marker not in text: raise SystemExit('missing zone grid marker')
guided = '''
      <section class="home-guided-start" aria-labelledby="guidedStartHeading">
        <div class="home-guided-start__intro">
          <h2 id="guidedStartHeading" class="home-guided-start__title" data-i18n="guidedStartTitle">Δεν ξέρεις από πού να ξεκινήσεις;</h2>
          <p class="home-guided-start__sub" data-i18n="guidedStartSub">Χρησιμοποίησε τον Χάρτη Εξάσκησης για να εντοπίσεις τι θέλει δουλειά. Αν έχεις ήδη κολλήσει σε άσκηση, η AI Βοήθεια μπορεί να σε καθοδηγήσει χωρίς να σου δώσει έτοιμη λύση.</p>
        </div>

        <div class="hero__quiz-cta-wrap">
          <button type="button" id="heroQuizCtaBtn" class="hero__quiz-cta">
            <span class="hero__quiz-cta-icon" aria-hidden="true">🧭</span>
            <span class="hero__quiz-cta-text">
              <span class="hero__quiz-cta-title" data-i18n="heroQuizCta">Χάρτης Εξάσκησης σε 2 λεπτά</span>
              <span class="hero__quiz-cta-sub" data-i18n="heroQuizCtaSub">Λίγες σύντομες ερωτήσεις για να δεις ποια σημεία αξίζει να εξασκήσεις περισσότερο. Χωρίς βαθμό και χωρίς διάγνωση. Μόνο ένα σημείο εκκίνησης για το επόμενο Μονοπάτι Μάθησης.</span>
            </span>
          </button>
          <div class="hero__quiz-picker" id="heroQuizPicker" hidden>
            <p class="hero__quiz-picker-label" data-i18n="heroQuizPickPrompt">Για ποια ζώνη;</p>
            <div class="hero__quiz-picker-grid" id="heroQuizPickerGrid"></div>
          </div>
        </div>

        <section class="hero__ai-help" aria-labelledby="heroAiHelpTitle">
          <div class="hero__ai-help-copy">
            <span class="hero__ai-help-badge" data-i18n="heroHelpBadge">Κόλλησα εδώ</span>
            <h2 id="heroAiHelpTitle" data-i18n="heroHelpTitle">Δείξε μου πώς να το μάθω, όχι τη λύση</h2>
            <p data-i18n="heroHelpSub">Η AI Βοήθεια ξεκινά από τη δική σου προσπάθεια και σε καθοδηγεί με μία ερώτηση ή μικρή υπόδειξη τη φορά, χωρίς έτοιμη τελική απάντηση.</p>
            <p class="hero__ai-help-note" data-i18n="heroHelpNote">Η βασική πλατφόρμα παραμένει χωρίς λογαριασμό. Η AI Βοήθεια είναι προαιρετική, χρησιμοποιεί Puter και υπόκειται στα δικά του όρια χρήσης.</p>
          </div>
          <div class="hero__ai-help-actions" aria-label="AI Βοήθεια ανά ηλικία">
            <a href="/primary/guardian/tutor"><span aria-hidden="true">👪</span><span data-i18n="heroHelpPrimary">Γονιός Δημοτικού</span></a>
            <a href="/middle/student/tutor"><span aria-hidden="true">🎒</span><span data-i18n="heroHelpMiddle">Γυμνάσιο 13+</span></a>
            <a href="/high/student/tutor"><span aria-hidden="true">🎓</span><span data-i18n="heroHelpHigh">Λύκειο</span></a>
          </div>
        </section>
      </section>
'''
p.write_text(text.replace(marker, marker + guided, 1), encoding='utf-8')

# runtime metadata stays tool-forward, without touching hero copy.
p = Path('home-accessibility.js')
rep(p,
'''    const description = en
      ? "Free bilingual AI learning map for students 6–18, parents and educators: Practice Map, learning paths, curated AI tools, guided AI Help, Greek curriculum mapping and accessible educational resources."
      : "Δωρεάν ελληνικός χάρτης μάθησης με AI για μαθητές 6–18, γονείς και εκπαιδευτικούς: Χάρτης Εξάσκησης, learning paths, επιλεγμένα AI εργαλεία, καθοδηγούμενη AI Βοήθεια, Ελληνικός Χάρτης Ύλης και προσβάσιμο εκπαιδευτικό υλικό.";''',
'''    const description = en
      ? "Free bilingual learning guide for students 6–18, parents and educators: Practice Map, learning paths, AI tool recommendations, guided AI Help, Greek curriculum mapping and accessible educational resources."
      : "Δωρεάν δίγλωσσος οδηγός μάθησης για μαθητές 6–18, γονείς και εκπαιδευτικούς: Χάρτης Εξάσκησης, learning paths, προτάσεις AI εργαλείων, καθοδηγούμενη AI Βοήθεια, Ελληνικός Χάρτης Ύλης και προσβάσιμο εκπαιδευτικό υλικό.";''', 'runtime metadata')

# styles: remove learning-loop hero emphasis and style the guided section after tool discovery.
p = Path('styles.css')
text = p.read_text(encoding='utf-8')
start = text.index('.hero__learning-loop {')
end = text.index('/* ---------- Hero quiz CTA', start)
text = text[:start] + '''/* ---------- Home: guided start after tool discovery ---------- */
.home-guided-start {
  margin: 0 0 36px;
  padding: 22px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--color-surface);
}

.home-guided-start__intro {
  max-width: 760px;
  margin-bottom: 16px;
}

.home-guided-start__title {
  margin: 0 0 6px;
  font-size: 1.2rem;
  font-weight: 800;
}

.home-guided-start__sub {
  margin: 0;
  max-width: 720px;
  color: var(--color-text-muted);
  font-size: .92rem;
  line-height: 1.55;
}

''' + text[end:]
text = text.replace('  .hero__learning-loop { padding: 10px 12px; }\n  .hero__learning-loop-steps { font-size: .78rem; }\n  .hero__learning-loop-steps li:not(:last-child)::after { margin: 0 6px; }\n', '')
text = text.replace('@media (max-width: 700px) {\n  .hero__ai-help { grid-template-columns: 1fr; }', '@media (max-width: 700px) {\n  .home-guided-start { padding: 18px 14px; }\n  .hero__ai-help { grid-template-columns: 1fr; }', 1)
p.write_text(text, encoding='utf-8')

print('Homepage rebalanced: original hero copy kept, tools first, guided features second.')
