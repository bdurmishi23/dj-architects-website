"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { useTranslations, useLocale } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { smoothScrollTo } from "@/lib/smoothScroll";
import LogoMark from "@/components/icons/LogoMark";
import NavDots from "@/components/icons/NavDots";
import ModeDots from "@/components/icons/ModeDots";

const LINKS = [
  { key: "work", hash: "#work" },
  { key: "rooms", hash: "#rooms" },
  { key: "about", hash: "#about" },
  { key: "contact", hash: "#contact" },
] as const;

export default function SiteNav() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();

  const [mounted, setMounted] = useState(false);
  const [active, setActive] = useState<string | null>("work");
  const [hovered, setHovered] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => setMounted(true), []);

  const isHome = pathname === "/";

  function handleNavClick(e: React.MouseEvent, hash: string) {
    setActive(hash.slice(1));
    setMobileOpen(false);
    if (isHome) {
      e.preventDefault();
      smoothScrollTo(hash);
    }
  }

  return (
    <header className="sticky top-0 z-40 border-b border-hairline bg-[var(--nav-bg)] backdrop-blur-md transition-colors duration-theme ease-editorial">
      <div className="flex items-center justify-between px-6 py-[22px] md:px-12">
        <Link href="/" className="flex flex-none items-center gap-3 text-ink">
          <LogoMark
            width={26}
            height={29}
            color="var(--ink)"
            bg="var(--paper)"
            detail="reduced"
            spin="hover"
            duration={14}
            stroke={4.4}
            grooveStroke={2.6}
            holeR={2.6}
          />
          <span className="whitespace-nowrap font-serif text-[21px] tracking-[0.01em]">
            Architects
          </span>
        </Link>

        <nav className="hidden items-center gap-[34px] text-sm tracking-[0.02em] md:flex">
          {LINKS.map((link) => {
            const on = hovered === link.key || (hovered === null && active === link.key);
            return (
              <Link
                key={link.key}
                href={isHome ? link.hash : `/${link.hash}`}
                onClick={(e) => handleNavClick(e, link.hash)}
                onMouseEnter={() => setHovered(link.key)}
                onMouseLeave={() => setHovered(null)}
                className="flex flex-col items-center gap-[5px] whitespace-nowrap transition-colors duration-300 ease-editorial"
                style={{ color: on ? "var(--ink)" : "var(--subtle)" }}
              >
                {t(link.key)}
                <span
                  className="block h-1 transition-all duration-300 ease-editorial"
                  style={{
                    opacity: on ? 1 : 0,
                    transform: on ? "translateY(0)" : "translateY(-2px)",
                  }}
                >
                  <NavDots />
                </span>
              </Link>
            );
          })}

          <div className="flex items-center gap-2 border-l border-hairline pl-5 font-mono text-xs tracking-[0.06em]">
            {routing.locales.map((loc, i) => (
              <span key={loc} className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => router.replace(pathname, { locale: loc })}
                  className="uppercase transition-colors duration-300 ease-editorial"
                  style={{ color: loc === locale ? "var(--brass)" : "var(--subtle)" }}
                >
                  {loc}
                </button>
                {i < routing.locales.length - 1 && (
                  <span style={{ color: "var(--subtle-dim)" }}>/</span>
                )}
              </span>
            ))}
          </div>

          <button
            type="button"
            aria-label="Toggle day/night mode"
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            className="ml-2 flex items-center"
          >
            {mounted ? (
              <ModeDots isDark={resolvedTheme === "dark"} />
            ) : (
              <span className="block h-[10px] w-[22px]" />
            )}
          </button>
        </nav>

        <button
          type="button"
          className="text-sm text-ink md:hidden"
          aria-expanded={mobileOpen}
          aria-label="Toggle menu"
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? "Close" : "Menu"}
        </button>
      </div>

      {mobileOpen && (
        <nav className="flex flex-col gap-1 border-t border-hairline px-6 pb-6 md:hidden">
          {LINKS.map((link) => (
            <Link
              key={link.key}
              href={isHome ? link.hash : `/${link.hash}`}
              onClick={(e) => handleNavClick(e, link.hash)}
              className="py-3 text-sm"
              style={{ color: "var(--subtle)" }}
            >
              {t(link.key)}
            </Link>
          ))}
          <div className="flex items-center gap-4 pt-3">
            <div className="flex items-center gap-2 font-mono text-xs tracking-[0.06em]">
              {routing.locales.map((loc, i) => (
                <span key={loc} className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => router.replace(pathname, { locale: loc })}
                    className="uppercase"
                    style={{ color: loc === locale ? "var(--brass)" : "var(--subtle)" }}
                  >
                    {loc}
                  </button>
                  {i < routing.locales.length - 1 && (
                    <span style={{ color: "var(--subtle-dim)" }}>/</span>
                  )}
                </span>
              ))}
            </div>
            <button
              type="button"
              aria-label="Toggle day/night mode"
              onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            >
              {mounted ? (
                <ModeDots isDark={resolvedTheme === "dark"} />
              ) : (
                <span className="block h-[10px] w-[22px]" />
              )}
            </button>
          </div>
        </nav>
      )}
    </header>
  );
}
