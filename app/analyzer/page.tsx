import type { Metadata } from "next";
import { Suspense } from "react";
import { AnalyzerClient } from "./AnalyzerClient";

export const metadata: Metadata = {
  title: "Analyzer",
  description: "Paste your code and get AI-powered bug detection, explanations and fixes.",
};

export default function AnalyzerPage() {
  return (
    <Suspense fallback={<div className="container-page py-16 text-offwhite/75">Loading analyzer…</div>}>
      <AnalyzerClient />
    </Suspense>
  );
}
