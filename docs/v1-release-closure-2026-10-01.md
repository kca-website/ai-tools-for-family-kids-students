# v1 release closure — 1 October 2026

This note freezes the evidence state used for the v1 completion pass. It does not promote a model or turn blocked curriculum topics into verified mappings.

## Production baseline

- Main baseline: `0a46f79483cf842bb1a86984d5951eaeb6e02d13` (Phase 24 merged).
- Vercel production deployment for that commit is READY.
- Phase 24 grounds all 12 taught Politiki Paideia A topic groups to verified official PDF ranges.
- Current GEL coverage smoke: 563 grounded / 73 blocked / 636 total.
- The 73 blocked GEL topics stay fail-closed. Of these, five have candidate hints, 63 have no safe candidate, and five are explicitly no-safe-mapping.
- Candidate hints are not evidence. The five candidate-backed topics remain blocked until exact official-section evidence exists.

## Phase 1 model screening closure

The bounded continuation run `36857416173` completed successfully and produced artifact `ai-benchmark-phase-1-36857416173`.

Latest-case report:

- GPT-OSS 120B: 32/32 eventually valid across explain, flashcards, plan and quiz. Plan is 7/8 first-try valid.
- Qwen3-30B: 0/32 final-valid current-profile cases.
- GLM-4.7 Flash: explain 6/8, flashcards 2/8, plan 0/8, quiz 7/8 final-valid.
- Gemma 4 26B: explain 5/8, flashcards 3/8, plan 0/8, quiz 4/8 final-valid.
- DeepSeek R1 Distill Qwen 32B: 0/8 final-valid in its Mathematics-only Phase 1 cases; all eight ended as errors in the bounded run.

These are format/runtime screening results, not educational-quality scores.

### Routing decision

No cheaper candidate qualifies for promotion from Phase 1. Production routing therefore stays unchanged on GPT-OSS 120B with the existing fallback policy.

Phase 2 is not used to promote any alternate model from this screening because no alternate passed the Phase 1 gate. Human/blind review remains useful for validating the educational quality of the retained production baseline, but it must not be represented as completed until a person grades the blind sheet.

## Deferred / intentionally not merged

- Jev router POC #89 is closed and not merged.
- Smart routing, Prompt Guard and Safeguard remain disabled until their separate evidence gates are met.
- API-02 per-user/platform rate limiting still needs legitimate observed usage distribution; no arbitrary student cap is introduced.

## v1 completion rule

The v1 completion pass now focuses on regression and live production QA, not new features:

1. preserve fail-closed curriculum behavior;
2. verify StudyContext -> schoolbook source -> tutor end-to-end;
3. verify learner, teacher, Special Education, EPAL and university pilot entry points;
4. verify EL/EN navigation, mobile behavior, accessibility, privacy/transparency and SEO essentials;
5. fix release-blocking defects only.

New feature ideas move to post-v1 unless they fix a release-blocking defect.
