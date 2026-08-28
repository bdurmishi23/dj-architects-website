"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { urlForImage } from "@/lib/sanity/image";
import { PROJECT_MARKS } from "@/lib/marks";
import { pick } from "@/lib/i18n";
import { assignSideCodes } from "@/lib/projectCodes";
import PlanMark from "@/components/icons/PlanMark";
import type { Project } from "@/lib/sanity/types";
import type { Locale } from "@/i18n/routing";

// Horizontal scroll-snap "crate" of project cards, shown below `lg` in place
// of WorkTracklist's row list — gated purely by the `lg:hidden` breakpoint
// class below (a width media query), not by touch/pointer detection, so a
// narrowed desktop window gets the same swipeable layout as a phone.
export default function ProjectCrate({
  projects,
  locale,
  prevLabel,
  nextLabel,
}: {
  projects: Project[];
  locale: Locale;
  prevLabel: string;
  nextLabel: string;
}) {
  const items = assignSideCodes(projects);
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const step = useCallback(() => {
    const el = trackRef.current;
    const first = el?.firstElementChild as HTMLElement | null;
    if (!el || !first) return 0;
    const gap = parseFloat(getComputedStyle(el).columnGap || "0") || 0;
    return first.getBoundingClientRect().width + gap;
  }, []);

  const updateActive = useCallback(() => {
    const el = trackRef.current;
    const s = step();
    if (!el || s <= 0) return;
    const i = Math.max(0, Math.min(items.length - 1, Math.round(el.scrollLeft / s)));
    setActive(i);
  }, [items.length, step]);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    updateActive();
    el.addEventListener("scroll", updateActive, { passive: true });
    return () => el.removeEventListener("scroll", updateActive);
  }, [updateActive]);

  function goTo(index: number) {
    const el = trackRef.current;
    const s = step();
    if (!el || s <= 0) return;
    const clamped = Math.max(0, Math.min(items.length - 1, index));
    el.scrollTo({ left: s * clamped, behavior: "smooth" });
  }

  if (items.length === 0) return null;

  return (
    <div className="lg:hidden">
      <div
        ref={trackRef}
        className="-mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto overflow-y-hidden px-6 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] md:-mx-12 md:px-12 [&::-webkit-scrollbar]:hidden"
      >
        {items.map(({ project, code }) => {
          const mark = PROJECT_MARKS[project.signatureMark];
          const category = pick(locale, project.categoryEn, project.categoryAl);
          const src = urlForImage(project.coverImage)
            ?.width(680)
            .height(880)
            .fit("crop")
            .url();

          return (
            <Link
              key={project._id}
              href={`/work/${project.slug}`}
              className="w-[calc(100vw-76px)] max-w-[340px] flex-none snap-center overflow-hidden rounded-card border transition-colors duration-300 ease-editorial hover:border-brass"
              style={{ borderColor: "var(--hairline)" }}
            >
              <span className="relative block h-[56vh] min-h-[340px] w-full overflow-hidden">
                {src && (
                  <Image
                    src={src}
                    alt={project.name}
                    fill
                    sizes="340px"
                    className="object-cover"
                  />
                )}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(12,11,10,0.42) 0%, rgba(12,11,10,0) 34%)",
                  }}
                />
                <span className="absolute left-[18px] top-4 font-mono text-[11.5px] tracking-[0.14em] text-brass">
                  {code}
                </span>
                <span className="absolute right-4 top-[14px]">
                  <PlanMark spec={mark} scale={0.8} />
                </span>
              </span>
              <span className="block px-5 pb-[22px] pt-[18px]">
                <span className="block font-serif text-2xl font-light leading-[1.14] tracking-[-0.01em]">
                  {project.name}
                </span>
                <span
                  className="mt-[9px] block text-[12.5px] leading-[1.55]"
                  style={{ color: "var(--subtle)" }}
                >
                  {category} · {project.location} · {project.year}
                </span>
              </span>
            </Link>
          );
        })}
      </div>

      <div className="mt-5 flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => goTo(active - 1)}
          disabled={active === 0}
          aria-label={prevLabel}
          className="hidden h-8 w-8 flex-none items-center justify-center rounded-full border text-sm transition-colors duration-300 ease-editorial hover:border-brass hover:text-brass disabled:pointer-events-none disabled:opacity-30 [@media(hover:hover)_and_(pointer:fine)]:flex"
          style={{ borderColor: "var(--hairline)", color: "var(--subtle)" }}
        >
          ‹
        </button>
        <span className="flex items-center gap-[7px]">
          {items.map((item, i) => (
            <span
              key={item.project._id}
              className="block h-[6px] rounded-pill transition-[width,background-color] duration-300 ease-editorial"
              style={{
                width: i === active ? 18 : 6,
                background: i === active ? "var(--brass)" : "var(--hairline)",
              }}
            />
          ))}
        </span>
        <button
          type="button"
          onClick={() => goTo(active + 1)}
          disabled={active === items.length - 1}
          aria-label={nextLabel}
          className="hidden h-8 w-8 flex-none items-center justify-center rounded-full border text-sm transition-colors duration-300 ease-editorial hover:border-brass hover:text-brass disabled:pointer-events-none disabled:opacity-30 [@media(hover:hover)_and_(pointer:fine)]:flex"
          style={{ borderColor: "var(--hairline)", color: "var(--subtle)" }}
        >
          ›
        </button>
      </div>
    </div>
  );
}
