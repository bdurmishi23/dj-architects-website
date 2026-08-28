"use client";

import { useRouter } from "@/i18n/navigation";
import { ENTRY_PATHNAME } from "@/lib/entryPath";
import type { ReactNode } from "react";

// Real browser/router "back" instead of a fixed destination, so returning
// from a project or room lands wherever the visitor actually came from
// (homepage, /work, a search result page, etc). Falls back to a fixed
// route when there's nothing in-site to go back to — e.g. the link was
// opened directly (WhatsApp, a bookmark, a typed URL) — so "back" never
// exits the site entirely.
export default function BackLink({
  fallbackHref,
  children,
  className,
  style,
}: {
  fallbackHref: string;
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  const router = useRouter();

  function handleClick() {
    // If the current page is still the one this browser session first
    // loaded, no client-side navigation has happened yet — there's nothing
    // in-site for "back" to land on.
    const cameFromOutsideSite =
      typeof document !== "undefined" &&
      document.referrer &&
      new URL(document.referrer).origin !== window.location.origin;
    const noInSiteHistory =
      ENTRY_PATHNAME === window.location.pathname || cameFromOutsideSite;

    if (noInSiteHistory) {
      router.push(fallbackHref);
    } else {
      router.back();
    }
  }

  return (
    <button type="button" onClick={handleClick} className={className} style={style}>
      {children}
    </button>
  );
}
