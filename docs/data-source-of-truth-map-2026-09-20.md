# Data source-of-truth map — 2026-09-20

This document records the intended ownership of runtime data before higher-education expansion.

## Canonical ownership

| Domain | Canonical source | Transitional/runtime layers | Hardening direction |
|---|---|---|---|
| Tool catalog | `data.js` (`TOOLS`) | `site-integrity-overrides.js`, `site-postfix.js`, September tool audit | Move stable metadata into `data.js`; runtime files may only apply behavior that cannot yet live canonically |
| Tool categories | `data.js` (`CATEGORIES`) | historically `site-integrity-overrides.js` | No runtime category creation |
| User paths / role recommendations | `data.js` (`PATHS`) | `site-integrity-overrides.js`, `site-postfix.js` | Fold stable entries into `PATHS`; keep only context-sensitive transforms |
| Base curriculum-to-tool mapping | `curriculum-data.js` | `site-integrity-overrides.js` and official/annual curriculum layers | Stable recommendations belong in curriculum data; official annual material stays separated |
| Official curriculum metadata | `official-curriculum-data.js` + annual/grade-specific official layers | Environment Studies extension currently in `site-integrity-overrides.js` | Move Environment Studies official metadata out of runtime override |
| Quizzes / gap tags | `quiz-data.js` | Environment Studies diagnostics currently in `site-integrity-overrides.js` | Split Environment Studies diagnostics into a dedicated canonical data module, then include it explicitly |
| Learning paths | `learning-paths-data.js` | Environment Studies learning paths currently in `site-integrity-overrides.js` | Split environment learning paths into a dedicated canonical data module |
| Accessibility metadata | `accessibility-data.js` | additions currently in `site-integrity-overrides.js` | Move static accessibility records into `accessibility-data.js` |
| Tutor behavior | `tutor.js` | `tutor-flashcards.js`, `tutor-study-tools.js`, `tutor-render-host.js`, mobile patches | Consolidate only behind tutor regression and mobile smoke tests |
| Runtime loading | `pwa.js` | compatibility loader chain | Reduce only after direct dependencies are canonical and tested |

## Changes already completed on this hardening branch

- Removed duplicate `notebooklm` declaration from `data.js`.
- Moved current Gemini Notebook metadata into canonical `data.js`.
- Removed the corresponding Gemini Notebook runtime override.
- Moved Greece-specific Gemini account-age metadata into canonical `data.js`.
- Moved `ai-help`, `phet`, `google-arts-culture`, and `gemini-education` into canonical `TOOLS`.
- Moved `learning-tool` into canonical `CATEGORIES`.
- Moved stable ChatGPT Study Mode and Copilot Study and Learn descriptions into canonical `data.js`.
- Added `tests/repository-data-integrity-smoke.mjs`.
- Removed unused/superseded artifacts `DEPLOY-INSTRUCTIONS.txt` and `tutor-extensions.css`.

## Remaining runtime blocks in site-integrity-overrides.js

1. Retired Khanmigo cleanup.
2. AI Help baseline insertion across all paths and subjects.
3. PhET / Google Arts & Culture path recommendations.
4. School-managed Google/Microsoft routes added across subjects.
5. Primary Perplexity wording correction.
6. Static accessibility records for runtime-added tools.
7. Environment Studies diagnostics, gap tags, quizzes and learning paths.
8. Environment Studies official curriculum metadata.
9. Access-policy synchronization for ChatGPT, Gemini, Copilot, Gemini Notebook, Perplexity and Erla filtering.

## Safety rule

Do not delete a runtime block until:
1. Its stable data has a single canonical owner.
2. The canonical owner is loaded before consumers need it.
3. Relevant syntax, homepage, tutor, mobile, accessibility and curriculum smoke tests pass.
4. No production merge occurs directly from the hardening branch.

## Higher-education boundary

University data must not be appended into `data.js` or school curriculum blobs. It will use a separate canonical hierarchy under a higher-education data layer with institution, faculty/school, department, course code, title, semester, ECTS, academic year, topics, official source URL, verification date, confidence and task/tool recommendations.
