import { retrieve } from "../reterivals/reterival.js";

import { generateanswer } from "../llm/llm.js";

export async function ragPipeline(question) {
  // 1. Retrieve relevant chunks
  const context = await retrieve(question);

  // 2. Send question + context to LLM
  const answer = await generateanswer(question, context);

  return answer;
}