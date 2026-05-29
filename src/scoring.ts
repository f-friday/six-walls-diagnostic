// Six Walls scoring engine — takes raw assessment answers and computes wall
// scores, counter-dimension scores, friction, growth, and composite metrics.
//
// Design notes:
//   - Wall scores are 0-10. Higher = more painful (bigger wall).
//   - Identity wall averages Q3 + Q4 (two questions for one wall).
//   - Solo/team-size modifiers adjust walls that don't apply to solo operators.
//   - Counter scores are averaged from Q10-Q12. Higher = more resistant to
//     integrated solutions (portability, speed, cost concerns).
//   - Options with wall_inactive=true contribute 0 and mark the wall inactive,
//     but we still compute the score (0) so downstream routing is consistent.

import { getQuestion } from "./questions"
import type {
  AssessmentAnswers,
  AssessmentResult,
  WallKey,
  WallScores,
  CounterDimensionScores,
  Route,
  ScoredOption,
} from "./types"

const ALL_WALLS: WallKey[] = [
  "identity",
  "decision_memory",
  "attention",
  "write_back",
  "governance",
  "economics",
]

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

/** Look up the selected option's score for a scored question. Returns 0 if
 *  the question or option is missing. */
function optionScore(questionId: string, answers: AssessmentAnswers): number {
  const q = getQuestion(questionId)
  if (!q) return 0
  const code = answers[questionId]
  if (!code) return 0
  const opts = q.options as ScoredOption[]
  const match = opts.find((o) => o.code === code)
  return match?.score ?? 0
}

/** Check whether the selected option has wall_inactive set. */
function isWallInactive(questionId: string, answers: AssessmentAnswers): boolean {
  const q = getQuestion(questionId)
  if (!q) return false
  const code = answers[questionId]
  if (!code) return false
  const opts = q.options as ScoredOption[]
  const match = opts.find((o) => o.code === code)
  return match?.wall_inactive === true
}

/** Clamp a number into a [min, max] range. */
function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n))
}

/** Round to two decimal places. */
function round2(n: number): number {
  return Math.round(n * 100) / 100
}

// ---------------------------------------------------------------------------
// Wall scoring
// ---------------------------------------------------------------------------

function computeRawWallScores(answers: AssessmentAnswers): WallScores {
  // Identity: average of Q3 and Q4
  const q3Score = optionScore("q3_identity_sharing", answers)
  const q3Inactive = isWallInactive("q3_identity_sharing", answers)
  const q4Score = optionScore("q4_identity_onboarding", answers)
  const q4Inactive = isWallInactive("q4_identity_onboarding", answers)

  let identityScore: number
  if (q3Inactive && q4Inactive) {
    identityScore = 0
  } else if (q3Inactive) {
    identityScore = q4Score
  } else if (q4Inactive) {
    identityScore = q3Score
  } else {
    identityScore = (q3Score + q4Score) / 2
  }

  // Single-question walls
  const decisionMemory = isWallInactive("q5_decision_memory", answers)
    ? 0
    : optionScore("q5_decision_memory", answers)
  const attention = optionScore("q6_attention", answers)
  const writeBack = optionScore("q7_write_back", answers)
  const governance = isWallInactive("q8_governance", answers)
    ? 0
    : optionScore("q8_governance", answers)
  const economics = isWallInactive("q9_economics", answers)
    ? 0
    : optionScore("q9_economics", answers)

  return {
    identity: identityScore,
    decision_memory: decisionMemory,
    attention,
    write_back: writeBack,
    governance,
    economics,
  }
}

/** Apply team-size modifiers from Q1. Solo operators have certain walls
 *  capped or reduced because they don't face multi-user challenges. */
function applyTeamSizeModifiers(
  raw: WallScores,
  answers: AssessmentAnswers,
): WallScores {
  const teamCode = answers["q1_team_size"]
  if (teamCode !== "solo") return raw

  const modified = { ...raw }

  // Solo: cap Identity wall at 3 (multi-user sharing is irrelevant)
  modified.identity = Math.min(modified.identity, 3)

  // Solo: reduce Governance by 40% (single-user review is less risky)
  modified.governance = round2(modified.governance * 0.6)

  // Solo: cap Economics at 2 if they chose free-tier
  const econCode = answers["q9_economics"]
  if (econCode === "free_tier") {
    modified.economics = Math.min(modified.economics, 2)
  }

  return modified
}

// ---------------------------------------------------------------------------
// Counter-dimension scoring
// ---------------------------------------------------------------------------

function computeCounterScores(answers: AssessmentAnswers): CounterDimensionScores {
  return {
    portability: optionScore("q10_portability", answers),
    time_to_value: optionScore("q11_time_to_value", answers),
    cost_sensitivity: optionScore("q12_cost_sensitivity", answers),
  }
}

// ---------------------------------------------------------------------------
// Route computation
// ---------------------------------------------------------------------------

interface RouteInput {
  compositeWallScore: number
  counterScore: number
  frictionScore: number
  growthScore: number
  nearestWall: WallKey
  wallsHit: number
  notStarted: boolean
}

// Every wall maps to a destination. The four memory walls route to a vetted DIY
// tool; governance routes to an honest "no DIY tool yet" message (platform-class);
// economics routes to a hosted cost tool.
const DIY_WALL_MAP: Record<WallKey, Route> = {
  identity: "DIY_IDENTITY",
  decision_memory: "DIY_DECISION_MEMORY",
  attention: "DIY_ATTENTION",
  write_back: "DIY_WRITE_BACK",
  governance: "DIY_GOVERNANCE",
  economics: "DIY_ECONOMICS",
}

function computeRoute(input: RouteInput): Route {
  const { compositeWallScore, counterScore, frictionScore, growthScore, nearestWall, wallsHit, notStarted } = input

  // Route 0: NOT-STARTED — hasn't operationalized AI yet, so "no system" answers score as
  // maximum wall friction. Absence of a system is not the same as hitting a structural wall;
  // route on readiness, not on inflated wall scores.
  if (notStarted) {
    return growthScore >= 6 ? "APPROACHING_WALLS" : "STAY_PUT"
  }

  // Route 1: STAY_PUT — low walls, no growth signal; the current setup is working.
  if (compositeWallScore <= 4 && wallsHit <= 1 && frictionScore <= 4 && growthScore < 6) {
    return "STAY_PUT"
  }

  // Route 2: DIY specific tool — few walls hit, high counter score
  if (wallsHit <= 2 && counterScore >= 6) {
    return DIY_WALL_MAP[nearestWall]
  }

  // Route 3: NOT_READY_YET — high walls but very high counter resistance
  if (compositeWallScore >= 5 && counterScore >= 7) {
    return "NOT_READY_YET"
  }

  // Route 4: FRIDAYOS_FIT — many walls or high composite, AND no hard counter-dimension blocker.
  // The counterScore < 6 guard keeps the honest commitment: a hard portability/cost/speed
  // constraint routes a taker away even when they're hitting multiple walls.
  if (counterScore < 6 && (wallsHit >= 3 || compositeWallScore >= 6)) {
    return "FRIDAYOS_FIT"
  }

  // Route 5: APPROACHING_WALLS — moderate composite with high growth trajectory
  if (compositeWallScore >= 4 && growthScore >= 6) {
    return "APPROACHING_WALLS"
  }

  // Default
  return "DIY_WITH_AWARENESS"
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export function scoreAssessment(answers: AssessmentAnswers): AssessmentResult {
  // 1. Wall scores
  const rawWalls = computeRawWallScores(answers)
  const wallScores = applyTeamSizeModifiers(rawWalls, answers)

  // Clamp all wall scores to 0-10
  for (const key of ALL_WALLS) {
    wallScores[key] = clamp(round2(wallScores[key]), 0, 10)
  }

  // 2. Counter-dimension scores
  const counterScores = computeCounterScores(answers)
  const counterScore = round2(
    (counterScores.portability +
      counterScores.time_to_value +
      counterScores.cost_sensitivity) / 3,
  )

  // 3. Friction & growth (single-question scores)
  const frictionScore = optionScore("q13_friction", answers)
  const growthScore = optionScore("q14_growth", answers)

  // 4. Composite wall score (equal-weighted average, v1)
  const compositeWallScore = round2(
    ALL_WALLS.reduce((sum, w) => sum + wallScores[w], 0) / ALL_WALLS.length,
  )

  // 5. Nearest wall (highest score) — ties go to the lower-numbered wall
  let nearestWall: WallKey = ALL_WALLS[0]
  let highestScore = wallScores[ALL_WALLS[0]]
  for (const w of ALL_WALLS) {
    if (wallScores[w] > highestScore) {
      highestScore = wallScores[w]
      nearestWall = w
    }
  }

  // 6. Walls hit: count of walls with score >= 6
  const wallsHit = ALL_WALLS.filter((w) => wallScores[w] >= 6).length

  // 6b. Not-started signal: hasn't operationalized AI for business yet.
  const notStarted =
    answers["q2_current_setup"] === "no_ai" || answers["q13_friction"] === "not_started"

  // 7. Route
  const route = computeRoute({
    compositeWallScore,
    counterScore,
    frictionScore,
    growthScore,
    nearestWall,
    wallsHit,
    notStarted,
  })

  return {
    wallScores,
    counterScores,
    counterScore,
    compositeWallScore,
    frictionScore,
    growthScore,
    route,
    nearestWall,
    wallsHit,
  }
}

/** Alias for scoreAssessment — matches the import name used by the UI layer. */
export const computeScores = scoreAssessment
