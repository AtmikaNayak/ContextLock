import Link from "next/link";
import {
  ShieldAlert,
  Search,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Split,
  FileSearch,
  Database,
  Layers,
  FileCheck2,
} from "lucide-react";
import ParticleDrift from "@/components/originkit/particle-drift";

export default function HomePage() {
  return (
    <div className="py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Newspaper Issue Header / Top Metadata Bar */}
        <div className="border-b-2 border-black pb-3 flex flex-wrap items-center justify-between gap-2 text-xs font-mono font-bold uppercase tracking-wider">
          <div className="flex items-center gap-3">
            <span className="bg-black text-white px-2 py-0.5">ISSUE 01</span>
            <span>GOOGLE GEMINI HACK DAYS 2026</span>
            <span className="hidden sm:inline">&bull;</span>
            <span className="hidden sm:inline">TRACK: TRUST IN A SYNTHETIC WORLD</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="border border-black bg-white px-2 py-0.5">DISPATCH_STATUS: ACTIVE</span>
            <span className="bg-[#FF3B00] text-black px-2 py-0.5">SECURITY_LEVEL: 0</span>
          </div>
        </div>

        {/* Hero Section: Strict Left-Alignment & Massive Aggressive Headline */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start border-b-2 border-black pb-12">
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-block border border-black bg-white px-3 py-1 text-xs font-mono font-bold uppercase tracking-widest text-black">
              [ MANIFESTO // MEDIA CONTEXT AUDIT ]
            </div>

            <h1 className="font-serif text-5xl sm:text-7xl lg:text-8xl font-black uppercase tracking-tight text-black leading-[0.9]">
              Real Media.
              <br />
              <span className="text-[#FF3B00] underline decoration-4 underline-offset-4">
                False Context.
              </span>
            </h1>

            <div className="border-l-4 border-black pl-4 py-1 space-y-2">
              <p className="font-serif text-xl sm:text-2xl font-bold text-black leading-snug">
                We don&apos;t just verify whether pixels are synthetic. We verify whether the story told about them is true.
              </p>
              <p className="font-mono text-xs sm:text-sm text-black leading-relaxed">
                Misinformation rarely needs deepfakes. Authentic footage from 2021 forwarded as &ldquo;happening today&rdquo; bypasses every conventional pixel detector. ContextLock deconstructs claims into atomic components (What, Where, When, Who) and cross-references external ground truth using Google Gemini.
              </p>
            </div>

            {/* Brutalist Action Bar */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 font-mono">
              <Link
                href="/verify"
                className="inline-flex items-center justify-center gap-3 border-2 border-black bg-black hover:bg-[#FF3B00] text-white hover:text-black px-6 py-4 text-sm font-bold uppercase tracking-wider transition-none"
              >
                <Search className="h-4 w-4" />
                <span>Launch Verification Engine</span>
                <ArrowRight className="h-4 w-4" />
              </Link>

              <a
                href="#thesis"
                className="inline-flex items-center justify-center gap-2 border-2 border-black bg-white hover:bg-black text-black hover:text-white px-5 py-4 text-sm font-bold uppercase tracking-wider transition-none"
              >
                <span>Read The Thesis</span>
              </a>
            </div>

            {/* Stark Monospace Metric Strip */}
            <div className="grid grid-cols-3 gap-2 border border-black bg-white p-3 font-mono text-left">
              <div>
                <span className="text-[10px] text-neutral-600 uppercase block">CORE INSIGHT</span>
                <strong className="text-xs uppercase text-black">Real ≠ True</strong>
              </div>
              <div className="border-l border-black pl-3">
                <span className="text-[10px] text-neutral-600 uppercase block">DECOMPOSITION</span>
                <strong className="text-xs uppercase text-black">4 Dimensions</strong>
              </div>
              <div className="border-l border-black pl-3">
                <span className="text-[10px] text-neutral-600 uppercase block">REASONING</span>
                <strong className="text-xs uppercase text-[#FF3B00]">Gemini 2.5 Flash</strong>
              </div>
            </div>
          </div>

          {/* Right Column: Contained Particle Drift Technical Exhibit */}
          <div className="lg:col-span-5 space-y-3">
            <div className="border-2 border-black bg-white p-1">
              <div className="border-b border-black bg-black text-white px-3 py-1.5 flex items-center justify-between text-xs font-mono">
                <span className="font-bold tracking-wider">FIG 01. SYNTHETIC_DRIFT_NODE_SIM</span>
                <span className="text-[#FDFF00] font-mono text-[10px]">[LIVE DENSITY: 400]</span>
              </div>

              {/* Exact Screenshot Props Particle Drift Canvas */}
              <div className="relative h-[340px] sm:h-[400px] w-full border border-black overflow-hidden bg-[#030509]">
                <ParticleDrift
                  background="#030509"
                  baseColor="#FFFFFF"
                  accentColor="#FDFF00"
                  density={400}
                  dotSize={6}
                  speed={50}
                  direction={0}
                  hover={200}
                  linkDistance={230}
                  linkThickness={1}
                  className="w-full h-full"
                />

                {/* Overlaid Brutalist Grid Reticle */}
                <div className="absolute top-2 left-2 border border-white/40 bg-black/80 px-2 py-1 text-[9px] font-mono text-white pointer-events-none">
                  X_AXIS: 0.00 // LINK_THICK: 1.0px
                </div>
                <div className="absolute bottom-2 right-2 border border-white/40 bg-black/80 px-2 py-1 text-[9px] font-mono text-[#FDFF00] pointer-events-none">
                  HOVER_RAD: 200% // SPEED: 50
                </div>
              </div>

              <div className="p-2 bg-[#F4F1EA] text-[11px] font-mono text-black border-t border-black leading-tight">
                <strong>EXHIBIT SPECIFICATION:</strong> Interactive claim graph topology simulation. Nodes represent atomic sub-claims; yellow linkages activate on contextual inspection.
              </div>
            </div>
          </div>
        </section>

        {/* Section: The Twist / Why Real vs Fake Classification Fails */}
        <section id="thesis" className="space-y-6 pt-4 border-b-2 border-black pb-12">
          <div className="text-left max-w-3xl space-y-2">
            <div className="inline-block border border-black bg-[#FF3B00] text-black px-2 py-0.5 text-xs font-mono font-bold uppercase">
              THE FUNDAMENTAL TWIST
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl font-black uppercase text-black tracking-tight">
              Why Binary &ldquo;Real vs. Fake&rdquo; Detectors Fail
            </h2>
            <p className="font-mono text-xs sm:text-sm text-black leading-relaxed">
              Standard deepfake detectors look only at compression artifacts and neural synthesis signatures. When authentic footage from a 2021 typhoon in Japan is circulated as &ldquo;Mangalore flooding today&rdquo;, the video pixels are 100% genuine. Media detectors pass it with flying colors. The deception operates entirely in the context.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch font-mono">
            {/* Flawed Conventional Paradigm Box */}
            <div className="border-2 border-black bg-white p-6 flex flex-col justify-between text-left space-y-6">
              <div className="space-y-4">
                <div className="border-b-2 border-black pb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-black">
                    <ShieldAlert className="h-5 w-5 text-black" />
                    <span className="font-bold text-xs uppercase tracking-wider">
                      CONVENTIONAL MEDIA DETECTOR
                    </span>
                  </div>
                  <span className="border border-black bg-[#FF3B00] px-2 py-0.5 text-[10px] font-bold text-black uppercase">
                    FATALLY BLIND
                  </span>
                </div>

                <div className="border border-black bg-[#F4F1EA] p-4 text-center space-y-2">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-600 block">
                    BINARY CLASSIFICATION OUTPUT
                  </span>
                  <div className="text-3xl sm:text-4xl font-black font-serif text-black uppercase tracking-wider">
                    [ VERDICT: REAL ]
                  </div>
                  <p className="text-xs text-black border-t border-black pt-2 text-left">
                    <strong>Vulnerability:</strong> Pixel analysis reveals no generative artifacts. The detector validates the video as authentic, inadvertently legitimizing a completely false narrative.
                  </p>
                </div>
              </div>

              <div className="border-t border-black pt-4 space-y-2 text-xs">
                <strong className="uppercase text-black block">[ UNCHECKED VECTORS ]</strong>
                <ul className="space-y-1 text-black">
                  <li>&bull; Temporal Recycling: Old footage claimed as current event</li>
                  <li>&bull; Geographic Hijacking: Distant footage pinned to local areas</li>
                  <li>&bull; Narrative Inversion: Peace drill shown as live military strike</li>
                </ul>
              </div>
            </div>

            {/* The ContextLock Solution Box */}
            <div className="border-2 border-black bg-white p-6 flex flex-col justify-between text-left space-y-6">
              <div className="space-y-4">
                <div className="border-b-2 border-black pb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-black">
                    <Split className="h-5 w-5 text-black" />
                    <span className="font-bold text-xs uppercase tracking-wider">
                      CONTEXTLOCK DECONSTRUCTION
                    </span>
                  </div>
                  <span className="border border-black bg-black text-white px-2 py-0.5 text-[10px] font-bold uppercase">
                    EVIDENCE-GROUNDED
                  </span>
                </div>

                {/* Sub-claim breakdown specimen */}
                <div className="border border-black bg-[#F4F1EA] p-4 space-y-3">
                  <div className="border-b border-black pb-2 flex items-center justify-between text-xs">
                    <span className="font-bold text-neutral-600">INPUT CLAIM:</span>
                    <span className="font-bold text-black">&ldquo;Mangalore massive flooding today&rdquo;</span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="border border-black bg-white p-2 flex items-center justify-between">
                      <span className="font-bold">WHAT: Massive Inundation</span>
                      <span className="border border-black bg-white text-black px-1.5 py-0.5 text-[10px] font-bold flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3 text-black" /> SUPPORTED
                      </span>
                    </div>

                    <div className="border border-black bg-white p-2 flex items-center justify-between">
                      <span className="font-bold">WHERE: Mangalore (Kottara)</span>
                      <span className="border border-black bg-white text-black px-1.5 py-0.5 text-[10px] font-bold flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3 text-black" /> SUPPORTED
                      </span>
                    </div>

                    <div className="border border-black bg-black text-white p-2 flex items-center justify-between">
                      <span className="font-bold text-[#FDFF00]">WHEN: Today (Current)</span>
                      <span className="border border-white bg-[#FF3B00] text-black px-1.5 py-0.5 text-[10px] font-bold flex items-center gap-1">
                        <XCircle className="h-3 w-3 text-black" /> CONTRADICTED
                      </span>
                    </div>
                  </div>

                  <div className="border-t border-black pt-2 flex items-center justify-between text-xs">
                    <span className="font-bold uppercase text-neutral-600">SYNTHESIS:</span>
                    <span className="font-bold uppercase bg-black text-[#FDFF00] px-2 py-0.5">
                      TEMPORAL MISMATCH (AUGUST 2023)
                    </span>
                  </div>
                </div>
              </div>

              <div className="border-t border-black pt-4 space-y-2 text-xs">
                <strong className="uppercase text-black block">[ THREE NUANCED STATES ]</strong>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="border border-black bg-white p-1.5 font-bold uppercase">
                    SUPPORTED
                  </div>
                  <div className="border border-black bg-[#FF3B00] text-black p-1.5 font-bold uppercase">
                    CONTRADICTED
                  </div>
                  <div className="border border-black bg-black text-white p-1.5 font-bold uppercase">
                    INSUFFICIENT
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section: Architecture Pipeline */}
        <section className="space-y-6 pt-4">
          <div className="text-left max-w-3xl space-y-2">
            <div className="inline-block border border-black bg-black text-white px-2 py-0.5 text-xs font-mono font-bold uppercase">
              PIPELINE SPECIFICATION
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl font-black uppercase text-black tracking-tight">
              Investigative Engine Architecture
            </h2>
            <p className="font-mono text-xs sm:text-sm text-black leading-relaxed">
              ContextLock operates as an autonomous forensic laboratory. Every assertion is deconstructed into verified nodes linked to Google Search grounding citations.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-left">
            {/* Step 1 */}
            <div className="border-2 border-black bg-white p-5 space-y-3 flex flex-col justify-between hover:bg-[#F4F1EA] transition-none">
              <div>
                <div className="border-b border-black pb-2 flex items-center justify-between">
                  <span className="text-lg font-black font-serif">[01]</span>
                  <FileSearch className="h-4 w-4 text-black" />
                </div>
                <h3 className="font-serif text-lg font-bold uppercase text-black mt-3">
                  Multimodal Clue Extraction
                </h3>
                <p className="text-xs text-black leading-relaxed mt-2">
                  Gemini analyzes raw media for environmental clues: license plates, language of street signboards, seasonal foliage, weather conditions, and architectural markers.
                </p>
              </div>
              <div className="text-[10px] font-bold uppercase border-t border-black pt-2 text-[#FF3B00]">
                MODALITY: IMAGE + VIDEO
              </div>
            </div>

            {/* Step 2 */}
            <div className="border-2 border-black bg-white p-5 space-y-3 flex flex-col justify-between hover:bg-[#F4F1EA] transition-none">
              <div>
                <div className="border-b border-black pb-2 flex items-center justify-between">
                  <span className="text-lg font-black font-serif">[02]</span>
                  <Layers className="h-4 w-4 text-black" />
                </div>
                <h3 className="font-serif text-lg font-bold uppercase text-black mt-3">
                  Atomic Claim Decomposition
                </h3>
                <p className="text-xs text-black leading-relaxed mt-2">
                  User statements are parsed into isolated WHAT, WHERE, WHEN, and WHO sub-claims using strict JSON schemas to avoid holistic bias.
                </p>
              </div>
              <div className="text-[10px] font-bold uppercase border-t border-black pt-2 text-black">
                SCHEMA: STRUCTURED OUTPUT
              </div>
            </div>

            {/* Step 3 */}
            <div className="border-2 border-black bg-white p-5 space-y-3 flex flex-col justify-between hover:bg-[#F4F1EA] transition-none">
              <div>
                <div className="border-b border-black pb-2 flex items-center justify-between">
                  <span className="text-lg font-black font-serif">[03]</span>
                  <Database className="h-4 w-4 text-black" />
                </div>
                <h3 className="font-serif text-lg font-bold uppercase text-black mt-3">
                  Google Search Grounding
                </h3>
                <p className="text-xs text-black leading-relaxed mt-2">
                  Retrieves live news logs, archival disaster reporting, and official weather metrics with verified timestamps and source URLs.
                </p>
              </div>
              <div className="text-[10px] font-bold uppercase border-t border-black pt-2 text-black">
                TOOL: SEARCH GROUNDING
              </div>
            </div>

            {/* Step 4 */}
            <div className="border-2 border-black bg-white p-5 space-y-3 flex flex-col justify-between hover:bg-[#F4F1EA] transition-none">
              <div>
                <div className="border-b border-black pb-2 flex items-center justify-between">
                  <span className="text-lg font-black font-serif">[04]</span>
                  <FileCheck2 className="h-4 w-4 text-black" />
                </div>
                <h3 className="font-serif text-lg font-bold uppercase text-black mt-3">
                  Traceable Audit Synthesis
                </h3>
                <p className="text-xs text-black leading-relaxed mt-2">
                  Constructs a definitive verdict (e.g. Temporal Mismatch, Geographic Mismatch) accompanied by cited evidence cards and confidence scores.
                </p>
              </div>
              <div className="text-[10px] font-bold uppercase border-t border-black pt-2 text-[#FF3B00]">
                OUTPUT: VERACITY REPORT
              </div>
            </div>
          </div>

          {/* Bottom CTA Strip */}
          <div className="border-2 border-black bg-black text-white p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-mono">
            <div className="space-y-1 text-left">
              <span className="text-xs text-[#FDFF00] font-bold uppercase tracking-widest block">
                [ READY FOR VERIFICATION ]
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold uppercase text-white">
                Enter The Investigation Workspace
              </h3>
            </div>

            <Link
              href="/verify"
              className="inline-flex items-center gap-2 border-2 border-white bg-[#FF3B00] hover:bg-white text-black px-6 py-3.5 text-xs font-bold uppercase tracking-wider transition-none"
            >
              <span>Launch Verification</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

