# Misconception Evidence Layer

Last updated: 2026-09-27

The Teacher Material Lab must never ask an LLM to invent a “common misconception”.

A misconception may be offered only when both conditions hold:
1. the existing gapTag is linked to the selected curriculum context through the site's verified curriculum layer;
2. the gapTag has a record in `misconception-evidence-data.js` pointing to identifiable research.

The evidence means that a misconception pattern has been reported in research. It does not prove that an individual learner holds it.

First batch:
- decimals.longer_is_larger — Roche (2005), ERIC EJ794018.
- fractions.whole_number_bias — Stafylidou & Vosniadou (2004), ERIC EJ731639; Greek students aged 10–16.
- physics-lyk.motion-implies-force — Brown (1988), ERIC ED299171.
- physics-lyk.newton-third-law-bigger-force — Brown (1988), ERIC ED299171.
- biologia-a-gym.plant-vs-animal-digestion — Marmaroti & Galanopoulou (2006), ERIC EJ722201; 290 Greek pupils aged 13.

Never say “the student has misconception X”. Use tentative wording such as “this choice may indicate that the concept needs an additional check”.

New evidence records require a stable research URL, population/age context, an exact statement of what the source supports, an existing gapTag and separate curriculum verification.


### Annual-scope flag

`annualScopeVerified` is an additional confidence marker where the site has an explicit annual/examinable-scope mapping (for example, some Lyceum subjects). It is **not** a universal prerequisite for misconception evidence.

For school levels or subjects where the site stores verified official section mapping without an annual-scope flag, `exact-section-verified` or `related-section-verified` is sufficient, provided the subject/quiz id also matches and a research evidence record exists.


## Evidence expansion — 2026-09-27

A second research-backed batch extends coverage beyond the original seven records. New evidence records were added only where:

- the gap already exists in `GAP_TAGS`,
- the curriculum layer already marks the gap as `exact-section-verified` or `related-section-verified`,
- the cited source supports the misconception pattern itself rather than merely explaining the correct concept.

Added in this batch:
- `math-a-gym.rational-number-order`
- `math-a-gym.absolute-value`
- `functions.one-formula-only`
- `functions.inequality-no-sign-flip`
- `physics-lyk.constant-velocity-needs-force`
- `physics-lyk.energy-used-up`
- `physics-b-lyk.momentum-conservation`
- `biologia-b-lyk.vaccine-immune-memory`
- `biologia-b-lyk.energy-trophic-levels`
- `biologia-g-lyk.transcription-translation`
- `biologia-g-lyk.mutation-definition`

Research population is always shown in the evidence card because a misconception observed in one population must not be presented as a prevalence claim for Greek students.
