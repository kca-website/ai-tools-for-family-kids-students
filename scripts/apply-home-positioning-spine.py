from pathlib import Path


def replace_once(path, old, new):
    p = Path(path)
    text = p.read_text(encoding='utf-8')
    count = text.count(old)
    if count != 1:
        raise SystemExit(f'{path}: expected 1 match, found {count} for {old[:120]!r}')
    p.write_text(text.replace(old, new, 1), encoding='utf-8')

# ---- index.html: reposition the existing product without removing any existing capability ----
replace_once(
    'index.html',
    '<title>Μαθαίνω Έξυπνα με AI | AI Εργαλεία για Μαθητές: Δημοτικό, Γυμνάσιο, Λύκειο</title>',
    '<title>Μαθαίνω Έξυπνα με AI | Χάρτης Εξάσκησης & AI Εργαλεία για Μαθητές</title>'
)
replace_once(
    'index.html',
    '<meta name="description" content="Δωρεάν, δίγλωσσος οδηγός AI για Δημοτικό, Γυμνάσιο και Λύκειο: Χάρτης Εξάσκησης, learning paths, προτάσεις εργαλείων και προαιρετική AI Βοήθεια με καθοδήγηση αντί για έτοιμες λύσεις." />',
    '<meta name="description" content="Δωρεάν ελληνικός χάρτης μάθησης με AI για μαθητές 6–18, γονείς και εκπαιδευτικούς: Χάρτης Εξάσκησης, learning paths, επιλεγμένα AI εργαλεία και AI Βοήθεια που καθοδηγεί χωρίς έτοιμες λύσεις." />'
)
replace_once(
    'index.html',
    '<meta property="og:title" content="Μαθαίνω Έξυπνα με AI" />',
    '<meta property="og:title" content="Μαθαίνω Έξυπνα με AI · Χάρτης Εξάσκησης" />'
)
replace_once(
    'index.html',
    '<meta property="og:description" content="Δες πού χρειάζεται εξάσκηση, βρες το κατάλληλο AI εργαλείο και χρησιμοποίησε προαιρετική AI Βοήθεια που καθοδηγεί χωρίς να δίνει έτοιμη λύση. Για γονείς, μαθητές 6-18 και εκπαιδευτικούς." />',
    '<meta property="og:description" content="Όταν ένα παιδί δεν έχει καταλάβει κάτι, δες τι χρειάζεται εξάσκηση και ποιο είναι το επόμενο σωστό βήμα — με ή χωρίς AI. Χάρτης Εξάσκησης, learning paths, επιλεγμένα εργαλεία και καθοδηγούμενη AI Βοήθεια." />'
)
replace_once(
    'index.html',
    '<meta name="twitter:title" content="Μαθαίνω Έξυπνα με AI" />',
    '<meta name="twitter:title" content="Μαθαίνω Έξυπνα με AI · Χάρτης Εξάσκησης" />'
)
replace_once(
    'index.html',
    '<meta name="twitter:description" content="Δωρεάν, δίγλωσσος οδηγός AI για μαθητές 6-18, γονείς και εκπαιδευτικούς, με Χάρτη Εξάσκησης και προαιρετική AI Βοήθεια." />',
    '<meta name="twitter:description" content="Βρες τι χρειάζεται εξάσκηση και το επόμενο σωστό βήμα — με ή χωρίς AI. Για μαθητές 6–18, γονείς και εκπαιδευτικούς." />'
)
replace_once(
    'index.html',
    '"description": "Δωρεάν, δίγλωσσος οδηγός AI για Δημοτικό, Γυμνάσιο και Λύκειο. Περιλαμβάνει Χάρτη Εξάσκησης, learning paths, προτάσεις εργαλείων και προαιρετική AI Βοήθεια με καθοδήγηση αντί για έτοιμες λύσεις.",',
    '"description": "Δωρεάν ελληνικός χάρτης μάθησης με AI για μαθητές 6–18, γονείς και εκπαιδευτικούς. Περιλαμβάνει Χάρτη Εξάσκησης, learning paths, επιλεγμένα εργαλεία και προαιρετική AI Βοήθεια που καθοδηγεί χωρίς έτοιμες λύσεις.",'
)
replace_once(
    'index.html',
    '        Ανεξάρτητο, δωρεάν, δίγλωσσο (Ελληνικά/Αγγλικά) εργαλείο που βοηθά γονείς, μαθητές 6 έως 18 ετών\n        και εκπαιδευτικούς να βρουν ποιο συγκεκριμένο AI εργαλείο ταιριάζει σε ποια σχολική δουλειά, ανά ηλικία.\n        Ο οδηγός και ο Χάρτης Εξάσκησης λειτουργούν χωρίς λογαριασμό. Η προαιρετική AI Βοήθεια απαιτεί JavaScript και σύνδεση σε Puter.',
    '        Ανεξάρτητο, δωρεάν, δίγλωσσο (Ελληνικά/Αγγλικά) εργαλείο που βοηθά γονείς, μαθητές 6 έως 18 ετών\n        και εκπαιδευτικούς να εντοπίσουν τι χρειάζεται εξάσκηση και ποιο είναι το επόμενο σωστό βήμα — με ή χωρίς AI.\n        Περιλαμβάνει Χάρτη Εξάσκησης, Μονοπάτια Μάθησης, επιλεγμένα εργαλεία και προαιρετική AI Βοήθεια. Ο βασικός οδηγός λειτουργεί χωρίς λογαριασμό.'
)
replace_once(
    'index.html',
    '          Δες σε 2 λεπτά πού χρειάζεται λίγη παραπάνω εξάσκηση ο μαθητής ή ο γονιός\n          και ποιο δωρεάν AI εργαλείο ταιριάζει ακριβώς εκεί. Για γονείς, μαθητές 6 έως 18\n          αλλά και εκπαιδευτικούς.',
    '          Όταν ένα παιδί δεν έχει καταλάβει κάτι, ξεκίνα εδώ: δες τι χρειάζεται εξάσκηση\n          και ποιο είναι το επόμενο σωστό βήμα — με ή χωρίς AI. Για μαθητές 6 έως 18,\n          γονείς και εκπαιδευτικούς.'
)
replace_once(
    'index.html',
    '        </div>\n\n        <div class="hero__quiz-cta-wrap">',
    '''        </div>\n\n        <div class="hero__learning-loop" aria-labelledby="heroFlowLabel">\n          <p id="heroFlowLabel" class="hero__learning-loop-label" data-i18n="heroFlowLabel">Η διαδρομή μάθησης</p>\n          <ol class="hero__learning-loop-steps">\n            <li data-i18n="heroFlowDifficulty">Δυσκολία</li>\n            <li data-i18n="heroFlowSpot">Εντοπισμός</li>\n            <li data-i18n="heroFlowPractice">Εξάσκηση</li>\n            <li data-i18n="heroFlowGuidance">Καθοδήγηση</li>\n            <li data-i18n="heroFlowRetry">Ξαναδοκιμή</li>\n          </ol>\n        </div>\n\n        <div class="hero__quiz-cta-wrap">'''
)
replace_once(
    'index.html',
    '<span class="hero__quiz-cta-title" data-i18n="heroQuizCta">Χάρτης Εξάσκησης σε 2 λεπτά</span>',
    '<span class="hero__quiz-cta-title" data-i18n="heroQuizCta">Χάρτης Εξάσκησης · ξεκίνα εδώ</span>'
)
replace_once(
    'index.html',
    '<span class="hero__quiz-cta-sub" data-i18n="heroQuizCtaSub">Λίγες σύντομες ερωτήσεις για να δεις ποια σημεία αξίζει να εξασκήσεις περισσότερο. Χωρίς βαθμό και χωρίς διάγνωση — μόνο ένα σημείο εκκίνησης για το επόμενο Μονοπάτι Μάθησης.</span>',
    '<span class="hero__quiz-cta-sub" data-i18n="heroQuizCtaSub">Λίγες σύντομες ερωτήσεις για να δεις ποια σημεία αξίζει να δουλέψεις περισσότερο και να πας στο επόμενο Μονοπάτι Μάθησης. Χωρίς βαθμό και χωρίς διάγνωση.</span>'
)
replace_once(
    'index.html',
    '<span class="hero__ai-help-badge" data-i18n="heroHelpBadge">Νέο</span>\n            <h2 id="heroAiHelpTitle" data-i18n="heroHelpTitle">Κόλλησες σε άσκηση;</h2>\n            <p data-i18n="heroHelpSub">Η AI Βοήθεια σε καθοδηγεί με ερωτήσεις και μικρές υποδείξεις, χωρίς να σου παραδίδει έτοιμη λύση.</p>',
    '<span class="hero__ai-help-badge" data-i18n="heroHelpBadge">Κόλλησα εδώ</span>\n            <h2 id="heroAiHelpTitle" data-i18n="heroHelpTitle">Δείξε μου πώς να το μάθω — όχι τη λύση</h2>\n            <p data-i18n="heroHelpSub">Η AI Βοήθεια ξεκινά από τη δική σου προσπάθεια και σε καθοδηγεί με μία ερώτηση ή μικρή υπόδειξη τη φορά, χωρίς έτοιμη τελική απάντηση.</p>'
)
replace_once(
    'index.html',
    '        Κάθε ζώνη έχει διαφορετικά κατάλληλα εργαλεία και διαφορετικό βαθμό αυτονομίας.',
    '        Αν ξέρεις ήδη τη σχολική βαθμίδα, μπες από εδώ. Σε κάθε ζώνη θα βρεις Χάρτη Εξάσκησης, Μονοπάτια Μάθησης, καθοδήγηση και επιλεγμένα εργαλεία.'
)

# ---- app.js: source-of-truth bilingual strings ----
replace_once(
    'app.js',
    '      heroSubtitle: "Δες σε 2 λεπτά πού χρειάζεται λίγη παραπάνω εξάσκηση ο μαθητής ή ο γονιός και ποιο δωρεάν AI εργαλείο ταιριάζει ακριβώς εκεί. Για γονείς, μαθητές 6 έως 18 αλλά και εκπαιδευτικούς.",',
    '      heroSubtitle: "Όταν ένα παιδί δεν έχει καταλάβει κάτι, ξεκίνα εδώ: δες τι χρειάζεται εξάσκηση και ποιο είναι το επόμενο σωστό βήμα — με ή χωρίς AI. Για μαθητές 6 έως 18, γονείς και εκπαιδευτικούς.",'
)
replace_once(
    'app.js',
    '      chooseZoneSubheading: "Κάθε ζώνη έχει διαφορετικά κατάλληλα εργαλεία και διαφορετικό βαθμό αυτονομίας.",\n      heroQuizCta: "Χάρτης Εξάσκησης σε 2 λεπτά",\n      heroQuizCtaSub: "Λίγες σύντομες ερωτήσεις για να δεις ποια σημεία αξίζει να εξασκήσεις περισσότερο. Χωρίς βαθμό και χωρίς διάγνωση — μόνο ένα σημείο εκκίνησης για το επόμενο Μονοπάτι Μάθησης.",',
    '      chooseZoneSubheading: "Αν ξέρεις ήδη τη σχολική βαθμίδα, μπες από εδώ. Σε κάθε ζώνη θα βρεις Χάρτη Εξάσκησης, Μονοπάτια Μάθησης, καθοδήγηση και επιλεγμένα εργαλεία.",\n      heroFlowLabel: "Η διαδρομή μάθησης",\n      heroFlowDifficulty: "Δυσκολία",\n      heroFlowSpot: "Εντοπισμός",\n      heroFlowPractice: "Εξάσκηση",\n      heroFlowGuidance: "Καθοδήγηση",\n      heroFlowRetry: "Ξαναδοκιμή",\n      heroQuizCta: "Χάρτης Εξάσκησης · ξεκίνα εδώ",\n      heroQuizCtaSub: "Λίγες σύντομες ερωτήσεις για να δεις ποια σημεία αξίζει να δουλέψεις περισσότερο και να πας στο επόμενο Μονοπάτι Μάθησης. Χωρίς βαθμό και χωρίς διάγνωση.",'
)
replace_once(
    'app.js',
    '      heroHelpBadge: "Νέο",\n      heroHelpTitle: "Κόλλησες σε άσκηση;",\n      heroHelpSub: "Η AI Βοήθεια σε καθοδηγεί με ερωτήσεις και μικρές υποδείξεις, χωρίς να σου παραδίδει έτοιμη λύση.",',
    '      heroHelpBadge: "Κόλλησα εδώ",\n      heroHelpTitle: "Δείξε μου πώς να το μάθω — όχι τη λύση",\n      heroHelpSub: "Η AI Βοήθεια ξεκινά από τη δική σου προσπάθεια και σε καθοδηγεί με μία ερώτηση ή μικρή υπόδειξη τη φορά, χωρίς έτοιμη τελική απάντηση.",'
)
replace_once(
    'app.js',
    '      heroSubtitle: "See in 2 minutes where the student or the parent could use a bit more practice, and which free AI tool fits exactly there. For parents, students 6 to 18, and educators.",',
    '      heroSubtitle: "When a child has not understood something, start here: see what needs practice and what the next right step is — with or without AI. For students aged 6–18, parents and educators.",'
)
replace_once(
    'app.js',
    '      chooseZoneSubheading: "Each zone has different suitable tools and a different level of independence.",\n      heroQuizCta: "Practice Map in 2 minutes",\n      heroQuizCtaSub: "A few short questions to spot what may be worth practising more. No grade and no diagnosis — just a starting point for the next Learning Path.",',
    '      chooseZoneSubheading: "If you already know the school level, start here. Each zone includes the Practice Map, Learning Paths, guidance and a curated set of tools.",\n      heroFlowLabel: "The learning route",\n      heroFlowDifficulty: "Difficulty",\n      heroFlowSpot: "Spot the gap",\n      heroFlowPractice: "Practice",\n      heroFlowGuidance: "Guidance",\n      heroFlowRetry: "Try again",\n      heroQuizCta: "Practice Map · start here",\n      heroQuizCtaSub: "A few short questions to spot what is worth practising more and move to the next Learning Path. No grade and no diagnosis.",'
)
replace_once(
    'app.js',
    '      heroHelpBadge: "New",\n      heroHelpTitle: "Stuck on an exercise?",\n      heroHelpSub: "AI Help guides you with questions and small hints instead of handing over a finished answer.",',
    '      heroHelpBadge: "I’m stuck here",\n      heroHelpTitle: "Show me how to learn it — not the answer",\n      heroHelpSub: "AI Help starts from your own attempt and guides you with one question or small hint at a time, without handing over a finished answer.",'
)

# ---- styles.css: a compact learning-loop strip; no redesign of the existing visual identity ----
replace_once(
    'styles.css',
    '.hero__badges {\n  display: flex;\n  gap: 8px;\n  flex-wrap: wrap;\n  margin-bottom: 22px;\n}\n\n/* ---------- Hero quiz CTA (viral hook) ---------- */',
    '''.hero__badges {\n  display: flex;\n  gap: 8px;\n  flex-wrap: wrap;\n  margin-bottom: 18px;\n}\n\n.hero__learning-loop {\n  max-width: 760px;\n  margin: 0 0 20px;\n  padding: 11px 13px;\n  border: 1px solid rgba(46, 111, 94, 0.16);\n  border-radius: var(--radius-md);\n  background: rgba(255, 255, 255, 0.48);\n}\n\n.hero__learning-loop-label {\n  margin: 0 0 7px;\n  font-size: .75rem;\n  font-weight: 800;\n  color: #31564a;\n  text-transform: uppercase;\n  letter-spacing: .035em;\n}\n\n.hero__learning-loop-steps {\n  display: flex;\n  align-items: center;\n  flex-wrap: wrap;\n  gap: 5px 0;\n  list-style: none;\n  margin: 0;\n  padding: 0;\n  color: #32443b;\n  font-size: .83rem;\n  font-weight: 700;\n}\n\n.hero__learning-loop-steps li {\n  display: inline-flex;\n  align-items: center;\n}\n\n.hero__learning-loop-steps li:not(:last-child)::after {\n  content: "→";\n  margin: 0 8px;\n  color: #70857a;\n  font-weight: 700;\n}\n\n/* ---------- Hero quiz CTA (viral hook) ---------- */'''
)
replace_once(
    'styles.css',
    '@media (max-width: 700px) {\n  .hero__ai-help { grid-template-columns: 1fr; }\n  .hero__ai-help-actions { grid-template-columns: 1fr; }\n}',
    '@media (max-width: 700px) {\n  .hero__learning-loop { padding: 10px 12px; }\n  .hero__learning-loop-steps { font-size: .78rem; }\n  .hero__learning-loop-steps li:not(:last-child)::after { margin: 0 6px; }\n  .hero__ai-help { grid-template-columns: 1fr; }\n  .hero__ai-help-actions { grid-template-columns: 1fr; }\n}'
)

# ---- home-accessibility.js: stop rewriting hero copy after app.js; keep all accessibility/curriculum features ----
replace_once(
    'home-accessibility.js',
    '''    const subtitle = document.querySelector('[data-i18n="heroSubtitle"]');\n\n    if (subtitle) {\n      subtitle.textContent = en\n        ? "See where practice is needed, find the right AI tool, and learn how to use it effectively. Practice Map, personalized learning paths, guided AI Help and accessible educational resources for students aged 6–18, parents and educators."\n        : "Δες πού χρειάζεται εξάσκηση, βρες το κατάλληλο AI εργαλείο και μάθε πώς να το χρησιμοποιείς σωστά. Χάρτης Εξάσκησης, εξατομικευμένα learning paths, AI Βοήθεια και προσβάσιμο εκπαιδευτικό υλικό για μαθητές 6–18, γονείς και εκπαιδευτικούς.";\n    }\n\n    ensureCurriculumMapEntry(en);''',
    '''    // Hero positioning copy lives in app.js / index.html so language changes do not race a second runtime source.\n    ensureCurriculumMapEntry(en);'''
)
replace_once(
    'home-accessibility.js',
    '''    const description = en\n      ? "Free bilingual learning guide for students 6–18, parents and educators: Practice Map, learning paths, AI tool recommendations, guided AI Help, Greek curriculum mapping and accessible educational resources."\n      : "Δωρεάν δίγλωσσος οδηγός μάθησης για μαθητές 6–18, γονείς και εκπαιδευτικούς: Χάρτης Εξάσκησης, learning paths, προτάσεις AI εργαλείων, καθοδηγούμενη AI Βοήθεια, Ελληνικός Χάρτης Ύλης και προσβάσιμο εκπαιδευτικό υλικό.";''',
    '''    const description = en\n      ? "Free bilingual AI learning map for students 6–18, parents and educators: Practice Map, learning paths, curated AI tools, guided AI Help, Greek curriculum mapping and accessible educational resources."\n      : "Δωρεάν ελληνικός χάρτης μάθησης με AI για μαθητές 6–18, γονείς και εκπαιδευτικούς: Χάρτης Εξάσκησης, learning paths, επιλεγμένα AI εργαλεία, καθοδηγούμενη AI Βοήθεια, Ελληνικός Χάρτης Ύλης και προσβάσιμο εκπαιδευτικό υλικό.";'''
)

# ---- add product-positioning smoke to permanent CI ----
replace_once(
    '.github/workflows/tutor-consolidation-smoke.yml',
    '      - name: Run installed-mobile homepage smoke\n        run: node tests/mobile-home-pwa-smoke.mjs\n\n      - name: Run early Primary simple quiz smoke',
    '      - name: Run installed-mobile homepage smoke\n        run: node tests/mobile-home-pwa-smoke.mjs\n\n      - name: Run homepage positioning smoke\n        run: node tests/home-positioning-smoke.mjs\n\n      - name: Run early Primary simple quiz smoke'
)

print('home positioning spine patch applied')
