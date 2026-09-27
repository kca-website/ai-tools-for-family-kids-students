# Misconception Evidence Gap Audit — 2026-09-27

## Scope

This audit compares three existing layers:

1. `GAP_TAGS` in `quiz-data.js`
2. verified section mappings in `official-curriculum-data.js`
3. research evidence in `misconception-evidence-data.js`

A gap is eligible for misconception-aware teacher assessment only when all three layers are present.

## Result

The initial evidence layer contained **7** records.

This batch adds **11** records, bringing the research-evidence layer to **18** records.

The audit also found that several entries that initially appeared to lack section labels already contained `officialSectionEl` and/or `topicAnchorEl`. The data itself was not missing; the relevant Teacher Assistant fallback had previously been too strict about `annualScopeVerified`. That resolver issue was corrected in the preceding production batch. Two older Grade 5 Mathematics evidence records were genuinely only course-level anchors; they are now upgraded using exact official textbook sections: Chapter 17 for fraction comparison and Chapter 26 for decimal ordering/place value.

## Current priority areas still not evidence-backed

Verified curriculum gaps remain without research evidence, including examples in:

- additional A΄ Γυμνασίου Mathematics (GCD/LCM, proportions),
- A΄ Γυμνασίου Biology (cell structures, unicellular nutrition),
- A΄/Β΄/Γ΄ Lyceum Mathematics (quadratic roots, square-root/absolute-value interactions),
- additional Physics (force vs energy, thermodynamics),
- Biology (specific/non-specific immunity, producers, DNA/genotype),
- Greek language/writing and History.

These must **not** be auto-enabled merely because they have a verified curriculum mapping. Each needs its own source review.

## Deliberate exclusions

Factual recall gaps such as dates, historical sides, or simple terminology were not automatically treated as “misconceptions”. A verified curriculum gap is not automatically a research-backed misconception.

Likewise, sources that only state the correct scientific/mathematical rule were excluded. The evidence layer requires evidence of learner misunderstanding or a research synthesis of such misunderstandings.

## Integrity requirement

`tests/misconception-evidence-integrity.mjs` enforces that every evidence id:

- exists in `quiz-data.js`,
- exists in `official-curriculum-data.js`,
- is mapped as `exact-section-verified` or `related-section-verified`,
- has a stable HTTPS evidence URL,
- includes source title, population context and a bounded statement of what the source supports.
