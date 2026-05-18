# Case-study cascade reveal + ColorPro filmstrip parity

## Goals

1. **Cascade reveal:** make every case study's Solution / asset-grid sections fade in cell-by-cell as they scroll into view, using the same mechanism UBP currently uses for its big portrait grid.
2. **ColorPro filmstrip parity:** make the two `DocuseriesFilmstrip` carousels on the ColorPro Awards page (Live Events and Results) match UBP's docuseries formatting — proper width constraint, body fade-in, and entrance animation.

Both effects already exist in the codebase. The first is hardcoded with UBP-specific class names and lives only on the UBP page. The second works correctly on UBP because of how UBP nests the filmstrip; ColorPro's looser nesting means the entrance animation triggers but the layout reads as full-bleed with arrows at the viewport edges.

## Scope

In:

- Generalize the UBP reveal mechanism: rename `UbpAssetReveal` → `ScrollRevealGroup`, update UBP to use the new name (no visual change), generalize the CSS selectors so any case study can opt in.
- Apply the new `ScrollRevealGroup` to:
  - **ColorPro** — the Solution asset grid (`.cpa-asset-grid`)
  - **AfA** — each visual block under the Solution work-section as its own local cascade: `.lockup-variants`, `.hero-stage`, `.mnemonic-grid`, `.apparel-grid`, `.social-stack`, `.gallery-five`
  - **MtF** — the `.mtf-asset-grid`
  - **UBP** — already uses the mechanism, just renamed
- Fix the ColorPro filmstrips: move both inside `<div className="wrap">`, swap their intro `<p>` for `<FadeInP>`, drop the bespoke `.cpa-live-events-body` / `.cpa-results-body` body styles in favour of the existing `.ubp-docu-lead` pattern (or a generic equivalent — see Design).

Out:

- New types of reveal (rising headings already use `RisingHeading`, body paragraphs use `FadeInP` — those exist and are not in scope).
- Re-keying the order in which UBP's existing cells reveal — we're keeping the current `--reveal-index` values on UBP cells exactly as they are.
- Reveal on sections other than Solution / asset grid (Problem, Results-as-text, hero, etc. already have their own per-section reveals via `RisingHeading` + `FadeInP`).
- Deploy commit (separate from this work — user controls when to ship).

## Design

### The reveal mechanism — generalized

**Component:** `ScrollRevealGroup` (replaces `UbpAssetReveal`)

```tsx
// next-app/components/case-study/ScrollRevealGroup.tsx
"use client";

import { useRef, type ReactNode } from "react";
import { useScrollReveal } from "./useScrollReveal";

export function ScrollRevealGroup({
    children,
    className,
}: {
    children: ReactNode;
    className?: string;
}) {
    const ref = useRef<HTMLDivElement | null>(null);
    useScrollReveal(ref);
    return (
        <div ref={ref} className={`scroll-reveal-group${className ? ` ${className}` : ""}`}>
            {children}
        </div>
    );
}
```

The wrapper:
- Adds className `scroll-reveal-group` to its root (plus any caller-supplied className).
- Uses `useScrollReveal` to add `is-revealed` when the wrapper enters the viewport.
- Accepts arbitrary children (figures, divs, nested rows — same as today's `UbpAssetReveal`).

**Cell marking:** any descendant element with an inline `--reveal-index` CSS variable participates in the cascade. The CSS selector is `[style*="--reveal-index"]` — no extra class required on each cell:

```tsx
<figure className="cpa-tile" style={{ "--reveal-index": 0 } as React.CSSProperties}>…</figure>
<figure className="cpa-tile" style={{ "--reveal-index": 1 } as React.CSSProperties}>…</figure>
```

(This matches how UBP already marks its cells. We're just generalizing the wrapper that triggers the reveal.)

**CSS:**

```css
/* ─── Scroll reveal (generic) ─────────────────────────────────── */
.scroll-reveal-group [style*="--reveal-index"] {
  opacity: 0;
  transform: translateY(20px);
  transition:
    opacity 600ms cubic-bezier(0.32, 0.72, 0, 1),
    transform 600ms cubic-bezier(0.32, 0.72, 0, 1);
  transition-delay: calc(var(--reveal-index, 0) * 90ms);
  will-change: opacity, transform;
}

.scroll-reveal-group.is-revealed [style*="--reveal-index"] {
  opacity: 1;
  transform: translateY(0);
}

@media (prefers-reduced-motion: reduce) {
  .scroll-reveal-group [style*="--reveal-index"] {
    transition-duration: 0ms !important;
    transition-delay: 0ms !important;
  }
}
```

This replaces the existing `.ubp-reveal-target .ubp-cell` block (lines ~2293-2312 in `globals.css`). UBP keeps its cells exactly as they are; the new selector matches them via the inline `--reveal-index` style.

### Existing UbpAssetReveal — migration

Delete `next-app/components/case-study/UbpAssetReveal.tsx`. In `next-app/app/work/united-by-play/page.tsx`:

- Replace the import `import { UbpAssetReveal } from "@/components/case-study/UbpAssetReveal";` with `import { ScrollRevealGroup } from "@/components/case-study/ScrollRevealGroup";`
- Replace the JSX tags `<UbpAssetReveal>` / `</UbpAssetReveal>` with `<ScrollRevealGroup className="ubp-asset-wrap">` / `</ScrollRevealGroup>`.

The `ubp-asset-wrap` class is UBP's grid-layout class (different responsibility from the reveal — it controls grid columns/gaps). Passing it via the `className` prop keeps the layout intact while moving the reveal mechanism into the generic wrapper.

In `globals.css`:
- Remove the `.ubp-reveal-target .ubp-cell { … }` block and its `.is-revealed` companion (lines ~2293-2312).
- The `.ubp-asset-wrap` layout block (~lines 1959+) stays exactly as-is.

UBP renders identically to today.

### ColorPro filmstrip parity

The two ColorPro filmstrips currently sit OUTSIDE the parent section's `.wrap` div, which makes them full-viewport-width. UBP nests its filmstrip INSIDE `.wrap`, which constrains it to the 1280-max-width container with the section's padding.

**Live Events** — move the `<DocuseriesFilmstrip>` inside the existing `<div className="wrap">`:

Before (current):
```tsx
<section className="cpa-live-events">
    <div className="wrap">
        <RisingHeading>The Live Events</RisingHeading>
        <p className="cpa-live-events-body">…body…</p>
        <div className="cpa-live-events-anchors">…</div>
    </div>
    <DocuseriesFilmstrip episodes={[…]} />  {/* outside .wrap */}
</section>
```

After:
```tsx
<section className="cpa-live-events">
    <div className="wrap">
        <RisingHeading>The Live Events</RisingHeading>
        <FadeInP className="cpa-section-lead">…body…</FadeInP>
        <div className="cpa-live-events-anchors">…</div>
        <DocuseriesFilmstrip episodes={[…]} />  {/* inside .wrap */}
    </div>
</section>
```

**Results** — same shape change. Body `<p>` becomes `<FadeInP>`:

```tsx
<section className="cpa-results">
    <div className="wrap">
        <RisingHeading>The Results</RisingHeading>
        <div className="cpa-results-body">  {/* keep multi-paragraph wrapper */}
            <FadeInP>…</FadeInP>
            <FadeInP>…</FadeInP>
            <FadeInP>…</FadeInP>
            <FadeInP>…</FadeInP>
        </div>
        <DocuseriesFilmstrip episodes={[…]} />
    </div>
</section>
```

**Imports:** add `import { FadeInP } from "@/components/case-study/FadeInP";` to the ColorPro page.

**New body class:** introduce a shared `.cpa-section-lead` for the Live Events lead paragraph (mirrors UBP's `.ubp-docu-lead`). The existing `.cpa-live-events-body` and `.cpa-results-body` selectors can stay; we'll just stop using `.cpa-live-events-body` on the lead `<p>` since the FadeInP will carry the new class.

```css
/* ColorPro — add to the existing CPA block */
.cpa-page .cpa-section-lead {
  font-size: clamp(16px, 1.2vw, 20px);
  line-height: 1.55;
  color: var(--cpa-mute);
  max-width: 70ch;
  margin: 0 0 clamp(32px, 4vw, 56px);
}
```

(This matches `.ubp-docu-lead`'s shape but with ColorPro's color token.)

The existing `.cpa-results-body` rules can stay — the `FadeInP`s sit inside that wrapper, so the existing margin/max-width on the wrapper, and the existing `.cpa-results-body p + p { margin-top: 16px }` rule, both still work for the multi-paragraph body.

**Filmstrip entrance:** `.docuseries-filmstrip` already has the scroll-reveal entrance built into globals.css. Moving the filmstrip inside `.wrap` is enough — the entrance animation will trigger automatically.

### Cell indices per case study

Indices are assigned in visual reading order (top to bottom, left to right within rows). Each `ScrollRevealGroup` has its own 0..n sequence.

**ColorPro — Solution asset grid:**

| Index | Cell |
|------:|------|
| 0 | prize-outline (wide banner, top of left column) |
| 1 | FLOW teaser video tile |
| 2 | lucky-draw (row 3 left half) |
| 3 | exhibition-ig.mp4 (row 3 right half) |
| 4 | advocates-cover.mp4 (row 4 left half) |
| 5 | categories (row 4 right half) |
| 6 | kv-2023 (right column row 1) |
| 7 | thumbnail-vertical (right column row 2) |
| 8 | bumper-photography (right column row 3) |
| 9 | judge-jeremy (right column row 4) |

Replace the existing `<div className="cpa-asset-grid">…</div>` with `<ScrollRevealGroup className="cpa-asset-grid">…</ScrollRevealGroup>`. The component already renders a `<div>`, so this swap keeps the DOM depth identical — the grid layout class moves from a plain div to the wrapper component without nesting.

**AfA — per-block local cascades:**

Each of these gets its own `<ScrollRevealGroup>` wrapper, with local 0..n indices on the inner figures:

- `.lockup-variants` (2 figures, indices 0–1)
- `.hero-stage` (1 figure, index 0 — single-item cascade is a no-op but consistent)
- `.mnemonic-grid` (6 figures, indices 0–5)
- `.apparel-grid` (3 figures, indices 0–2)
- `.social-stack` — has nested structure (1 wide + 2-row + 6-row + 1 wide), total 10 figures — indices 0–9 in visual reading order
- `.gallery-five` (5 finalist figures, indices 0–4)
- `.results-top5` (1 figure, index 0 — single-item)

For single-item cases (`.hero-stage`, `.results-top5`), the cascade is technically a no-op but applying the wrapper is harmless and keeps the markup consistent.

Same pattern as ColorPro: replace each `<div className="lockup-variants">` etc. with `<ScrollRevealGroup className="lockup-variants">`, etc.

**MtF — asset grid section:**

The `.mtf-asset-grid-section`'s `<div className="wrap">` contains a `.mtf-asset-grid` (with left + right columns, 5 figures) plus a 6th sibling figure (`.mtf-linkedin`) underneath the grid. Wrap the `.wrap` contents in a single `<ScrollRevealGroup className="mtf-asset-grid-reveal">` so both the grid figures AND the linkedin figure cascade together — that's the natural read of the section.

Indices in visual reading order (6 cells total):

| Index | Cell |
|------:|------|
| 0 | mtf-bts (left column, top) |
| 1 | mtf-jakob (left column, bottom) |
| 2 | mtf-gif (right column, top) |
| 3 | mtf-lockup (right column, middle) |
| 4 | mtf-karate (right column, bottom) |
| 5 | mtf-linkedin (sibling under the grid) |

The standalone `.mtf-ooh-section` (a single OOH banner before the Solution heading) is **out of scope** — it's not part of the asset grid and a single-item cascade is just a delayed fade-in.

**UBP:**

No index changes. The existing `--reveal-index` values 0..10 on UBP cells remain identical. Only the wrapper class changes from `ubp-reveal-target` → `scroll-reveal-group`, applied via the `className="ubp-asset-wrap"` prop passing through `ScrollRevealGroup`.

## File touch list

- `next-app/components/case-study/ScrollRevealGroup.tsx` — **new**
- `next-app/components/case-study/UbpAssetReveal.tsx` — **delete**
- `next-app/app/work/united-by-play/page.tsx` — import + tag rename
- `next-app/app/work/colorpro-awards/page.tsx` — add `FadeInP` import; relocate Live Events filmstrip inside `.wrap`; relocate Results filmstrip inside `.wrap`; replace `.cpa-asset-grid` `<div>` with `<ScrollRevealGroup className="cpa-asset-grid">`; add `--reveal-index` to each `.cpa-tile`; convert lead `<p>` to `<FadeInP className="cpa-section-lead">` and the four results paragraphs to `<FadeInP>` inside the existing `.cpa-results-body` wrapper.
- `next-app/app/work/acceleration-for-all/page.tsx` — wrap each named block with `<ScrollRevealGroup className="<existing-block-class>">`; add `--reveal-index` to each child figure.
- `next-app/app/work/meet-the-finchers/page.tsx` — wrap `.mtf-asset-grid` div as `<ScrollRevealGroup className="mtf-asset-grid">`; add `--reveal-index` to each `.mtf-cell`.
- `next-app/app/globals.css` — remove the `.ubp-reveal-target .ubp-cell` rules (~2293–2312); add the generic `.scroll-reveal-group …` rules in the same spot; add `.cpa-section-lead` style.

## Testing

- Existing `next-app/tests/smoke.test.tsx` — all 16 tests must continue to pass. No new test required for visual reveal behavior (intersection-observer mechanics are hard to unit-test meaningfully; the existing smoke tests verify the pages still render). The smoke import test for the ColorPro page already covers that the page boots.
- `npx tsc --noEmit` — clean. The `style={{ "--reveal-index": N } as React.CSSProperties}` casts already exist on UBP and TypeScript accepts them.
- Browser sweep: load `/work/colorpro-awards/`, `/work/united-by-play/`, `/work/acceleration-for-all/`, `/work/meet-the-finchers/` in the dev server. Each Solution / asset-grid section should fade-cascade in as it enters the viewport. UBP should look identical to today. Filmstrips on CPA should now match UBP's width and entrance.

## Accessibility & motion

The existing `prefers-reduced-motion: reduce` handling on `.ubp-reveal-target` carries forward via the new `.scroll-reveal-group` selector. Cells that have `--reveal-index` set still render their content normally for screen readers; only the visual entrance is animated.

## Risk notes

- **UBP visual regression:** the rename from `.ubp-reveal-target` → `.scroll-reveal-group` is a class swap, not a logic change. If the new selector somehow matches more elements than the old one did, UBP could see unexpected cells fading. Mitigation: the new selector requires both (a) `.scroll-reveal-group` on an ancestor and (b) an inline `--reveal-index` style on the descendant. UBP already sets `--reveal-index` only on `.ubp-cell` figures, so the matched set is identical.
- **AfA's many cascades:** seven separate `ScrollRevealGroup` wrappers on one page is more JSX than today. Each instance is a tiny React component (one `useRef` + one `IntersectionObserver`). Seven observers per page is well within the browser's budget. No perf concern.
- **ColorPro filmstrip arrows:** when the filmstrip moves inside `.wrap` (max 1280px), the arrows at `left/right: 16px` will sit inside the card edges rather than the viewport edges. This is the desired UBP behavior and the user's stated goal — flagging it so the visual change is explicit.

## References

- UBP page: [next-app/app/work/united-by-play/page.tsx](../next-app/app/work/united-by-play/page.tsx)
- UBP reveal CSS: globals.css lines ~2270-2312
- UBP filmstrip CSS: globals.css lines ~2319-2477
- `useScrollReveal` hook: [next-app/components/case-study/useScrollReveal.ts](../next-app/components/case-study/useScrollReveal.ts)
- Existing wrapper: [next-app/components/case-study/UbpAssetReveal.tsx](../next-app/components/case-study/UbpAssetReveal.tsx) (to be removed)
