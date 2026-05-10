# UbP scroll reveal animations

**Date:** 2026-05-10
**Status:** Approved design — ready for implementation plan
**Scope:** Add two scroll-triggered entrance animations to the United by Play case study page.
1. The `DocuseriesDeck` slides up + fades in when the deck first enters the viewport.
2. The 11 cells of the solution-section asset grid fade in with a staggered delay (90ms per cell) when the grid first enters the viewport.

## Background

The United by Play case study currently renders the docuseries deck and the solution asset grid as static markup that is fully visible on first paint. The user wants both areas to feel more cinematic — the deck arriving as you scroll to it, and the asset cards revealing one-by-one in reading order. The repo already has scroll-driven animation precedent (`useParallaxScroll` for parallax mnemonics on the homepage), but a one-shot reveal is a different shape and warrants its own small hook.

## Goals

- Both features fire ONCE the first time their target enters the viewport, then never again.
- The deck animates as a single composite unit (active card + side peeks together) — not card-by-card.
- The asset grid cards animate with a 90ms stagger in a specified order, with the award video appearing 4th.
- Both animations are pure CSS transitions, triggered by adding an `is-revealed` class via JS.
- `prefers-reduced-motion: reduce` collapses both animations to instant (cards still become visible, just no transition).
- No new external dependencies.

## Non-goals

- Scroll-driven advance of the deck (option 2 from brainstorming — vertical scroll changes active card). May be added later as a separate spec.
- Reveal animations on other sections of the UbP page or on the AfA page.
- A general-purpose reveal-on-scroll utility for the whole site. The hook is reusable but its first two consumers are scoped to this one page.

## Architecture

### File layout

```
next-app/
├── components/
│   └── case-study/
│       ├── DocuseriesDeck.tsx         (modified — add useScrollReveal hook on root <section> ref)
│       └── useScrollReveal.ts          (new — IntersectionObserver-based one-shot class toggle)
├── app/
│   ├── work/united-by-play/page.tsx    (modified — wrap asset grid, add --reveal-index per cell)
│   └── globals.css                     (modified — append /* === SCROLL REVEAL === */ block)
└── tests/
    └── case-study/
        ├── useScrollReveal.test.tsx    (new)
        └── united-by-play.test.tsx     (modified — add reveal-target + --reveal-index assertions)
```

### `useScrollReveal` hook

A small hook that watches a single element and adds `is-revealed` to it the first time it enters the viewport, then disconnects. No state — operates on the DOM ref directly to avoid a render cycle when the class is added.

```tsx
"use client";

import { useEffect, type RefObject } from "react";

export function useScrollReveal(
  ref: RefObject<HTMLElement | null>,
  options?: { threshold?: number; rootMargin?: string }
): void {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            el.classList.add("is-revealed");
            observer.disconnect();
            break;
          }
        }
      },
      {
        threshold: options?.threshold ?? 0.05,
        rootMargin: options?.rootMargin ?? "0px 0px -10% 0px",
      }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, options?.threshold, options?.rootMargin]);
}
```

Defaults are tuned so the trigger fires when ~10% of the element is below the bottom of the viewport (`rootMargin: "0px 0px -10% 0px"`) AND at least 5% of the element is intersecting. In practice this means: the user has scrolled enough to see the top of the target.

### Deck entrance

`DocuseriesDeck.tsx` gets a new ref on its root `<section>` and calls `useScrollReveal(sectionRef)`. The class `is-revealed` is added directly to the section once.

CSS in `globals.css` (under the new SCROLL REVEAL block):

```css
.docuseries-deck {
  opacity: 0;
  transform: translateY(28px);
  transition:
    opacity 700ms cubic-bezier(0.32, 0.72, 0, 1),
    transform 700ms cubic-bezier(0.32, 0.72, 0, 1);
}
.docuseries-deck.is-revealed {
  opacity: 1;
  transform: translateY(0);
}
```

This is added in addition to the existing deck rules — the existing rules don't set `opacity` or `transform` on the section, so the new declarations don't conflict.

The existing `.dd-card` transition (450ms cubic-bezier on `transform`) still governs card-to-card slides AFTER the entrance. The entrance is on the `.docuseries-deck` section element; per-card slides are on the `.dd-card` elements. Because they're different DOM elements with different transition properties, they don't interfere.

### Asset grid stagger

In `next-app/app/work/united-by-play/page.tsx`, the existing `<div className="ubp-asset-wrap">` becomes the reveal target by adding a marker class:

```tsx
// before
<div className="ubp-asset-wrap">
  <div className="ubp-asset-grid">…</div>
</div>

// after
<div ref={assetWrapRef} className="ubp-asset-wrap ubp-reveal-target">
  <div className="ubp-asset-grid">…</div>
</div>
```

The page becomes a client component (it isn't currently — it's a server component). Two paths:

1. Convert the entire UbP page to `"use client"` so it can hold the ref + call the hook.
2. Wrap the asset grid in a small client subcomponent and only that piece is client-rendered.

**Decision: option 2** — extract a thin `UbpAssetReveal` client component that owns the wrapper div, the ref, and the `useScrollReveal` call. The rest of the UbP page stays a server component, so the static rendering performance is preserved.

```tsx
// next-app/components/case-study/UbpAssetReveal.tsx
"use client";

import { useRef, type ReactNode } from "react";
import { useScrollReveal } from "./useScrollReveal";

export function UbpAssetReveal({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement | null>(null);
  useScrollReveal(ref);
  return (
    <div ref={ref} className="ubp-asset-wrap ubp-reveal-target">
      {children}
    </div>
  );
}
```

In the page, wrap the existing `.ubp-asset-grid` content with `<UbpAssetReveal>` instead of the bare `.ubp-asset-wrap` div. The grid itself stays in the page (server-rendered).

Each `.ubp-cell` figure inside the grid gets a `--reveal-index` inline style:

| index | cell | rationale |
|---|---|---|
| 0 | gaming-hero-shot | first because it's the wide banner at the top |
| 1 | chinese-lady | top-left feature |
| 2 | cop | top-right area |
| 3 | award (video) | brought up per user feedback |
| 4 | fashion-designer | next in reading order |
| 5 | troll-investors | |
| 6 | man | left-bottom feature |
| 7 | waitress | right-side vertical |
| 8 | kid | right-side horizontal |
| 9 | whiskey-guy | bottom-left |
| 10 | title-card | bottom-right (16:9) |

```tsx
<figure className="ubp-cell ubp-hero-shot" style={{ "--reveal-index": 0 } as React.CSSProperties}>
  <img src="../../assets/work/united-by-play/gaming-hero-shot.jpg" alt="…" loading="lazy" />
</figure>
```

CSS:

```css
.ubp-reveal-target .ubp-cell {
  opacity: 0;
  transform: translateY(20px);
  transition:
    opacity 600ms cubic-bezier(0.32, 0.72, 0, 1),
    transform 600ms cubic-bezier(0.32, 0.72, 0, 1);
  transition-delay: calc(var(--reveal-index, 0) * 90ms);
}
.ubp-reveal-target.is-revealed .ubp-cell {
  opacity: 1;
  transform: translateY(0);
}
```

11 cells × 90ms = 990ms stagger sweep + 600ms tail = ~1.6s end-to-end.

The existing `--reveal-index` inline style does double duty: TypeScript needs the `as React.CSSProperties` cast because CSS custom properties aren't in React's typed `CSSProperties`. (The codebase already uses this pattern elsewhere, e.g., `CaseStudyShell`'s `brandVars` prop.)

### Reduced motion

Append at the end of the SCROLL REVEAL CSS block:

```css
@media (prefers-reduced-motion: reduce) {
  .docuseries-deck,
  .ubp-reveal-target .ubp-cell {
    transition-duration: 0ms !important;
    transition-delay: 0ms !important;
  }
}
```

The `is-revealed` class still gets added; users with reduced-motion preference see the cards appear in their final position instantly. They retain the deck's interactive behaviors (drag, click, keyboard, dots) at the same reduced cadence already set in Task 5 of the deck plan (50ms transitions for the per-card slide).

## Testing

### `useScrollReveal.test.tsx` (new)

The repo's `tests/setup.ts` already stubs `IntersectionObserver` globally. The stub is a no-op class (no `observe` callbacks fire), so the test needs to either:
- Replace the stub with a controllable mock for this test, OR
- Test only that the observer is constructed and `observe()` is called (not the callback path).

Decision: install a per-test controllable mock that exposes a `triggerEntry` helper. Tests:

1. Mount a component that calls `useScrollReveal(ref)` on a `<div>`. Confirm the div does NOT yet have `is-revealed`.
2. Trigger the observer callback with `isIntersecting: true`. Confirm `is-revealed` is now on the div.
3. Trigger again with `isIntersecting: true`. Confirm `disconnect()` was called and the class is still on (no toggling).
4. Trigger callback with `isIntersecting: false` BEFORE any true entry. Confirm class is NOT added.
5. Unmount the component. Confirm `disconnect()` was called (cleanup path).

### `DocuseriesDeck.test.tsx` (no change required)

The existing 10 tests pass without modification. The hook adds the class via the global IntersectionObserver stub, which never fires its callback, so the deck stays in its `opacity: 0` state during tests — but tests query DOM presence, not visibility, so this doesn't affect them.

### `united-by-play.test.tsx` (modified)

Add one new `it` block to the existing describe:

```tsx
it("wraps the asset grid in a reveal target with --reveal-index per cell", () => {
  const { container } = render(<UnitedByPlayPage />);
  const wrap = container.querySelector(".ubp-reveal-target");
  expect(wrap).not.toBeNull();
  const cells = wrap?.querySelectorAll(".ubp-cell") ?? [];
  expect(cells.length).toBe(11);
  cells.forEach((cell) => {
    const style = (cell as HTMLElement).style;
    expect(style.getPropertyValue("--reveal-index")).not.toBe("");
  });
  // Award video should be at index 3 per design order.
  const award = wrap?.querySelector(".ubp-award") as HTMLElement | null;
  expect(award?.style.getPropertyValue("--reveal-index")).toBe("3");
});
```

## Verification (definition of done)

1. `npm run typecheck` — clean.
2. `npm run test` — all tests pass (existing 78 + ~5 new for `useScrollReveal` + 1 new UbP assertion = ~84).
3. `npm run build:prod` — succeeds. The UbP page renders without errors.
4. Manual browser check on `localhost:3000/hatch-n-harvest/work/united-by-play/`:
   - Reload the page. Scroll down. As the docuseries deck enters view, it slides up + fades in over ~700ms.
   - Continue scrolling up to the solution asset grid. As it enters view, the cards reveal in the configured order with ~90ms staggers — gaming-hero-shot first, then chinese-lady, then cop, then the award video pop in 4th, etc.
   - After the reveal, the deck remains fully interactive (drag, buttons, keyboard) and asset cards stay visible.
   - Reload the page and scroll past the deck without stopping. Scroll back up. The deck does NOT animate again — `is-revealed` persists.
   - Toggle DevTools → Rendering → "Emulate CSS prefers-reduced-motion: reduce". Reload. Both the deck and asset cards become visible without animation.

## Open questions

None. All design decisions confirmed during brainstorming.
