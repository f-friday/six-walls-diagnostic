# The Six Walls Diagnostic

**An open methodology for evaluating AI-memory readiness.**

---

## What This Is

The Six Walls Diagnostic is a 15-question assessment (14 scored, plus one optional question about your AI working environment) that evaluates how close a business is to hitting the structural limits of its current AI setup. It uses the Six Walls framework to measure pain across six dimensions, then routes respondents honestly -- to the right tool, even if that tool is not ours.

The methodology, scoring engine, and routing algorithm are open. Fork it, adapt it, build on it.

## The Six Walls

| Wall | What It Measures |
|------|------------------|
| **Identity** | Whether AI context is personal or organizational -- and whether others can access it. |
| **Decision Memory** | Whether past decisions are retrievable with full context, or lost to memory and scattered tools. |
| **Attention** | Whether the system catches and escalates what matters without human vigilance. |
| **Write-Back** | Whether operational activity is captured during normal work, or only when someone stops to document. |
| **Governance** | Whether AI recommendations face structural review before action, or pass unchecked. |
| **Economics** | Whether AI spending is tracked and attributed to outcomes, or just a line item. |

## How Scoring Works

Each wall is scored on a 0--10 scale, where higher means more pain (a bigger wall).

- **Raw wall scores** are computed from question responses. The Identity wall averages two questions; all others use a single question each.
- **Team-size modifiers** adjust scores for solo operators -- walls like Identity and Governance are less relevant when there is no team.
- **Counter-dimension scores** (portability, time-to-value, cost sensitivity) measure resistance to integrated solutions. Higher counter scores push toward DIY or stay-put routes.
- **Friction and growth scores** capture current pain level and 12-month trajectory.
- **Composite wall score** is the equal-weighted average of all six wall scores.
- **Walls hit** counts how many walls score 6 or above -- the threshold where a wall becomes structurally painful.

The routing algorithm uses composite score, counter score, friction, growth, nearest wall (highest-scoring), and walls-hit count to determine the recommendation.

Full scoring methodology: [`methodology/scoring.md`](methodology/scoring.md)

## Routes

The diagnostic routes to one of thirteen outcomes. DIY routes are named by the wall they serve; the recommended tool per wall lives in the routing content and may change over time (tool shown is current as of 2026-05):

| Route | Meaning |
|-------|---------|
| `FRIDAYOS_FIT` | Multiple structural walls hit; an integrated AI operating system addresses the pattern. |
| `DIY_IDENTITY` | Identity wall is dominant; Open Brain gives multiple AI tools a shared picture of you and your business. |
| `DIY_DECISION_MEMORY` | Decision Memory wall is dominant; Obsidian + Claude captures decisions and their reasoning. |
| `DIY_ATTENTION` | Attention wall is dominant; NotebookLM surfaces answers grounded in your own documents. |
| `DIY_WRITE_BACK` | Write-Back wall is dominant; basic-memory persists what your AI learns across tools and sessions. |
| `DIY_GOVERNANCE` | Governance wall is dominant; no DIY tool meets the bar — an honest "watch this wall / platform-class" message. |
| `DIY_ECONOMICS` | Economics wall is dominant; OpenRouter gives hosted spend visibility across models and workflows. |
| `STAY_PUT` | Current setup is working. No structural walls hit. |
| `APPROACHING_WALLS` | Walls are forming but not yet structural. Watch list provided. |
| `NOT_READY_YET` | Walls are real, but counter-dimension resistance is too high for an integrated solution now. |
| `DIY_WITH_AWARENESS` | Moderate walls with no dominant pattern. DIY is viable with awareness of limits. |
| `SUBSTRATE_GSTACK` | A 1–2 wall taker who works in a CLI agent or AI IDE; gstack (cross-CLI operator overlay) leads, with the wall-specific tool as the alternate. |
| `SUBSTRATE_AGENT_BRAIN` | A 1–2 wall taker building on an agent runtime; an agent-brain layer (memory-os / gbrain) leads, with the wall-specific tool as the alternate. |

The last two are **cohort-modulated** outcomes. After the wall-based route is computed, an optional question about the taker's AI working environment (`q_cohort`) can elevate a substrate-class tool to the primary recommendation for the 1–2 wall outcomes only — it never overrides `STAY_PUT`, `NOT_READY_YET`, `FRIDAYOS_FIT`, or `APPROACHING_WALLS`, and chat-only / no-setup takers are left on the wall-based route. Wall-routing stays primary.

Full routing logic: [`methodology/routing.md`](methodology/routing.md)

## The broader landscape

The diagnostic routes to a small set of tools chosen for fit and health (current set in [`methodology/routing.md`](methodology/routing.md)). It is not an attempt to catalog the whole space. The wider AI-memory and agent ecosystem is large and moving fast, and the framework is meant to be the lens you judge any of it against — not a list to adopt wholesale:

- **Personal knowledge / AI-memory:** [Khoj](https://github.com/khoj-ai/khoj), [Logseq](https://github.com/logseq/logseq), [mem0](https://github.com/mem0ai/mem0), [Letta](https://github.com/letta-ai/letta), and others. Strong communities; some are mid-transition or assume a technical setup, which is why the diagnostic routes only to the subset that currently fits a given wall.
- **Developer-grade agent runtimes:** [OpenClaw](https://github.com/openclaw/openclaw), [Hermes](https://github.com/NousResearch/hermes-agent), [OpenHands](https://github.com/OpenHands/OpenHands), and similar. These are powerful and widely used, but they are developer-oriented and several run with broad default permissions (shell, email, calendar) — adopt them deliberately, with permissions scoped to what you actually need.

We track this landscape and update the routing as tools mature, change, or stop being maintained.

## Repository Structure

```
methodology/
  questions.json    # The 14-question assessment (source of truth)
  scoring.md        # Scoring methodology in human-readable form
  routing.md        # Routing algorithm and threshold documentation
src/
  scoring.ts        # Scoring engine (TypeScript)
  questions.ts      # Loads questions.json and exposes the question lookup
  types.ts          # Type definitions
LICENSE             # CC BY 4.0
CHANGELOG.md        # Release history
```

## License

This work is licensed under [Creative Commons Attribution 4.0 International (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/).

You are free to share and adapt this methodology for any purpose, including commercial use, as long as you provide attribution.

## Built By

[Framework Friday](https://frameworkfriday.ai) -- an AI-first operations company building tools and methodologies for businesses adopting AI at the operational level.
