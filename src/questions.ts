// Six Walls public diagnostic — question loader.
//
// Loads the canonical assessment from methodology/questions.json (the source of
// truth) and exposes a lookup used by the scoring engine. Requires a TypeScript
// config with "resolveJsonModule": true.

import rawContent from "../methodology/questions.json"
import type { Question, SixWallsContent } from "./types"

const content = rawContent as unknown as SixWallsContent

const QUESTIONS_BY_ID: Map<string, Question> = (() => {
  const map = new Map<string, Question>()
  for (const section of content.sections) {
    for (const question of section.questions) {
      map.set(question.id, question)
    }
  }
  return map
})()

/** Look up a question by id. Returns undefined if the id is unknown. */
export function getQuestion(id: string): Question | undefined {
  return QUESTIONS_BY_ID.get(id)
}

/** The full parsed content: questions, wall metadata, and routing destinations. */
export const sixWallsContent = content
