"use client";

import Editor, { loader, type BeforeMount, type OnMount } from "@monaco-editor/react";
import { useEffect, useRef, useState } from "react";

// Serve Monaco from this site (copied to public/monaco by scripts/copy-monaco.mjs)
// instead of a third-party CDN.
if (typeof window !== "undefined") {
  loader.config({ paths: { vs: "/monaco/vs" } });
}

const LOAD_TIMEOUT_MS = 12000;

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: string; // Monaco language id
  highlightLines?: number[];
  revealLine?: number | null;
  height?: string | number;
  readOnly?: boolean;
  ariaLabel?: string;
}

const THEME = "buglens-dark";

const defineTheme: BeforeMount = (monaco) => {
  monaco.editor.defineTheme(THEME, {
    base: "vs-dark",
    inherit: true,
    rules: [
      { token: "comment", foreground: "65777B", fontStyle: "italic" },
      { token: "keyword", foreground: "C184AA" },
      { token: "string", foreground: "E3C2D6" },
      { token: "number", foreground: "C184AA" },
      { token: "type", foreground: "F5EEF2" },
    ],
    colors: {
      "editor.background": "#220913",
      "editor.foreground": "#F5EEF2",
      "editorLineNumber.foreground": "#65777B",
      "editorLineNumber.activeForeground": "#C184AA",
      "editor.lineHighlightBackground": "#2c1220",
      "editor.selectionBackground": "#714C67",
      "editorCursor.foreground": "#C184AA",
      "editorIndentGuide.background1": "#3a2130",
      "editorWidget.background": "#1F3032",
      "editorWidget.border": "#65777B",
      "scrollbarSlider.background": "#65777B55",
      "scrollbarSlider.hoverBackground": "#65777B99",
    },
  });
};

export function CodeEditor({
  value,
  onChange,
  language,
  highlightLines = [],
  revealLine = null,
  height = "100%",
  readOnly = false,
  ariaLabel = "Code editor",
}: CodeEditorProps) {
  const editorRef = useRef<Parameters<OnMount>[0] | null>(null);
  const monacoRef = useRef<Parameters<OnMount>[1] | null>(null);
  const decorationsRef = useRef<string[]>([]);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  // If Monaco cannot load (blocked network, etc.) fall back to a plain textarea.
  useEffect(() => {
    if (ready) return;
    const t = window.setTimeout(() => setFailed(true), LOAD_TIMEOUT_MS);
    return () => window.clearTimeout(t);
  }, [ready]);

  const applyDecorations = () => {
    const editor = editorRef.current;
    const monaco = monacoRef.current;
    if (!editor || !monaco) return;
    const model = editor.getModel();
    const max = model?.getLineCount() ?? 0;
    const lines = Array.from(new Set(highlightLines)).filter((l) => l >= 1 && l <= max);
    decorationsRef.current = editor.deltaDecorations(
      decorationsRef.current,
      lines.map((line) => ({
        range: new monaco.Range(line, 1, line, 1),
        options: {
          isWholeLine: true,
          className: "bl-issue-line",
          linesDecorationsClassName: "bl-issue-glyph",
        },
      })),
    );
  };

  const handleMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
    setReady(true);
    applyDecorations();
  };

  // Re-apply whenever the highlighted lines or the content change.
  const key = highlightLines.join(",");
  useEffect(() => {
    applyDecorations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, value]);

  useEffect(() => {
    if (revealLine && editorRef.current) {
      editorRef.current.revealLineInCenter(revealLine);
    }
  }, [revealLine]);

  if (failed && !ready) {
    return (
      <div className="flex h-full w-full flex-col">
        <p className="border-b border-slate-brand/30 px-4 py-2 text-xs text-offwhite/75" role="status">
          The advanced editor could not be loaded, so a simple text editor is shown instead.
        </p>
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          readOnly={readOnly}
          spellCheck={false}
          aria-label={ariaLabel}
          className="min-h-0 w-full flex-1 resize-none bg-night p-4 font-mono text-sm leading-relaxed text-offwhite"
        />
      </div>
    );
  }

  return (
    <div className="h-full w-full" role="region" aria-label={ariaLabel}>
      <Editor
        height={height}
        language={language}
        value={value}
        theme={THEME}
        beforeMount={defineTheme}
        onMount={handleMount}
        onChange={(v) => onChange(v ?? "")}
        loading={<div className="p-4 text-sm text-offwhite/70">Loading editor…</div>}
        options={{
          readOnly,
          minimap: { enabled: false },
          fontSize: 14,
          fontFamily: "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
          lineNumbers: "on",
          scrollBeyondLastLine: false,
          automaticLayout: true,
          wordWrap: "on",
          tabSize: 4,
          padding: { top: 12, bottom: 12 },
          glyphMargin: false,
          bracketPairColorization: { enabled: false },
          matchBrackets: "never",
          renderLineHighlight: "line",
          ariaLabel,
          accessibilitySupport: "auto",
        }}
      />
    </div>
  );
}
