# Pending work verification — 1 October 2026

## Verified and completed

- Economics Phase 21: PR #223 merged as `d2b5423d0a569727b925fcb5d0323e16daea14f0`, all nine reported checks passed. Sixteen mappings resolve against the official book. Two incomplete aggregate topics remain blocked. GEL coverage: 351 grounded, 296 blocked, 647 total.
- Mathematics B Gymnasium: current main already contains the replacement implementation; source-grounding and diagnostic-scope tests pass. PR #156 is superseded.
- Patras Biology source lock: current main already contains `de6e12b` and later university pilot work. Canonical data and browser checks verify the current replacement rather than the old draft branches #63/#64.
- The old Phase 12 branch #208 is superseded by the merged catalog, Primary and secondary grounding phases; the current catalog test passes (47 catalog subjects, 40 HTML-eligible subjects, seven deliberately blocked non-HTML subjects). The old branch must not overwrite the current resolver.
- Top-three need recommendations ported from #88 onto current main, retaining audited age and Greek-language filters. Additional tools remain in an accessible disclosure; mobile/desktop priority and age checks pass.
- StudyContext selection restoration added for Study and eligible AI Help views. Explicit curriculum links take precedence; session restoration is scoped to matching role and school zone. Uploaded text is never restored. No age gate is changed.

## Benchmark findings and corrections

Run `36678343117` completed successfully as a workflow, but screening did not finish before its budget stop. Its artifact has 104 attempts, approximately 8,075 estimated Neurons including the previous resumed run.

After retaining the latest attempt per current case/model, GPT-OSS 120B has 32/32 completed Phase 1 cases: explain, flashcards, plan and quiz each 8/8 valid eventually; plan is 7/8 valid on the first try. Qwen has 32/32 failed current cases. GLM has only 22/32 attempted cases and several errors. Gemma and DeepSeek have no recorded cases. These are not Phase 2 results and not human accuracy grades.

The harness previously counted retried cases repeatedly, inflating denominators. Reports now count the latest attempt once and retain every attempt in raw data. New captures and grading sheets preserve the full server-selected official source instead of truncating it to 6,000/2,500 characters. Historical truncated sources cannot be reconstructed from the artifact alone.

The sandbox left Qwen/GLM thinking settings unset because production smart routing is disabled. The benchmark now explicitly requests their intended non-thinking configuration. Empty-response reasoning exhaustion is a hypothesis, not a proven diagnosis; finish reasons and reasoning lengths are now captured for the next run. Production model selection is unchanged.

## Genuine remaining gates

- Complete Phase 1 screening in the corrected configuration, within the shared free Neuron budget; then human blind grading, Phase 2, baseline safety and separate guard evaluation, in that order. Do not promote models from these incomplete results. No live model calls were made during this closure audit.
- The 296 blocked GEL topics require new exact official-section evidence: six have candidate hints, 285 have no safe candidate and five are explicitly no-safe-mapping. They are not completed curriculum mappings. The same verified-source policy continues to apply to EPAL and Special Education coverage gaps.
- API-02 server/platform rate limiting remains open. The accepted architecture requires observed legitimate p95 usage plus margin; an arbitrary daily student cap must not be introduced.
- Draft Jev router #89 remains deferred and must not be merged without its separate provider/preview prerequisites. Smart routing, Prompt Guard and Safeguard remain disabled pending the benchmark gates.

This record distinguishes completed technical work from evidence and evaluation that are still required; it does not claim full curriculum coverage or completed model qualification.
