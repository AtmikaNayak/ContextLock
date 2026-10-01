import { NextRequest, NextResponse } from "next/server";
import { testGeminiConnection } from "@/lib/gemini-service";

/**
 * Gemini Development & Verification Test Endpoint
 * GET /api/gemini/test
 * POST /api/gemini/test
 *
 * Verifies the full pipeline:
 * Next.js -> Gemini SDK (@google/genai) -> Gemini API -> Structured Response
 *
 * Security & Reliability:
 * - Safely handles missing API keys, API errors, rate limits, and invalid formats.
 * - Never logs or exposes API keys or secrets in responses.
 */

function sanitizeErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    // Strip any possible raw URLs or query parameters that might contain tokens
    return error.message.replace(/key=[a-zA-Z0-9_-]+/gi, "key=[REDACTED]");
  }
  return "An unexpected error occurred during Gemini API execution.";
}

function handleGeminiError(error: unknown) {
  const message = sanitizeErrorMessage(error);
  const errorString = String(error);

  // 1. Missing API Key
  if (
    message.includes("GEMINI_API_KEY is not configured") ||
    !process.env.GEMINI_API_KEY
  ) {
    return NextResponse.json(
      {
        status: "error",
        error: "CONFIGURATION_ERROR",
        message:
          "GEMINI_API_KEY is not configured. Please add GEMINI_API_KEY to your .env.local file.",
      },
      { status: 503 }
    );
  }

  // 2. Rate Limits / Quota Exceeded (HTTP 429 / RESOURCE_EXHAUSTED)
  if (
    errorString.includes("429") ||
    errorString.includes("RESOURCE_EXHAUSTED") ||
    message.toLowerCase().includes("quota") ||
    message.toLowerCase().includes("rate limit")
  ) {
    return NextResponse.json(
      {
        status: "error",
        error: "RATE_LIMIT_EXCEEDED",
        message:
          "Gemini API rate limit or quota exceeded. Please wait a moment before retrying.",
      },
      { status: 429 }
    );
  }

  // 3. Temporary High Demand / Service Unavailable (503 / UNAVAILABLE)
  if (
    errorString.includes("503") ||
    errorString.includes("UNAVAILABLE") ||
    message.toLowerCase().includes("high demand")
  ) {
    return NextResponse.json(
      {
        status: "error",
        error: "SERVICE_TEMPORARILY_UNAVAILABLE",
        message:
          "The Gemini model is temporarily experiencing high regional demand. Spikes are usually momentary; please retry in a few seconds.",
        details: message,
      },
      { status: 503 }
    );
  }

  // 3. Schema or JSON parsing failure
  if (
    message.includes("Failed to parse Gemini response") ||
    message.includes("ZodError") ||
    errorString.includes("validation error")
  ) {
    return NextResponse.json(
      {
        status: "error",
        error: "INVALID_STRUCTURED_RESPONSE",
        message: "Gemini did not return the expected structured JSON schema.",
        details: message,
      },
      { status: 502 }
    );
  }

  // 4. General Upstream API or Network Failure
  return NextResponse.json(
    {
      status: "error",
      error: "GEMINI_API_ERROR",
      message: "Failed to communicate with the Gemini API.",
      details: message,
    },
    { status: 502 }
  );
}

export async function GET() {
  try {
    const result = await testGeminiConnection();

    return NextResponse.json(
      {
        status: "success",
        pipeline:
          "Next.js API Route -> @google/genai SDK -> Gemini API -> Structured JSON Response",
        model: result.model,
        latencyMs: result.latencyMs,
        data: result.response,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[ContextLock API Error] /api/gemini/test failed:", sanitizeErrorMessage(error));
    return handleGeminiError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    let customPrompt: string | undefined;

    try {
      const body = await req.json();
      if (typeof body?.prompt === "string" && body.prompt.trim()) {
        customPrompt = body.prompt.trim();
      } else if (
        typeof body?.mediaDescription === "string" &&
        body.mediaDescription.trim()
      ) {
        customPrompt = body.mediaDescription.trim();
      }
    } catch {
      // Empty or invalid body defaults to sample prompt
    }

    const result = await testGeminiConnection(customPrompt);

    return NextResponse.json(
      {
        status: "success",
        pipeline:
          "Next.js API Route -> @google/genai SDK -> Gemini API -> Structured JSON Response",
        model: result.model,
        latencyMs: result.latencyMs,
        inputPrompt: customPrompt || "Default test prompt",
        data: result.response,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[ContextLock API Error] /api/gemini/test POST failed:", sanitizeErrorMessage(error));
    return handleGeminiError(error);
  }
}
