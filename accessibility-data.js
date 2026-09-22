/**
 * accessibility-data.js
 * ------------------------------------------------------------
 * Ευρήματα έρευνας προσβασιμότητας ανά εργαλείο (22 Σεπτεμβρίου 2026).
 * Μέθοδος: επίσημες δηλώσεις/VPAT όπου υπάρχουν, αλλιώς αξιόπιστες
 * ανεξάρτητες αξιολογήσεις (πανεπιστήμια, Perkins School for the Blind).
 * Καμία πληροφορία εδώ δεν είναι επινοημένη: status "none" σημαίνει
 * ρητά "δεν βρέθηκε καμία πηγή", όχι "δεν είναι προσβάσιμο".
 *
 * status: "good" | "partial" | "caution" | "none"
 *   good    -> επίσημη δήλωση/VPAT ή ισχυρά τεκμηριωμένα χαρακτηριστικά
 *   partial -> κάποια στοιχεία, με τεκμηριωμένα κενά
 *   caution -> ανεξάρτητη αξιολόγηση βρήκε σημαντικό πρόβλημα
 *   none    -> καμία πηγή δεν εντοπίστηκε
 *
 * Μόνο "good" και "caution" εμφανίζονται ως badge στην κάρτα εργαλείου
 * (για να μην γεμίσει η λίστα με "καμία πληροφορία" badges). Όλα
 * εμφανίζονται στη σελίδα /accessibility.html.
 */

const ACCESSIBILITY_INFO = {
  "digital-tutoring": {
    status: "good",
    noteEl: "Επίσημη υπηρεσία ΥΠΑΙΘΑ με ειδική μέριμνα προσβασιμότητας: τα μαθήματα Πανελλαδικών μεταδίδονται με παράλληλη διερμηνεία στην Ελληνική Νοηματική Γλώσσα και αναρτώνται υποτιτλισμένα. Η κατάταξη αφορά το εκπαιδευτικό περιεχόμενο/υπηρεσία, όχι ανεξάρτητο πλήρες WCAG audit κάθε οθόνης.",
    noteEn: "Official Greek Ministry service with explicit accessibility support: Panhellenic-exam lessons include Greek Sign Language interpretation and are later published with captions. This rating reflects the learning service/content, not a full independent WCAG audit of every interface screen.",
    sourceUrl: "https://www.minedu.gov.gr/psifiako-frontistirio",
  },
  "scispace": {
    status: "none",
    noteEl: "Δεν εντοπίστηκε επίσημη δήλωση προσβασιμότητας ή VPAT/ACR για την κύρια πλατφόρμα SciSpace. Η ύπαρξη επιμέρους εργαλείου ελέγχου WCAG μέσα στο SciSpace δεν τεκμηριώνει την προσβασιμότητα του ίδιου του interface.",
    noteEn: "No official accessibility statement or VPAT/ACR was located for the main SciSpace platform. A WCAG-checking agent inside SciSpace does not establish accessibility of the platform interface itself.",
    sourceUrl: null,
  },

  "deepl": {
    status: "partial",
    noteEl: "Η DeepL δημοσιεύει επίσημη σελίδα προσβασιμότητας και αναφέρει ότι το WCAG 2.1 AA αποτελεί μέρος της διαδικασίας ανάπτυξης. Δεν εντοπίστηκε δημόσιο VPAT/ACR για πλήρη συμμόρφωση, οπότε καταγράφεται ως μερικό/υποσχόμενο.",
    noteEn: "DeepL publishes an official accessibility page and says WCAG 2.1 AA is integrated into product development. No public VPAT/ACR confirming full conformance was located, so this is marked partial.",
    sourceUrl: "https://www.deepl.com/accessibility",
  },
  "anki": {
    status: "partial",
    noteEl: "Δεν εντοπίστηκε σύγχρονο επίσημο VPAT/ACR. Δημόσιες συζητήσεις της κοινότητας/προγραμματιστών έχουν καταγράψει προβλήματα screen reader στο desktop/mobile, ενώ το AnkiWeb μπορεί να λειτουργεί καλύτερα για βασικές κάρτες. Χρειάζεται δοκιμή με την υποστηρικτική τεχνολογία του χρήστη.",
    noteEn: "No current official VPAT/ACR was located. Public developer/community discussions have documented screen-reader issues on desktop/mobile, while AnkiWeb may work better for basic cards. Test with the user's assistive technology.",
    sourceUrl: "https://forums.ankiweb.net/t/accessibility-questions-using-anki-if-you-need-to-use-assistive-technology-like-screen-readers/17856",
  },
  "zotero": {
    status: "good",
    noteEl: "Επίσημη τεκμηρίωση: το Zotero Desktop δηλώνει πλήρη συμμόρφωση με WCAG 2.2 AA, έχει ελεγχθεί με VoiceOver/NVDA/JAWS και διαθέτει VPAT/ACR. Το web library/ZoteroBib αξιολογούνται χωριστά.",
    noteEn: "Official documentation: Zotero Desktop states full WCAG 2.2 AA conformance, is tested with VoiceOver/NVDA/JAWS and provides a VPAT/ACR. The web library/ZoteroBib are assessed separately.",
    sourceUrl: "https://www.zotero.org/accessibility",
  },
  "google-lens": {
    status: "partial",
    noteEl: "Δεν εντοπίστηκε ξεχωριστό VPAT/ACR ειδικά για Google Lens. Η λειτουργία ενσωματώνεται σε Google/Chrome/Android με το γενικό οικοσύστημα προσβασιμότητας, αλλά επειδή είναι οπτικό εργαλείο χρειάζεται πρακτικός έλεγχος για screen-reader/low-vision χρήση.",
    noteEn: "No Lens-specific VPAT/ACR was located. It runs inside Google's broader accessibility ecosystem, but because it is a visual tool, practical screen-reader/low-vision testing is still needed.",
    sourceUrl: "https://support.google.com/websearch/answer/1325808",
  },
  "gamma": {
    status: "partial",
    noteEl: "Επίσημη δήλωση 2026: στόχος WCAG 2.2 AA, keyboard/focus βάση μέσω Chakra UI, contrast controls και reflow. Η Gamma δηλώνει ρητά ότι δεν έχει ακόμη VPAT/ACR ούτε ολοκληρωμένο formal screen-reader audit· alt text και tagged PDF εξαγωγές παραμένουν σε εξέλιξη.",
    noteEn: "Official 2026 statement: WCAG 2.2 AA target, keyboard/focus foundation via Chakra UI, contrast controls and reflow. Gamma explicitly says it does not yet have a VPAT/ACR or completed formal screen-reader audit; alt text and tagged-PDF export are still in progress.",
    sourceUrl: "https://gamma.app/accessibility",
  },
  "notion": {
    status: "partial",
    noteEl: "Το Notion διαθέτει Accessibility Conformance Report μέσω του Trust Center και έχει βελτιώσει keyboard/screen-reader support. Ανεξάρτητες αξιολογήσεις έχουν καταγράψει ακόμη κενά σε alt text, contrast και tabbing, γι' αυτό δεν χαρακτηρίζεται πλήρως προσβάσιμο.",
    noteEn: "Notion provides an Accessibility Conformance Report through its Trust Center and has improved keyboard/screen-reader support. Independent evaluations still report gaps in alt text, contrast and tabbing, so it is not marked fully accessible.",
    sourceUrl: "https://trust.notion.com/controls",
  },
  "ai-help": {
    status: "partial",
    noteEl: "Εσωτερικό εργαλείο του aitools4kids.gr. Οι αυτοματοποιημένοι έλεγχοι axe-core/Playwright στις βασικές ροές δεν εντόπισαν παραβιάσεις στις καταστάσεις που ελέγχθηκαν, αλλά δεν υπάρχει ανεξάρτητη πλήρης χειροκίνητη αξιολόγηση ή VPAT/ACR.",
    noteEn: "Internal aitools4kids.gr tool. Automated axe-core/Playwright checks found no violations in the tested core flows, but there is no independent full manual audit or VPAT/ACR.",
    sourceUrl: "/accessibility.html",
  },
  "phet": {
    status: "good",
    noteEl: "Επίσημη δήλωση προσβασιμότητας του PhET: στόχος WCAG 2.1 AA, εναλλακτική είσοδος, keyboard navigation, screen-reader descriptions/voicing σε επιλεγμένες προσομοιώσεις και ACR διαθέσιμο κατόπιν αιτήματος. Δεν έχουν όλες οι παλιότερες προσομοιώσεις το πλήρες σύνολο λειτουργιών.",
    noteEn: "Official PhET accessibility statement: WCAG 2.1 AA target, alternative input, keyboard navigation, screen-reader descriptions/voicing in selected simulations, and an ACR available on request. Not all older simulations include the full feature set.",
    sourceUrl: "https://phet.colorado.edu/en/inclusive-design/accessibility-statement",
  },
  "google-arts-culture": {
    status: "none",
    noteEl: "Δεν εντοπίστηκε ειδική, επαρκής επίσημη δήλωση προσβασιμότητας για την εμπειρία Google Arts & Culture που να επιτρέπει συγκεκριμένο χαρακτηρισμό. Αυτό δεν σημαίνει ότι η υπηρεσία είναι μη προσβάσιμη.",
    noteEn: "No specific, sufficient official accessibility statement was located for the Google Arts & Culture experience that would support a stronger classification. This does not mean the service is inaccessible.",
    sourceUrl: null,
  },
  "gemini-education": {
    status: "partial",
    noteEl: "Σχολική διαδρομή του Gemini μέσω Google Workspace for Education. Κληρονομεί το ίδιο γενικό οικοσύστημα προσβασιμότητας της Google/Gemini, αλλά δεν εντοπίστηκε ξεχωριστό ACR/VPAT ειδικά για το Gemini for Education.",
    noteEn: "School-managed Gemini route through Google Workspace for Education. It inherits the broader Google/Gemini accessibility ecosystem, but no separate ACR/VPAT specific to Gemini for Education was located.",
    sourceUrl: "https://support.google.com/gemini/answer/14620100?co=DASHER._Family%3DEducation&hl=en",
  },
  "desmos": {
    status: "good",
    noteEl: "Επίσημο Accessibility Conformance Report. Audio trace σε γραφήματα, screen-reader συμβατός equation editor, υποστήριξη Braille. Περιορισμός: πολικά γραφήματα δεν καλύπτονται.",
    noteEn: "Official Accessibility Conformance Report. Audio trace for graphs, screen-reader compatible equation editor, Braille support. Limitation: polar graphs not covered.",
    sourceUrl: "https://www.desmos.com/acr",
  },
  "geogebra": {
    status: "good",
    noteEl: "WCAG 2.2 AA, πλήρης πλοήγηση πληκτρολογίου, υποστήριξη screen reader και Braille display.",
    noteEn: "WCAG 2.2 AA, full keyboard navigation, screen reader and Braille display support.",
    sourceUrl: "https://help.geogebra.org/hc/en-us/articles/20048444963869-Accessibility",
  },
  "canva-magic": {
    status: "good",
    noteEl: "Επίσημη σελίδα + VPAT (WCAG 2.1/2.2 AA). Design Accessibility Checker, auto-captions video, alt-text, high contrast.",
    noteEn: "Official page + VPAT (WCAG 2.1/2.2 AA). Design Accessibility Checker, auto-captions for video, alt-text, high contrast.",
    sourceUrl: "https://www.canva.com/accessibility/",
  },
  "scite": {
    status: "good",
    noteEl: "WCAG 2.1/2.2 AA, συμβατότητα ADA Title II, VPAT διαθέσιμο, καμία γνωστή εκκρεμότητα.",
    noteEn: "WCAG 2.1/2.2 AA, ADA Title II compliant, VPAT available, no known outstanding issues.",
    sourceUrl: "https://scite.ai/accessibility-statement",
  },
  "github-copilot": {
    status: "good",
    noteEl: "Επίσημα Accessibility Conformance Reports (ACR) και για το Copilot και για το Copilot CLI.",
    noteEn: "Official Accessibility Conformance Reports (ACR) for both Copilot and Copilot CLI.",
    sourceUrl: "https://accessibility.github.com/conformance/github-copilot/",
  },
  "grammarly": {
    status: "good",
    noteEl: "Επίσημη δήλωση, tested με NVDA/JAWS/VoiceOver. Σημείωση: υπήρξε αγωγή ADA το 2021 για μη συμμόρφωση.",
    noteEn: "Official statement, tested with NVDA/JAWS/VoiceOver. Note: faced an ADA lawsuit in 2021 over non-compliance.",
    sourceUrl: "https://www.grammarly.com/accessibility-statement",
  },
  "khan-academy-kids": {
    status: "good",
    noteEl: "Επίσημη δήλωση προσβασιμότητας, δραστηριότητες σε πολλαπλές αισθητηριακές μορφές.",
    noteEn: "Official accessibility statement, activities available in multiple sensory formats.",
    sourceUrl: "https://khankids.zendesk.com/hc/en-us/articles/4914881968283-Our-Accessibility-Statement",
  },
  "magicschool": {
    status: "good",
    noteEl: "Επίσημη δήλωση + δημοσιευμένο VPAT/ACR, βελτιώσεις screen reader στον AI βοηθό.",
    noteEn: "Official statement + published VPAT/ACR, screen reader improvements to the AI assistant.",
    sourceUrl: "https://www.magicschool.ai/accessibility",
  },
  "quizlet": {
    status: "good",
    noteEl: "Επίσημη σελίδα δήλωσης με κανάλι επικοινωνίας για θέματα προσβασιμότητας.",
    noteEn: "Official statement page with a dedicated accessibility contact channel.",
    sourceUrl: "https://quizlet.com/accessibility",
  },
  "copilot": {
    status: "good",
    noteEl: "Immersive Reader, Narrator, ρυθμίσεις για δυσλεξία, live captions. Ανεξάρτητος έλεγχος (UCL) βρήκε και συγκεκριμένες WCAG αποτυχίες σε σημεία.",
    noteEn: "Immersive Reader, Narrator, dyslexia-friendly settings, live captions. An independent audit (UCL) found specific WCAG failures in places.",
    sourceUrl: "https://www.ucl.ac.uk/accessibility/digital-accessibility-statements/microsoft-365-copilot-accessibility-statement",
  },
  "reading-coach": {
    status: "good",
    noteEl: "Κληρονομεί το πλαίσιο προσβασιμότητας Microsoft 365 (Immersive Reader, read-aloud, υποστήριξη δυσλεξίας).",
    noteEn: "Inherits the Microsoft 365 accessibility framework (Immersive Reader, read-aloud, dyslexia support).",
    sourceUrl: "https://www.microsoft.com/en-us/education/blog/2025/05/making-learning-more-accessible-with-microsoft-education/",
  },
  "wolfram-alpha": {
    status: "caution",
    noteEl: "Το Perkins School for the Blind αξιολόγησε το εργαλείο ως μη προσβάσιμο σε σημαντικό βαθμό για τυφλούς/αμβλύωπες χρήστες χωρίς βοήθεια βλέποντος.",
    noteEn: "Perkins School for the Blind assessed the tool as not accessible to a meaningful degree for blind/low-vision users without sighted help.",
    sourceUrl: "https://www.perkins.org/resource/wolfram-alpha/",
  },
  "claude": {
    status: "partial",
    noteEl: "Το Anthropic Trust Center δημοσιεύει Accessibility Conformance Reports (κυρίως enterprise/iOS). Ανεξάρτητη δοκιμή από τυφλό χρήστη NVDA βρήκε συγκεκριμένα κενά στο claude.ai web.",
    noteEn: "Anthropic's Trust Center publishes Accessibility Conformance Reports (mainly enterprise/iOS). An independent NVDA user test found specific gaps on claude.ai web.",
    sourceUrl: "https://trust.anthropic.com/",
  },
  "claude-academy": {
    status: "partial",
    noteEl: "Ίδιος οργανισμός με το Claude: δείτε τα ευρήματα του Claude παραπάνω.",
    noteEn: "Same organization as Claude: see Claude's findings above.",
    sourceUrl: "https://trust.anthropic.com/",
  },
  "chatgpt": {
    status: "partial",
    noteEl: "Καμία επίσημη δήλωση από την OpenAI δεν εντοπίστηκε. Ανεξάρτητη αξιολόγηση βρήκε προβλήματα πλοήγησης με screen reader.",
    noteEn: "No official statement from OpenAI was found. An independent evaluation found screen-reader navigation issues.",
    sourceUrl: "https://www.captechconsulting.com/technical/artificial-intelligence-accessibility-a-look-into-chatgpt",
  },
  "chatgpt-edu": {
    status: "partial",
    noteEl: "Ίδιος οργανισμός με το ChatGPT: δείτε τα ευρήματα του ChatGPT παραπάνω.",
    noteEn: "Same organization as ChatGPT: see ChatGPT's findings above.",
    sourceUrl: "https://www.captechconsulting.com/technical/artificial-intelligence-accessibility-a-look-into-chatgpt",
  },
  "gemini": {
    status: "partial",
    noteEl: "Ισχυρή ενσωμάτωση σε επίπεδο Android/Chrome (TalkBack, Expressive Captions): αλλά αυτό αφορά το λειτουργικό σύστημα, όχι ειδικά το gemini.google.com.",
    noteEn: "Strong integration at the Android/Chrome OS level (TalkBack, Expressive Captions): but this is OS-wide, not specific to gemini.google.com.",
    sourceUrl: "https://blog.google/company-news/outreach-and-initiatives/accessibility/android-gemini-ai-gaad-2025/",
  },
  "notebooklm": {
    status: "partial",
    noteEl: "Ανεξάρτητες αξιολογήσεις πανεπιστημίων βρήκαν πραγματικά κενά (context αλλαγές χωρίς ανακοίνωση). Θετικό: η λειτουργία podcast/ήχου βοηθάει ακουστικούς μαθητές.",
    noteEn: "Independent university evaluations found real gaps (unannounced context changes). Positive: the audio/podcast feature helps auditory learners.",
    sourceUrl: "https://kb.wisc.edu/accessibility/157699",
  },
  "duolingo": {
    status: "partial",
    noteEl: "Επίσημη σελίδα Accessibility FAQs. Ανεξάρτητος έλεγχος σχολικού διαμερίσματος (2023) το βαθμολόγησε 'Failed' σε αρκετά κριτήρια.",
    noteEn: "Official Accessibility FAQs page. An independent school-district audit (2023) rated it 'Failed' on several criteria.",
    sourceUrl: "https://www.berkeleyschools.net/wp-content/uploads/2023/05/Web-Accessibility-Testing-Checklist-v3-Duolingo-1.pdf",
  },
  "elicit": {
    status: "partial",
    noteEl: "Επίσημη δήλωση: ρητά αναφέρει μερική συμμόρφωση με WCAG 2.1 level A.",
    noteEn: "Official statement: explicitly states partial conformance with WCAG 2.1 level A.",
    sourceUrl: "https://support.elicit.com/en/articles/4386433",
  },
  "replit-ai": {
    status: "partial",
    noteEl: "Επίσημη δήλωση: μερική συμμόρφωση με WCAG 2.1 level AA, ενεργό πρόγραμμα βελτίωσης.",
    noteEn: "Official statement: partial conformance with WCAG 2.1 level AA, active improvement program.",
    sourceUrl: "https://docs.replit.com/legal-and-security-info/web-accessibility",
  },
  "miro-ai": {
    status: "partial",
    noteEl: "Ενεργή βελτίωση: ετήσιο VPAT/ACR, εργαλείο ελέγχου προσβασιμότητας. Ιστορικά, τυφλοί χρήστες είχαν επικρίνει το read-only mode για screen reader.",
    noteEn: "Actively improving: annual VPAT/ACR, an accessibility checker tool. Historically, blind users criticized the read-only screen-reader mode.",
    sourceUrl: "https://miro.com/accessibility-statement/",
  },
  "hemingway": {
    status: "partial",
    noteEl: "Έχει προεπιλογή 'Accessible' επιπέδου αναγνωσιμότητας (χρήσιμο για απλή γλώσσα), αλλά καμία δήλωση δεν βρέθηκε για το αν το ίδιο το interface είναι προσβάσιμο σε screen reader.",
    noteEn: "Has an 'Accessible' readability preset (useful for plain language), but no statement found on whether the interface itself is screen-reader accessible.",
    sourceUrl: "https://hemingwayapp.com/help/docs/readability",
  },
  "perplexity": {
    status: "none",
    noteEl: "Καμία επίσημη δήλωση δεν εντοπίστηκε. Ανεξάρτητη κριτική εφαρμογής iOS ανέφερε καλή απόδοση με screen reader.",
    noteEn: "No official statement found. An independent iOS app review reported good screen-reader performance.",
    sourceUrl: "https://iaccessibility.net/perplexity/",
  },
  "photomath": {
    status: "none",
    noteEl: "Καμία επίσημη δήλωση προσβασιμότητας δεν εντοπίστηκε.",
    noteEn: "No official accessibility statement found.",
    sourceUrl: "",
  },
  "symbolab": {
    status: "none",
    noteEl: "Καμία επίσημη δήλωση προσβασιμότητας δεν εντοπίστηκε.",
    noteEn: "No official accessibility statement found.",
    sourceUrl: "",
  },
  "scribbr": {
    status: "none",
    noteEl: "Καμία επίσημη δήλωση προσβασιμότητας δεν εντοπίστηκε.",
    noteEn: "No official accessibility statement found.",
    sourceUrl: "",
  },
  "mindmup": {
    status: "none",
    noteEl: "Καμία επίσημη δήλωση προσβασιμότητας δεν εντοπίστηκε.",
    noteEn: "No official accessibility statement found.",
    sourceUrl: "",
  },
  "autodraw": {
    status: "none",
    noteEl: "Καμία δήλωση ειδικά για το εργαλείο δεν εντοπίστηκε.",
    noteEn: "No tool-specific statement found.",
    sourceUrl: "",
  },
  "erla": {
    status: "none",
    noteEl: "Ελληνικό εργαλείο μικρής κλίμακας· καμία δήλωση προσβασιμότητας δεν εντοπίστηκε.",
    noteEn: "Small-scale Greek tool; no accessibility statement found.",
    sourceUrl: "",
  },
  "elements-of-ai": {
    status: "none",
    noteEl: "Καμία δήλωση προσβασιμότητας δεν εντοπίστηκε σε αυτή την έρευνα.",
    noteEn: "No accessibility statement found in this research pass.",
    sourceUrl: "",
  },
};
