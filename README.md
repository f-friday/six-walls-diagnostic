# The Six Walls Diagnostic

**An open methodology for finding which of the six walls your AI setup is hitting, and what to do about each one.**

Take it at [fridayos.ai/six-walls-diagnostic](https://fridayos.ai/six-walls-diagnostic). Published by Centrifuse, the company behind FridayOS.

---

## What this is

The Six Walls Diagnostic is an eight-question assessment (two about the business, one per wall), with two optional follow-up questions on the results page. It takes about three minutes. It uses the Six Walls framework to score six structural limits of an AI setup, then routes the taker to one of four outcomes and names an outside tool for every wall it finds, on every result, including the ones where it recommends FridayOS.

The methodology, the question file, the scoring and routing rules, the reference engine and the list of tools the diagnostic may name are all open. Fork it, adapt it, build on it.

## The six walls

| Wall | What it measures |
|---|---|
| **Identity** | Whether AI context is personal or shared across the business, and whether a second person can work from the same picture. |
| **Decision Memory** | Whether past decisions are retrievable with their reasoning and outcome, or lost to memory and scattered chats. |
| **Attention** | Whether the system catches and escalates what matters without a person watching everything. |
| **Write-Back** | Whether what happened is captured during normal work, or only when someone stops to write it down. |
| **Governance** | Whether AI and agents act only after a person or a second agent has checked, and whether it is clear who can see what. |
| **Economics** | Whether AI spend and the hours spent keeping it running can be tied to outcomes, or are just a line inside subscriptions. |

## How the questions work

- **Eight core questions.** Question 1 asks how many people are in the business and how many of them use AI every week. Question 2 asks how AI actually works in the business today. Questions 3 to 8 are one scenario per wall.
- **A truthful zero is always available.** Every wall question includes the answer a well-run business would give, so a taker who has solved a wall can say so.
- **Every wall question has an escape.** "None of these" plus one line of free text. An escaped wall scores the midpoint, is shown as "we could not place this wall from your answer", and is never counted as hit. The text is read by a person; it is how the questions evolve.
- **Two optional questions on the results page.** Constraints (what would stop you adopting a system, each one *stated* or marked as a *hard* deal-breaker) and trajectory (what changes in the next year). Answering them re-renders the result.
- **The email is asked first.** Before question 1, on every path, the diagnostic asks for an email so the fuller roadmap has somewhere to go and a taker who stops partway can be picked up. Consent for further notes is a separate box, unticked. The walls show on screen either way.

Full question file: [`methodology/questions.json`](methodology/questions.json)

## How scoring works

Each wall is scored 0 to 10, where higher means more pain (a bigger wall). Each wall is one question; the chosen option's score is the wall score.

- **Wall states:** under 3 is not a factor; 3 to under 6 is approaching; 6 to under 8 is hitting; 8 and above is breaking. A wall is **structural** at 6 or more.
- **Solo modifiers** apply when it is just one person: Identity does not apply, Governance is multiplied by 0.6, and Economics is capped at 2 on free tiers.
- **The team signal** is true when there are people in the business who do not yet use AI, or when the trajectory answer says the team is coming.
- **Constraints** never change a score. A stated constraint changes which tool leads; a hard one removes every FridayOS mention from the result.

Full scoring methodology: [`methodology/scoring.md`](methodology/scoring.md)

## The four outcome families

Routing counts the structural walls and reads the team signal. Every family is rendered with equal weight, and every family names an outside tool for each wall at 3 or more.

| Family | When | What leads |
|---|---|---|
| **Walls an operating system solves** (`os`) | Two or more structural walls; or one structural wall and the team signal | A personal FridayOS (start alone, invite the team when Identity arrives), stated plainly as a waitlist until the product is open, beside the point-tool set at equal size. |
| **One wall, one good tool** (`tool`) | Exactly one structural wall, no team signal | The approved tool for that wall. |
| **Walls forming, not hit** (`forming`) | No structural wall, at least one approaching, and growth or the team signal | Nothing to buy. The moments that will tell you a wall has arrived, and one tool for the next wall. |
| **You are fine** (`fine`) | Everything else | Stay put. The moments list. No FridayOS mention at all. |

Two rules adjust what leads without changing the family. **The substrate rule:** a solo operator with one wall who works in a coding agent is sent to gstack, a substrate under their whole workflow; once a second wall or a second person is in the picture, the answer is a system, with gstack named as the way to start alone. **Constraints:** a hard constraint (portability, speed, cost or no technical help, marked as a deal-breaker) removes every FridayOS mention from the result; the point-tool path is shown alone. A taker who is not yet using AI in the business is routed on readiness, with no tool named.

Full routing logic: [`methodology/routing.md`](methodology/routing.md)

## The Approved Recommendations Register

Every tool the diagnostic may name is a row in [`methodology/register.md`](methodology/register.md), with the wall or cohort it serves, who made it, when a person last checked it live, and who approved it. The page names no tool that is not an approved row there. The register also states the rule for getting on the list and the one wall with no tool we would put our name on (Governance).

The approved rows today: Open Brain (Identity), Obsidian + Claude (Decision Memory), NotebookLM (Attention), basic-memory (Write-Back), OpenRouter (Economics), and the substrates gstack (coding-agent cohort) and gbrain (agent-runtime cohort). Checked live on 2026-09-11.

## The broader landscape

The diagnostic routes to the small set of tools in the register, chosen for fit and health. It is not an attempt to catalog the whole space. The wider AI-memory and agent ecosystem is large and moving fast, and the framework is meant to be the lens you judge any of it against, not a list to adopt wholesale:

- **Personal knowledge and AI memory:** [Logseq](https://github.com/logseq/logseq), [mem0](https://github.com/mem0ai/mem0), [Letta](https://github.com/letta-ai/letta), and others. Strong communities; some are mid-transition or assume a technical setup, which is why the diagnostic routes only to the subset that currently fits a given wall.
- **Memory layers for people who already run agents:** [gbrain](https://github.com/garrytan/gbrain), which is on the register as the substrate for the agent-runtime cohort.
- **Developer-grade agent runtimes:** [OpenClaw](https://github.com/openclaw/openclaw), [Hermes](https://github.com/NousResearch/hermes-agent), [OpenHands](https://github.com/OpenHands/OpenHands), and similar. These are powerful and widely used, but they are developer-oriented and several run with broad default permissions (shell, email, calendar). Adopt them deliberately, with permissions scoped to what you actually need.

We track this landscape and update the register as tools mature, change, or stop being maintained. The routing distribution (where takers were actually sent) is published quarterly from a live read, excluding the publisher's own domains and test rows. No target rate is stated.

## Repository structure

```
methodology/
  questions.json    # The question file: gate, 8 core + 2 optional questions (source of truth)
  scoring.md        # Scoring rules in plain English, so a person can score by hand
  routing.md        # The four outcome families, the substrate rule, constraints
  register.md       # The Approved Recommendations Register: every tool the page may name
src/
  types.ts          # Type definitions, wall order and labels
  questions.ts      # Loads questions.json and exposes the question lookups
  scoring.ts        # Reference scoring and routing engine (TypeScript, no dependencies)
  check.ts          # Five example people scored against the rulebook
LICENSE             # CC BY 4.0
CHANGELOG.md        # Release history
```

## Running the check

The reference engine has no dependencies beyond Node. To score the five example people and confirm the engine matches the written rules:

```
npx tsx src/check.ts
```

It prints one line per check and exits non-zero on the first mismatch.

## License

This work is licensed under [Creative Commons Attribution 4.0 International (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/).

You are free to share and adapt this methodology for any purpose, including commercial use, as long as you provide attribution.

## Built by

[Centrifuse](https://fridayos.ai), the company behind FridayOS, the AI operating system small and mid-market businesses transition onto. The Six Walls framework was written by Fred Butson and Lucas Robinson.
