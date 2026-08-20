import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
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
    <section className="px-6 pb-[140px] pt-24 md:px-12">
      <Link
        href="/"
        className="mb-[30px] inline-flex items-center gap-[10px] rounded-pill border py-[9px] pl-[14px] pr-[18px] font-mono text-[11px] tracking-[0.1em] transition-colors duration-300 ease-editorial hover:border-brass hover:text-brass"
        style={{ borderColor: "var(--hairline)", color: "var(--subtle)" }}
      >
        <span className="text-[13px]">←</span>
        {t("back")}
      </Link>

      <div className="flex items-baseline justify-between gap-10 border-b pb-[26px]" style={{ borderColor: "var(--hairline)" }}>
        <h1 className="font-serif text-[46px] font-light tracking-[-0.01em]">{t("title")}</h1>
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
