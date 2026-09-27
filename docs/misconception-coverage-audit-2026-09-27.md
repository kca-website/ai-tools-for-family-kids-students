# Misconception Coverage Audit — 2026-09-27

## Headline

Across the current curriculum layer there are **55 verified section-level gaps** and, after the targeted batch in this branch, **28 research-backed misconception records**.

The raw ratio is therefore not the right product metric. Several verified gaps are factual recall or writing/grammar skills rather than conceptual misconceptions.

## Conceptual STEM coverage after this batch

| Source quiz | Verified conceptual gaps | Research-backed | Coverage |
| --- | ---: | ---: | ---: |
| Ε΄ Δημοτικού Μαθηματικά | 2 | 2 | 100% |
| Α΄ Γυμνασίου Μαθηματικά | 4 | 3 | 75% |
| Α΄ Λυκείου Μαθηματικά | 4 | 2 | 50% |
| Α΄ Λυκείου Φυσική | 5 | 5 | 100% |
| Β΄ Λυκείου Φυσική | 5 | 5 | 100% |
| Α΄ Γυμνασίου Βιολογία | 5 | 3 | 60% |
| Β΄ Λυκείου Βιολογία | 5 | 5 | 100% |
| Γ΄ Λυκείου Βιολογία | 4 | 3 | 75% |

## Intentionally not counted as misconception-coverage failures

### History
Current verified gaps are primarily dates, actors, sides, sequence or factual interpretation. They remain useful diagnostic gaps, but they are not automatically “misconceptions”.

### Greek language / Essay
Most current gaps are writing skills (topic sentence, paragraph development, evidence use, essay balance, summary length) or grammar distinctions. These need their own evidence model if we later want a writing-feedback layer; they should not be forced into the misconception layer.

## Highest-priority conceptual gaps still without evidence

- `math-a-gym.gcd-lcm-confusion`
- `functions.quadratic-always-two-roots`
- `functions.sqrt-drops-absolute-value`
- `biologia-a-gym.plant-animal-cell`
- `biologia-a-gym.unicellular-nutrition`
- `biologia-g-lyk.heterozygous-genotype`

These remain disabled for misconception-aware teacher assessment until a sufficiently exact research source is found.

## Added in this targeted batch

- `biologia-a-gym.adaptation-misconception`
- `physics-b-lyk.circular-motion-tangent-velocity`
- `physics-b-lyk.momentum-definition`
- `physics-lyk.force-energy-same`

This raises the weakest conceptual STEM subject coverage without inflating the evidence layer with unrelated skill or recall items.
