// Six Walls Diagnostic 2.0.0 — scoring and routing engine.
//
// A person can apply methodology/scoring.md and methodology/routing.md by hand
// and get the same answer this file gives; src/check.ts holds the five example
// people to that standard.
//
// Design notes:
//   - Wall scores are 0 to 10. Higher means more pain (a bigger wall).
//   - Each wall is one question. The chosen option's score is the wall score.
//   - An option with wall_inactive reads 0 and marks the wall inactive.
//   - An escape ("none of these") reads the midpoint 5, is marked escaped, and
//     never counts as hit.
//   - Solo modifiers: Identity does not apply while it is just you; Governance
//     is multiplied by 0.6; Economics is capped at 2 on free tiers.
//   - Routing is four outcome families, decided by how many walls are
//     structural (6 or more) and by the team signal. Constraints never make a
//     family; they change what leads inside one.

import { VERSION, getQuestion, optionOf, pickerOption } from "./questions"
import { WALL_ORDER } from "./types"
import type {
  AiUsers,
  Answers,
  AssessmentResult,
  Cohort,
  ConstraintKey,
  ConstraintReading,
  Family,
  People,
  Substrate,
  WallKey,
  WallReading,
  WallState,
} from "./types"

/** A wall is structural at this score or above. */
export const STRUCTURAL = 6
/** An escaped wall reads the midpoint. */
export const ESCAPE_SCORE = 5

const WALL_QUESTION: Record<WallKey, string> = {
  identity: "q3_identity",
  decision_memory: "q4_decision_memory",
  attention: "q5_attention",
  write_back: "q6_write_back",
  governance: "q7_governance",
  economics: "q8_economics",
}

const COHORTS: readonly Cohort[] = ["chat", "workspace", "tools", "own_system", "cli", "none"]
const PEOPLE: readonly People[] = ["one", "two_to_five", "six_to_fifteen", "sixteen_to_fifty", "over_fifty"]
const AI_USERS: readonly AiUsers[] = ["just_me", "a_few", "most", "everyone"]
const CONSTRAINTS: readonly ConstraintKey[] = ["portability", "speed", "cost", "capability"]

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

function str(v: string | string[] | undefined): string | undefined {
  return typeof v === "string" ? v : undefined
}

function list(v: string | string[] | undefined): string[] {
  return Array.isArray(v) ? v : []
}

/** Round to two decimal places. */
function round2(n: number): number {
  return Math.round(n * 100) / 100
}

/** Wall state from a score (scoring.md, "Wall states"). */
export function stateOf(score: number): WallState {
  if (score < 3) return "idle"
  if (score < STRUCTURAL) return "watch"
  if (score < 8) return "hit"
  return "breaking"
}

// ---------------------------------------------------------------------------
// Wall scoring (scoring.md, "Wall scores" and "Solo and small-team modifiers")
// ---------------------------------------------------------------------------

function readWalls(answers: Answers, people: People | null): Record<WallKey, WallReading> {
  const out = {} as Record<WallKey, WallReading>
  const solo = people === "one"
  const freeTier = str(answers["q8_economics"]) === "free_tiers"

  for (const key of WALL_ORDER) {
    const q = getQuestion(WALL_QUESTION[key])
    const code = str(answers[WALL_QUESTION[key]])
    const opt = q ? optionOf(q, code) : undefined

    let score = 0
    let inactive = false
    let escaped = false

    if (!opt) {
      inactive = true // unanswered reads as not applicable, never as pain
    } else if (opt.escape) {
      score = ESCAPE_SCORE
      escaped = true
    } else if (opt.wall_inactive) {
      inactive = true
    } else {
      score = opt.score ?? 0
    }

    // Solo modifiers: Identity does not apply while it is just you; Governance
    // carries less organisational risk; free tiers cap Economics.
    if (solo && key === "identity") {
      score = 0
      inactive = true
      escaped = false
    }
    if (solo && key === "governance" && !inactive && !escaped) score = round2(score * 0.6)
    if (solo && key === "economics" && freeTier) score = Math.min(score, 2)

    out[key] = { key, score, state: stateOf(score), inactive, escaped }
  }
  return out
}

// ---------------------------------------------------------------------------
// Constraints (routing.md, "Constraints")
// ---------------------------------------------------------------------------

function readConstraints(answers: Answers): ConstraintReading[] {
  const q = getQuestion("q9_constraints")
  const ticked = list(answers["q9_constraints"])
  const hard = new Set(list(answers["q9_constraints__hard"]))
  const out: ConstraintReading[] = []
  for (const code of ticked) {
    const opt = q ? optionOf(q, code) : undefined
    const key = opt?.constraint as ConstraintKey | undefined | null
    if (!key || !CONSTRAINTS.includes(key)) continue
    out.push({ key, strength: hard.has(code) ? "hard" : "stated" })
  }
  return out
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export function scoreAssessment(answers: Answers): AssessmentResult {
  // 1. Profile: people, AI users, cohort, not-started.
  const q1 = getQuestion("q1_scale")
  const peopleCode = str(answers["q1_people"])
  const aiCode = str(answers["q1_ai_users"])
  const people =
    q1 && pickerOption(q1, "people", peopleCode) && PEOPLE.includes(peopleCode as People)
      ? (peopleCode as People)
      : null
  const aiUsers =
    q1 && pickerOption(q1, "ai_users", aiCode) && AI_USERS.includes(aiCode as AiUsers)
      ? (aiCode as AiUsers)
      : null

  const q2 = getQuestion("q2_setup")
  const setupOpt = q2 ? optionOf(q2, str(answers["q2_setup"])) : undefined
  const cohortRaw = setupOpt?.cohort as Cohort | undefined
  const cohort: Cohort = cohortRaw && COHORTS.includes(cohortRaw) ? cohortRaw : "unknown"
  const notStarted = setupOpt?.not_started === true

  // 2. Trajectory (deep path, optional).
  const q10 = getQuestion("q10_trajectory")
  const trajectory = q10 ? optionOf(q10, str(answers["q10_trajectory"])) : undefined
  const growth = trajectory?.growth ?? null

  // 3. Wall scores.
  const walls = readWalls(answers, people)
  const byScore = (a: WallKey, b: WallKey) => walls[b].score - walls[a].score
  const structural = (w: WallReading) => w.score >= STRUCTURAL && !w.inactive && !w.escaped

  const hit = WALL_ORDER.filter((k) => structural(walls[k])).sort(byScore)
  const nextCandidates = WALL_ORDER.filter(
    (k) => !structural(walls[k]) && !walls[k].inactive && !walls[k].escaped && walls[k].score >= 3,
  ).sort(byScore)
  const next = nextCandidates[0] ?? null

  // 4. The team signal: more people in the business than AI users, or the
  //    trajectory answer says the team is coming.
  const teamSignal =
    (people !== null && people !== "one" && aiUsers !== null && aiUsers !== "everyone") ||
    trajectory?.team_signal === true

  // 5. Family (routing.md, "The not-started pre-check" and "The four outcome families").
  let family: Family
  if (notStarted) {
    family = growth !== null && growth >= 8 ? "forming" : "fine"
  } else if (hit.length >= 2 || (hit.length === 1 && teamSignal)) {
    family = "os"
  } else if (hit.length === 1) {
    family = "tool"
  } else if (next !== null && ((growth !== null && growth >= 6) || teamSignal)) {
    family = "forming"
  } else {
    family = "fine"
  }

  // 6. Constraints: stated or hard. Hard removes every FridayOS mention.
  const constraints = readConstraints(answers)
  const hardConstraint = constraints.some((c) => c.strength === "hard")

  // 7. The substrate rule: gstack is named for the coding-agent cohort in the
  //    tool and os families. gbrain is named only when a person reads an
  //    agent-runtime signal in the setup or escape text, which the form does
  //    not carry as a code, so the engine never sets it.
  const substrate: Substrate | null =
    cohort === "cli" && !notStarted && (family === "tool" || family === "os") ? "gstack" : null

  return {
    version: VERSION,
    walls,
    hit,
    next,
    family,
    cohort,
    people,
    aiUsers,
    teamSignal,
    notStarted,
    growth,
    constraints,
    hardConstraint,
    substrate,
  }
}

/** The wall whose move leads the ninety-day plan: top hit, else next, else the highest. */
export function topWall(result: AssessmentResult): WallKey | null {
  if (result.hit[0]) return result.hit[0]
  if (result.next) return result.next
  const ranked = WALL_ORDER.filter((k) => !result.walls[k].inactive).sort(
    (a, b) => result.walls[b].score - result.walls[a].score,
  )
  return ranked[0] ?? null
}

/** Alias kept from 1.x for callers that import this name. */
export const computeScores = scoreAssessment
