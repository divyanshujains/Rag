import { pipeline } from "@huggingface/transformers";
import { pinecone } from "../vectorstore/pinecone.js";

const extractor = await pipeline(
  "feature-extraction",
  "Xenova/all-MiniLM-L6-v2",
);

const index = pinecone.index("company-rules");

export async function retrieve(question) {
  // 1. Convert question into embedding
  const output = await extractor(question, {
    pooling: "mean",
    normalize: true,
  });

  const questionEmbedding = Array.from(output.data);

  // 2. Search Pinecone
  const result = await index.query({
    vector: questionEmbedding,
    topK: 2,
    includeMetadata: true,
  });

  // 3. Extract text from matching chunks
  const context = result.matches.map((match) => match.metadata.text);

  return context;
}
