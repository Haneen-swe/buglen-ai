// Regenerates presentation/BugLens-AI.pptx. Run from the project root: npm i --no-save pptxgenjs && node presentation/build-deck.js
const pptxgen = require("pptxgenjs");

const CHAR = "1F3032", NIGHT = "220913", BURG = "6C1F4D", PLUM = "714C67", MAUVE = "C184AA", SLATE = "65777B", OFF = "F5EEF2";
const HEAD = "Cambria", BODY = "Calibri", MONO = "Courier New";
const IMG = "./presentation/images/";
const OUT = "./presentation/BugLens-AI.pptx";

const pres = new pptxgen();
pres.layout = "LAYOUT_16x9"; // 10 x 5.625
pres.title = "BugLens AI";
pres.author = "BugLens AI";

function slide(bg, notes) {
  const s = pres.addSlide();
  s.background = { color: bg };
  if (notes) s.addNotes(notes);
  return s;
}
function title(s, t) {
  s.addText(t, { x: 0.6, y: 0.35, w: 8.8, h: 0.8, fontFace: HEAD, fontSize: 34, bold: true, color: OFF, margin: 0, valign: "middle", isTextBox: true });
}
function card(s, x, y, w, h, fill, line) {
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, fill: { color: fill }, line: { color: line || SLATE, width: 0.75 }, rectRadius: 0.12 });
}
function badge(s, x, y, d, txt) {
  s.addShape(pres.shapes.OVAL, { x, y, w: d, h: d, fill: { color: BURG }, line: { color: MAUVE, width: 1 } });
  s.addText(txt, { x, y, w: d, h: d, align: "center", valign: "middle", fontFace: BODY, fontSize: Math.round(d * 30), bold: true, color: OFF, margin: 0, isTextBox: true });
}
function arrow(s, x, y, w, h) {
  s.addShape(pres.shapes.LINE, { x, y, w, h, line: { color: MAUVE, width: 1.5, endArrowType: "triangle" } });
}
function txt(s, t, o) {
  s.addText(t, Object.assign({ fontFace: BODY, color: OFF, margin: 0, valign: "top", isTextBox: true }, o));
}

// 1. Title
{
  const s = slide(NIGHT, "Introduce BugLens AI: an AI-powered tool that detects and explains bugs in source code.");
  txt(s, "BugLens AI", { x: 0.6, y: 1.35, w: 4.8, h: 1.0, fontFace: HEAD, fontSize: 54, bold: true, valign: "middle" });
  txt(s, "AI-Powered Code Bug Detection and Explanation", { x: 0.6, y: 2.5, w: 4.6, h: 0.9, fontSize: 20, color: MAUVE });
  txt(s, "Find bugs. Understand code. Build better.", { x: 0.6, y: 3.6, w: 4.6, h: 0.4, fontSize: 14, italic: true });

  card(s, 5.5, 1.1, 3.9, 3.3, CHAR, SLATE);
  [SLATE, PLUM, MAUVE].forEach((c, i) => s.addShape(pres.shapes.OVAL, { x: 5.72 + i * 0.2, y: 1.3, w: 0.12, h: 0.12, fill: { color: c }, line: { color: c, width: 0.25 } }));
  txt(s, "average.py", { x: 6.45, y: 1.24, w: 1.5, h: 0.24, fontFace: MONO, fontSize: 9, valign: "middle" });
  s.addShape(pres.shapes.RECTANGLE, { x: 5.62, y: 1.72, w: 3.66, h: 0.32, fill: { color: BURG }, line: { color: BURG, width: 0.25 } });
  const code = [["1  ", "def calculate_average(numbers)"], ["2  ", "    total = sum(numbers)"], ["3  ", "    return total / len(numbers)"]];
  code.forEach((c, i) => {
    txt(s, [{ text: c[0], options: { color: SLATE } }, { text: c[1], options: { color: OFF } }], { x: 5.75, y: 1.72 + i * 0.32, w: 3.4, h: 0.32, fontFace: MONO, fontSize: 10.5, valign: "middle" });
  });
  txt(s, "Missing colon in function declaration", { x: 5.75, y: 2.95, w: 2.55, h: 0.3, fontSize: 11.5, bold: true, valign: "middle" });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 8.45, y: 2.97, w: 0.75, h: 0.26, fill: { color: BURG }, line: { color: MAUVE, width: 0.75 }, rectRadius: 0.13 });
  txt(s, "HIGH", { x: 8.45, y: 2.97, w: 0.75, h: 0.26, fontSize: 9.5, bold: true, align: "center", valign: "middle" });
  txt(s, "Python requires a colon after a function declaration.", { x: 5.75, y: 3.3, w: 3.5, h: 0.3, fontSize: 10.5 });
  card(s, 5.75, 3.72, 3.5, 0.42, NIGHT, SLATE);
  txt(s, [{ text: "def calculate_average(numbers)", options: { color: OFF } }, { text: ":", options: { color: MAUVE, bold: true } }], { x: 5.9, y: 3.72, w: 3.3, h: 0.42, fontFace: MONO, fontSize: 10, valign: "middle" });
}

// 2. Problem
{
  const s = slide(CHAR, "Debugging is slow and confusing, especially for beginners. Error messages state what failed, not why or how to fix it.");
  title(s, "Problem");
  card(s, 0.6, 1.45, 4.6, 1.55, NIGHT);
  txt(s, "Developers and students often spend significant time identifying and understanding coding errors.", { x: 0.85, y: 1.6, w: 4.1, h: 1.25, fontSize: 17, valign: "middle" });
  card(s, 0.6, 3.2, 4.6, 1.55, NIGHT);
  txt(s, "Traditional error messages can be difficult for beginners to understand.", { x: 0.85, y: 3.35, w: 4.1, h: 1.25, fontSize: 17, valign: "middle" });

  card(s, 5.6, 1.45, 3.8, 3.3, NIGHT);
  [SLATE, PLUM, MAUVE].forEach((c, i) => s.addShape(pres.shapes.OVAL, { x: 5.82 + i * 0.2, y: 1.65, w: 0.12, h: 0.12, fill: { color: c }, line: { color: c, width: 0.25 } }));
  txt(s, 'File "app.py", line 1', { x: 5.85, y: 2.1, w: 3.4, h: 0.3, fontFace: MONO, fontSize: 11 });
  txt(s, "def calculate_average(numbers)", { x: 5.85, y: 2.45, w: 3.4, h: 0.3, fontFace: MONO, fontSize: 11 });
  txt(s, "SyntaxError: invalid syntax", { x: 5.85, y: 2.95, w: 3.4, h: 0.3, fontFace: MONO, fontSize: 11, bold: true, color: MAUVE });
  txt(s, "It says what failed, but not why or how to fix it.", { x: 5.85, y: 3.7, w: 3.3, h: 0.8, fontSize: 14, italic: true });
}

// 3. Solution
{
  const s = slide(NIGHT, "BugLens AI turns confusing errors into clear, actionable explanations.");
  title(s, "Solution");
  txt(s, "BugLens AI turns confusing errors into clear, actionable explanations.", { x: 0.6, y: 1.5, w: 3.9, h: 1.7, fontFace: HEAD, fontSize: 24, bold: true });
  txt(s, "Paste code. Get answers.", { x: 0.6, y: 3.4, w: 3.9, h: 0.4, fontSize: 16, color: MAUVE });
  ["Bug detection", "Error explanation", "Possible cause", "Suggested fix", "Code improvement suggestions"].forEach((t, i) => {
    const y = 1.4 + i * 0.74;
    card(s, 5.0, y, 4.4, 0.62, CHAR);
    badge(s, 5.15, y + 0.13, 0.36, String(i + 1));
    txt(s, t, { x: 5.7, y, w: 3.55, h: 0.62, fontSize: 16, bold: true, valign: "middle" });
  });
}

// 4. Target users
{
  const s = slide(CHAR, "Who benefits: students, beginners, learners and professional developers.");
  title(s, "Target Users");
  const items = [
    ["Software Engineering students", "Learn from every explanation"],
    ["Beginner developers", "Understand errors in plain language"],
    ["Programming learners", "Practice and self-check code"],
    ["Developers", "Get a fast second opinion"],
  ];
  items.forEach((it, i) => {
    const x = i % 2 === 0 ? 0.6 : 5.1, y = i < 2 ? 1.5 : 3.3;
    card(s, x, y, 4.3, 1.55, NIGHT);
    badge(s, x + 0.3, y + 0.42, 0.7, "0" + (i + 1));
    txt(s, it[0], { x: x + 1.25, y: y + 0.3, w: 2.85, h: 0.55, fontSize: 18, bold: true, valign: "middle" });
    txt(s, it[1], { x: x + 1.25, y: y + 0.88, w: 2.85, h: 0.4, fontSize: 13, color: MAUVE });
  });
}

// 5. How it works
{
  const s = slide(NIGHT, "Five steps from pasted code to an explained fix, with a simple architecture underneath.");
  title(s, "How It Works");
  const steps = ["User enters code", "Backend validates the request", "AI analyzes the code", "Structured results are returned", "User reviews the explanation and suggested fix"];
  steps.forEach((t, i) => {
    const x = 0.6 + i * (1.62 + 0.175);
    card(s, x, 1.35, 1.62, 1.85, CHAR);
    badge(s, x + 0.16, 1.5, 0.5, String(i + 1));
    txt(s, t, { x: x + 0.16, y: 2.15, w: 1.32, h: 1.0, fontSize: 13, bold: true });
  });
  txt(s, "Simple architecture", { x: 0.6, y: 3.5, w: 4, h: 0.3, fontSize: 12, color: MAUVE, bold: true });
  ["Web Interface", "Backend API", "AI Service", "Structured JSON", "Results"].forEach((t, i) => {
    const x = 0.6 + i * (1.4 + 0.45);
    card(s, x, 3.95, 1.4, 0.65, CHAR, MAUVE);
    txt(s, t, { x, y: 3.95, w: 1.4, h: 0.65, fontSize: 12.5, bold: true, align: "center", valign: "middle" });
    if (i < 4) arrow(s, x + 1.4 + 0.05, 4.275, 0.35, 0);
  });
}

// 6. Features
{
  const s = slide(CHAR, "Seven core capabilities, including Demo Mode so anyone can try the app without an API key.");
  title(s, "Main Features");
  const f = [
    ["AI Bug Detection", "Syntax, logic and runtime issues"],
    ["Error Explanation", "Plain-language reasons"],
    ["Suggested Fixes", "Corrected code, ready to copy"],
    ["Multiple Languages", "Python, JS, TS, Java, C++, C#"],
    ["Code Quality Suggestions", "Readability and maintainability tips"],
    ["Demo Mode", "Works without an API key"],
    ["Recent Analyses", "History saved in your browser"],
  ];
  f.forEach((it, i) => {
    const row1 = i < 4;
    const w = row1 ? 2.05 : (8.8 - 0.4) / 3;
    const x = 0.6 + (row1 ? i : i - 4) * (w + 0.2);
    const y = row1 ? 1.4 : 3.2;
    card(s, x, y, w, 1.6, NIGHT);
    badge(s, x + 0.18, y + 0.16, 0.38, String(i + 1));
    txt(s, it[0], { x: x + 0.18, y: y + 0.66, w: w - 0.3, h: 0.5, fontSize: 14.5, bold: true, valign: "middle" });
    txt(s, it[1], { x: x + 0.18, y: y + 1.16, w: w - 0.3, h: 0.36, fontSize: 11, color: MAUVE });
  });
}

// 7. Tech stack
{
  const s = slide(NIGHT, "React, TypeScript and Tailwind on the front end; Node.js API routes on the back end; Monaco Editor; Vercel; GitHub.");
  title(s, "Technology Stack");
  const t = [
    ["FRONTEND", "React\nTypeScript\nTailwind CSS"],
    ["BACKEND", "Node.js\nAPI Routes"],
    ["AI", "AI API"],
    ["CODE EDITOR", "Monaco Editor"],
    ["DEPLOYMENT", "Vercel"],
    ["VERSION CONTROL", "GitHub"],
  ];
  t.forEach((it, i) => {
    const x = 0.6 + (i % 3) * 3.0, y = i < 3 ? 1.4 : 3.2;
    card(s, x, y, 2.8, 1.6, CHAR);
    txt(s, it[0], { x: x + 0.25, y: y + 0.18, w: 2.3, h: 0.3, fontSize: 12, bold: true, color: MAUVE });
    txt(s, it[1], { x: x + 0.25, y: y + 0.55, w: 2.3, h: 0.95, fontSize: it[1].includes("\n") ? 15 : 20, bold: true });
  });
}

// 8. Architecture
{
  const s = slide(CHAR, "Each component has one job: the interface collects code, the backend guards the key and validates, the AI analyzes, results are validated before display.");
  title(s, "System Architecture");
  const parts = [
    ["User", "Pastes code and reads the results."],
    ["Web Interface", "React and Monaco Editor: input, loading and error states."],
    ["Backend API", "Validates input, applies limits, keeps the API key secret."],
    ["AI Service", "Analyzes the code as text. It never executes it."],
    ["Structured Analysis", "JSON is checked and normalised before display."],
    ["Results Interface", "Severity, location, cause, fix and improvement tips."],
  ];
  parts.forEach((p, i) => {
    const y = 1.4 + i * 0.64;
    card(s, 0.6, y, 2.6, 0.5, NIGHT, MAUVE);
    txt(s, p[0], { x: 0.6, y, w: 2.6, h: 0.5, fontSize: 13.5, bold: true, align: "center", valign: "middle" });
    if (i < 5) arrow(s, 1.9, y + 0.5, 0, 0.14);
    txt(s, p[1], { x: 3.6, y, w: 5.8, h: 0.5, fontSize: 13, valign: "middle" });
  });
}

// 9. Security
{
  const s = slide(NIGHT, "Security is designed in: keys stay on the server, code is never executed, and every request and response is validated.");
  title(s, "Security");
  const sec = [
    ["API keys stored in environment variables", "Configured on the server only"],
    ["API keys never exposed to users", "Never sent to the browser"],
    ["User code is not executed", "Analyzed as plain text only"],
    ["Input validation", "Type, language and size checks"],
    ["Request limits", "Size cap and per-IP rate limit"],
    ["Secure backend API", "All AI calls go through /api/analyze"],
  ];
  sec.forEach((it, i) => {
    const x = 0.6 + (i % 3) * 3.0, y = i < 3 ? 1.4 : 3.2;
    card(s, x, y, 2.8, 1.6, CHAR);
    badge(s, x + 0.2, y + 0.16, 0.38, String(i + 1));
    txt(s, it[0], { x: x + 0.2, y: y + 0.66, w: 2.4, h: 0.5, fontSize: 13.5, bold: true, valign: "middle" });
    txt(s, it[1], { x: x + 0.2, y: y + 1.17, w: 2.4, h: 0.32, fontSize: 11, color: MAUVE });
  });
}

// 10. Demo (real screenshots of the running app)
{
  const s = slide(CHAR, "Screenshots captured from the running application in Demo Mode.");
  title(s, "Demo");
  const shots = [["home.png", "Home page"], ["analyzer.png", "Code editor"], ["result.png", "Analysis result"], ["fix.png", "Suggested fix"]];
  shots.forEach((sh, i) => {
    const x = i % 2 === 0 ? 0.6 : 5.2, y = i < 2 ? 1.3 : 3.35;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: x - 0.04, y: y - 0.04, w: 4.28, h: 1.63, fill: { color: SLATE }, line: { color: SLATE, width: 0.25 }, rectRadius: 0.08 });
    s.addImage({ path: IMG + sh[0], x, y, w: 4.2, h: 1.55, altText: sh[1] + " screenshot of BugLens AI" });
    txt(s, sh[1], { x, y: y + 1.65, w: 4.2, h: 0.28, fontSize: 12.5, bold: true, color: MAUVE });
  });
}

// 11. Future
{
  const s = slide(NIGHT, "Possible next steps for the project.");
  title(s, "Future Improvements");
  ["More programming languages", "GitHub repository integration", "Pull Request analysis", "Advanced static analysis", "Team collaboration", "Personalized learning recommendations"].forEach((t, i) => {
    const x = 0.6 + (i % 3) * 3.0, y = i < 3 ? 1.45 : 3.1;
    card(s, x, y, 2.8, 1.35, CHAR);
    badge(s, x + 0.2, y + 0.18, 0.38, String(i + 1));
    txt(s, t, { x: x + 0.2, y: y + 0.68, w: 2.4, h: 0.6, fontSize: 15, bold: true, valign: "middle" });
  });
}

// 12. Conclusion + Thank you
{
  const s = slide(BURG, "Close with the conclusion, then thank the audience and invite questions.");
  txt(s, "“", { x: 0.6, y: 0.4, w: 1, h: 0.9, fontFace: HEAD, fontSize: 72, bold: true, color: MAUVE });
  txt(s, "BugLens AI combines artificial intelligence and software engineering to make debugging more understandable, accessible, and efficient.", { x: 0.6, y: 1.25, w: 8.8, h: 1.8, fontFace: HEAD, fontSize: 24, italic: true, valign: "top" });
  card(s, 0.6, 3.5, 8.8, 1.5, NIGHT, MAUVE);
  txt(s, "Thank You", { x: 0.9, y: 3.6, w: 4.2, h: 1.3, fontFace: HEAD, fontSize: 38, bold: true, valign: "middle" });
  txt(s, "Questions?", { x: 5.2, y: 3.6, w: 4.0, h: 1.3, fontFace: HEAD, fontSize: 30, color: MAUVE, align: "right", valign: "middle" });
}

pres.writeFile({ fileName: OUT }).then((f) => console.log("wrote", f));
