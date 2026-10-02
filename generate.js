import "dotenv/config";

import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { pipeline } from "@huggingface/transformers";
import { Pinecone as PineconeClient } from "@pinecone-database/pinecone";

//load pdf to text
const loader = new PDFLoader("./Company-Rules.pdf", { splitPages: false });

const docs = await loader.load();

// text to chunk

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 500,
  chunkOverlap: 50,
});

const chunks = await splitter.splitDocuments(docs);

console.log("Total chunks:", chunks.length);

// convert chunks to embedding

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


console.log("emebdding length",embeddings.length);


// database integration and embeding uploading

const pinecone = new PineconeClient({
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
console.log("Chunks:", chunks.length);
console.log("Embeddings:", embeddings.length);
console.log("Vectors:", vectors.length);
console.log("First vector:", vectors[0]);


await pineconeIndex.upsert({
  records: vectors,
});

console.log("Vectors uploaded successfully!");


