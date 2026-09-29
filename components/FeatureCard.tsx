import type { ReactNode } from "react";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

export function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <article className="card group p-6 transition-colors hover:border-mauve/60">
      <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl border border-mauve/30 bg-burgundy/60 text-mauve">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-offwhite">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-offwhite/75">{description}</p>
    </article>
  );
}
