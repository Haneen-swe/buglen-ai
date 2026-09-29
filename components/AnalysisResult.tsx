"use client";

import { useState } from "react";
import type { AnalysisResult as Result, Issue } from "@/lib/types";
import { highestSeverity } from "@/lib/validation";
import { AlertIcon, CheckIcon, CopyIcon, RefreshIcon, WrenchIcon } from "./Icons";
import { SeverityBadge } from "./SeverityBadge";

interface AnalysisResultProps {
  result: Result;
  demo?: boolean;
  onApplyFix: (fixedCode: string) => void;
  onAnalyzeAgain: () => void;
  onSelectLine?: (line: number) => void;
  analyzing?: boolean;
}

export function AnalysisResult({
  result,
  demo = false,
  onApplyFix,
  onAnalyzeAgain,
  onSelectLine,
  analyzing = false,
}: AnalysisResultProps) {
  const top = highestSeverity(result.issues);
  const noIssues = result.issues.length === 0;

  return (
    <section aria-labelledby="analysis-heading" className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-burgundy text-mauve">
            <CheckIcon width={18} height={18} />
          </span>
          <h2 id="analysis-heading" className="text-xl font-bold">
            Analysis Complete
          </h2>
        </div>
        <div className="flex items-center gap-2">
          {demo && (
            <span className="rounded-full border border-mauve/60 bg-plum/50 px-2.5 py-0.5 text-xs font-semibold text-offwhite">
              Demo Mode
            </span>
          )}
          <span className="text-sm text-offwhite/75">Severity:</span>
          <SeverityBadge severity={top} />
        </div>
      </div>

      <p className="text-sm leading-relaxed text-offwhite/85">{result.summary}</p>

      {noIssues && (
        <div className="card p-5">
          <p className="font-semibold">No obvious issues detected based on the provided code.</p>
          <p className="mt-1 text-sm text-offwhite/75">
            This is not a guarantee that the code is bug-free. Test it and review it before relying on it.
          </p>
        </div>
      )}

      <ol className="space-y-4">
        {result.issues.map((issue, idx) => (
          <li key={`${issue.title}-${idx}`}>
            <IssueCard
              issue={issue}
              index={idx + 1}
              onApplyFix={onApplyFix}
              onSelectLine={onSelectLine}
            />
          </li>
        ))}
      </ol>

      {result.improvements.length > 0 && (
        <div className="card p-5">
          <h3 className="mb-3 text-base font-semibold text-mauve">Code improvement suggestions</h3>
          <ul className="list-disc space-y-1.5 pl-5 text-sm text-offwhite/85 marker:text-mauve">
            {result.improvements.map((tip, i) => (
              <li key={i}>{tip}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex justify-end">
        <button type="button" className="btn-ghost" onClick={onAnalyzeAgain} disabled={analyzing}>
          <RefreshIcon width={18} height={18} /> Analyze Again
        </button>
      </div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wider text-mauve">{label}</dt>
      <dd className="mt-1 text-sm leading-relaxed text-offwhite/90">{children}</dd>
    </div>
  );
}

function IssueCard({
  issue,
  index,
  onApplyFix,
  onSelectLine,
}: {
  issue: Issue;
  index: number;
  onApplyFix: (code: string) => void;
  onSelectLine?: (line: number) => void;
}) {
  const [copied, setCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(issue.fixedCode);
      setCopied(true);
      setCopyFailed(false);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopyFailed(true);
      window.setTimeout(() => setCopyFailed(false), 3000);
    }
  }

  return (
    <article className="card p-5">
      <header className="flex flex-wrap items-start justify-between gap-2">
        <h3 className="flex items-start gap-2 text-base font-semibold">
          <AlertIcon width={20} height={20} className="mt-0.5 shrink-0 text-mauve" />
          <span>
            <span className="sr-only">Issue {index}: </span>
            {issue.title}
          </span>
        </h3>
        <SeverityBadge severity={issue.severity} />
      </header>

      <dl className="mt-4 space-y-3">
        <Field label="Explanation">{issue.description}</Field>
        <Field label="Location">
          {issue.line > 0 ? (
            onSelectLine ? (
              <button
                type="button"
                onClick={() => onSelectLine(issue.line)}
                className="rounded-md border border-slate-brand/50 px-2 py-0.5 font-mono text-xs hover:border-mauve hover:text-mauve"
                aria-label={`Go to line ${issue.line} in the editor`}
              >
                Line {issue.line}
              </button>
            ) : (
              <span className="font-mono text-xs">Line {issue.line}</span>
            )
          ) : (
            "Not specified"
          )}
        </Field>
        <Field label="Possible cause">{issue.cause}</Field>
        <Field label="Suggested fix">{issue.suggestion}</Field>
      </dl>

      {issue.fixedCode && (
        <div className="mt-4">
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-mauve">Corrected code</p>
          <pre className="max-h-64 overflow-auto rounded-xl border border-slate-brand/40 bg-charcoal p-4 font-mono text-[13px] leading-relaxed text-offwhite">
            <code>{issue.fixedCode}</code>
          </pre>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <button type="button" className="btn-primary" onClick={() => onApplyFix(issue.fixedCode)}>
              <WrenchIcon width={18} height={18} /> Apply Fix
            </button>
            <button type="button" className="btn-secondary" onClick={copy}>
              {copied ? <CheckIcon width={18} height={18} /> : <CopyIcon width={18} height={18} />}
              {copied ? "Copied" : "Copy Fix"}
            </button>
            <span role="status" aria-live="polite" className="text-xs text-offwhite/80">
              {copyFailed ? "Couldn't copy automatically. Select the code and copy it manually." : ""}
            </span>
          </div>
        </div>
      )}
    </article>
  );
}
