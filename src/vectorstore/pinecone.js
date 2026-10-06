import { Pinecone } from "@pinecone-database/pinecone";
import { embeddings } from "../embeddings/embedding.model.js";
import { chunks } from "../splitters/text.splitter.js";
import dotenv from "dotenv";

dotenv.config({
  path: "./src/config/.env",
});

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
});

const pineconeIndex = pinecone.index("company-rules");

console.log("Connected to Pinecone");

const vectors = embeddings.map((embedding, i) => {
  return {
    id: `chunk-${i}`,
    values: embedding,
    metadata: {
      text: chunks[i].pageContent,
    },
  };
});

await pineconeIndex.upsert({
  records: vectors,
});

console.log("Vectors uploaded successfully!");

export { pinecone };
