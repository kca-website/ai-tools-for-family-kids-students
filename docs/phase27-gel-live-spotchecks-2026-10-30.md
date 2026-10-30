# ΓΕΛ Phase 27 — production API spot checks, 30/10/2026

**Scope:** Official text retrieval only. These checks do not constitute verified AI-generated answers, complete audio, or per-topic annual-curriculum validation.

All requests used `GET https://www.aitools4kids.gr/api/schoolbook-source?subject=...&topic=...`.

| Class | Topic | HTTP | Grounded | Retrieved text characters | Result |
|---|---|---:|---|---:|---|
| History A GEL | Αίγυπτος: πολιτισμός | 200 | true | substantial text retrieved | Source success; official `lb1.ebooks.edu.gr` HTML |
| Mathematics A GEL | Ε2 Σύνολα | 200 | true | 9,819 | Source success; official HTML |
| English A GEL | Unit 2: A refugee’s dreamland | 200 | true | 10,840 | Source success; official PDF |
| Religion A GEL | 1.1 Ο άνθρωπος ζει με τον Θεό | 200 | true | 16,173 | Source success; official PDF section |
| Modern Greek A GEL | Επικοινωνιακή περίσταση και ύφος | 200 | true | 10,079 | Source success; manual HTML |
| Modern Greek B GEL | Δείκτες συνοχής και λογικές σχέσεις | 200 | true | 13,588 | Source success; manual HTML |
| English G GEL | Αντεστραμμένη σύνταξη | 404 | false | 0 | Correctly fail-closed: `section_not_resolved` |

**Counts for this targeted source-extraction sample:** 6/6 mapped cases returned authentic, nonempty schoolbook content; 1/1 intentionally unmapped case rejected. **No evidence that the whole catalog passes.** Annual guidance verification was not independently repeated for all these selections.

Observed host variant: `lb1.ebooks.edu.gr` is an official subdomain and must pass the provenance guard. Unrelated hosts are not allowed. The Phase 27 contract includes two explicit tests for this boundary.

The existing Phase 25 GitHub Action progressed through the GEL audit and passed it, but still failed in the EPAL browser smoke: it expected the missing-mapping explanation and received a generic temporary-source-load error. This is an **open regression/test inconsistency**, not a pass. Do not merge to main until the underlying EPAL behavior is reconciled and broader tests pass.
