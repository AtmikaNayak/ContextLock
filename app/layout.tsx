import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ContextLock | AI-Powered Media Context Verification",
  description:
    "Verify the context, not just the content. Real media can carry false context. ContextLock uses Google Gemini to investigate claims attached to images and videos and connect them to evidence.",
  keywords: [
    "ContextLock",
    "Gemini Hack Days 2026",
    "Trust in a Synthetic World",
    "Media Verification",
    "Misinformation",
    "Fact-checking",
    "Multimodal AI",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased bg-slate-950 text-slate-100 flex flex-col min-h-screen selection:bg-cyan-500/20 selection:text-cyan-300`}
      >
        <Navbar />
        <main className="flex-1 investigative-grid">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
