import type { AnalysisResult, HistoryEntry } from "./types";

export const HISTORY_KEY = "buglens.history.v1";
export const MAX_HISTORY = 20;

function getStore(): Storage | null {
  try {
    if (typeof window === "undefined") return null;
    return window.localStorage;
  } catch {
    return null;
  }
}

function isEntry(x: unknown): x is HistoryEntry {
  if (typeof x !== "object" || x === null) return false;
  const e = x as Record<string, unknown>;
  return (
    typeof e.id === "string" &&
    typeof e.createdAt === "string" &&
    typeof e.language === "string" &&
    typeof e.code === "string" &&
    typeof e.result === "object" &&
    e.result !== null &&
    Array.isArray((e.result as AnalysisResult).issues)
  );
}

export function loadHistory(): HistoryEntry[] {
  const store = getStore();
  if (!store) return [];
  try {
    const raw = store.getItem(HISTORY_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(isEntry) : [];
  } catch {
    return [];
  }
}

function persist(entries: HistoryEntry[]): void {
  const store = getStore();
  if (!store) return;
  try {
    store.setItem(HISTORY_KEY, JSON.stringify(entries));
  } catch {
    /* storage full or blocked: history is a convenience, so fail silently */
  }
}

export function saveAnalysis(
  language: string,
  code: string,
  result: AnalysisResult,
  demo: boolean,
): HistoryEntry[] {
  const entry: HistoryEntry = {
    id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
    language,
    code,
    result,
    demo,
  };
  const next = [entry, ...loadHistory()].slice(0, MAX_HISTORY);
  persist(next);
  return next;
}

export function clearHistory(): void {
  const store = getStore();
  try {
    store?.removeItem(HISTORY_KEY);
  } catch {
    /* ignore */
  }
}
