import Link from "next/link";
import { GithubIcon, LinkedinIcon } from "./Icons";
import { Logo } from "./Logo";

// Placeholder links: replace with your own profiles before publishing.
const GITHUB_URL = "https://github.com/Haneen-swe";
const LINKEDIN_URL = "https://www.linkedin.com/in/haneennasser-swe";

export function Footer() {
  return (
    <footer className="border-t border-slate-brand/30 bg-night">
      <div className="container-page flex flex-col gap-8 py-10 md:flex-row md:items-center md:justify-between">
        <div>
          <Logo />
          <p className="mt-3 text-sm text-offwhite/75">AI-assisted debugging for developers.</p>
        </div>

        <nav aria-label="Footer navigation">
          <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-offwhite/80">
            <li><Link href="/" className="hover:text-mauve">Home</Link></li>
            <li><Link href="/analyzer" className="hover:text-mauve">Analyzer</Link></li>
            <li><Link href="/#features" className="hover:text-mauve">Features</Link></li>
            <li><Link href="/about" className="hover:text-mauve">About</Link></li>
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-slate-brand/50 px-4 text-sm hover:border-mauve hover:text-mauve"
          >
            <GithubIcon width={18} height={18} /> GitHub
          </a>
          <a
            href={LINKEDIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-slate-brand/50 px-4 text-sm hover:border-mauve hover:text-mauve"
          >
            <LinkedinIcon width={18} height={18} /> LinkedIn
          </a>
        </div>
      </div>
      <div className="border-t border-slate-brand/20 py-4 text-center text-xs text-offwhite/60">
        © {new Date().getFullYear()} BugLens AI. Released under the MIT License.
      </div>
    </footer>
  );
}
