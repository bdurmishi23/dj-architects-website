import Image from "next/image";
import { urlForImage } from "@/lib/sanity/image";
import { pick } from "@/lib/i18n";
import type { SiteSettings } from "@/lib/sanity/types";
import type { Locale } from "@/i18n/routing";

export default function AboutSection({
  settings,
  locale,
  portraitCaption,
}: {
  settings: SiteSettings | null;
  locale: Locale;
  portraitCaption: string;
}) {
  const portraitSrc = settings?.aboutPortrait
    ? urlForImage(settings.aboutPortrait)?.width(1200).height(1300).fit("crop").url()
    : undefined;

  return (
    <section
      id="about"
      className="grid grid-cols-1 gap-14 px-6 py-16 sm:py-24 md:grid-cols-[1.05fr_0.95fr] md:items-start md:gap-20 md:px-12 lg:py-[120px]"
    >
      <div>
        <p className="mb-7 font-mono text-xs tracking-[0.14em]" style={{ color: "var(--subtle)" }}>
          {settings ? pick(locale, settings.aboutKickerEn, settings.aboutKickerAl) : ""}
        </p>
        <p className="max-w-[600px] font-serif text-[22px] font-light leading-[1.34] tracking-[-0.01em] sm:text-[26px] lg:text-[30px]">
          {settings ? pick(locale, settings.aboutLeadEn, settings.aboutLeadAl) : ""}
        </p>
        <div
          className="mt-10 flex max-w-[480px] flex-col gap-4 border-l pl-[22px]"
          style={{ borderColor: "var(--dialog-border)" }}
        >
          <p className="m-0 text-[14.5px] leading-[1.7]" style={{ color: "var(--subtle)" }}>
            <span className="mb-1 block font-mono text-xs tracking-[0.14em] text-brass">
              Deni
            </span>
            {settings ? pick(locale, settings.quoteDeniEn, settings.quoteDeniAl) : ""}
          </p>
          <p className="m-0 text-[14.5px] leading-[1.7]" style={{ color: "var(--subtle)" }}>
            <span className="mb-1 block font-mono text-xs tracking-[0.14em] text-brass">
              Jurgen
            </span>
            {settings ? pick(locale, settings.quoteJurgenEn, settings.quoteJurgenAl) : ""}
          </p>
        </div>
      </div>
      <div className="min-w-0">
        <div className="h-[320px] w-full overflow-hidden rounded-portrait sm:h-[400px] md:h-[440px] lg:h-[520px]">
          {portraitSrc && (
            <Image
              src={portraitSrc}
              alt=""
              width={1200}
              height={1300}
              className="h-full w-full object-cover"
            />
          )}
        </div>
        <p className="mt-[14px] text-[12.5px]" style={{ color: "var(--subtle)" }}>
          {portraitCaption}
        </p>
      </div>
    </section>
  );
}
