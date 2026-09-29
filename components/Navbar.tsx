"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { CloseIcon, MenuIcon } from "./Icons";
import { Logo } from "./Logo";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/analyzer", label: "Analyzer" },
  { href: "/#features", label: "Features" },
  { href: "/about", label: "About" },
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const isActive = (href: string) => href === pathname;

  return (
    <header className="sticky top-0 z-40 border-b border-slate-brand/30 bg-charcoal/90 backdrop-blur">
      <nav aria-label="Main navigation" className="container-page flex h-16 items-center justify-between">
        <Link href="/" aria-label="BugLens AI home" className="rounded-lg">
          <Logo />
        </Link>

        <ul className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                aria-current={isActive(l.href) ? "page" : undefined}
                className={`rounded-lg px-3.5 py-2 text-sm font-medium transition-colors hover:text-mauve ${
                  isActive(l.href) ? "text-mauve" : "text-offwhite/80"
                }`}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden md:block">
          <Link href="/analyzer" className="btn-primary">
            Analyze Code
          </Link>
        </div>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-brand/50 text-offwhite md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <CloseIcon /> : <MenuIcon />}
        </button>
      </nav>

      {open && (
        <div id="mobile-menu" className="border-t border-slate-brand/30 bg-night md:hidden">
          <ul className="container-page flex flex-col gap-1 py-3">
            {LINKS.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  aria-current={isActive(l.href) ? "page" : undefined}
                  className={`flex min-h-[44px] items-center rounded-lg px-3 text-base font-medium ${
                    isActive(l.href) ? "bg-plum/40 text-mauve" : "text-offwhite/90"
                  }`}
                >
                  {l.label}
                </Link>
              </li>
            ))}
            <li className="pt-2">
              <Link href="/analyzer" className="btn-primary w-full">
                Analyze Code
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
