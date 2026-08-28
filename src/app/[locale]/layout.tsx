import type { Metadata } from "next";
import { Newsreader, Instrument_Sans, IBM_Plex_Mono } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { draftMode } from "next/headers";
import { ThemeProvider } from "next-themes";
import VisualEditing from "next-sanity/visual-editing/client-component";
import { routing, type Locale } from "@/i18n/routing";
import SiteNav from "@/components/SiteNav";
import Footer from "@/components/Footer";
import "../globals.css";

const serif = Newsreader({
  subsets: ["latin", "latin-ext"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

const sans = Instrument_Sans({
  subsets: ["latin", "latin-ext"],
  variable: "--font-sans",
  display: "swap",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const title =
    locale === "al"
      ? "DJ Architects — Arkitekturë, interier dhe dritë"
      : "DJ Architects — Architecture, interiors and light";
  const description =
    locale === "al"
      ? "Studio arkitekture dhe dizajni të brendshëm në Tiranë."
      : "Architecture and interior design studio in Tirana.";

  return {
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
    ),
    title: {
      default: title,
      template: "%s — DJ Architects",
    },
    description,
    alternates: {
      languages: Object.fromEntries(routing.locales.map((l) => [l, `/${l}`])),
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);
  const messages = await getMessages();
  const { isEnabled: preview } = draftMode();

  return (
    <html
      lang={locale}
      className={`${serif.variable} ${sans.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <body className="overflow-x-hidden bg-paper font-sans text-ink antialiased">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <NextIntlClientProvider messages={messages}>
            <SiteNav />
            {children}
            <Footer />
          </NextIntlClientProvider>
        </ThemeProvider>
        {preview && (
          <>
            <VisualEditing />
            <a
              href="/api/draft-mode/disable"
              className="fixed bottom-4 right-4 z-50 rounded-pill border px-4 py-2 font-mono text-xs"
              style={{
                background: "var(--paper)",
                color: "var(--ink)",
                borderColor: "var(--hairline)",
              }}
            >
              Dil nga parapamja
            </a>
          </>
        )}
      </body>
    </html>
  );
}
