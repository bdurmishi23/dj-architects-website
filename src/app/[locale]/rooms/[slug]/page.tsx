import { notFound } from "next/navigation";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getRoomTypeBySlug, getProjectsForRoom } from "@/lib/sanity/queries";
import { urlForImage } from "@/lib/sanity/image";
import { pick } from "@/lib/i18n";
import { localizedAlternates } from "@/lib/metadata";
import { ROOM_MARKS, ROOM_CODES, ROOM_SLUGS, type RoomSlug } from "@/lib/marks";
import PlanMark from "@/components/icons/PlanMark";
import type { Locale } from "@/i18n/routing";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ locale: Locale; slug: string }>;
}

function isRoomSlug(slug: string): slug is RoomSlug {
  return (ROOM_SLUGS as string[]).includes(slug);
}

export function generateStaticParams() {
  return ROOM_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  if (!isRoomSlug(slug)) return {};
  return { alternates: localizedAlternates(`/rooms/${slug}`) };
}

export default async function RoomPage({ params }: Props) {
  const { locale, slug } = await params;
  if (!isRoomSlug(slug)) notFound();

  const [room, related, t] = await Promise.all([
    getRoomTypeBySlug(slug),
    getProjectsForRoom(slug, 3),
    getTranslations("room"),
  ]);

  if (!room) notFound();

  const name = pick(locale, room.nameEn, room.nameAl);
  const description = pick(locale, room.descriptionEn, room.descriptionAl);
  const images = (room.gallery ?? [])
    .map((img) => urlForImage(img)?.width(1200).height(900).fit("crop").url())
    .filter((src): src is string => Boolean(src));

  return (
    <article>
      <div className="px-6 pb-5 pt-11 md:px-12">
        <Link
          href="/#rooms"
          className="mb-[34px] inline-flex items-center gap-[10px] font-mono text-[11px] tracking-[0.1em] transition-colors duration-300 ease-editorial hover:text-brass"
          style={{ color: "var(--subtle)" }}
        >
          <span className="text-[13px]">←</span>
          {t("back")}
        </Link>
        <div className="flex items-start gap-[26px]">
          <span className="flex-none pt-[6px]">
            <PlanMark spec={ROOM_MARKS[slug]} scale={60 / 44} />
          </span>
          <div>
            <span className="mb-3 block font-mono text-[11px] tracking-[0.16em] text-brass">
              {ROOM_CODES[slug]}
            </span>
            <h1 className="font-serif text-[48px] font-light tracking-[-0.01em]">{name}</h1>
            <p className="mt-[18px] max-w-[480px] text-[15px] leading-[1.75]" style={{ color: "var(--subtle)" }}>
              {description}
            </p>
          </div>
        </div>
      </div>

      {images.length > 0 && (
        <div className="px-6 pb-10 pt-11 md:px-12">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1.4fr_1fr] sm:grid-rows-2">
            {images.map((src, i) => (
              <div
                key={i}
                className={`overflow-hidden rounded-card ${
                  i === 0 ? "h-[220px] sm:row-span-2 sm:h-auto" : "h-[220px]"
                }`}
              >
                <Image
                  src={src}
                  alt={`${name} — ${i + 1}`}
                  width={800}
                  height={600}
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {related.length > 0 && (
        <div className="px-6 pb-[130px] pt-5 md:px-12">
          <div className="mb-[26px] border-b pb-[18px]" style={{ borderColor: "var(--hairline)" }}>
            <span className="font-mono text-[11px] tracking-[0.14em]" style={{ color: "var(--subtle)" }}>
              {t("related")}
            </span>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {related.map((project) => (
              <Link
                key={project._id}
                href="/work"
                className="flex flex-col gap-2 rounded-card border px-[22px] py-5 transition-colors duration-300 ease-editorial hover:border-brass hover:bg-[var(--card-hover)]"
                style={{ borderColor: "var(--hairline)" }}
              >
                <span className="font-mono text-xs text-brass">
                  {project.signatureMark.toUpperCase()}
                </span>
                <span className="font-serif text-xl font-light leading-[1.2]">{project.name}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
