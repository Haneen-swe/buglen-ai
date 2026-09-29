import { SeverityBadge } from "./SeverityBadge";

/** Static, decorative preview of the analyzer used in the hero section. */
export function HeroPreview() {
  const lines: { n: number; text: string; bad?: boolean }[] = [
    { n: 1, text: "def calculate_average(numbers)", bad: true },
    { n: 2, text: "    total = sum(numbers)" },
    { n: 3, text: "    return total / len(numbers)" },
  ];

  return (
    <div
      className="relative mx-auto w-full max-w-xl"
      role="img"
      aria-label="Preview of the BugLens AI analyzer showing a Python function with a missing colon highlighted and an explanation card."
    >
      <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-burgundy/40 via-plum/20 to-transparent blur-2xl" aria-hidden="true" />
      <div className="relative overflow-hidden rounded-2xl border border-slate-brand/50 bg-night shadow-card">
        <div className="flex items-center gap-2 border-b border-slate-brand/30 px-4 py-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-slate-brand/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-plum" />
          <span className="h-2.5 w-2.5 rounded-full bg-mauve/80" />
          <span className="ml-3 font-mono text-xs text-offwhite/65">average.py</span>
        </div>
        <pre className="overflow-x-auto py-3 font-mono text-[13px] leading-7 sm:text-sm" aria-hidden="true">
          {lines.map((l) => (
            <div
              key={l.n}
              className={`flex px-4 ${l.bad ? "border-l-2 border-mauve bg-burgundy/50" : "border-l-2 border-transparent"}`}
            >
              <span className="mr-4 w-4 select-none text-right text-slate-brand">{l.n}</span>
              <code className="whitespace-pre text-offwhite">
                {l.bad ? (
                  <>
                    <span className="text-mauve">def</span> calculate_average(numbers)
                    <span className="underline decoration-mauve decoration-wavy underline-offset-4">{" "}</span>
                  </>
                ) : (
                  l.text
                )}
              </code>
            </div>
          ))}
        </pre>

        <div className="border-t border-slate-brand/30 bg-charcoal/60 p-4" aria-hidden="true">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-semibold">Missing colon in function declaration</p>
            <SeverityBadge severity="HIGH" />
          </div>
          <p className="mt-1.5 text-xs leading-relaxed text-offwhite/75">
            Python requires a colon after a function declaration. Line 1.
          </p>
          <pre className="mt-3 rounded-lg border border-slate-brand/40 bg-night px-3 py-2 font-mono text-xs text-offwhite">
            <code>
              def calculate_average(numbers)<span className="text-mauve">:</span>
            </code>
          </pre>
        </div>
      </div>
    </div>
  );
}
