"use client";

import { useState, type CSSProperties } from "react";

interface LogoMarkProps {
  width: number;
  height: number;
  color: string;
  bg: string;
  detail?: "full" | "reduced" | "minimal";
  spin?: "none" | "loop" | "hover";
  duration?: number;
  stroke?: number;
  grooveStroke?: number;
  holeR?: number;
  className?: string;
}

// The "DJ" monogram: D+J letterforms with the J's counter reading as
// vinyl-record grooves — a quiet nod to the founders' initials, never a
// literal music/DJ visual reference anywhere else on the site.
export default function LogoMark({
  width,
  height,
  color,
  bg,
  detail = "full",
  spin = "none",
  duration = 10,
  stroke = 2.6,
  grooveStroke = 1.4,
  holeR = 2.1,
  className,
}: LogoMarkProps) {
  const [hovered, setHovered] = useState(false);
  const hoverable = spin === "hover";

  const grooveStyle: CSSProperties = {
    transformBox: "view-box",
    transformOrigin: "48px 44px",
    ...(spin !== "none"
      ? {
          animation: `dj-groove-spin ${duration}s linear infinite`,
          animationPlayState:
            spin === "loop" || hovered ? "running" : "paused",
        }
      : {}),
  };

  return (
    <svg
      viewBox="16 4 76 84"
      width={width}
      height={height}
      fill="none"
      className={className}
      style={{ display: "block" }}
      onMouseEnter={hoverable ? () => setHovered(true) : undefined}
      onMouseLeave={hoverable ? () => setHovered(false) : undefined}
    >
      <g stroke={color} strokeWidth={stroke} strokeLinejoin="miter">
        <path d="M20 72 V16 H48 A28 28 0 0 1 48 72 Z" />
        <path d="M88 8 V64 A20 20 0 0 1 68 84" strokeLinecap="butt" />
      </g>
      <g stroke={color} strokeWidth={grooveStroke} strokeLinecap="butt" style={grooveStyle}>
        {detail === "full" && (
          <>
            <path d="M50.60 31.77 A12.5 12.5 0 0 1 50.60 56.23" />
            <path d="M51.33 28.35 A16 16 0 0 1 51.33 59.65" />
            <path d="M52.05 24.93 A19.5 19.5 0 0 1 52.05 63.07" />
            <path d="M52.99 20.53 A24 24 0 0 1 52.99 67.47" />
          </>
        )}
        {detail === "reduced" && (
          <>
            <path d="M50.91 30.31 A14 14 0 0 1 50.91 57.69" />
            <path d="M52.16 24.44 A20 20 0 0 1 52.16 63.56" />
          </>
        )}
        {detail === "minimal" && (
          <path d="M51.64 26.88 A17.5 17.5 0 0 1 51.64 61.12" />
        )}
      </g>
      <circle cx={48} cy={44} r={9} fill={color} />
      <circle cx={48} cy={44} r={holeR} fill={bg} />
    </svg>
  );
}
