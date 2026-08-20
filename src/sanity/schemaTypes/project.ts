import { defineField, defineType } from "sanity";
import { PROJECT_MARK_OPTIONS, ROOM_SLUGS } from "@/lib/marks";

const disciplines = [
  { title: "Architecture", value: "architecture" },
  { title: "Interiors", value: "interiors" },
  { title: "Hospitality", value: "hospitality" },
];

const statuses = [
  { title: "Completed", value: "built" },
  { title: "Under construction", value: "construction" },
  { title: "In design", value: "design" },
];

const emphases = [
  { title: "Compact row", value: "compact" },
  { title: "Medium row", value: "medium" },
  { title: "Feature row (largest)", value: "feature" },
];

export const project = defineType({
  name: "project",
  title: "Project",
  type: "document",
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "display", title: "Display" },
  ],
  fields: [
    defineField({
      name: "name",
      title: "Name",
      description: 'e.g. "Villa Dajti" — used as-is in both languages.',
      type: "string",
      group: "content",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "discipline",
      title: "Discipline",
      description: "Groups this project on the All projects page.",
      type: "string",
      group: "content",
      options: { list: disciplines, layout: "radio" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "categoryEn",
      title: "Category (English)",
      description: 'Short label shown in listings, e.g. "Residential renovation".',
      type: "string",
      group: "content",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "categoryAl",
      title: "Category (Albanian)",
      type: "string",
      group: "content",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
      group: "content",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "year",
      title: "Year",
      type: "number",
      group: "content",
      validation: (rule) => rule.min(2020).max(2100).required(),
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      group: "content",
      options: { list: statuses, layout: "radio" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "rooms",
      title: "Rooms featured",
      description: "Which room types this project appears under in \"Browse by room\".",
      type: "array",
      group: "content",
      of: [{ type: "string" }],
      options: {
        list: ROOM_SLUGS.map((slug) => ({ title: slug, value: slug })),
      },
    }),
    defineField({
      name: "coverImage",
      title: "Cover image",
      type: "image",
      group: "content",
      options: { hotspot: true },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "signatureMark",
      title: "Signature mark",
      description: "Preset abstract plan-silhouette icon shown next to the project in listings.",
      type: "string",
      group: "display",
      options: {
        list: PROJECT_MARK_OPTIONS.map((key) => ({
          title: key.toUpperCase(),
          value: key,
        })),
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "emphasis",
      title: "Row emphasis",
      description: "Controls title/thumbnail size in the tracklist. Give one project \"Feature\" to lead the list.",
      type: "string",
      group: "display",
      options: { list: emphases, layout: "radio" },
      initialValue: "compact",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "featuredOnHome",
      title: "Featured on homepage",
      description: "Include in the homepage's \"Selected work\" section.",
      type: "boolean",
      group: "display",
      initialValue: false,
    }),
    defineField({
      name: "order",
      title: "Sort order",
      description: "Lower numbers appear first, within the homepage selection and within each discipline group.",
      type: "number",
      group: "display",
      initialValue: 0,
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "discipline",
      media: "coverImage",
    },
  },
});
