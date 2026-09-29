import Link from "next/link";
import { FAQ } from "@/components/FAQ";
import { FeatureCard } from "@/components/FeatureCard";
import { HeroPreview } from "@/components/HeroPreview";
import { HowItWorks } from "@/components/HowItWorks";
import {
  BugIcon,
  CodeIcon,
  GraduationIcon,
  LightbulbIcon,
  SparkIcon,
  WrenchIcon,
} from "@/components/Icons";

const FEATURES = [
  {
    title: "AI Bug Detection",
    description: "Identify syntax errors, logical issues, and potential problems in your code.",
    icon: <BugIcon />,
  },
  {
    title: "Clear Explanations",
    description: "Understand why the problem happens with simple developer-friendly explanations.",
    icon: <LightbulbIcon />,
  },
  {
    title: "Smart Fix Suggestions",
    description: "Get practical suggestions and corrected code.",
    icon: <WrenchIcon />,
  },
  {
    title: "Multiple Languages",
    description: "Support Python, JavaScript, TypeScript, Java, C++, and C#.",
    icon: <CodeIcon />,
  },
  {
    title: "Code Quality Tips",
    description: "Receive suggestions that improve readability and maintainability.",
    icon: <SparkIcon />,
  },
  {
    title: "Beginner Friendly",
    description: "Designed to help students and developers learn while debugging.",
    icon: <GraduationIcon />,
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section aria-labelledby="hero-heading" className="relative overflow-hidden bg-gradient-to-b from-night via-charcoal to-charcoal">
        <div className="container-page grid items-center gap-12 py-16 sm:py-20 lg:grid-cols-2 lg:py-24">
          <div>
            <p className="eyebrow">Find bugs. Understand code. Build better.</p>
            <h1 id="hero-heading" className="mt-4 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Find bugs before they find you.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-offwhite/80">
              AI-powered code analysis that helps you detect bugs, understand errors, and write better code.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/analyzer" className="btn-primary">
                Analyze Code
              </Link>
              <Link href="/analyzer?demo=1" className="btn-ghost">
                Try Demo
              </Link>
            </div>
            <p className="mt-4 text-xs text-offwhite/65">
              No sign-up needed. Demo Mode works without any API key.
            </p>
          </div>
          <HeroPreview />
        </div>
      </section>

      {/* Features */}
      <section id="features" aria-labelledby="features-heading" className="py-20">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow">Features</p>
            <h2 id="features-heading" className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Powerful debugging, made simple.
            </h2>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <FeatureCard key={f.title} {...f} />
            ))}
          </div>
        </div>
      </section>

      <HowItWorks />
      <FAQ />

      {/* CTA */}
      <section aria-labelledby="cta-heading" className="bg-night py-16">
        <div className="container-page text-center">
          <h2 id="cta-heading" className="text-2xl font-bold sm:text-3xl">
            Ready to understand your bugs?
          </h2>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/analyzer" className="btn-primary">
              Analyze Code
            </Link>
            <Link href="/analyzer?demo=1" className="btn-secondary">
              Try Demo
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
