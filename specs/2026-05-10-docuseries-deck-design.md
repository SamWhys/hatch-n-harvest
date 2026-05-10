# Docuseries deck — interactive slider for the United by Play case study

**Date:** 2026-05-10
**Status:** Approved design — ready for implementation plan
**Scope:** Replace the static 3-up grid in the United by Play "The Docuseries" section with a draggable card slider that advances horizontally with a pure-slide transition.

## Background

The current docuseries section renders three episode thumbnails (Tech Rehearsal, The Forge, The Gallery) in a static grid. Each thumbnail links to its YouTube video. The new design turns the section into an interactive deck: a single centered card, with the previous and next cards peeking from the sides, and drag/click controls to advance.

## Goals

- Single-card-center layout with side peeks; the active card sits at full size in the center, the prev and next cards peek in from the left and right edges (partially clipped).
- Pure horizontal-slide transition between cards (no scale, no tilt).
- Drag (pointer + touch) AND prev/next buttons both work.
- Clicking a side-peeking card brings it to center; clicking the centered card opens its YouTube video.
- Three dots and the active episode title appear below the deck.
- Loops in both directions.
- Keyboard accessible.
- Honors `prefers-reduced-motion`.

## Non-goals

- Auto-advance / autoplay.
- Embedded video playback (clicking still opens YouTube in a new tab).
- Tilt/scale/3D effects.
- Multi-card visible "deck" (this is a carousel with side peeks, not a stacked deck).
- Reusing on Acceleration For All in this pass (the component is built generically but consumed only by UbP for now).

## Architecture

### File layout

```
next-app/
├── components/
│   └── case-study/
│       └── DocuseriesDeck.tsx        (new client component)
├── app/
│   └── work/
│       └── united-by-play/
│           └── page.tsx               (modified — swap docu-grid for <DocuseriesDeck>)
├── app/globals.css                    (new /* === DOCUSERIES DECK === */ block)
└── tests/
    └── case-study/
        └── DocuseriesDeck.test.tsx    (new — basic interaction + a11y assertions)
```

### Component API

```tsx
"use client";

export type DocuseriesEpisode = {
  title: string;
  thumbnail: string;   // image src (relative path, e.g. "../../assets/work/united-by-play/docu-tech-rehearsal.jpg")
  alt: string;         // image alt text
  href: string;        // YouTube URL
};

export function DocuseriesDeck({
  episodes,
}: {
  episodes: DocuseriesEpisode[];
}): JSX.Element;
```

The component is a client component (`"use client"`) because the drag interaction needs React state and pointer event handlers.

### Internal state

- `activeIndex: number` — index of the centered card.
- `dragOffsetPx: number` — current drag delta in CSS pixels while a pointer is active; `0` otherwise.
- `isDragging: boolean` — true while a pointer is down and moving.

### Markup

```html
<section class="docuseries-deck" aria-roledescription="carousel" aria-label="Docuseries episodes">
  <button class="dd-prev" type="button" aria-label="Previous episode">
    <!-- chevron-left SVG -->
  </button>

  <div class="dd-stage" role="group" aria-live="polite">
    <!-- exactly 3 cards rendered: prev, active, next.
         Each card has a class indicating its slot.
         Click on .dd-card-active opens YouTube;
         click on .dd-card-prev or .dd-card-next advances. -->
    <a class="dd-card dd-card-prev"   href="..." aria-hidden="true" tabindex="-1">
      <img src="..." alt="" />
    </a>
    <a class="dd-card dd-card-active" href="..." target="_blank" rel="noopener noreferrer">
      <img src="..." alt="..." />
      <span class="dd-play" aria-hidden="true">
        <svg><path d="M8 5v14l11-7z" /></svg>
      </span>
    </a>
    <a class="dd-card dd-card-next"   href="..." aria-hidden="true" tabindex="-1">
      <img src="..." alt="" />
    </a>
  </div>

  <button class="dd-next" type="button" aria-label="Next episode">
    <!-- chevron-right SVG -->
  </button>

  <div class="dd-controls">
    <h3 class="dd-title">{activeEpisodeTitle}</h3>
    <ol class="dd-dots" aria-label="Episode position">
      <li><button class="dd-dot is-active" aria-label="Episode 1: …" aria-current="true" /></li>
      <li><button class="dd-dot"           aria-label="Episode 2: …" /></li>
      <li><button class="dd-dot"           aria-label="Episode 3: …" /></li>
    </ol>
  </div>
</section>
```

The prev/next side-peek cards have `aria-hidden="true"` and `tabindex="-1"` because they're decorative previews; advance happens via the buttons or drag, not by tabbing into the peek cards.

### Slot positioning

Cards are absolutely positioned within `.dd-stage`. CSS variables drive the layout:

```css
.docuseries-deck {
  --dd-card-width: clamp(280px, 56vw, 760px);
  --dd-card-aspect: 16 / 9;
  --dd-peek-overflow: 24%;   /* how much of the side cards peek out beyond the active card */
  --dd-gap: clamp(16px, 2vw, 32px);
}
```

Active card is centered. Prev card is positioned so that `--dd-peek-overflow` of its right edge is visible to the left of the active card; next card mirrors that on the right. While dragging, an additional `translateX(${dragOffsetPx}px)` is applied to all three cards.

`.dd-stage` gets an explicit `height` derived from the card aspect: `height: calc(var(--dd-card-width) / (16 / 9));` This gives the absolutely positioned cards something to align against and prevents layout collapse.

### Drag interaction

- `pointerdown` on `.dd-stage`: set `isDragging = true`, record start X, attach `pointermove` and `pointerup` listeners on the document.
- `pointermove`: compute `dragOffsetPx = currentX - startX`, clamp to `±cardWidth + peekOverflowPx` to prevent overshoot.
- `pointerup`: if `|dragOffsetPx| > cardWidth / 4`, advance in the drag direction (decrement or increment `activeIndex` modulo `episodes.length`). Otherwise rubber-band back to 0. Clear `isDragging`. Detach listeners.
- Click is suppressed within ~6px of pointerdown to avoid accidental video opens during a drag. (Implementation: track `pointerdown` X/Y; in the click handler, if pointer moved more than 6px, `preventDefault`.)

### Transitions

Two distinct transitions:

1. **Snap on advance / release:** `transition: transform 450ms cubic-bezier(0.32, 0.72, 0, 1);`
2. **Drag follow:** while `isDragging` is true, `transition: none;` so the cards track the pointer 1:1.

The transition is toggled by switching a `data-state` attribute on `.dd-stage` (e.g. `data-state="dragging"` removes the transition).

### Reduced motion

```css
@media (prefers-reduced-motion: reduce) {
  .dd-stage .dd-card {
    transition: opacity 50ms ease-out !important;
  }
  /* Skip the slide; rely on opacity crossfade between active card render passes */
}
```

Drag still works for the user, but the slide animation is suppressed.

### Keyboard

- Tab order: `dd-prev` → `dd-card-active` → `dd-next` → first dot → second dot → third dot.
- When the deck has focus (focus is within `.docuseries-deck`), `ArrowLeft` triggers the prev button, `ArrowRight` triggers the next button.
- Side-peek cards have `tabindex="-1"` so they're not in the tab order.
- Dots are real `<button>` elements; clicking dot N sets `activeIndex = N`.

### Looping

`activeIndex` is always taken modulo `episodes.length` (3). Both forward and backward advance wrap, so prev from index 0 goes to index 2 and next from index 2 goes to index 0. The visible peek cards are always `(activeIndex - 1 + len) % len` and `(activeIndex + 1) % len` — for a 3-episode deck, this means every card is always in view as either active or peek.

### CSS additions

Under a new `/* === DOCUSERIES DECK === */` block in `globals.css`, after the existing `.ubp-docuseries` rules. Reuses existing tokens: `--paper`, `--ink`, `--stone`, `--marigold`, `--radius-md`, `--pad`, `--maxw`. No new design tokens.

Estimated CSS volume: 80–120 lines.

### Page integration

In `next-app/app/work/united-by-play/page.tsx`, replace the existing block:

```tsx
<div className="ubp-docu-grid">
  <figure>…Tech Rehearsal…</figure>
  <figure>…The Forge…</figure>
  <figure>…The Gallery…</figure>
</div>
```

with:

```tsx
<DocuseriesDeck
  episodes={[
    {
      title: "Tech Rehearsal",
      thumbnail: "../../assets/work/united-by-play/docu-tech-rehearsal.jpg",
      alt: "Tech Rehearsal — episode thumbnail.",
      href: "https://www.youtube.com/watch?v=tRE3Mq6w5fo",
    },
    {
      title: "The Forge",
      thumbnail: "../../assets/work/united-by-play/docu-the-forge.jpg",
      alt: "The Forge — episode thumbnail.",
      href: "https://www.youtube.com/watch?v=Dwo2JJKZviI",
    },
    {
      title: "The Gallery",
      thumbnail: "../../assets/work/united-by-play/docu-the-gallery.jpg",
      alt: "The Gallery — episode thumbnail.",
      href: "https://www.youtube.com/watch?v=pGKBf9kV6mY",
    },
  ]}
/>
```

The `.ubp-docu-grid` styling and the surrounding `<section className="ubp-docuseries">` heading + lead paragraph stay unchanged.

The unused `.ubp-docu-grid`, `.ubp-docu-grid figure`, `.ubp-docu-thumb`, `.ubp-docu-thumb img`, `.ubp-docu-thumb .ubp-play`, `.ubp-docu-thumb .ubp-play svg`, and `.ubp-docu-grid figcaption` rules in `globals.css` are removed (cleanup; they no longer have a consumer on UbP).

## Testing

`next-app/tests/case-study/DocuseriesDeck.test.tsx` covers:

1. Renders three cards (prev, active, next) given three episodes.
2. The active card has the right `href` (YouTube URL) and `target="_blank" rel="noopener noreferrer"`.
3. Clicking the next button advances `activeIndex`; the new active card has the next episode's `href`.
4. Clicking the prev button decrements (and wraps from 0 to last).
5. The active dot has `aria-current="true"`; clicking dot 3 makes the third episode active.
6. Side-peek cards have `aria-hidden="true"` and `tabindex="-1"`.
7. Keyboard: `keyDown` ArrowRight on the deck advances; ArrowLeft retreats.
8. The episode title under the deck reflects the active episode.

Drag interaction is NOT covered by unit tests (jsdom + RTL pointer events for drag-snap are unreliable). It's verified manually in the browser preview.

UbP page smoke test (`tests/case-study/united-by-play.test.tsx`) is updated:
- Drop the assertion that requires three `.ubp-docu-grid figure` elements (no longer present).
- Add an assertion that `.docuseries-deck` is rendered.
- Add an assertion that all three episode YouTube URLs appear somewhere in the rendered DOM (covers data passthrough).

## Verification (definition of done)

1. `npm run typecheck` — clean.
2. `npm run test` — all tests pass.
3. `npm run build:prod` — succeeds. The UbP page in `docs/work/united-by-play/index.html` renders without errors.
4. Manual browser check on `localhost:3000/hatch-n-harvest/work/united-by-play/`:
   - Three episode cards visible (active center + two side peeks).
   - Drag the active card horizontally → it follows the pointer 1:1; releasing past the threshold advances; releasing short rubber-bands back.
   - Prev/next buttons advance.
   - Clicking the active card opens YouTube in a new tab.
   - Clicking a side-peeking card advances the deck (does NOT open YouTube).
   - Active dot updates as you advance; clicking a dot jumps directly.
   - Keyboard arrow keys advance when focus is within the deck.
   - At ≤640px viewport, side peeks are slim (~16px), drag works, buttons remain accessible.
   - DevTools Rendering → "Emulate CSS prefers-reduced-motion: reduce" → slide animation drops to instant-ish opacity transition; drag still works.

## Open questions

None. All design decisions confirmed during brainstorming.
