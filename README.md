# DJ Architects

A bilingual Albanian/English portfolio website for **DJ Architects**, a
Tirana-based architecture and interior design studio. It presents selected work,
project details, room-based browsing, and editable CMS content through a refined
editorial interface.

**Live Demo:** _Add deployed URL here_

## Preview

_Add screenshot here_

Suggested screenshot path: `public/preview.png`.

## Features

- Bilingual Albanian/English experience with localized routes
- Responsive architecture portfolio catalogue
- Project detail pages with render galleries and floor plans
- Room detail pages for living, kitchen, bedroom, bath, entrance, and terrace
- Sanity CMS with an embedded Studio at `/studio` for site content and project ordering
- Draft preview and Visual Editing support
- Day/night theme toggle
- Animated custom D/J groove branding

## Tech Stack

- Next.js 14
- TypeScript
- React
- Tailwind CSS
- Sanity
- next-sanity
- next-intl
- next-themes
- Framer Motion

## Routes

| Route | Description |
| --- | --- |
| `/al`, `/en` | Homepage |
| `/al/work`, `/en/work` | Full project catalogue |
| `/al/work/[slug]`, `/en/work/[slug]` | Project detail page |
| `/al/rooms/[slug]`, `/en/rooms/[slug]` | Room detail page |
| `/studio` | Sanity Studio |
| `/api/draft-mode/enable` | Enable draft preview |
| `/api/draft-mode/disable` | Disable draft preview |

Albanian (`al`) is the default locale, and all public pages use an explicit
locale prefix.

## Getting Started

```bash
npm install
cp .env.local.example .env.local
npm run dev
```

Open:

- Site: `http://localhost:3000/al`
- Studio: `http://localhost:3000/studio`

The frontend can run without Sanity credentials. If no Sanity project ID is
configured, CMS-backed sections render empty instead of crashing.

## Environment Variables

```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SITE_URL=http://localhost:3000

SANITY_API_READ_TOKEN=
```

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Sanity project ID |
| `NEXT_PUBLIC_SANITY_DATASET` | Sanity dataset, usually `production` |
| `NEXT_PUBLIC_SITE_URL` | Public site URL for metadata and Studio previews |
| `SANITY_API_READ_TOKEN` | Server-only token for draft preview and Visual Editing |

`SANITY_API_READ_TOKEN` must not use the `NEXT_PUBLIC_` prefix.

## Project Structure

```text
src/
  app/
    [locale]/
      page.tsx
      work/
      rooms/
    studio/
    api/draft-mode/
    globals.css
  components/
    home/
    icons/
    SiteNav.tsx
    WorkTracklist.tsx
    Footer.tsx
  i18n/
  lib/
    sanity/
    marks.ts
  sanity/
    schemaTypes/
    structure.ts
messages/
scripts/
source_design/
```

## CMS

Sanity powers the editable content and is embedded directly inside the app at
`/studio`.

The Studio manages three main document types:

- `siteSettings`: homepage hero, about section, contact details, social links,
  and footer content
- `project`: portfolio entries with categories, status, images, floor plans,
  room tags, and display settings
- `roomType`: the six fixed room pages used for room-first browsing

Draft preview and Visual Editing are wired through `next-sanity`, draft mode
API routes, and `SANITY_API_READ_TOKEN`. Editors can preview draft content while
the public site continues to show published content.

To seed starter CMS content:

```bash
SANITY_WRITE_TOKEN=... node scripts/seed.mjs
```

## Design Notes

The visual system is built around:

- Warm editorial day/night palettes
- Newsreader, Instrument Sans, and IBM Plex Mono typography
- Fine hairlines and restrained spacing
- Tracklist-style project rows
- Custom animated D/J logo mark
- Floor-plan-inspired project and room icons

The original design references live in `source_design/`. They are useful for
visual comparison, but they are not production code and should not be imported
into the app.

## Development

```bash
npm run lint
npm run build
```

Other useful scripts:

```bash
npm run dev
npm run start
```

If `next/font` fails during `npm run build`, check local access to
`fonts.googleapis.com`; Next.js fetches the project fonts during production
builds.
