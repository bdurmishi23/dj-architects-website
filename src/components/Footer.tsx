import { getTranslations, getLocale } from "next-intl/server";
import { draftMode } from "next/headers";
import { getSiteSettings } from "@/lib/sanity/queries";
import { pick } from "@/lib/i18n";
import type { Locale } from "@/i18n/routing";

export default async function Footer() {
  const { isEnabled: preview } = draftMode();
  const [t, settings, locale] = await Promise.all([
    getTranslations("footer"),
    getSiteSettings(preview),
    getLocale(),
  ]);

  const tagline = settings
    ? pick(locale as Locale, settings.taglineEn, settings.taglineAl)
    : "";

  return (
    <footer
      className="grid grid-cols-1 gap-10 border-t px-6 py-14 transition-colors duration-theme ease-editorial md:grid-cols-[1.4fr_1fr_1fr] md:gap-[60px] md:px-12"
      style={{ borderColor: "var(--footer-border)" }}
    >
      <div>
        <p className="mb-[10px] font-serif text-xl">DJ Architects</p>
        <p className="max-w-[280px] text-[13px] leading-[1.7]" style={{ color: "var(--subtle)" }}>
          {tagline}
        </p>
      </div>
      <div className="flex flex-col gap-2 text-[13px]" style={{ color: "var(--subtle)" }}>
        {settings?.address && <span>{settings.address}</span>}
        {settings?.contactPhone && (
          <a href={`tel:${settings.contactPhone}`}>{settings.contactPhone}</a>
        )}
      </div>
      <div className="flex flex-col gap-2 text-[13px]">
        {settings?.instagramUrl && (
          <a href={settings.instagramUrl} target="_blank" rel="noreferrer">
            {t("instagram")}
          </a>
        )}
        {settings?.pinterestUrl && (
          <a href={settings.pinterestUrl} target="_blank" rel="noreferrer">
            {t("pinterest")}
          </a>
        )}
        {settings?.linkedinUrl && (
          <a href={settings.linkedinUrl} target="_blank" rel="noreferrer">
            {t("linkedin")}
          </a>
        )}
        <span
          className="mt-[14px] whitespace-nowrap font-mono text-[11px] tracking-[0.1em]"
          style={{ color: "var(--copy-dim)" }}
        >
          {t("copyright")}
        </span>
      </div>
    </footer>
  );
}
