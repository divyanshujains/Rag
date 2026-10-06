import { pipeline } from "@huggingface/transformers";
import { chunks } from "../splitters/text.splitter.js";


const extractor = await pipeline(
  "feature-extraction",
  "Xenova/all-MiniLM-L6-v2",
);      

const embeddings = [];

for (const chunk of chunks) {
  const output = await extractor(chunk.pageContent, {
    pooling: "mean",
    normalize: true,
  });

  embeddings.push(Array.from(output.data));
}

export {embeddings};

