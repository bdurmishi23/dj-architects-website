import { getTranslations, getLocale } from "next-intl/server";
import { draftMode } from "next/headers";
import { getSiteSettings } from "@/lib/sanity/queries";
import { pick } from "@/lib/i18n";
import type { Locale } from "@/i18n/routing";

const FOUNDING_YEAR = 2026;

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
  const hasSocialLinks = Boolean(
    settings?.instagramUrl || settings?.pinterestUrl || settings?.linkedinUrl
  );

  const currentYear = new Date().getFullYear();
  const yearLabel =
    currentYear > FOUNDING_YEAR ? `${FOUNDING_YEAR}–${currentYear}` : `${FOUNDING_YEAR}—`;

  return (
    <footer
      className="site-footer border-t transition-colors duration-theme ease-editorial"
      style={{ borderColor: "var(--footer-border)" }}
    >
      <div className="site-footer__brand">
        <p className="site-footer__name font-serif">DJ Architects</p>
        <p className="site-footer__tagline" style={{ color: "var(--subtle)" }}>
          {tagline}
        </p>
      </div>
      <div className="site-footer__contact" style={{ color: "var(--subtle)" }}>
        {settings?.address && <span className="site-footer__address">{settings.address}</span>}
        {settings?.contactPhone && (
          <a className="site-footer__phone" href={`tel:${settings.contactPhone}`}>
            {settings.contactPhone}
          </a>
        )}
      </div>
      <div className="site-footer__meta">
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
          className={`site-footer__copyright font-mono ${
            hasSocialLinks ? "mt-[14px]" : ""
          }`}
          style={{ color: "var(--copy-dim)" }}
        >
          {t("copyright")} {yearLabel}
        </span>
      </div>
    </footer>
  );
}
