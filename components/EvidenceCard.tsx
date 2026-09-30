import { EvidenceSource, EvidenceRelationship } from "@/types";
import { ExternalLink, ShieldCheck, AlertTriangle, Info, BookOpen } from "lucide-react";

interface EvidenceCardProps {
  evidence: EvidenceSource;
}

const relationshipConfig: Record<
  EvidenceRelationship,
  { label: string; bg: string; text: string; border: string; icon: React.ReactNode }
> = {
  supports: {
    label: "Supports Claim",
    bg: "bg-emerald-950/40",
    text: "text-emerald-400",
    border: "border-emerald-500/30",
    icon: <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />,
  },
  contradicts: {
    label: "Contradicts Claim",
    bg: "bg-rose-950/40",
    text: "text-rose-400",
    border: "border-rose-500/30",
    icon: <AlertTriangle className="h-3.5 w-3.5 text-rose-400" />,
  },
  context: {
    label: "Relevant Context",
    bg: "bg-cyan-950/40",
    text: "text-cyan-400",
    border: "border-cyan-500/30",
    icon: <Info className="h-3.5 w-3.5 text-cyan-400" />,
  },
  unrelated: {
    label: "Unrelated",
    bg: "bg-slate-900",
    text: "text-slate-400",
    border: "border-slate-800",
    icon: <BookOpen className="h-3.5 w-3.5 text-slate-400" />,
  },
};

export function EvidenceCard({ evidence }: EvidenceCardProps) {
  const rel = relationshipConfig[evidence.relationship];

  return (
    <div className="rounded-xl border border-slate-850 bg-slate-900/40 p-4 hover:border-slate-700/80 transition-all">
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-cyan-400 font-semibold">
            #{evidence.id}
          </span>
          <span className="text-xs text-slate-400 font-medium">
            {evidence.source}
          </span>
          {evidence.publishedDate && (
            <span className="text-[11px] text-slate-400 font-mono">
              &bull; {evidence.publishedDate}
            </span>
          )}
        </div>

        <div
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium border ${rel.bg} ${rel.text} ${rel.border}`}
        >
          {rel.icon}
          <span>{rel.label}</span>
        </div>
      </div>

      <h4 className="mt-1 text-sm font-semibold text-slate-200">
        <a
          href={evidence.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 hover:text-cyan-400 transition-colors group"
        >
          <span>{evidence.title}</span>
          <ExternalLink className="h-3.5 w-3.5 opacity-60 group-hover:opacity-100" />
        </a>
      </h4>

      <p className="mt-2 text-xs leading-relaxed text-slate-400 bg-slate-950/60 rounded-lg p-2.5 border border-slate-900">
        &ldquo;{evidence.snippet}&rdquo;
      </p>

      {evidence.reliabilityScore && (
        <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-400">
          <span>Source Reliability</span>
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-20 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"
                style={{ width: `${Math.round(evidence.reliabilityScore * 100)}%` }}
              />
            </div>
            <span className="font-mono">{Math.round(evidence.reliabilityScore * 100)}%</span>
          </div>
        </div>
      )}
    </div>
  );
}
