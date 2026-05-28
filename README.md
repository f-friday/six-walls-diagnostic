# The Six Walls Diagnostic

**An open methodology for evaluating AI-memory readiness.**

---

## What This Is

The Six Walls Diagnostic is a 14-question assessment that evaluates how close a business is to hitting the structural limits of its current AI setup. It uses the Six Walls framework to measure pain across six dimensions, then routes respondents honestly -- to the right tool, even if that tool is not ours.

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

The diagnostic routes to one of nine outcomes:

| Route | Meaning |
|-------|---------|
| `FRIDAYOS_FIT` | Multiple structural walls hit; an integrated AI operating system addresses the pattern. |
| `DIY_OPEN_BRAIN` | Identity wall is dominant; Open Brain addresses multi-user context sharing. |
| `DIY_KHOJ` | Attention wall is dominant; Khoj provides autonomous search and notifications. |
| `DIY_LOGSEQ_CLAUDE` | Decision Memory wall is dominant; Logseq + Claude enables decision traces. |
| `DIY_OPEN_MEMORY` | Write-Back wall is dominant; OpenMemory provides persistent cross-session capture. |
| `STAY_PUT` | Current setup is working. No structural walls hit. |
| `APPROACHING_WALLS` | Walls are forming but not yet structural. Watch list provided. |
| `NOT_READY_YET` | Walls are real, but counter-dimension resistance is too high for an integrated solution now. |
| `DIY_WITH_AWARENESS` | Moderate walls with no dominant pattern. DIY is viable with awareness of limits. |

Full routing logic: [`methodology/routing.md`](methodology/routing.md)

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
