// Six Walls Diagnostic 2.0.0 — hand-scoring check.
//
// Five example people, one per outcome family plus the hard-constraint case,
// scored by the rulebook in methodology/scoring.md and methodology/routing.md.
// If a rule changes, these change with it, deliberately.
//
// Run:  npx tsx src/check.ts
// No dependencies beyond Node and tsx. Exits non-zero on the first failure.

import assert from "node:assert/strict"
import { scoreAssessment, stateOf, topWall } from "./scoring"
import type { Answers } from "./types"

// 1. A homegrown-system operator with a team: 6 to 15 people, a few use AI,
//    works in a coding agent. Identity 7, Decision Memory 8 → two structural
//    walls plus a team signal → "os". Write-Back carries an unknown code on
//    purpose, to check the loader reads it as not applicable rather than pain.
const homegrown: Answers = {
  q1_people: "six_to_fifteen",
  q1_ai_users: "a_few",
  q2_setup: "coding_agent",
  q3_identity: "each_own_ai", // 7
  q4_decision_memory: "in_my_head", // 8
  q5_attention: "big_caught_small_slip", // 4
  q6_write_back: "what_not_why", // unknown code → inactive
  q7_governance: "i_read_everything", // 4
  q8_economics: "roughly_per_tool", // 3
  q10_trajectory: "team_inside",
}

// 2. A solo accountant with one wall: Write-Back 8 is the only structural wall,
//    no team signal → "tool". Identity does not apply while it is just them;
//    Governance 4 × 0.6 = 2.4. Portability is a stated constraint.
const accountant: Answers = {
  q1_people: "one",
  q1_ai_users: "just_me",
  q2_setup: "agents_in_tools",
  q3_identity: "only_one_uses",
  q4_decision_memory: "what_and_why", // 4
  q5_attention: "big_caught_small_slip", // 4
  q6_write_back: "almost_nothing", // 8
  q7_governance: "i_read_everything", // 4 × 0.6 = 2.4
  q8_economics: "bill_not_value", // 5
  q9_constraints: ["leave_with_data"],
}

// 3. The same accountant, but portability is marked as a deal-breaker: the
//    family does not change, and every FridayOS mention leaves the page.
const accountantHard: Answers = { ...accountant, q9_constraints__hard: ["leave_with_data"] }

// 4. A small team approaching the walls: nothing structural, Identity at 5,
//    the team is coming → "forming".
const smallTeam: Answers = {
  q1_people: "two_to_five",
  q1_ai_users: "most",
  q2_setup: "workspace",
  q3_identity: "shared_workspace_scratch", // 5
  q4_decision_memory: "what_and_why", // 4
  q5_attention: "big_caught_small_slip", // 4
  q6_write_back: "most_with_gaps", // 4
  q7_governance: "lookup_only", // inactive
  q8_economics: "free_tiers", // 1
  q10_trajectory: "team_inside",
}

// 5. A solo operator who is fine: every wall answered as a well-run business
//    would, no growth → "fine".
const fine: Answers = {
  q1_people: "one",
  q1_ai_users: "just_me",
  q2_setup: "chat",
  q3_identity: "alone_by_plan",
  q4_decision_memory: "full_trail",
  q5_attention: "caught_and_escalated",
  q6_write_back: "captured_during_work",
  q7_governance: "lookup_only",
  q8_economics: "free_tiers",
}

let passed = 0
function check(name: string, fn: () => void): void {
  fn()
  passed += 1
  console.log(`ok   ${name}`)
}

check("wall states change at 3, 6 and 8", () => {
  assert.equal(stateOf(2.9), "idle")
  assert.equal(stateOf(3), "watch")
  assert.equal(stateOf(6), "hit")
  assert.equal(stateOf(8), "breaking")
})

check("homegrown operator with a team: two structural walls → os, gstack named", () => {
  const r = scoreAssessment(homegrown)
  assert.equal(r.version, "2.0.0")
  assert.deepEqual(r.hit, ["decision_memory", "identity"])
  assert.equal(r.teamSignal, true)
  assert.equal(r.family, "os")
  assert.equal(r.substrate, "gstack")
  assert.equal(r.walls.write_back.inactive, true)
  assert.equal(topWall(r), "decision_memory")
})

check("solo accountant: one structural wall → tool, portability stated", () => {
  const r = scoreAssessment(accountant)
  assert.deepEqual(r.hit, ["write_back"])
  assert.equal(r.family, "tool")
  assert.equal(r.walls.identity.inactive, true)
  assert.equal(r.walls.governance.score, 2.4)
  assert.equal(r.next, "economics")
  assert.deepEqual(r.constraints, [{ key: "portability", strength: "stated" }])
  assert.equal(r.hardConstraint, false)
  assert.equal(r.substrate, null)
})

check("accountant with a deal-breaker: same family, hard constraint", () => {
  const r = scoreAssessment(accountantHard)
  assert.equal(r.family, "tool")
  assert.equal(r.hardConstraint, true)
})

check("the wedge: one structural wall plus more people than AI users → os", () => {
  const r = scoreAssessment({ ...accountant, q1_people: "two_to_five", q1_ai_users: "just_me" })
  assert.equal(r.walls.identity.inactive, false) // 2 to 5 people: Identity scored as answered
  assert.equal(r.teamSignal, true)
  assert.equal(r.family, "os")
})

check("small team, nothing structural, team coming → forming", () => {
  const r = scoreAssessment(smallTeam)
  assert.deepEqual(r.hit, [])
  assert.equal(r.family, "forming")
  assert.equal(r.next, "identity")
})

check("solo operator, low scores, no growth → fine", () => {
  const r = scoreAssessment(fine)
  assert.equal(r.family, "fine")
  assert.equal(r.next, null)
  assert.equal(r.substrate, null)
})

check("not using AI yet routes on readiness and names no substrate", () => {
  const r = scoreAssessment({
    q1_people: "two_to_five",
    q1_ai_users: "just_me",
    q2_setup: "not_yet",
    q3_identity: "each_own_ai",
    q4_decision_memory: "in_my_head",
    q10_trajectory: "multi_step",
  })
  assert.equal(r.notStarted, true)
  assert.equal(r.family, "forming")
  assert.equal(r.substrate, null)
})

check("an escaped wall scores the midpoint and is never counted as hit", () => {
  const r = scoreAssessment({
    ...homegrown,
    q4_decision_memory: "none_of_these",
    q4_decision_memory__text: "we keep it in Slack threads",
  })
  assert.equal(r.walls.decision_memory.escaped, true)
  assert.equal(r.walls.decision_memory.score, 5)
  assert.deepEqual(r.hit, ["identity"])
})

console.log(`\n${passed} checks passed. Five example people score as the rulebook says.`)
