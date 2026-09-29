import { ChevronIcon } from "./Icons";

export const FAQ_ITEMS = [
  {
    q: "Does BugLens AI execute my code?",
    a: "No. BugLens AI analyzes submitted code as text and does not execute arbitrary user code.",
  },
  {
    q: "What programming languages are supported?",
    a: "Python, JavaScript, TypeScript, Java, C++, and C#. The language list is a single configuration file, so additional languages can be added easily in the future.",
  },
  {
    q: "How accurate is the AI analysis?",
    a: "The analysis is helpful but not perfect. AI can miss problems or occasionally suggest an incorrect fix, so always review the suggestions and test your code. BugLens AI never guarantees that code is bug-free.",
  },
  {
    q: "Can beginners use BugLens AI?",
    a: "Yes. Explanations are written in simple, developer-friendly language, with the location, the cause, and a corrected version of the code, which makes it a good learning companion.",
  },
  {
    q: "Is my code stored?",
    a: "BugLens AI does not save your code in a database. Your code is sent to the backend only to be analyzed by the AI service. Recent analyses are kept in your own browser (localStorage) and you can remove them at any time with Clear History.",
  },
];

export function FAQ() {
  return (
    <section id="faq" aria-labelledby="faq-heading" className="py-20">
      <div className="container-page max-w-3xl">
        <div className="text-center">
          <p className="eyebrow">Questions</p>
          <h2 id="faq-heading" className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Frequently asked questions
          </h2>
        </div>
        <div className="mt-10 space-y-3">
          {FAQ_ITEMS.map((item) => (
            <details key={item.q} className="card group p-0 open:border-mauve/50">
              <summary className="flex min-h-[56px] cursor-pointer list-none items-center justify-between gap-4 rounded-2xl px-5 py-4 font-semibold">
                {item.q}
                <ChevronIcon
                  width={20}
                  height={20}
                  className="shrink-0 text-mauve transition-transform group-open:rotate-180"
                />
              </summary>
              <p className="px-5 pb-5 text-sm leading-relaxed text-offwhite/80">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
