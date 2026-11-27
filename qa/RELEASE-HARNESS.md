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
