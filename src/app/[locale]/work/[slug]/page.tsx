import { notFound } from "next/navigation";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import {
  getAllProjects,
  getProjectBySlug,
  getRoomTypesBySlugs,
} from "@/lib/sanity/queries";
import { urlForImage } from "@/lib/sanity/image";
import { pick } from "@/lib/i18n";
import { localizedAlternates } from "@/lib/metadata";
import { PROJECT_MARKS, ROOM_CODES } from "@/lib/marks";
import PlanMark from "@/components/icons/PlanMark";
import type { Locale } from "@/i18n/routing";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ locale: Locale; slug: string }>;
}

export async function generateStaticParams() {
  const projects = await getAllProjects();
  return projects.filter((p) => p.slug).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return {};
  return {
    title: project.name,
    alternates: localizedAlternates(`/work/${slug}`),
  };
}

export default async function ProjectPage({ params }: Props) {
  const { locale, slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const [t, tDiscipline, tStatus, rooms] = await Promise.all([
    getTranslations("project"),
    getTranslations("discipline"),
    getTranslations("status"),
    getRoomTypesBySlugs(project.rooms ?? []),
  ]);

  const description = pick(locale, project.descriptionEn, project.descriptionAl);
  const category = pick(locale, project.categoryEn, project.categoryAl);
  const mark = PROJECT_MARKS[project.signatureMark];
  const code = project.signatureMark.toUpperCase();

  const metaLine = [
    tDiscipline(project.discipline),
    category,
    project.location,
    String(project.year),
    tStatus(project.status),
    project.area ? `${project.area} m²` : null,
  ]
    .filter(Boolean)
    .join(" · ");

  const floorPlanSrc = project.floorPlanImage
    ? urlForImage(project.floorPlanImage)?.width(1400).fit("max").url()
    : undefined;

  const images = (project.renderImages ?? [])
    .map((img) => urlForImage(img)?.width(1200).height(900).fit("crop").url())
    .filter((src): src is string => Boolean(src));

  return (
    <article>
      <div className="px-6 pb-5 pt-11 md:px-12">
        <Link
          href="/work"
          className="mb-[34px] inline-flex items-center gap-[10px] font-mono text-[11px] tracking-[0.1em] transition-colors duration-300 ease-editorial hover:text-brass"
          style={{ color: "var(--subtle)" }}
        >
          <span className="text-[13px]">←</span>
          {t("back")}
        </Link>
        <div className="flex items-start gap-4 sm:gap-[26px]">
          <span className="flex-none pt-[6px]">
            <PlanMark spec={mark} scale={60 / 44} />
          </span>
          <div>
            <span className="mb-3 block font-mono text-[11px] tracking-[0.16em] text-brass">
              {code}
            </span>
            <h1 className="font-serif text-[32px] font-light tracking-[-0.01em] sm:text-[40px] lg:text-[48px]">
              {project.name}
            </h1>
            {description && (
              <p
                className="mt-[18px] max-w-[480px] text-[15px] leading-[1.75]"
                style={{ color: "var(--subtle)" }}
              >
                {description}
              </p>
            )}
            <p className="mt-6 text-sm" style={{ color: "var(--subtle)" }}>
              {metaLine}
            </p>
          </div>
        </div>
      </div>

      {floorPlanSrc && (
        <div className="px-6 pb-10 pt-11 md:px-12">
          <p
            className="mb-4 font-mono text-[11px] tracking-[0.14em]"
            style={{ color: "var(--subtle)" }}
          >
            {t("floorPlan")}
          </p>
          <div
            className="overflow-hidden rounded-card border"
            style={{ borderColor: "var(--hairline)", background: "var(--room-bg)" }}
          >
            <Image
              src={floorPlanSrc}
              alt={`${project.name} — floor plan`}
              width={1400}
              height={1000}
              className="w-full object-contain"
            />
          </div>
        </div>
      )}

      {images.length > 0 && (
        <div className="px-6 pb-10 pt-5 md:px-12">
          {images.length === 3 ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-[1.4fr_1fr] md:grid-rows-2">
              {images.map((src, i) => (
                <div
                  key={i}
                  className={`overflow-hidden rounded-card ${
                    i === 0 ? "h-[220px] md:row-span-2 md:h-auto" : "h-[220px]"
                  }`}
                >
                  <Image
                    src={src}
                    alt={`${project.name} — ${i + 1}`}
                    width={800}
                    height={600}
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {images.map((src, i) => (
                <div key={i} className="aspect-[4/3] overflow-hidden rounded-card">
                  <Image
                    src={src}
                    alt={`${project.name} — ${i + 1}`}
                    width={800}
                    height={600}
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {rooms.length > 0 && (
        <div className="px-6 pb-[130px] pt-5 md:px-12">
          <div
            className="mb-[26px] border-b pb-[18px]"
            style={{ borderColor: "var(--hairline)" }}
          >
            <span
              className="font-mono text-[11px] tracking-[0.14em]"
              style={{ color: "var(--subtle)" }}
            >
              {t("roomsFeatured")}
            </span>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {rooms.map((room) => (
              <Link
                key={room._id}
                href={`/rooms/${room.slug}`}
                className="flex flex-col gap-2 rounded-card border px-[22px] py-5 transition-colors duration-300 ease-editorial hover:border-brass hover:bg-[var(--card-hover)]"
                style={{ borderColor: "var(--hairline)" }}
              >
                <span className="font-mono text-xs text-brass">
                  {ROOM_CODES[room.slug]}
                </span>
                <span className="font-serif text-xl font-light leading-[1.2]">
                  {pick(locale, room.nameEn, room.nameAl)}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
