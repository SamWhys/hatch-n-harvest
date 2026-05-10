# Port case studies into the Next.js app

**Date:** 2026-05-10
**Status:** Approved design — ready for implementation plan
**Scope:** Convert the two existing standalone HTML case study pages into Next.js routes that share components and styles with the rest of the site.

## Background

The site currently runs two parallel systems in the same repo:

1. A Next.js app under `next-app/` that statically exports the homepage (`/`).
2. Two standalone HTML files dropped into `next-app/public/work/`:
   - `acceleration-for-all.html`
   - `united-by-play.html`

Because the standalone files are not Next.js routes, they have no access to the homepage's components or design tokens. Each contains ~700 lines of inlined `<style>` that partially redefines tokens already declared in `app/globals.css`. Their URLs include `.html` (e.g. `/work/acceleration-for-all.html`), in contrast to the homepage's clean URL.

A future Kestrel Coast case study, currently linked from the homepage but missing from the repo, is **out of scope** for this work; it will be authored later in the same form as the two ports.

## Goals

- Each existing case study is rebuilt as a Next.js route (`/work/<slug>/`).
- The two pages render visually identical to the existing HTML versions.
- A small kit of reusable case-study primitives is extracted so future case studies are quick to add.
- Shared styling lives in `app/globals.css` alongside the homepage's styles. Inlined per-page CSS is removed.
- Old `.html` URLs are deleted (no redirects).
- No regressions on the homepage or the existing build/deploy pipeline.

## Non-goals

- Authoring a new Kestrel Coast case study.
- Visual redesign or copy edits to either case study.
- Redirects from old `.html` URLs.
- MDX, CSS modules, or any new styling/build conventions.
- Visual regression testing or end-to-end browser testing.

## Architecture

### File layout

```
next-app/
├── app/
│   └── work/
│       ├── acceleration-for-all/page.tsx
│       └── united-by-play/page.tsx
├── components/
│   └── case-study/
│       ├── CaseStudyShell.tsx
│       ├── CaseHero.tsx
│       ├── CaseBleed.tsx
│       ├── CaseSection.tsx
│       ├── PullQuote.tsx
│       ├── MetricsRow.tsx
│       ├── ColorSwatchGrid.tsx
│       ├── ImageGrid.tsx
│       └── NextProject.tsx
└── tests/
    └── case-study/
        └── (one test file per primitive + one per page)
```

`app/globals.css` gains a clearly delimited `/* === CASE STUDIES === */` block containing all shared case-study layout/typography rules.

### Component boundaries

Each primitive is a server component, single-purpose, and tested in isolation. None reach into other primitives' internals.

| Component | Responsibility | Key props |
|---|---|---|
| `CaseStudyShell` | Wraps the page; renders `<Nav>`, `<main>`, `<Footer>`. Injects per-case CSS vars on a wrapper element. | `brandVars?: React.CSSProperties`, `children` |
| `CaseHero` | Title block + meta grid at the top of every case. | `kicker`, `title`, `meta: Array<{ label, value }>`, `tags?` |
| `CaseBleed` | Edge-to-edge or near-edge image. `variant` controls horizontal extent: `"full"` = viewport-edge to viewport-edge; `"wide"` = constrained to a wider-than-text container (covers AfA's "hero-stage" framing). | `src`, `alt`, `caption?`, `variant?: "full" \| "wide"` |
| `CaseSection` | Workhorse text section. Subsumes `problem`, `work-intro`, `solution-manifesto`, `ubp-solution`, `ubp-result`, etc. `variant` controls content column width: `"narrow"` = readable prose width (`--maxw-text`); `"default"` = standard section width; `"wide"` = full content max-width (`--maxw`). | `eyebrow?`, `heading?`, `variant?: "default" \| "narrow" \| "wide"`, `children` |
| `PullQuote` | Pull-quote block. | `children`, `attribution?` |
| `MetricsRow` | Row of KPI/metric tiles. | `metrics: Array<{ value, label }>` |
| `ColorSwatchGrid` | Brand-palette swatch grid (drives AfA's palette strip). | `swatches: Array<{ name, hex, fg?, border? }>` |
| `ImageGrid` | N-up image gallery with optional captions. Covers AfA's `gallery-five` and UbP's docuseries grids. | `items: Array<{ src, alt, caption? }>`, `columns?: 2 \| 3 \| 4 \| 5` |
| `NextProject` | Cross-link footer to the next case study. | `href`, `name`, `oneLiner`, `image` |

All primitives are server components — no `"use client"` directive — because the existing pages have no interactive behavior.

### Per-case page composition

Each `app/work/<slug>/page.tsx` exports `metadata` and a default function returning JSX. Content lives literally in the JSX. Per-case brand color tokens are declared as a typed `React.CSSProperties` object and passed to `CaseStudyShell` for scoped CSS-var injection. Sketch:

```tsx
export const metadata = { title: "...", description: "..." };

const afaBrandVars = {
  "--afa-yellow": "#FFC200",
  "--afa-coral":  "#FD6051",
  /* … */
} as React.CSSProperties;

export default function AccelerationForAllPage() {
  return (
    <CaseStudyShell brandVars={afaBrandVars}>
      <CaseHero kicker="…" title="Acceleration For All" meta={[…]} />
      <CaseBleed src="assets/work/acceleration-for-all/kv-hero.jpg" alt="…" />
      <CaseSection eyebrow="The problem" heading="…">…</CaseSection>
      <ColorSwatchGrid swatches={[…]} />
      <CaseSection eyebrow="Outcome" heading="…">
        <MetricsRow metrics={[…]} />
      </CaseSection>
      <NextProject href="work/united-by-play/" name="United by Play" oneLiner="…" image="…" />
    </CaseStudyShell>
  );
}
```

### Data flow

There is none beyond props. No client state, no fetching, no context. Each page is statically rendered at build time by Next.js's `output: "export"`.

### Styling

- Shared case-study styles consolidate into `app/globals.css` under `/* === CASE STUDIES === */`. This includes layout for every primitive plus typographic rules for long-form reading (line length, vertical rhythm).
- Existing global tokens (`--paper`, `--ink`, `--marigold`, etc.) are reused unchanged.
- Per-case brand vars (e.g. `--afa-yellow`, `--afa-coral`) are injected as inline `style={{}}` on the `CaseStudyShell` wrapper, so they are scoped to the page and live alongside the page's content.
- Class names stay kebab-case (`case-hero`, `case-section`, `metrics-row`) to match the homepage's convention. No CSS modules, no Tailwind, no new conventions.
- The ~700 lines of inlined `<style>` per existing HTML page are diffed and pruned: redundant token redefinitions are dropped, anything genuinely shared moves into the new globals block, and anything single-use becomes a primitive's styling.

### Routing & URLs

`next.config.ts` already sets `trailingSlash: true` and `output: "export"`, so:

- `app/work/acceleration-for-all/page.tsx` → `/work/acceleration-for-all/`
- `app/work/united-by-play/page.tsx` → `/work/united-by-play/`

URLs in the new pages are written as **relative paths** (`assets/...`, `work/...`) — same convention as the homepage's `Work.tsx` — so they work with both `basePath: "/hatch-n-harvest"` (default) and `basePath: ""` (`CUSTOM_DOMAIN=true`).

### Deletions

- `next-app/public/work/acceleration-for-all.html` — deleted.
- `next-app/public/work/united-by-play.html` — deleted.
- The corresponding pre-built copies under repo-root `work/` and `docs/work/` are rebuild artifacts that the postbuild regenerates, so they are not deleted by hand; they will be replaced by the new exported folders on the next build.

### Homepage link updates

In `next-app/components/Work.tsx`:

- `href="work/acceleration-for-all.html"` → `href="work/acceleration-for-all/"`
- `href="work/united-by-play.html"` → `href="work/united-by-play/"`
- `href="work/kestrel-coast.html"` — left unchanged. The Kestrel Coast link is pre-existing broken state and out of scope.

### Cross-links between case studies

`NextProject` on Acceleration For All points to `/work/united-by-play/`; on United by Play it points to `/work/acceleration-for-all/`. With only two cases this forms a loop, which is acceptable until a third case is added.

### Asset paths

Images already live at `next-app/public/assets/work/{acceleration-for-all,united-by-play}/...`. No asset moves are needed. New pages reference them with the same `assets/work/...` relative prefix the homepage already uses.

## Testing

Lightweight, matching the existing `vitest` + `@testing-library/react` style.

### Per-primitive tests

One file each under `next-app/tests/case-study/`:

- `CaseHero.test.tsx` — renders title, kicker, all meta pairs.
- `CaseSection.test.tsx` — renders eyebrow + heading + children; `variant` prop applies the right class.
- `MetricsRow.test.tsx` — renders all metrics.
- `ColorSwatchGrid.test.tsx` — renders all swatches with name + hex; applies `fg`/`border` correctly.
- `ImageGrid.test.tsx` — renders N items; applies the right column class.
- `NextProject.test.tsx` — renders link with correct href.
- `CaseBleed.test.tsx` and `PullQuote.test.tsx` — trivial render checks.
- `CaseStudyShell.test.tsx` — renders Nav + Footer; applies `brandVars` as inline style on the wrapper.

### Per-page smoke tests

One file per case study under `next-app/tests/case-study/`:

- Renders without crashing.
- Asserts the title, kicker, and at least one section heading are present.
- Asserts the `NextProject` link points at the other case study.

### Out of scope for tests

- Visual regression.
- Image dimensions, font loading, scroll behavior.
- Browser-level end-to-end.

These are verified manually via `npm run dev` + browser preview.

## Verification sequence (definition of done)

1. `npm run typecheck` — clean.
2. `npm run test` — all tests pass.
3. `npm run build` — succeeds. `docs/work/acceleration-for-all/index.html` and `docs/work/united-by-play/index.html` are produced. No `docs/work/*.html` files remain at the `work/` root.
4. Manual browser check at both new URLs:
   - Content matches the previous HTML pages.
   - Styles are correct, including AfA's brand-color palette swatches and UbP's image grids.
   - `NextProject` link navigates to the other case.
   - Homepage `Work` cards link to the new clean URLs.

## Open questions

None. All design decisions confirmed during brainstorming.
