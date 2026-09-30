import { AtomicClaim, ClaimDimension, ClaimVerificationStatus } from "@/types";
import { CheckCircle2, XCircle, HelpCircle, MapPin, Calendar, Activity, Users, FileText } from "lucide-react";

interface ClaimDimensionCardProps {
  claim: AtomicClaim;
}

const dimensionIcons: Record<ClaimDimension, React.ReactNode> = {
  what: <Activity className="h-4 w-4 text-cyan-400" />,
  where: <MapPin className="h-4 w-4 text-emerald-400" />,
  when: <Calendar className="h-4 w-4 text-amber-400" />,
  who: <Users className="h-4 w-4 text-purple-400" />,
  other: <FileText className="h-4 w-4 text-slate-400" />,
};

const dimensionLabels: Record<ClaimDimension, string> = {
  what: "WHAT (Event / Incident)",
  where: "WHERE (Location)",
  when: "WHEN (Temporal Marker)",
  who: "WHO (Entities / People)",
  other: "OTHER CONTEXT",
};

const statusConfig: Record<
  ClaimVerificationStatus,
  { label: string; bg: string; text: string; border: string; icon: React.ReactNode }
> = {
  supported: {
    label: "Supported",
    bg: "bg-emerald-950/40",
    text: "text-emerald-400",
    border: "border-emerald-500/30",
    icon: <CheckCircle2 className="h-4 w-4 text-emerald-400" />,
  },
  contradicted: {
    label: "Contradicted",
    bg: "bg-rose-950/40",
    text: "text-rose-400",
    border: "border-rose-500/30",
    icon: <XCircle className="h-4 w-4 text-rose-400" />,
  },
  insufficient: {
    label: "Insufficient Evidence",
    bg: "bg-amber-950/40",
    text: "text-amber-400",
    border: "border-amber-500/30",
    icon: <HelpCircle className="h-4 w-4 text-amber-400" />,
  },
};

export function ClaimDimensionCard({ claim }: ClaimDimensionCardProps) {
  const status = statusConfig[claim.status];

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 shadow-sm hover:border-slate-700 transition-all">
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800/60">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-slate-800/80">
            {dimensionIcons[claim.type]}
          </div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-300 font-mono">
            {dimensionLabels[claim.type]}
          </span>
        </div>

        <div
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium border ${status.bg} ${status.text} ${status.border}`}
        >
          {status.icon}
          <span>{status.label}</span>
          <span className="text-[10px] opacity-75 font-mono">
            ({Math.round(claim.confidenceScore * 100)}%)
          </span>
        </div>
      </div>

      <div className="mt-3">
        <p className="text-sm font-medium text-slate-100">&ldquo;{claim.claimText}&rdquo;</p>
        <p className="mt-2 text-xs leading-relaxed text-slate-400">{claim.explanation}</p>
      </div>

      {claim.evidenceIds.length > 0 && (
        <div className="mt-3 pt-2 flex items-center gap-1.5 text-[11px] text-slate-400 font-mono">
          <span>Linked Evidence:</span>
          {claim.evidenceIds.map((id) => (
            <span
              key={id}
              className="rounded bg-slate-800 px-1.5 py-0.5 text-cyan-400 border border-slate-700"
            >
              #{id}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
