import {
  defineDocuments,
  defineLocations,
  type PresentationPluginOptions,
} from "sanity/presentation";

// Reverse direction: given the URL currently shown in the preview iframe,
// which document(s) does it correspond to ("Documents on this page"). Route
// patterns capture next-intl's locale prefix (:locale — matches /al/... and
// /en/... alike) so the URL actually matches at all; the filters below just
// don't reference $locale, since slugs aren't locale-specific in this schema.
const mainDocuments = defineDocuments([
  {
    route: "/:locale/work/:slug",
    filter: `_type == "project" && slug.current == $slug`,
  },
  {
    route: "/:locale/rooms/:slug",
    filter: `_type == "roomType" && slug == $slug`,
  },
  {
    route: "/:locale",
    filter: `_type == "siteSettings"`,
  },
]);

// Forward direction: given a document, where does it live on the site — for
// jumping from a document to its page. Default-locale (al) URLs only; deep
// per-locale resolution isn't wired up here.
export const resolve: PresentationPluginOptions["resolve"] = {
  mainDocuments,
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
