# Teacher Material Lab — Product Guardrails

Last updated: 2026-09-27

The Teacher Material Lab is an extension of the existing Teacher Assistant. It improves material that a teacher is preparing; it must not become a student-grading system, an LMS, or a source of invented curriculum certainty.

## Product role

**Create → edit → adapt → check → derive classroom material.**

The teacher remains responsible for the final educational decision. The Lab may help inspect or transform material, but it does not certify that material as “approved”.

## Six non-negotiable guardrails

### 1. Check the material, never grade the student
Allowed:
- Check whether teacher-created material is clear, age-appropriate, accessible and learning-first.
- Suggest improvements to instructions or cognitive demand.

Not allowed:
- Score a student's essay, answer or performance.
- Store student grades or produce a longitudinal student score.

Litmus test:
- “Check this worksheet before I use it in class.” → **Yes**.
- “Grade Maria's answer and give her 14/20.” → **No**.

### 2. Curriculum provenance is deterministic, not an LLM opinion
The curriculum check must use the vocabulary and evidence states in `docs/curriculum-provenance-policy.md`:

1. Exact / verified annual mapping
2. Published annual guidance — detailed navigation map
3. Partial mapping
4. Official structure / support bridge
5. Source indexed, section mapping pending

The AI model must not upgrade a source from one state to another. Where evidence is missing, the UI must say so.

### 3. AI estimates must be visibly separated from verified data
Verified/site-derived checks and AI pedagogical estimates must never be presented as equivalent.

AI-estimated fields may include:
- language difficulty,
- cognitive load,
- clarity of instructions,
- presentation/accessibility suggestions,
- learning-first behaviour.

They must carry a visible label equivalent to:
**“AI estimate — teacher judgement required.”**

No overall “Approved”, “Correct” or “Safe” badge is permitted.

### 4. Misconceptions must come from documented gap data
Misconception-aware distractors may use only existing documented `gapTag` / `GAP_TAGS` records that are linked to the selected curriculum context through verified alignment data.

Not allowed:
- asking the model to invent a “common misconception”,
- diagnosing a learner from one wrong answer,
- presenting a distractor choice as proof of a learning difficulty.

Teacher wording should remain tentative:
**“This choice may indicate that the concept needs an additional check.”**

### 5. “My materials” stays local and student-free
The material library is local-only by default.

It may store:
- material text,
- material type,
- grade,
- subject,
- unit,
- objective,
- curriculum provenance,
- creation/update date.

It must not store:
- student names,
- contact details,
- diagnoses or health data,
- grades,
- AI Help conversations,
- persistent student progress.

JSON export/import may move the teacher's own materials between devices, but does not create a server-side teacher or student profile.

### 6. Transformations inherit the original evidence boundary
“Make simpler”, “make harder”, “create exit ticket”, “create flashcards” and similar actions must retain the original material's grade, subject, unit and provenance boundary.

A transformation must not silently:
- add a new official chapter,
- turn a support bridge into verified annual mapping,
- introduce unsupported curriculum terminology,
- infer student characteristics.

## Relationship to Navigator-not-Tutor

This feature is valid only while it supports the teacher in preparing and checking material. It must not redefine aitools4kids as a subject teacher, automated grader or classroom monitoring platform.

Relevant parent policy: `docs/navigator-not-tutor-guardrails.md`.
Relevant evidence policy: `docs/curriculum-provenance-policy.md`.
