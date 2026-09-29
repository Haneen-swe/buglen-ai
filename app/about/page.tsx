import type { Metadata } from "next";
import Link from "next/link";
import { FAQ } from "@/components/FAQ";
import { BugIcon, GraduationIcon, LightbulbIcon, ShieldIcon, SparkIcon } from "@/components/Icons";

export const metadata: Metadata = {
  title: "About",
  description: "About BugLens AI, an AI-powered developer tool for understanding and resolving code issues.",
};

const FOCUS = [
  { title: "AI-assisted debugging", text: "Detect issues and get concrete, actionable fixes.", icon: <BugIcon /> },
  { title: "Developer productivity", text: "Spend less time deciphering errors and more time building.", icon: <SparkIcon /> },
  { title: "Learning through code explanations", text: "Every issue comes with a cause, so you learn as you debug.", icon: <LightbulbIcon /> },
  { title: "Software quality", text: "Improvement tips promote readable, maintainable code.", icon: <ShieldIcon /> },
  { title: "Accessible developer tools", text: "A clear, keyboard-friendly interface that works on any device.", icon: <GraduationIcon /> },
];

export default function AboutPage() {
  return (
    <>
      <section aria-labelledby="about-heading" className="bg-gradient-to-b from-night to-charcoal py-16 sm:py-20">
        <div className="container-page max-w-3xl">
          <p className="eyebrow">About</p>
          <h1 id="about-heading" className="mt-2 text-4xl font-extrabold tracking-tight sm:text-5xl">
            About BugLens AI
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-offwhite/85">
            BugLens AI is an AI-powered developer tool designed to help programmers understand and resolve code
            issues more effectively.
          </p>
          <p className="mt-4 leading-relaxed text-offwhite/75">
            It was built as a Software Engineering portfolio project that combines a modern React front end,
            a secure server-side API, and an AI model that returns structured, validated analysis.
          </p>
        </div>
      </section>

      <section aria-labelledby="focus-heading" className="py-16">
        <div className="container-page">
          <h2 id="focus-heading" className="text-2xl font-bold sm:text-3xl">
            What the project focuses on
          </h2>
          <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FOCUS.map((f) => (
              <li key={f.title} className="card flex gap-4 p-5">
                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-mauve/30 bg-burgundy/60 text-mauve">
                  {f.icon}
                </span>
                <div>
                  <h3 className="font-semibold">{f.title}</h3>
                  <p className="mt-1 text-sm text-offwhite/75">{f.text}</p>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-10">
            <Link href="/analyzer" className="btn-primary">
              Analyze Code
            </Link>
          </div>
        </div>
      </section>

      <div className="bg-night">
        <FAQ />
      </div>
    </>
  );
}
