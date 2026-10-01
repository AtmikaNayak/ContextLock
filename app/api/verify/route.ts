import { NextRequest, NextResponse } from "next/server";
import { VerifyRequestSchema, VerificationResult } from "@/types";
import { DEFAULT_GEMINI_MODEL } from "@/lib/gemini";

/**
 * ContextLock Verification API Route
 * POST /api/verify
 *
 * Current Phase: Initial Foundation & Mock Contract
 * Next Phase: Integration with Google Gemini Multimodal Analysis + Google Search Grounding Pipeline
 *
 * The eventual pipeline executed here will be:
 * 1. Multimodal media analysis via Gemini (analyze video/image for visual cues, OCR, timestamps)
 * 2. Claim decomposition (extract atomic WHAT, WHERE, WHEN, WHO claims)
 * 3. Evidence retrieval via Gemini Google Search grounding
 * 4. Claim <-> Evidence comparative reasoning
 * 5. Structured context verification report generation (Supported / Contradicted / Insufficient)
 */

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // 1. Runtime validation with Zod
    const validationResult = VerifyRequestSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Invalid verification request payload",
          details: validationResult.error.format(),
        },
        { status: 400 }
      );
    }

    const { media, claim } = validationResult.data;

    // 2. Foundation mock response demonstrating the claim-level verification schema
    // Note: This contract serves as the target structure for the real Gemini pipeline
    const mockVerificationResult: VerificationResult = {
      id: `verif-${Date.now()}`,
      timestamp: new Date().toISOString(),
      media: media || {
        type: "image",
        fileName: "unnamed-media.jpg",
      },
      claim: {
        rawText: claim.rawText,
        sourcePlatform: claim.sourcePlatform || "Social Media / Messaging",
        claimedDate: claim.claimedDate,
        claimedLocation: claim.claimedLocation,
      },
      // Example context mismatch: genuine footage used with misleading temporal claim
      contextStatus: "temporal_mismatch",
      summaryExplanation:
        "The media depicts genuine flooding, but evidence confirms this footage was captured in August 2023, directly contradicting the claim that it depicts today's events.",
      atomicClaims: [
        {
          id: "claim-what-001",
          type: "what",
          claimText: "Massive urban flooding with submerged vehicles",
          status: "supported",
          confidenceScore: 0.94,
          explanation:
            "Visual examination and archival reports confirm severe waterlogging and submerged vehicles in the media.",
          evidenceIds: ["ev-01"],
        },
        {
          id: "claim-where-002",
          type: "where",
          claimText: "Mangalore city center (Kottara Chowki)",
          status: "supported",
          confidenceScore: 0.89,
          explanation:
            "Identified landmarks, commercial signboards, and local geography match Kottara Chowki, Mangalore.",
          evidenceIds: ["ev-01", "ev-02"],
        },
        {
          id: "claim-when-003",
          type: "when",
          claimText: "Occurring today / current incident",
          status: "contradicted",
          confidenceScore: 0.96,
          explanation:
            "Weather monitoring and archival records show this exact footage was first broadcasted on August 14, 2023. Current weather in Mangalore indicates dry conditions.",
          evidenceIds: ["ev-02", "ev-03"],
        },
      ],
      evidence: [
        {
          id: "ev-01",
          title: "Monsoon Inundation in Kottara Chowki: Local Report",
          url: "https://example.com/news/mangalore-floods-august-2023",
          source: "Coastal News Bureau",
          publishedDate: "2023-08-14",
          snippet:
            "Water levels rose rapidly near Kottara Chowki following torrential rainfall on August 14, 2023, inundating major road arteries.",
          relationship: "supports",
          reliabilityScore: 0.91,
        },
        {
          id: "ev-02",
          title: "Fact Check: 2023 Mangalore Flood Video Resurfaces as Current",
          url: "https://example.com/factcheck/mangalore-flood-video-2023",
          source: "Independent Fact Checkers",
          publishedDate: "2024-06-10",
          snippet:
            "A recurring video claiming to show fresh flooding in coastal Karnataka is actually archive footage from the 2023 monsoon season.",
          relationship: "contradicts",
          reliabilityScore: 0.97,
        },
        {
          id: "ev-03",
          title: "Mangalore Daily Weather & Precipitation Log",
          url: "https://example.com/weather/mangalore-today",
          source: "State Disaster Monitoring Center",
          publishedDate: new Date().toISOString().split("T")[0],
          snippet:
            "Clear to partly cloudy skies recorded across Mangalore urban limits. No flood warnings in effect.",
          relationship: "contradicts",
          reliabilityScore: 0.95,
        },
      ],
      syntheticMediaAnalysis: {
        status: "no_strong_indicators",
        confidence: "medium",
        indicators: [
          {
            category: "temporal_consistency",
            observation:
              "Fluid vehicle wake and continuous natural water movement exhibit coherent physics across frames with no generative warping.",
            severity: "low",
          },
          {
            category: "lighting",
            observation:
              "Overcast diffuse sky lighting matches reflections on submerged asphalt and vehicle windshields.",
            severity: "low",
          },
          {
            category: "visual_artifact",
            observation:
              "Video exhibits standard H.264 social media compression blockiness rather than neural diffusion melting or synthetic boundary artifacts.",
            severity: "low",
          },
        ],
        explanation:
          "Multimodal forensic inspection found no strong indicators of synthetic generation or neural manipulation. Physical behavior of water, reflections, and camera motion are consistent with genuine video capture, though compression reduces fine feature resolution.",
      },
      geminiModelUsed: `${DEFAULT_GEMINI_MODEL} (foundation-mock)`,
    };

    return NextResponse.json(mockVerificationResult, { status: 200 });
  } catch (err: unknown) {
    console.error("Verification API Error:", err);
    return NextResponse.json(
      {
        error: "Internal server error during verification request processing",
        message: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    );
  }
}
