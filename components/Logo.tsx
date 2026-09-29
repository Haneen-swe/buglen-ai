export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg
        viewBox="0 0 32 32"
        width="32"
        height="32"
        role="img"
        aria-label="BugLens AI logo"
        className="shrink-0"
      >
        <rect width="32" height="32" rx="9" fill="#6C1F4D" />
        <circle cx="14" cy="14" r="7" fill="none" stroke="#C184AA" strokeWidth="2.2" />
        <path d="m19.500 19.500 5 5" stroke="#C184AA" strokeWidth="2.600" strokeLinecap="round" />
        <path
          d="m11.500 13 -2 1.500 2 1.500m5 -3 2 1.500 -2 1.500"
          fill="none"
          stroke="#F5EEF2"
          strokeWidth="1.500"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="text-lg font-bold tracking-tight text-offwhite">
        BugLens <span className="text-mauve">AI</span>
      </span>
    </span>
  );
}
