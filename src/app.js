import { ragPipeline } from "./rag/rag.pipline.js";

const question = "Whos resume is this ?";

const answer = await ragPipeline(question);

console.log("\nAnswer:\n");
console.log(answer);
