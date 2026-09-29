"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnalysisResult } from "@/components/AnalysisResult";
import { CodeEditor } from "@/components/CodeEditor";
import { AlertIcon, PlayIcon, TrashIcon, BugIcon } from "@/components/Icons";
import { RecentAnalyses } from "@/components/RecentAnalyses";
import { LANGUAGES, getLanguage } from "@/lib/languages";
import { findDemoResult, getSample } from "@/lib/samples";
import { clearHistory, loadHistory, saveAnalysis } from "@/lib/storage";
import type { AnalysisResult as Result, ApiError, HistoryEntry } from "@/lib/types";
import { DEFAULT_MAX_CODE_CHARS, validateAiResponse } from "@/lib/validation";

type Status = "idle" | "loading" | "done" | "error";

export function AnalyzerClient() {
  const params = useSearchParams();
  const startInDemo = params.get("demo") === "1";

  const [language, setLanguage] = useState("python");
  const [code, setCode] = useState("");
  const [demo, setDemo] = useState(startInDemo);
  const [status, setStatus] = useState<Status>("idle");
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<ApiError | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [revealLine, setRevealLine] = useState<number | null>(null);
  const [maxChars, setMaxChars] = useState(DEFAULT_MAX_CODE_CHARS);
  const resultRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const monacoLang = getLanguage(language)?.monaco ?? "plaintext";

  // Initial load: history, server limits, and demo sample.
  useEffect(() => {
    setHistory(loadHistory());
    if (startInDemo) {
      const sample = getSample("python");
      setCode(sample.code);
    }
    fetch("/api/analyze")
      .then((r) => (r.ok ? r.json() : null))
      .then((data: { maxCodeChars?: number } | null) => {
        if (data?.maxCodeChars) setMaxChars(data.maxCodeChars);
      })
      .catch(() => undefined);
    return () => abortRef.current?.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const highlightLines = useMemo(
    () => (result ? result.issues.map((i) => i.line).filter((l) => l > 0) : []),
    [result],
  );

  const loading = status === "loading";

  const resetOutput = useCallback(() => {
    setResult(null);
    setError(null);
    setStatus("idle");
    setActiveId(null);
  }, []);

  function handleLanguageChange(next: string) {
    setLanguage(next);
    resetOutput();
  }

  function handleLoadExample() {
    const sample = getSample(language);
    setCode(sample.code);
    resetOutput();
  }

  function handleClear() {
    abortRef.current?.abort();
    setCode("");
    resetOutput();
  }

  function finish(res: Result, isDemo: boolean, sourceCode: string) {
    setResult(res);
    setStatus("done");
    const next = saveAnalysis(language, sourceCode, res, isDemo);
    setHistory(next);
    setActiveId(next[0]?.id ?? null);
    window.setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      resultRef.current?.focus({ preventScroll: true });
    }, 50);
  }

  function fail(err: ApiError) {
    setError(err);
    setStatus("error");
    setResult(null);
  }

  async function handleAnalyze() {
    if (loading) return;

    if (code.trim().length === 0) {
      fail({ code: "EMPTY_CODE", message: "Please enter some code before starting the analysis." });
      return;
    }
    if (code.length > maxChars) {
      fail({
        code: "INPUT_TOO_LARGE",
        message: `Your code is too long. Please keep it under ${maxChars.toLocaleString("en-US")} characters.`,
      });
      return;
    }

    setError(null);
    setResult(null);
    setStatus("loading");

    if (demo) {
      // Demo Mode: predefined results, no network or API key needed.
      await new Promise((r) => setTimeout(r, 700));
      const found = findDemoResult(code, language);
      if (found) {
        finish(found, true, code);
      } else {
        fail({
          code: "INVALID_REQUEST",
          message:
            "Demo Mode only analyzes the built-in examples. Click “Load Example” to try one, or switch off Demo Mode to use live AI analysis.",
        });
      }
      return;
    }

    const controller = new AbortController();
    abortRef.current = controller;
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ code, language }),
        signal: controller.signal,
      });
      let data: unknown = null;
      try {
        data = await res.json();
      } catch {
        /* handled below */
      }

      if (!res.ok) {
        const apiErr = (data as { error?: ApiError } | null)?.error;
        fail(
          apiErr?.message
            ? apiErr
            : { code: "AI_FAILURE", message: "The analysis failed. Please try again." },
        );
        return;
      }

      // Defence in depth: validate again on the client before rendering.
      const validated = validateAiResponse((data as { result?: unknown } | null)?.result, language);
      if (!validated.ok) {
        fail(validated.error);
        return;
      }
      finish(validated.value, false, code);
    } catch (e) {
      if ((e as { name?: string }).name === "AbortError") return;
      fail({
        code: "NETWORK_ERROR",
        message: "We couldn't reach the server. Check your internet connection and try again.",
      });
    }
  }

  function handleOpenHistory(entry: HistoryEntry) {
    setLanguage(entry.language);
    setCode(entry.code);
    setDemo(entry.demo);
    setResult(entry.result);
    setError(null);
    setStatus("done");
    setActiveId(entry.id);
  }

  function handleClearHistory() {
    clearHistory();
    setHistory([]);
    setActiveId(null);
  }

  function toggleDemo() {
    const next = !demo;
    setDemo(next);
    resetOutput();
    if (next && code.trim().length === 0) setCode(getSample(language).code);
  }

  return (
    <div className="container-page py-8 sm:py-10">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Analyzer</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">Analyze your code</h1>
          <p className="mt-2 max-w-2xl text-sm text-offwhite/75">
            Paste code, pick a language, and get an explanation of what is wrong and how to fix it. Your code
            is analyzed as plain text and never executed.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {demo && (
            <span
              className="rounded-full border border-mauve/60 bg-plum/50 px-3 py-1 text-xs font-semibold"
              role="status"
            >
              Demo Mode
            </span>
          )}
          <button
            type="button"
            onClick={toggleDemo}
            aria-pressed={demo}
            className="btn-ghost !min-h-[40px] !px-3 !py-1.5"
          >
            {demo ? "Exit Demo Mode" : "Try Demo"}
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="card mb-4 flex flex-wrap items-center gap-3 p-3 sm:p-4">
        <div className="flex items-center gap-2">
          <label htmlFor="language" className="text-sm font-medium text-offwhite/85">
            Language
          </label>
          <select
            id="language"
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="min-h-[44px] rounded-xl border border-slate-brand/60 bg-charcoal px-3 text-sm text-offwhite"
          >
            {LANGUAGES.map((l) => (
              <option key={l.id} value={l.id}>
                {l.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-1 flex-wrap items-center gap-2 sm:justify-end">
          <button type="button" className="btn-secondary" onClick={handleLoadExample}>
            <BugIcon width={18} height={18} /> Load Example
          </button>
          <button type="button" className="btn-ghost" onClick={handleClear}>
            <TrashIcon width={18} height={18} /> Clear
          </button>
          <button
            type="button"
            className="btn-primary min-w-[150px]"
            onClick={handleAnalyze}
            disabled={loading}
            aria-busy={loading}
          >
            {loading ? (
              <>
                <Spinner /> Analyzing…
              </>
            ) : (
              <>
                <PlayIcon width={18} height={18} /> Analyze Code
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* LEFT: editor */}
        <section aria-labelledby="editor-heading" className="min-w-0">
          <h2 id="editor-heading" className="sr-only">
            Code editor
          </h2>
          <div className="overflow-hidden rounded-2xl border border-slate-brand/40 bg-night shadow-card">
            <div className="flex items-center justify-between border-b border-slate-brand/30 px-4 py-2 text-xs text-offwhite/70">
              <span className="font-mono">{getLanguage(language)?.label}</span>
              <span>
                {code.length.toLocaleString("en-US")} / {maxChars.toLocaleString("en-US")} characters
              </span>
            </div>
            <div className="h-[380px] sm:h-[460px] lg:h-[560px]">
              <CodeEditor
                value={code}
                onChange={setCode}
                language={monacoLang}
                highlightLines={highlightLines}
                revealLine={revealLine}
                ariaLabel={`${getLanguage(language)?.label ?? "Code"} editor`}
              />
            </div>
          </div>
          <p className="mt-2 text-xs text-offwhite/65">
            Keyboard tip: press Ctrl+M (Cmd+Shift+M on Mac) to let Tab move focus out of the editor.
          </p>
        </section>

        {/* RIGHT: results */}
        <div className="min-w-0" ref={resultRef} tabIndex={-1} aria-live="polite">
          {status === "idle" && <EmptyState />}
          {status === "loading" && <LoadingState />}
          {status === "error" && error && <ErrorState error={error} onDemo={!demo ? toggleDemo : undefined} />}
          {status === "done" && result && (
            <AnalysisResult
              result={result}
              demo={demo}
              analyzing={loading}
              onApplyFix={(fixed) => {
                setCode(fixed);
                setRevealLine(1);
              }}
              onAnalyzeAgain={handleAnalyze}
              onSelectLine={(line) => {
                // Toggle to re-trigger reveal even for the same line.
                setRevealLine(null);
                window.setTimeout(() => setRevealLine(line), 0);
              }}
            />
          )}
        </div>
      </div>

      <div className="mt-10">
        <RecentAnalyses
          entries={history}
          activeId={activeId}
          onOpen={handleOpenHistory}
          onClear={handleClearHistory}
        />
      </div>
    </div>
  );
}

function Spinner() {
  return (
    <svg className="bl-spinner" width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.3" strokeWidth="3" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

function EmptyState() {
  return (
    <div className="card flex min-h-[260px] flex-col items-center justify-center p-8 text-center">
      <span className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-mauve/30 bg-burgundy/60 text-mauve">
        <BugIcon width={28} height={28} />
      </span>
      <h2 className="text-lg font-semibold">Results will appear here</h2>
      <p className="mt-2 max-w-sm text-sm text-offwhite/75">
        Paste your code on the left and click <strong>Analyze Code</strong>, or load an example to see how
        BugLens AI explains and fixes a bug.
      </p>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="card relative min-h-[260px] overflow-hidden p-8" role="status">
      <div className="bl-scan pointer-events-none absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-transparent via-mauve/20 to-transparent" />
      <div className="relative flex flex-col items-center justify-center gap-4 text-center">
        <Spinner />
        <p className="text-lg font-semibold">Analyzing your code...</p>
        <p className="text-sm text-offwhite/75">Looking for bugs, causes and fixes. This usually takes a few seconds.</p>
        <div className="mt-2 w-full max-w-sm space-y-2" aria-hidden="true">
          <div className="h-3 animate-pulse rounded bg-plum/50" />
          <div className="h-3 w-4/5 animate-pulse rounded bg-plum/40" />
          <div className="h-3 w-3/5 animate-pulse rounded bg-plum/30" />
        </div>
      </div>
    </div>
  );
}

function ErrorState({ error, onDemo }: { error: ApiError; onDemo?: () => void }) {
  const canSuggestDemo = error.code === "MISSING_API_KEY" || error.code === "AI_FAILURE" || error.code === "NETWORK_ERROR";
  return (
    <div className="card border-mauve/50 p-6" role="alert">
      <div className="flex items-start gap-3">
        <AlertIcon width={24} height={24} className="mt-0.5 shrink-0 text-mauve" />
        <div>
          <h2 className="text-lg font-semibold">We couldn&apos;t complete the analysis</h2>
          <p className="mt-1 text-sm leading-relaxed text-offwhite/85">{error.message}</p>
          {canSuggestDemo && onDemo && (
            <button type="button" className="btn-secondary mt-4" onClick={onDemo}>
              Switch to Demo Mode
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
