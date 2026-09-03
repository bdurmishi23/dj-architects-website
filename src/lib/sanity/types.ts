import type { ProjectMarkKey, RoomSlug } from "@/lib/marks";

export interface SanityImage {
  _type: "image";
  asset?: { _ref: string; _type: "reference" };
  hotspot?: { x: number; y: number; width: number; height: number };
}

export type Discipline = "architecture" | "interiors" | "hospitality";
export type ProjectStatus = "built" | "construction" | "design";
export type Emphasis = "compact" | "medium" | "feature";

export interface Project {
  _id: string;
  name?: string;
  slug?: string;
  discipline?: Discipline;
  categoryEn?: string;
  categoryAl?: string;
  location?: string;
  year?: number;
  status?: ProjectStatus;
  area?: number;
  descriptionEn?: string;
  descriptionAl?: string;
  rooms?: RoomSlug[];
  coverImage?: SanityImage;
  floorPlanImage?: SanityImage;
  renderImages?: SanityImage[];
  signatureMark?: ProjectMarkKey;
  emphasis?: Emphasis;
  featuredOnHome?: boolean;
}

export interface RoomType {
  _id: string;
  slug?: RoomSlug;
  nameEn?: string;
  nameAl?: string;
  descriptionEn?: string;
  descriptionAl?: string;
  gallery?: SanityImage[];
}

export interface SiteSettings {
  heroImage?: SanityImage;
  heroTextEn?: string;
  heroTextAl?: string;
  taglineEn?: string;
  taglineAl?: string;
  aboutKickerEn?: string;
  aboutKickerAl?: string;
  aboutLeadEn?: string;
  aboutLeadAl?: string;
  quoteDeniEn?: string;
  quoteDeniAl?: string;
  quoteJurgenEn?: string;
  quoteJurgenAl?: string;
  aboutPortrait?: SanityImage;
  contactLeadEn?: string;
  contactLeadAl?: string;
  contactNoteEn?: string;
  contactNoteAl?: string;
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
  instagramUrl?: string;
  pinterestUrl?: string;
  linkedinUrl?: string;
}
