# Vertical Full-Bleed Case Layout — Design

## Background

The homepage `Work` section ([next-app/components/Work.tsx](../next-app/components/Work.tsx)) currently presents the four case studies (ColorPro Awards, Acceleration For All, United by Play, Meet the Finchers) as a vertical **sticky-stacked** deck of landscape cards. Each `.case` is `position: sticky` with a 100vh `margin-bottom`, producing a tower-of-cards effect; a JS-driven Ken Burns zooms each image as it rises into its sticky position. The CSS for this lives in [next-app/app/globals.css](../next-app/app/globals.css) (~lines 640–855).

This spec describes an **experimental** layout — pursued on a dedicated branch (`experiment/vertical-case-layout`) — that replaces the stacked deck with **full-bleed cinematic sections**: one case per viewport, edge-to-edge, scroll-snapping between them, with centered content and Ken Burns triggered on entry. Goal is to evaluate the feel; it is not assumed to ship.

## Goals

- Each case study fills one full viewport (100vw × 100vh) edge-to-edge: no rounded corners, no padding, no box-shadow.
- Vertical scroll snaps between sections (one snap per case).
- Centered content per section: subtitle eyebrow → H3 title → one-liner → "Explore →" CTA pill (always visible, not hover-gated).
- Ken Burns kicks in when a section enters the viewport, and re-arms on each re-entry.
- Hover anywhere on the section grows the title (~15%) and dims the background image. The Explore pill fills marigold on its own hover.
- Preserve the existing locked-state mechanic ("Coming soon" pill in place of Explore).
- Sticky nav stays. Scroll-snap respects the nav offset.
- Keep the section heading ("Brands we've helped grow.") above the deck as a non-snap region.
- Same four cards, same data, same key-visual images.

## Non-Goals

- No mobile polish beyond a functional fallback (≤800px drops snap + Ken Burns and stacks naturally at 4:5).
- No parallel `WorkVertical.tsx` + feature flag — the experiment lives on a branch; `Work.tsx` is modified in place.
- No changes to any other homepage section (Hero, Manifesto, Process, Studio, Contact, Footer, SizzleReel).
- No changes to the case-study detail pages under `next-app/app/work/*`.
- No new case studies (the "Here's to Learning" study is separate work).
- No production-flag plumbing — this branch will be evaluated, then either merged, iterated, or discarded.

## Design

### Component changes ([next-app/components/Work.tsx](../next-app/components/Work.tsx))

- Remove `useKenBurnsStack` (the scroll-driven, sticky-stack zoom helper) and replace it with `useKenBurnsOnEnter`, which uses an `IntersectionObserver` to trigger a CSS-driven Ken Burns on the image of each section that becomes visible. Re-arm on every entry so re-visiting a section replays the zoom.
- Remove `useParallaxScroll` import only if no longer used; the parallax mnemonic SVG behind the section is preserved.
- Markup tree per case becomes:

  ```tsx
  <a className="case-vertical" href="…">
    <img className="case-vertical__bg" src="…" alt="…" />
    <div className="case-vertical__content">
      <div className="case-vertical__sub">Campaign · …</div>
      <h3 className="case-vertical__title">ColorPro Awards</h3>
      <p className="case-vertical__one-liner">…</p>
      <span className="case-vertical__cta">Explore <ArrowIcon /></span>
    </div>
    {featured && <span className="case-vertical__flag">Featured</span>}
  </a>
  ```

- The wrapping container is `.case-stack-vertical` (replacing `.case-stack`). It hosts the scroll-snap container behavior. The 1px `.case-stack-tail` margin-trap is no longer needed (no sticky elements) — remove it.
- The section heading block (`.work-head` with the `RisingHeading` H2) is preserved as-is, above the new container.
- `ArrowIcon` is unchanged.

### `useKenBurnsOnEnter` (implementation contract)

```ts
function useKenBurnsOnEnter(rootRef: React.RefObject<HTMLElement | null>) {
  // On mount:
  //   - Bail if prefers-reduced-motion: reduce.
  //   - Create an IntersectionObserver with threshold ~0.5.
  //   - For each .case-vertical, observe it.
  //   - On entry (isIntersecting && intersectionRatio >= 0.5):
  //       - Remove the .is-ken-burns class (force reflow), then re-add it.
  //       - The CSS animation runs from scale(1.06) to scale(1.0) over ~6s ease-out.
  //   - On exit: do nothing (class stays; next entry re-triggers via class-toggle).
  // Cleanup on unmount.
}
```

CSS handles the actual zoom; JS only toggles the class. This keeps the zoom GPU-driven and trivially overridable via `prefers-reduced-motion`.

### Styles ([next-app/app/globals.css](../next-app/app/globals.css))

Replace the existing `.case-stack`, `.case-stack-tail`, and `.case` rule blocks (~lines 640–855) with the new vertical-layout rules. Old class names disappear entirely — no shared CSS between the two layouts.

**Container:**

```css
.case-stack-vertical {
  position: relative;
  scroll-snap-type: y mandatory;
}
```

The `scroll-snap-type` lives on the container, not the page root, so it doesn't affect other sections of the homepage.

**Section (the `<a>`):**

```css
.case-vertical {
  display: block;
  position: relative;
  width: 100vw;
  height: 100vh;
  margin-left: calc(50% - 50vw); /* break out of any parent padding */
  overflow: hidden;
  color: var(--ink);
  text-decoration: none;
  isolation: isolate;

  scroll-snap-align: start;
  scroll-snap-stop: always;
  scroll-margin-top: 104px; /* clear sticky nav */
}
```

**Background image:**

```css
.case-vertical__bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform-origin: center;
  transform: scale(1.0);
  transition: filter 0.4s ease;
}
.case-vertical.is-ken-burns .case-vertical__bg {
  animation: case-vertical-ken-burns 6s cubic-bezier(.2,.7,.2,1) forwards;
}
@keyframes case-vertical-ken-burns {
  from { transform: scale(1.06); }
  to   { transform: scale(1.0); }
}
.case-vertical:hover .case-vertical__bg {
  filter: brightness(0.72);
}
```

**Gradient overlay** — top + bottom for text legibility:

```css
.case-vertical::after {
  content: '';
  position: absolute;
  inset: 0;
  background:
    linear-gradient(to bottom,
      rgba(0,0,0,0.45) 0%,
      rgba(0,0,0,0)   30%,
      rgba(0,0,0,0)   65%,
      rgba(0,0,0,0.55) 100%);
  pointer-events: none;
  z-index: 1;
}
```

**Content block (centered):**

```css
.case-vertical__content {
  position: absolute;
  inset: 104px 0 0 0;        /* clear the sticky nav */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 0 clamp(24px, 4vw, 64px);
  z-index: 2;
}
.case-vertical__sub {
  font-size: 13px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--marigold);
  text-shadow: 0 1px 12px rgba(0,0,0,0.5);
  margin-bottom: 18px;
}
.case-vertical__title {
  font-family: var(--font-display);
  font-weight: 900;
  font-variation-settings: "opsz" 144;
  font-size: clamp(26px, 3vw, 40px); /* H3 scale */
  line-height: 1;
  letter-spacing: -0.02em;
  color: var(--ink);
  text-shadow: 0 2px 24px rgba(0,0,0,0.5);
  margin: 0 0 18px;
  max-width: 18ch;
  transition:
    font-size 0.35s cubic-bezier(.2,.8,.2,1),
    letter-spacing 0.35s cubic-bezier(.2,.8,.2,1);
}
.case-vertical:hover .case-vertical__title,
.case-vertical:focus-visible .case-vertical__title {
  font-size: clamp(30px, 3.4vw, 46px);
  letter-spacing: -0.025em;
}
.case-vertical__one-liner {
  font-family: var(--font-body);
  font-size: clamp(15px, 1.2vw, 17px);
  font-weight: 500;
  line-height: 1.4;
  color: var(--ink);
  max-width: 52ch;
  text-shadow: 0 1px 12px rgba(0,0,0,0.6);
  margin: 0 0 28px;
}
```

**CTA (always visible):**

```css
.case-vertical__cta {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 16px 32px;
  border: 2px solid var(--marigold);
  border-radius: 999px;
  background: color-mix(in srgb, var(--paper) 30%, transparent);
  backdrop-filter: blur(6px);
  color: var(--marigold);
  font-family: var(--font-body);
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.20em;
  text-transform: uppercase;
  transition: background 0.2s ease, color 0.2s ease;
}
.case-vertical__cta:hover {
  background: var(--marigold);
  color: var(--paper);
}
.case-vertical__cta svg { flex: none; }
```

**Featured flag** — pinned top-right, accounting for sticky nav:

```css
.case-vertical__flag {
  position: absolute;
  top: calc(104px + 24px);
  right: clamp(20px, 3vw, 40px);
  background: var(--marigold);
  color: var(--paper);
  padding: 7px 14px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  z-index: 3;
}
```

**Locked variant** (e.g., a "Coming soon" card):

```css
.case-vertical.is-locked { cursor: default; }
.case-vertical.is-locked .case-vertical__bg {
  filter: saturate(0.65) brightness(0.78);
}
.case-vertical.is-locked:hover .case-vertical__bg {
  filter: saturate(0.65) brightness(0.78); /* no extra dim on hover */
}
.case-vertical.is-locked:hover .case-vertical__title,
.case-vertical.is-locked:focus-visible .case-vertical__title {
  font-size: clamp(26px, 3vw, 40px); /* no hover grow on locked */
  letter-spacing: -0.02em;
}
.case-vertical.is-locked .case-vertical__title,
.case-vertical.is-locked .case-vertical__one-liner { opacity: 0.7; }
```

The existing `.case-locked-cta` class in `globals.css` is absolutely positioned at the geometric center (`top: 50%; left: 50%; transform: translate(...)`). In the new layout, when a locked card is added, render the locked pill **in place of** the Explore pill, inside `.case-vertical__content` — and add a small reset so the pill inherits centering from the flex parent instead of absolute positioning:

```css
.case-vertical__content .case-locked-cta {
  position: static;
  transform: none;
  top: auto; left: auto;
}
```

Today there is no locked card on the homepage, but the structure is in place for future use.

**Mobile (≤800px):**

```css
@media (max-width: 800px) {
  .case-stack-vertical { scroll-snap-type: none; }
  .case-vertical {
    width: 100%;
    margin-left: 0;
    height: auto;
    aspect-ratio: 4 / 5;
    scroll-snap-align: none;
    scroll-snap-stop: normal;
  }
  .case-vertical__content { inset: 0; padding: 24px; }
  .case-vertical__flag { top: 16px; right: 16px; }
  .case-vertical.is-ken-burns .case-vertical__bg { animation: none; }
}
```

**Reduced motion:**

```css
@media (prefers-reduced-motion: reduce) {
  .case-stack-vertical { scroll-snap-type: none; }
  .case-vertical { scroll-snap-align: none; }
  .case-vertical.is-ken-burns .case-vertical__bg { animation: none; }
  .case-vertical:hover .case-vertical__title { font-size: clamp(26px, 3vw, 40px); }
}
```

### Interaction summary

| Action | Result |
| --- | --- |
| Scroll between cases | Page snaps to the next section's top (clearing the 104px nav). |
| Section enters viewport | Ken Burns plays once, 1.06 → 1.0 over ~6s. |
| Section re-enters viewport | Ken Burns re-arms and replays. |
| Hover anywhere on a section | Title grows ~15% with tightened tracking; background image dims. |
| Hover the Explore pill | Pill fills marigold. |
| Click anywhere on a section | Navigates to the case study page (entire `<a>` is the link surface). |
| ≤800px or reduced-motion | Snap + Ken Burns disabled; sections stack naturally. |

### Edge cases

- **Sticky nav + scroll-snap.** Setting `scroll-snap-type` on the container (not `html`) and `scroll-margin-top: 104px` on each section avoids the well-known Chrome quirk where snap targets ignore the sticky nav offset.
- **Section with no key-visual image.** All four current cases have a `kv-card.jpg` (or the United by Play title card). No fallback needed in this experiment.
- **Horizontal scrollbar.** `width: 100vw` + `margin-left: calc(50% - 50vw)` breaks out of any parent padding cleanly. Tested pattern; doesn't introduce horizontal scroll on standard browsers.
- **First section + page load.** IntersectionObserver fires `isIntersecting=true` on first observation if the section is already in view, so the Ken Burns kicks off as expected on the first card without a separate "initial trigger" path.
- **Keyboard nav.** Tab cycles through the four `<a>` elements as today. Focus-visible mirrors hover (title grows, image stays — no background filter needed on focus alone). Add `:focus-visible` rule alongside `:hover` everywhere it's used.
- **Reduced motion vs. hover.** Hover grow is still allowed under `prefers-reduced-motion` (no transform/animation, just a font-size transition). The reduced-motion override above disables it for users who really don't want any UI movement; if we'd rather keep the hover bump and only drop the Ken Burns, drop the title rule from the reduced-motion block.

## Files Touched

- [next-app/components/Work.tsx](../next-app/components/Work.tsx) — replace `useKenBurnsStack` with `useKenBurnsOnEnter`; swap markup to the `.case-vertical` structure; keep the parallax mnemonic and section heading.
- [next-app/app/globals.css](../next-app/app/globals.css) — replace `.case-stack` / `.case-stack-tail` / `.case` rules (~lines 640–855) with `.case-stack-vertical` / `.case-vertical*` rules.
- [next-app/tests/](../next-app/tests/) — update the Work-related test(s) for the new class names and the IntersectionObserver-driven Ken Burns. Mock `IntersectionObserver` in test setup if not already mocked.
- No new files. No asset changes.

## Out of Scope / Future Work

- **Mobile polish.** Today's fallback is functional, not crafted. If we ship this layout, a follow-up should redesign the mobile experience (a horizontal swipe deck? a tighter 9:16 portrait stack? a return to the natural-stack with no snap?).
- **Production flag.** If we want to A/B the layouts, that's a separate plumbing task (Next.js can do this with a route param or a server-injected variant).
- **New case studies.** The "Here's to Learning" case study is independent work and uses the same `.case-vertical` markup once added.
- **Locked-card content.** No `is-locked` card lives on the homepage today; rules above are forward-looking only.

## Post-implementation revisions (2026-05-21)

Two tweaks made after live visual review on `experiment/vertical-case-layout`:

- **Eyebrow color** — `.case-vertical__sub` changed from `var(--marigold)` to `var(--ink)`. The marigold-on-marigold (and marigold-on-warm-photography) read poorly against several of the live key visuals; warm cream gives consistent contrast across all four cards.
- **Hover dim depth** — `.case-vertical:hover .case-vertical__bg` / `:focus-visible .case-vertical__bg` filter changed from `brightness(0.72)` to `brightness(0.5)`. The lighter dim left the title and one-liner hard to read on top of bright photography; `0.5` matches the contrast level the legacy `.case` cards used.
