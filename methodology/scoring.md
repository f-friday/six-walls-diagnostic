# Scoring methodology

This document describes how the Six Walls Diagnostic (version 2.0.0) turns a completed set of answers into six wall scores, six wall states, and the signals the routing step reads. It is written so a person can score a diagnostic by hand and get the same answer the reference engine in [`src/scoring.ts`](../src/scoring.ts) gives.

Where a rule is carried from version 1 it says so; where it is new it says why.

## The gate

Before question 1, on every path, the diagnostic asks for an email address (required) and a first name (optional), with this sentence: "Your walls will show on screen either way. Your email is where the fuller roadmap goes, and it lets us pick up where you left off if you stop partway."

Consent for further notes is a separate box, unticked by default, labelled Centrifuse. A taker who stops partway leaves an email and their answers so far; a follow-up picks up from the last answered question. The results page confirms the address rather than asking again.

The gate carries no score and plays no part in routing.

## What each question produces

| Question | Produces |
|---|---|
| 1 Scale (two pickers) | `people` and `ai_users`. Not scored. Drives the solo modifiers, the team signal and the benchmark cohort. |
| 2 Setup | `cohort` (chat, workspace, tools, own_system, cli, none). Not scored. Drives the not-started pre-check and the substrate rule. |
| 3 to 8, one per wall | A wall score from 0 to 10, or `inactive` (the wall does not apply), or `escaped` (the taker chose "none of these" and wrote a line). |
| 9 Constraints (deep path, optional) | Zero or more constraints, each *stated* or *hard*. |
| 10 Trajectory (deep path, optional) | `growth` from 1 to 8 and, for one answer, a team signal. |

Questions 1 to 8 are the core diagnostic. Questions 9 and 10 are offered on the results page after the first result renders; both are optional, and answering them re-renders the result without leaving the page.

## Wall scores (0 to 10)

Each wall is scored on a 0 to 10 scale. Higher means more pain: a bigger wall.

| Wall | Question id |
|---|---|
| Identity (wall 1) | `q3_identity` |
| Decision Memory (wall 2) | `q4_decision_memory` |
| Attention (wall 3) | `q5_attention` |
| Write-Back (wall 4) | `q6_write_back` |
| Governance (wall 5) | `q7_governance` |
| Economics (wall 6) | `q8_economics` |

- **Each wall is one question.** The chosen option's `score` is the wall score. Version 1 averaged two Identity questions; the onboarding scenario has moved to the moments list on the results page.
- **Every option set carries a truthful zero.** Each wall question includes the answer a well-run business would give, scored 0 or 1, so a taker who has solved a wall can say so.
- **Inactive walls.** An option marked `wall_inactive` (for example "I work alone and that is the plan" on Identity, or "I only use AI to look things up; it does not act" on Governance) scores 0 and marks the wall inactive. The page says "does not apply" in words, never as a zero bar.
- **Unanswered walls.** A wall question with no answer, or with an option code the question file does not carry, is read as inactive. Absence of an answer is never read as pain.

### The escape

Every wall question ends with "None of these" plus one line of free text. A wall answered this way:

- scores the midpoint, **5**;
- is flagged **escaped** (shown on the page as "we could not place this wall from your answer");
- **never counts as hit** and never counts as a wall for the family rule in [`routing.md`](routing.md), whatever its score;
- has its free text stored with the assessment and read by a person, who reports how many takers escaped on each wall. This is how the questions evolve.

## Wall states

| Score | State | Word on the page |
|---|---|---|
| under 3 | `idle` | not a factor |
| 3 to under 6 | `watch` | approaching |
| 6 to under 8 | `hit` | hitting |
| 8 and above | `breaking` | breaking |

**Structural** means a score of 6 or more on a wall that is neither inactive nor escaped. The routing step counts structural walls.

## Solo and small-team modifiers

Carried from version 1 and extended. All three apply when `people` (question 1, first picker) is "Just me":

1. **Identity is scored 0 and marked inactive**, shown as "does not apply while it is just you". Version 1 capped it at 3; a solo operator cannot hit a wall about a second person.
2. **Governance is multiplied by 0.6** (carried). Single-user review carries less organisational risk. The result is rounded to two decimal places. An inactive or escaped Governance wall is left alone.
3. **Economics is capped at 2** when the taker also chose "Free tiers only, and my time" (carried).

When `people` is "2 to 5" and `ai_users` is "Just me": Identity is scored exactly as answered, with no cap, because the second person is real and not yet inside the system. The page chooses its Identity moment from the onboarding set.

## The team signal

The team signal is true when either holds:

- `people` is greater than one **and** `ai_users` is fewer than "Everyone" (there are people in the business who do not yet work inside the system); or
- question 10 (trajectory) was answered "My team working inside it alongside me".

The team signal is what turns a single structural wall into an operating-system result (the wedge rule in [`routing.md`](routing.md)).

## Hit walls and the next wall

- **Hit** is the list of structural walls (score 6 or more, not inactive, not escaped), highest score first.
- **Next** is the highest-scoring wall that is not structural, not inactive, not escaped, and scores 3 or more; or none. It is the wall the page names as "next" and the wall whose tool is named in the walls-forming family.
- Where two walls tie on score, the lower-numbered wall (Identity first, Economics last) comes first.

## Growth

Question 10 (trajectory) gives `growth` from 1 to 8. When the deep path was not taken, growth is absent and every rule that reads it treats it as not met.

| Answer | Growth |
|---|---|
| Honestly, not much. I am in a good spot | 1 |
| A few more tools added to my setup | 3 |
| My team working inside it alongside me | 8 (also sets the team signal) |
| Running whole multi-step processes, not just one-off tasks | 8 |
| Not sure yet. Still figuring out where AI fits | 4 |

## Constraints

Question 9 (constraints) is a multi-select with a deal-breaker mark. Each ticked option maps to a constraint: portability, speed, cost or capability (no technical help). "Nothing, if it works" maps to no constraint and is exclusive of the others.

A ticked constraint is **stated**. A ticked constraint that is also marked as a deal-breaker is **hard**. Any hard constraint sets `hardConstraint` on the result. Constraints do not change any wall score and do not make a family; what they change is described in [`routing.md`](routing.md).

Version 1 scored three counter-dimension questions and inferred a hard constraint from an average of 7 or more. Version 2 asks.

## What version 2 no longer computes

- **Composite wall score.** Routing counts structural walls; it no longer averages them.
- **Counter score, friction score.** The three buy-readiness questions and the friction question are gone. Constraints are one optional question, read as stated or hard.
- **Nearest wall.** Replaced by the ordered `hit` list and `next`.

## Rounding

The only arithmetic is the solo Governance multiplier; its result is rounded to two decimal places. All other scores are the integers in the question file.
