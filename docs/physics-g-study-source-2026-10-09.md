# Physics G Gymnasium study source — 2026-10-09

The normal study resolver capped text at 42,000 characters, while audio used a
separate parser and paid optical transcription. Physics G now uses the same
complete, body-only extraction in both modes for its eight annual study units.
The other subjects retain their existing extraction paths.

## Source and taught scope

- Official book: https://ebooks.edu.gr/ebooks/v/html/8547/2226/Fysiki_G-Gymnasiou_html-empl/
- Official guidance: https://www.iep.edu.gr/yli-kai-odigies-didaskalias-gymnasiou-gia-to-scholiko-etos-2026-2027/
- Guidance attachment inspected: `ΦΥΣΙΚΗ_ΑΒΓ_ΓΥΜΝ_2026-2027.zip`, PDF pp. 26–36.
- The general book-section catalog now lists the eight taught units, instead of
  all eleven book chapters. Diagnostic prerequisite routes remain unchanged.
- Coulomb is qualitative; its mathematical relation is excluded from the study
  source and quantitative exercises using that relation are forbidden server-side.
- Section 2.5 is limited to resistor connections; the lamp-connection material is
  removed. Ohm and resistor series/parallel formulas remain.
- Section 4.3 is removed. Section 5.3 retains the wave relation and its verbal
  statement without the derivation. Existing exclusions in chapters 1, 3, 6–8
  continue to apply.

## Image formulas and source defects

`physics-g-verified-formulas.json` contains manually read transcriptions of actual
publisher images. Each entry includes SHA-256 of the inspected image bytes.
A changed image fails closed. Unmapped short formula images retained in the
selected source also fail closed. Publisher-supplied accessible diagram labels
are retained; no AI-generated illustration descriptions are used.

The HTML numerical example 5.2 has inconsistent speeds (1.533 vs 1.530 m/s) and
an incorrect printed wavelength (0.0612 m for 1,530 / 250,000). It is omitted,
without silently changing the publisher's numbers. Surrounding sound theory
remains available; the API includes a source note explaining the omission.

The Physics G source cache has a dedicated new key, shared by tutor and summary,
so legacy truncated sources cannot be reused. No provider order was changed.

## Validation

- All eight actual official units resolved locally with publisher HTML and
  verified image bytes; normal and audio text are identical for every unit.
- Long electric-force source is over 42,000 characters and is returned intact.
- Regression test covers end-of-source preservation, image hash mismatch,
  complete source metadata, annual exclusions, and the eight-unit catalog.
- Existing science grounding, formula grounding, AI source policy, explanation,
  whole-section audio and knowledge-map tests pass.
- Secondary HTML source smoke passes for Physics G and five other subjects.

Reproduction: `node tests/physics-g-complete-source.cjs`
