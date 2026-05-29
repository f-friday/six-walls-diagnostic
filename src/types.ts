// Six Walls public diagnostic — type definitions.
//
// These types mirror the structure of six-walls-questions.json and define the
// shapes used by the scoring engine, routing engine, and question loader.
// The JSON is the source of truth; these types make it safe to work with at
// runtime.

// ---------------------------------------------------------------------------
// Question / content types
// ---------------------------------------------------------------------------

export type QuestionType = "single_select"

export type WallKey =
  | "identity"
  | "decision_memory"
  | "attention"
  | "write_back"
  | "governance"
  | "economics"

export type CounterDimension = "portability" | "time_to_value" | "cost_sensitivity"

export type QuestionPurpose = "segmentation" | "baseline" | "friction" | "growth_trajectory"

/** An option on a profile question (value-based, no wall score). */
export interface ProfileOption {
  code: string
  label: string
  value: number
}

/** An option on a wall or scored question. */
export interface ScoredOption {
  code: string
  label: string
  score: number
  wall_inactive?: boolean
}

export interface ProfileQuestion {
  id: string
  text: string
  type: QuestionType
  wall: null
  purpose: QuestionPurpose
  options: ProfileOption[]
}

export interface WallQuestion {
  id: string
  text: string
  type: QuestionType
  wall: WallKey
  wall_number: number
  options: ScoredOption[]
}

export interface CounterDimensionQuestion {
  id: string
  text: string
  type: QuestionType
  counter_dimension: CounterDimension
  options: ScoredOption[]
}

export interface SynthesisQuestion {
  id: string
  text: string
  type: QuestionType
  purpose: QuestionPurpose
  options: ScoredOption[]
}

export type Question =
  | ProfileQuestion
  | WallQuestion
  | CounterDimensionQuestion
  | SynthesisQuestion

export interface Section {
  id: string
  title: string
  questions: Question[]
}

export interface WallMeta {
  number: number
  title: string
  essay_title: string
}

export interface RoutingDestination {
  label: string
  description: string
  cta_primary?: string
  cta_secondary?: string
  url?: string
}

export interface SixWallsContent {
  version: string
  metadata: {
    title: string
    estimated_minutes: number
    question_count: number
    license: string
    author: string
  }
  sections: Section[]
  walls: Record<WallKey, WallMeta>
  routing_destinations: Record<string, RoutingDestination>
}

// ---------------------------------------------------------------------------
// Assessment / scoring types
// ---------------------------------------------------------------------------

/** Map of question_id -> selected option code. */
export type AssessmentAnswers = Record<string, string>

/** Per-wall score on a 0-10 scale. */
export type WallScores = Record<WallKey, number>

/** Per-counter-dimension score on a 0-10 scale. */
export type CounterDimensionScores = Record<CounterDimension, number>

// DIY routes are named by the wall they serve, not by the tool — the recommended
// tool per wall lives in the routing content and is expected to change over time.
export type Route =
  | "STAY_PUT"
  | "DIY_IDENTITY"
  | "DIY_DECISION_MEMORY"
  | "DIY_ATTENTION"
  | "DIY_WRITE_BACK"
  | "DIY_GOVERNANCE"
  | "DIY_ECONOMICS"
  | "APPROACHING_WALLS"
  | "NOT_READY_YET"
  | "FRIDAYOS_FIT"
  | "DIY_WITH_AWARENESS"

export interface AssessmentResult {
  wallScores: WallScores
  counterScores: CounterDimensionScores
  counterScore: number
  compositeWallScore: number
  frictionScore: number
  growthScore: number
  route: Route
  nearestWall: WallKey
  wallsHit: number
}
