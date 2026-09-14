// Six Walls Diagnostic 2.0.0 — type definitions.
//
// These types mirror the structure of methodology/questions.json and define the
// shapes used by the question loader and the scoring engine. The JSON is the
// source of truth; these types make it safe to work with at runtime.
// Rulebook: methodology/scoring.md and methodology/routing.md.

// ---------------------------------------------------------------------------
// Walls
// ---------------------------------------------------------------------------

export type WallKey =
  | "identity"
  | "decision_memory"
  | "attention"
  | "write_back"
  | "governance"
  | "economics"

/** The six walls in order, wall 1 to wall 6. */
export const WALL_ORDER: readonly WallKey[] = [
  "identity",
  "decision_memory",
  "attention",
  "write_back",
  "governance",
  "economics",
] as const

/** Plain labels for the six walls. */
export const WALL_LABELS: Record<WallKey, string> = {
  identity: "Identity",
  decision_memory: "Decision Memory",
  attention: "Attention",
  write_back: "Write-Back",
  governance: "Governance",
  economics: "Economics",
}

// ---------------------------------------------------------------------------
// Profile signals
// ---------------------------------------------------------------------------

/** Where the taker works with AI today (question 2). `unknown` covers an
 *  unanswered or escaped setup question. */
export type Cohort =
  | "chat"
  | "workspace"
  | "tools"
  | "own_system"
  | "cli"
  | "none"
  | "unknown"

/** People in the business (question 1, first picker). */
export type People =
  | "one"
  | "two_to_five"
  | "six_to_fifteen"
  | "sixteen_to_fifty"
  | "over_fifty"

/** Of those, how many use AI every week (question 1, second picker). */
export type AiUsers = "just_me" | "a_few" | "most" | "everyone"

// ---------------------------------------------------------------------------
// Results
// ---------------------------------------------------------------------------

/** The four outcome families (routing.md, "The four outcome families"). */
export type Family = "os" | "tool" | "forming" | "fine"

/** Wall state words (scoring.md, "Wall states").
 *  idle: under 3. watch: 3 to under 6. hit: 6 to under 8. breaking: 8 and above. */
export type WallState = "idle" | "watch" | "hit" | "breaking"

export type ConstraintKey = "portability" | "speed" | "cost" | "capability"
export type ConstraintStrength = "stated" | "hard"

export type Substrate = "gstack" | "gbrain"

/**
 * Answers as the form collects them. Single-select questions store the option
 * code; an escape stores the code `none_of_these` plus the taker's line under
 * `<id>__text`. Question 1 stores two codes under `q1_people` and `q1_ai_users`.
 * Question 9 stores an array of constraint codes under `q9_constraints` and the
 * deal-breaker subset under `q9_constraints__hard`.
 */
export type AnswerValue = string | string[]
export type Answers = Record<string, AnswerValue>

export interface WallReading {
  key: WallKey
  /** 0 to 10. An inactive wall reads 0; an escaped wall reads the midpoint 5. */
  score: number
  state: WallState
  /** The wall does not apply (a truthful zero, for example solo and Identity). */
  inactive: boolean
  /** The taker chose "none of these"; never counted as hit. */
  escaped: boolean
}

export interface ConstraintReading {
  key: ConstraintKey
  strength: ConstraintStrength
}

export interface AssessmentResult {
  /** The methodology version the answers were scored against. */
  version: string
  walls: Record<WallKey, WallReading>
  /** Structural walls (score 6 or more, not inactive, not escaped), highest first. */
  hit: WallKey[]
  /** The closest non-structural wall at 3 or more, or null. */
  next: WallKey | null
  family: Family
  cohort: Cohort
  people: People | null
  aiUsers: AiUsers | null
  /** More people in the business than AI users, or trajectory says the team is coming. */
  teamSignal: boolean
  /** Setup answered "not using AI yet": routed on readiness, no tool named. */
  notStarted: boolean
  /** 1 to 8 from question 10, or null when the deep path was not taken. */
  growth: number | null
  constraints: ConstraintReading[]
  /** Any constraint marked as a deal-breaker: every FridayOS mention leaves the page. */
  hardConstraint: boolean
  /** Named only for the coding-agent cohort (routing.md, "The substrate rule"). */
  substrate: Substrate | null
}

// ---------------------------------------------------------------------------
// Shape of methodology/questions.json
// ---------------------------------------------------------------------------

export interface Option {
  code: string
  label: string
  score?: number
  wall_inactive?: boolean
  escape?: boolean
  text_field?: boolean
  cohort?: string
  not_started?: boolean
  constraint?: string | null
  exclusive?: boolean
  growth?: number
  team_signal?: boolean
  free_tier?: boolean
}

export interface Picker {
  id: string
  label: string
  options: Option[]
}

export interface Question {
  id: string
  text: string
  lead_in?: string
  scenario?: string
  type: "single_select" | "two_pickers" | "multi_select_with_dealbreaker"
  wall?: WallKey
  wall_number?: number
  options?: Option[]
  pickers?: Picker[]
  dealbreaker?: { prompt: string; effect: string }
  feeds?: string[]
}

export interface Section {
  id: "profile" | "walls" | "deep_path"
  title: string
  offered?: string
  questions: Question[]
}

export interface Gate {
  position: string
  copy: string
  fields: Array<{ id: string; label: string; required: boolean; autocomplete?: string }>
  consent: { id: string; default: boolean; label: string }
  on_abandon?: string
}

export interface WallMeta {
  number: number
  title: string
  essay_title: string
}

export interface SixWallsContent {
  version: string
  metadata: {
    title: string
    estimated_minutes: number
    question_count: number
    deep_path_question_count: number
    license: string
    author: string
    publisher: string
    notes?: string[]
    supersedes?: string
  }
  gate: Gate
  sections: Section[]
  walls: Record<WallKey, WallMeta>
  outcome_families: Record<Family, string>
  recommendations_source: string
}
