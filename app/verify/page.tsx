"use client";

import { useState } from "react";
import {
  Upload,
  Search,
  FileText,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  Link as LinkIcon,
  RefreshCw,
  Clock,
  Layers,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";
import {
  VerificationResult,
  MediaType,
  ContextStatus,
  ClaimVerificationStatus,
} from "@/types";
import { ClaimDimensionCard } from "@/components/ClaimDimensionCard";
import { EvidenceCard } from "@/components/EvidenceCard";
import { SyntheticMediaCard } from "@/components/SyntheticMediaCard";

// Demo state removed for production

const contextStatusDisplay: Record<
  ContextStatus,
  { label: string; description: string; badgeClass: string; icon: React.ReactNode }
> = {
  temporal_mismatch: {
    label: "Temporal Mismatch",
    description: "The media is authentic, but it is an older recording being presented as current.",
    badgeClass: "bg-amber-950/60 text-amber-300 border-amber-500/40",
    icon: <Clock className="h-5 w-5 text-amber-400" />,
  },
  context_mismatch: {
    label: "Context Mismatch",
    description: "The media appears genuine, but the accompanying claim is factually false.",
    badgeClass: "bg-rose-950/60 text-rose-300 border-rose-500/40",
    icon: <AlertTriangle className="h-5 w-5 text-rose-400" />,
  },
  geographic_mismatch: {
    label: "Geographic Mismatch",
    description: "The media is real, but it is being falsely attributed to a different location.",
    badgeClass: "bg-purple-950/60 text-purple-300 border-purple-500/40",
    icon: <ShieldAlert className="h-5 w-5 text-purple-400" />,
  },
  event_mismatch: {
    label: "Event Mismatch",
    description: "The media is real, but it depicts a different event than the one claimed.",
    badgeClass: "bg-orange-950/60 text-orange-300 border-orange-500/40",
    icon: <AlertTriangle className="h-5 w-5 text-orange-400" />,
  },
  claim_supported: {
    label: "Claim Supported",
    description: "Both media and accompanying claim are corroborated by available evidence.",
    badgeClass: "bg-emerald-950/60 text-emerald-300 border-emerald-500/40",
    icon: <CheckCircle2 className="h-5 w-5 text-emerald-400" />,
  },
  unverified: {
    label: "Insufficient Evidence / Unverified",
    description: "Available verified evidence is currently insufficient to determine veracity.",
    badgeClass: "bg-slate-800 text-slate-300 border-slate-600",
    icon: <HelpCircle className="h-5 w-5 text-slate-400" />,
  },
};

export default function VerifyWorkspace() {
  const [mediaType, setMediaType] = useState<MediaType>("image");
  const [claimText, setClaimText] = useState("");
  const [sourcePlatform, setSourcePlatform] = useState("");
  const [claimedLocation, setClaimedLocation] = useState("");
  const [claimedDate, setClaimedDate] = useState("");
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [caseId, setCaseId] = useState<string | null>(null);
  const [mediaId, setMediaId] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);

  const handleFileUpload = async (file: File) => {
    if (file.type.startsWith("video/") && file.size > 100 * 1024 * 1024) {
      setUploadError(
        "Video exceeds the current 100 MB limit. Large-video preprocessing will allow ContextLock to analyze longer videos by extracting relevant frames, audio, and metadata."
      );
      return;
    }

    setSelectedFileName(file.name);
    setIsUploading(true);
    setUploadError(null);

    const formData = new FormData();
    formData.append("file", file);
    if (caseId) {
      formData.append("caseId", caseId);
    }

    try {
      const response = await fetch("/api/media/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Upload failed");
      }

      setCaseId(data.media.caseId);
      setMediaId(data.media.id);
      setMediaType(data.media.mediaType);
    } catch (err: unknown) {
      console.error("Upload error:", err);
      setUploadError(err instanceof Error ? err.message : "Failed to upload media");
    } finally {
      setIsUploading(false);
    }
  };

  const handleVerification = async () => {
    if (!caseId || !mediaId) {
      console.error("Please upload media first");
      return;
    }

    setIsVerifying(true);

    const claim = {
      rawText: claimText,
      sourcePlatform,
      claimedDate,
      claimedLocation,
    };

    console.log("INVESTIGATE CLICKED");
    console.log("VERIFY PAYLOAD", { caseId, mediaId, claim });

    try {
      const response = await fetch("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          caseId,
          mediaId,
          claim,
        }),
      });

      console.log("VERIFY RESPONSE", response.status);

      if (response.ok) {
        const data: VerificationResult = await response.json();
        setResult(data);
      } else {
        console.error("Verification API failed with status:", response.status);
      }
    } catch (err) {
      console.error("Failed to query verification API:", err);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="py-8 md:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Workspace Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-8 border-b border-slate-800 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-md bg-blue-500/10 border border-blue-500/20 px-2.5 py-1 text-xs text-blue-400 font-mono mb-2">
              <Sparkles className="h-3 w-3" />
              <span>Verification Workspace &bull; Foundation Phase</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Investigate Media Context
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Provide media and the accompanying narrative to break down atomic claims and trace evidence.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Buttons can go here if needed in future */}
          </div>
        </div>

        {/* Input Form & Preview Grid */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Media & Claim Inputs (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Step 1: Media Upload Placeholder */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-300 font-mono">
                  1. Media Input
                </span>
                <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-md border border-slate-800 text-xs">
                  <button
                    type="button"
                    onClick={() => setMediaType("image")}
                    className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                      mediaType === "image"
                        ? "bg-blue-600 text-white"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    Image
                  </button>
                  <button
                    type="button"
                    onClick={() => setMediaType("video")}
                    className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                      mediaType === "video"
                        ? "bg-blue-600 text-white"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    Video
                  </button>
                </div>
              </div>

              {/* Upload Dropzone Placeholder */}
              <div className="mt-4">
                <label
                  htmlFor="media-file-input"
                  className={`group flex flex-col items-center justify-center rounded-lg border-2 border-dashed ${isUploading ? 'border-cyan-500 opacity-75 cursor-wait' : 'border-slate-700 hover:border-cyan-500/60 cursor-pointer'} bg-slate-950/50 p-6 text-center transition-all`}
                >
                  <div className={`flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 ${isUploading ? '' : 'group-hover:bg-cyan-950/60'} text-slate-400 ${isUploading ? 'text-cyan-400' : 'group-hover:text-cyan-400'} transition-colors`}>
                    {isUploading ? <RefreshCw className="h-6 w-6 animate-spin" /> : <Upload className="h-6 w-6" />}
                  </div>
                  <p className={`mt-3 text-sm font-medium text-slate-300 ${isUploading ? '' : 'group-hover:text-cyan-300'}`}>
                    {isUploading ? 'Uploading...' : `Click to browse or drop ${mediaType} file`}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    Supports JPG, PNG, WEBP, MP4, MOV (Up to 100MB)
                  </p>
                  <input
                    id="media-file-input"
                    type="file"
                    className="hidden"
                    disabled={isUploading}
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleFileUpload(e.target.files[0]);
                      }
                    }}
                  />
                </label>

                {uploadError && (
                  <div className="mt-3 flex items-start gap-2 rounded-lg bg-rose-950/40 px-3 py-2 border border-rose-900/50 text-xs text-rose-400">
                    <XCircle className="h-4 w-4 shrink-0 mt-0.5" />
                    <span>{uploadError}</span>
                  </div>
                )}

                {selectedFileName && !uploadError && (
                  <div className="mt-3 flex items-center justify-between rounded-lg bg-slate-950 px-3 py-2 border border-slate-800 text-xs">
                    <span className="font-mono text-cyan-400 truncate max-w-[240px]">
                      {selectedFileName}
                    </span>
                    <span className="text-slate-400 text-[11px]">
                      {isUploading ? 'Uploading...' : mediaId ? 'Uploaded & Ready' : 'Ready'}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Step 2: Context / Claim Inputs */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-300 font-mono block pb-3 border-b border-slate-800">
                2. Accompanying Claim / Context
              </span>

              <div className="mt-4 space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Claim, Caption, or Forwarded Message:
                  </label>
                  <textarea
                    rows={3}
                    value={claimText}
                    onChange={(e) => setClaimText(e.target.value)}
                    placeholder="e.g. This video shows today's massive flooding in Mangalore."
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Claimed Location:
                    </label>
                    <input
                      type="text"
                      value={claimedLocation}
                      onChange={(e) => setClaimedLocation(e.target.value)}
                      placeholder="e.g. Mangalore"
                      className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs text-slate-100 focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Claimed Time / Date:
                    </label>
                    <input
                      type="text"
                      value={claimedDate}
                      onChange={(e) => setClaimedDate(e.target.value)}
                      placeholder="e.g. Today"
                      className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs text-slate-100 focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Source / Platform:
                  </label>
                  <input
                    type="text"
                    value={sourcePlatform}
                    onChange={(e) => setSourcePlatform(e.target.value)}
                    placeholder="e.g. WhatsApp, X (Twitter), Telegram"
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs text-slate-100 focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                {/* Primary Action Button */}
                <button
                  type="button"
                  onClick={handleVerification}
                  disabled={isVerifying}
                  className="w-full mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-500 hover:from-blue-500 hover:to-cyan-400 py-3 px-4 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition-all disabled:opacity-50"
                >
                  {isVerifying ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span>Investigating Context...</span>
                    </>
                  ) : (
                    <>
                      <Search className="h-4 w-4" />
                      <span>Investigate Claim &amp; Evidence</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Verification Results (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {result ? (
              <>
                {/* Result Status Banner */}
                <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                        {contextStatusDisplay[result.contextStatus]?.icon}
                      </div>
                      <div>
                        <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
                          CONTEXT VERIFICATION STATUS
                        </span>
                        <h2 className="text-xl font-bold text-white">
                          {contextStatusDisplay[result.contextStatus]?.label}
                        </h2>
                      </div>
                    </div>

                    <div
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-mono font-semibold border ${
                        contextStatusDisplay[result.contextStatus]?.badgeClass
                      }`}
                    >
                      {contextStatusDisplay[result.contextStatus]?.label}
                    </div>
                  </div>

                  <p className="mt-4 text-sm leading-relaxed text-slate-300">
                    {result.summaryExplanation}
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-xs text-slate-400 font-mono gap-2">
                    <span>Target Claim: &ldquo;{result.claim.rawText}&rdquo;</span>
                    {result.geminiModelUsed && (
                      <span className="text-cyan-400">&bull; {result.geminiModelUsed}</span>
                    )}
                  </div>
                </div>

                {/* Layer 01: Synthetic Media Analysis */}
                {result.syntheticMediaAnalysis && (
                  <SyntheticMediaCard
                    analysis={result.syntheticMediaAnalysis}
                    mediaType={result.media?.type}
                  />
                )}

                {/* Atomic Claims Deconstruction Section */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300 font-mono flex items-center gap-2">
                      <Layers className="h-4 w-4 text-cyan-400" />
                      <span>Atomic Claim Deconstruction</span>
                    </h3>
                    <span className="text-xs text-slate-400">
                      {result.atomicClaims.length} Claims Evaluated
                    </span>
                  </div>

                  <div className="space-y-3">
                    {result.atomicClaims.map((claim) => (
                      <ClaimDimensionCard key={claim.id} claim={claim} />
                    ))}
                  </div>
                </div>

                {/* Evidence & Grounding Sources Section */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300 font-mono flex items-center gap-2">
                      <FileText className="h-4 w-4 text-blue-400" />
                      <span>Traceable Evidence &amp; Sources</span>
                    </h3>
                    <span className="text-xs text-slate-400">
                      {result.evidence.length} Sources Connected
                    </span>
                  </div>

                  <div className="space-y-3">
                    {result.evidence.map((ev) => (
                      <EvidenceCard key={ev.id} evidence={ev} />
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/30 p-12 text-center">
                <Search className="h-10 w-10 text-slate-600 mx-auto" />
                <h3 className="mt-4 text-base font-semibold text-slate-300">
                  No Active Investigation
                </h3>
                <p className="mt-1 text-xs text-slate-400 max-w-sm mx-auto">
                  Submit a claim and media file on the left to deconstruct atomic claims and trace evidence sources.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
