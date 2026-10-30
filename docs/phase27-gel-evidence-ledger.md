# Phase 27: ΓΕΛ evidence ledger (2026-10-30)

Baseline main: `296f7aad531f7ababd183facae737be2e40261d2`.

Official annual reference: https://www.iep.edu.gr/yli-kai-odigies-didaskalias-genikou-lykeiou-gia-to-scholiko-etos-2026-2027/ .
Official source content: https://ebooks.edu.gr/ .

## Important distinction

The Phase 14 generated GEL inventory holds 672 topics across 35 subjects. Runtime-eligible official-book source mappings and curated examples: **634**. Unverified and fail-closed: **38**. The 314 overrides file includes eight manual matches dated 2026-10-30, two of them verified Ancient Greek A grammar skills (Chapter 23 of the official school grammar). Other GEL course catalogs and visible derived topics are not implicitly covered by these 672.

Unverified topics by subject: Archaia A 5, Ekthesi A 3, Archaia B 8, Ekthesi B 9, English G 5, Archaia G 6, Economics G 2. Never promote generic skills, absent textbook units or out-of-scope Economics chapters solely by similarity.

`scripts/phase27-gel-uat.mjs` creates one evidence row per topic and five independent gates: year-specific curriculum, official source mapping, retrieval of authentic text, grounded AI Study answer, and full verified audio. A static mapping is **not** a successful 5-gate UAT. This phase does not recheck IEP scope for every topic, so all curriculum gate entries remain **unverified**.

## Commands

```bash
node tests/phase27-gel-uat-contract.test.mjs
node tests/phase18-gel-grounding-coverage-smoke.mjs
node scripts/phase27-gel-uat.mjs --output=qa/results/phase27-gel-uat-inventory.json

# Live text source sampling (not part of automatic CI, no provider charges):
node scripts/phase27-gel-uat.mjs --live --limit=3 --output=qa/results/gel-live-sample.json

# Explicitly requested provider-backed checks; can incur API costs:
node scripts/phase27-gel-uat.mjs --live --study --audio --subject=istoria-b-lykeiou --limit=3 --output=qa/results/gel-uat-sample.json
```

Full verification uses `--limit=all` after checking provider costs and the current annual topic register. The report records passed, failed, and unverified separately and never converts a missing live check into a success. Do not merge or release merely because the static mapping contract is green.
\n## Annual-scope visibility fix (Phase 27)\n\n`gel-english-official-pdf-units-2026-2027.js` identifies 4 English G textbook units, but explicitly marks `annual:false` because the 2026–27 taught scope is not independently verified. `study.html` previously exempted `english-g-lykeiou` from the verified-topic visibility filter. This exemption was removed; the records remain intact, and no unverified unit is promoted.\n
## Phase 31 incremental validation, 2026-10-30

The two newly mapped Archaia A skill topics, «Παθητικός μέλλοντας και αόριστος» and «Μέλλοντας ρημάτων σε -ίζω», use the official Ancient Greek Grammar, chapter 23 and §295 respectively: https://ebooks.edu.gr/ebooks/v/html/8547/2340/Grammatiki-Archaias-Ellinikis_Gymnasiou-Lykeiou_html-apli/index_02_19.html .

They are official textbook-reference matches, not independent evidence that these precise skill labels are 2026–27 IEP chapter titles. `annualScopeVerified` remains false. The remaining 41 may include intentionally generic skills or out-of-scope labels; never reduce the count by borrowing an unrelated grade's book, promoting an unverified topic, or relabeling a missing unit. Full five-gate UAT remains open.

## Phase 33: curated official B GEL language skills (30/10/2026)

Three previously unmapped broad language skills now point to authentic same-grade B GEL schoolbook pages from [Έκφραση–Έκθεση Β΄](https://ebooks.edu.gr/ebooks/v/html/8547/2676/Ekfrasi-Ekthesi_B-Lykeiou_html-empl/): «Κειμενικά είδη» (examples from journalism, biography, book review), «Συγκεκριμένα τεκμήρια» (documented literary criticism), «Τροπικότητα και στάση συντάκτη» (journalist's viewpoint and subjective comment). This is **curated textbook example coverage**, not full or exhaustive theory of these broad skills, and `annualScopeVerified` remains false pending independent topic-level annual guidance audit. The AI Study response reports `sourceCoverage: curated-examples` explicitly. New static count: 634/672 source-reachable; 38 need exact-source evidence. Independent five-gate annual/AI/audio UAT still has not been established for the entire corpus.


## Phase 34: two additional source-grounded language skills (30/10/2026)

Starting from main `cc778e343885819a3d8e08790985dd10c323ea48`, two more *curated official-book evidence* paths were added for previously blocked skills:

1. `ekthesi-a-lykeiou / Ισχυρισμός και τεκμηρίωση`: the same-grade official A GEL `Έκφραση–Έκθεση`, VII. `Οργάνωση του λόγου`, directly teaches position, reasoning, evidence, and supporting arguments:
   https://ebooks.edu.gr/ebooks/v/html/8547/2674/Ekfrasi-Ekthesi_A-Lykeiou_html-empl/indexa_7.html

2. `ekthesi-b-lykeiou / Δομή κειμένου`: two authentic official B GEL `Έκφραση–Έκθεση` chapters on news article structure and paragraph structure:
   https://ebooks.edu.gr/ebooks/v/html/8547/2676/Ekfrasi-Ekthesi_B-Lykeiou_html-empl/indexd_01.htm
   https://ebooks.edu.gr/ebooks/v/html/8547/2676/Ekfrasi-Ekthesi_B-Lykeiou_html-empl/indexf_11.htm

These exact pages belong to verified grade-specific textbook manifestations. `sourceCoverage: curated-examples`, `annualScopeVerified: false`; this is **not** a declaration that every possible exercise under the broad skill is covered, nor a completed independent curriculum audit. The new contract test checks both study-source and audio-purpose *source retrieval* (official-page content), not provider-backed spoken lesson generation. Do not treat a passing contract as full five-gate UAT. Remaining 36 topics stay explicitly fail-closed, including G GEL English and Economics pending distinct annual scope/program verification.

Static source mapping coverage after Phase 34: **636/672**; source evidence still pending: **36/672**. Production release remains blocked until the requested full curriculum, source retrieval, AI Study, and full Listen UAT is successfully completed.

## Phase 35: 11 curated official-schoolbook practice references (30/10/2026)

The Phase 34 draft PR #256 source mapping inventory increases from 636/672 to **647/672**, with **25/672** entries still explicitly fail-closed. This does NOT establish full five-gate UAT.

* 5 Ancient A skill labels: grammar/handbook excerpts for impersonal infinitive, participle forms and uses, comparative second term, adverbial and nominal predicatives, and conjunction categories.
* 4 Ancient B skill labels: verified chapters from the officially catalogued **reference** Grammar (etymology, morphological categories, moods/tenses, nominal verb forms). Manual source resolution now accepts same-subject officially catalogued reference/supplementary books ONLY for explicitly reviewed source entries.
* 2 Greek Language B skill labels: same-grade schoolbook practice on examples supporting an argument and argumentative paragraph structure.

Every new mapping retains `annualScopeVerified:false` and `sourceCoverage:curated-examples`, with explicit reviewer limitations. Official source matching alone does not certify complete coverage of the broad skill. The Phase 35 test checks study and audio-purpose official text retrieval, not provider-generated explanation or spoken audio.

Remaining (25): Ancient B 4, Ancient G 6, Greek A 2, Greek B 6, English G 5, Economics G 2. No unseen passage is falsely treated as an immutable schoolbook passage. English G lacks an independently verified same-grade book in this catalog; Economics G two topics lack proof of annual examinable scope. No automatic 100% promotion.
