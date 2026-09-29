import { describe, expect, it } from "vitest";
import {
  extractJson,
  highestSeverity,
  parseSeverity,
  validateAiResponse,
  validateAnalyzeRequest,
} from "@/lib/validation";

describe("validateAnalyzeRequest", () => {
  it("rejects empty code with a friendly message", () => {
    const r = validateAnalyzeRequest({ code: "   \n ", language: "python" });
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.error.code).toBe("EMPTY_CODE");
      expect(r.error.message).toBe("Please enter some code before starting the analysis.");
    }
  });

  it("rejects missing or non-string code", () => {
    expect(validateAnalyzeRequest({ language: "python" }).ok).toBe(false);
    expect(validateAnalyzeRequest({ code: 42, language: "python" }).ok).toBe(false);
  });

  it("rejects non-object bodies", () => {
    for (const body of [null, undefined, "x", 12]) {
      const r = validateAnalyzeRequest(body);
      expect(r.ok).toBe(false);
      if (!r.ok) expect(r.error.code).toBe("INVALID_REQUEST");
    }
  });

  it("accepts every supported language", () => {
    for (const language of ["python", "javascript", "typescript", "java", "cpp", "csharp"]) {
      expect(validateAnalyzeRequest({ code: "x", language }).ok).toBe(true);
    }
  });

  it("rejects unsupported languages", () => {
    const r = validateAnalyzeRequest({ code: "puts 1", language: "ruby" });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("UNSUPPORTED_LANGUAGE");
    expect(validateAnalyzeRequest({ code: "x" }).ok).toBe(false);
  });

  it("rejects input over the size limit", () => {
    const r = validateAnalyzeRequest({ code: "a".repeat(101), language: "python" }, 100);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("INPUT_TOO_LARGE");
    expect(validateAnalyzeRequest({ code: "a".repeat(100), language: "python" }, 100).ok).toBe(true);
  });

  it("keeps code as an untouched string", () => {
    const code = "eval('1+1'); // treated as text";
    const r = validateAnalyzeRequest({ code, language: "javascript" });
    expect(r.ok && r.value.code).toBe(code);
  });
});

describe("parseSeverity", () => {
  it("parses valid severities case-insensitively", () => {
    expect(parseSeverity("critical")).toBe("CRITICAL");
    expect(parseSeverity(" High ")).toBe("HIGH");
    expect(parseSeverity("MEDIUM")).toBe("MEDIUM");
    expect(parseSeverity("low")).toBe("LOW");
    expect(parseSeverity("Info")).toBe("INFO");
  });

  it("falls back to MEDIUM for unknown values", () => {
    expect(parseSeverity("severe")).toBe("MEDIUM");
    expect(parseSeverity(undefined)).toBe("MEDIUM");
    expect(parseSeverity(3)).toBe("MEDIUM");
  });
});

describe("highestSeverity", () => {
  it("returns INFO with no issues", () => {
    expect(highestSeverity([])).toBe("INFO");
  });
  it("picks the most severe issue", () => {
    expect(highestSeverity([{ severity: "LOW" }, { severity: "HIGH" }, { severity: "INFO" }])).toBe("HIGH");
    expect(highestSeverity([{ severity: "MEDIUM" }, { severity: "CRITICAL" }])).toBe("CRITICAL");
  });
});

describe("validateAiResponse", () => {
  const good = {
    summary: "1 issue",
    language: "python",
    issues: [
      {
        title: "Missing colon",
        severity: "high",
        line: 1,
        description: "d",
        cause: "c",
        suggestion: "s",
        fixedCode: "def f():\n    pass",
      },
    ],
    improvements: ["Add a docstring"],
  };

  it("accepts and normalises a valid response", () => {
    const r = validateAiResponse(good, "python");
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.value.issues[0].severity).toBe("HIGH");
      expect(r.value.improvements).toEqual(["Add a docstring"]);
    }
  });

  it("handles the no-issues shape without claiming the code is bug-free", () => {
    const r = validateAiResponse(
      { summary: "No obvious issues detected.", issues: [], improvements: [] },
      "java",
    );
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.value.issues).toEqual([]);
      expect(r.value.language).toBe("java");
      expect(r.value.summary).not.toMatch(/bug-free|guarantee/i);
    }
  });

  it("supplies a safe summary when none is given", () => {
    const r = validateAiResponse({ issues: [], improvements: [] }, "python");
    expect(r.ok && r.value.summary).toBe("No obvious issues detected based on the provided code.");
  });

  it("rejects non-object responses", () => {
    for (const bad of [null, "text", 5, [], undefined]) {
      const r = validateAiResponse(bad, "python");
      expect(r.ok).toBe(false);
      if (!r.ok) expect(r.error.code).toBe("INVALID_AI_RESPONSE");
    }
  });

  it("rejects malformed issue lists", () => {
    expect(validateAiResponse({ issues: "nope" }, "python").ok).toBe(false);
    expect(validateAiResponse({ issues: [null] }, "python").ok).toBe(false);
    expect(validateAiResponse({ issues: [{ severity: "HIGH" }] }, "python").ok).toBe(false);
  });

  it("coerces bad line numbers and unknown severities safely", () => {
    const r = validateAiResponse(
      { issues: [{ title: "t", severity: "weird", line: "abc" }], improvements: [] },
      "python",
    );
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.value.issues[0].line).toBe(0);
      expect(r.value.issues[0].severity).toBe("MEDIUM");
    }
  });

  it("filters non-string improvements and caps list sizes", () => {
    const r = validateAiResponse(
      {
        issues: Array.from({ length: 50 }, (_, i) => ({ title: `t${i}` })),
        improvements: ["ok", 5, "", null, "also ok"],
      },
      "python",
    );
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.value.issues.length).toBe(20);
      expect(r.value.improvements).toEqual(["ok", "also ok"]);
    }
  });
});

describe("extractJson", () => {
  it("parses plain JSON", () => {
    expect(extractJson('{"a":1}')).toEqual({ a: 1 });
  });
  it("parses JSON inside code fences", () => {
    expect(extractJson('```json\n{"a":2}\n```')).toEqual({ a: 2 });
  });
  it("finds JSON embedded in prose", () => {
    expect(extractJson('Here you go: {"a":3} hope it helps')).toEqual({ a: 3 });
  });
  it("returns null for unparseable text", () => {
    expect(extractJson("not json at all")).toBeNull();
  });
});
