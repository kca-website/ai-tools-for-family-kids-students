# Curriculum Provenance Policy

Last updated: 2026-09-21

AITOOLS4KIDS is evidence-first. A curriculum option must never look more certain than its source allows.

## Non-negotiable rule

No chapter/topic list may be exposed as current curriculum unless the runtime record carries:
- school year,
- coverage/status classification,
- human-readable coverage label,
- verification date,
- official/source URL,
- source label,
- scope/boundary note.

If any of these are missing, the UI must fall back to a generic “use your exact chapter/exercise” route rather than invent or imply curriculum coverage.

## Allowed evidence states

1. **Exact / verified annual mapping**
   - Section-level evidence exists.
   - Exact official sections may appear in the selector.

2. **Published annual guidance — detailed navigation map**
   - The current official guidance exists and has been reviewed enough to build a faithful study/navigation map.
   - Topics may appear, but the UI must explicitly say that they are a mapped navigation aid and not necessarily verbatim official section titles.

3. **Partial mapping**
   - Only the verified subset may be exposed.
   - The boundary must be stated.

4. **Official structure / support bridge**
   - The school type/subject is verified, but detailed current-year sections are not mapped.
   - Do not expose borrowed sections as if they were the official syllabus of that school type.
   - Ask for the learner's real chapter/text/exercise.

5. **Source indexed, section mapping pending**
   - A subject-specific official 2026–27 guidance is known to exist, but section-level extraction is unfinished.
   - Show the source and the pending status; do not manufacture sections.

## Current enforcement

- General Gymnasium / GEL AI Help: topic visibility is gated by provenance metadata.
- Special Gymnasium / Special Lyceum / EN.E.E.GY.-L.: separate status vocabulary distinguishes exact mapping, framework, partial mapping, structure-only and support references.
- CI smoke tests fail when required provenance metadata or user-visible source links disappear.
- Special Lyceum guidance index entries carry an official IEP source, verification date and provenance type even before section-level mapping is completed.

## Product principle

The source is part of the feature, not a footnote. Where evidence is incomplete, the site must say so.
