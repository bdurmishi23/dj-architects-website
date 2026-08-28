import { getTranslations } from "next-intl/server";
import { draftMode } from "next/headers";
import { Link } from "@/i18n/navigation";
import Hero from "@/components/home/Hero";
import { WorkTracklist } from "@/components/WorkTracklist";
import ProjectCrate from "@/components/home/ProjectCrate";
import RoomsGrid from "@/components/home/RoomsGrid";
import AboutSection from "@/components/home/AboutSection";
import ContactSection from "@/components/home/ContactSection";
import {
  getFeaturedProjects,
  getRoomTypes,
  getRoomProjectCounts,
  getSiteSettings,
} from "@/lib/sanity/queries";
import { urlForImage } from "@/lib/sanity/image";
import { pick } from "@/lib/i18n";
import { localizedAlternates } from "@/lib/metadata";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata() {
  return { alternates: localizedAlternates("") };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const { isEnabled: preview } = draftMode();
  const [settings, projects, rooms, roomCounts, t] = await Promise.all([
    getSiteSettings(preview),
    getFeaturedProjects(preview),
    getRoomTypes(preview),
    getRoomProjectCounts(),
    getTranslations("home"),
  ]);

  const heroImageSrc = settings?.heroImage
    ? urlForImage(settings.heroImage)?.width(2400).height(1500).fit("crop").url()
    : undefined;
  const heroLine = settings ? pick(locale, settings.heroTextEn, settings.heroTextAl) : "";

  return (
    <>
      <Hero
        imageSrc={heroImageSrc}
        heroLine={heroLine}
        locationLine="Tirana, AL"
        yearLine="2026—"
      />

      <section id="work" className="px-6 pb-10 pt-16 sm:pt-[120px] md:px-12">
        <div
          className="flex flex-col gap-2 border-b pb-[26px] sm:flex-row sm:items-baseline sm:justify-between sm:gap-10"
          style={{ borderColor: "var(--hairline)" }}
        >
          <h2 className="font-serif text-[26px] font-light tracking-[-0.01em] sm:text-[34px]">
            {t("workTitle")}
          </h2>
          <span
            className="flex-none whitespace-nowrap font-mono text-[11px] tracking-[0.14em]"
            style={{ color: "var(--subtle)" }}
          >
            {t("workCount", { count: projects.length })}
          </span>
        </div>

        <div className="hidden lg:block">
          <WorkTracklist projects={projects} locale={locale} grouping="sides" />
        </div>
        <ProjectCrate
          projects={projects}
          locale={locale}
          prevLabel={t("prevProject")}
          nextLabel={t("nextProject")}
        />

        <div className="flex justify-center pt-11">
          <Link
            href="/work"
            className="inline-flex items-center gap-[14px] whitespace-nowrap rounded-pill border px-[30px] py-[14px] text-sm tracking-[0.02em] text-ink transition-colors duration-500 ease-editorial hover:border-brass hover:text-brass"
            style={{ borderColor: "var(--cta-border)" }}
          >
            {t("allProjects")}
          </Link>
        </div>
      </section>

      <section id="rooms" className="px-6 pb-10 pt-16 sm:pt-[100px] md:px-12">
        <div className="mb-9 flex flex-col gap-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-10">
          <h2 className="font-serif text-[26px] font-light tracking-[-0.01em] sm:text-[34px]">
            {t("roomsTitle")}
          </h2>
          <span
            className="max-w-[340px] text-[13px] leading-[1.7] sm:text-right"
            style={{ color: "var(--subtle)" }}
          >
            {t("roomsNote")}
          </span>
        </div>
        <RoomsGrid rooms={rooms} counts={roomCounts} locale={locale} />
      </section>

      <AboutSection settings={settings} locale={locale} portraitCaption={t("portraitCaption")} />
      <ContactSection settings={settings} locale={locale} />
    </>
  );
}
