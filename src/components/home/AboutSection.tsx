import Image from "next/image";
import { urlForImage } from "@/lib/sanity/image";
import { hasText, pickText } from "@/lib/content";
import type { SiteSettings } from "@/lib/sanity/types";
import type { Locale } from "@/i18n/routing";

export default function AboutSection({
  settings,
  locale,
  portraitCaption,
  portraitPlaceholder,
}: {
  settings: SiteSettings | null;
  locale: Locale;
  portraitCaption: string;
  portraitPlaceholder: string;
}) {
  const portraitSrc = settings?.aboutPortrait
    ? urlForImage(settings.aboutPortrait)?.width(1200).height(1300).fit("crop").url()
    : undefined;
  const kicker = settings ? pickText(locale, settings.aboutKickerEn, settings.aboutKickerAl) : "";
  const lead = settings ? pickText(locale, settings.aboutLeadEn, settings.aboutLeadAl) : "";
  const deniQuote = settings ? pickText(locale, settings.quoteDeniEn, settings.quoteDeniAl) : "";
  const jurgenQuote = settings ? pickText(locale, settings.quoteJurgenEn, settings.quoteJurgenAl) : "";
  const hasCopy = [kicker, lead, deniQuote, jurgenQuote].some(hasText);

  if (!hasCopy && !portraitSrc) return null;

  return (
    <section
      id="about"
      className="home-section home-section--about grid grid-cols-1 gap-14 md:grid-cols-[1.05fr_0.95fr] md:items-start md:gap-20"
    >
      <div>
        {hasText(kicker) && (
          <p className="mb-7 font-mono text-xs tracking-[0.14em]" style={{ color: "var(--subtle)" }}>
            {kicker}
          </p>
        )}
        {hasText(lead) && (
          <p className="max-w-[600px] font-serif text-[22px] font-light leading-[1.34] tracking-[-0.01em] sm:text-[26px] lg:text-[30px]">
            {lead}
          </p>
        )}
        {(hasText(deniQuote) || hasText(jurgenQuote)) && (
          <div
            className="mt-10 flex max-w-[480px] flex-col gap-4 border-l pl-[22px]"
            style={{ borderColor: "var(--dialog-border)" }}
          >
            {hasText(deniQuote) && (
              <p className="m-0 text-[14.5px] leading-[1.7]" style={{ color: "var(--subtle)" }}>
                <span className="mb-1 block font-mono text-xs tracking-[0.14em] text-brass">
                  Deni
                </span>
                {deniQuote}
              </p>
            )}
            {hasText(jurgenQuote) && (
              <p className="m-0 text-[14.5px] leading-[1.7]" style={{ color: "var(--subtle)" }}>
                <span className="mb-1 block font-mono text-xs tracking-[0.14em] text-brass">
                  Jurgen
                </span>
                {jurgenQuote}
              </p>
            )}
          </div>
        )}
      </div>
      <div className="min-w-0">
        <div
          className="h-[320px] w-full overflow-hidden rounded-portrait sm:h-[400px] md:h-[440px] lg:h-[520px]"
          style={
            !portraitSrc
              ? { background: "var(--room-hover)", border: "1px dashed var(--hairline)" }
              : undefined
          }
        >
          {portraitSrc ? (
            <Image
              src={portraitSrc}
              alt=""
              width={1200}
              height={1300}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-3">
              <svg width="40" height="40" viewBox="0 0 40 40" aria-hidden="true">
                <rect
                  x="4"
                  y="7"
                  width="32"
                  height="26"
                  rx="3"
                  fill="none"
                  stroke="var(--plan-line)"
                  strokeWidth="1.2"
                />
                <circle cx="13" cy="15" r="3" fill="none" stroke="var(--plan-line)" strokeWidth="1.2" />
                <path
                  d="M4 27 L14 19 L21 25 L28 17 L36 24"
                  fill="none"
                  stroke="var(--plan-line)"
                  strokeWidth="1.2"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
              </svg>
              <span
                className="font-mono text-[11px] tracking-[0.12em]"
                style={{ color: "var(--subtle)" }}
              >
                {portraitPlaceholder}
              </span>
            </div>
          )}
        </div>
        {hasText(portraitCaption) && (
          <p className="mt-[14px] text-[12.5px]" style={{ color: "var(--subtle)" }}>
            {portraitCaption}
          </p>
        )}
      </div>
    </section>
  );
}
