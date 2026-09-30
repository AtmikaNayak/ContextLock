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

## 4. Tech Stack

* **Frontend:** [Next.js](https://nextjs.org/) (App Router), TypeScript, [Tailwind CSS](https://tailwindcss.com/)
* **AI & Multimodal:** [Google Gemini API](https://ai.google.dev/) via official `@google/genai` SDK
* **Validation:** [Zod](https://zod.dev/) for type-safe schemas and structured AI outputs
* **API / Backend:** Next.js Route Handlers (`app/api/verify/route.ts`)
* **Persistence:** [Supabase](https://supabase.com/) (`@supabase/supabase-js`) for planned case storage & media assets
* **Deployment:** [Vercel](https://vercel.com/)
* **Package Manager:** `pnpm`

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
│       └── verify/
│           └── route.ts        # Next.js Route Handler for verification
│
├── components/
│   ├── Navbar.tsx              # Application header & navigation
│   ├── Footer.tsx              # Hackathon track & team credits
│   ├── ClaimDimensionCard.tsx  # Atomic claim card (WHAT, WHERE, WHEN, WHO)
│   └── EvidenceCard.tsx        # Traceable evidence & source citation card
│
├── lib/
│   ├── gemini.ts               # Gemini client initialization (@google/genai)
│   ├── claims.ts               # Claim deconstruction helpers & schemas
│   ├── evidence.ts             # Evidence relationships & reasoning helpers
│   ├── supabase.ts             # Supabase persistence client setup
│   └── utils.ts                # Tailwind class utility (clsx + twMerge)
│
├── types/
│   └── index.ts                # TypeScript interfaces & Zod validation schemas
│
├── public/                     # Static media & assets
├── .env.local.example          # Environment variables template
├── .gitignore                  # Git ignore rules
├── package.json                # Project dependencies & scripts
└── README.md                   # Project documentation
```

---

## 6. Getting Started

### Prerequisites
* [Node.js](https://nodejs.org/) (v20+ recommended)
* [pnpm](https://pnpm.io/) (v9+)

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
   Add your keys:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   ```

4. Run the development server:
   ```bash
   pnpm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 7. Current Status: Foundation Phase

This repository contains the **clean architectural foundation** for ContextLock:
* ✅ Full TypeScript types & Zod schemas for media, claims, atomic decomposition, and evidence.
* ✅ Modular library layers for Gemini (`@google/genai`), Supabase, claims, and evidence.
* ✅ API Route Handler contract (`/api/verify`) with runtime Zod validation.
* ✅ Modern, dark-mode investigative UI shell (`/` and `/verify`).

### Intentionally Not Implemented in this Step:
* ⏳ Live Gemini multimodal pipeline calls (to be integrated in the next milestone).
* ⏳ Live Google Search grounding retrieval.
* ⏳ Database tables / Supabase migration schemas.
* ⏳ User authentication / accounts.
