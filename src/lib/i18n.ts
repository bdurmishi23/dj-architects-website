import type { Locale } from "@/i18n/routing";

export function pick(locale: Locale, en?: string, al?: string): string {
  return (locale === "al" ? al : en) ?? en ?? al ?? "";
}
