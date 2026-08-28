import { defineLocations, type PresentationPluginOptions } from "sanity/presentation";

// Default-locale (al) URLs — good enough for jumping from a document to its
// page in Presentation Tool. Deep per-locale resolution isn't wired up here.
export const resolve: PresentationPluginOptions["resolve"] = {
  locations: {
    project: defineLocations({
      select: { name: "name", slug: "slug.current" },
      resolve: (doc) => ({
        locations: [
          {
            title: doc?.name || "Untitled",
            href: `/al/work/${doc?.slug}`,
          },
          { title: "Të gjitha projektet", href: "/al/work" },
        ],
      }),
    }),
    roomType: defineLocations({
      select: { nameAl: "nameAl", slug: "slug" },
      resolve: (doc) => ({
        locations: [
          {
            title: doc?.nameAl || "Untitled",
            href: `/al/rooms/${doc?.slug}`,
          },
          { title: "Faqja kryesore", href: "/al" },
        ],
      }),
    }),
    siteSettings: defineLocations({
      select: {},
      resolve: () => ({
        locations: [{ title: "Faqja kryesore", href: "/al" }],
      }),
    }),
  },
};
