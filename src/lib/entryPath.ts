// Captured once when this module first evaluates in the browser (a fresh
// full page load) and never recomputed afterward, since ES modules are
// singletons that persist across Next.js's client-side route transitions.
// Lets BackLink tell "the visitor navigated within the site before landing
// here" apart from "this page was the very first thing loaded this
// session" — window.history.length can't do this reliably, since the
// browser's own about:blank entry makes it >= 2 even on a direct open.
export const ENTRY_PATHNAME: string | null =
  typeof window !== "undefined" ? window.location.pathname : null;
