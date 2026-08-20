import { pick } from "@/lib/i18n";
import type { SiteSettings } from "@/lib/sanity/types";
import type { Locale } from "@/i18n/routing";

export default function ContactSection({
  settings,
  locale,
}: {
  settings: SiteSettings | null;
  locale: Locale;
}) {
  return (
    <section id="contact" className="px-6 pb-16 pt-5 sm:pb-[120px] md:px-12">
      <div
        className="flex flex-wrap items-center justify-between gap-8 rounded-panel border p-6 sm:gap-10 sm:p-10 lg:p-14"
        style={{ borderColor: "var(--panel-border)" }}
      >
        <div>
          <p className="mb-3 font-serif text-[24px] font-light tracking-[-0.01em] sm:text-[28px] lg:text-[32px]">
            {settings ? pick(locale, settings.contactLeadEn, settings.contactLeadAl) : ""}
          </p>
          <p className="text-sm" style={{ color: "var(--subtle)" }}>
            {settings ? pick(locale, settings.contactNoteEn, settings.contactNoteAl) : ""}
          </p>
        </div>
        {settings?.contactEmail && (
          <a
            href={`mailto:${settings.contactEmail}`}
            className="whitespace-nowrap rounded-pill border px-7 py-[15px] text-[15px] tracking-[0.01em] text-ink transition-colors duration-500 ease-editorial hover:border-brass hover:text-brass"
            style={{ borderColor: "var(--cta-border)" }}
          >
            {settings.contactEmail}
          </a>
        )}
      </div>
    </section>
  );
}
