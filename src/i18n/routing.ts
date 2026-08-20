import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["al", "en"],
  defaultLocale: "al",
  localePrefix: "always",
});

export type Locale = (typeof routing.locales)[number];
