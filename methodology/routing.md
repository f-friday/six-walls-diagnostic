# Routing

This document describes how the Six Walls Diagnostic (version 2.0.0) turns the scores and signals in [`scoring.md`](scoring.md) into one of four outcome families, and what each family names. It is written so a person can route a scored diagnostic by hand and get the same answer the reference engine in [`src/scoring.ts`](../src/scoring.ts) gives.

Routing has three parts, in order: a **not-started pre-check**, the **family rule**, and two adjustments that change what leads inside a family without changing the family: the **substrate rule** and **constraints**.

Version 1 routed to thirteen named routes. Version 2 folds them into four families: the six `DIY_*` routes and `DIY_WITH_AWARENESS` become **tool**; `FRIDAYOS_FIT` becomes **os**; `APPROACHING_WALLS` becomes **forming**; `STAY_PUT` becomes **fine**; `NOT_READY_YET` is handled by the constraint rule rather than by a family of its own; the two `SUBSTRATE_*` routes become the substrate rule.

## Inputs

From [`scoring.md`](scoring.md):

- `hit`: the structural walls (score 6 or more, not inactive, not escaped), highest first.
- `next`: the highest non-structural wall at 3 or more, or none.
- `teamSignal`: more people in the business than AI users, or the trajectory answer says the team is coming.
- `notStarted`: setup answered "We are not really using AI in the business yet".
- `growth`: 1 to 8 from the trajectory question, or absent.
- `cohort`: chat, workspace, tools, own_system, cli, none, or unknown.
- `constraints`: each stated or hard.

## 0. The not-started pre-check (carried from version 1)

```
notStarted == true
```

If setup is "not using AI yet", every wall question would read as maximum pain for the wrong reason. The taker is routed on readiness, not on walls:

- **forming** if trajectory was answered with a growth of 8;
- **fine** otherwise.

No tool is named, no substrate is named, and FridayOS is not mentioned. The page's first move is the free Before AI workshop.

## 1. The four outcome families

Count the structural walls. Call the count `hit`.

| Family | Rule | Leads with |
|---|---|---|
| **os** — walls an operating system solves | `hit` is 2 or more; or `hit` is 1 and the team signal is true | A personal FridayOS, framed to the wedge: start alone, invite the team when Identity arrives. Stated as a waitlist until the product is open, with the point-tool set (one approved tool per hit wall) as the honest way to start meanwhile, shown at equal size. |
| **tool** — one wall, one good tool | `hit` is exactly 1 and the team signal is false | The approved tool for that wall, from the [register](register.md). FridayOS is a quiet door for "when the second wall arrives". |
| **forming** — walls forming, not hit | `hit` is 0, and `next` exists (at least one wall at 3 or more), and either growth is 6 or more or the team signal is true | Nothing to buy. The moments list leads; one tool named for the next wall. FridayOS mentioned once, as "if two fire together". |
| **fine** — you are fine, and here is how you will know when you are not | Everything else | Stay put, warmly. The moments list. No FridayOS mention at all. |

The rules are evaluated in this order and the first match wins. An escaped wall is never in `hit`, whatever its score, so a taker who could not place a wall is never routed to an operating system on that wall.

## 2. The substrate rule and the wedge

A substrate is a tool that sits under the taker's whole AI workflow rather than solving one wall. Two are on the register: gstack (for people who work in a coding agent) and gbrain (for people who run an agent runtime).

The rule applies only when the cohort is `cli` (question 2 answered "A coding agent ... with my own files or repo as the system") or, for gbrain, when the taker's setup or escape text describes an agent runtime, which a person reads; the form carries no code for it, so the reference engine names gstack only.

| Family | Cohort `cli` | What the page shows |
|---|---|---|
| **tool** | gstack leads as the substrate; the wall's approved tool is named beside it | The genuine single-wall solo builder with no team on the horizon. The honest answer is still gstack. |
| **os** | A personal FridayOS leads; gstack is named inside the point-tool option as the honest substrate for the solo version | **The wedge.** A coding-agent operator with two or more walls, or with more people in the business than AI users, is routed to a personal FridayOS rather than to a substrate. Version 1 sent this taker to gstack. |
| **forming**, **fine** | No substrate | Nothing to buy. |

The chat, workspace and tools cohorts never receive a substrate (carried from version 1: a substrate assumes a fluency those takers do not have).

## 3. Constraints (deep path question 9)

Constraints do not create a family. They change what leads inside one, and whether FridayOS appears at all.

**Stated** (ticked, not marked as a deal-breaker): the recommendation that respects it leads, and FridayOS's answer to it is written out rather than hidden.

| Constraint | What leads |
|---|---|
| Portability ("I need to be able to leave with my data") | The tool whose context lives in files the taker owns. FridayOS's answer: "your context lives in files you can take with you". |
| No technical help ("I do not have anyone technical") | Never a tool that needs someone technical to set up. On the register today that removes Open Brain and Obsidian + Claude from the lead position and leaves the hosted tools. |
| Cost ("It has to be free or nearly") | The free-or-nearly option. |
| Speed ("I need it working this week") | The hosted, nothing-to-install option. |

**Hard** (marked as a deal-breaker): every FridayOS mention leaves the page, including the ninety-day step and the quiet door. The family's point-tool path is shown alone, at full width, with the sentence "you stated a constraint that rules out an integrated system, and we will not recommend one against it".

This is the hard-constraint carve-out ruled in June 2026, carried into version 2 unchanged in substance. Version 1 inferred hardness from a counter score of 7 or more across three questions; version 2 asks.

## 4. What the page shows for every family

Unchanged by routing: the six-wall picture; one card per wall at 3 or more with the move, the approved tool and the free workshop; the moments list, chosen from the hit walls, then the next wall, then the growth answer; the ninety-day steps; the save block. Every tool named comes from the [Approved Recommendations Register](register.md) and from nowhere else. Governance has no approved tool; its card says so in words.

## Worked examples

The five example people in [`src/check.ts`](../src/check.ts), by hand:

1. **A homegrown-system operator with a team.** 6 to 15 people, a few use AI, works in a coding agent. Identity 7, Decision Memory 8, Attention 4, Governance 4, Economics 3. `hit` = [Decision Memory, Identity]; the team signal is true. Two structural walls → **os**. Cohort is `cli`, so gstack is named inside the point-tool option.
2. **A solo accountant.** Just them, agents inside their tools. Identity does not apply; Decision Memory 4, Attention 4, Write-Back 8, Governance 4 × 0.6 = 2.4, Economics 5. `hit` = [Write-Back]; no team signal → **tool**: basic-memory leads. `next` is Economics. Portability is a stated constraint, so FridayOS's answer to it is written out.
3. **The same accountant, portability marked as a deal-breaker.** Still **tool**; every FridayOS mention leaves the page.
4. **A small team approaching the walls.** 2 to 5 people, most use AI, shared workspace. Identity 5, Decision Memory 4, Attention 4, Write-Back 4, Governance inactive, Economics 1. `hit` is empty, `next` is Identity, trajectory says the team is coming → **forming**.
5. **A solo operator who is fine.** Every wall answered as a well-run business would; no growth answer. `hit` is empty, `next` is none → **fine**.

And the wedge: the accountant with 2 to 5 people in the business and only them using AI. Identity is scored as answered; `hit` = [Write-Back]; the team signal is true → **os**.

## Design principles

1. **Honest routing over conversion.** The algorithm routes away from the commercial product (FridayOS) when the taker's situation does not warrant it, and names an outside tool for every wall it finds, on every result. The routing distribution is published quarterly from a live read of completed assessments, excluding the publisher's own domains and test rows. No target rate is stated; a target invites tuning toward it.

2. **Equal visual treatment.** Every family receives the same quality of presentation. The two paths on a result are two cards of the same size; routing-away destinations are not consolation prizes.

3. **Constraints outrank wall count.** A hard portability, speed, cost or capability constraint removes the integrated product from the page even when several walls are structural. Version 2 asks for the constraint rather than inferring it.

4. **Growth trajectory matters.** A taker with no structural wall but a wall approaching and a growth signal is told the walls are forming, because growth will make them structural.

5. **Solo operator adjustments.** The solo modifiers (applied during scoring, not routing) mean a solo operator is never routed on a wall about a second person.

6. **Absence is not a wall.** A taker who has not started with AI is routed on readiness, never toward a platform.

7. **A truthful zero is always available.** Every wall question includes the answer a well-run business would give, and an escape for the answer none of the options describe. An escape is never counted as a hit; the text is read, and it is how the questions evolve.

8. **Match the recommendation to the substrate, but not past the seam between people.** For a solo coding-agent operator with one wall, the honest tool is gstack. Once a second wall or a second person is in the picture, the honest answer is a system, and the substrate is named as the way to start it alone.

9. **Every tool comes from a signed list.** The page names no tool that is not an approved row in the [register](register.md), which records who made it, when a person last checked it live, and who approved it.
