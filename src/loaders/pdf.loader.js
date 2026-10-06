import path from "node:path";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

const pdfPath = path.join(
  process.cwd(),
  "src",
  "documents",
  "resume_divyanshujains (1).pdf",
);

const loader = new PDFLoader(pdfPath, {
  splitPages: false,
});

const docs = await loader.load();

export { docs };
