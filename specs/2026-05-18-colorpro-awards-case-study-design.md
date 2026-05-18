# ColorPro Awards — case study page

## Goal

Replace the Kestrel Coast placeholder card on the work index with a real,
linked ColorPro Awards case study built from the Figma design
[Hatch and Harvest — Website 2026 / ColorPro Awards · Desktop](https://www.figma.com/design/49OFraV6tfLe23eretyLvI/Hatch-and-Harvest---Website-2026?node-id=17245-263)
and the source assets at `/Users/perniskiesa/Desktop/claude_code/work/ColorPro Awards/`.

The new page lives at `/work/colorpro-awards/` and reuses the existing
case-study shell — the same architecture proven by the
Acceleration For All, United by Play, and Meet the Finchers pages.

## Scope

In:

- New page route `next-app/app/work/colorpro-awards/page.tsx`
- New asset folder `next-app/public/assets/work/colorpro-awards/`
- Update `next-app/components/Work.tsx` to swap the Kestrel Coast `<a>` for
  a ColorPro card (keeps the "Featured" flag)
- Brand CSS variables scoped to the page (`--cpa-*`)
- Local MP4 transcodes where source files are oversized for web autoplay

Out:

- Any change to the Kestrel Coast static HTML (it's currently a
  non-functional placeholder link; replacing the card is sufficient)
- New shared components — every section is buildable from the existing
  case-study primitives
- Mobile-specific reflow beyond what the existing case-study CSS already
  handles (we'll spot-check responsive but the shell already covers it)

## Architecture

```
next-app/
  app/work/colorpro-awards/page.tsx        ← new
  public/assets/work/colorpro-awards/      ← new (15 files, see Asset map)
  components/Work.tsx                      ← edit: swap Kestrel card
  app/globals.css                          ← edit: add `.cpa-*` styles
```

The page is a server component that composes existing case-study pieces:

- `CaseStudyShell` (sets brand vars, layout)
- `CaseHero` (header with backlink, title, kicker, meta grid)
- `CaseBleed` (full-width hero video block)
- `AutoplayVideo` (YouTube iframes — lazy-loaded, autoplay+mute)
- `DocuseriesFilmstrip` (carousel for the Live Events and Results sections —
  same component UbP uses, click-out to YouTube)
- `RisingHeading` (animated headings)
- Native `<video autoplay loop muted playsinline>` for short local social cuts

No new component code is needed.

## Brand styling

CSS variables defined on the shell, used through the page's CSS:

| Var            | Value                       | Use                              |
|----------------|-----------------------------|----------------------------------|
| `--cpa-bg`     | `#2b2722`                   | Page background                  |
| `--cpa-paper`  | `#f2ebda`                   | High-emphasis text on dark bg    |
| `--cpa-mute`   | `#b5ac9b`                   | Body / meta text                 |
| `--cpa-line`   | `rgba(242,235,218,0.14)`    | Section dividers, meta grid rule |

Type stack stays site-default: Roboto for display headings, Inter for body
(already loaded by the layout). H1 56px / H2 48px / body 20px to match
the Figma's text styles.

## Section-by-section content

### 1. Hero header — `CaseHero`

```
backLink:  { label: "All work", href: "../../#work" }
eyebrow:   (none — kicker carries the framing)
title:     "ColorPro Awards"
kicker:    "Transformed ViewSonic's professional display lineup into a global
            creative platform — bringing together artists, storytellers and
            industry partners through immersive experiences that turned
            inspiration into real-world brand and product engagement."
meta:
  - Client: "ViewSonic"
  - Scope:  "Campaign · Identity · Microsite · Live Events · Social Activations"
  - Year:   "2022–2026"
  - Reach:  "Global launch from Taiwan; live events in UK, India, Thailand, Vietnam"
```

(Reach was extended to include India — Figma had only UK/Thailand/Vietnam but
the assets include a strong India ceremony photo; user approved.)

### 2. Hero video — `CaseBleed` + `AutoplayVideo`

```
videoId: "q0qJdUqJiq0"   (FLOW · 6th ColorPro Awards hero film)
title:   "ColorPro Awards — FLOW hero film"
caption: { title: "Hero film · The ColorPro Awards.", meta: "Campaign · 2026" }
```

### 3. The Problem

Heading `The Problem` + 3-paragraph body, verbatim from Figma:

> ViewSonic wanted to build more than a traditional marketing campaign for its
> ColorPro professional displays.
>
> The challenge was creating a globally recognized platform that could connect
> with creators, inspire community participation and strengthen relationships
> with channel partners — all while driving real-world product demand.
>
> The campaign also needed to extend beyond digital advertising into immersive,
> in-person experiences that showcased the power of the product firsthand.

### 4. The Solution

Top KV image (full width, 16px radius, aspect 1920×1080):

- `kv-solution.jpg` ← `2025 ColorPro Awards_KV.jpg`

Heading `The Solution` + 2-paragraph body, verbatim from Figma:

> ViewSonic launched the ColorPro Awards, a global creative competition built
> around inspiring annual themes like "FLOW," "MOMENTUM," and "RISE." The
> campaign invited photographers, filmmakers, and digital artists from around
> the world to submit original work while engaging audiences through paid
> media, social content, influencer partnerships, tutorials and community
> voting experiences.
>
> To bring the platform to life, ViewSonic hosted international award
> ceremonies and traveling exhibitions across key global markets. These events
> transformed digital artwork into immersive physical showcases, giving
> creators, resellers, distributors and enterprise customers hands-on
> experiences with ColorPro displays. By combining creator storytelling with
> experiential marketing, the campaign created a seamless bridge between brand
> inspiration and product engagement.

**Asset grid** — 2 columns (66% / 28%), 24px gap. Per the Figma layout, with
the Portrait_Cop placeholder tile dropped (user decision):

Left column (wider, 884px in Figma):

1. `prize-outline.png` ← `ColorPro Awards 2024 prize outline.png` — wide banner (aspect ≈ 2048:1149)
2. `AutoplayVideo videoId="q0qJdUqJiq0"` — "FLOW 6th CPA Teaser" tile (445px tall, 16px radius). Note: Figma reuses the hero YT ID; user confirmed to keep as-is.
3. Two-up row (24px gap), each tile ≈ 430×455 with 16px radius:
   - `lucky-draw.png` ← `ColorPro Awards _ Lucky Draw-05.png`
   - `exhibition-ig.mp4` ← `Exhibition-IG-1.mp4` (native autoplay loop muted)
4. Two-up row (24px gap), full row height ≈ 840px, 16px radius:
   - `advocates-cover.mp4` ← `Advocates-cover.mp4` (native autoplay loop muted) — tall left half
   - `categories.png` ← `Catgories-03.png` — tall right half

Right column (narrower, 373px in Figma), 24px gap between tiles, 16px radius:

1. `kv-2023.png` ← `2023ColorPro Award KV copy (1).png` — banner aspect 4096:2068
2. `thumbnail-vertical.png` ← `thumbnail_vertical.png` — tall 1080:1920
3. `bumper-photography.mp4` ← `Bumper_photography.mp4` (native autoplay loop muted, transcoded to ~2–3MB)
4. `judge-jeremy.png` ← `Judge-Jeremy Reinmuth.png` — portrait fills remaining height

### 5. The Live Events

Heading `The Live Events` + body (Hatch & Harvest draft, user-editable):

> To turn the awards into something audiences could touch, ViewSonic took
> ColorPro on the road. International ceremonies and traveling exhibitions
> across the UK, India, Thailand, and Vietnam transformed each year's winning
> work into immersive physical showcases — where creators, resellers,
> distributors, and enterprise customers could see the displays do exactly
> what the winning artists had asked of them. Each stop combined gallery,
> ceremony, and product demo into a single experience, turning brand
> inspiration into hands-on engagement.

**Anchor photos** — two-up (593 / 661 in Figma, 24px gap, 16px radius):

- `event-india.jpg`  ← `ColorPro awards ceremony-India--Gallery2.jpg`
- `event-london.jpg` ← `ColorPro awards 2023 London venue.jpg`

**5-card carousel** — `DocuseriesFilmstrip` (same as UbP). Click-out to YouTube
watch page, posters loaded from `i.ytimg.com`:

| #  | Title                       | videoId         |
|----|-----------------------------|-----------------|
| 1  | 2026 FLOW Live event        | `rIY52x2l__w`   |
| 2  | 5th MOMENTUM Live Event     | `GYZe8CY63lE`   |
| 3  | 2022 BREAKTHROUGH Live      | `9DULWKEcNsU`   |
| 4  | RISE Live event             | `anOFomSca7Q`   |
| 5  | 2021 LIVE                   | `VuQEWNX8-3g`   |

### 6. The Results

Heading `The Results` + body, verbatim from Figma:

> The ColorPro Awards evolved into a global ecosystem that strengthened both
> brand affinity and business growth.
>
> The campaign generated thousands of submissions from more than 100 countries,
> built an engaged, international and creative community, which helped
> position ViewSonic as a leader in creative technology.
>
> At the same time, the platform increased visibility for ColorPro displays,
> strengthened reseller and partner relationships and created meaningful
> opportunities for product demonstrations and demand generation.
>
> By integrating online engagement with offline experiences, the campaign
> successfully moved audiences from inspiration to participation to product
> interaction — delivering impact across both B2C and B2B audiences.

**3-card carousel** — same `DocuseriesFilmstrip` instance pattern:

| #  | Title                                            | videoId         |
|----|--------------------------------------------------|-----------------|
| 1  | ColorPro Awards 2023: RISE highlight reel        | `67LDhrlMfKg`   |
| 2  | The 5th ColorPro Awards: MOMENTUM Highlight Reel | `Po5tOYmwa9I`   |
| 3  | 2021 CPA NEW ADVENTURE                           | `erOwuKmsU7c`   |

### 7. Back-to-work footer

Reuses the existing `.next-project-section` block. Link href `../../#work`,
labels match the existing pages.

## Work index card (in `components/Work.tsx`)

Replace the existing Kestrel Coast `<a className="case">` block with:

```
href:        work/colorpro-awards/
aria-label:  "ColorPro Awards — ViewSonic global creator platform case study"
img src:     assets/work/colorpro-awards/kv-card.jpg
img alt:     "ColorPro Awards key visual — the 2025 FLOW campaign artwork."
sub:         "Campaign · Identity · Live Events · Microsite · 2022–2026"
title:       "ColorPro Awards"
one-liner:   "A global creative platform that turned ViewSonic's professional
              displays into the world's pro-creator stage."
flag:        "Featured"
```

`kv-card.jpg` is a web-sized derivative of `2025 ColorPro Awards_KV.jpg`
(target ≈ 1800×1013, ~200–400KB), to match the other case cards which use
1800-wide JPGs.

## Asset map — what gets copied from source to `public/assets/work/colorpro-awards/`

| Source (in `work/ColorPro Awards/`)                | Destination filename       | Notes                          |
|----------------------------------------------------|----------------------------|--------------------------------|
| `2025 ColorPro Awards_KV.jpg`                      | `kv-solution.jpg`          | Top of Solution                |
| `2025 ColorPro Awards_KV.jpg` (resized 1800w)      | `kv-card.jpg`              | Work-index thumbnail           |
| `ColorPro Awards 2024 prize outline.png`           | `prize-outline.png`        | Grid, left col row 1           |
| `ColorPro Awards _ Lucky Draw-05.png`              | `lucky-draw.png`           | Grid, left col row 3 left      |
| `Exhibition-IG-1.mp4`                              | `exhibition-ig.mp4`        | Grid, left col row 3 right. Native autoplay |
| `Advocates-cover.mp4`                              | `advocates-cover.mp4`      | Grid, left col row 4 left. Native autoplay  |
| `Catgories-03.png`                                 | `categories.png`           | Grid, left col row 4 right     |
| `2023ColorPro Award KV copy (1).png`               | `kv-2023.png`              | Grid, right col row 1          |
| `thumbnail_vertical.png`                           | `thumbnail-vertical.png`   | Grid, right col row 2          |
| `2025/250717_Acopy_vertical/Bumper_photography.mp4`| `bumper-photography.mp4`   | Grid, right col row 3. **Transcode to ~2-3MB** (source is 11MB) |
| `Judge-Jeremy Reinmuth.png`                        | `judge-jeremy.png`         | Grid, right col row 4          |
| `ColorPro awards ceremony-India--Gallery2.jpg`     | `event-india.jpg`          | Live Events anchor             |
| `ColorPro awards 2023 London venue.jpg`            | `event-london.jpg`         | Live Events anchor             |

Filenames are normalized to lowercase-kebab to match the project's existing
case-study asset conventions (`acceleration-for-all`, `meet-the-finchers`).

Files NOT used (skipped intentionally):

- `5th colorpro awards highlight video.mp4`, `ColorPro 1-5th highlight video_HD.mp4` — duplicated by the YouTube embeds already in the Results carousel
- `2024 KV /2024ColorProAwards_KV_Final_3.png`, `Category-Digital Art copy.png`, `Category-Photography copy.png`, `Category-Videography copy.png`, `Bumper_digital art.mp4`, `Bumper_videography.mp4`, `2024 Meet the advocates IG-01.mp4` — not in the Figma layout; held in reserve

## Video handling

- **YouTube clips** (hero, teaser, live-events carousel, results carousel):
  use `AutoplayVideo` for autoplay-on-scroll-in-view embeds, and
  `DocuseriesFilmstrip` for click-out carousels. Both pull posters from
  `i.ytimg.com/vi/<id>/maxresdefault.jpg` — no additional poster files needed.
- **Native MP4 clips** (Exhibition-IG, Advocates-cover, Bumper_photography):
  native `<video autoplay loop muted playsinline preload="metadata">`. The
  `preload="metadata"` keeps initial transfer light; loop autoplay starts when
  the element scrolls into view (browser default for muted videos).
- **Transcode step for `Bumper_photography.mp4`:** source is 11MB at full
  bumper resolution. Re-encode to ~2-3MB before committing:
  `ffmpeg -i input.mp4 -vf "scale=-2:1080" -c:v libx264 -crf 28 -preset slow
  -movflags +faststart -an output.mp4` (audio stripped — it's a muted loop).
  Other native clips already fit within budget; spot-check final sizes.

## Brand color application — globals.css

A new `.cpa-page` scope (set by `CaseStudyShell` when the brand vars are passed
in) gets these section/element rules:

- `.cpa-page { background: var(--cpa-bg); color: var(--cpa-paper); }`
- `.cpa-page .case-hero { … }` — meta row uses `--cpa-line` for the top border,
  labels use `--cpa-mute` with the existing uppercase tracking, values use
  `--cpa-paper`
- Section headings stay white-on-dark
- Grid tiles get `border-radius: 16px` and `overflow: hidden` to match Figma

The exact CSS is straightforward and matches existing case-study sections —
the implementation plan will lay out each selector.

## Accessibility

- All images get descriptive `alt`. Decorative grid tiles (logos, KV) get
  context-rich alts; native videos use `aria-label` since they have no caption.
- Native video elements are muted and looping, so no `controls`; include a
  `<track>`-style fallback via `aria-label` description.
- Filmstrip cards already include arrow-key navigation + `aria-roledescription`
  via the existing `DocuseriesFilmstrip` (no change needed).
- All YouTube iframes use `youtube-nocookie.com` (already the default in
  `AutoplayVideo`).

## Testing & verification

- Page renders without errors (`npm run dev`, manual smoke-test).
- Update existing assertions in `next-app/tests/smoke.test.tsx` that pin the
  Kestrel Coast card — the test at lines 39–45 expects `"Kestrel Coast"` in
  the work index, and the test at lines 69–85 expects an `aria-label`
  `"Kestrel Coast — destination rebrand case study"` with
  `href="work/kestrel-coast.html"`. After the swap these become:
  - Work-index card text expectation: `"ColorPro Awards"` (replacing
    `"Kestrel Coast"`)
  - Aria-label expectation:
    `"ColorPro Awards — ViewSonic global creator platform case study"`
  - Href expectation: `"work/colorpro-awards/"`
- Browser checks on the dev server:
  - Hero video lazy-loads and autoplays on scroll
  - Solution asset grid layout matches Figma at 1440px and reflows below
    900px (existing CSS already responsive)
  - Live Events and Results carousels paginate via arrows + dots, and the
    middle-card-active state is visible on each
  - Native MP4 clips loop without audio
- Build passes: `cd next-app && npm run build:prod` (per repo memory:
  custom-domain build is the deploy build).
- Deploy build step is **not** part of this spec — it's done separately when
  the page is ready to ship and is **always** `build:prod`, never plain
  `build`.

## Open follow-ups (not in scope)

- If a separate "FLOW 6th CPA Teaser" YouTube URL exists (different from the
  hero), swap the videoId on grid tile #2 of the left column.
- If the user wants the Live Events anchor row to also include a Thailand
  or Vietnam ceremony photo, the row would extend to three tiles — current
  spec sticks to the Figma's two-up.

## References

- Figma file: `49OFraV6tfLe23eretyLvI` — node `17245:263`
- Source assets: `/Users/perniskiesa/Desktop/claude_code/work/ColorPro Awards/`
- Prior case-study port spec: `specs/2026-05-10-port-case-studies-design.md`
- Build memory: deploy must use `npm run build:prod` (CUSTOM_DOMAIN=true)
