# Handoff: DJ Architects — bilingual portfolio site

## Overview
Marketing/portfolio site for DJ Architects, a Tirana-based architecture and interior design studio (founders Deni and Jurgen, 3rd-year architecture students). Bilingual (EN/AL), warm dark-editorial aesthetic with a Day/Night theme toggle. Includes homepage, full project catalogue, and a room-detail template.

## About the design files
The `.dc.html` files in `source_design/` are **design references built in a prototyping tool**, not production code — they use a custom templating syntax (`{{ }}` holes, `<sc-for>`, `<sc-if>`, `<dc-import>`) that only runs inside that tool's runtime (loaded via `support.js`). **Do not include or run these files as-is.** The task is to recreate the same visual design, content, and interactions in the target codebase's actual stack — React/Next.js is a natural fit given the componentized structure, but use whatever the project already uses. Treat this README, not the raw HTML, as the source of truth for values (colors, spacing, type, copy).

## Fidelity
**High-fidelity.** Colors, type, spacing, copy, and animation timings below are final art direction, not placeholders. Image slots (marked `<image-slot>` in the source) are placeholders — real renders/photos are not yet supplied; build these as ordinary `<img>`/`background-image` slots sized as specified.

## Site structure
1. **Homepage** (`DJ Architects - Tracklist.dc.html`) — nav, hero, Selected work (6 projects), Browse by room (6 rooms), About, Contact, footer. Includes the opening animation sequence.
2. **All Projects** (`DJ Architects - All Projects.dc.html`) — full catalogue (10 projects), grouped by Architecture / Interiors / Hospitality.
3. **Room detail** (`DJ Architects - Room.dc.html`) — one reusable template for all 6 room types, driven by a `?room=` query param (or route param in the real app, e.g. `/rooms/kitchen`).
4. **Logo mark** (`LogoMark.dc.html`) — the animated D+J vinyl-groove mark, imported into nav and the intro curtain on every page.

## Design tokens

### Color — Night mode (default)
- Background / paper: `#161412`
- Primary text (ink): `#F3EDE4`
- Secondary text (subtle): `#A79E92`
- Accent (brass): `#C9A15E` — links, hover states, dots, small details only
- Hairline borders: `rgba(243,237,228,0.12)`
- Nav background: `rgba(22,20,18,0.82)` with `backdrop-filter: blur(14px)`
- Row hover tint: `rgba(201,161,94,0.09)`
- Room card hover tint: `rgba(201,161,94,0.1)`

### Color — Day mode
- Background / paper: `#F6F1E8`
- Primary text (ink): `#21201C`
- Secondary text (subtle): `#6B6357`
- Accent (brass): `#A9782E` (slightly deeper than night mode's brass, for contrast on light paper)
- Hairline borders: `rgba(33,32,28,0.14)`
- Nav background: `rgba(246,241,232,0.86)`

Mode toggle transition: `background-color 560ms, color 560ms, border-color 560ms`, easing `cubic-bezier(0.22,0.61,0.36,1)` on every themed surface. No page reload; toggling is instant client-state.

### Typography
- Serif (headlines, wordmark, project names): **Newsreader**, weight 300 (light), italic style available but only weight 300 roman used here.
- Sans (nav, body, UI): **Instrument Sans**, weights 400/500.
- Mono (codes, meta, counters): **IBM Plex Mono**, weights 400/500.
- Load via Google Fonts: `Newsreader:ital,opsz,wght@0,6..72,300;0,6..72,400;1,6..72,300`, `Instrument+Sans:wght@400;500`, `IBM+Plex+Mono:wght@400;500`.
- Sentence case everywhere. No uppercase headlines (except the intro curtain wordmark, which uses letter-spacing + uppercase deliberately as a one-off).

Scale (desktop):
- Hero line: 44px / 1.22 / Newsreader 300
- Section H2: 34px / Newsreader 300
- Project title (list): 29–40px depending on row emphasis (see below) / Newsreader 300
- Room name: 26px / Newsreader 300
- About lead: 30px / 1.34 / Newsreader 300
- Body / secondary: 13–15.5px / Instrument Sans, color = subtle
- Codes / meta / mono labels: 11–12px, letter-spacing 0.1–0.16em, IBM Plex Mono

### Spacing & shape
- Border radius: 10px (image cards, room cards, related cards), 12px (portrait), 16px (contact panel), 100px (pills/buttons). No radius above 16px except pills.
- No drop shadows anywhere. No gradients except the hero photo scrim (a vertical rgba fade for text legibility) and none elsewhere.
- Section horizontal padding: 48px. Nav padding: 22px 48px.

### Motion
- Standard ease for all UI transitions: `cubic-bezier(0.22,0.61,0.36,1)` — a weighted ease-out, never a spring/bounce.
- Curtain lift (intro end): `cubic-bezier(0.76,0,0.24,1)`, 1100ms.
- Smooth-scroll nav links: custom scroll animation, ease `1 - (1-x)^4` (quartic ease-out), duration scales with distance, clamped 950–2200ms. Accounts for sticky nav height so the target heading doesn't tuck under the nav.
- Hover transitions: 400–560ms on color/background/border-color. No underline-on-hover for the "back" links (explicitly removed per client feedback); default `a:hover` elsewhere changes color only (brass → ink) with no underline decoration change unless noted.

## Logo mark ("the groove")
Concept: the logo is a stylized D+J monogram whose right side reads as vinyl-record grooves (concentric arcs) — a quiet nod to the founders' initials as "DJ," never a literal music/DJ visual theme anywhere else on the site.

- `viewBox="16 4 76 84"`, `fill="none"`.
- **D** stroke: `M20 72 V16 H48 A28 28 0 0 1 48 72 Z`
- **J** stroke: `M88 8 V64 A20 20 0 0 1 68 84` (butt cap)
- **Grooves** (right-side arcs, ±78° about center 48,44), stroke-width 1.3, butt cap:
  - r=12.5: `M50.60 31.77 A12.5 12.5 0 0 1 50.60 56.23`
  - r=16: `M51.33 28.35 A16 16 0 0 1 51.33 59.65`
  - r=19.5: `M52.05 24.93 A19.5 19.5 0 0 1 52.05 63.07`
  - r=24: `M52.99 20.53 A24 24 0 0 1 52.99 67.47`
- **Label**: circle r=9 filled ink color at (48,44); spindle hole r=2.1 filled background color, same center.
- **Detail tiers** (swap markup by render size, don't just CSS-scale one version):
  - full (≥96px): all 4 grooves, stroke 2.6, groove-stroke 1.4, hole r 2.1
  - reduced (28–96px, used in nav): 2 grooves at r14 (`M50.91 30.31 A14 14 0 0 1 50.91 57.69`) and r20 (`M52.16 24.44 A20 20 0 0 1 52.16 63.56`), stroke 4.4, groove-stroke 2.6, hole r 2.6
  - minimal (<28px, favicon): 1 groove at r17.5 (`M51.64 26.88 A17.5 17.5 0 0 1 51.64 61.12`)
- **Rotation**: only the groove `<g>` rotates, never the letterforms/label/hole. `transform-origin: 48px 44px`, `animation: spin 10s linear infinite`.
  - Nav mark: spins only on hover (`animation-play-state: paused` by default, `running` on `:hover`/focus), never restarts from 0 on toggle.
  - Intro curtain mark: spins continuously (`loop`) for the duration it's shown.
  - Everywhere else in body content: static (no rotation).
- **Nav lockup**: mark + "Architects" (not "DJ Architects" — the mark itself carries the D/J, avoiding a "DJ...DJ Architects" double-statement). Full "DJ Architects" is still spelled out in the footer, intro curtain, and page title/meta.

## Opening intro sequence
Full-screen curtain (`position: fixed; inset: 0; z-index: 60`, background = paper color) shown once per session (persist via `sessionStorage`, not on every route change) over the homepage content, which is already mounted underneath.

Timeline (multiply all times by an optional speed multiplier, default 1×):
1. **0.08s** — full-detail logo mark fades up (opacity 0→1, 900ms, standard ease), grooves already spinning at 10s/rev.
2. **1.0s** — wordmark "DJ Architects" fades in, uppercase, letter-spacing animates 18.6px → 9px over 2200ms (standard ease), paired with a 1px brass rule under it drawing 0 → 64px width over 1400ms. A mono progress counter ("000"–"100") sits 34px from the bottom, tracking sequence progress.
3. **3.4s** — lockup (mark + wordmark + rule + counter) fades out and shifts up 10px (400–500ms).
4. **3.9s** — curtain lifts off screen, `translateY(-100%)`, 1100ms, ease `cubic-bezier(0.76,0,0.24,1)`.
5. **4.4s** — hero content (headline + location/date line) staggers in: opacity 0→1 + translateY(14px→0), 700ms standard ease, second element 140ms after the first.

Reduced motion: if `prefers-reduced-motion: reduce`, skip straight to the end state (no curtain, content visible, grooves static). Play once per session.

## Homepage — section by section

### Nav
Sticky, `top: 0`, blurred translucent background (see tokens), border-bottom hairline. Left: logo mark (reduced tier, 26×29px) + "Architects" wordmark (Newsreader 21px). Right, in order: nav links (Work/Rooms/About/Contact, or AL equivalents), EN/AL toggle (mono, brass when active), Day/Night toggle icon (see below), each separated by a hairline divider before the language group.

**Nav link active/hover state**: label color goes subtle→ink, and a small dot-pair icon (16×4px SVG: filled brass circle + open ink-stroked circle, joined by a dashed line) fades/slides in underneath the label (opacity 0→1, translateY(-2px→0), 400ms). This is the same "two marked points" motif used on project/room icons (see below) — the site's one unified iconographic system.

**Day/Night toggle**: NOT a sun/moon icon (deliberately avoided — too generic for this design's level of detail). Instead it's the same dot-pair motif: a 22×10px SVG with a dashed sightline and two circles; the filled brass dot sits on the left in night mode, right in day mode (swaps side on toggle), the other circle is an open ring in ink/paper. No text label.

### Hero
Full-bleed image (moody interior render — walnut tones, ambient light, green/gold accents; supply via CMS/upload), height 82vh, min-height 600px. Vertical gradient scrim over it for text legibility (paper-color based, not black, opacity graduated top→bottom). A large (520×520px) faint (opacity 0.14–0.16) SVG of 10 concentric circles + one brass center dot sits bled off the right edge, vertically centered — this is the logo's groove motif enlarged, reinforcing the mark without being literal. Bottom-left: hero line (44px Newsreader), bottom-right: "Tirana, AL / 2026—" in mono, right-aligned. **No specific founding year is ever stated** — the studio is new; use "2026—" or equivalent open-ended phrasing everywhere date context appears (hero, footer). Never imply an older founding date.

### Selected work (id="work")
Header row: "Selected work" (H2) + project count (mono, e.g. "6 projects · 2025—2026"), bottom-bordered.

Each of the 6 projects is a **tracklist-style row** (quiet homage to the record motif — legible only via numbering convention, never via imagery):
- A short mono code before the title: A1, A2, A3 (Side A) then B1, B2, B3 (Side B) — like a vinyl sleeve tracklist, brass color, small (12px), positioned first in the row.
- A "Side A · 2026" / "Side B · 2025" divider row appears above the first item of each side: mono, 11px, letter-spacing 0.16em, subtle color, with a hairline rule filling the remaining width.
- Next: the **plan-derived spatial signature mark** — a 44×36px SVG line drawing of a simplified floor-plan silhouette unique to that project, with exactly **two marked points**: a filled brass dot at the plan's entry point, and an open ink/paper-ring dot at a key interior sightline or window. This two-dot convention is the site's **one unified iconographic system** — do not introduce any other abstract dot/line motif elsewhere.
- Then: project name (Newsreader 300, size varies — see row-size rhythm below) and a meta line below it (category · location · status/year, 13px, subtle color).
- Right-aligned thumbnail image, size also varies with row emphasis.
- Row hover: brass-tinted background (`rgba(201,161,94,0.09)` in night mode) + a 2–3px solid brass left border that fades in (border-left-color transparent→brass, 400ms) — this is the row's "selected/hovered" indicator; do not rely on text color change alone since it's easy to miss.

**Row-size rhythm**: rows cycle through three sizes — not uniform — so the list reads as an edited sequence rather than a table. Title sizes: 29px (compact), 34px (medium), 40px (feature); thumbnails scale with them (approx 230×150 / 300×200 / 360×230). Currently the feature slot lands on the 3rd project (A3) but this is arbitrary — assign the largest slot to whichever project the studio wants leading.

Below the list: a centered "All projects" pill button (outline style, see Buttons below) linking to the All Projects page.

### Browse by room (id="rooms")
Header: "Browse by room" + a short note explaining the room-first IA (clients usually know the space they want to change, not the project category). 3-column grid of 6 room cards (1px hairline gaps forming a grid rule), each card: mono code (A1–B3, continuing the same tracklist numbering convention used in Work) + the same two-dot plan-mark (scaled to 62%) + room count (mono, right-aligned) on the top row, room name (Newsreader 26px) below, then a one-line description (13px, subtle). Card hover: brass-tinted fill + solid 1px inset brass border (`box-shadow: inset 0 0 0 1px brass`).

Each card links directly to `/rooms/{slug}` (no intermediate "all rooms" index page — with only 6 room types, direct linking is simpler). Room slugs used: `living`, `kitchen`, `bedroom`, `bath`, `entrance`, `terrace`.

### About (id="about")
Two-column grid (roughly 55/45). Left: kicker label (mono), lead paragraph (Newsreader 30px) with the studio's real short narrative — **do not replace with generic "we take on X projects a year" boilerplate**; use: "Deni and Jurgen met in their first year of architecture school. Five years later they built the thing they kept talking about. We work slowly, by hand, close to the people who will live in the rooms." Below that, a founder dialogue exchange set apart by a left brass border-rule, smaller type (14.5px), each line prefixed with the speaker's name in mono/brass:
> Deni: "Draw the route through the room first. The furniture comes after."
> Jurgen: "And keep one wall quiet, so the light has somewhere to land."

Right: studio portrait image (520px tall, 12px radius) with a small caption "Deni and Jurgen in the Tirana studio."

**Founder names are Deni and Jurgen — never substitute placeholder names.**

### Contact (id="contact")
Single bordered panel (16px radius), flex row: left = lead line + one-line note ("One email is enough — no forms, no briefs..."), right = a single email CTA button — **no contact form**. Button style: outline (border 1px, ink color, transparent fill), brass border+text on hover — deliberately NOT a filled gold/mustard button (toned down per revision).

### Footer
3-column grid: studio name + tagline; address + phone; social links + "Tirana · 2026—" (mono, dim). Full "DJ Architects" name spelled out here even though the nav uses mark-only.

## All Projects page
Same nav/footer pattern (with a "← Back to homepage" link). Header: "All projects" + count. Body: same tracklist row format as the homepage Work section, but full catalogue (10 projects) and **grouped by discipline** — Architecture / Interiors / Hospitality — using the same "Side" divider styling as the homepage's A/B grouping, just with discipline names as labels instead of side letters. Each project's meta line shows **location · status** (Completed / Under construction / In design — not "Finished/WIP") rather than a year, since the studio only launched in 2026 and most work is not yet complete. No repeated category word in the meta line if the discipline is already the group header (avoid saying "Interior" twice).

## Room detail page (template, one route per room)
Route: `/rooms/:slug` (slugs above). Nav has "← Back to rooms" link, moved close under the nav bar (not pushed far down — apply tight top padding, ~44px). No underline on this link's hover state (color change only, `text-decoration: none` on both rest and hover explicitly).

Header block: plan-mark (60px width) + code + room name (H1, 48px Newsreader) + one descriptive paragraph specific to that room (per-room copy, EN/AL).

Gallery: an asymmetric grid — one tall image spanning 2 rows on the left (1.4fr), two stacked images on the right (1fr), 220px row height, 16px gaps, 10px radius each.

"Also seen in" section: mono label + hairline rule, then 3 related-project cards (code + project name) linking back to the Work section; hover = brass-tinted background + brass border.

## Bilingual content
All copy exists in EN and AL, switched by a client-side toggle (no i18n routing needed unless the target stack prefers it). Full EN/AL strings for every section (hero line, section titles, About narrative + founder quotes, contact copy, footer tagline, nav labels, room names/descriptions, project categories, status labels) are in the source `.dc.html` files' `COPY`/`ROOMS`/`PROJECTS` JS objects — copy these objects directly into the target app's content layer.

## Assets
- `assets/dj-architects-logo.png` — an early raster version of the logo (superseded by the vector mark described above; the vector version is preferred for production — recreate the SVG paths given above rather than using the PNG).
- All hero/project/portrait images are **unfilled placeholders** (`<image-slot>` in source) — the studio has not yet supplied final photography/renders. Build these as image containers sized per the specs above, ready to receive real photography.

## Files in this bundle
- `source_design/DJ Architects - Tracklist.dc.html` — homepage (reference only, not runnable outside the design tool)
- `source_design/DJ Architects - All Projects.dc.html` — full catalogue page
- `source_design/DJ Architects - Room.dc.html` — room detail template
- `source_design/LogoMark.dc.html` — logo mark component reference
- `source_design/assets/dj-architects-logo.png` — raster logo asset
