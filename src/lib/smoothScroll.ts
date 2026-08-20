// Custom quartic ease-out scroll for in-page nav links. Duration scales with
// distance (clamped 950-2200ms) so near and far jumps feel equally weighted,
// and accounts for the sticky nav height so the target doesn't tuck under it.
export function smoothScrollTo(hash: string) {
  const el = document.querySelector(hash);
  if (!el) return;
  const nav = document.querySelector("nav");
  const offset = nav ? nav.getBoundingClientRect().height : 0;
  const start = window.scrollY;
  const end = start + el.getBoundingClientRect().top - offset;
  const dist = end - start;
  if (Math.abs(dist) < 2) return;

  const duration = Math.min(2200, Math.max(950, Math.abs(dist) * 0.8));
  const ease = (x: number) => 1 - Math.pow(1 - x, 4);
  const t0 = performance.now();

  const step = (now: number) => {
    const k = Math.min(1, (now - t0) / duration);
    window.scrollTo(0, start + dist * ease(k));
    if (k < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}
