"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { hasPhotos } from "@/data/media";
import { useAppState } from "@/lib/store";
import { IconBmi, IconGear, IconGuide, IconMeals, IconPlan, IconProgress } from "./Icons";

const TABS = [
  { href: "/", label: "Plan", Icon: IconPlan },
  { href: "/meals", label: "Meals", Icon: IconMeals },
  { href: "/bmi", label: "BMI", Icon: IconBmi },
  { href: "/progress", label: "Progress", Icon: IconProgress },
  { href: "/guide", label: "Guide", Icon: IconGuide },
];

function ThemeSync() {
  const theme = useAppState((s) => s.settings.theme);
  useEffect(() => {
    const root = document.documentElement;
    const apply = () => {
      const resolved =
        theme === "system" ? (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark") : theme;
      root.dataset.theme = resolved;
    };
    apply();
    if (theme !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: light)");
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, [theme]);
  return null;
}

function Logo() {
  return (
    <svg width="28" height="28" viewBox="0 0 32 32" aria-hidden className="logo-mark">
      <rect width="32" height="32" rx="9" className="logo-bg" />
      <path d="M9 11v10M23 11v10M6 13.5v5M26 13.5v5M9 16h14" className="logo-fg" />
    </svg>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <div className="shell">
      <ThemeSync />
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <header className="topbar">
        <Link href="/" className="brand" aria-label="HomeGain home">
          <Logo />
          <span>HomeGain</span>
        </Link>
        <Link
          href="/settings"
          className={`icon-btn${isActive("/settings") ? " is-on" : ""}`}
          aria-label="Settings"
          aria-current={isActive("/settings") ? "page" : undefined}
        >
          <IconGear width={22} height={22} />
        </Link>
      </header>

      <nav className="tabbar" aria-label="Main">
        <Link href="/" className="brand brand-side" aria-label="HomeGain home">
          <Logo />
          <span>HomeGain</span>
        </Link>
        {TABS.map(({ href, label, Icon }) => (
          <Link
            key={href}
            href={href}
            className={`tab${isActive(href) ? " is-on" : ""}`}
            aria-current={isActive(href) ? "page" : undefined}
          >
            <Icon width={22} height={22} />
            <span>{label}</span>
          </Link>
        ))}
        <Link
          href="/settings"
          className={`tab tab-side-only${isActive("/settings") ? " is-on" : ""}`}
          aria-current={isActive("/settings") ? "page" : undefined}
        >
          <IconGear width={22} height={22} />
          <span>Settings</span>
        </Link>
      </nav>

      <main id="main" className="main">
        {children}
        <footer className="footer">
          <p>General fitness guidance, not medical advice.</p>
          <p>
            Exercise animations drawn for HomeGain.
            {hasPhotos ? " Exercise images: free-exercise-db (public domain)." : ""} Demo videos play from YouTube only when you tap them.
          </p>
        </footer>
      </main>
    </div>
  );
}
