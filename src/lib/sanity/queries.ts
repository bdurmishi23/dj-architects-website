import { client, projectId } from "./client";
import type { Project, RoomType, SiteSettings } from "./types";
import type { RoomSlug } from "@/lib/marks";

const projectFields = `
  _id,
  name,
  "slug": slug.current,
  discipline,
  categoryEn,
  categoryAl,
  location,
  year,
  status,
  area,
  rooms,
  coverImage,
  signatureMark,
  emphasis,
  featuredOnHome,
  order
`;

const projectDetailFields = `
  ${projectFields},
  descriptionEn,
  descriptionAl,
  floorPlanImage,
  renderImages
`;

// Sanity's client.fetch() goes through Next.js's patched fetch, which
// caches indefinitely by default — without this, the first request ever
// made (often with an empty dataset) gets cached and never re-fetched.
const FETCH_OPTIONS = { next: { revalidate: 60 } };

export async function getFeaturedProjects(): Promise<Project[]> {
  if (!projectId) return [];
  return client.fetch(
    `*[_type == "project" && featuredOnHome == true] | order(order asc) { ${projectFields} }`,
    {},
    FETCH_OPTIONS
  );
}

export async function getAllProjects(): Promise<Project[]> {
  if (!projectId) return [];
  return client.fetch(
    `*[_type == "project"] | order(discipline asc, order asc) { ${projectFields} }`,
    {},
    FETCH_OPTIONS
  );
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  if (!projectId) return null;
  return client.fetch(
    `*[_type == "project" && slug.current == $slug][0] { ${projectDetailFields} }`,
    { slug },
    FETCH_OPTIONS
  );
}

export async function getSiteSettings(): Promise<SiteSettings | null> {
  if (!projectId) return null;
  return client.fetch(
    `*[_type == "siteSettings"][0] {
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
  }`,
    {},
    FETCH_OPTIONS
  );
}

export async function getRoomTypes(): Promise<RoomType[]> {
  if (!projectId) return [];
  return client.fetch(
    `*[_type == "roomType"] { _id, slug, nameEn, nameAl, descriptionEn, descriptionAl, gallery }`,
    {},
    FETCH_OPTIONS
  );
}

export async function getRoomTypeBySlug(slug: RoomSlug): Promise<RoomType | null> {
  if (!projectId) return null;
  return client.fetch(
    `*[_type == "roomType" && slug == $slug][0] { _id, slug, nameEn, nameAl, descriptionEn, descriptionAl, gallery }`,
    { slug },
    FETCH_OPTIONS
  );
}

export async function getRoomTypesBySlugs(slugs: RoomSlug[]): Promise<RoomType[]> {
  if (!projectId || slugs.length === 0) return [];
  return client.fetch(
    `*[_type == "roomType" && slug in $slugs] { _id, slug, nameEn, nameAl, descriptionEn, descriptionAl, gallery }`,
    { slugs },
    FETCH_OPTIONS
  );
}

export async function getRoomProjectCounts(): Promise<Record<string, number>> {
  if (!projectId) return {};
  const rows: { slug: string; count: number }[] = await client.fetch(
    `*[_type == "roomType"] { "slug": slug, "count": count(*[_type == "project" && ^.slug in rooms]) }`,
    {},
    FETCH_OPTIONS
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
    { slug, limit },
    FETCH_OPTIONS
  );
}
