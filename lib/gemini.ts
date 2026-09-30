import { GoogleGenAI } from "@google/genai";

/**
 * Gemini Client Initializer & Pipeline Orchestration Foundation
 * Track: Trust in a Synthetic World (Google Gemini Hack Days 2026)
 *
 * Gemini plays a central role:
 * 1. Multimodal media understanding (visual context, visible signs, timestamps)
 * 2. Claim decomposition (breaking statements into WHAT, WHERE, WHEN, WHO)
 * 3. Search grounding (retrieving real-world web evidence)
 * 4. Contextual reasoning (detecting temporal, geographic, or event mismatches)
 */

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  // In development, warn the developer rather than hard-crashing during initial setup
  if (process.env.NODE_ENV !== "production") {
    console.warn(
      "[ContextLock Warning] GEMINI_API_KEY environment variable is not set. Add it to .env.local to enable Gemini features."
    );
  }
}

export const ai = apiKey
  ? new GoogleGenAI({ apiKey })
  : (null as unknown as GoogleGenAI);

/**
 * Helper to ensure Gemini client is available before executing calls
 */
export function getGeminiClient(): GoogleGenAI {
  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY is not configured. Please set GEMINI_API_KEY in your .env.local file."
    );
  }
  return ai;
}

/**
 * Primary Gemini model target for multimodal reasoning and search grounding
 */
export const DEFAULT_GEMINI_MODEL = "gemini-2.5-flash";
export const PRO_GEMINI_MODEL = "gemini-2.5-pro";
