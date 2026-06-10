# Scoring Methodology

This document describes how the Six Walls Diagnostic converts raw question responses into wall scores, counter-dimension scores, and a composite assessment.

## Wall Scores (0--10)

Each wall is scored on a 0--10 scale. Higher means more pain — a bigger wall.

### Identity (Wall 1)

Two questions: `q3_identity_sharing` and `q4_identity_onboarding`. The identity score is the **average** of both question scores, with special handling:

- If both questions are marked `wall_inactive` (solo operator, N/A selected), the identity score is 0.
- If only one question is inactive, the score is the active question's score alone (no averaging).
- Otherwise, the score is `(q3_score + q4_score) / 2`.

### Walls 2--6 (Single Question Each)

| Wall | Question ID |
|------|-------------|
| Decision Memory | `q5_decision_memory` |
| Attention | `q6_attention` |
| Write-Back | `q7_write_back` |
| Governance | `q8_governance` |
| Economics | `q9_economics` |

If the selected option has `wall_inactive: true`, the wall score is 0.

## Team-Size Modifiers

When `q1_team_size` answer is `solo`, three adjustments apply:

1. **Identity capped at 3** — Multi-user context sharing is irrelevant for solo operators.
2. **Governance reduced by 40%** — Single-user AI review carries less organizational risk.
3. **Economics capped at 2** — Only applies when the user also selected `free_tier` for q9.

These modifiers prevent solo operators from being routed toward team-scale solutions.

## Counter-Dimension Scores

Three questions measure resistance to integrated solutions:

| Dimension | Question ID |
|-----------|-------------|
| Portability | `q10_portability` |
| Time-to-Value | `q11_time_to_value` |
| Cost Sensitivity | `q12_cost_sensitivity` |

Each is scored 0--10 (higher = more resistant to integrated solutions).

**Composite counter score** = average of all three counter-dimension scores.

## Friction and Growth

Two synthesis questions provide routing context:

- **Friction** (`q13_friction`): How often the user hits limits with their current setup. 0--10, higher = more friction.
- **Growth** (`q14_growth`): 12-month trajectory for AI complexity. 0--10, higher = more growth expected.

## Composite Wall Score

The equal-weighted average of all six wall scores:

```
compositeWallScore = (identity + decision_memory + attention + write_back + governance + economics) / 6
```

## Nearest Wall

The wall with the highest individual score. Ties are broken by wall number (lower wall number wins).

## Walls Hit

Count of walls scoring **6 or above** — the threshold where a wall becomes structurally painful.

## Cohort Signal

The optional cohort question (`q_cohort`) captures the taker's primary AI working environment. It carries **no wall score** and does not affect any of the metrics above — it is read during scoring, narrowed to a known cohort (`cli_agent`, `ai_ide`, `agent_runtime`, `chat_interfaces`, `no_setup`), and passed through to the routing layer, where it can modulate the wall-based route on 1–2 wall outcomes (see [`routing.md`](routing.md#cohort-modulation-post-step)). An absent or unrecognized answer is left undefined and the wall-based route stands.

## Rounding

All computed scores are rounded to two decimal places. Wall scores are clamped to [0, 10].
