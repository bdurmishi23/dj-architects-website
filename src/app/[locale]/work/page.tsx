import { getTranslations } from "next-intl/server";
import { WorkTracklist } from "@/components/WorkTracklist";
import { getAllProjects } from "@/lib/sanity/queries";
import { localizedAlternates } from "@/lib/metadata";
import type { Locale } from "@/i18n/routing";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return { title: "Work", alternates: localizedAlternates("/work") };
}

export default async function WorkPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const [projects, t] = await Promise.all([
    getAllProjects(),
    getTranslations("allProjects"),
  ]);

  return (
    <section className="px-6 pb-[140px] pt-16 sm:pt-24 md:px-12">
      <div
        className="flex flex-col gap-2 border-b pb-[26px] sm:flex-row sm:items-baseline sm:justify-between sm:gap-10"
        style={{ borderColor: "var(--hairline)" }}
      >
        <h1 className="font-serif text-[32px] font-light tracking-[-0.01em] sm:text-[40px] lg:text-[46px]">
          {t("title")}
        </h1>
        <span
          className="flex-none whitespace-nowrap font-mono text-[11px] tracking-[0.14em]"
          style={{ color: "var(--subtle)" }}
        >
          {t("count", { count: projects.length })}
        </span>
      </div>
      <p className="mt-[22px] max-w-[520px] text-sm leading-[1.7]" style={{ color: "var(--subtle)" }}>
        {t("intro")}
      </p>

      <div className="pt-5">
        <WorkTracklist projects={projects} locale={locale} grouping="discipline" />
      </div>
    </section>
  );
}
