import { GoogleGenAI } from "@google/genai";
import { z } from "zod";

let ai: GoogleGenAI | null = null;

/**
 * Helper to ensure Gemini client is available before executing calls
 */
export function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY is not configured. Please set GEMINI_API_KEY in your .env.local file."
    );
  }
  if (!ai) {
    ai = new GoogleGenAI({ apiKey });
  }
  return ai;
}

/**
 * Primary Gemini model target for multimodal reasoning and search grounding
 */
export const DEFAULT_GEMINI_MODEL = "gemini-3.8-flash";
export const PRO_GEMINI_MODEL = "gemini-3.1-pro-preview";

export interface StructuredParams<T> {
  prompt: string;
  schema: z.ZodSchema<T>;
  jsonSchema?: Record<string, any>;
  model?: string;
  maxRetries?: number;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Reusable helper to request structured JSON output from Gemini and validate it with Zod.
 */
export async function generateStructured<T>({
  prompt,
  schema,
  jsonSchema,
  model = DEFAULT_GEMINI_MODEL,
  maxRetries = 3,
}: StructuredParams<T>): Promise<T> {
  const client = getGeminiClient();
  
  let interaction;
  let lastError: any;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      interaction = await client.interactions.create({
        model,
        input: prompt,
        response_format: {
          type: 'text',
          mime_type: 'application/json',
          ...(jsonSchema && { schema: jsonSchema })
        },
      });
      break; // Success
    } catch (error: any) {
      lastError = error;
      const isRateLimit = error.message && (error.message.includes("429") || error.message.includes("503"));
      
      if (isRateLimit && attempt < maxRetries) {
        const delay = Math.pow(2, attempt) * 1000;
        console.warn(`[Gemini API] Rate limit or high demand (503/429). Retrying in ${delay}ms... (Attempt ${attempt}/${maxRetries})`);
        await sleep(delay);
        continue;
      }
      
      console.error("Gemini API call failed:", error);
      throw new Error(`Gemini API failure: ${error.message || "Unknown error"}`);
    }
  }

  if (!interaction) {
    throw new Error(`Gemini API failed after ${maxRetries} attempts. Last error: ${lastError?.message}`);
  }

  const output = interaction.output_text;
  if (!output) {
    throw new Error("Empty response received from Gemini.");
  }

  let parsedJson: any;
  try {
    parsedJson = JSON.parse(output);
  } catch (e) {
    console.error("Gemini output is not valid JSON:", output);
    throw new Error("Failed to parse Gemini output as JSON.");
  }

  const validationResult = schema.safeParse(parsedJson);
  if (!validationResult.success) {
    console.error("Zod validation failed against Gemini output:", validationResult.error);
    throw new Error(`Schema validation failed: ${validationResult.error.message}`);
  }

  return validationResult.data;
}
