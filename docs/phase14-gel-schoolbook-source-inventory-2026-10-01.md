# Phase 14 — Verified inventory επίσημων σχολικών πηγών Γενικού Λυκείου 2026-27

> Κατάσταση: **data + audit μόνο**. Δεν αλλάζουν `api/schoolbook-source.js`, `general-education-book-sections-2026-2027.js` ή runtime συμπεριφορά.
> Αρχείο δεδομένων: `gel-schoolbook-source-map-2026-2027.js` (global `AITOOLSKIDS_GEL_SCHOOLBOOK_SOURCE_MAP_2026_2027` + `module.exports`).

## Αρχή

`curriculum-aware + official-schoolbook-grounded + verified AI`. Προτιμούμε **να μην γίνει grounding** παρά να γίνει σε λάθος κεφάλαιο.
Κάθε `exact-*` έχει (α) επίσημο έγγραφο 2026-27 που ονομάζει το βιβλίο, (β) συγκεκριμένο manifestation στο ebooks.edu.gr, (γ) για topics: επικεφαλίδα που βρέθηκε μέσα στην ίδια την επίσημη σελίδα.

## Αποτελέσματα (35 μαθήματα χωρίς `schoolbookSourceMapping` στο main a5082ff)

| Μέτρηση | Τιμή |
|---|---|
| Μαθήματα με επίσημο βιβλίο **αποδεδειγμένο + HTML ebooks** (`exact-html`) | 27 |
| Μαθήματα με επίσημο βιβλίο αποδεδειγμένο, **μόνο PDF** (`exact-pdf`, χωρίς HTML grounding) | 7 |
| Μαθήματα `needs-manual-review` (επίπεδο βιβλίου) | 0 |
| Μαθήματα `no-safe-mapping` | 1 (`english-g-lykeiou`) |
| Μαθήματα με ≥1 topic με συγκεκριμένο section/page URL | 20 |
| Μαθήματα με **όλα** τα topics αντιστοιχισμένα | 9 |
| Μαθήματα με exact βιβλίο αλλά **κανένα** topic-level URL (topics fail-closed) | 14 |
| Topics: exact-html / exact-pdf / needs-manual-review / no-safe-mapping | 188 / 11 / 443 / 5 (σύνολο 647) |

Μέσα στα 188 exact-html: 174 `confidence: high`, 14 `confidence: medium` (ίδιος αριθμός § με το βιβλίο και την ΥΑ, αλλά μόνο **ένας** κοινός όρος τίτλου). Τα 70 έχουν `labelParaphrase: true` (ο τίτλος του site διαφέρει από την επικεφαλίδα του βιβλίου· ο αριθμός § και η επικάλυψη τίτλου επαληθεύτηκαν). Προτείνεται δειγματοληπτικός έλεγχος από άνθρωπο πριν το API τα καταναλώσει.

### Ανά μάθημα
`status` = κατάσταση βιβλίου (weakest primary book). `exact/total` = topics με συγκεκριμένο URL.

| subjectId | Τάξη | status | exact/total topics | Primary βιβλίο(α) |
|---|---|---|---|---|
| `english-a-lykeiou` | Α΄ | **exact-pdf** | 7/7 | ΑΓΓΛΙΚΑ 1 (PDF) |
| `mathimatika-a-lykeiou` | Α΄ | **exact-html** | 16/16 | ΑΛΓΕΒΡΑ ΚΑΙ ΣΤΟΙΧΕΙΑ ΠΙΘΑΝΟΤΗΤΩΝ (HTML) |
| `archaia-a-lykeiou` | Α΄ | **exact-html** | 0/29 | ΑΡΧΑΙΟΙ ΕΛΛΗΝΕΣ ΙΣΤΟΡΙΟΓΡΑΦΟΙ (HTML) |
| `geometria-a-lykeiou` | Α΄ | **exact-html** | 28/29 | ΕΥΚΛΕΙΔΕΙΑ ΓΕΩΜΕΤΡΙΑ (HTML) |
| `thriskeftika-a-lykeiou` | Α΄ | **exact-pdf** | 0/8 | ΘΡΗΣΚΕΥΤΙΚΑ: ΟΡΘΟΔΟΞΗ ΠΙΣΤΗ ΚΑΙ ΛΑΤΡΕΙΑ (PDF) |
| `ekthesi-a-lykeiou` | Α΄ | **exact-html** | 0/20 | ΕΚΦΡΑΣΗ - ΕΚΘΕΣΗ (HTML) + ΚΕΙΜΕΝΑ ΝΕΟΕΛΛΗΝΙΚΗΣ ΛΟΓΟΤΕΧΝΙΑΣ (HTML) |
| `politiki-paideia-a-lykeiou` | Α΄ | **exact-pdf** | 0/14 | ΠΟΛΙΤΙΚΗ ΠΑΙΔΕΙΑ (PDF) |
| `fysiki-a-lykeiou` | Α΄ | **exact-html** | 27/27 | ΦΥΣΙΚΗ (HTML) |
| `chimeia-a-lykeiou` | Α΄ | **exact-html** | 14/14 | ΧΗΜΕΙΑ (HTML) |
| `english-b-lykeiou` | Β΄ | **exact-pdf** | 4/4 | ΑΓΓΛΙΚΑ 2 (PDF) |
| `algebra-b-lykeiou` | Β΄ | **exact-html** | 15/15 | ΑΛΓΕΒΡΑ (HTML) |
| `archaia-b-lykeiou` | Β΄ | **exact-html** | 0/16 | ΡΗΤΟΡΙΚΑ ΚΕΙΜΕΝΑ (HTML) |
| `biologia-b-lykeiou` | Β΄ | **exact-html** | 7/23 | ΒΙΟΛΟΓΙΑ (HTML) |
| `geometria-b-lykeiou` | Β΄ | **exact-html** | 21/21 | ΕΥΚΛΕΙΔΕΙΑ ΓΕΩΜΕΤΡΙΑ (HTML) |
| `thriskeftika-b-lykeiou` | Β΄ | **exact-pdf** | 0/9 | ΘΡΗΣΚΕΥΤΙΚΑ: ΧΡΙΣΤΙΑΝΙΣΜΟΣ ΚΑΙ ΘΡΗΣΚΕΥΜΑΤΑ (PDF) |
| `istoria-b-lykeiou` | Β΄ | **exact-html** | 4/32 | ΙΣΤΟΡΙΑ ΤΟΥ ΜΕΣΑΙΩΝΙΚΟΥ ΚΑΙ ΝΕΟΤΕΡΟΥ ΚΟΣΜΟΥ (HTML) |
| `latinika-b-lykeiou` | Β΄ | **exact-html** | 0/14 | ΛΑΤΙΝΙΚΑ (ΤΕΥΧΟΣ Α') (HTML) |
| `mathimatika-b-prosanatolismou` | Β΄ | **exact-html** | 13/13 | ΜΑΘΗΜΑΤΙΚΑ (HTML) |
| `ekthesi-b-lykeiou` | Β΄ | **exact-html** | 0/27 | ΕΚΦΡΑΣΗ - ΕΚΘΕΣΗ (HTML) + ΚΕΙΜΕΝΑ ΝΕΟΕΛΛΗΝΙΚΗΣ ΛΟΓΟΤΕΧΝΙΑΣ (HTML) |
| `filosofia-b-lykeiou` | Β΄ | **exact-html** | 0/13 | ΑΡΧΕΣ ΦΙΛΟΣΟΦΙΑΣ (HTML) |
| `fysiki-b-lykeiou` | Β΄ | **exact-html** | 7/32 | ΦΥΣΙΚΗ (ΘΕΤΙΚΩΝ ΣΠΟΥΔΩΝ) (HTML) |
| `chimeia-b-lykeiou` | Β΄ | **exact-html** | 16/16 | ΧΗΜΕΙΑ (HTML) + ΧΗΜΕΙΑ (HTML) |
| `english-g-lykeiou` | Γ΄ | **no-safe-mapping** | 0/5 | — |
| `archaia-g-lykeiou` | Γ΄ | **exact-html** | 0/16 | ΑΡΧΑΙΑ ΕΛΛΗΝΙΚΑ - ΦΙΛΟΣΟΦΙΚΟΣ ΛΟΓΟΣ (HTML) |
| `biologia-g-lykeiou` | Γ΄ | **exact-html** | 4/22 | ΒΙΟΛΟΓΙΑ (ΤΕΥΧΟΣ Α΄) (HTML) + ΒΙΟΛΟΓΙΑ (ΤΕΥΧΟΣ Β') (HTML) |
| `thriskeftika-g-lykeiou` | Γ΄ | **exact-pdf** | 0/9 | ΘΡΗΣΚΕΥΤΙΚΑ: ΧΡΙΣΤΙΑΝΙΣΜΟΣ ΚΑΙ ΣΥΓΧΡΟΝΟΣ ΚΟΣΜΟΣ (PDF) |
| `istoria-g-lykeiou` | Γ΄ | **exact-html** | 0/18 | ΙΣΤΟΡΙΑ ΤΟΥ ΝΕΟΤΕΡΟΥ ΚΑΙ ΤΟΥ ΣΥΓΧΡΟΝΟΥ ΚΟΣΜΟΥ (από το 1815 έως σήμερα) (HTML) |
| `istoria-g-prosanatolismou` | Γ΄ | **exact-html** | 2/30 | ΘΕΜΑΤΑ ΝΕΟΕΛΛΗΝΙΚΗΣ ΙΣΤΟΡΙΑΣ (HTML) |
| `latinika-g-lykeiou` | Γ΄ | **exact-html** | 0/19 | ΛΑΤΙΝΙΚΑ (ΤΕΥΧΟΣ Α') (HTML) + ΛΑΤΙΝΙΚΑ (ΤΕΥΧΟΣ Β') (HTML) |
| `mathimatika-g-genikis` | Γ΄ | **exact-pdf** | 0/11 | ΜΑΘΗΜΑΤΙΚΑ - ΣΤΟΙΧΕΙΑ ΠΙΘΑΝΟΤΗΤΩΝ ΚΑΙ ΣΤΑΤΙΣΤΙΚΗΣ (PDF) |
| `mathimatika-g-prosanatolismou` | Γ΄ | **exact-html** | 5/23 | ΜΑΘΗΜΑΤΙΚΑ (ΜΕΡΟΣ Β') (HTML) |
| `oikonomia-g-lykeiou` | Γ΄ | **exact-html** | 1/20 | ΑΡΧΕΣ ΟΙΚΟΝΟΜΙΚΗΣ ΘΕΩΡΙΑΣ (HTML) |
| `pliroforiki-g-lykeiou` | Γ΄ | **exact-html** | 2/24 | ΑΝΑΠΤΥΞΗ ΕΦΑΡΜΟΓΩΝ ΣΕ ΠΡΟΓΡΑΜΜΑΤΙΣΤΙΚΟ ΠΕΡΙΒΑΛΛΟΝ (HTML) |
| `fysiki-g-lykeiou` | Γ΄ | **exact-html** | 2/25 | ΦΥΣΙΚΗ (ΤΕΥΧΟΣ Β') (HTML) + ΦΥΣΙΚΗ (ΤΕΥΧΟΣ Γ') (HTML) |
| `chimeia-g-lykeiou` | Γ΄ | **exact-html** | 4/26 | ΧΗΜΕΙΑ (HTML) |

## Κανόνες αντιστοίχισης (γιατί τόσα topics μένουν για έλεγχο)

* **Βιβλίο**: μόνο όταν ονομάζεται σε επίσημο έγγραφο: Υ.Α. 102749/Δ2/29-07-2026 (minedu), Υ.Α. 90176/Δ2 – ΦΕΚ Β΄ 4210/13.07.2026 (σαρωμένο PDF· διαβάστηκε οπτικά), οδηγίες ΙΕΠ 2026-27. Κάθε παράθεμα (`kind: text`) ελέγχθηκε μηχανικά ότι υπάρχει στο έγγραφο.
* **Topic με αριθμό §** (π.χ. `2.1`, `1.1.5`, `3.2–3.4`): `exact-html` μόνο αν ο ίδιος αριθμός υπάρχει ως επικεφαλίδα στο επίσημο HTML βιβλίο **και** ο τίτλος ταυτίζεται ή έχει επικάλυψη ≥50% λέξεων. Αν ο αριθμός δεν υπάρχει → `no-safe-mapping`. Αν υπάρχει αλλά ο τίτλος διαφέρει → `needs-manual-review` (π.χ. Γεωμετρία Α΄ §4.2).
* **Topic χωρίς αριθμό**: `exact-html` μόνο με πλήρη, μοναδική ισότητα τίτλου με επικεφαλίδα. Παραφράσεις/σύνθετα topics του site (π.χ. «Θεματικός άξονας: δύναμη και δίκαιο») **δεν** αντιστοιχίζονται.
* Στόχοι αντιστοίχισης είναι μόνο **primary** βιβλία (όχι supplementary/reference, που μπορεί να είναι πολυ-τάξεων).
* Τα anchors (`#...`) κρατιούνται μόνο όταν η σελίδα έχει ≥2 διακριτά anchors ανά ενότητα· αλλιώς το URL είναι της σελίδας (`granularity: chapter-page | section-page`).
* **PDF**: `exact-pdf` topics μόνο για Αγγλικά Α΄/Β΄ (Units): η φυσική σελίδα (`#page=N`) επαληθεύτηκε με το text layer του PDF (εκτυπωμένη σελίδα + 2). Για τα υπόλοιπα PDF-only βιβλία τα topics μένουν `needs-manual-review` (`pdf-only-book-no-page-anchor`).

## Μαθήματα που χρειάζονται ανθρώπινο έλεγχο

**A. Fail-closed σε επίπεδο μαθήματος**
* `english-g-lykeiou` — κανένα επίσημο έγγραφο 2026-27 δεν ορίζει βιβλίο/ενότητες Αγγλικών Γ΄ ΓΕΛ· οι επιλογές του site (C1 γραμματική) δεν αντιστοιχούν σε κεφάλαια βιβλίου.

**B. Βιβλίο επιβεβαιωμένο, κανένα topic-level URL (14)** — τα topics του site είναι παραφράσεις/συνθέσεις χωρίς αριθμό ή μόνο PDF:
`archaia-a-lykeiou`, `ekthesi-a-lykeiou`, `archaia-b-lykeiou`, `latinika-b-lykeiou`, `ekthesi-b-lykeiou`, `filosofia-b-lykeiou`, `archaia-g-lykeiou`, `istoria-g-lykeiou`, `latinika-g-lykeiou` (HTML βιβλίο, χρειάζεται χειροκίνητη αντιστοίχιση) και `thriskeftika-a/b/g-lykeiou`, `politiki-paideia-a-lykeiou`, `mathimatika-g-genikis` (PDF-only).

**C. Μερική κάλυψη** — τα υπόλοιπα topics κάθε μαθήματος έχουν `reason` και, όπου υπάρχουν, `candidates` (**υποδείξεις**, όχι grounding): π.χ. `istoria-b`, `fysiki-b`, `biologia-b/g`, `mathimatika-g-prosanatolismou`, `oikonomia-g`, `pliroforiki-g`, `fysiki-g`, `chimeia-g`, `istoria-g-prosanatolismou`, `geometria-a` (§4.2).

## Γνωστοί περιορισμοί / ρίσκα
* Το `Γραμματική Νέας Ελληνικής Γλώσσας` (Γυμνασίου) και τα `Οικονομικά Γ΄ Γυμνασίου` που ονομάζονται στην ΥΑ/ΙΕΠ δεν είναι στον κατάλογο Λυκείου του ebooks.edu.gr και δεν αντιστοιχίστηκαν (`unresolvedReferences`).
* Το ebooks.edu.gr μπορεί να αλλάξει ids/εκδόσεις: τρέξτε `--live` πριν από κάθε χρήση σε παραγωγή.
* Η επιλογή «εμπλουτισμένη html» έναντι «μη εμπλουτισμένης» ακολουθεί τον κατάλογο ebooks (πεδίο `html.kind`).

## Reproduce
```
node scripts/phase14/build-gel-schoolbook-source-map.mjs            # ξαναχτίζει το data file (live fetch, ~1-2 λεπτά)
node tests/phase14-gel-schoolbook-source-audit.mjs                  # offline audit + 11 negative self-tests
node tests/phase14-gel-schoolbook-source-audit.mjs --live           # επανεπαληθεύει κάθε exact σελίδα/PDF στο ebooks.edu.gr
node scripts/phase14/extract-site-topics.mjs http://127.0.0.1:4173  # ανανέωση του snapshot των topics (Playwright)
```

## Επόμενο βήμα (εκτός αυτού του PR)
Σύνδεση με `/api/schoolbook-source` **μόνο** για topics με `status ∈ {exact-html, exact-pdf}`· ποτέ για `needs-manual-review` / `no-safe-mapping`. Πρώτα ανθρώπινος έλεγχος των 14 `medium` και των `labelParaphrase`.

## Φύλλο ελέγχου
`docs/phase14-gel-review-sheet-2026-10-01.csv`: τα topics που δεν είναι ενεργά ούτε μέσω manual overrides (Phases 17-20), με reason και (όπου υπάρχει) υποψήφιο κεφάλαιο. Συμπληρώστε τη στήλη decision· εγκεκριμένα θα περάσουν ως manual overrides, ποτέ αυτόματα. Ανανέωση: `node scripts/phase14/export-review-sheet.mjs`.
