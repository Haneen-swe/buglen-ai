import { ClipboardIcon, CpuIcon, WrenchIcon } from "./Icons";

const STEPS = [
  {
    n: "01",
    title: "Paste Your Code",
    text: "Drop your code into the editor and choose the programming language.",
    icon: <ClipboardIcon width={28} height={28} />,
  },
  {
    n: "02",
    title: "Let AI Analyze It",
    text: "Your code is validated and analyzed as plain text. Nothing is ever executed.",
    icon: <CpuIcon width={28} height={28} />,
  },
  {
    n: "03",
    title: "Understand & Fix the Issue",
    text: "Read the explanation, see where the problem is, and apply the suggested fix.",
    icon: <WrenchIcon width={28} height={28} />,
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" aria-labelledby="how-heading" className="border-t border-slate-brand/25 bg-night/60 py-16">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Simple by design</p>
          <h2 id="how-heading" className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            How It Works
          </h2>
        </div>
        <ol className="mt-12 grid gap-6 md:grid-cols-3">
          {STEPS.map((s) => (
            <li key={s.n} className="card relative p-6">
              <span className="absolute right-5 top-4 font-mono text-3xl font-bold text-plum/70" aria-hidden="true">
                {s.n}
              </span>
              <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-mauve/30 bg-burgundy/60 text-mauve">
                {s.icon}
              </div>
              <h3 className="text-lg font-semibold">
                <span className="sr-only">Step {s.n}: </span>
                {s.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-offwhite/75">{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
