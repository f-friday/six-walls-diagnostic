# Changelog

## 2.0.0 — 2026-09-14

A rewrite. The 2025 questions no longer described how people work with AI, and the people they failed were the ones the framework is for: operators who built their own systems, or who run agents inside their tools.

- **Eight questions, not fifteen.** Two about the business, one per wall. Every wall question includes the answer a well-run business would give, so a truthful zero is possible, and a "none of these" escape with a free-text line, which is stored and read; the escape text is how the questions evolve.
- **The three buy-readiness questions are gone as questions.** Constraints are one optional question on the results page, and a constraint can be *stated* or *hard*. A hard constraint removes every FridayOS mention from the result (the carve-out ruled in June 2026, now asked rather than inferred).
- **Thirteen routes become four outcome families**, each rendered with equal weight: walls an operating system solves; one wall, one good tool; walls forming; you are fine.
- **The wedge rule.** A coding-agent operator with two or more walls, or with more people in the business than AI users, is routed to a personal FridayOS rather than to a substrate. A single-wall solo builder is still routed to gstack.
- **Approved recommendations register published** (`methodology/register.md`): every tool the diagnostic may name, who made it, when it was last checked, who approved it.
- **The 25% routing-away target is retired.** The routing distribution is published quarterly from a live read instead.
- **Publisher: Centrifuse.** Author, publisher and attribution lines updated. Framework Friday was retired as a brand on 2026-09-01.
- Engine: `src/types.ts`, `src/questions.ts` and `src/scoring.ts` rewritten for the new question file and the four families; `src/check.ts` added (five example people, run with `npx tsx src/check.ts`).

## 1.2 (wording) — 2026-06-11, unpublished until now

The live site shipped a full rewording of fourteen of fifteen questions ("Version C") on 2026-06-11. Scores, codes and wall flags were unchanged. It was never pushed to this repo, so takers answered wording this repo did not carry for three months. Recorded here so the record is honest; 2.0.0 supersedes it.

## 1.3.0 — 2026-06-08

Cohort-modulated routing — substrate-class routes for environment-aware recommendations.

- **Added an optional cohort question** (`q_cohort`, "where do you work with AI day-to-day"). It carries no wall score and does not affect any scoring metric — it is a routing signal only. Assessment count is now 15 (14 scored + 1 optional).
- **Added two substrate-class routes.** `SUBSTRATE_GSTACK` (gstack — cross-CLI operator overlay) and `SUBSTRATE_AGENT_BRAIN` (agent-brain layer: memory-os / gbrain). These recognize that for a taker hitting a single wall, the honest answer is often a substrate that sits under their whole AI workflow, not a per-wall point tool.
- **Cohort modulation is a post-step on the 1–2 wall outcomes only.** After the wall-based route is computed, a CLI-agent / AI-IDE cohort modulates a `DIY_*` or `DIY_WITH_AWARENESS` route to `SUBSTRATE_GSTACK`; an agent-runtime cohort modulates it to `SUBSTRATE_AGENT_BRAIN`. The original wall-specific tool is surfaced as the alternate. `STAY_PUT`, `NOT_READY_YET`, `FRIDAYOS_FIT`, and `APPROACHING_WALLS` are never modulated, and the `chat_interfaces` / `no_setup` cohorts never receive substrate routing (they lack the CLI/IDE/runtime fluency a substrate assumes). An absent or unrecognized cohort answer leaves the wall-based route unchanged.
- Engine: `Route` gains the two substrate members, `AssessmentResult` gains an optional `cohort` field, and `QuestionPurpose` gains `"cohort"`.

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
