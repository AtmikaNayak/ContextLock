# ContextLock

> **Real media ≠ truthful context.**
>
> *Verify the context, not just the content.*

ContextLock is an AI-powered media context verification system built for the **Google Gemini Hack Days 2026** hackathon.

---

### Hackathon Track
**Trust in a Synthetic World**

### Team: A²
* **Aakanksha K Poojari**
* **Atmika Nayak**

---

## 1. The Core Insight

An image or video does not have to be AI-generated or manipulated to deceive. 

Someone can take genuine, unedited footage from:
* a different year (*Temporal mismatch*)
* a different location (*Geographic mismatch*)
* a different incident (*Event mismatch*)

and attach a completely misleading claim or caption to it.

> **Example:** A forwarded video claims: *"This video shows today's massive flooding in Mangalore."*  
> The video genuinely depicts severe flooding, and it genuinely happened in Mangalore. But the event happened **years ago**. Conventional "deepfake" or "real vs fake" detectors will flag the pixels as authentic, and the misinformation successfully spreads.

ContextLock solves this by investigating **the claim surrounding the media**, not simply judging whether the media itself is synthetic.

---

## 2. Product Principles

### 1. Beyond Binary "Real vs. Fake"
ContextLock rejects simplistic binary classification. Instead, we produce **claim-level, atomic verification**:
* **Supported:** Evidence corroborates the claim.
* **Contradicted:** Reliable evidence conflicts with the claim.
* **Insufficient Evidence:** Available evidence cannot reliably prove or disprove the claim.

### 2. Evidence-First Architecture
Verification is not an opaque AI verdict:
$$\text{Claim} \longrightarrow \text{Evidence} \longrightarrow \text{Relationship} \longrightarrow \text{Verification}$$
Every conclusion is linked to traceable citations, publication dates, and source reliability.

### 3. Context Mismatch Taxonomies
* **Context Mismatch:** Media is genuine, but the accompanying claim is false.
* **Temporal Mismatch:** Real archival footage presented as current/live.
* **Geographic Mismatch:** Real footage attributed to an unrelated city or country.
* **Event Mismatch:** Genuine footage tied to a different event.
* **Claim-Supported:** Media and claims are corroborated by evidence.
* **Unverified:** Available evidence is insufficient.

---

## 3. The Conceptual Pipeline

```text
                 USER
                  │
                  ▼
          IMAGE / VIDEO + CLAIM
                  │
                  ▼
      ┌────────────────────────┐
      │     GOOGLE GEMINI      │
      │ Multimodal Analysis    │
      └───────────┬────────────┘
                  │
                  ▼
      ┌────────────────────────┐
      │  CLAIM DECOMPOSITION   │
      └───────────┬────────────┘
                  │
        ┌─────────┼─────────┐
        ▼         ▼         ▼
      WHAT      WHERE      WHEN
        │         │         │
        └─────────┼─────────┘
                  ▼
      ┌────────────────────────┐
      │   EVIDENCE RETRIEVAL   │
      │ Google Search Grounding│
      └───────────┬────────────┘
                  │
                  ▼
      ┌────────────────────────┐
      │   CLAIM ↔ EVIDENCE     │
      │  Comparative Reasoning │
      └───────────┬────────────┘
                  │
                  ▼
      ┌────────────────────────┐
      │ CONTEXT VERIFICATION   │
      │        REPORT          │
      └────────────────────────┘
```

---

## 4. Tech Stack & Gemini Architecture

* **Frontend:** [Next.js](https://nextjs.org/) (App Router), TypeScript, [Tailwind CSS](https://tailwindcss.com/)
* **AI Reasoning Layer:** [Google Gemini API](https://ai.google.dev/) via official `@google/genai` SDK
  * **Default Model:** `gemini-3.8-flash` (multimodal reasoning & structured JSON outputs)
  * **Pro Model:** `gemini-3.1-pro-preview` (deep investigative reasoning)
  * **Fast Model:** `gemini-3.5-flash-lite` (high-throughput atomic verification)
* **Validation & Schemas:** [Zod](https://zod.dev/) for runtime type safety and structured AI output schemas
* **API / Backend:** Next.js Route Handlers (`app/api/verify/route.ts`, `app/api/gemini/test/route.ts`)
* **Persistence:** [Supabase](https://supabase.com/) (`@supabase/supabase-js`) for planned case storage & media assets
* **Deployment:** [Vercel](https://vercel.com/)
* **Package Manager:** `pnpm`

### Server-Side Gemini Architecture

```text
┌─────────────────┐       ┌───────────────────────────┐       ┌────────────────────────┐
│     BROWSER     │ ────> │      NEXT.JS BACKEND      │ ────> │   GOOGLE GEMINI API    │
│  Client UI      │ <──── │  Server Route Handlers    │ <──── │   @google/genai SDK    │
│ (No API keys!)  │       │  (lib/gemini.ts + svc)    │       │ (gemini-3.8-flash)     │
└─────────────────┘       └───────────────────────────┘       └────────────────────────┘
```

> [!IMPORTANT]
> **Core Architectural Principles:**
> 1. **Server-Only Execution:** Gemini calls are executed strictly on the server (`import "server-only"` in `lib/gemini.ts` and `lib/gemini-service.ts`). API keys are never exposed, logged, or bundled client-side.
> 2. **Observations ≠ Conclusions:** Media perception strictly extracts objective visual, textual, and temporal indicators. Gemini does NOT determine authenticity or verdict in isolation.
> 3. **Separate Evidence Retrieval:** External evidence retrieval (e.g. Google Search Grounding) is maintained as an independent stage rather than black-box question-answering.
> 4. **Not a Chatbot:** We do NOT implement ContextLock as `User Question -> Gemini -> Answer`. The verification pipeline systematically decomposes claims into atomic dimensions (WHAT, WHERE, WHEN, WHO) and links each to external evidence relationships.

---

## 5. Project Structure

```text
ContextLock/
├── app/
│   ├── layout.tsx              # Root application layout & metadata
│   ├── page.tsx                # Homepage communicating core vision & concept
│   ├── globals.css             # Tailwind v4 styles & theme configuration
│   ├── verify/
│   │   └── page.tsx            # Verification workspace shell & layout
│   └── api/
│       ├── verify/
│       │   └── route.ts        # Next.js Route Handler for verification
│       └── gemini/
│           └── test/
│               └── route.ts    # Development test endpoint (Next.js -> SDK -> Gemini)
│
├── components/
│   ├── Navbar.tsx              # Application header & navigation
│   ├── Footer.tsx              # Hackathon track & team credits
│   ├── ClaimDimensionCard.tsx  # Atomic claim card (WHAT, WHERE, WHEN, WHO)
│   └── EvidenceCard.tsx        # Traceable evidence & source citation card
│
├── lib/
│   ├── gemini.ts               # Server-only Gemini client & model configuration
│   ├── gemini-service.ts       # Gemini service layer (analyzeMedia, stubs, test call)
│   ├── claims.ts               # Claim deconstruction helpers & schemas
│   ├── evidence.ts             # Evidence relationships & reasoning helpers
│   ├── supabase.ts             # Supabase persistence client setup
│   └── utils.ts                # Tailwind class utility (clsx + twMerge)
│
├── types/
│   └── index.ts                # TypeScript interfaces, Zod schemas & Gemini types
│
├── public/                     # Static media & assets
├── .env.local.example          # Environment variables template
├── .gitignore                  # Git ignore rules (protects .env.local)
├── package.json                # Project dependencies & scripts
└── README.md                   # Project documentation
```

---

## 6. Getting Started & Gemini Setup

### Prerequisites
* [Node.js](https://nodejs.org/) (v20+ recommended)
* [pnpm](https://pnpm.io/) (v9+)
* Google Gemini API Key (from [Google AI Studio](https://aistudio.google.com/))

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/aakankshakpoojari/ContextLock.git
   cd ContextLock
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Configure Environment Variables:
   Copy `.env.local.example` to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```
   Add your keys to `.env.local`:
   ```env
   # Google Gemini API Key (Server-only, kept out of git)
   GEMINI_API_KEY=AIzaSy...

   # Optional Model Override (Defaults to gemini-3.8-flash)
   # GEMINI_MODEL=gemini-3.8-flash

   # Supabase Persistence Configuration
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

4. Verify Gemini Connection:
   Start the dev server and test the Gemini endpoint:
   ```bash
   pnpm run dev
   ```
   Navigate to [http://localhost:3000/api/gemini/test](http://localhost:3000/api/gemini/test) in your browser or run:
   ```bash
   curl http://localhost:3000/api/gemini/test
   ```
   This executes the live pipeline:
   `Next.js API Route -> @google/genai SDK -> Gemini 3.8 Flash -> Structured JSON Output`

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 7. Current Status: Gemini Integration Foundation

* ✅ Official `@google/genai` SDK integrated and tested.
* ✅ Server-only client initialization (`lib/gemini.ts`) with zero key leakage.
* ✅ Centralized model configuration using `gemini-3.8-flash`.
* ✅ Modular service layer (`lib/gemini-service.ts`) with `analyzeMedia()` and structured JSON schemas.
* ✅ Separation of visual observations from verification conclusions.
* ✅ Architecture prepared for future multimodal image and video inputs.
* ✅ Development verification endpoint (`/api/gemini/test`) with safe error handling and rate-limiting fallbacks.
* ✅ Clean separation between claim reasoning and downstream external evidence retrieval.
