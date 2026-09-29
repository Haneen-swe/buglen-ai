import { isSupportedLanguage } from "./languages";
import {
  SEVERITIES,
  type AnalysisResult,
  type ApiError,
  type Issue,
  type Severity,
} from "./types";

export const DEFAULT_MAX_CODE_CHARS = 12000;

export function getMaxCodeChars(): number {
  const raw = typeof process !== "undefined" ? process.env.MAX_CODE_CHARS : undefined;
  const n = raw ? Number.parseInt(raw, 10) : NaN;
  return Number.isFinite(n) && n > 0 ? n : DEFAULT_MAX_CODE_CHARS;
}

export interface ValidRequest {
  code: string;
  language: string;
}

export type RequestValidation =
  | { ok: true; value: ValidRequest }
  | { ok: false; error: ApiError };

/** Validate the body of an analysis request. Code is treated as plain text only. */
export function validateAnalyzeRequest(
  body: unknown,
  maxChars: number = getMaxCodeChars(),
): RequestValidation {
  if (typeof body !== "object" || body === null) {
    return fail("INVALID_REQUEST", "The request could not be understood.");
  }
  const { code, language } = body as Record<string, unknown>;

  if (typeof code !== "string" || code.trim().length === 0) {
    return fail("EMPTY_CODE", "Please enter some code before starting the analysis.");
  }
  if (!isSupportedLanguage(language)) {
    return fail(
      "UNSUPPORTED_LANGUAGE",
      "That language is not supported yet. Choose Python, JavaScript, TypeScript, Java, C++, or C#.",
    );
  }
  if (code.length > maxChars) {
    return fail(
      "INPUT_TOO_LARGE",
      `Your code is too long. Please keep it under ${maxChars.toLocaleString("en-US")} characters.`,
    );
  }
  return { ok: true, value: { code, language } };
}

function fail(code: ApiError["code"], message: string): { ok: false; error: ApiError } {
  return { ok: false, error: { code, message } };
}

/** Parse a severity string defensively. Unknown values fall back to MEDIUM. */
export function parseSeverity(value: unknown): Severity {
  if (typeof value === "string") {
    const upper = value.trim().toUpperCase();
    if ((SEVERITIES as readonly string[]).includes(upper)) return upper as Severity;
  }
  return "MEDIUM";
}

const MAX_TEXT = 4000;
const MAX_ISSUES = 20;
const MAX_IMPROVEMENTS = 15;

function str(value: unknown, max = MAX_TEXT): string {
  return typeof value === "string" ? value.slice(0, max) : "";
}

export type ResponseValidation =
  | { ok: true; value: AnalysisResult }
  | { ok: false; error: ApiError };

/** Validate and normalise the JSON returned by the AI before it reaches the UI. */
export function validateAiResponse(raw: unknown, fallbackLanguage: string): ResponseValidation {
  if (typeof raw !== "object" || raw === null || Array.isArray(raw)) {
    return invalid();
  }
  const obj = raw as Record<string, unknown>;

  if (!Array.isArray(obj.issues) && obj.issues !== undefined) return invalid();
  if (!Array.isArray(obj.improvements) && obj.improvements !== undefined) return invalid();

  const issues: Issue[] = [];
  for (const item of ((obj.issues as unknown[]) ?? []).slice(0, MAX_ISSUES)) {
    if (typeof item !== "object" || item === null) return invalid();
    const i = item as Record<string, unknown>;
    const title = str(i.title, 200);
    if (!title) return invalid();
    const lineNum = typeof i.line === "number" ? Math.trunc(i.line) : Number.parseInt(String(i.line), 10);
    issues.push({
      title,
      severity: parseSeverity(i.severity),
      line: Number.isFinite(lineNum) && lineNum > 0 ? lineNum : 0,
      description: str(i.description),
      cause: str(i.cause),
      suggestion: str(i.suggestion),
      fixedCode: str(i.fixedCode, 12000),
    });
  }

  const improvements = ((obj.improvements as unknown[]) ?? [])
    .filter((x): x is string => typeof x === "string" && x.trim().length > 0)
    .slice(0, MAX_IMPROVEMENTS)
    .map((x) => x.slice(0, 500));

  const summary =
    str(obj.summary, 600) ||
    (issues.length === 0
      ? "No obvious issues detected based on the provided code."
      : `${issues.length} issue${issues.length === 1 ? "" : "s"} detected.`);

  return {
    ok: true,
    value: {
      summary,
      language: str(obj.language, 40) || fallbackLanguage,
      issues,
      improvements,
    },
  };
}

function invalid(): { ok: false; error: ApiError } {
  return {
    ok: false,
    error: {
      code: "INVALID_AI_RESPONSE",
      message: "The AI returned a response we couldn't read. Please try again.",
    },
  };
}

/** Return the highest severity among issues, or INFO when there are none. */
export function highestSeverity(issues: Pick<Issue, "severity">[]): Severity {
  if (issues.length === 0) return "INFO";
  return issues.reduce<Severity>(
    (top, i) => (SEVERITIES.indexOf(i.severity) < SEVERITIES.indexOf(top) ? i.severity : top),
    "INFO",
  );
}

/** Extract a JSON object from model output that may be wrapped in code fences or prose. */
export function extractJson(text: string): unknown {
  const trimmed = text.trim();
  try {
    return JSON.parse(trimmed);
  } catch {
    /* fall through */
  }
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenced) {
    try {
      return JSON.parse(fenced[1].trim());
    } catch {
      /* fall through */
    }
  }
  const start = trimmed.indexOf("{");
  const end = trimmed.lastIndexOf("}");
  if (start !== -1 && end > start) {
    try {
      return JSON.parse(trimmed.slice(start, end + 1));
    } catch {
      /* fall through */
    }
  }
  return null;
}
