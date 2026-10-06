import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import {docs} from "../loaders/pdf.loader.js"

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 500,
  chunkOverlap: 50,
});

const chunks = await splitter.splitDocuments(docs);


export { chunks };