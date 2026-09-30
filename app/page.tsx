import Link from "next/link";
import {
  ShieldAlert,
  Search,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Layers,
  ArrowRight,
  Sparkles,
  Split,
  FileCheck2,
  Calendar,
  MapPin,
  Clock,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="relative overflow-hidden py-12 md:py-20">
      {/* Background radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-gradient-to-tr from-cyan-600/15 via-blue-600/10 to-indigo-600/15 blur-3xl pointer-events-none rounded-full" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Track Badge */}
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-950/40 px-3.5 py-1.5 text-xs font-medium text-cyan-300 backdrop-blur-md shadow-sm">
            <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
            <span>Google Gemini Hack Days 2026 &bull; Trust in a Synthetic World</span>
          </div>
        </div>

        {/* Hero Section */}
        <div className="mt-8 text-center max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white">
            Context<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Lock</span>
          </h1>

          <p className="mt-4 text-xl sm:text-2xl font-semibold text-slate-200">
            Verify the context, not just the content.
          </p>

          <p className="mt-5 text-base sm:text-lg text-slate-400 leading-relaxed max-w-2xl mx-auto">
            Real media can carry false context. ContextLock uses Gemini to investigate the claims attached to images and videos and connect them to evidence.
          </p>

          {/* Core Call to Action */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/verify"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-500 hover:from-blue-500 hover:to-cyan-400 px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/35 transition-all hover:-translate-y-0.5"
            >
              <Search className="h-5 w-5" />
              <span>Verify Media</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <a
              href="#the-twist"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700/80 bg-slate-900/60 hover:bg-slate-800/80 px-6 py-3.5 text-base font-medium text-slate-300 hover:text-white transition-colors"
            >
              <span>Explore The Core Concept</span>
            </a>
          </div>

          {/* Central Thesis Banner */}
          <div className="mt-10 inline-block rounded-xl border border-blue-500/20 bg-blue-950/30 px-5 py-2.5 backdrop-blur-sm">
            <p className="text-sm font-mono text-cyan-300">
              <strong className="text-white">Core Insight:</strong> Real media ≠ truthful context.
            </p>
          </div>
        </div>

        {/* The Twist: Contrast between Real vs Fake and Context Verification */}
        <section id="the-twist" className="mt-20 pt-8 border-t border-slate-800/60">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-cyan-400 font-mono">
              The Fundamental Twist
            </h2>
            <p className="mt-2 text-2xl sm:text-3xl font-bold text-white">
              Why simplistic &ldquo;Real vs. Fake&rdquo; classification fails
            </p>
            <p className="mt-3 text-sm text-slate-400">
              An image or video does not need to be AI-generated or manipulated to deceive. Misinformation usually spreads by taking authentic footage from another time, place, or incident and attaching a false narrative.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            {/* The Old / Flawed Paradigm */}
            <div className="rounded-2xl border border-rose-900/40 bg-gradient-to-b from-rose-950/20 to-slate-900/40 p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-rose-900/30">
                  <div className="flex items-center gap-2 text-rose-400">
                    <ShieldAlert className="h-5 w-5" />
                    <span className="font-mono text-xs uppercase tracking-wider font-bold">
                      Conventional Approach
                    </span>
                  </div>
                  <span className="rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2.5 py-0.5 text-xs font-mono">
                    Flawed &amp; Insufficient
                  </span>
                </div>

                <div className="mt-6 text-center p-6 rounded-xl bg-slate-950/80 border border-rose-950/50">
                  <span className="text-xs uppercase tracking-widest text-slate-400 font-mono">
                    Blunt Binary Verdict
                  </span>
                  <div className="mt-2 text-3xl font-black text-rose-400 tracking-wider">
                    [ REAL ] or [ FAKE ]
                  </div>
                  <p className="mt-3 text-xs text-slate-400">
                    If an authentic flood video from 2021 is forwarded claiming &ldquo;Mangalore flooded today&rdquo;, a binary detector marks the pixels as <strong>REAL</strong>. The misinformation succeeds.
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-2 text-xs text-slate-400 border-t border-rose-900/20 pt-4">
                <p className="text-rose-300 font-medium">Blind spots of media-only detectors:</p>
                <ul className="list-disc list-inside space-y-1 text-slate-400">
                  <li>Cannot detect recycled historical footage (Temporal Mismatch)</li>
                  <li>Cannot detect footage shot in another country (Geographic Mismatch)</li>
                  <li>Cannot verify the actual caption or claim being spread</li>
                </ul>
              </div>
            </div>

            {/* The ContextLock Solution */}
            <div className="rounded-2xl border border-cyan-800/50 bg-gradient-to-b from-cyan-950/25 to-slate-900/50 p-6 sm:p-8 flex flex-col justify-between glow-blue">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-cyan-800/40">
                  <div className="flex items-center gap-2 text-cyan-300">
                    <Split className="h-5 w-5 text-cyan-400" />
                    <span className="font-mono text-xs uppercase tracking-wider font-bold">
                      ContextLock Approach
                    </span>
                  </div>
                  <span className="rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 px-2.5 py-0.5 text-xs font-mono">
                    Claim-Level Deconstruction
                  </span>
                </div>

                <div className="mt-6 p-4 rounded-xl bg-slate-950/90 border border-cyan-900/40 space-y-3">
                  <div className="flex items-center justify-between text-xs border-b border-slate-800/80 pb-2">
                    <span className="font-mono text-slate-400">CLAIM:</span>
                    <span className="font-medium text-slate-200 text-right">&ldquo;Mangalore massive flooding today&rdquo;</span>
                  </div>

                  <div className="space-y-2 text-xs font-mono">
                    <div className="flex items-center justify-between p-2 rounded bg-slate-900 border border-slate-800">
                      <div className="flex items-center gap-1.5 text-slate-300">
                        <span className="text-cyan-400">WHAT:</span> Severe Flooding
                      </div>
                      <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Supported
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-2 rounded bg-slate-900 border border-slate-800">
                      <div className="flex items-center gap-1.5 text-slate-300">
                        <span className="text-emerald-400">WHERE:</span> Mangalore
                      </div>
                      <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Supported
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-2 rounded bg-slate-900 border border-slate-800">
                      <div className="flex items-center gap-1.5 text-slate-300">
                        <span className="text-amber-400">WHEN:</span> Today
                      </div>
                      <span className="inline-flex items-center gap-1 text-rose-400 font-semibold">
                        <XCircle className="h-3.5 w-3.5" /> Contradicted
                      </span>
                    </div>
                  </div>

                  <div className="mt-2 pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-mono">VERDICT:</span>
                    <span className="font-bold text-amber-300 font-mono flex items-center gap-1">
                      &bull; Temporal Mismatch (Archival footage from 2023)
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-1 text-xs text-slate-400 border-t border-cyan-900/30 pt-4">
                <p className="text-cyan-300 font-medium">Three nuanced verification states:</p>
                <div className="grid grid-cols-3 gap-2 mt-2 font-mono">
                  <div className="p-2 rounded bg-emerald-950/30 border border-emerald-500/20 text-center text-emerald-300">
                    Supported
                  </div>
                  <div className="p-2 rounded bg-rose-950/30 border border-rose-500/20 text-center text-rose-300">
                    Contradicted
                  </div>
                  <div className="p-2 rounded bg-amber-950/30 border border-amber-500/20 text-center text-amber-300">
                    Insufficient
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Future Architecture Pipeline */}
        <section className="mt-20 pt-8 border-t border-slate-800/60">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-cyan-400 font-mono">
              The Architecture
            </h2>
            <p className="mt-2 text-2xl sm:text-3xl font-bold text-white">
              Evidence-First Investigation Pipeline
            </p>
            <p className="mt-3 text-sm text-slate-400">
              ContextLock is an investigative tool, not a black-box chatbot. Every claim decomposition traces directly to verified search grounding sources.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-cyan-400 font-mono font-bold text-sm">
                01
              </div>
              <h3 className="mt-4 text-base font-semibold text-white">Multimodal Media Ingestion</h3>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                Gemini analyzes images and videos for physical clues, signboards, weather patterns, and timestamps.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400 font-mono font-bold text-sm">
                02
              </div>
              <h3 className="mt-4 text-base font-semibold text-white">Atomic Claim Decomposition</h3>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                Breaks user statements into discrete WHAT, WHERE, WHEN, and WHO sub-claims using structured schemas.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400 font-mono font-bold text-sm">
                03
              </div>
              <h3 className="mt-4 text-base font-semibold text-white">Search Grounding &amp; Evidence</h3>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                Leverages Google Search grounding to retrieve real-time and archival evidence with published dates and sources.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 font-mono font-bold text-sm">
                04
              </div>
              <h3 className="mt-4 text-base font-semibold text-white">Traceable Context Report</h3>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                Synthesizes a verifiable context audit showing supporting, contradicting, and nuance evidence.
              </p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/verify"
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-500 px-6 py-2.5 text-sm font-semibold text-white transition-all shadow-md shadow-blue-500/20"
            >
              <span>Launch Verification Workspace</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
