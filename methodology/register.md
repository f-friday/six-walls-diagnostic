# Approved Recommendations Register

**What this is.** The single list of every outside tool the Six Walls Diagnostic is allowed to name. The results page reads from this list and from nothing else. If a tool is not on this page with the status *approved*, it does not appear in front of a taker.

**Why it is published.** The routing in [`routing.md`](routing.md) is open so anyone can audit where a taker is sent. The list of places a taker can be sent to should be just as auditable: who made each tool, when a person last checked it, and who approved it.

Every tool on this page was **checked live on 2026-09-11** and the rows were **signed on 2026-09-12** by Fred Butson.

## The rule for getting on this page

1. **It solves one named wall on its own, or it is the honest substrate for a named cohort.** A tool that "helps with AI generally" does not qualify.
2. **It is live and maintained.** Checked by a person within the last 90 days: the link resolves, the repository or product has moved in the last quarter, and nothing on its page contradicts the sentence we say about it. The May 2026 refresh retired Khoj and OpenMemory on exactly this test.
3. **We would send a friend there.** The recommendation has to be genuinely good for the taker, not a placeholder that makes FridayOS look better by comparison.
4. **Goodwill is a tiebreaker, never the reason.** Where two tools solve a wall equally well, we may prefer the one whose author we would like to acknowledge. Where only one tool solves the wall well, we name it whoever wrote it.
5. **Every row carries who approved it and when.** A row with no approver is a candidate, not a recommendation.

General-purpose productivity tools (Notion, ClickUp, Coda and the like) stay out: whatever fills a gap has to solve a wall.

## Statuses

| Status | Meaning |
|---|---|
| **approved** | Signed for version 2. The page may show it. |
| **carried** | On the live page from an earlier version, re-checked, awaiting sign-off. No row holds this status today; it stays defined for the next time a tool is swapped. |
| **candidate** | Proposed, not yet researched to the standard above. Never shown. |
| **gap** | A wall or cohort with no tool we would put our name on. Shown to the taker as exactly that. |
| **retired** | Was recommended once; failed a check. Kept here so it is not re-added by accident. |

A swap re-enters through *carried* and needs a fresh signature. A row changes here first and in the code second; a tool cannot be approved in code alone.

## Per-wall tools (one per wall, whatever the taker's path)

| # | Tool | Wall | Who it is right for | Maker | Needs someone technical? | Hosted? | Free or nearly? | Last checked live | Status |
|---|---|---|---|---|---|---|---|---|---|
| R1 | **Open Brain (OB1)** — [github.com/NateBJones-Projects/OB1](https://github.com/NateBJones-Projects/OB1) | Identity | A person or small team that wants Claude, ChatGPT and other tools working from one shared picture of the business, and can spend about 45 minutes on setup | Nate Jones | yes | no | yes | 2026-09-11: pushed the same day, about 4,600 stars, licence not declared in the repository metadata | **approved** (Fred Butson, 2026-09-12) |
| R2 | **Obsidian + Claude** — [obsidian.md](https://obsidian.md), connected through the Obsidian Local REST API plugin | Decision Memory | Someone who already writes things down and wants the decision log, with its reasoning, readable by their AI | Obsidian (Dynalist Inc.) | yes | no | yes | 2026-09-11: product live, no notices | **approved** (Fred Butson, 2026-09-12) |
| R3 | **NotebookLM**, now labelled **Gemini Notebook** — [notebooklm.google](https://notebooklm.google), which redirects to notebook.google | Attention | Someone who wants to ask questions of their own documents with nothing to install and no cost | Google | no | yes | yes | 2026-09-11: redirects to the renamed product; same product | **approved** (Fred Butson, 2026-09-12) |
| R4 | **basic-memory** — [basicmemory.com](https://basicmemory.com) | Write-Back | Someone who wants their AI to write what it learns into plain Markdown files they own; free and local, or hosted; now has a team mode | Basic Machines | no | yes | yes | 2026-09-11: repository pushed 2026-09-10, about 3,900 stars, AGPL-3.0, team mode live | **approved** (Fred Butson, 2026-09-12) |
| R5 | *(none)* | Governance | — | — | — | — | — | 2026-09-11 re-check agreed with the May 2026 finding | **gap** (confirmed by Fred Butson, 2026-09-12); see below |
| R6 | **OpenRouter** — [openrouter.ai](https://openrouter.ai) | Economics | Someone who wants spend per model and per workflow on one dashboard, with alerts, and nothing to run | OpenRouter | no | yes | yes | 2026-09-11: live, no notices | **approved** (Fred Butson, 2026-09-12) |

The "needs someone technical", "hosted" and "free or nearly" columns are what the constraint rule in [`routing.md`](routing.md) reads: a stated no-technical-help constraint removes R1 and R2 from the lead position; a stated speed constraint leads with a hosted tool; a stated cost constraint leads with a free-or-nearly one.

## Substrates (named only for a cohort, under the substrate rule)

| # | Tool | Cohort | Who it is right for | Maker | Last checked live | Status |
|---|---|---|---|---|---|---|
| R7 | **gstack** — [github.com/garrytan/gstack](https://github.com/garrytan/gstack) | Works in a coding agent (Claude Code, Codex, Cursor and others) | A **solo** operator with **one** wall hitting and no team signal. A coding-agent operator with two or more walls, or with more people in the business than AI users, is routed to a personal FridayOS instead, with gstack named as the way to start alone | Garry Tan | 2026-09-11: pushed the same day, about 132,000 stars, MIT | **approved** (Fred Butson, 2026-09-12) |
| R8 | **gbrain** — [github.com/garrytan/gbrain](https://github.com/garrytan/gbrain) | Runs an agent runtime (OpenClaw, Hermes and similar) | A solo operator who already runs agents and wants a memory layer for them; same rule as R7 | Garry Tan | 2026-09-11: pushed the same day, about 29,800 stars, MIT | **approved** (Fred Butson, 2026-09-12) |

## The Governance gap

No standalone tool for review-before-action meets the rule above, and we will not name one that does not. The May 2026 refresh found no tool; the 2026-09-11 re-check agreed. What exists today is a review switch **inside** the platforms people already use (for example a human-in-the-loop step in an automation tool, a review-before-sending setting in a CRM, or roles in a team AI workspace), and inside gstack and gbrain for their own cohorts. The Governance card on a result says this in words, as a move rather than a tool, and names nothing.

## Retired

| Tool | Was | Why it is here |
|---|---|---|
| Khoj | Attention (version 1.0 and 1.1) | Retired in the May 2026 refresh: cloud service sunset, team pivoting |
| OpenMemory | Write-Back (version 1.0 and 1.1) | Retired in the May 2026 refresh: sunset notice in its own repository, developer-only |

## Named, not recommended

The "broader landscape" paragraph in the [README](../README.md) names Logseq, mem0, Letta, OpenClaw, Hermes and OpenHands for category context. None maps to a single wall, so none is click-routed, and the paragraph is not a second approved list.

## How the published routes map to this register

For readers of version 1.x, the thirteen routes that named a destination map to the rows above:

| Version 1 route | Destination | Register row |
|---|---|---|
| `DIY_IDENTITY` | Open Brain | R1 |
| `DIY_DECISION_MEMORY` | Obsidian + Claude | R2 |
| `DIY_ATTENTION` | NotebookLM | R3 |
| `DIY_WRITE_BACK` | basic-memory | R4 |
| `DIY_GOVERNANCE` | "No DIY tool — honest watch-this-wall message" | R5 (gap) |
| `DIY_ECONOMICS` | OpenRouter | R6 |
| `SUBSTRATE_GSTACK` | gstack | R7 |
| `SUBSTRATE_AGENT_BRAIN` | agent-brain layer | R8 (gbrain; memory-os, named beside it in 1.3.0, is no longer recommended) |

Two things version 1 said that this register carries forward: routes are named by the wall they serve, not by the tool, so swapping a tool never touches the engine; and every tool is vetted for active maintenance and real adoption, which is rule 2 above.

## Sign-off

| Signed by | Date | Rows approved | Notes |
|---|---|---|---|
| Fred Butson | 2026-09-12 | R1, R2, R3, R4, R6, R7, R8 (all seven tools); R5 confirmed as a gap | Any later swap re-enters through *carried* and needs a fresh signature. |
