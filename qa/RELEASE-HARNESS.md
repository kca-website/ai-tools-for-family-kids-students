# Release harness — 2026-11-27

Base: 5cf9b2d33b4eb30b7966f7cc4e1bf2a0d9eb7f85. No production application changes.

## Gates

- Release harness runs on pull requests to main, pushes to main and manual dispatch.
- offline: tracked root/API JavaScript syntax, current schoolbook mapping integrity, selected regression contracts, all existing QA Node tests. Provider fallback tests use synthetic credentials and mocks; no production keys are supplied.
- browser: existing full Chromium desktop and 375 px mobile Playwright suite on the local Vercel-routing emulator, with no retries. Includes new deterministic tests for all eight Creation Missions in both languages and the preschool image-to-motion UI with a mocked cutout; runs current teacher-source, navigation, PWA and curriculum parity tests. An expected failure or skip is reported as a failure of completeness, not silently counted as a pass. Existing known failures may therefore block the gate until resolved or explicitly reviewed.
- release-gate: both jobs must succeed. Artifacts retain logs and JSON.
- GitHub branch protection/rulesets must require the release-gate check before merging. Vercel deployment checks or a separate promotion workflow must be configured to prevent direct production deployment before successful checks. This PR alone cannot enforce either setting. Do not merge this PR to production until the initial results are reviewed.

## Source coverage

The strict existing schoolbook report validates mapping integrity; it is not proof that all educational goals have an official source. Keep primary fallback, GEL practice-only topics, EPAL pending units and special-education coverage limitations visible. No invented mappings.
The separate runtime inventory enumerates catalogued primary mappings, advertised secondary mappings, EPAL subject/section aliases and mapped special-education sections. It does not claim coverage of absent catalog entries, of every possible EPAL sector context, or of full audio extraction. Compare static audit and runtime inventory independently.

Manual runtime audit: select offset and limit (max 50 requests), retrieve each source via the live schoolbook endpoint, and collect the artifacts. Match manifestHash across batches and verify every index is covered before claiming full retrieval coverage. A failed or untested row is not a pass. No AI generation is requested. Runtime retrieval is not evidence that every generated explanation is correct.

## Still required

- Review first CI results, resolve failures without weakening checks, test actual preschool segmentation and motion on devices, and expand PWA cache and teacher flows wherever the current tests do not cover them.
- Inspect official mapping gaps with the relevant IEP and ebooks.edu.gr material; add only genuinely verified sources.
- Scheduled live weekly QA now enables guardrail probes (two additional synthetic model calls); review external-link warnings and issue #245. Guardrail heuristics are not a comprehensive safety evaluation.
- Separate manual pedagogical review (question correctness, completeness of audio, Greek/English accuracy), real mobile Safari and assistive-technology UAT. No claim of WCAG certification.
- Configure required status and Vercel production promotion checks with the owner. Never use a green workflow alone as evidence of all site functions passing.

The entire qa directory is already excluded from Vercel via .vercelignore.

## First baseline run

201 checks passed and five failed. Three browser-only tests were mistakenly classified as offline; they now run in the browser job. GitHub ubuntu-latest had moved to Ubuntu 26.04, unsupported by the pinned Playwright version; browser CI is now pinned to Ubuntu 24.04. Gemini fallback test expected a retired model and request field; it now verifies the current model and thinkingLevel contract, still testing both quota failures and response safety. The generated SEO landing-page drift remains a failing check pending review; do not overwrite edited pages blindly. Initial inventory: 7,172 mapped candidate rows, 459 explicit primary/EPAL gaps (including aliases), not live-verified coverage.

## Second baseline

202 offline checks passed; one SEO generator consistency check failed. The Playwright install and local server succeeded on Ubuntu 24.04. Ten published quick-answer asides were missing from the source generator; preserved them in the template. The EPAL landing page also listed all 35 specialties under every sector because getSpecialties ignores arguments. The generator and the published candidate page now filter by actual sector, with a regression check. Review any remaining generator drift separately.

## Third baseline follow-up

Four SEO pages now match generated output, including EPAL. The EPAL specialty assertion compared a VM-realm array with a host-realm array; normalize the expected array without changing the equality check. Added semantic drift output for the six remaining pages and a small source-retrieval canary (two rows per mapped level, no AI generation request) on pull requests changing the audit. The inventory also records GEL reviewed unresolved topics that are still absent from the learner manifest. These counts do not claim complete curriculum coverage.

Corrected the public curriculum landing page and its generator to describe the actual grade-specific source policy. Removed the misleading count of legacy resolver records as a complete book count, deduplicated the illustrative title list, and identified the old exercise-map numbers as a dated snapshot rather than current runtime coverage.

Reviewed the SEO_DRIFT diagnostics: the remaining subject pages lacked Digital Tutoring entries after the canonical tool/curriculum data changed. Updated only the generated tool lists and the two tool cards. The generator now retains the E΄–ST΄ primary-grade limit in Digital Tutoring availability labels. The initial production source canary passed 10/10 official source requests across five school levels; this verifies retrieval, not content correctness or audio completeness. Inventory after adding unresolved GEL dispositions: 7,172 mapped candidate rows, 480 explicit gap rows (384 EPAL, 75 primary, 21 GEL; counts include aliases and are not an exhaustive curriculum census).

Latest baseline confirms the EPAL and source-policy pages match the generator; the remaining two mismatches are availability labels on Greek-language and History tool cards. Synced both. Keep the next browser run uninterrupted to obtain a full baseline.

First complete browser baseline: 361 passed, 39 skipped, failures in legacy browser tests and the curriculum resolver smoke. The latter used the pre-September minimum of 11 Physics G topics; the current official annual mapping defines eight named themes and excludes chapters 9–11. Assert those eight names and retain the independent exact source/scope regression. Browser diagnostics are now emitted per test, and only explicit production-only security tests and the desktop exclusion of a mobile-only touch-target test are classified as out of scope; all other skipped or failed tests still block the gate. No production merge.

Downloaded full 40c76d0d baseline report: 361 passed, 47 unexpected, 39 skipped. Repair candidate contains exact tutor subject alias resolution and the correct GEL language link, six missing social-preview metadata sets and sitemap entry, narrow breadcrumb layout, local 404 routing matching Vercel, source-aware mocks, current practice-page navigation and mobile study-action disclosure. Four separate English page routes are now tested as real translated-page navigation, not same-URL switches. Special Education has no English switch or separate English page in the current repository; this remains an explicit failure, not a silently waived skip. Teacher web evidence is a server-side module imported by the API, not a browser script; its public accessibility still needs a real deployment test (added to that suite). Real-provider and full schoolbook coverage are not established by browser fixtures. No production merge.

External link follow-up (separate staging branch to avoid cancelling the running browser baseline): weekly report 2026-11-23 contained 178 IEP video TLS certificate verification errors, not evidence that videos disappeared; do not disable certificate checks. Six Wikimedia 404s were caused by a URL extraction regex truncating literal parentheses. Added a balanced-tail URL extractor and regressions. Five teacher animation links used nonexistent chapter-level URLs; replaced with verified official textbook section pages, not an expansion of annual syllabus or a new AI grounding claim. Remaining external links need individual verification.

Second full browser baseline (114cc086): 409 passed, 19 failed, 21 explicitly out-of-scope skips, all eight standalone browser probes passed. Reconciled the link-maintenance commit into the release branch. Remaining failures: wrong homepage menu IDs in test, 404 assertion evaluating undefined instead of boolean, delayed route readiness after the 12s fail-open timer, stale full-bleed width after resize, and no English special education page. Candidate fixes these; route boot now provides Home/Retry instead of exposing an unrelated page during a slow load. The English special-education page is an honest overview, not a full translation of curriculum/activities; dedicated tests follow links into all three original Greek school paths. EPAL quiz test now asserts all three mocked answers and a single API request. No claim of live model accuracy or full bilingual content.

Real preview verification e3cdbba1: HTTP 200 on both Special Education pages; three server-only modules were served as static source (provider router, teacher evidence, cache), while qa/REPORT.md was 404. Vercel serves project root for the Other framework by default. Separate security branch introduces explicit static manifest and output directory, preserves original API source and server module dependencies for bundling, excludes internal reports/scripts/tests/config. Must verify a new preview: server-only URLs return 404, API status and representative public assets remain accessible. Do not merge before that and browser gate. No credential values confirmed exposed.
