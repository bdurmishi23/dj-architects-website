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
    <div
      className="grid grid-cols-1 gap-px sm:grid-cols-3"
      style={{ background: "var(--hairline)" }}
    >
      {ordered.map((room) => (
        <Link
          key={room._id}
          href={`/rooms/${room.slug}`}
          className="flex flex-col gap-4 bg-[var(--room-bg)] px-7 pb-[30px] pt-[26px] transition-colors duration-300 ease-editorial hover:bg-[var(--card-hover-tint)] hover:shadow-[inset_0_0_0_1px_var(--brass)]"
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
          <span className="font-serif text-[26px] font-light leading-[1.15]">
            {pick(locale, room.nameEn, room.nameAl)}
          </span>
          <span className="text-[13px] leading-[1.65]" style={{ color: "var(--subtle)" }}>
            {pick(locale, room.descriptionEn, room.descriptionAl)}
          </span>
        </Link>
      ))}
    </div>
  );
}
