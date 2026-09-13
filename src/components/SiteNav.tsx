"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
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

const EASE = [0.22, 0.61, 0.36, 1] as const;

function MenuToggleIcon({ open }: { open: boolean }) {
  return (
    <span className="relative block h-[13px] w-5">
      <span
        className="absolute left-0 top-0 block h-[1.5px] w-full bg-current transition-transform duration-300 ease-editorial"
        style={{ transform: open ? "translateY(5.5px) rotate(45deg)" : "translateY(0) rotate(0deg)" }}
      />
      <span
        className="absolute bottom-0 left-0 block h-[1.5px] w-full bg-current transition-transform duration-300 ease-editorial"
        style={{ transform: open ? "translateY(-5.5px) rotate(-45deg)" : "translateY(0) rotate(0deg)" }}
      />
    </span>
  );
}

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

  useEffect(() => {
    if (!mobileOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = original;
      window.removeEventListener("keydown", onKey);
    };
  }, [mobileOpen]);

  const isHome = pathname === "/";

  function handleNavClick(e: React.MouseEvent, hash: string) {
    setActive(hash.slice(1));
    setMobileOpen(false);
    if (isHome) {
      e.preventDefault();
      smoothScrollTo(hash);
    }
  }

  function LangToggle({ compact }: { compact?: boolean }) {
    return (
      <div
        className={`flex items-center gap-1 font-mono text-xs tracking-[0.06em] ${
          compact ? "" : "border-l border-hairline pl-4 xl:pl-5"
        }`}
      >
        {routing.locales.map((loc, i) => (
          <span key={loc} className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => router.replace(pathname, { locale: loc })}
              className="flex min-h-11 min-w-8 items-center justify-center uppercase transition-colors duration-300 ease-editorial"
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
    );
  }

  function ModeToggle() {
    return (
      <button
        type="button"
        aria-label="Toggle day/night mode"
        onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
        className="flex min-h-11 min-w-11 items-center justify-center"
      >
        {mounted ? (
          <ModeDots isDark={resolvedTheme === "dark"} />
        ) : (
          <span className="block h-[10px] w-[22px]" />
        )}
      </button>
    );
  }

  const headerClassName = isHome
    ? "absolute inset-x-0 top-0 z-40 border-b border-transparent backdrop-blur-[2px] transition-colors duration-theme ease-editorial"
    : "sticky top-0 z-40 border-b border-hairline bg-[var(--nav-bg)] backdrop-blur-md transition-colors duration-theme ease-editorial";

  return (
    <>
    <header
      className={headerClassName}
      style={
        isHome
          ? {
              background: "var(--nav-home-bg)",
            }
          : undefined
      }
    >
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

        <nav className="hidden items-center gap-[26px] text-sm tracking-[0.02em] lg:flex xl:gap-[34px]">
          {LINKS.map((link) => {
            const on = hovered === link.key || (hovered === null && active === link.key);
            return (
              <Link
                key={link.key}
                href={isHome ? link.hash : `/${link.hash}`}
                onClick={(e) => handleNavClick(e, link.hash)}
                onMouseEnter={() => setHovered(link.key)}
                onMouseLeave={() => setHovered(null)}
                className="flex flex-col items-center gap-[5px] whitespace-nowrap py-2 transition-colors duration-300 ease-editorial"
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

          <LangToggle />
          <ModeToggle />
        </nav>

        <button
          type="button"
          className="flex min-h-11 min-w-11 items-center justify-center text-ink lg:hidden"
          aria-expanded={mobileOpen}
          aria-label="Toggle menu"
          onClick={() => setMobileOpen((v) => !v)}
        >
          <MenuToggleIcon open={mobileOpen} />
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            key="nav-panel"
            className="absolute inset-x-0 top-full z-30 border-b border-hairline bg-[var(--nav-bg)] shadow-[0_24px_48px_-16px_rgba(0,0,0,0.35)] backdrop-blur-md lg:hidden"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: EASE }}
          >
            <div className="flex flex-col px-6 pb-6 pt-2">
              {LINKS.map((link, i) => {
                const on = active === link.key;
                return (
                  <Link
                    key={link.key}
                    href={isHome ? link.hash : `/${link.hash}`}
                    onClick={(e) => handleNavClick(e, link.hash)}
                    className="flex min-h-[56px] items-center gap-3 font-serif text-2xl font-light tracking-[-0.01em] transition-colors duration-300 ease-editorial"
                    style={{
                      color: on ? "var(--ink)" : "var(--subtle)",
                      borderTop: i === 0 ? "none" : "1px solid var(--hairline)",
                    }}
                  >
                    <span
                      className="h-[6px] w-[6px] flex-none rounded-full transition-opacity duration-300 ease-editorial"
                      style={{ background: "var(--brass)", opacity: on ? 1 : 0 }}
                    />
                    {t(link.key)}
                  </Link>
                );
              })}
              <div
                className="mt-4 flex items-center justify-between border-t pt-5"
                style={{ borderColor: "var(--hairline)" }}
              >
                <LangToggle compact />
                <ModeToggle />
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>

    {/* Rendered as a sibling of <header>, not a descendant: header has
        backdrop-blur (backdrop-filter), which per spec makes it the
        containing block for fixed-position descendants — a scrim nested
        inside it would resolve "fixed inset-0" against the header's own
        ~88px height instead of the viewport, leaving no clickable area
        to close the menu. */}
    <AnimatePresence>
      {mobileOpen && (
        <motion.div
          key="nav-scrim"
          className="fixed inset-0 z-30 lg:hidden"
          style={{ background: "rgba(10,9,8,0.4)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: EASE }}
          onClick={() => setMobileOpen(false)}
        />
      )}
    </AnimatePresence>
    </>
  );
}
