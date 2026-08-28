import { stegaClean } from "@sanity/client/stega";
import { getClient, projectId } from "./client";
import type { Discipline, Emphasis, Project, ProjectStatus, RoomType, SiteSettings } from "./types";
import type { ProjectMarkKey, RoomSlug } from "@/lib/marks";

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

// Stega encodes invisible metadata into EVERY string field the preview
// client returns — including ones this app uses for object-key lookups
// (SIZE_MAP[project.emphasis], PROJECT_MARKS[project.signatureMark]),
// translation keys (t(project.status)), and routing (slug in hrefs and
// generateStaticParams). A stega-encoded "compact" no longer strictly
// equals the literal key "compact", so those lookups silently return
// undefined. Clean exactly the fields used for logic/identity right here,
// once, so every caller gets safe values — display-only fields (name,
// descriptions, category labels, etc.) stay stega-encoded so click-to-edit
// still works on them. stegaClean() is a no-op on already-clean strings,
// so this is always safe to apply, preview or not.
function cleanProject(p: Project): Project {
  return {
    ...p,
    slug: stegaClean(p.slug),
    discipline: stegaClean(p.discipline) as Discipline,
    status: stegaClean(p.status) as ProjectStatus,
    emphasis: stegaClean(p.emphasis) as Emphasis,
    signatureMark: stegaClean(p.signatureMark) as ProjectMarkKey,
    rooms: p.rooms?.map((slug) => stegaClean(slug) as RoomSlug),
  };
}

function cleanRoomType(r: RoomType): RoomType {
  return { ...r, slug: stegaClean(r.slug) as RoomSlug };
}

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
// 5s (not 60s) because this is a low-traffic site where a founder testing
// "did my publish show up?" cares more about it feeling instant than about
// shaving Sanity API calls — and Next's stale-while-revalidate means the
// *actual* worst case is somewhat longer than the window itself (a request
// right at the boundary still gets the stale copy while a fresh one loads
// in the background for next time). Time-based on purpose, not cache:
// "no-store" — that would force these routes out of static generation
// entirely, a much bigger change than "publishes feel slow."
function fetchOptions(preview: boolean) {
  return preview ? { cache: "no-store" as const } : { next: { revalidate: 5 } };
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
  const projects = result.projects.map(cleanProject);
  return result.randomize ? shuffle(projects) : projects;
}

export async function getAllProjects(): Promise<Project[]> {
  if (!projectId) return [];
  const projects: Project[] = await getClient(false).fetch(
    `*[_type == "project"] | order(discipline asc, orderRank asc) { ${projectFields} }`,
    {},
    fetchOptions(false)
  );
  return projects.map(cleanProject);
}

export async function getProjectBySlug(
  slug: string,
  preview = false
): Promise<Project | null> {
  if (!projectId) return null;
  const project: Project | null = await getClient(preview).fetch(
    `*[_type == "project" && slug.current == $slug][0] { ${projectDetailFields} }`,
    { slug },
    fetchOptions(preview)
  );
  return project && cleanProject(project);
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
  const rooms: RoomType[] = await getClient(preview).fetch(
    `*[_type == "roomType"] { _id, slug, nameEn, nameAl, descriptionEn, descriptionAl, gallery }`,
    {},
    fetchOptions(preview)
  );
  return rooms.map(cleanRoomType);
}

export async function getRoomTypeBySlug(
  slug: RoomSlug,
  preview = false
): Promise<RoomType | null> {
  if (!projectId) return null;
  const room: RoomType | null = await getClient(preview).fetch(
    `*[_type == "roomType" && slug == $slug][0] { _id, slug, nameEn, nameAl, descriptionEn, descriptionAl, gallery }`,
    { slug },
    fetchOptions(preview)
  );
  return room && cleanRoomType(room);
}

export async function getRoomTypesBySlugs(
  slugs: RoomSlug[],
  preview = false
): Promise<RoomType[]> {
  if (!projectId || slugs.length === 0) return [];
  const rooms: RoomType[] = await getClient(preview).fetch(
    `*[_type == "roomType" && slug in $slugs] { _id, slug, nameEn, nameAl, descriptionEn, descriptionAl, gallery }`,
    { slugs },
    fetchOptions(preview)
  );
  return rooms.map(cleanRoomType);
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
  const projects: Project[] = await getClient(preview).fetch(
    `*[_type == "project" && $slug in rooms] | order(orderRank asc) [0...$limit] { ${projectFields} }`,
    { slug, limit },
    fetchOptions(preview)
  );
  return projects.map(cleanProject);
}
