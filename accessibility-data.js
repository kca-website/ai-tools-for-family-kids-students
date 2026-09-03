/**
 * accessibility-data.js
 * ------------------------------------------------------------
 * Ευρήματα έρευνας προσβασιμότητας ανά εργαλείο (27 Αυγούστου 2026).
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
  "khanmigo": {
    status: "good",
    noteEl: "Επίσημη δήλωση, ρυθμίσεις προσβασιμότητας, σύσταση NVDA+Chrome, ενσωματωμένο read-aloud, VPAT κατόπιν αιτήματος.",
    noteEn: "Official statement, accessibility settings, recommended NVDA+Chrome, built-in read-aloud, VPAT on request.",
    sourceUrl: "https://support.khanacademy.org/hc/en-us/articles/360015623271-Khan-Academy-s-accessibility-settings",
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
