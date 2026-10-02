import { GoogleGenAI } from "@google/genai";
import readline from  'node:readline/promises'
import { pipeline } from "@huggingface/transformers";
import { Pinecone } from "@pinecone-database/pinecone";
import "dotenv/config";

console.log("Pinecone key exists:", !!process.env.PINECONE_API_KEY);
console.log("Pinecone key length:", process.env.PINECONE_API_KEY?.length);

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
});

const index = pinecone.index("company-rules");


  const client = new GoogleGenAI({
    apiKey: "GOOGLE_API_KEY",
  });

  const extractor = await pipeline(
    "feature-extraction",
    "Xenova/all-MiniLM-L6-v2",
  );


export async function chat() {

const rl =  readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

  while(true){

    const question = await rl.question('you: ');
    if(question == 'bye'){
        break;
    }
    
    const output = await extractor(question, {
         pooling: "mean",
         normalize: true,
       });

     const questionEmbedding = Array.from(output.data);

     const result = await index.query({
       vector: questionEmbedding,
       topK: 1,
       includeMetadata: true,
     });

     // 3. Get actual PDF text
    const context = result.matches[0].metadata.text;

  }

    const prompt = `You are a helpful company assistant.

Answer the user's question using the company context below.

Rules:
- Use the context as the primary source for company-related questions.
- Do not invent company rules.
- If the answer is not present in the context, say you could not find it in the available company documents.
- For simple greetings like "hi" or "hello", respond naturally.
- Keep the answer clear, polite, and concise.

Company context:
${context}

User question:
${question}
`;

    const response = await client.models.generateContent({
      model: "gemini-3.8-flash",
      contents : prompt
       });


  console.log("\nAI:", response.text);


rl.close(); 




}

chat();