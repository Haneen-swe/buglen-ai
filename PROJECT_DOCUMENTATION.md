# BugLens AI — Project Documentation

## 1. Project Overview

BugLens AI is an AI-powered web application that detects, explains, and suggests fixes for bugs in source code. Users paste code into an in-browser editor and receive structured feedback: a summary, the issues found (with severity and line number), explanations, likely causes, suggested fixes, corrected code, and improvement tips.

**Tagline:** Find bugs. Understand code. Build better.

## 2. Problem Statement

- Developers and students often spend significant time identifying and understanding coding errors.
- Traditional compiler and interpreter messages can be difficult for beginners to understand.
- Existing tools often report *what* failed but not *why* or *how to fix it*.

## 3. Proposed Solution

A web application that sends submitted code (as text) through a secure backend to an AI model, then presents a validated, structured analysis in a clear interface. A Demo Mode with predefined results makes the product usable without any API key.

## 4. Objectives

1. Provide accurate, understandable bug explanations.
2. Give practical, copy-ready fixes.
3. Support multiple mainstream languages with an extensible design.
4. Keep API keys and user data safe; never execute user code.
5. Deliver a polished, accessible, responsive developer-tool experience.
6. Serve as a maintainable, well-tested portfolio project.

## 5. Target Users

- Software Engineering students
- Beginner developers
- Programming learners
- Professional developers who want a fast second opinion

## 6. Functional Requirements

| ID | Requirement |
| --- | --- |
| FR1 | The user can enter or paste code in a syntax-highlighting editor (Monaco). |
| FR2 | The user can choose Python, JavaScript, TypeScript, Java, C++, or C#. |
| FR3 | The system analyzes the code and returns issues, severity, line, description, cause, suggestion, and corrected code. |
| FR4 | The system shows overall severity: CRITICAL, HIGH, MEDIUM, LOW, or INFO (text always visible). |
| FR5 | The user can Apply Fix, Copy Fix, and Analyze Again. |
| FR6 | The user can Load Example and Clear the editor. |
| FR7 | Demo Mode works without an API key using predefined samples and results. |
| FR8 | Recent analyses are stored in localStorage and can be reopened or cleared. |
| FR9 | The system shows friendly errors for empty code, unsupported language, oversized input, missing API key, API/network failures, and invalid AI responses. |
| FR10 | The site includes Home, Analyzer, Features, About (with FAQ) pages. |

## 7. Non-Functional Requirements

- **Security:** API key server-side only; no code execution; input validation; size and rate limits.
- **Performance:** Requests time out after 45 s; the UI shows a loading state and disables the Analyze button meanwhile.
- **Accessibility:** Semantic HTML, labels, keyboard navigation, visible focus states, ARIA where needed, severity not conveyed by color alone, reduced-motion support.
- **Responsiveness:** Desktop, laptop, tablet, and mobile; editor and results stack on small screens; no horizontal scroll.
- **Maintainability:** TypeScript strict mode, small focused modules, unit tests.
- **Portability:** Vercel-ready with environment-variable configuration.

## 8. System Architecture

```
User
 ↓
Web Interface (React / Next.js, Monaco Editor)
 ↓  POST /api/analyze
Backend API Route (Node.js)
   • body size cap • rate limit • request validation
 ↓
AI Service (server-side API call, key from environment)
 ↓
Structured JSON → response validation / normalisation
 ↓
Results Interface (severity, location, cause, fix, tips)
```

| Component | Responsibility |
| --- | --- |
| `app/analyzer` | Editor, controls, states, history, Demo Mode |
| `app/api/analyze/route.ts` | Secure endpoint, limits, error mapping |
| `lib/validation.ts` | Request and AI-response validation, severity parsing, JSON extraction |
| `lib/ai.ts` | Prompt construction and provider call |
| `lib/samples.ts` | Demo samples and predefined results |
| `lib/storage.ts` | localStorage history |
| `lib/languages.ts` | Language registry (add a language here) |

## 9. Technology Stack

- **Frontend:** React 19, TypeScript, Tailwind CSS
- **Backend:** Node.js, Next.js 15 App Router API routes
- **Editor:** Monaco Editor
- **AI:** AI API called from the backend (Anthropic Messages API by default; configurable via `AI_API_URL` and `AI_MODEL`)
- **Testing:** Vitest, Testing Library
- **Deployment:** Vercel
- **Version control:** Git and GitHub

## 10. AI Integration

The backend sends a system prompt and the user's code to the AI and requests **only** a JSON object:

```json
{
  "summary": "",
  "language": "",
  "issues": [
    { "title": "", "severity": "", "line": 0, "description": "", "cause": "", "suggestion": "", "fixedCode": "" }
  ],
  "improvements": []
}
```

Key design points:

- The prompt states that the code is untrusted data and that instructions inside it must be ignored.
- The model must never claim code is guaranteed bug-free. For clean code the expected wording is "No obvious issues detected based on the provided code."
- Output is parsed tolerantly (plain JSON, fenced JSON, or JSON embedded in text) and then **validated**: types are checked, severity is normalised (unknown becomes MEDIUM), line numbers are coerced, list sizes and text lengths are capped.
- Invalid responses become a friendly `INVALID_AI_RESPONSE` error rather than reaching the UI.

## 11. Security

- API key in environment variables only; never in frontend code; `.env` files are git-ignored.
- User code is only ever treated as a string. No `eval()`, `exec()`, or dynamic execution.
- Input validation: type check, empty check, language allow-list, max length (`MAX_CODE_CHARS`, default 12,000), body-size cap (200 KB).
- Per-IP rate limiting (default 10 requests per minute).
- Provider error bodies are never returned to clients; only generic messages are.
- Security headers (`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`).
- Privacy: no server-side database; history lives only in the user's browser.
- Known limitation: the in-memory rate limiter is per server instance.

## 12. Testing

Vitest and Testing Library cover:

- Empty input validation
- Language validation
- Oversized input
- AI response validation and normalisation
- Severity parsing and highest-severity selection
- API error handling (missing key, provider failure, network failure, invalid AI output, rate limiting, key never leaked)
- Demo samples and predefined results
- localStorage history (save, load, cap, corrupted data, clear)
- Component behaviour (SeverityBadge, AnalysisResult: Apply Fix, Copy Fix, Analyze Again, no-issue wording)

Run with `npm test`. Type checking: `npm run typecheck`.

## 13. Deployment

1. Push to GitHub.
2. Import the repository in Vercel (framework preset: Next.js).
3. Add `AI_API_KEY` (and optional variables) under Project Settings → Environment Variables.
4. Deploy. The public URL is shown on the project's dashboard page after deployment.

The app runs in Demo Mode if no key is configured.

## 14. Future Enhancements

- More programming languages
- GitHub repository integration and Pull Request analysis
- Advanced static analysis combined with AI
- Team collaboration
- Personalized learning recommendations
- Shared rate limiting with Redis, user accounts, and analytics
