import Link from "next/link";
import { ShieldCheck, Search, Sparkles } from "lucide-react";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <ShieldCheck className="h-5 w-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-white group-hover:text-cyan-400 transition-colors">
              Context<span className="text-cyan-400">Lock</span>
            </span>
            <span className="text-[10px] tracking-wider uppercase text-slate-400 -mt-1 font-mono">
              Media Context Verification
            </span>
          </div>
        </Link>

        <div className="hidden sm:flex items-center gap-3">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-400">
            <Sparkles className="h-3 w-3 text-cyan-400 animate-pulse" />
            <span>Google Gemini Hack Days 2026</span>
          </div>
          <div className="rounded-full border border-slate-700/60 bg-slate-900/60 px-2.5 py-1 text-xs text-slate-300 font-mono">
            Track: Trust in a Synthetic World
          </div>
        </div>

        <nav className="flex items-center gap-3">
          <Link
            href="/"
            className="text-sm font-medium text-slate-300 hover:text-white transition-colors px-3 py-1.5 rounded-md hover:bg-slate-850"
          >
            Overview
          </Link>
          <Link
            href="/verify"
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-blue-500/25 transition-all hover:shadow-blue-500/40 hover:-translate-y-0.5 active:translate-y-0"
          >
            <Search className="h-4 w-4" />
            <span>Verify Media</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
