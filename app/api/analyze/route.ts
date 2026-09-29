import { NextResponse } from "next/server";
import { AnalysisError, analyzeWithAI, isAiConfigured } from "@/lib/ai";
import { checkRateLimit } from "@/lib/rateLimit";
import type { ApiError } from "@/lib/types";
import { getMaxCodeChars, validateAnalyzeRequest } from "@/lib/validation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Hard cap on the raw request body, independent of the character limit.
const MAX_BODY_BYTES = 200_000;

function errorResponse(error: ApiError, status: number) {
  return NextResponse.json({ error }, { status, headers: { "Cache-Control": "no-store" } });
}

/** Lets the UI know whether live AI analysis is available. Never exposes the key. */
export async function GET() {
  return NextResponse.json(
    { aiConfigured: isAiConfigured(), maxCodeChars: getMaxCodeChars() },
    { headers: { "Cache-Control": "no-store" } },
  );
}

export async function POST(request: Request) {
  const declared = Number(request.headers.get("content-length") ?? 0);
  if (declared > MAX_BODY_BYTES) {
    return errorResponse(
      { code: "INPUT_TOO_LARGE", message: "Your request is too large. Please submit less code." },
      413,
    );
  }

  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
  if (!checkRateLimit(ip)) {
    return errorResponse(
      { code: "RATE_LIMITED", message: "You're analyzing a lot of code. Please wait a minute and try again." },
      429,
    );
  }

  let text: string;
  try {
    text = await request.text();
  } catch {
    return errorResponse({ code: "INVALID_REQUEST", message: "The request could not be read." }, 400);
  }
  if (text.length > MAX_BODY_BYTES) {
    return errorResponse(
      { code: "INPUT_TOO_LARGE", message: "Your request is too large. Please submit less code." },
      413,
    );
  }

  let body: unknown;
  try {
    body = JSON.parse(text);
  } catch {
    return errorResponse({ code: "INVALID_REQUEST", message: "The request could not be understood." }, 400);
  }

  const validation = validateAnalyzeRequest(body);
  if (!validation.ok) {
    const status = validation.error.code === "INPUT_TOO_LARGE" ? 413 : 400;
    return errorResponse(validation.error, status);
  }

  try {
    const result = await analyzeWithAI(validation.value.code, validation.value.language);
    return NextResponse.json({ result }, { headers: { "Cache-Control": "no-store" } });
  } catch (err) {
    if (err instanceof AnalysisError) {
      return errorResponse(err.apiError, err.status);
    }
    // Unknown failure: log a generic marker only (never the code or keys).
    console.error("analyze: unexpected error");
    return errorResponse(
      { code: "AI_FAILURE", message: "Something went wrong while analyzing your code. Please try again." },
      500,
    );
  }
}
