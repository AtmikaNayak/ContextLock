import "server-only";
import { getGeminiClient, GEMINI_MODELS } from "./gemini";
import {
  MediaObservations,
  MediaObservationsSchema,
  MediaObservationInput,
  AtomicClaim,
} from "@/types";
import { z } from "zod";
import { CLAIM_DECOMPOSITION_PROMPT, createEmptyAtomicClaim } from "./claims";

/**
 * ContextLock Gemini Service Layer
 * Track: Trust in a Synthetic World (Google Gemini Hack Days 2026)
 *
 * Architecture Principles:
 * - Server-only execution (never invoked from client components).
 * - Gemini acts as the multimodal perception and analytical reasoning engine.
 * - OBSERVATIONS ARE SEPARATED FROM CONCLUSIONS:
 *   Gemini identifies observable facts and clues without deciding overall truth.
 * - External evidence retrieval remains a distinct downstream stage.
 */

export const MEDIA_OBSERVATION_SYSTEM_PROMPT = `
You are the objective media perception module for ContextLock, an investigative verification platform.
Your responsibility is strictly to record factual, verifiable visual and audio observations from the provided input.

CRITICAL INSTRUCTIONS:
1. SEPARATE OBSERVATION FROM CONCLUSION:
   - Record ONLY what is directly observable in the media.
   - NEVER declare whether the media is "real", "fake", "authentic", "manipulated", or "verified".
   - Do not claim that an event actually happened or is true simply because it appears in the media.
2. EXTRACT OBJECTIVE CLUES:
   - visibleText: exact transcriptions of visible signs, store names, vehicle plates, banners, captions, watermarks.
   - locationClues: recognizable architecture, road markings, landscape, language on signs, geographic indicators.
   - timeClues: daylight/sun position, shadows, weather, clothing era, vehicle generation, season.
   - notableDetails: notable background elements, physical interactions, camera artifacts, anomalies.
3. OUTPUT FORMAT:
   - Output valid JSON strictly conforming to the requested schema.
`;

export const MEDIA_OBSERVATIONS_JSON_SCHEMA = {
  type: "object",
  properties: {
    observations: {
      type: "array",
      items: { type: "string" },
      description: "Direct factual observations of what is visible or audible in the media",
    },
    visibleText: {
      type: "array",
      items: { type: "string" },
      description: "Transcriptions of any visible text, road signs, storefronts, or banners",
    },
    locationClues: {
      type: "array",
      items: { type: "string" },
      description: "Identifiable geographic clues, architecture, signs, or regional indicators",
    },
    timeClues: {
      type: "array",
      items: { type: "string" },
      description: "Identifiable temporal clues such as daylight, weather, seasonal cues, or era markers",
    },
    notableDetails: {
      type: "array",
      items: { type: "string" },
      description: "Notable specific elements, potential anomalies, artifacts, or distinctive items",
    },
  },
  required: [
    "observations",
    "visibleText",
    "locationClues",
    "timeClues",
    "notableDetails",
  ],
};

/**
 * 1. analyzeMedia()
 * Analyzes multimodal media inputs (or textual descriptions of media)
 * and extracts structured, objective observations without jumping to conclusions.
 */
export async function analyzeMedia(
  input: MediaObservationInput,
  options?: { model?: string; onModelUsed?: (model: string) => void }
): Promise<MediaObservations> {
  const client = getGeminiClient();
  const model = options?.model || GEMINI_MODELS.DEFAULT;

  // Prepare multimodal contents array conforming to @google/genai SDK
  // Supports both inline media parts (base64) and file URIs
  const contents: Array<
    | string
    | { inlineData: { mimeType: string; data: string } }
    | { fileData: { fileUri: string; mimeType?: string } }
  > = [];

  if (input.mediaParts && input.mediaParts.length > 0) {
    for (const part of input.mediaParts) {
      if (part.inlineData) {
        contents.push({
          inlineData: {
            mimeType: part.inlineData.mimeType,
            data: part.inlineData.data,
          },
        });
      } else if (part.fileUri) {
        contents.push({
          fileData: {
            fileUri: part.fileUri,
          },
        });
      }
    }
  }

  const promptText =
    input.textPrompt && input.textPrompt.trim() !== ""
      ? input.textPrompt
      : "Analyze the provided media and extract objective, verifiable observations without forming conclusions.";

  contents.push(promptText);

  let response;
  let activeModel = model;

  try {
    response = await client.models.generateContent({
      model: activeModel,
      contents,
      config: {
        systemInstruction: MEDIA_OBSERVATION_SYSTEM_PROMPT,
        responseMimeType: "application/json",
        responseSchema: MEDIA_OBSERVATIONS_JSON_SCHEMA,
      },
    });
  } catch (err: unknown) {
    const errString = String(err);
    // If primary model encounters high demand (503 / UNAVAILABLE), fall back to FAST model
    if (
      (errString.includes("503") ||
        errString.includes("UNAVAILABLE") ||
        errString.includes("high demand")) &&
      activeModel !== GEMINI_MODELS.FAST
    ) {
      console.warn(
        `[ContextLock] Model ${activeModel} experiencing high demand; falling back to ${GEMINI_MODELS.FAST}.`
      );
      activeModel = GEMINI_MODELS.FAST;
      response = await client.models.generateContent({
        model: activeModel,
        contents,
        config: {
          systemInstruction: MEDIA_OBSERVATION_SYSTEM_PROMPT,
          responseMimeType: "application/json",
          responseSchema: MEDIA_OBSERVATIONS_JSON_SCHEMA,
        },
      });
    } else {
      throw err;
    }
  }

  const rawText = response.text;
  if (!rawText) {
    throw new Error("Gemini returned an empty response.");
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(rawText);
  } catch (err) {
    throw new Error(
      `Failed to parse Gemini response as JSON: ${err instanceof Error ? err.message : String(err)}`
    );
  }

  options?.onModelUsed?.(activeModel);

  // Validate structured shape against Zod schema
  return MediaObservationsSchema.parse(parsed);
}

export const CLAIM_DECOMPOSITION_JSON_SCHEMA = {
  type: "object",
  properties: {
    claims: {
      type: "array",
      items: {
        type: "object",
        properties: {
          type: { type: "string", enum: ["what", "where", "when", "who", "other"] },
          text: { type: "string" },
        },
        required: ["type", "text"],
      },
    },
  },
  required: ["claims"],
};

const GeminiDecompositionSchema = z.object({
  claims: z.array(
    z.object({
      type: z.enum(["what", "where", "when", "who", "other"]),
      text: z.string(),
    })
  ),
});

/**
 * 2. decomposeClaims()
 * Breaks claims into atomic WHAT, WHERE, WHEN, WHO dimensions.
 */
export async function decomposeClaims(
  claimText: string,
  options?: { model?: string; onModelUsed?: (model: string) => void }
): Promise<AtomicClaim[]> {
  const client = getGeminiClient();
  const model = options?.model || GEMINI_MODELS.DEFAULT;

  const promptText = `Decompose the following user claim into independently verifiable atomic claims. Do not invent new facts. Split compound claims if needed. If no factual claim is made, return an empty array.\n\nUSER CLAIM: "${claimText}"`;

  let response;
  let activeModel = model;

  try {
    response = await client.models.generateContent({
      model: activeModel,
      contents: [promptText],
      config: {
        systemInstruction: CLAIM_DECOMPOSITION_PROMPT,
        responseMimeType: "application/json",
        responseSchema: CLAIM_DECOMPOSITION_JSON_SCHEMA,
      },
    });
  } catch (err: unknown) {
    const errString = String(err);
    if (
      (errString.includes("503") ||
        errString.includes("429") ||
        errString.includes("RESOURCE_EXHAUSTED") ||
        errString.includes("UNAVAILABLE") ||
        errString.includes("high demand")) &&
      activeModel !== GEMINI_MODELS.FAST
    ) {
      console.warn(
        `[ContextLock] Model ${activeModel} experiencing high demand; falling back to ${GEMINI_MODELS.FAST}.`
      );
      activeModel = GEMINI_MODELS.FAST;
      response = await client.models.generateContent({
        model: activeModel,
        contents: [promptText],
        config: {
          systemInstruction: CLAIM_DECOMPOSITION_PROMPT,
          responseMimeType: "application/json",
          responseSchema: CLAIM_DECOMPOSITION_JSON_SCHEMA,
        },
      });
    } else {
      throw err;
    }
  }

  const rawText = response.text;
  if (!rawText) {
    throw new Error("Gemini returned an empty response.");
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(rawText);
  } catch (err) {
    throw new Error(
      `Failed to parse Gemini response as JSON: ${err instanceof Error ? err.message : String(err)}`
    );
  }

  options?.onModelUsed?.(activeModel);

  const validated = GeminiDecompositionSchema.parse(parsed);

  return validated.claims.map((c) => createEmptyAtomicClaim(c.type, c.text));
}

/**
 * 4. analyzeEvidence()
 * Foundation stub for comparing retrieved external evidence against atomic claims.
 * Keeps external evidence retrieval strictly separate from Gemini reasoning.
 */
export async function analyzeEvidence(
  claimText: string,
  evidenceSnippet: string
): Promise<{ relationship: "supports" | "contradicts" | "insufficient"; explanation: string }> {
  // Service stub prepared for comparative reasoning
  return {
    relationship: "insufficient",
    explanation: `Comparative analysis between claim ("${claimText.slice(0, 40)}...") and retrieved evidence ("${evidenceSnippet.slice(0, 40)}...") pending pipeline activation.`,
  };
}

/**
 * Test call to verify:
 * Next.js -> Gemini SDK -> Gemini API -> Structured Response
 */
export async function testGeminiConnection(
  samplePrompt?: string
): Promise<{
  success: boolean;
  model: string;
  response: MediaObservations;
  latencyMs: number;
}> {
  const startTime = Date.now();
  const testInput =
    samplePrompt ||
    "A photo depicting urban flooding with multiple submerged cars along a road marked 'Main Street', taken during daylight with 1990s-era vehicles.";

  let executedModel = GEMINI_MODELS.DEFAULT;
  const observations = await analyzeMedia(
    { textPrompt: testInput },
    {
      onModelUsed: (m) => {
        executedModel = m;
      },
    }
  );
  const latencyMs = Date.now() - startTime;

  return {
    success: true,
    model: executedModel,
    response: observations,
    latencyMs,
  };
}
