import type { StructureResolver } from "sanity/structure";
import { orderableDocumentListDeskItem } from "@sanity/orderable-document-list";
import { CogIcon, HomeIcon, ThLargeIcon } from "@sanity/icons";
import { ROOM_SLUGS, type RoomSlug } from "@/lib/marks";

// Studio-only display labels for the fixed 6 rooms — matches the Albanian
// names used in the seeded content, so founders recognize them at a glance.
const ROOM_LABELS: Record<RoomSlug, string> = {
  living: "Dhoma ndenjeje",
  kitchen: "Kuzhina",
  bedroom: "Dhoma gjumi",
  bath: "Tualete",
  entrance: "Hyrje",
  terrace: "Tarraca",
};

export const structure: StructureResolver = (S, context) =>
  S.list()
    .title("Përmbajtja")
    .items([
      S.listItem()
        .title("Cilësimet e faqes")
        .icon(CogIcon)
        .id("siteSettings")
        .child(
          S.document().schemaType("siteSettings").documentId("siteSettings")
        ),
      S.divider(),
      orderableDocumentListDeskItem({
        type: "project",
        title: "Projektet",
        icon: HomeIcon,
        S,
        context,
      }),
      S.divider(),
      S.listItem()
        .title("Ambientet")
        .icon(ThLargeIcon)
        .id("roomTypes")
        .child(
          S.list()
            .title("Ambientet")
            .items(
              ROOM_SLUGS.map((slug) =>
                S.listItem()
                  .title(ROOM_LABELS[slug])
                  .id(`roomType-${slug}`)
                  .child(
                    S.document()
                      .schemaType("roomType")
                      .documentId(`roomType-${slug}`)
                  )
              )
            )
        ),
    ]);
