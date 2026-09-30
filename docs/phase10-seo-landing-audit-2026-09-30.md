# Phase 10: SEO landing pages, audit and decisions (2026-09-30)

Scope: new indexable landing pages that act as gateways to existing features. Phase 9 areas (routing, security headers,
accessibility semantics, API-06, preschool PII filtering, core app mechanics) were **not** touched.

## 1. Audit findings (before any code)

- Production could not be fetched from the build sandbox (egress proxy denies `www.aitools4kids.gr`). The audit used the repo as
  the source of truth (`vercel.json`, all sitemaps, every `*.html`, `data.js`, `curriculum-data.js`, `official-curriculum-data.js`,
  `api/schoolbook-source.js`, `tutor.js`). Live verification is done after deployment (see release report).
- Existing indexable SEO pages (all `.html` URLs, listed in `seo-sitemap.xml`): `ai-ergaleia-gia-mathites`, `ai-gia-dimotiko`,
  `ai-gia-gymnasio`, `asfales-ai-gia-paidia`, plus `ti-thelo-na-kano-me-ai` and six task pages.
- **The four existing SEO pages had no inbound links** from anywhere except each other and the sitemap (orphans).
- `/primary|middle|high/{guardian|student}/{view}` are rewritten to `/` and sent `X-Robots-Tag: noindex, follow`. The
  indexable gateways therefore have to be static pages.
- `classroom.html` is a redirect to `teacher-assistant.html`; `higher-education-pilot.html` is `noindex,nofollow`
  (pilot). Neither is a landing target.
- `docs/gsc-baseline-2026-09-07.md` advised against speculative landing pages because Search Console had no query data. This phase
  was requested explicitly, so pages are built only where the product really has content, and each page states its limits.
- Real coverage (Χάρτης Ύλης, enumerated from the running page): Δημοτικό Α΄–ΣΤ΄ (Γλώσσα, Μαθηματικά, Μελέτη Περιβάλλοντος,
  Αγγλικά Γ΄–ΣΤ΄, Ιστορία Γ΄–ΣΤ΄, Φυσικές Επιστήμες Ε΄–ΣΤ΄); Γυμνάσιο (Γλώσσα, Λογοτεχνία Β΄, Μαθηματικά, Φυσική Α΄–Γ΄, Χημεία Β΄–Γ΄,
  Βιολογία, Ιστορία, Αγγλικά, Αρχαία, Ομηρικά κ.ά.); ΓΕΛ (Έκθεση Α΄–Γ΄, Μαθηματικά **μόνο Α΄ Γενικής**, Φυσική Α΄–Β΄, Ιστορία Α΄–Γ΄,
  Βιολογία Α΄–Γ΄, Αγγλικά Β΄–Γ΄). **Χημεία Λυκείου** και **Μαθηματικά Β΄/Γ΄ Λυκείου** υπάρχουν στην AI Βοήθεια αλλά όχι ως
  διαδρομή στον Χάρτη Ύλης. Αυτό δηλώνεται ρητά στις σελίδες.
- Schoolbook grounding (`api/schoolbook-source.js`): 26 επίσημα βιβλία, 25 Γυμνασίου και η Ιστορία Α΄ Λυκείου. Δεν υπάρχει grounding
  σε βιβλία Δημοτικού ή ΓΕΛ (εκτός Ιστορίας Α΄). Οι σελίδες δεν ισχυρίζονται κάτι περισσότερο.
- AI Help access (`tutor.js`): Βοηθός Γονέα σε όλες τις βαθμίδες· άμεση χρήση μαθητή μόνο στο Λύκειο (ΓΕΛ/ΕΠΑΛ), χωρίς λογαριασμό.
- Tool ages are patched at runtime by `september-2026-tool-audit.js` (e.g. Symbolab 16+, Grammarly 16+), so the landing pages
  do **not** hard-code per-tool ages; they link to the tool card, which owns that fact.
- Prompt Generator has 16 prompts (4 Δημοτικό, 6 Γυμνάσιο, 6 Λύκειο). Pages quote only prompts that exist (by id).

## 2. Decision table

| URL | Primary search intent | Audience | Real functions it promotes | Why a separate page | Overlap risk |
|---|---|---|---|---|---|
| `/ai-gia-lykeio.html` | AI για Λύκειο / Πανελλήνιες / μελέτη | μαθητές 15–18 | Χάρτης Εξάσκησης, AI Μελέτη, AI Βοήθεια (χωρίς λογαριασμό), Prompt Generator, Ψηφιακό Φροντιστήριο, ΑΕΙ pilot (ρητά μερικό) | Λείπει εντελώς (υπήρχαν Δημοτικό/Γυμνάσιο) | Χαμηλό· `ai-ergaleia-gia-mathites` είναι γενικό |
| `/ai-gia-epal.html` | AI για ΕΠΑΛ | μαθητές ΕΠΑΛ | AI Βοήθεια με τάξη/τομέα/ειδικότητα, Χάρτης Εξάσκησης ΕΠΑΛ, AI Μελέτη, Βοηθός Εκπαιδευτικού | Διαφορετική δομή (Α΄ κοινά, Β΄ τομέας, Γ΄ ειδικότητα)· 9 τομείς/35 ειδικότητες από δεδομένα | Χαμηλό με `ai-gia-lykeio` (στέλνει εδώ) |
| `/ai-gia-goneis.html` | AI για γονείς / βοήθεια στο διάβασμα | γονείς | Βοηθός Γονέα, Χάρτης Εξάσκησης, ηλικιακοί κανόνες, Ειδική Αγωγή, ΕΝΓ, Νηπιαγωγείο | Ρόλος-κλειδί, δεν υπήρχε | Μέτριο με `asfales-ai-gia-paidia` (ασφάλεια)· εδώ: πρακτική βοήθεια |
| `/ai-gia-ekpaideftikous.html` | AI για εκπαιδευτικούς | εκπαιδευτικοί | Βοηθός Εκπαιδευτικού, Φύλλο Αξιολόγησης, ΚΥΑ 55909/Δ6/2026, εργαλεία δασκάλων | Gateway + νομικό πλαίσιο | **Μέτριο με `teacher-assistant.html`** (είναι το εργαλείο, όχι οδηγός). Διαφοροποίηση με ενημερωτικό περιεχόμενο |
| `/ai-gia-mathimatika.html` | AI για Μαθηματικά | μαθητές/γονείς | εξήγηση/υπόδειξη/έλεγχος/οπτικοποίηση, deep links σε 16 τάξεις/μαθήματα, prompts | Μεγαλύτερο κοινό, ξεχωριστές ανάγκες ανά εργαλείο | Χαμηλό |
| `/ai-gia-ekthesi.html` | AI για Έκθεση/Γλώσσα | μαθητές | επιχείρημα χωρίς έτοιμο κείμενο, reading support, prompts | Ξεχωριστό intent («γράψε μου έκθεση») | Χαμηλό |
| `/ai-gia-istoria.html` | AI για Ιστορία | μαθητές | σχολικό βιβλίο ως πηγή (Ιστορία Α΄–Γ΄ Γυμν., Α΄ Λυκ.), έλεγχος πηγών, Χαρακτήρας | Ισχυρό differentiator (grounding) | Χαμηλό |
| `/ai-gia-fysiki-chimeia.html` | AI για Φυσική / Χημεία | μαθητές | PhET, έλεγχος, flashcards, deep links | **Συνδυασμένη** (κοινά εργαλεία, αλλιώς σχεδόν ίδιες σελίδες). Χημεία Λυκείου: ρητό κενό | Χαμηλό |
| `/ai-gia-xenes-glosses.html` | AI για ξένες γλώσσες / Αγγλικά | μαθητές | Duolingo, Reading Coach, Grammarly, DeepL, deep links Αγγλικών | Μόνο Αγγλικά υποστηρίζονται, ρητά | Μέτριο με `anagnosi-agglika-ai` (ανάγνωση)· εδώ: γενικό |
| `/ai-me-elliniki-sxoliki-yli.html` | AI με ελληνική σχολική ύλη / βάσει σχολικού βιβλίου | όλοι | Χάρτης Ύλης, AI Μελέτη, λίστα 26 βιβλίων, στατιστικά επαλήθευσης | Το βασικό differentiator του site, με ρητά όρια | Χαμηλό |

### Deliberately **not** created

- `/dorean-ai-ergaleia-gia-mathites`: το intent «δωρεάν AI εργαλεία για μαθητές» ήδη εξυπηρετείται από `ai-ergaleia-gia-mathites`
  (title: «δωρεάν οδηγός ανά ηλικία και μάθημα»). Το dataset δεν έχει στοιχεία τιμολόγησης ανά εργαλείο, άρα νέα σελίδα θα
  ήταν thin ή θα επινοούσε ισχυρισμούς. Το «Δωρεάν» προβάλλεται στις δικές μας λειτουργίες.
- Ξεχωριστές σελίδες Φυσικής και Χημείας, Δημοτικού/Γυμνασίου (υπάρχουν), AI για σχολικές εργασίες (καλύπτεται από
  `erevna-me-piges-ai` και `guide`), AI για Γαλλικά/Γερμανικά κ.ά. (δεν υποστηρίζονται).
- Καθαρά URLs χωρίς `.html`: θα απαιτούσαν νέα rewrites στο `vercel.json` (routing, εκτός scope) και θα δημιουργούσαν διπλά
  URLs. Οι υπάρχουσες SEO σελίδες και όλα τα sitemaps χρησιμοποιούν ήδη `.html`, οπότε κρατήθηκε η σύμβαση.

## 3. Internal linking added

- Νέες σελίδες → Χάρτης Εξάσκησης, AI Μελέτη, AI Βοήθεια (deep links), Χάρτης Ύλης, Prompt Generator, tool pages, ειδικές διαδρομές.
- Υπάρχουσες σελίδες → νέες σελίδες: `ai-ergaleia-gia-mathites` (νέο block «Οδηγοί ανά βαθμίδα, μάθημα και ρόλο», κόμβος),
  `ai-gia-gymnasio`, `ai-gia-dimotiko`, `asfales-ai-gia-paidia` (related links), `xartis-ylis` (nav οδηγών + ΕΠΑΛ),
  `study` (ένδειξη επαλήθευσης), `teacher-assistant`, `school-ai-use`, `guide`.
- Footer (όλες οι σελίδες μέσω `site-chrome.js` και η αρχική): **ένας** σύνδεσμος προς τον κόμβο. Η αρχική δεν γεμίζει με SEO links.

## 4. Regenerating

Οι σελίδες παράγονται από `scripts/phase10/` ώστε εργαλεία, prompts, βιβλία, στατιστικά και ΕΠΑΛ τομείς να διαβάζονται από τα ίδια
δεδομένα με το site: `node scripts/phase10/build.mjs` (γράφει σελίδες + `seo-sitemap.xml`), `--check` για επαλήθευση. Το test
`generator output matches the committed pages` αποτυγχάνει αν αλλάξουν τα δεδομένα και η σελίδα μείνει παλιά.
