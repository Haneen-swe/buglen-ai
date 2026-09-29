# BugLens AI

**AI-Powered Code Bug Detection and Explanation**

Visual identity: `#1F3032` Dark Charcoal · `#220913` Very Dark Plum · `#6C1F4D` Deep Burgundy · `#714C67` Muted Plum · `#C184AA` Soft Mauve Pink · `#65777B` Slate

---

## Slide 1 — Title

# BugLens AI
### AI-Powered Code Bug Detection and Explanation
*Find bugs. Understand code. Build better.*

---

## Slide 2 — Problem

- Developers and students often spend significant time identifying and understanding coding errors.
- Traditional error messages can be difficult for beginners to understand.
- Errors say *what* failed, but rarely *why* or *how to fix it*.

---

## Slide 3 — Solution

BugLens AI analyzes pasted code and provides:

- Bug detection
- Error explanation
- Possible cause
- Suggested fix
- Code improvement suggestions

---

## Slide 4 — Target Users

- Software Engineering students
- Beginner developers
- Programming learners
- Developers

---

## Slide 5 — How It Works

1. User enters code
2. Backend validates the request
3. AI analyzes the code
4. Structured results are returned
5. User reviews the explanation and suggested fix

`Editor → Backend API → AI Service → Structured JSON → Results`

---

## Slide 6 — Main Features

- AI Bug Detection
- Error Explanation
- Suggested Fixes
- Multiple Languages (Python, JavaScript, TypeScript, Java, C++, C#)
- Code Quality Suggestions
- Demo Mode
- Recent Analyses

---

## Slide 7 — Technology Stack

| Layer | Technology |
| --- | --- |
| Frontend | React, TypeScript, Tailwind CSS |
| Backend | Node.js, API Routes |
| AI | AI API |
| Code Editor | Monaco Editor |
| Deployment | Vercel |
| Version Control | GitHub |

---

## Slide 8 — System Architecture

```
User
 ↓
Web Interface
 ↓
Backend API
 ↓
AI Service
 ↓
Structured Analysis
 ↓
Results Interface
```

- **Web Interface:** React + Monaco editor for input and results
- **Backend API:** validates input, applies limits, holds the secret key
- **AI Service:** analyzes code as text and returns JSON
- **Structured Analysis:** validated before display
- **Results Interface:** severity, location, cause, fix

---

## Slide 9 — Security

- API keys stored in environment variables
- API keys never exposed to users
- User code is not executed
- Input validation
- Request limits
- Secure backend API

---

## Slide 10 — Demo

Home page · Code editor · Analysis result · Suggested fix

Sample: `def calculate_average(numbers)` → **HIGH** — Missing colon in function declaration (Line 1)

---

## Slide 11 — Future Improvements

- More programming languages
- GitHub repository integration
- Pull Request analysis
- Advanced static analysis
- Team collaboration
- Personalized learning recommendations

---

## Slide 12 — Conclusion

> BugLens AI combines artificial intelligence and software engineering to make debugging more understandable, accessible, and efficient.

**Thank You**
**Questions?**
