import { client, projectId } from "./client";
import type { Project, RoomType, SiteSettings } from "./types";
import type { RoomSlug } from "@/lib/marks";

const projectFields = `
  _id,
  name,
  discipline,
  categoryEn,
  categoryAl,
  location,
  year,
  status,
  rooms,
  coverImage,
  signatureMark,
  emphasis,
  featuredOnHome,
  order
`;

export async function getFeaturedProjects(): Promise<Project[]> {
  if (!projectId) return [];
  return client.fetch(
    `*[_type == "project" && featuredOnHome == true] | order(order asc) { ${projectFields} }`
  );
}

export async function getAllProjects(): Promise<Project[]> {
  if (!projectId) return [];
  return client.fetch(
    `*[_type == "project"] | order(discipline asc, order asc) { ${projectFields} }`
  );
}

export async function getSiteSettings(): Promise<SiteSettings | null> {
  if (!projectId) return null;
  return client.fetch(`*[_type == "siteSettings"][0] {
    heroImage,
    heroTextEn,
    heroTextAl,
    taglineEn,
    taglineAl,
    aboutKickerEn,
    aboutKickerAl,
    aboutLeadEn,
    aboutLeadAl,
    quoteDeniEn,
    quoteDeniAl,
    quoteJurgenEn,
    quoteJurgenAl,
    aboutPortrait,
    contactLeadEn,
    contactLeadAl,
    contactNoteEn,
    contactNoteAl,
    contactEmail,
    contactPhone,
    address,
    instagramUrl,
    pinterestUrl,
    linkedinUrl
  }`);
}

export async function getRoomTypes(): Promise<RoomType[]> {
  if (!projectId) return [];
  return client.fetch(
    `*[_type == "roomType"] { _id, slug, nameEn, nameAl, descriptionEn, descriptionAl, gallery }`
  );
}

export async function getRoomTypeBySlug(slug: RoomSlug): Promise<RoomType | null> {
  if (!projectId) return null;
  return client.fetch(
    `*[_type == "roomType" && slug == $slug][0] { _id, slug, nameEn, nameAl, descriptionEn, descriptionAl, gallery }`,
    { slug }
  );
}

export async function getRoomProjectCounts(): Promise<Record<string, number>> {
  if (!projectId) return {};
  const rows: { slug: string; count: number }[] = await client.fetch(
    `*[_type == "roomType"] { "slug": slug, "count": count(*[_type == "project" && ^.slug in rooms]) }`
  );
  return Object.fromEntries(rows.map((r) => [r.slug, r.count]));
}

export async function getProjectsForRoom(
  slug: RoomSlug,
  limit = 3
): Promise<Project[]> {
  if (!projectId) return [];
  return client.fetch(
    `*[_type == "project" && $slug in rooms] | order(order asc) [0...$limit] { ${projectFields} }`,
    { slug, limit }
  );
}
