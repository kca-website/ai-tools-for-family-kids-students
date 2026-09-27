# Misconception Evidence Project — Closure Record

Date: 2026-09-27

## Final status

The conceptual-STEM misconception evidence project is complete for the current verified dataset.

- **34 verified conceptual STEM gaps**
- **34 research-backed evidence records**
- **34/34 integrity match**
- **100% coverage across all 8 conceptual STEM source quizzes**

## Coverage by source quiz

| Source quiz | Verified | Research-backed | Coverage |
| --- | ---: | ---: | ---: |
| Math Ε΄ Δημοτικού | 2 | 2 | 100% |
| Math Α΄ Γυμνασίου | 4 | 4 | 100% |
| Math Α΄ Λυκείου | 4 | 4 | 100% |
| Physics Α΄ Λυκείου | 5 | 5 | 100% |
| Physics Β΄ Λυκείου | 5 | 5 | 100% |
| Biology Α΄ Γυμνασίου | 5 | 5 | 100% |
| Biology Β΄ Λυκείου | 5 | 5 | 100% |
| Biology Γ΄ Λυκείου | 4 | 4 | 100% |

## Final six gaps closed

1. GCD vs LCM confusion
2. Quadratic equations assumed to always have two real roots
3. Dropping the absolute value in √(x²)
4. Plant vs animal cell structures/organelles
5. Single-celled organisms and nutrition/organization
6. Homozygous vs heterozygous genotype

## What is deliberately outside this metric

The site still contains useful diagnostic gaps in History, Greek language, Essay/Writing and other skill/recall areas. Those are **not missing misconception evidence** by default.

They are excluded because a factual recall gap, a writing skill or a grammar/procedural error is not automatically a conceptual misconception.

## Permanent guardrails

This closure does not change the product rules:

- no student diagnosis,
- no student grading from misconception selections,
- no persistent student profile or progress history,
- no LLM-invented “common misconceptions”,
- no research evidence without a verified curriculum link,
- population context must remain visible,
- a source supports a misconception pattern, not a claim about an individual student.

## Regression gates

The repository now enforces closure through:

- `tests/misconception-evidence-integrity.mjs` — exactly 34 valid research-backed evidence records;
- `tests/misconception-coverage-report.mjs` — all eight conceptual STEM source quizzes must remain at 100%, with 34/34 verified gaps evidenced.

If a new verified conceptual STEM gap is added in the future, the coverage test should fail until the gap is either given suitable evidence or explicitly reclassified outside the misconception metric.
