import { createGoogleGenerativeAI } from "@ai-sdk/google";
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: resolve(__dirname, '.env.local') });

async function listModels() {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY;
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
  
  try {
    const res = await fetch(url);
    const data = await res.json();
    console.log("Supported Models:");
    if (data.models) {
      data.models.forEach(m => console.log(m.name, m.supportedGenerationMethods));
    } else {
      console.log("Error or no models:", data);
    }
  } catch(e) {
    console.error(e);
  }
}

listModels();
