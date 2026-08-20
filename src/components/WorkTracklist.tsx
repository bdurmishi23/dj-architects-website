import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { urlForImage } from "@/lib/sanity/image";
import { PROJECT_MARKS } from "@/lib/marks";
import { pick } from "@/lib/i18n";
import PlanMark from "@/components/icons/PlanMark";
import type { Project, Emphasis } from "@/lib/sanity/types";
import type { Locale } from "@/i18n/routing";

const SIZE_MAP: Record<Emphasis, { title: string; w: number; h: number; py: string }> = {
  compact: { title: "text-[29px]", w: 230, h: 150, py: "py-[26px]" },
  medium: { title: "text-[34px]", w: 300, h: 200, py: "py-[26px]" },
  feature: { title: "text-[40px]", w: 360, h: 230, py: "py-[34px]" },
};

function Row({
  project,
  code,
  locale,
}: {
  project: Project;
  code: string;
  locale: Locale;
}) {
  const size = SIZE_MAP[project.emphasis];
  const mark = PROJECT_MARKS[project.signatureMark];
  const src = urlForImage(project.coverImage)?.width(size.w * 2).height(size.h * 2).fit("crop").url();
  const category = pick(locale, project.categoryEn, project.categoryAl);

  return (
    <div
      className="group -mx-[18px] flex items-start gap-[26px] border-b border-hairline px-[18px] pr-9 border-l-[3px] border-l-transparent transition-[background-color,border-color] duration-300 ease-editorial hover:border-l-brass hover:bg-[var(--row-hover-tint)]"
      style={{ paddingTop: size.py === "py-[34px]" ? 34 : 26, paddingBottom: size.py === "py-[34px]" ? 34 : 26 }}
    >
      <span className="w-[34px] flex-none pt-[9px] font-mono text-xs tracking-[0.1em] text-brass">
        {code}
      </span>
      <span className="w-11 flex-none pt-[2px]">
        <PlanMark spec={mark} />
      </span>
      <span className="min-w-0 flex-1">
        <span className={`block font-serif font-light leading-[1.15] tracking-[-0.01em] ${size.title}`}>
          {project.name}
        </span>
        <span className="mt-[9px] block text-[13px] tracking-[0.01em]" style={{ color: "var(--subtle)" }}>
          {category} · {project.location} · {project.year}
        </span>
      </span>
      {src && (
        <span
          className="flex-none overflow-hidden rounded-card"
          style={{ width: size.w, height: size.h }}
        >
          <Image src={src} alt={project.name} width={size.w} height={size.h} className="h-full w-full object-cover" />
        </span>
      )}
    </div>
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
}: {
  projects: Project[];
  locale: Locale;
  grouping: "sides" | "discipline";
}) {
  if (grouping === "sides") {
    const t = await getTranslations("home");
    const mid = Math.ceil(projects.length / 2);
    const sideA = projects.slice(0, mid);
    const sideB = projects.slice(mid);
    const yearOf = (list: Project[]) =>
      list.length ? Math.max(...list.map((p) => p.year)) : "";

    return (
      <div>
        {sideA.length > 0 && (
          <>
            <SideDivider label={`${t("sideA")} · ${yearOf(sideA)}`} />
            {sideA.map((p, i) => (
              <Row key={p._id} project={p} code={`A${i + 1}`} locale={locale} />
            ))}
          </>
        )}
        {sideB.length > 0 && (
          <>
            <SideDivider label={`${t("sideB")} · ${yearOf(sideB)}`} />
            {sideB.map((p, i) => (
              <Row key={p._id} project={p} code={`B${i + 1}`} locale={locale} />
            ))}
          </>
        )}
      </div>
    );
  }

  const tDiscipline = await getTranslations("discipline");
  const groups: { key: Project["discipline"]; letter: string; projects: Project[] }[] = [
    { key: "architecture", letter: "A", projects: [] },
    { key: "interiors", letter: "B", projects: [] },
    { key: "hospitality", letter: "C", projects: [] },
  ];
  for (const p of projects) {
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
              <Row key={p._id} project={p} code={`${g.letter}${i + 1}`} locale={locale} />
            ))}
          </div>
        ))}
    </div>
  );
}
