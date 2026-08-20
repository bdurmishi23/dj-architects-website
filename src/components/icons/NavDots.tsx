// Active/hover indicator under nav links — the same two-dot motif used by
// the plan marks and mode toggle, the site's one unified iconographic system.
export default function NavDots() {
  return (
    <svg width={16} height={4} viewBox="0 0 16 4" aria-hidden="true" style={{ display: "block" }}>
      <circle cx={2} cy={2} r={1.6} fill="var(--brass)" />
      <circle cx={13} cy={2} r={1.6} fill="var(--paper)" stroke="var(--brass)" strokeWidth={0.8} />
    </svg>
  );
}
