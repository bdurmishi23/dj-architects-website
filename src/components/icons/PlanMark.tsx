import type { PlanMarkSpec } from "@/lib/marks";

// The site's one unified iconographic system: a simplified floor-plan
// silhouette with exactly two marked points — a filled brass dot at the
// entry, and an open ring at a key interior sightline or window.
export default function PlanMark({
  spec,
  scale = 1,
  className,
}: {
  spec: PlanMarkSpec;
  scale?: number;
  className?: string;
}) {
  return (
    <svg
      width={44 * scale}
      height={36 * scale}
      viewBox="0 0 44 36"
      aria-hidden="true"
      className={className}
      style={{ display: "block", overflow: "visible" }}
    >
      <path
        d={spec.d}
        fill="none"
        stroke="var(--plan-line)"
        strokeWidth={1}
        strokeLinejoin="round"
      />
      <circle cx={spec.entry[0]} cy={spec.entry[1]} r={1.9} fill="var(--brass)" />
      <circle
        cx={spec.eye[0]}
        cy={spec.eye[1]}
        r={1.9}
        fill="var(--paper)"
        stroke="var(--ink)"
        strokeWidth={0.9}
      />
    </svg>
  );
}
