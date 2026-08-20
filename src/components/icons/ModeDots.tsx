// Day/night toggle icon — deliberately not a sun/moon glyph. Reuses the
// site's two-dot motif: a dashed sightline with a filled brass dot that
// swaps sides between modes.
export default function ModeDots({ isDark }: { isDark: boolean }) {
  return (
    <svg width={22} height={10} viewBox="0 0 22 10" aria-hidden="true" style={{ display: "block" }}>
      <line
        x1={3}
        y1={5}
        x2={19}
        y2={5}
        stroke="var(--subtle)"
        strokeWidth={0.8}
        strokeDasharray="1.4 2.2"
      />
      <circle cx={isDark ? 3 : 19} cy={5} r={3} fill="var(--brass)" />
      <circle
        cx={isDark ? 19 : 3}
        cy={5}
        r={3}
        fill="var(--paper)"
        stroke="var(--ink)"
        strokeWidth={1}
      />
    </svg>
  );
}
