if (typeof window !== "undefined") {
  throw new Error("Gemini service must never be executed in client-side code.");
}

import { getGeminiClient, GEMINI_MODELS } from "./gemini";
import {
  MediaObservations,
  MediaObservationInput,
  AtomicClaim,
  SyntheticMediaAnalysis,
} from "@/types";
import { z } from "zod";

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
 * Automatically tries Gemini primary, with seamless fallback to Grok.
 */
export async function analyzeMedia(
  input: MediaObservationInput,
  options?: { model?: string; onModelUsed?: (model: string) => void }
): Promise<MediaObservations> {
  const { analyzeMedia: orchestrateMedia } = await import("./ai/provider");
  const result = await orchestrateMedia(input, options);
  options?.onModelUsed?.(`${result.provider}:${result.model}`);
  return result.data;
}

export const SYNTHETIC_ANALYSIS_SYSTEM_PROMPT = `
You are the Synthetic Media Forensics perception engine for ContextLock, an investigative verification platform.
Your task is to inspect the provided image or video frames for observable technical anomalies or indicators characteristic of generative AI synthesis, deepfakes, face swapping, diffusion model artifacts, or digital tampering.

CRITICAL PRINCIPLES:
1. SEPARATE OBSERVATION FROM CONCLUSION:
   - Carefully record specific, observable physical, optical, and anatomical indicators.
   - Differentiate between:
     a) OBSERVATION (e.g., "Irregular pupil geometry and asymmetrical reflections in right eye")
     b) CONCLUSION (e.g., "This image is AI-generated")
   - Do NOT declare absolute or definitive scientific certainty (never state "100% fake", "proven AI", or "definitely authentic").
   - Frame the status strictly as:
     * "synthetic_indicators" (observable anomalies consistent with generative AI / synthetic media are present)
     * "no_strong_indicators" (no obvious generative anomalies or tampering cues detected on visual inspection)
     * "inconclusive" (media quality, heavy compression, low resolution, or ambiguity prevents clear determination)

2. FORENSIC CATEGORIES TO INSPECT:
   - visual_artifact: Unnatural blurring, pixelation boundaries, diffusion melting, repeating texture patterns, edge halos.
   - facial_consistency: Unnatural skin texture (over-smoothed waxy look), blending at hair/ears, irregular teeth/eyes, pupil shape inconsistencies.
   - lighting: Illogical light sources, inconsistent shadow angles, missing contact shadows.
   - geometry: Impossible perspective lines, distorted architectural angles, warped background objects.
   - text: Malformed, gibberish, or pseudoglyphic text rendering common in image generators.
   - reflection: Inconsistent catchlights in eyes, missing or conflicting reflections on wet/shiny surfaces or mirrors.
   - temporal_consistency: (For video) Frame-to-frame warping, morphing, jittering boundaries, identity drift across frames.
   - audio_visual: (If audio present) Desynchronized lip movement, robotic timbre, unnatural cadence.
   - other: Any other distinct physical or digital anomalies.

3. BALANCED EXPLANATION:
   - Provide a measured, objective summary of the analysis explaining why the status and confidence were assigned.
   - If genuine compression or camera artifacts might explain the observation, note that clearly.
`;

export const SYNTHETIC_ANALYSIS_JSON_SCHEMA = {
  type: "object",
  properties: {
    status: {
      type: "string",
      enum: ["synthetic_indicators", "no_strong_indicators", "inconclusive"],
      description: "Forensic assessment category",
    },
    confidence: {
      type: "string",
      enum: ["low", "medium", "high"],
      description: "Confidence level of the assessment based on visual clarity and signal strength",
    },
    indicators: {
      type: "array",
      items: {
        type: "object",
        properties: {
          category: {
            type: "string",
            enum: [
              "visual_artifact",
              "facial_consistency",
              "lighting",
              "geometry",
              "text",
              "reflection",
              "temporal_consistency",
              "audio_visual",
              "other",
            ],
          },
          observation: { type: "string" },
          severity: { type: "string", enum: ["low", "medium", "high"] },
        },
        required: ["category", "observation", "severity"],
      },
      description: "List of observable forensic clues or anomalies detected",
    },
    explanation: {
      type: "string",
      description: "Objective explanation of the forensic analysis",
    },
  },
  required: ["status", "confidence", "indicators", "explanation"],
};

/**
 * analyzeSyntheticMedia()
 * Performs AI-assisted forensic inspection of media for synthetic / AI-generation indicators.
 * Automatically tries Gemini primary, with seamless fallback to Grok.
 */
export async function analyzeSyntheticMedia(
  input: MediaObservationInput,
  options?: { model?: string; onModelUsed?: (model: string) => void }
): Promise<SyntheticMediaAnalysis> {
  const { analyzeSyntheticMedia: orchestrateSynthetic } = await import("./ai/provider");
  const result = await orchestrateSynthetic(input, options);
  options?.onModelUsed?.(`${result.provider}:${result.model}`);
  return result.data;
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



/**
 * 2. decomposeClaims()
 * Breaks claims into atomic WHAT, WHERE, WHEN, WHO dimensions.
 * Automatically tries Gemini primary, with seamless fallback to Grok.
 */
export async function decomposeClaims(
  claimText: string,
  options?: { model?: string; onModelUsed?: (model: string) => void }
): Promise<AtomicClaim[]> {
  const { decomposeClaims: orchestrateDecomp } = await import("./ai/provider");
  const result = await orchestrateDecomp(claimText, options);
  options?.onModelUsed?.(`${result.provider}:${result.model}`);
  return result.data;
}


/**
 * 3. retrieveEvidence()
 * Retrieves external evidence using Gemini's Google Search grounding.
 */
export async function retrieveEvidence(
  targetClaim: AtomicClaim,
  contextClaims: AtomicClaim[],
  options?: { model?: string; onModelUsed?: (model: string) => void }
): Promise<import("@/types").EvidenceSource[]> {
  const client = getGeminiClient();
  const model = options?.model || GEMINI_MODELS.DEFAULT;

  // Build the search intent using the target claim and relevant context
  const contextStr = contextClaims.length > 0
    ? `\nContext: ${contextClaims.map(c => c.claimText).join(" | ")}`
    : "";

  const promptText = `Find factual reports or news related to this claim:\nClaim: "${targetClaim.claimText}"${contextStr}`;

  let response;
  let activeModel = model;
  const maxRetries = 3;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      response = await client.models.generateContent({
        model: activeModel,
        contents: [promptText],
        config: {
          tools: [{ googleSearch: {} }],
          systemInstruction: "You are an investigative evidence retrieval agent. Using Google Search, find sources that are directly relevant to the user's claim and context. Summarize the findings briefly, but prioritize providing high quality search grounding. Return the most relevant facts.",
        },
      });
      break;
    } catch (err: unknown) {
      const errString = String(err);
      const isRateLimitOrDemand =
        errString.includes("429") ||
        errString.includes("503") ||
        errString.includes("RESOURCE_EXHAUSTED") ||
        errString.includes("UNAVAILABLE") ||
        errString.includes("high demand");

      if (isRateLimitOrDemand) {
        if (activeModel !== GEMINI_MODELS.FAST) {
          console.warn(`[ContextLock] Model ${activeModel} experiencing high demand; falling back to ${GEMINI_MODELS.FAST}.`);
          activeModel = GEMINI_MODELS.FAST;
        }
        if (attempt < maxRetries) {
          const delay = Math.pow(2, attempt) * 1000;
          await new Promise(r => setTimeout(r, delay));
          continue;
        }
      }
      throw err;
    }
  }

  if (!response || !response.candidates || response.candidates.length === 0) {
    return [];
  }

  options?.onModelUsed?.(activeModel);

  // Extract grounding metadata safely
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const metadata = response.candidates[0].groundingMetadata as any;
  const sources: import("@/types").EvidenceSource[] = [];

  if (metadata && metadata.groundingChunks) {
    const urlsSeen = new Set<string>();
    let idCounter = 1;

    for (const chunk of metadata.groundingChunks) {
      if (chunk.web && chunk.web.uri) {
        const uri = chunk.web.uri;
        if (!urlsSeen.has(uri)) {
          urlsSeen.add(uri);
          
          let domain = "web";
          try {
            domain = new URL(uri).hostname;
          } catch {
            // fallback
          }
          
          sources.push({
            id: `ev-${Date.now()}-${idCounter++}`,
            title: chunk.web.title || "Web Source",
            url: uri,
            source: domain,
            snippet: "Retrieved from Google Search", 
            relationship: "context", // Neutral default, reasoning happens in Phase 6
          });
        }
      }
    }
  }

  return sources;
}

export const REASONING_JSON_SCHEMA = {
  type: "object",
  properties: {
    status: { type: "string", enum: ["supported", "contradicted", "insufficient"] },
    explanation: { type: "string" },
    evidenceRelationships: {
      type: "array",
      items: {
        type: "object",
        properties: {
          evidenceId: { type: "string" },
          relationship: { type: "string", enum: ["supports", "contradicts", "context", "unrelated"] }
        },
        required: ["evidenceId", "relationship"]
      }
    }
  },
  required: ["status", "explanation", "evidenceRelationships"]
};

export const ReasoningResultSchema = z.object({
  status: z.enum(["supported", "contradicted", "insufficient"]),
  explanation: z.string(),
  evidenceRelationships: z.array(z.object({
    evidenceId: z.string(),
    relationship: z.enum(["supports", "contradicts", "context", "unrelated"])
  }))
});

/**
 * 4. analyzeEvidence()
 * Evaluates the relationship between an atomic claim and retrieved evidence.
 * Automatically tries Gemini primary, with seamless fallback to Grok.
 */
export async function analyzeEvidence(
  claim: AtomicClaim,
  evidence: import("@/types").EvidenceSource[],
  relatedClaims: AtomicClaim[] = []
): Promise<z.infer<typeof ReasoningResultSchema>> {
  const { analyzeEvidence: orchestrateReasoning } = await import("./ai/provider");
  const result = await orchestrateReasoning(claim, evidence, relatedClaims);
  return result.data;
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
