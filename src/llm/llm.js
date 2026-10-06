import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config({
  path: "./src/config/.env",
});

const client = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

 
export async function generateanswer(question , context){

    
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
   contents: prompt,
 });

 return response.text;

}

