"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import LogoMark from "@/components/icons/LogoMark";

const EASE = "cubic-bezier(0.22,0.61,0.36,1)";
const GROOVE_RADII = [62, 76, 90, 104, 118, 132, 146, 160, 174, 188];

export default function Hero({
  imageSrc,
  heroLine,
  locationLine,
  yearLine,
}: {
  imageSrc?: string;
  heroLine: string;
  locationLine: string;
  yearLine: string;
}) {
  const [phase, setPhase] = useState(0);
  const [pct, setPct] = useState(0);
  const [skip, setSkip] = useState<boolean | null>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const seen = sessionStorage.getItem("dj-intro-seen") === "1";
    if (reduced || seen) {
      setSkip(true);
      setPhase(9);
      setPct(100);
      return;
    }
    setSkip(false);
    sessionStorage.setItem("dj-intro-seen", "1");

    const timers = [
      setTimeout(() => setPhase(1), 80),
      setTimeout(() => setPhase(2), 1000),
      setTimeout(() => setPhase(3), 3400),
      setTimeout(() => setPhase(4), 3900),
      setTimeout(() => setPhase(5), 4400),
      setTimeout(() => setPhase(6), 4560),
    ];
    const t0 = Date.now();
    const tick = setInterval(() => {
      const p = Math.min(100, Math.round(((Date.now() - t0) / 3400) * 100));
      setPct(p);
      if (p >= 100) clearInterval(tick);
    }, 60);

    return () => {
      timers.forEach(clearTimeout);
      clearInterval(tick);
    };
  }, []);

  const lockupOut = phase >= 3;
  const done = phase >= 4;
  const revealed = phase >= 5;

  const reveal = (on: boolean, delay: number) => ({
    opacity: on ? 1 : 0,
    transform: on ? "translateY(0)" : "translateY(14px)",
    transition: `opacity 700ms ${EASE} ${delay}ms, transform 700ms ${EASE} ${delay}ms`,
  });

  return (
    <>
      {skip !== true && (
        <div
          className="fixed inset-0 z-[60] flex flex-col items-center justify-center gap-[38px] bg-paper"
          style={{
            transform: done ? "translateY(-100%)" : "translateY(0)",
            pointerEvents: done ? "none" : "auto",
            transition: `transform 1100ms cubic-bezier(0.76,0,0.24,1)`,
          }}
        >
          <div
            style={{
              opacity: lockupOut ? 0 : phase >= 1 ? 1 : 0,
              transform: lockupOut ? "translateY(-10px)" : "translateY(0)",
              transition: `opacity 900ms ${EASE}, transform 500ms ${EASE}`,
            }}
          >
            <LogoMark
              width={145}
              height={160}
              color="var(--ink)"
              bg="var(--paper)"
              detail="full"
              spin="loop"
              duration={14}
              stroke={2.6}
              grooveStroke={1.4}
              holeR={2.1}
            />
          </div>
          <div
            className="flex flex-col items-center gap-4"
            style={{
              opacity: lockupOut ? 0 : phase >= 2 ? 1 : 0,
              transform: lockupOut ? "translateY(-10px)" : "translateY(0)",
              transition: `opacity 800ms ${EASE}, transform 500ms ${EASE}`,
            }}
          >
            <div
              className="whitespace-nowrap font-serif text-[30px] font-light uppercase"
              style={{
                letterSpacing: phase >= 2 && !lockupOut ? "9px" : "18.6px",
                paddingLeft: phase >= 2 && !lockupOut ? "9px" : "18.6px",
                transition: `letter-spacing 2200ms ${EASE}, padding-left 2200ms ${EASE}`,
              }}
            >
              DJ Architects
            </div>
            <div
              className="h-px bg-brass"
              style={{
                width: phase >= 2 && !lockupOut ? 64 : 0,
                transition: `width 1400ms ${EASE}`,
              }}
            />
          </div>
          <div
            className="absolute bottom-[34px] font-mono text-[10px] tracking-[0.24em]"
            style={{
              color: "#6E655D",
              opacity: lockupOut ? 0 : 1,
              transition: "opacity 300ms linear",
            }}
          >
            {String(pct).padStart(3, "0")}
          </div>
        </div>
      )}

      <section id="top" className="relative h-[82vh] min-h-[600px]">
        {imageSrc && (
          <Image
            src={imageSrc}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        )}
        <div className="absolute inset-0" style={{ background: "var(--scrim)" }} />
        <svg
          viewBox="0 0 400 400"
          aria-hidden="true"
          className="pointer-events-none absolute right-[-90px] top-1/2 h-[520px] w-[520px] -translate-y-1/2"
          style={{ opacity: "var(--grooves-opacity)" }}
        >
          <g fill="none" stroke="var(--ink)" strokeWidth={0.8}>
            {GROOVE_RADII.map((r) => (
              <circle key={r} cx={200} cy={200} r={r} />
            ))}
          </g>
          <circle cx={200} cy={200} r={3} fill="var(--brass)" />
        </svg>
        <div className="absolute inset-x-6 bottom-16 flex items-end justify-between gap-[60px] pointer-events-none md:inset-x-12">
          <div style={reveal(revealed, 0)}>
            <p className="m-0 max-w-[640px] font-serif text-[44px] font-light leading-[1.22] tracking-[-0.01em]">
              {heroLine}
            </p>
          </div>
          <div style={reveal(revealed, 140)}>
            <p
              className="m-0 whitespace-nowrap text-right font-mono text-[11px] leading-[2] tracking-[0.14em]"
              style={{ color: "var(--subtle)" }}
            >
              {locationLine}
              <br />
              {yearLine}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
