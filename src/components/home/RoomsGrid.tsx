import { Link } from "@/i18n/navigation";
import { ROOM_MARKS, ROOM_CODES, ROOM_SLUGS } from "@/lib/marks";
import PlanMark from "@/components/icons/PlanMark";
import { pick } from "@/lib/i18n";
import type { RoomType } from "@/lib/sanity/types";
import type { Locale } from "@/i18n/routing";

export default function RoomsGrid({
  rooms,
  counts,
  locale,
}: {
  rooms: RoomType[];
  counts: Record<string, number>;
  locale: Locale;
}) {
  const bySlug = new Map(rooms.map((r) => [r.slug, r]));
  const ordered = ROOM_SLUGS.map((slug) => bySlug.get(slug)).filter(
    (r): r is RoomType => Boolean(r)
  );

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
      {ordered.map((room) => (
        <Link
          key={room._id}
          href={`/rooms/${room.slug}`}
          className="flex flex-col gap-3 rounded-card border border-[var(--hairline)] bg-[var(--room-bg)] px-4 pb-5 pt-4 transition-colors duration-300 ease-editorial hover:border-brass hover:bg-[var(--card-hover-tint)] sm:gap-4 sm:px-7 sm:pb-[30px] sm:pt-[26px]"
        >
          <span className="flex items-start justify-between gap-4 font-mono text-xs tracking-[0.1em] text-brass">
            <span className="flex items-center gap-[14px]">
              {ROOM_CODES[room.slug]}
              <PlanMark spec={ROOM_MARKS[room.slug]} scale={0.62} />
            </span>
            <span style={{ color: "var(--subtle)" }} className="tracking-[0.08em]">
              {String(counts[room.slug] ?? 0).padStart(2, "0")}
            </span>
          </span>
          <span className="font-serif text-xl font-light leading-[1.15] sm:text-[26px]">
            {pick(locale, room.nameEn, room.nameAl)}
          </span>
          <span
            className="text-xs leading-[1.55] sm:text-[13px] sm:leading-[1.65]"
            style={{ color: "var(--subtle)" }}
          >
            {pick(locale, room.descriptionEn, room.descriptionAl)}
          </span>
        </Link>
      ))}
    </div>
  );
}
