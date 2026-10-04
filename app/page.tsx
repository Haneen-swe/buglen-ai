import Link from "next/link";
import { FeatureCard } from "@/components/FeatureCard";
import { HeroPreview } from "@/components/HeroPreview";
import {
  BugIcon,
  CodeIcon,
  GraduationIcon,
  LightbulbIcon,
  SparkIcon,
  WrenchIcon,
} from "@/components/Icons";

const FEATURES = [
  { title: "AI Bug Detection", description: "Syntax, logic and runtime issues.", icon: <BugIcon /> },
  { title: "Clear Explanations", description: "Why it happens, in plain language.", icon: <LightbulbIcon /> },
  { title: "Smart Fix Suggestions", description: "Practical advice and corrected code.", icon: <WrenchIcon /> },
  { title: "Multiple Languages", description: "Python, JavaScript, TypeScript, Java, C++, C#.", icon: <CodeIcon /> },
  { title: "Code Quality Tips", description: "Improve readability and maintainability.", icon: <SparkIcon /> },
  { title: "Beginner Friendly", description: "Learn while you debug.", icon: <GraduationIcon /> },
];

export default function HomePage() {
  return (
    <>
      <section aria-labelledby="hero-heading">
        <div className="container-page grid items-center gap-12 py-16 sm:py-24 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:py-28">
          <div>
            <h1
              id="hero-heading"
              className="text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl"
            >
              Debug with <span className="text-mauve">clarity.</span>
            </h1>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-offwhite/75">
              Paste your code. Get the cause and the fix.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/analyzer" className="btn-primary">
                Analyze Code
              </Link>
              <Link href="/analyzer?demo=1" className="btn-ghost">
                Try Demo
              </Link>
            </div>
          </div>
          <HeroPreview />
        </div>
      </section>

      <section id="features" aria-label="Features" className="border-t border-slate-brand/25 bg-night/60">
        <div className="container-page py-14 sm:py-16">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <FeatureCard key={f.title} {...f} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
