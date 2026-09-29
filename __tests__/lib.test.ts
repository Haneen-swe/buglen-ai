import { beforeEach, describe, expect, it } from "vitest";
import { SAMPLES, findDemoResult, getSample } from "@/lib/samples";
import { LANGUAGES, isSupportedLanguage } from "@/lib/languages";
import { HISTORY_KEY, MAX_HISTORY, clearHistory, loadHistory, saveAnalysis } from "@/lib/storage";
import { validateAiResponse } from "@/lib/validation";

describe("samples / demo mode", () => {
  it("has a sample for every supported language", () => {
    for (const l of LANGUAGES) expect(SAMPLES[l.id]).toBeDefined();
  });

  it("all predefined results pass response validation", () => {
    for (const s of Object.values(SAMPLES)) {
      expect(validateAiResponse(s.result, s.language).ok).toBe(true);
    }
  });

  it("finds the predefined result for unmodified sample code only", () => {
    const py = getSample("python");
    expect(findDemoResult(py.code, "python")?.issues[0].title).toMatch(/colon/i);
    expect(findDemoResult("print('hi')", "python")).toBeNull();
  });

  it("includes the three required sample programs", () => {
    expect(SAMPLES.python.code).toContain("def calculate_average(numbers)\n");
    expect(SAMPLES.javascript.code).toContain("price + taxe");
    expect(SAMPLES.java.code).toContain('int number = "10";');
  });
});

describe("languages", () => {
  it("validates language ids", () => {
    expect(isSupportedLanguage("python")).toBe(true);
    expect(isSupportedLanguage("cpp")).toBe(true);
    expect(isSupportedLanguage("rust")).toBe(false);
    expect(isSupportedLanguage(undefined)).toBe(false);
  });
});

describe("history storage", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });
  const result = { summary: "s", language: "python", issues: [], improvements: [] };

  it("saves, loads and clears entries", () => {
    expect(loadHistory()).toEqual([]);
    saveAnalysis("python", "x = 1", result, false);
    const list = loadHistory();
    expect(list).toHaveLength(1);
    expect(list[0].language).toBe("python");
    clearHistory();
    expect(loadHistory()).toEqual([]);
  });

  it("puts the newest first and caps the list", () => {
    for (let i = 0; i < MAX_HISTORY + 5; i++) saveAnalysis("python", `code ${i}`, result, false);
    const list = loadHistory();
    expect(list).toHaveLength(MAX_HISTORY);
    expect(list[0].code).toBe(`code ${MAX_HISTORY + 4}`);
  });

  it("ignores corrupted storage", () => {
    window.localStorage.setItem(HISTORY_KEY, "{not json");
    expect(loadHistory()).toEqual([]);
    window.localStorage.setItem(HISTORY_KEY, JSON.stringify([{ nope: true }]));
    expect(loadHistory()).toEqual([]);
  });
});
