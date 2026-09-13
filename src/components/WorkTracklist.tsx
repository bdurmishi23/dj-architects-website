import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { blurDataForImage, urlForImage } from "@/lib/sanity/image";
import { PROJECT_MARKS } from "@/lib/marks";
import { compactText, hasSlug, pickText } from "@/lib/content";
import { assignSideCodes } from "@/lib/projectCodes";
import type { ProjectWithCode } from "@/lib/projectCodes";
import PlanMark from "@/components/icons/PlanMark";
import type { Discipline, Project, Emphasis } from "@/lib/sanity/types";
import type { Locale } from "@/i18n/routing";

const SIZE_MAP: Record<Emphasis, { title: string; w: number; h: number; py: number }> = {
  compact: { title: "text-xl sm:text-[29px]", w: 230, h: 150, py: 26 },
  medium: { title: "text-2xl sm:text-[34px]", w: 300, h: 200, py: 26 },
  feature: { title: "text-3xl sm:text-[40px]", w: 360, h: 230, py: 34 },
};

function Row({
  project,
  code,
  locale,
  titleFallback,
}: {
  project: Project;
  code: string;
  locale: Locale;
  titleFallback: string;
}) {
  if (!project.slug) return null;

  const size = SIZE_MAP[project.emphasis ?? "compact"];
  const mark = project.signatureMark ? PROJECT_MARKS[project.signatureMark] : undefined;
  const src = urlForImage(project.coverImage)?.width(size.w * 2).height(size.h * 2).fit("crop").url();
  const blurDataURL = blurDataForImage(project.coverImage);
  const category = pickText(locale, project.categoryEn, project.categoryAl);
  const metadata = compactText([category, project.location, project.year]).join(" \u00b7 ");
  const title = project.name || titleFallback;

  return (
    <Link
      href={`/work/${project.slug}`}
      className="group -mx-[18px] flex flex-col gap-4 border-b border-l-[3px] border-l-transparent px-[18px] py-6 transition-[background-color,border-color] duration-300 ease-editorial hover:border-l-brass hover:bg-[var(--row-hover-tint)] sm:flex-row sm:items-start sm:gap-[26px] sm:py-[var(--row-py)] sm:pr-9"
      style={{
        borderBottomColor: "var(--hairline)",
        ["--row-py" as string]: `${size.py}px`,
      }}
    >
      <div className="flex items-center gap-4 sm:contents">
        <span className="w-[34px] flex-none font-mono text-xs tracking-[0.1em] text-brass sm:pt-[9px]">
          {code}
        </span>
        <span className="w-11 flex-none sm:pt-[2px]">
          {mark && <PlanMark spec={mark} />}
        </span>
      </div>
      <span className="min-w-0 flex-1">
        <span className={`block font-serif font-light leading-[1.15] tracking-[-0.01em] ${size.title}`}>
          {title}
        </span>
        {metadata && (
          <span className="mt-[9px] block text-[13px] tracking-[0.01em]" style={{ color: "var(--subtle)" }}>
            {metadata}
          </span>
        )}
      </span>
      {src && (
        <span
          className="block w-full flex-none overflow-hidden rounded-card sm:w-[var(--thumb-w)]"
          style={{
            aspectRatio: `${size.w} / ${size.h}`,
            ["--thumb-w" as string]: `${size.w}px`,
          }}
        >
          <Image
            src={src}
            alt={title}
            width={size.w}
            height={size.h}
            placeholder={blurDataURL ? "blur" : "empty"}
            blurDataURL={blurDataURL}
            className="h-full w-full object-cover"
          />
        </span>
      )}
    </Link>
  );
}

function SideDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-4 px-[18px] pb-[14px] pt-[34px] font-mono text-[11px] tracking-[0.16em]" style={{ color: "var(--subtle)" }}>
      <span className="flex-none whitespace-nowrap">{label}</span>
      <span className="h-px flex-1" style={{ background: "var(--hairline)" }} />
    </div>
  );
}

export async function WorkTracklist({
  projects,
  locale,
  grouping,
  titleFallback,
}: {
  projects: Project[];
  locale: Locale;
  grouping: "sides" | "discipline";
  titleFallback?: string;
}) {
  const renderableProjects = projects.filter(hasSlug);

  if (grouping === "sides") {
    const [t, tProject] = await Promise.all([
      getTranslations("home"),
      getTranslations("project"),
    ]);
    const fallback = titleFallback ?? tProject("untitled");
    const coded = assignSideCodes(renderableProjects);
    const sideA = coded.filter((c) => c.code.startsWith("A"));
    const sideB = coded.filter((c) => c.code.startsWith("B"));
    const yearOf = (list: ProjectWithCode[]) => {
      const years = list.map((c) => c.project.year).filter((year): year is number => Boolean(year));
      return years.length ? Math.max(...years) : "";
    };

    return (
      <div>
        {sideA.length > 0 && (
          <>
            <SideDivider label={compactText([t("sideA"), yearOf(sideA)]).join(" \u00b7 ")} />
            {sideA.map(({ project, code }) => (
              <Row key={project._id} project={project} code={code} locale={locale} titleFallback={fallback} />
            ))}
          </>
        )}
        {sideB.length > 0 && (
          <>
            <SideDivider label={compactText([t("sideB"), yearOf(sideB)]).join(" \u00b7 ")} />
            {sideB.map(({ project, code }) => (
              <Row key={project._id} project={project} code={code} locale={locale} titleFallback={fallback} />
            ))}
          </>
        )}
      </div>
    );
  }

  const [tDiscipline, tProject] = await Promise.all([
    getTranslations("discipline"),
    getTranslations("project"),
  ]);
  const fallback = titleFallback ?? tProject("untitled");
  const groups: { key: Discipline; letter: string; projects: Project[] }[] = [
    { key: "architecture", letter: "A", projects: [] },
    { key: "interiors", letter: "B", projects: [] },
    { key: "hospitality", letter: "C", projects: [] },
  ];
  for (const p of renderableProjects) {
    if (!p.discipline) continue;
    groups.find((g) => g.key === p.discipline)?.projects.push(p);
  }

  return (
    <div>
      {groups
        .filter((g) => g.projects.length > 0)
        .map((g) => (
          <div key={g.key}>
            <SideDivider label={tDiscipline(g.key)} />
            {g.projects.map((p, i) => (
              <Row key={p._id} project={p} code={`${g.letter}${i + 1}`} locale={locale} titleFallback={fallback} />
            ))}
          </div>
        ))}
    </div>
  );
}
