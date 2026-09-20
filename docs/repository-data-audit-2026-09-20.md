# Repository & Data Audit — 2026-09-20

## Scope
Production source:
- Vercel project: `aitools4kids`
- GitHub repository: `kca-website/ai-tools-for-family-kids-students`
- Production branch: `main`
- Production commit audited: `7209d3e380a40c0f3b6728066f0e31b244a96049`

This branch is audit/hardening only. No production behavior should be changed until dependencies are mapped and smoke tests pass.

## Current repository size
- 216 files
- 82 JavaScript files
- 66 HTML files
- 28 MJS test files
- 11 Markdown files
- 7 CSS files
- 6 XML files

Largest data/runtime files:
1. `quiz-data.js` — 595,972 bytes
2. `learning-paths-data.js` — 589,735 bytes
3. `official-curriculum-data.js` — 378,742 bytes
4. `gel-2026-2027-update.js` — 269,188 bytes
5. `epal-official-guidance-topics-2026-2027.js` — 210,429 bytes
6. `app.js` — 111,904 bytes
7. `data.js` — 94,789 bytes
8. `tutor.js` — 90,934 bytes

## Important finding: apparent "patch" files are still live dependencies
Do not delete files merely because their names contain `fix`, `patch`, `postfix`, `bridge`, `guard` or a date.

### Loaded directly by the homepage
`index.html` currently loads:
- `data.js`
- `curriculum-data.js`
- `quiz-data.js`
- `learning-paths-data.js`
- `curriculum-2026-2027-expansion.js`
- `official-curriculum-data.js`
- `official-annual-instructions-2026-2027.js`
- `gel-2026-2027-update.js`
- EPAL curriculum/topic layers
- `guide-data.js`
- `accessibility-data.js`
- `site-integrity-overrides.js`
- `tutor.js`
- `app.js`
- `site-postfix.js`
- `pwa.js`

### Dynamically loaded by `pwa.js`
The current runtime still loads a compatibility chain including:
- `september-2026-tool-audit.js`
- `september-2026-primary-tutor.js`
- `september-2026-primary-quiz.js`
- `primary-simple-quiz.js`
- `september-2026-language-diagnostics.js`
- `september-2026-language-tutor.js`
- `epal-practice-map.js`
- `special-education-diagnostic.js`
- `special-education-entry-analytics.js`
- `tutor-flashcards.js`
- `tutor-study-tools.js`
- `tutor-render-host.js`
- `tutor-mobile-compact.js`
- `tutor-mobile-label-fix.js`
- `report-link.js`

Therefore these are not deletion candidates yet.

## Main architecture debt found

### 1. Too many curriculum layers
School curriculum currently spans multiple global data files and corrective layers:
- canonical-ish datasets
- yearly update files
- GEL patches
- EPAL patches
- Special Education datasets
- teacher-only extension layers
- runtime bridge/guard/fix files

This makes it difficult to know which file is authoritative for a given subject/topic.

### 2. Quiz and learning-path files are too large and coupled
`quiz-data.js` and `learning-paths-data.js` together are ~1.19 MB and are loaded as broad global datasets. Before Higher Education is added, they need zone/domain splitting or generation from canonical source data.

### 3. Tutor still has transitional extension architecture
Historical consolidation notes confirm that:
- `tutor-render-host.js` remains transitional
- flashcards/study/mobile logic is still split across several runtime files
- `pwa.js` is acting partly as an application patch loader

This should be consolidated before adding a university/student feature layer.

### 4. Site corrections live outside canonical data
`site-postfix.js` changes tool metadata, path recommendations, AI Help insertion and removes stale tool entries at runtime.
That means the effective production truth is not fully represented by `data.js` / `curriculum-data.js`.

Goal: move stable corrections back into canonical source data, then shrink `site-postfix.js`.

### 5. Teacher curriculum has too many overlays
`teacher-assistant.html` loads a long chain of teacher-specific curriculum files including:
- base curriculum
- Special Education extensions
- EPAL extensions
- ENEEGYL extensions
- note fixes
- runtime guards
- official-topic bridge

These are active dependencies and must be merged carefully into fewer canonical datasets before deletion.

## Safe candidates for later cleanup
The following are candidates for review, not automatic deletion:
- old deployment instruction documents whose instructions are superseded by current Git/Vercel workflow
- historical audit documents after their still-relevant constraints are migrated into current documentation
- generated/duplicated static tool-page content if it can be produced from one canonical tool dataset
- compatibility files only after their logic has been folded into canonical modules and regression tests pass

## Files that must NOT be deleted now
- `site-postfix.js`
- `site-integrity-overrides.js`
- `pwa.js`
- `tutor-mobile-label-fix.js`
- `tutor-render-host.js`
- teacher curriculum fix/bridge/guard files
- September 2026 runtime patches
- current smoke tests

They are still referenced by the live application.

## Higher Education prerequisite
Do not place university data into `data.js`.

Before importing AEI course data, introduce a separate canonical higher-education layer with fields such as:
- institution
- school/faculty
- department
- course code
- course title
- semester
- compulsory/elective
- ECTS
- academic year
- learning outcomes
- topic list
- official source URL
- last verified date
- confidence/status
- recommended AI tasks/tools

Former TEI names should be handled as legacy aliases for discoverability where relevant, while current institutions/departments remain canonical.

## Cleanup sequence
1. Build a complete dependency map.
2. Identify canonical source of truth per data domain.
3. Move stable runtime patches into canonical source files.
4. Consolidate tutor extension lifecycle.
5. Consolidate teacher curriculum overlays.
6. Split heavy school data by zone/domain.
7. Run all smoke tests.
8. Only then delete files proven orphaned.
9. Re-run tests and validate one Vercel preview.
10. Merge to `main` only after parity checks.

## Non-negotiable product guardrail
Cleanup must preserve the identity of AITOOLS4KIDS:
AI supports understanding, practice, checking and research; it must not become a ready-answer or assignment-generation service.
