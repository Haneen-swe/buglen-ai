import { parseSeverity } from "@/lib/validation";
import type { Severity } from "@/lib/types";

const STYLES: Record<Severity, string> = {
  CRITICAL: "bg-burgundy text-offwhite border-mauve",
  HIGH: "bg-burgundy/70 text-offwhite border-mauve/70",
  MEDIUM: "bg-plum text-offwhite border-mauve/50",
  LOW: "bg-slate-brand/30 text-offwhite border-slate-brand",
  INFO: "bg-transparent text-offwhite/90 border-slate-brand",
};

// Distinct glyphs so severity never relies on color alone.
const GLYPH: Record<Severity, string> = {
  CRITICAL: "▲▲",
  HIGH: "▲",
  MEDIUM: "◆",
  LOW: "●",
  INFO: "○",
};

export function SeverityBadge({ severity }: { severity: Severity | string }) {
  const s = parseSeverity(severity);
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-bold tracking-wide ${STYLES[s]}`}
    >
      <span aria-hidden="true" className="text-[0.65rem] leading-none text-mauve">
        {GLYPH[s]}
      </span>
      <span>{s}</span>
    </span>
  );
}
