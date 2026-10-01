# Phase 25 — curriculum grounding closure

This phase exists to prevent “mapped curriculum” from being confused with “AI has the exact official source text”.

## Source classes

- **exact-schoolbook**: the selected topic resolves to a verified excerpt from the official schoolbook (ebooks.edu.gr or an approved official PDF manifestation).
- **official-guidance**: the current 2026–27 IEP/Ministry guidance verifies the course, scope, chapter list or framework, but it is not itself the schoolbook text.
- **framework**: the official source defines a teaching framework rather than a closed chapter list.
- **blocked**: exact official evidence is missing or ambiguous. AI Study must fail closed unless the learner supplies the source document.

## Current evidence baseline

- Primary has exact schoolbook grounding in the verified catalog, but the existing Phase 11A contract still exposes seven source-missing sections in its supported set.
- Gymnasium has broad official-book coverage and dedicated exact-grounding tests; Phase 25 runs all A–G core grounding contracts together so gaps cannot be hidden by a single subject test.
- GEL: 563 grounded / 73 blocked / 636 total after Phase 24. Blocked topics remain blocked.
- EPAL: the 2026–27 student catalog is based on official IEP/Ministry guidance, but the current endpoint audit intentionally reports zero exact schoolbook-mapped EPAL subject IDs. Annual-guidance verification must not be relabelled as exact schoolbook grounding.
- Special Gymnasium: 52 annual mappings + 4 framework mappings are verified.
- Special Lyceum E.A.E.: exact, framework and pending mappings remain separate. Published guidance exists for additional subjects, but a published course document alone is not enough to claim section-level exact grounding.

## Official 2026–27 source hubs used for closure

- Primary: https://www.iep.edu.gr/yli-kai-odigies-didaskalias-mathimaton-protovathmias-gia-to-scholiko-etos-2026-2027/
- Gymnasium: https://www.iep.edu.gr/yli-kai-odigies-didaskalias-gymnasiou-gia-to-scholiko-etos-2026-2027/
- GEL: https://www.iep.edu.gr/yli-kai-odigies-didaskalias-genikou-lykeiou-gia-to-scholiko-etos-2026-2027/
- EPAL: https://www.iep.edu.gr/yli-kai-odigies-didaskalias-epa-l-gia-to-scholiko-etos-2026-2027/
- E.A.E.: https://www.iep.edu.gr/yli-kai-odigies-didaskalias-mathimaton-e-a-e-gia-to-scholiko-etos-2026-2027/
- E.A.E. mirror/index with individual 2026–27 files: https://dide.ira.sch.gr/ekpedevtika-themata/ekp260915/

## Release rule

A selectable curriculum topic that requires an official source may be answered by the tutor only when the exact source text is loaded, or when the learner supplies a document. Official annual guidance can define what is taught, but must not silently authorize model-memory answers about textbook content.

Phase 25 is complete only when the combined workflow stays green and every remaining non-exact area is explicitly represented as guidance/framework/blocked rather than “exact”.
