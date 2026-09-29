import type { LanguageConfig } from "./types";

/**
 * Add a new entry here to support another language.
 * `id` is what the API accepts, `monaco` is the Monaco Editor language id.
 */
export const LANGUAGES: LanguageConfig[] = [
  { id: "python", label: "Python", monaco: "python" },
  { id: "javascript", label: "JavaScript", monaco: "javascript" },
  { id: "typescript", label: "TypeScript", monaco: "typescript" },
  { id: "java", label: "Java", monaco: "java" },
  { id: "cpp", label: "C++", monaco: "cpp" },
  { id: "csharp", label: "C#", monaco: "csharp" },
];

export function getLanguage(id: string): LanguageConfig | undefined {
  return LANGUAGES.find((l) => l.id === id);
}

export function isSupportedLanguage(id: unknown): id is string {
  return typeof id === "string" && LANGUAGES.some((l) => l.id === id);
}
