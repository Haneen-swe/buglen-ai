"use client";

import type { HistoryEntry } from "@/lib/types";
import { highestSeverity } from "@/lib/validation";
import { getLanguage } from "@/lib/languages";
import { HistoryIcon, TrashIcon } from "./Icons";
import { SeverityBadge } from "./SeverityBadge";

interface RecentAnalysesProps {
  entries: HistoryEntry[];
  activeId?: string | null;
  onOpen: (entry: HistoryEntry) => void;
  onClear: () => void;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "Unknown date";
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function RecentAnalyses({ entries, activeId, onOpen, onClear }: RecentAnalysesProps) {
  return (
    <section aria-labelledby="recent-heading" className="card p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 id="recent-heading" className="flex items-center gap-2 text-lg font-semibold">
          <HistoryIcon width={20} height={20} className="text-mauve" />
          Recent Analyses
        </h2>
        {entries.length > 0 && (
          <button type="button" onClick={onClear} className="btn-ghost !min-h-[40px] !px-3 !py-1.5">
            <TrashIcon width={16} height={16} /> Clear History
          </button>
        )}
      </div>

      {entries.length === 0 ? (
        <p className="mt-3 text-sm text-offwhite/75">
          Your recent analyses will appear here. They are saved only in this browser.
        </p>
      ) : (
        <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {entries.map((e) => {
            const count = e.result.issues.length;
            const label = getLanguage(e.language)?.label ?? e.language;
            return (
              <li key={e.id}>
                <button
                  type="button"
                  onClick={() => onOpen(e)}
                  aria-current={activeId === e.id ? "true" : undefined}
                  className={`w-full rounded-xl border p-4 text-left transition-colors hover:border-mauve ${
                    activeId === e.id ? "border-mauve bg-plum/30" : "border-slate-brand/40 bg-charcoal/60"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold">{label}</span>
                    <SeverityBadge severity={highestSeverity(e.result.issues)} />
                  </div>
                  <p className="mt-2 text-sm text-offwhite/85">
                    {count === 0 ? "No issues detected" : `${count} issue${count === 1 ? "" : "s"} detected`}
                    {e.demo ? " · Demo" : ""}
                  </p>
                  <p className="mt-1 text-xs text-offwhite/65">
                    <time dateTime={e.createdAt}>{formatDate(e.createdAt)}</time>
                  </p>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
