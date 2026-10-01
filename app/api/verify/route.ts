import { NextRequest, NextResponse } from "next/server";
import { VerifyRequestSchema, VerificationResult, EvidenceSource, AtomicClaim, ContextStatus, MediaInput } from "@/types";
import { getSupabaseClient } from "@/lib/supabase";
import { MEDIA_BUCKET_NAME } from "@/lib/media/storage";
import {
  analyzeMedia,
  retrieveEvidence,
  analyzeEvidence,
  decomposeClaims,
} from "@/lib/gemini-service";
import { z } from "zod";

// Extend the existing schema to explicitly require caseId and mediaId for the pipeline
const PipelineRequestSchema = VerifyRequestSchema.extend({
  caseId: z.string().min(1, "caseId is required"),
  mediaId: z.string().min(1, "mediaId is required"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // 1. INPUT VALIDATION
    const validationResult = PipelineRequestSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Invalid verification request payload",
          details: validationResult.error.format(),
        },
        { status: 400 }
      );
    }

    const { caseId, mediaId, claim } = validationResult.data;
    const supabase = getSupabaseClient();

    // 2. MEDIA LOADING
    const { data: mediaRecord, error: mediaError } = await supabase
      .from("media")
      .select("*")
      .eq("id", mediaId)
      .eq("case_id", caseId)
      .single();

    if (mediaError || !mediaRecord) {
      return NextResponse.json(
        { error: "Media not found for the provided case and media IDs." },
        { status: 404 }
      );
    }

    // Download media from storage to analyze it
    const { data: storageData, error: storageError } = await supabase.storage
      .from(MEDIA_BUCKET_NAME)
      .download(mediaRecord.storage_path);

    if (storageError || !storageData) {
      return NextResponse.json(
        { error: "Failed to retrieve media file from storage." },
        { status: 500 }
      );
    }

    const arrayBuffer = await storageData.arrayBuffer();
    const base64Data = Buffer.from(arrayBuffer).toString("base64");

    // 3. MEDIA ANALYSIS
    let mediaObservations;
    try {
      mediaObservations = await analyzeMedia({
        textPrompt: "Analyze the provided media and extract objective, verifiable observations without forming conclusions.",
        mediaParts: [
          {
            inlineData: {
              mimeType: mediaRecord.mime_type,
              data: base64Data,
            },
          },
        ],
      });
    } catch (e) {
      console.error("Media analysis failed:", e);
      return NextResponse.json(
        { error: "Media analysis failed." },
        { status: 500 }
      );
    }

    // 4. CLAIM DECOMPOSITION
    const atomicClaims = await decomposeClaims(claim.rawText);

    // 5 & 6. EVIDENCE RETRIEVAL & REASONING (Concurrent per claim)
    const allEvidenceSources: EvidenceSource[] = [];
    const processedAtomicClaims: AtomicClaim[] = [];

    const claimPromises = atomicClaims.map(async (ac) => {
      let retrievedEvidence: EvidenceSource[] = [];
      try {
        retrievedEvidence = await retrieveEvidence(ac, atomicClaims);
      } catch (err) {
        console.error(`Evidence retrieval failed for claim ${ac.id}:`, err);
        // Fallback to empty evidence, allowing reasoning to mark it as insufficient
      }

      let reasoningResult;
      try {
        reasoningResult = await analyzeEvidence(ac, retrievedEvidence, atomicClaims);
      } catch (err) {
        console.error(`Reasoning failed for claim ${ac.id}:`, err);
        // Fallback reasoning
        reasoningResult = {
          status: "insufficient" as const,
          explanation: "Reasoning analysis failed or was unavailable.",
          evidenceRelationships: []
        };
      }

      // Merge newly retrieved evidence, updating relationships from reasoning
      retrievedEvidence.forEach((ev) => {
        const rel = reasoningResult.evidenceRelationships.find(r => r.evidenceId === ev.id);
        if (rel) {
          ev.relationship = rel.relationship;
        } else {
          ev.relationship = "unrelated";
        }
        allEvidenceSources.push(ev);
      });

      processedAtomicClaims.push({
        id: ac.id,
        type: ac.type,
        claimText: ac.claimText,
        status: reasoningResult.status,
        confidenceScore: 0.9, // Defaulting as we don't calculate probabilistic confidences in phase 6 yet
        explanation: reasoningResult.explanation,
        evidenceIds: retrievedEvidence.map((e) => e.id),
      });
    });

    await Promise.all(claimPromises);

    // 7. RESULT AGGREGATION & CONTEXT STATUS
    // Derive ContextStatus based on atomic claim statuses conservatively
    const hasInsufficient = processedAtomicClaims.some(c => c.status === "insufficient");
    const contradictedClaims = processedAtomicClaims.filter(c => c.status === "contradicted");
    
    let overallContextStatus: ContextStatus = "claim_supported";
    if (contradictedClaims.length > 0) {
      // Determine specific mismatch type
      const contradictedTypes = contradictedClaims.map(c => c.type);
      if (contradictedTypes.includes("when")) {
        overallContextStatus = "temporal_mismatch";
      } else if (contradictedTypes.includes("where")) {
        overallContextStatus = "geographic_mismatch";
      } else if (contradictedTypes.includes("what")) {
        overallContextStatus = "event_mismatch";
      } else {
        overallContextStatus = "context_mismatch";
      }
    } else if (hasInsufficient) {
      overallContextStatus = "unverified";
    }

    const mediaInput: MediaInput = {
      id: mediaRecord.id,
      type: mediaRecord.type,
      fileName: mediaRecord.metadata?.originalName || "media_file",
      fileSize: mediaRecord.metadata?.size,
      mimeType: mediaRecord.mime_type,
      url: mediaRecord.storage_path,
    };

    const verificationResult: VerificationResult = {
      id: `verif-${Date.now()}`,
      timestamp: new Date().toISOString(),
      media: mediaInput,
      claim: claim,
      contextStatus: overallContextStatus,
      summaryExplanation: `The claim was evaluated against external evidence. The overall status is determined as ${overallContextStatus} based on the underlying atomic claims.`,
      atomicClaims: processedAtomicClaims,
      evidence: allEvidenceSources,
    };

    // Return VerificationResult-compatible response
    return NextResponse.json(verificationResult, { status: 200 });

  } catch (err: unknown) {
    console.error("Verification Pipeline Error:", err);
    return NextResponse.json(
      {
        error: "Internal server error during verification request processing",
        message: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    );
  }
}
