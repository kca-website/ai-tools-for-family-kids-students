# Higher Education foundation

Status: pilot foundation only. Not exposed in production navigation yet.

## Goal

Add a university-student route without changing the core aitools4kids identity:

**what you study → what course/topic you are on → what you are trying to do → which tool helps → how to use it without outsourcing the work.**

## Non-negotiable product rule

Higher Education support must not become a submit-ready assignment generator. The supported tasks are:
- concept explanation
- guided practice
- literature/source discovery and verification
- paper reading and note organization
- code debugging and explanation
- calculation checking
- feedback on the student's own draft/work
- study planning

## Canonical hierarchy

Institution → School/Faculty → Department → Course → topic/outcome → task type → recommended tools.

## Source policy

1. Official department/university source first.
2. Every department carries `coverageStatus`, `sourceConfidence`, `sources`, and `lastVerified` through the dataset meta.
3. Do not infer a complete curriculum from a timetable, search result or third-party page.
4. Missing semester/course code/ECTS stays `null`; never guess.
5. Legacy TEI names are aliases only. They must resolve to the current institution/department and never be presented as a current institution.
6. Course content/topics may only be marked verified when an official syllabus/course descriptor supports them.

## Pilot departments

- AUEB · Informatics
- NKUA · Psychology
- University of West Attica · Informatics and Computer Engineering
- Hellenic Mediterranean University · Electrical and Computer Engineering

The two engineering pilots intentionally exercise legacy TEI search aliases.

## Data/API direction

Runtime global for the pilot: `window.AITOOLSKIDS_HIGHER_EDUCATION`.

The dataset is intentionally separate from `data.js`, `curriculum-data.js`, `quiz-data.js` and school learning paths. University data must not inflate the K-12 startup payload before the student route is deliberately loaded.

## Next implementation steps

1. Add validator/smoke tests for unique institution/department/course identifiers and valid tool references.
2. Build a lazy-loaded university route, initially hidden behind a direct pilot URL.
3. Add institution/department/course search with legacy aliases.
4. Add task selector and recommendations using existing `TOOLS` IDs.
5. Add an AI Help university context adapter with anti-assignment guardrails.
6. Expand official curricula department-by-department only after the pilot passes UX tests.


## Patras Biology source-lock rule

For the University of Patras Biology pilot, a course title is not enough to authorize course-specific AI generation. Quiz, flashcards, explanation and study-plan actions are source-locked:

- when an official course outline has been mapped, generation is limited to the stored verified topics plus material supplied by the student;
- each quiz question must map directly to a verified topic;
- when no verified topic list exists, the student must provide notes, an outline or other source material before course-specific generation is allowed;
- related prerequisite knowledge must not be silently presented as registered syllabus content;
- the UI shows the academic year of the detailed outline separately from the current 2026-2027 course allocation.
