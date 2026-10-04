import type { ReactNode } from "react";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

export function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <article className="flex items-start gap-4 rounded-2xl border border-slate-brand/30 bg-charcoal/50 p-5 transition-colors hover:border-mauve/50">
      <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-burgundy/60 text-mauve">
        {icon}
      </span>
      <div>
        <h3 className="text-base font-semibold text-offwhite">{title}</h3>
        <p className="mt-1 text-sm leading-relaxed text-offwhite/65">{description}</p>
      </div>
    </article>
  );
}
