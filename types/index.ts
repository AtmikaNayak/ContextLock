import { z } from "zod";

/**
 * Types & Schemas for ContextLock
 * Track: Trust in a Synthetic World (Google Gemini Hack Days 2026)
 *
 * Core Concept:
 * Real media can carry false context.
 * We do not classify media as a blunt "REAL" vs "FAKE".
 * Instead, we verify whether the story told about the media is supported by evidence.
 */

// Supported Media Types
export type MediaType = "image" | "video";

export interface MediaInput {
  id?: string;
  type: MediaType;
  url?: string;
  fileName?: string;
  fileSize?: number;
  mimeType?: string;
  previewUrl?: string;
  extractedMetadata?: {
    recordedDate?: string;
    locationName?: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
    cameraModel?: string;
  };
}

// Atomic Claim Dimension Classification
export type ClaimDimension = "what" | "where" | "when" | "who" | "other";

// Verification Status for each atomic claim
export type ClaimVerificationStatus =
  | "supported"
  | "contradicted"
  | "insufficient";

// Overall Context Status of the investigation
export type ContextStatus =
  | "claim_supported"     // Media and context consistent with evidence
  | "context_mismatch"    // Media appears authentic, but accompanying claim is false
  | "temporal_mismatch"   // Real media from past presented as current/recent
  | "geographic_mismatch" // Real media attributed to different location
  | "event_mismatch"      // Real media associated with another incident
  | "unverified";         // Evidence is insufficient to verify claim

// Evidence Relationship to an atomic claim
export type EvidenceRelationship =
  | "supports"
  | "contradicts"
  | "context"
  | "unrelated";

export interface EvidenceSource {
  id: string;
  title: string;
  url: string;
  source: string;
  publishedDate?: string;
  snippet: string;
  relationship: EvidenceRelationship;
  reliabilityScore?: number; // 0.0 - 1.0 based on domain credibility
  relevantTimestamp?: string; // For video timestamps (future capability)
}

export interface AtomicClaim {
  id: string;
  type: ClaimDimension;
  claimText: string;
  status: ClaimVerificationStatus;
  confidenceScore: number; // 0.0 - 1.0
  explanation: string;
  evidenceIds: string[];
}

export interface ClaimContextInput {
  rawText: string;
  sourcePlatform?: string;
  claimedDate?: string;
  claimedLocation?: string;
}

export interface VerificationResult {
  id: string;
  timestamp: string;
  media: MediaInput;
  claim: ClaimContextInput;
  contextStatus: ContextStatus;
  summaryExplanation: string;
  atomicClaims: AtomicClaim[];
  evidence: EvidenceSource[];
  geminiModelUsed?: string;
}

// ==========================================
// Zod Schemas for Runtime Validation & AI Structured Outputs
// ==========================================

export const MediaInputSchema = z.object({
  type: z.enum(["image", "video"]),
  url: z.string().url().optional(),
  fileName: z.string().optional(),
  fileSize: z.number().nonnegative().optional(),
  mimeType: z.string().optional(),
});

export const ClaimInputSchema = z.object({
  rawText: z
    .string()
    .min(3, "Claim text must contain at least 3 characters")
    .max(2000, "Claim text exceeds maximum length"),
  sourcePlatform: z.string().optional(),
  claimedDate: z.string().optional(),
  claimedLocation: z.string().optional(),
});

export const VerifyRequestSchema = z.object({
  media: MediaInputSchema.optional(),
  claim: ClaimInputSchema,
});

export const EvidenceSourceSchema = z.object({
  id: z.string(),
  title: z.string(),
  url: z.string(),
  source: z.string(),
  publishedDate: z.string().optional(),
  snippet: z.string(),
  relationship: z.enum(["supports", "contradicts", "context", "unrelated"]),
  reliabilityScore: z.number().min(0).max(1).optional(),
  relevantTimestamp: z.string().optional(),
});

export const AtomicClaimSchema = z.object({
  id: z.string(),
  type: z.enum(["what", "where", "when", "who", "other"]),
  claimText: z.string(),
  status: z.enum(["supported", "contradicted", "insufficient"]),
  confidenceScore: z.number().min(0).max(1),
  explanation: z.string(),
  evidenceIds: z.array(z.string()),
});

export const VerificationResultSchema = z.object({
  id: z.string(),
  timestamp: z.string(),
  media: MediaInputSchema,
  claim: ClaimInputSchema,
  contextStatus: z.enum([
    "claim_supported",
    "context_mismatch",
    "temporal_mismatch",
    "geographic_mismatch",
    "event_mismatch",
    "unverified",
  ]),
  summaryExplanation: z.string(),
  atomicClaims: z.array(AtomicClaimSchema),
  evidence: z.array(EvidenceSourceSchema),
  geminiModelUsed: z.string().optional(),
});

export type VerifyRequest = z.infer<typeof VerifyRequestSchema>;
