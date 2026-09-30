import { ShieldCheck, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950 py-10 text-slate-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600/20 text-cyan-400 border border-blue-500/30">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">ContextLock</p>
              <p className="text-xs text-slate-400">
                Real media can carry false context. Real media ≠ truthful context.
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center md:items-end gap-1 text-xs">
            <div className="flex items-center gap-1.5 text-slate-300">
              <span>Built by Team</span>
              <strong className="text-cyan-400 font-bold">A²</strong>
              <span>(Aakanksha K Poojari &amp; Atmika Nayak)</span>
            </div>
            <p className="text-slate-500">
              Google Gemini Hack Days 2026 &bull; Track: Trust in a Synthetic World
            </p>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-900 pt-4 text-center text-xs text-slate-400">
          ContextLock is designed to verify the story told about media through multimodal AI decomposition and search grounding.
        </div>
      </div>
    </footer>
  );
}
