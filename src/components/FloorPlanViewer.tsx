"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function FloorPlanViewer({
  src,
  alt,
  blurDataURL,
}: {
  src: string;
  alt: string;
  blurDataURL?: string;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = original;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mx-auto block w-full max-w-[820px] overflow-hidden rounded-card border transition-colors duration-300 ease-editorial hover:border-brass"
        style={{ borderColor: "var(--hairline)", background: "var(--room-bg)" }}
      >
        <Image
          src={src}
          alt={alt}
          width={1000}
          height={720}
          placeholder={blurDataURL ? "blur" : "empty"}
          blurDataURL={blurDataURL}
          className="h-auto w-full object-contain"
        />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-8"
          style={{ background: "rgba(10,9,8,0.78)" }}
          role="dialog"
          aria-modal="true"
          onClick={() => setOpen(false)}
        >
          <button
            type="button"
            aria-label="Close floor plan"
            className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full border font-mono text-xl transition-colors duration-300 ease-editorial hover:border-brass hover:text-brass"
            style={{
              background: "var(--paper)",
              borderColor: "var(--hairline)",
              color: "var(--ink)",
            }}
            onClick={() => setOpen(false)}
          >
            ×
          </button>
          <div
            className="relative h-full max-h-[88vh] w-full max-w-[1200px]"
            onClick={(event) => event.stopPropagation()}
          >
            <Image
              src={src}
              alt={alt}
              fill
              sizes="100vw"
              placeholder={blurDataURL ? "blur" : "empty"}
              blurDataURL={blurDataURL}
              className="object-contain"
            />
          </div>
        </div>
      )}
    </>
  );
}
