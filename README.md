# DJ Architects

Bilingual portfolio site for **DJ Architects**, a Tirana-based architecture and
interior design studio. The site is built as a quiet editorial catalogue:
room-first browsing, tracklist-style project rows, a custom D/J groove mark, and
a warm day/night visual system.

The production app is a **Next.js 14 App Router** project with an embedded
**Sanity Studio** at `/studio`.

## Stack

- **Next.js 14** with App Router and TypeScript
- **React 18**
- **Tailwind CSS** with CSS-variable design tokens
- **Sanity CMS** and `next-sanity`
- **next-intl** for `/al` and `/en` locale routes
- **next-themes** for the day/night theme toggle
- **Framer Motion** plus hand-written CSS transitions
- **next/font** using Newsreader, Instrument Sans, and IBM Plex Mono

## Routes

| Route | Purpose |
| --- | --- |
| `/al`, `/en` | Homepage: hero, selected work, rooms, about, contact |
| `/al/work`, `/en/work` | Full project catalogue grouped by discipline |
| `/al/work/[slug]`, `/en/work/[slug]` | Project detail page with floor plan, render gallery, and room links |
| `/al/rooms/[slug]`, `/en/rooms/[slug]` | Room detail page with gallery and related projects |
| `/studio` | Embedded Sanity Studio |
| `/api/draft-mode/enable` | Enables preview/draft mode for Presentation Tool |
| `/api/draft-mode/disable` | Disables preview/draft mode |

The default locale is Albanian (`al`), and locale prefixes are always present.

## Quick Start

```bash
npm install
cp .env.local.example .env.local
npm run dev
```

Then open:

- Site: `http://localhost:3000/al`
- Studio: `http://localhost:3000/studio`

The site can run without a Sanity project ID. In that state, CMS-backed
sections render empty instead of throwing, which makes local setup and CI less
fragile.

## Environment

Create `.env.local` from `.env.local.example`:

```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SITE_URL=http://localhost:3000

SANITY_API_READ_TOKEN=
```

Use:

- `NEXT_PUBLIC_SANITY_PROJECT_ID` for the Sanity project ID.
- `NEXT_PUBLIC_SANITY_DATASET` for the dataset, usually `production`.
- `NEXT_PUBLIC_SITE_URL` for absolute metadata and Studio preview URLs.
- `SANITY_API_READ_TOKEN` only for draft/preview mode. It must be server-only,
  with no `NEXT_PUBLIC_` prefix.

## Scripts

```bash
npm run dev
npm run lint
npm run build
npm run start
```

There is also a one-off seed script:

```bash
SANITY_WRITE_TOKEN=... node scripts/seed.mjs
```

The seed script creates site settings, the fixed room documents, sample
projects, and placeholder images. It needs an Editor-permission Sanity token.
Never commit the token.

## Project Structure

```text
src/
  app/
    [locale]/
      page.tsx
      layout.tsx
      work/
        page.tsx
        [slug]/page.tsx
      rooms/
        [slug]/page.tsx
    studio/[[...tool]]/page.tsx
    api/draft-mode/
    globals.css
  components/
    icons/
    home/
    SiteNav.tsx
    WorkTracklist.tsx
    Footer.tsx
  i18n/
  lib/
    sanity/
    marks.ts
    projectCodes.ts
    smoothScroll.ts
  sanity/
    schemaTypes/
    structure.ts
    presentation/resolve.ts
messages/
source_design/
scripts/
```

## Content Model

### `project`

Main portfolio item.

Fields:

- `name`
- `slug`
- `discipline`: `architecture`, `interiors`, or `hospitality`
- `categoryEn`, `categoryAl`
- `location`
- `year`
- `status`: `built`, `construction`, or `design`
- `area`
- `descriptionEn`, `descriptionAl`
- `rooms`: fixed room slugs this project appears under
- `coverImage`
- `floorPlanImage`
- `renderImages`
- `signatureMark`: preset key from `src/lib/marks.ts`
- `emphasis`: `compact`, `medium`, or `feature`
- `featuredOnHome`
- `orderRank`: managed by `@sanity/orderable-document-list`

Projects are ordered manually in Studio through the orderable project list.
Homepage rows only show projects where `featuredOnHome` is enabled.

### `roomType`

One of the six fixed room documents:

- `living`
- `kitchen`
- `bedroom`
- `bath`
- `entrance`
- `terrace`

Fields:

- `slug`
- `nameEn`, `nameAl`
- `descriptionEn`, `descriptionAl`
- `gallery`

The room set is structural, not editorial. Codes, slugs, and icons live in
`src/lib/marks.ts`; editors update copy and images, not the list of room types.

### `siteSettings`

Singleton document for homepage and footer content.

Fields include:

- hero image and hero text
- footer tagline
- about kicker, lead copy, founder quotes, and portrait
- contact lead, note, email, phone, address, and social links
- `randomizeHomepageOrder`

The Studio structure pins this document as `siteSettings`.

## Sanity Workflow

1. Create or connect the Sanity project.
2. Fill `NEXT_PUBLIC_SANITY_PROJECT_ID` and `NEXT_PUBLIC_SANITY_DATASET`.
3. Start the dev server and visit `/studio`.
4. Create the **Site settings** document first.
5. Create the six fixed **Room type** documents.
6. Add **Project** documents.
7. Use the orderable project list to control catalogue order.
8. Enable `featuredOnHome` for projects that should appear on the homepage.

For client access, invite editors from
[`sanity.io/manage`](https://www.sanity.io/manage). Use the **Editor** role for
normal content work. Avoid giving Administrator access unless they should manage
project settings, API tokens, billing, and destructive project actions.

## Preview And Visual Editing

Presentation Tool is configured in `sanity.config.ts` and resolves pages through
`src/sanity/presentation/resolve.ts`.

Preview mode:

- uses `/api/draft-mode/enable` and `/api/draft-mode/disable`
- requires `SANITY_API_READ_TOKEN`
- reads drafts with `perspective: "drafts"`
- enables stega metadata only for preview

The query layer cleans stega values for fields used as logic keys, including
slugs, enum values, room IDs, and mark keys. Display strings stay editable so
click-to-edit keeps working in Visual Editing.

## Internationalization

Locale routing is defined in `src/i18n/routing.ts`.

- Locales: `al`, `en`
- Default locale: `al`
- Prefix strategy: always prefixed

UI strings live in:

- `messages/al.json`
- `messages/en.json`

Sanity content stores bilingual editorial fields directly, usually as `*En` and
`*Al` pairs. `src/lib/i18n.ts` chooses the correct field at render time.

## Design System

The design is intentionally restrained: editorial typography, warm materials,
fine hairlines, no generic marketing decoration, and no heavy shadows.

### Color Tokens

Night mode:

- paper: `#161412`
- ink: `#F3EDE4`
- subtle: `#A79E92`
- brass: `#C9A15E`
- hairline: `rgba(243,237,228,0.12)`
- nav background: `rgba(22,20,18,0.82)`

Day mode:

- paper: `#F6F1E8`
- ink: `#21201C`
- subtle: `#6B6357`
- brass: `#A9782E`
- hairline: `rgba(33,32,28,0.14)`
- nav background: `rgba(246,241,232,0.86)`

The active values are CSS variables in `src/app/globals.css`, and Tailwind maps
semantic color names such as `paper`, `ink`, `subtle`, `brass`, and `hairline`.

### Typography

- Headlines, wordmark, and project names: **Newsreader**
- Body, navigation, and UI text: **Instrument Sans**
- Codes, counters, and metadata: **IBM Plex Mono**

Use sentence case almost everywhere. The intro curtain wordmark is the deliberate
exception.

### Shape And Motion

- Image cards and room cards: 10px radius
- Portraits: 12px radius
- Contact panel: 16px radius
- Pills and buttons: 100px radius
- No drop shadows as a general rule
- No gradients except the hero scrim
- Standard easing: `cubic-bezier(0.22,0.61,0.36,1)`
- Curtain lift easing: `cubic-bezier(0.76,0,0.24,1)`

The site should feel weighted and calm. Avoid bounce/spring motion unless the
art direction changes.

## Navigation

The global header is the primary navigation system:

- logo mark plus `Architects`
- Work, Rooms, About, Contact
- EN/AL language toggle
- day/night dot toggle
- mobile menu

Project and room pages intentionally do not render local "Back to work" or
"Back to rooms" pills. Users rely on native browser back/swipe behavior and the
global header.

## Logo And Marks

The D/J logo is a custom vector mark. The right side reads as vinyl-groove arcs,
but the rest of the site stays architectural rather than music-themed.

Rules:

- the D and J letterforms do not rotate
- only the groove group rotates
- nav mark spins on hover/focus
- intro mark spins continuously while the curtain is visible
- body marks stay static

Project and room icons use simplified floor-plan silhouettes with exactly two
points: one filled brass dot and one open ring. Keep this two-point convention
as the site's unified icon language.

## Homepage

The homepage contains:

1. Hero with CMS image, localized hero line, Tirana location line, and `2026-`
   open-ended date context.
2. Selected work tracklist with Side A / Side B grouping.
3. Mobile project crate for swiping/browsing featured work.
4. Browse by room grid with the six fixed room types.
5. About section with founder narrative and portrait.
6. Contact section with email-first CTA.

There is no contact form. Contact is intentionally direct and lightweight.

## Work Catalogue

`/[locale]/work` shows the full project catalogue grouped by discipline:

- Architecture
- Interiors
- Hospitality

Rows reuse the same mark, image, and metadata system as the homepage tracklist.

## Project Detail Pages

`/[locale]/work/[slug]` shows:

- project mark and signature code
- title and localized project description
- discipline, category, location, year, status, and optional area
- floor plan image when present
- render gallery when present
- linked room cards when the project is tagged with room types

## Room Detail Pages

`/[locale]/rooms/[slug]` shows:

- fixed room mark and code
- localized room name and description
- gallery images
- up to three related projects tagged with that room slug

Invalid room slugs 404. Valid room slugs also 404 until their corresponding
Sanity document exists.

## Source Design Files

`source_design/` contains the original `.dc.html` design exports:

- `DJ Architects - Tracklist.dc.html`
- `DJ Architects - All Projects.dc.html`
- `DJ Architects - Room.dc.html`
- `LogoMark.dc.html`
- `assets/dj-architects-logo.png`

These files are reference material only. They use the design tool's runtime
syntax and should not be imported into the production app.

Use this README and the current implementation as the living source of truth.
The `.dc.html` files are useful for visual comparison and original copy, but the
Next/Sanity app is the canonical implementation.

## Development Notes

- Prefer existing component patterns before adding new abstractions.
- Keep design changes aligned with the token system in `globals.css` and
  `tailwind.config.ts`.
- Keep Sanity schema changes paired with query/type updates.
- Use `urlForImage` for Sanity images and preserve hotspot-friendly crops.
- Keep draft-mode stega cleanup in mind when adding enum, slug, or key fields.
- Do not introduce new room slugs without updating `src/lib/marks.ts`, schemas,
  queries, routes, and Studio structure together.
- Do not store production video in Sanity file assets. Use a proper video
  service or Sanity Media Library/Mux if video becomes part of the site.

## Verification

Before handing off code changes, run:

```bash
npm run lint
npm run build
```

If `next/font` fails while fetching Google Fonts, check local network/proxy
access to `fonts.googleapis.com`. The app depends on those font files during the
production build.
