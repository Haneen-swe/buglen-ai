import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { AnalysisResult } from "@/components/AnalysisResult";
import { SeverityBadge } from "@/components/SeverityBadge";
import { SAMPLES } from "@/lib/samples";

describe("SeverityBadge", () => {
  it.each(["CRITICAL", "HIGH", "MEDIUM", "LOW", "INFO"])("always renders the %s text", (s) => {
    render(<SeverityBadge severity={s} />);
    expect(screen.getByText(s)).toBeInTheDocument();
  });

  it("falls back to MEDIUM for unknown severities", () => {
    render(<SeverityBadge severity="banana" />);
    expect(screen.getByText("MEDIUM")).toBeInTheDocument();
  });
});

describe("AnalysisResult", () => {
  const result = SAMPLES.python.result;

  it("shows the analysis, top severity, location and corrected code", () => {
    render(<AnalysisResult result={result} onApplyFix={() => {}} onAnalyzeAgain={() => {}} />);
    expect(screen.getByText("Analysis Complete")).toBeInTheDocument();
    expect(screen.getAllByText("HIGH").length).toBeGreaterThan(0);
    expect(screen.getByText("Missing colon in function declaration")).toBeInTheDocument();
    expect(screen.getByText("Line 1")).toBeInTheDocument();
    expect(screen.getByText("Python requires a colon after a function declaration.")).toBeInTheDocument();
  });

  it("calls onApplyFix with the corrected code and onAnalyzeAgain", () => {
    const apply = vi.fn();
    const again = vi.fn();
    render(<AnalysisResult result={result} onApplyFix={apply} onAnalyzeAgain={again} />);
    fireEvent.click(screen.getAllByRole("button", { name: /apply fix/i })[0]);
    expect(apply).toHaveBeenCalledWith(result.issues[0].fixedCode);
    fireEvent.click(screen.getByRole("button", { name: /analyze again/i }));
    expect(again).toHaveBeenCalled();
  });

  it("copies the fix to the clipboard", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });
    render(<AnalysisResult result={result} onApplyFix={() => {}} onAnalyzeAgain={() => {}} />);
    fireEvent.click(screen.getAllByRole("button", { name: /copy fix/i })[0]);
    expect(writeText).toHaveBeenCalledWith(result.issues[0].fixedCode);
    expect(await screen.findByText("Copied")).toBeInTheDocument();
  });

  it("uses cautious wording when no issues are found", () => {
    render(
      <AnalysisResult
        result={{ summary: "No obvious issues detected.", language: "python", issues: [], improvements: [] }}
        onApplyFix={() => {}}
        onAnalyzeAgain={() => {}}
      />,
    );
    expect(screen.getByText("No obvious issues detected based on the provided code.")).toBeInTheDocument();
    expect(screen.getByText(/not a guarantee/i)).toBeInTheDocument();
  });

  it("shows the Demo Mode label", () => {
    render(<AnalysisResult result={result} demo onApplyFix={() => {}} onAnalyzeAgain={() => {}} />);
    expect(screen.getByText("Demo Mode")).toBeInTheDocument();
  });
});
