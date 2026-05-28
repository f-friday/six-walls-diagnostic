# Changelog

## 1.1.0 — 2026-05-28

Routing honesty + calibration fixes, validated against a blind expert-panel test.

- **Not-started pre-check:** respondents who haven't operationalized AI (no AI setup, or "haven't hit limits yet") are no longer scored as if their "no system" answers were maximum wall friction — they route on readiness (STAY_PUT / APPROACHING_WALLS) instead of being pushed toward a platform.
- **Honest FRIDAYOS_FIT guard:** a hard counter-dimension constraint (portability / cost / speed, `counterScore >= 6`) now routes a respondent away even when multiple walls are hit. Hitting walls no longer overrides a stated constraint.
- **Loosened STAY_PUT:** a single mild wall or once-a-month friction no longer disqualifies "stay put" when there's no growth trajectory.
- Added `src/questions.ts` (question loader) so the scoring engine resolves standalone.

## 1.0.0 — 2026-05-26

Initial public release of the Six Walls methodology, scoring engine, and routing algorithm.

- 14-question assessment covering six structural walls
- Scoring engine with team-size modifiers and counter-dimension balancing
- Nine-route routing algorithm with honest tool recommendations
- Full question set, scoring methodology, and routing logic documented
