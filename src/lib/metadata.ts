import { routing } from "@/i18n/routing";

export function localizedAlternates(pathname: string) {
  return {
    languages: Object.fromEntries(
      routing.locales.map((locale) => [locale, `/${locale}${pathname}`])
    ),
  };
}
