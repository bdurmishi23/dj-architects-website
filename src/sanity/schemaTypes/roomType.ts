import { defineField, defineType } from "sanity";
import { ROOM_SLUGS } from "@/lib/marks";

// Exactly six room types by design — the slug, code and plan-mark icon for
// each are structural (see src/lib/marks.ts), not editorial. Founders edit
// the copy and photos; they don't add new room types.
export const roomType = defineType({
  name: "roomType",
  title: "Room type",
  type: "document",
  fields: [
    defineField({
      name: "slug",
      title: "Room",
      type: "string",
      options: {
        list: ROOM_SLUGS.map((slug) => ({ title: slug, value: slug })),
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "nameEn",
      title: "Name (English)",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "nameAl",
      title: "Name (Albanian)",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "descriptionEn",
      title: "Description (English)",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "descriptionAl",
      title: "Description (Albanian)",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "gallery",
      title: "Gallery",
      description: "Representative photos for this room type (aim for 3).",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
      validation: (rule) => rule.min(1),
    }),
  ],
  preview: {
    select: {
      title: "nameEn",
      subtitle: "slug",
      media: "gallery.0",
    },
  },
});
