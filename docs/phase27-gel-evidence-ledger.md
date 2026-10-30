# Phase 27: ΓΕΛ evidence ledger (2026-10-30)

Baseline main: `296f7aad531f7ababd183facae737be2e40261d2`.

Official annual reference: https://www.iep.edu.gr/yli-kai-odigies-didaskalias-genikou-lykeiou-gia-to-scholiko-etos-2026-2027/ .
Official source content: https://ebooks.edu.gr/ .

## Important distinction

The Phase 14 generated GEL inventory holds 672 topics across 35 subjects. Runtime-eligible exact mappings: **629**. Unverified and fail-closed: **43**. The 309 overrides file includes three new matches dated 2026-10-30. Other GEL course catalogs and visible derived topics are not implicitly covered by these 672.

Unverified topics by subject: Archaia A 7, Ekthesi A 3, Archaia B 8, Ekthesi B 12, English G 5, Archaia G 6, Economics G 2. Never promote generic skills, absent textbook units or out-of-scope Economics chapters solely by similarity.

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