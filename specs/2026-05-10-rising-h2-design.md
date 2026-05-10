# Rising H2 — site-wide scroll-triggered word-rise animation

**Date:** 2026-05-10
**Status:** Approved design — ready for implementation plan
**Scope:** Apply the homepage hero H1's word-rise animation to every H2 on the site, triggered when each heading scrolls into view (rather than on page load).

## Background

The homepage hero H1 ("We hatch & harvest big ideas.") uses a staggered word-rise animation: each word starts clipped below a masked line and rises into place with `cubic-bezier(0.22, 1, 0.36, 1)` at 140ms-per-word stagger. The implementation lives in `next-app/components/Hero.tsx` (markup with per-word `--i` CSS vars) and `next-app/app/globals.css` (`.hero h1 .word` rules + `@keyframes hero-rise`).

The user wants the same visual on every H2 across the site. Because most H2s are below the fold, the animation must be scroll-triggered (when each H2 enters the viewport) rather than load-triggered.

## Goals

- A new `<RisingHeading>` component splits its children's text into word spans, applies `useScrollReveal` on its root, and animates each word into place with the homepage hero's easing/timing once the heading enters the viewport.
- Reusable for any heading level (`as="h1" | "h2" | "h3"`), though the rollout in this spec retrofits only `<h2>` elements.
- Preserves `<em>` wrappers inside the heading text. The italicized words still rise as part of the stagger, with the italic styling intact.
- Honors `prefers-reduced-motion: reduce`: words appear in final position without animation.

## Non-goals

- Touching the homepage hero H1 — it already has a purpose-built animation that runs on load. We don't migrate it to this component.
- Touching H3, H4, or other heading levels in this rollout. The component supports `as="h3"`, but no consumers use it yet.
- Recursive nesting deeper than `<em>` — if future H2s contain `<strong>` or other elements alongside `<em>`, the component will need extension. For now we support: string text + `<em>` (single level deep) interspersed with strings.

## Architecture

### Component shape

`next-app/components/case-study/RisingHeading.tsx`:

```tsx
"use client";

import { useRef, type ReactNode, type CSSProperties } from "react";
import { useScrollReveal } from "./useScrollReveal";

type HeadingTag = "h1" | "h2" | "h3";

export function RisingHeading({
  as = "h2",
  className,
  children,
}: {
  as?: HeadingTag;
  className?: string;
  children: ReactNode;
}): JSX.Element;
```

### Behavior

The component:

1. Walks `children` and produces a flat sequence of `<span class="word" style={{ "--i": N }}>...</span>` elements, preserving any `<em>` wrappers around their constituent words.
2. Wraps the whole sequence in a `<span class="line">` (which is `overflow: hidden` so the rising effect is masked).
3. Renders the heading element (`<h2>` etc.) with class `rising-heading` plus any caller-provided `className`.
4. Attaches a ref to the heading and calls `useScrollReveal(headingRef)` so `is-revealed` is added on first viewport entry.

### Word-splitting logic

A pure helper, not exposed publicly:

```tsx
function buildWords(children: ReactNode): { nodes: ReactNode[]; nextIndex: number } {
  // Walks children. For each:
  //   - string: split on whitespace runs; wrap each non-empty run in a <span class="word" style="--i:N">
  //   - <em> element: recursively process em.props.children, then wrap result in <em>
  //   - other elements: not supported; render as-is (escape hatch — rare)
  // Returns the produced nodes and the next available index for stagger.
}
```

Whitespace handling: split on `\s+`. Between word spans we re-insert a literal `" "` text node so the visual spacing is preserved. The trailing ` ` from JSX `{" "}` literals is treated the same as a regular space.

### Markup output

For input:

```tsx
<RisingHeading as="h2">
  People don&apos;t buy marketing strategies. They buy{" "}
  <em>connection, belonging, meaning.</em>
</RisingHeading>
```

…the component renders:

```html
<h2 class="rising-heading">
  <span class="line">
    <span class="word" style="--i:0">People</span>
    <span class="word" style="--i:1">don't</span>
    <span class="word" style="--i:2">buy</span>
    <span class="word" style="--i:3">marketing</span>
    <span class="word" style="--i:4">strategies.</span>
    <span class="word" style="--i:5">They</span>
    <span class="word" style="--i:6">buy</span>
    <em>
      <span class="word" style="--i:7">connection,</span>
      <span class="word" style="--i:8">belonging,</span>
      <span class="word" style="--i:9">meaning.</span>
    </em>
  </span>
</h2>
```

(The literal spaces between word spans are not shown above for clarity; they ARE present.)

### CSS

Append to `next-app/app/globals.css` under a new `/* === RISING HEADING === */` block.

```css
.rising-heading {
  /* Heading typography is already set globally on h2/h3.
     This block only handles the per-word reveal animation. */
}
.rising-heading .line {
  display: block;
  overflow: hidden;
  padding-top: 0.08em;
  padding-bottom: 0.22em;
}
.rising-heading .word {
  display: inline-block;
  opacity: 0;
  transform: translateY(105%);
  will-change: transform, opacity;
}
.rising-heading.is-revealed .word {
  animation: rising-heading-rise 0.9s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  animation-delay: calc(var(--i, 0) * 140ms);
}
@keyframes rising-heading-rise {
  from { opacity: 0; transform: translateY(105%); }
  to   { opacity: 1; transform: translateY(0); }
}

@media (prefers-reduced-motion: reduce) {
  .rising-heading .word {
    opacity: 1;
    transform: none;
    animation: none;
  }
}
```

The clamping of `padding-top: 0.08em; padding-bottom: 0.22em` on `.line` matches the homepage hero so descenders aren't clipped.

### Scroll-reveal trigger

The component uses the existing `useScrollReveal` hook at default options (`threshold: 0.05`, `rootMargin: "0px 0px -10% 0px"`). The hook adds `is-revealed` once when the heading first enters the viewport, then disconnects.

### `<em>` styling

The site already styles `h2 em` via the global `h1, h2, h3, h4 em` rule (italic, italic-color via `--clay`, etc.). The component does NOT override that — it only wraps the em's inner text in word spans. The `<em>` element itself remains in the DOM and continues to inherit existing italic styling.

### Reduced motion

The `prefers-reduced-motion: reduce` rule sets the words to their resting state immediately (`opacity: 1; transform: none; animation: none`) so the heading is fully visible on load without animation. The `is-revealed` class still gets added (no behavior change in the hook), but the animation is suppressed.

## Retrofit consumers

The following H2s get rewritten to use `<RisingHeading as="h2">`:

### Homepage components

- `next-app/components/Manifesto.tsx` — `<h2>People don&apos;t buy marketing strategies. They buy <em>connection, belonging, meaning.</em></h2>`
- `next-app/components/Work.tsx` — `<h2>Brands we&apos;ve helped grow.</h2>`
- `next-app/components/Process.tsx` — `<h2>We grow brands in three seasons.</h2>`
- `next-app/components/Studio.tsx` — `<h2>An Ad Agency with <em>Decades</em> of Experience</h2>`
- `next-app/components/Contact.tsx` — `<h2>For more info about us, click here.</h2>`

### UbP case study page

5 instances of `<h2 className="ubp-section-h">…</h2>` in `app/work/united-by-play/page.tsx`:

- "The Problem"
- "The Solution"
- "The Docuseries"
- "The Battle For Charity"
- "The Result"

### AfA case study page

`app/work/acceleration-for-all/page.tsx` has multiple `<h2>` instances. The retrofit covers ALL of them — every `<h2>` becomes `<RisingHeading as="h2" className="...">`. Approximate count: 6–8 instances based on the AfA section structure (problem, work-intro, manifesto, identity, social, outcome, results).

### `CaseSection` primitive

`CaseSection` already accepts `heading?: ReactNode` and renders it inside an `<h2>`. Update `CaseSection.tsx` so that when `heading` is provided, it's wrapped in `<RisingHeading as="h2">` instead of a plain `<h2>`. This automatically propagates the animation to every consumer of `CaseSection` site-wide without requiring per-call updates.

If a consumer of `CaseSection` passes a `heading` containing JSX deeper than `<em>`, the splitter falls back to rendering the unsupported element as-is (no word spans, no animation for that segment) — graceful degradation rather than crashing.

## Testing

### `RisingHeading.test.tsx` (new)

Reuses the same MockObserver pattern from `useScrollReveal.test.tsx`. Tests:

1. Renders the requested heading element (`as="h2"` produces `<h2>`).
2. Applies the `rising-heading` class plus any caller `className`.
3. Splits a plain-string child into word spans with sequential `--i` (0, 1, 2, ...).
4. Preserves an `<em>` element while splitting its inner text into word spans, with `--i` continuing the global sequence.
5. Adds `is-revealed` when the observer fires intersecting.

### `useScrollReveal.test.tsx`

No changes — already covered.

### Existing component tests

The homepage smoke test (`tests/smoke.test.tsx`) currently asserts the EXACT rendered text of some H2s (e.g., the manifesto headline). After retrofit, the H2 text is split across multiple span children — the rendered `textContent` is unchanged, but `getByText` exact match may not work if the matcher walks immediate children. Verify and adjust:

- Use `getByRole("heading", { level: 2 })` plus a substring or regex match of the textContent.
- Or, query by class (`.manifesto h2`) and assert `textContent.includes("connection")`.

The CaseSection test (`tests/case-study/CaseSection.test.tsx`) similarly may need to update its heading-text assertions to use `textContent` rather than direct `getByText`.

The case study page smoke tests (`tests/case-study/{acceleration-for-all,united-by-play}.test.tsx`) likely use `getByRole("heading", { level: 2, name: ... })` already, which DOES walk descendant text — those should continue to pass without change. Verify during implementation; adjust if any specific assertion breaks.

## Verification (definition of done)

1. `npm run typecheck` — clean.
2. `npm run test` — all tests pass.
3. `npm run build:prod` — succeeds.
4. Manual browser check:
   - Homepage: scroll past each H2 (Manifesto, Work, Process, Studio, Contact). Each animates word-by-word as it enters view. Italicized words in Manifesto and Studio rise correctly with the italic styling preserved.
   - UbP case study: scroll through. Each section heading ("The Problem", "The Solution", etc.) animates as it enters view.
   - AfA case study: scroll through. Each H2 animates.
   - Reload the page and quickly scroll past a heading; scroll back up. The heading does NOT re-animate (one-shot via the hook).
   - Toggle `prefers-reduced-motion: reduce` in DevTools. Reload. All H2s render in their final state with no animation.

## Open questions

None. All design decisions confirmed during brainstorming.
