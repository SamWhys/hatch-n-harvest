# Parallax Mnemonics — Design

**Date:** 2026-05-07
**Status:** Approved (pending implementation)

## Summary

Add an "ambient float + scroll-coupled parallax" effect to four brand mnemonics across three sections of the landing page. Each shape gently bobs and rotates on its own loop and additionally drifts in response to scroll, creating depth and the sense that the shapes are floating in space behind the type.

## Scope

In scope (4 mnemonics across 3 sections):

| Section  | File                                    | Asset                            |
| -------- | --------------------------------------- | -------------------------------- |
| Work     | `next-app/components/Work.tsx`          | `assets/brand/mnemonic-4.svg`    |
| Process  | `next-app/components/Process.tsx`       | `assets/brand/mnemonic-5.svg`    |
| Contact  | `next-app/components/Contact.tsx`       | `assets/brand/brand-mnemonic-1.svg` (left) |
| Contact  | `next-app/components/Contact.tsx`       | `assets/brand/brand-mnemonic-4.svg` (right) |

Out of scope: Manifesto's `mnemonic-h-1.png` (owner will revisit separately).

## Motion specification

- **Ambient float (always on, except reduced-motion):** each mnemonic loops a 5–7s ease-in-out keyframe that translates ±25–40px and rotates ±3–5°. Four distinct keyframes (`mnemonic-float-a`–`-d`) and durations so shapes don't bob in unison.
- **Scroll coupling (desktop only):** as the user scrolls, each mnemonic translates vertically opposite to scroll relative to viewport center, scaled by an intensity coefficient between 0.10 and 0.20. Result: shape "moves slower" than the page — classic parallax depth — with each mnemonic at a slightly different depth.
- The two layers compose; total visible motion is the sum of float and scroll-coupled translate.

## Suppression rules

- `@media (prefers-reduced-motion: reduce)`: ambient animation disabled, all custom-property values forced to zero, JS hook short-circuits.
- `@media (max-width: 1024px)` **or** `(pointer: coarse)`: scroll coupling disabled (hook bails out). Ambient float continues since it's pure CSS and runs cheaply on the compositor. The 1024px breakpoint matches the existing `.contact-decor` mobile rules.

## Architecture

### `next-app/components/useParallaxScroll.ts` (new)

Custom React hook with the shape:

```ts
useParallaxScroll(ref: RefObject<HTMLElement>, opts: { intensity: number }): void
```

Responsibilities:

- On mount: registers the element + intensity into a module-level `Set<RegisteredElement>`.
- A single shared `requestAnimationFrame` loop iterates registered elements each frame, computes each element's distance from viewport center, multiplies by intensity, and writes the result to `--scroll-y` on that element.
- An `IntersectionObserver` (also module-shared) gates updates: elements outside the viewport are skipped per-frame to keep the loop cheap.
- On unmount: deregisters and resets `--scroll-y` to `0px`.
- Bails out at startup if `matchMedia('(prefers-reduced-motion: reduce)').matches` or `matchMedia('(max-width: 1024px), (pointer: coarse)').matches`.

The hook owns no React state — it writes only to DOM custom properties. No re-renders from scroll.

### `next-app/app/globals.css`

Add a `.parallax-mnemonic` utility class that:

- Declares `@property --float-y` (length), `--float-x` (length), `--float-r` (angle), and `--scroll-y` (length) with `inherits: false` and zero initial values. `@property` makes them animatable via keyframes (Chrome 85+, Safari 16.4+, Firefox 128+ — solid for 2026).
- Sets `will-change: transform` and `transform-origin: center`.
- Composes the transform so that scroll, base rotation, and float compose without fighting:
  ```
  transform:
    translate3d(0, var(--scroll-y, 0px), 0)
    /* element's existing rotate(...) sits here, applied via per-element rule */
    translate3d(var(--float-x, 0px), var(--float-y, 0px), 0)
    rotate(var(--float-r, 0deg));
  ```
  The "existing rotate" is per-element (e.g. `.contact-decor.right { transform: rotate(18deg); }`) — see "Per-element transform composition" below.
- Defines four `@keyframes mnemonic-float-a/b/c/d`, each writing to `--float-x/y/r` over a 5–7s loop with slightly different amplitudes and timing offsets.
- Adds `@media (prefers-reduced-motion: reduce) { .parallax-mnemonic { animation: none; --float-x: 0px; --float-y: 0px; --float-r: 0deg; --scroll-y: 0px; } }`.

#### Per-element transform composition

The existing per-mnemonic CSS sets a static `transform: rotate(...)`. Adding `.parallax-mnemonic` would conflict because two rules would both set `transform`. Resolution: rewrite the existing per-element rules to compose all transforms into one, with the rotation applied between the scroll translate and the float translate. For example, `.contact-decor.right` becomes:

```css
.contact-decor.right {
  /* …positioning unchanged… */
  transform:
    translate3d(0, var(--scroll-y, 0px), 0)
    rotate(18deg)
    translate3d(var(--float-x, 0px), var(--float-y, 0px), 0)
    rotate(var(--float-r, 0deg));
}
```

The base rotation stays per-element (each shape has its own); the parallax/float values come from the variables. The scroll translate is applied first (in viewport space, unrotated), the float values are applied last (so the float drifts along the rotated local axes — the float feels like the shape is gently swimming, which suits the brand).

### Component changes

For each of `Work.tsx`, `Process.tsx`, `Contact.tsx`:

- Add `parallax-mnemonic` to the `className` of the relevant `<img>`.
- Create a `useRef<HTMLImageElement>(null)` and pass it to the `<img>`.
- Call `useParallaxScroll(ref, { intensity: <0.10–0.20> })`.
- Components must be `"use client"` since hooks need browser APIs. Currently they appear to be server components — converting them is a one-line directive at the top.

Suggested intensity values:

| Mnemonic                     | Intensity |
| ---------------------------- | --------- |
| Work `mnemonic-4`            | 0.20      |
| Process `mnemonic-5`         | 0.15      |
| Contact left `brand-mnemonic-1` | 0.18   |
| Contact right `brand-mnemonic-4` | 0.10  |

Higher intensity = larger scroll drift. Mixing values keeps shapes at perceptibly different depths.

## Performance considerations

- One shared rAF loop, not one per element.
- `IntersectionObserver` skips off-screen elements per-frame — important because the Work mnemonic is offscreen ~half the page lifetime.
- All animated properties are transform-based (custom properties feed into `transform`), keeping work on the compositor thread.
- `will-change: transform` declared per-element so the browser can pre-promote each layer.
- Custom properties via `@property` register with the engine — animating them is GPU-friendly under modern Chromium and WebKit.

## Testing

**Smoke test (Vitest):** add to `next-app/tests/smoke.test.tsx`:

- Render the page and assert each parallax-eligible `<img>` has the `parallax-mnemonic` class.
- (Hook behavior is hard to assert in jsdom — leaving it to manual verification rather than mocking IntersectionObserver and rAF.)

**Manual verification checklist:**

- Desktop (1440×900): scroll the page slowly through Work → Process → Contact. Each mnemonic should both bob ambiently and drift opposite to scroll.
- Tablet (768×1024): ambient float visible, no scroll drift.
- Mobile (375×812): Contact mnemonics still hidden (existing rule); Work + Process mnemonics show ambient float, no scroll drift.
- Reduced motion: enable in OS settings, reload — every mnemonic is dead still.
- DevTools Performance recording while scrolling: no layout/paint thrash, transforms only.

## Open items / explicit non-goals

- Not adding parallax to Manifesto (deferred, owner's call).
- Not adding parallax to Hero atmosphere SVGs (out of scope).
- Not converting any other static element to parallax.
- Not adding scroll-snap or any scroll hijacking — touch and trackpad scroll behavior unchanged.
- Not adding library dependencies (GSAP, Lenis, Framer Motion, etc.).

## Files touched (summary)

| File                                        | Change                              |
| ------------------------------------------- | ----------------------------------- |
| `next-app/components/useParallaxScroll.ts`  | **New** — shared hook + rAF loop    |
| `next-app/app/globals.css`                  | New `.parallax-mnemonic` class, `@property` decls, four `@keyframes`, reduced-motion suppression; rewrite `transform` rules on `.contact-decor.left/right`, `.work-mnemonic`, `.process .process-mnemonic` to compose vars |
| `next-app/components/Work.tsx`              | `"use client"`, ref + hook + class  |
| `next-app/components/Process.tsx`           | `"use client"`, ref + hook + class  |
| `next-app/components/Contact.tsx`           | `"use client"`, ref + hook + class on both decor imgs |
| `next-app/tests/smoke.test.tsx`             | Add class-presence assertions       |
