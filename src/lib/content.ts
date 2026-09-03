import type { Locale } from "@/i18n/routing";

export function pickText(locale: Locale, en?: string | null, al?: string | null): string {
  return (locale === "al" ? al : en) ?? en ?? al ?? "";
}

export function hasText(value?: string | null): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export function compactText(parts: Array<string | number | null | undefined>): string[] {
  return parts
    .filter((part): part is string | number => part !== null && part !== undefined)
    .map(String)
    .filter(hasText);
}

export function hasSlug<T extends { slug?: unknown }>(
  item: T
): item is T & { slug: NonNullable<T["slug"]> } {
  return hasText(typeof item.slug === "string" ? item.slug : undefined);
}
