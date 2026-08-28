import { getClient, projectId } from "./client";
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
  featuredOnHome
`;

function shuffle<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

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
// Preview requests skip caching entirely so Presentation Tool edits show
// up immediately instead of waiting out the revalidation window.
function fetchOptions(preview: boolean) {
  return preview ? { cache: "no-store" as const } : { next: { revalidate: 60 } };
}

export async function getFeaturedProjects(preview = false): Promise<Project[]> {
  if (!projectId) return [];
  const result: { randomize: boolean; projects: Project[] } = await getClient(
    preview
  ).fetch(
    `{
      "randomize": *[_type == "siteSettings"][0].randomizeHomepageOrder,
      "projects": *[_type == "project" && featuredOnHome == true] | order(orderRank asc) { ${projectFields} }
    }`,
    {},
    fetchOptions(preview)
  );
  return result.randomize ? shuffle(result.projects) : result.projects;
}

export async function getAllProjects(): Promise<Project[]> {
  if (!projectId) return [];
  return getClient(false).fetch(
    `*[_type == "project"] | order(discipline asc, orderRank asc) { ${projectFields} }`,
    {},
    fetchOptions(false)
  );
}

export async function getProjectBySlug(
  slug: string,
  preview = false
): Promise<Project | null> {
  if (!projectId) return null;
  return getClient(preview).fetch(
    `*[_type == "project" && slug.current == $slug][0] { ${projectDetailFields} }`,
    { slug },
    fetchOptions(preview)
  );
}

export async function getSiteSettings(preview = false): Promise<SiteSettings | null> {
  if (!projectId) return null;
  return getClient(preview).fetch(
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
    fetchOptions(preview)
  );
}

export async function getRoomTypes(preview = false): Promise<RoomType[]> {
  if (!projectId) return [];
  return getClient(preview).fetch(
    `*[_type == "roomType"] { _id, slug, nameEn, nameAl, descriptionEn, descriptionAl, gallery }`,
    {},
    fetchOptions(preview)
  );
}

export async function getRoomTypeBySlug(
  slug: RoomSlug,
  preview = false
): Promise<RoomType | null> {
  if (!projectId) return null;
  return getClient(preview).fetch(
    `*[_type == "roomType" && slug == $slug][0] { _id, slug, nameEn, nameAl, descriptionEn, descriptionAl, gallery }`,
    { slug },
    fetchOptions(preview)
  );
}

export async function getRoomTypesBySlugs(
  slugs: RoomSlug[],
  preview = false
): Promise<RoomType[]> {
  if (!projectId || slugs.length === 0) return [];
  return getClient(preview).fetch(
    `*[_type == "roomType" && slug in $slugs] { _id, slug, nameEn, nameAl, descriptionEn, descriptionAl, gallery }`,
    { slugs },
    fetchOptions(preview)
  );
}

export async function getRoomProjectCounts(): Promise<Record<string, number>> {
  if (!projectId) return {};
  const rows: { slug: string; count: number }[] = await getClient(false).fetch(
    `*[_type == "roomType"] { "slug": slug, "count": count(*[_type == "project" && ^.slug in rooms]) }`,
    {},
    fetchOptions(false)
  );
  return Object.fromEntries(rows.map((r) => [r.slug, r.count]));
}

export async function getProjectsForRoom(
  slug: RoomSlug,
  limit = 3,
  preview = false
): Promise<Project[]> {
  if (!projectId) return [];
  return getClient(preview).fetch(
    `*[_type == "project" && $slug in rooms] | order(orderRank asc) [0...$limit] { ${projectFields} }`,
    { slug, limit },
    fetchOptions(preview)
  );
}
