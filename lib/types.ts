export const SEVERITIES = ["CRITICAL", "HIGH", "MEDIUM", "LOW", "INFO"] as const;
export type Severity = (typeof SEVERITIES)[number];

export interface LanguageConfig {
  id: string;
  label: string;
  monaco: string;
}

export interface Issue {
  title: string;
  severity: Severity;
  line: number;
  description: string;
  cause: string;
  suggestion: string;
  fixedCode: string;
}

export interface AnalysisResult {
  summary: string;
  language: string;
  issues: Issue[];
  improvements: string[];
}

export interface HistoryEntry {
  id: string;
  createdAt: string;
  language: string;
  code: string;
  result: AnalysisResult;
  demo: boolean;
}

export type ErrorCode =
  | "EMPTY_CODE"
  | "UNSUPPORTED_LANGUAGE"
  | "INPUT_TOO_LARGE"
  | "INVALID_REQUEST"
  | "MISSING_API_KEY"
  | "RATE_LIMITED"
  | "AI_FAILURE"
  | "INVALID_AI_RESPONSE"
  | "NETWORK_ERROR";

export interface ApiError {
  code: ErrorCode;
  message: string;
}
