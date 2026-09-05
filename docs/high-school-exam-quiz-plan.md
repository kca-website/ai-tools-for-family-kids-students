# High-school exam quiz hardening

Goal: make AI-generated quizzes under AI Help substantially more demanding for Lyceum without changing Primary/Middle behavior or the mobile layout.

Rules for the high-school quiz prompt:
- exam-level difficulty, not trivia or direct definition recall
- at least 4/6 questions require application, inference or multi-step reasoning
- at least 2/6 use a short problem, data set, source, scenario or worked situation appropriate to the subject
- plausible distractors based on common mistakes
- grade-aware difficulty: A' = demanding school-exam level, B' = advanced school-exam/preparatory level, C' = final-exam level; for nationally examined subjects, reasoning should be comparable in difficulty to exam preparation without pretending to reproduce the official paper format
- quantitative subjects should prefer calculation/interpretation; language/humanities should prefer source/argument/evidence interpretation
- exactly four options and a useful explanation

Implementation safety:
- no change to tutor/mobile DOM or CSS
- preserve Primary/Middle quiz prompt
- version high-school quiz cache so previously generated easy quizzes are not silently reused
- allow a slightly larger token budget only for high-school quizzes
