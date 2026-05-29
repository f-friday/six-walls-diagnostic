# Changelog

## 1.2.0 — 2026-05-28

Tool-recommendation refresh + wall-based route naming, after a community-validation research pass (all links verified, every tool checked for active maintenance and real adoption).

- **Replaced three degrading recommendations.** Khoj (cloud sunset April 2026, team pivoting) → **NotebookLM**; Logseq + Claude (Logseq mid-split into two apps in 2026) → **Obsidian + Claude**; OpenMemory (sunset notice in its own repo, dev-only) → **basic-memory**. Open Brain (Identity) was kept and its link standardized.
- **Closed the two unmapped walls.** Governance and Economics previously fell through to a generic "approaching walls" message. **Economics** now routes to **OpenRouter**; **Governance** routes to an honest "no DIY tool yet — this is a platform-class problem" message (no fabricated recommendation).
- **Renamed DIY routes from tool-based to wall-based** (`DIY_KHOJ` → `DIY_ATTENTION`, etc.) so future tool changes touch only content, never the engine or stored data. Eleven routes total.
- **Added a "broader landscape" section** acknowledging tools the diagnostic does not route to (Khoj, Logseq, mem0; developer-grade agent runtimes OpenClaw, Hermes, OpenHands), with an honest note on their technical level and permission posture.

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
