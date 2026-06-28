import { generateText } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: resolve(__dirname, '.env.local') });

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY
});

async function testModel(modelName) {
  try {
    const result = await generateText({
      model: google(modelName),
      prompt: 'say hi',
    });
    console.log(`Success with ${modelName}:`, result.text);
  } catch (error) {
    console.error(`Error with ${modelName}:`, error.message);
  }
}

async function main() {
  await testModel('gemini-3.5-flash');
  await testModel('gemini-flash-latest');
  await testModel('gemini-2.5-flash-lite');
}

main();
