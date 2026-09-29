import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { POST, GET } from "@/app/api/analyze/route";
import { resetRateLimit, checkRateLimit } from "@/lib/rateLimit";

function req(body: unknown, raw = false): Request {
  return new Request("http://localhost/api/analyze", {
    method: "POST",
    headers: { "content-type": "application/json", "x-forwarded-for": "1.2.3.4" },
    body: raw ? (body as string) : JSON.stringify(body),
  });
}

const originalKey = process.env.AI_API_KEY;

beforeEach(() => {
  resetRateLimit();
});

afterEach(() => {
  process.env.AI_API_KEY = originalKey;
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  if (originalKey === undefined) delete process.env.AI_API_KEY;
});

describe("POST /api/analyze error handling", () => {
  it("returns 400 for empty code", async () => {
    const res = await POST(req({ code: "", language: "python" }));
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error.code).toBe("EMPTY_CODE");
  });

  it("returns 400 for unsupported languages", async () => {
    const res = await POST(req({ code: "x", language: "cobol" }));
    expect(res.status).toBe(400);
    expect((await res.json()).error.code).toBe("UNSUPPORTED_LANGUAGE");
  });

  it("returns 413 for oversized code", async () => {
    const res = await POST(req({ code: "a".repeat(20000), language: "python" }));
    expect(res.status).toBe(413);
    expect((await res.json()).error.code).toBe("INPUT_TOO_LARGE");
  });

  it("returns 400 for invalid JSON", async () => {
    const res = await POST(req("{not json", true));
    expect(res.status).toBe(400);
    expect((await res.json()).error.code).toBe("INVALID_REQUEST");
  });

  it("returns a friendly 503 when the API key is missing", async () => {
    delete process.env.AI_API_KEY;
    const res = await POST(req({ code: "print(1)", language: "python" }));
    expect(res.status).toBe(503);
    const json = await res.json();
    expect(json.error.code).toBe("MISSING_API_KEY");
    expect(json.error.message).toMatch(/Demo Mode/);
  });

  it("rate limits repeated requests", async () => {
    let last: Response | undefined;
    for (let i = 0; i < 12; i++) last = await POST(req({ code: "", language: "python" }));
    expect(last?.status).toBe(429);
  });
});

describe("POST /api/analyze with a mocked AI provider", () => {
  const validPayload = {
    summary: "1 issue",
    language: "python",
    issues: [
      { title: "Missing colon", severity: "HIGH", line: 1, description: "d", cause: "c", suggestion: "s", fixedCode: "def f():" },
    ],
    improvements: [],
  };

  function mockProvider(text: string, ok = true, status = 200) {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({
        ok,
        status,
        json: async () => ({ content: [{ type: "text", text }] }),
      })),
    );
  }

  it("returns a validated result and never leaks the key", async () => {
    process.env.AI_API_KEY = "sk-test-secret";
    mockProvider(JSON.stringify(validPayload));
    const res = await POST(req({ code: "def f()", language: "python" }));
    expect(res.status).toBe(200);
    const text = JSON.stringify(await res.json());
    expect(text).toContain("Missing colon");
    expect(text).not.toContain("sk-test-secret");
  });

  it("maps invalid AI output to INVALID_AI_RESPONSE", async () => {
    process.env.AI_API_KEY = "sk-test-secret";
    mockProvider("this is not json");
    const res = await POST(req({ code: "x = 1", language: "python" }));
    expect(res.status).toBe(502);
    expect((await res.json()).error.code).toBe("INVALID_AI_RESPONSE");
  });

  it("maps provider failures to AI_FAILURE without forwarding details", async () => {
    process.env.AI_API_KEY = "sk-test-secret";
    mockProvider("provider secret detail", false, 500);
    const res = await POST(req({ code: "x = 1", language: "python" }));
    expect(res.status).toBe(502);
    const json = await res.json();
    expect(json.error.code).toBe("AI_FAILURE");
    expect(JSON.stringify(json)).not.toContain("provider secret detail");
  });

  it("maps network failures to AI_FAILURE", async () => {
    process.env.AI_API_KEY = "sk-test-secret";
    vi.stubGlobal("fetch", vi.fn(async () => { throw new Error("boom"); }));
    const res = await POST(req({ code: "x = 1", language: "python" }));
    expect(res.status).toBe(502);
    expect((await res.json()).error.code).toBe("AI_FAILURE");
  });
});

describe("GET /api/analyze", () => {
  it("reports configuration status without exposing the key", async () => {
    process.env.AI_API_KEY = "sk-test-secret";
    const json = await (await GET()).json();
    expect(json.aiConfigured).toBe(true);
    expect(JSON.stringify(json)).not.toContain("sk-test-secret");
  });
});

describe("checkRateLimit", () => {
  it("allows up to the limit then blocks, and recovers after the window", () => {
    resetRateLimit();
    expect(checkRateLimit("k", 2, 1000, 0)).toBe(true);
    expect(checkRateLimit("k", 2, 1000, 10)).toBe(true);
    expect(checkRateLimit("k", 2, 1000, 20)).toBe(false);
    expect(checkRateLimit("k", 2, 1000, 1500)).toBe(true);
  });
});
