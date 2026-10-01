import "server-only";
import { GoogleGenAI } from "@google/genai";

/**
 * Gemini Client Initializer & Pipeline Orchestration Foundation
 * Track: Trust in a Synthetic World (Google Gemini Hack Days 2026)
 *
 * Security & Architecture Rules:
 * - Server-only: Never imported into client bundles.
 * - Key Safety: GEMINI_API_KEY is read strictly from process.env and never logged, exposed, or committed.
 * - Architecture: Browser -> Next.js API -> Gemini Server Layer.
 * - Gemini role: Multimodal analysis and reasoning layer, NOT the entire product.
 */

/**
 * Centralized Gemini model configuration.
 * Using currently supported Gemini models for multimodal reasoning and structured outputs.
 */
export const GEMINI_MODELS = {
  // Primary model for multimodal visual reasoning, claim decomposition, and structured analysis
  DEFAULT: process.env.GEMINI_MODEL || "gemini-3.8-flash",
  // Cost-efficient, high-throughput model for lightweight atomic checks
  FAST: "gemini-3.5-flash-lite",
  // Advanced reasoning model for complex cross-source conflict synthesis
  REASONING: "gemini-3.1-pro-preview",
} as const;

export const DEFAULT_GEMINI_MODEL = GEMINI_MODELS.DEFAULT;
export const PRO_GEMINI_MODEL = GEMINI_MODELS.REASONING;
export const FAST_GEMINI_MODEL = GEMINI_MODELS.FAST;

let cachedClient: GoogleGenAI | null = null;

/**
 * Retrieves the server-side Gemini SDK client instance.
 * Throws a sanitized error if the API key is not configured.
 */
export function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey.trim() === "") {
    throw new Error(
      "GEMINI_API_KEY is not configured. Please set GEMINI_API_KEY in your .env.local file."
    );
  }

  if (!cachedClient) {
    cachedClient = new GoogleGenAI({ apiKey });
  }

  return cachedClient;
}

/**
 * Convenient singleton access for server routes.
 * Uses lazy proxy to avoid instantiation until invoked during request lifecycle.
 */
export const ai = new Proxy({} as GoogleGenAI, {
  get(_target, prop) {
    const client = getGeminiClient();
    const value = Reflect.get(client, prop);
    return typeof value === "function" ? value.bind(client) : value;
  },
});
