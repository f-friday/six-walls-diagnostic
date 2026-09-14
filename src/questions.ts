// Six Walls Diagnostic 2.0.0 — question loader.
//
// Loads the canonical assessment from methodology/questions.json (the source of
// truth) and exposes the lookups the scoring engine uses. Requires a TypeScript
// config with "resolveJsonModule": true (tsx handles this without any config).

import rawContent from "../methodology/questions.json"
import type { Gate, Option, Question, SixWallsContent } from "./types"

const content = rawContent as unknown as SixWallsContent

/** The methodology version the JSON carries, for example "2.0.0". */
export const VERSION: string = content.version
export const TITLE: string = content.metadata.title
export const ESTIMATED_MINUTES: number = content.metadata.estimated_minutes

const QUESTIONS_BY_ID: Map<string, Question> = (() => {
  const map = new Map<string, Question>()
  for (const section of content.sections) {
    for (const question of section.questions) {
      map.set(question.id, question)
    }
  }
  return map
})()

/** The email gate asked before question 1. */
export function gate(): Gate {
  return content.gate
}

/** The eight core questions in order (two about the business, then one per wall). */
export function coreQuestions(): Question[] {
  return content.sections
    .filter((s) => s.id === "profile" || s.id === "walls")
    .flatMap((s) => s.questions)
}

/** The two optional deep-path questions (constraints, trajectory). */
export function deepQuestions(): Question[] {
  return content.sections.filter((s) => s.id === "deep_path").flatMap((s) => s.questions)
}

/** Look up a question by id. Returns undefined if the id is unknown. */
export function getQuestion(id: string): Question | undefined {
  return QUESTIONS_BY_ID.get(id)
}

/** The selected option on a single-select or multi-select question. */
export function optionOf(question: Question, code: string | undefined): Option | undefined {
  if (!code || !question.options) return undefined
  return question.options.find((o) => o.code === code)
}

/** The selected option on one picker of a two-picker question. */
export function pickerOption(
  question: Question,
  pickerId: string,
  code: string | undefined,
): Option | undefined {
  if (!code || !question.pickers) return undefined
  const picker = question.pickers.find((p) => p.id === pickerId)
  return picker?.options.find((o) => o.code === code)
}

/** The key the form stores a question's free-text escape line under. */
export function escapeTextKey(questionId: string): string {
  return `${questionId}__text`
}

/** The full parsed content: gate, questions, wall metadata, outcome families. */
export const sixWallsContent = content
