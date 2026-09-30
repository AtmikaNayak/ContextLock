import { EvidenceRelationship, EvidenceSource } from "@/types";

/**
 * Evidence Management & Reasoning Layer
 *
 * Core Concept:
 * ContextLock is an evidence-first system, not a black-box AI verdict.
 * Every verification result must trace back to concrete evidence:
 * - Claim -> Evidence -> Relationship -> Verification
 *
 * Evidence can have four explicit relationships to an atomic claim:
 * 1. 'supports'    -> Corroborates the claim with reliable data/reporting.
 * 2. 'contradicts' -> Shows the claim is temporally, geographically, or factually wrong.
 * 3. 'context'     -> Provides crucial background (e.g. earlier occurrence, unrelated event).
 * 4. 'unrelated'   -> Mentions keywords but does not evaluate the claim.
 */

export interface EvidenceRetrievalQuery {
  claimDimension: string;
  queryText: string;
  timeContext?: string;
  locationContext?: string;
}

/**
 * Evaluates the relationship between an atomic claim and retrieved evidence source
 */
export function categorizeEvidenceRelationship(
  status: "supported" | "contradicted" | "insufficient"
): EvidenceRelationship {
  switch (status) {
    case "supported":
      return "supports";
    case "contradicted":
      return "contradicts";
    case "insufficient":
    default:
      return "context";
  }
}

/**
 * Format evidence sources for reporting and UI presentation
 */
export function formatEvidenceCitation(evidence: EvidenceSource): string {
  const dateStr = evidence.publishedDate ? ` (${evidence.publishedDate})` : "";
  return `[${evidence.source}] "${evidence.title}"${dateStr}: ${evidence.snippet}`;
}
