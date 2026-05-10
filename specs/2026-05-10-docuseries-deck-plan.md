# Docuseries Deck Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the static 3-up docuseries grid in the United by Play case study with a draggable single-card-center carousel that has prev/next buttons, dot indicators, keyboard support, and a pure horizontal slide transition.

**Architecture:** Add a new client component `DocuseriesDeck` that owns the activeIndex / dragOffset state, renders three slot cards (prev, active, next) absolutely positioned within a `.dd-stage` whose height is derived from a 16:9 aspect token. Drag is implemented with pointer events on the stage (no third-party library); a CSS data-state toggle disables transitions while dragging so cards track 1:1, then re-enables them on release for the snap. The UbP page swaps the existing `<div className="ubp-docu-grid">` for `<DocuseriesDeck episodes={[…]} />`.

**Tech Stack:** Next.js 15 client component (`"use client"`), React 19, TypeScript, Vitest + React Testing Library, plain CSS in `app/globals.css` (no new dependencies).

**Source design:** [`specs/2026-05-10-docuseries-deck-design.md`](./2026-05-10-docuseries-deck-design.md)

**Branch:** Create a new feature branch `docuseries-deck` off `main`.

**Working directory for npm commands:** `next-app/` — `cd next-app/` once at the start of each task; commands assume that as cwd.

---

## Conventions used in this plan

- All paths are relative to the repo root unless explicitly under `next-app/`.
- Each task ends with a single `git commit` covering all the files it touched.
- Tests go in `next-app/tests/case-study/`.
- The component uses `"use client"` because pointer-event handling and React state require client rendering. Server-render the static layout, then hydrate.
- Source images for the three episodes already exist at `next-app/public/assets/work/united-by-play/docu-{tech-rehearsal,the-forge,the-gallery}.jpg` — no new assets needed.

---

## Task 1: Branch and component scaffold

Create the feature branch, then create a minimal `DocuseriesDeck` component that just renders the three episodes as a static unstyled list — no slider behavior yet. Confirms the client-component wiring + import path before adding interaction.

**Files:**
- Create: `next-app/components/case-study/DocuseriesDeck.tsx`
- Create: `next-app/tests/case-study/DocuseriesDeck.test.tsx`

- [ ] **Step 1: Create the branch from main**

Run from repo root:
```bash
git checkout main
git pull origin main
git checkout -b docuseries-deck
```
Expected: switched to a new branch.

- [ ] **Step 2: Write the failing scaffold test**

Create `next-app/tests/case-study/DocuseriesDeck.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { DocuseriesDeck, type DocuseriesEpisode } from "@/components/case-study/DocuseriesDeck";

const sample: DocuseriesEpisode[] = [
  { title: "Tech Rehearsal", thumbnail: "/a.jpg", alt: "alt-a", href: "https://example.com/a" },
  { title: "The Forge",      thumbnail: "/b.jpg", alt: "alt-b", href: "https://example.com/b" },
  { title: "The Gallery",    thumbnail: "/c.jpg", alt: "alt-c", href: "https://example.com/c" },
];

describe("DocuseriesDeck — scaffold", () => {
  it("renders the carousel landmark and three cards", () => {
    const { container } = render(<DocuseriesDeck episodes={sample} />);
    expect(container.querySelector('.docuseries-deck')).not.toBeNull();
    const cards = container.querySelectorAll('.dd-card');
    expect(cards.length).toBe(3);
  });

  it("renders the active episode title in the controls", () => {
    render(<DocuseriesDeck episodes={sample} />);
    expect(screen.getByText("Tech Rehearsal")).toBeInTheDocument();
  });
});
```

- [ ] **Step 3: Run the test to verify it fails**

Run from `next-app/`:
```bash
npm run test -- DocuseriesDeck
```
Expected: FAIL — module does not exist.

- [ ] **Step 4: Implement the scaffold component**

Create `next-app/components/case-study/DocuseriesDeck.tsx`:

```tsx
"use client";

import { useState } from "react";

export type DocuseriesEpisode = {
  title: string;
  thumbnail: string;
  alt: string;
  href: string;
};

export function DocuseriesDeck({ episodes }: { episodes: DocuseriesEpisode[] }) {
  const [activeIndex] = useState(0);
  const len = episodes.length;
  const prevIdx = (activeIndex - 1 + len) % len;
  const nextIdx = (activeIndex + 1) % len;
  const active = episodes[activeIndex];
  const prev = episodes[prevIdx];
  const next = episodes[nextIdx];

  return (
    <section
      className="docuseries-deck"
      aria-roledescription="carousel"
      aria-label="Docuseries episodes"
    >
      <button type="button" className="dd-prev" aria-label="Previous episode">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M15 6l-6 6 6 6" />
        </svg>
      </button>

      <div className="dd-stage" role="group" aria-live="polite">
        <a className="dd-card dd-card-prev" href={prev.href} aria-hidden="true" tabIndex={-1}>
          <img src={prev.thumbnail} alt="" loading="lazy" />
        </a>
        <a className="dd-card dd-card-active" href={active.href} target="_blank" rel="noopener noreferrer">
          <img src={active.thumbnail} alt={active.alt} loading="lazy" />
          <span className="dd-play" aria-hidden="true">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
          </span>
        </a>
        <a className="dd-card dd-card-next" href={next.href} aria-hidden="true" tabIndex={-1}>
          <img src={next.thumbnail} alt="" loading="lazy" />
        </a>
      </div>

      <button type="button" className="dd-next" aria-label="Next episode">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M9 6l6 6-6 6" />
        </svg>
      </button>

      <div className="dd-controls">
        <h3 className="dd-title">{active.title}</h3>
        <ol className="dd-dots" aria-label="Episode position">
          {episodes.map((ep, i) => (
            <li key={ep.title}>
              <button
                type="button"
                className={`dd-dot${i === activeIndex ? " is-active" : ""}`}
                aria-label={`Episode ${i + 1}: ${ep.title}`}
                aria-current={i === activeIndex ? "true" : undefined}
              />
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
```

- [ ] **Step 5: Run tests to verify they pass**

Run from `next-app/`:
```bash
npm run test -- DocuseriesDeck
```
Expected: 2/2 passing.

- [ ] **Step 6: Run the full suite to confirm no regressions**

Run from `next-app/`:
```bash
npm run test
```
Expected: previous 68 tests + 2 new = 70 passing.

- [ ] **Step 7: Run typecheck**

Run from `next-app/`:
```bash
npm run typecheck
```
Expected: clean.

- [ ] **Step 8: Commit**

```bash
git add components/case-study/DocuseriesDeck.tsx tests/case-study/DocuseriesDeck.test.tsx
git commit -m "Add DocuseriesDeck scaffold (static three-card render)"
```

---

## Task 2: Add CSS for the static layout

Add the `/* === DOCUSERIES DECK === */` block to `globals.css`. After this task the component renders with the right shape (active card centered, peek cards on the sides) but still has no interaction.

**Files:**
- Modify: `next-app/app/globals.css` (append)

- [ ] **Step 1: Append the CSS block**

Add this block at the END of `next-app/app/globals.css`. Match the file's existing 4-space indentation:

```css

    /* ============================================================
       DOCUSERIES DECK
       Single-card center + side-peek carousel for the UbP "The
       Docuseries" section. State is owned by DocuseriesDeck.tsx;
       this stylesheet only handles layout/transition.
       ============================================================ */

    .docuseries-deck {
      --dd-card-width: clamp(280px, 56vw, 760px);
      --dd-card-aspect: 16 / 9;
      --dd-peek-overflow: 24%;
      --dd-gap: clamp(16px, 2vw, 32px);

      display: grid;
      grid-template-columns: auto 1fr auto;
      align-items: center;
      gap: var(--dd-gap);
      max-width: var(--maxw);
      margin: clamp(24px, 4vw, 48px) auto 0;
      padding: 0 var(--pad);
    }

    .dd-prev,
    .dd-next {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 44px;
      height: 44px;
      border-radius: 999px;
      border: 1px solid var(--line);
      background: transparent;
      color: var(--ink);
      cursor: pointer;
      transition: border-color .2s ease, color .2s ease, transform .2s ease;
    }
    .dd-prev:hover,
    .dd-next:hover {
      border-color: var(--marigold);
      color: var(--marigold);
    }
    .dd-prev:active,
    .dd-next:active { transform: scale(0.96); }

    .dd-stage {
      position: relative;
      height: calc(var(--dd-card-width) * 9 / 16);
      overflow: hidden;
      touch-action: pan-y;
    }

    .dd-card {
      position: absolute;
      top: 0;
      width: var(--dd-card-width);
      aspect-ratio: var(--dd-card-aspect);
      border-radius: var(--radius-md);
      overflow: hidden;
      background: var(--cream);
      transition: transform 450ms cubic-bezier(0.32, 0.72, 0, 1);
      will-change: transform;
    }
    .dd-stage[data-state="dragging"] .dd-card {
      transition: none;
    }

    .dd-card img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
      pointer-events: none;
      user-select: none;
    }

    .dd-card-active {
      left: 50%;
      transform: translateX(-50%);
      z-index: 2;
    }

    .dd-card-prev {
      right: calc(50% + var(--dd-card-width) / 2 - var(--dd-peek-overflow));
      z-index: 1;
    }
    .dd-card-next {
      left: calc(50% + var(--dd-card-width) / 2 - var(--dd-peek-overflow));
      z-index: 1;
    }

    .dd-card-active .dd-play {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 64px;
      height: 64px;
      border-radius: 999px;
      background: rgba(28, 28, 28, 0.7);
      color: var(--ink);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      backdrop-filter: blur(4px);
      transition: background .2s ease, transform .2s ease;
    }
    .dd-card-active:hover .dd-play {
      background: var(--marigold);
      color: var(--forest-deep);
      transform: translate(-50%, -50%) scale(1.05);
    }

    .dd-controls {
      grid-column: 1 / -1;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      margin-top: clamp(16px, 2vw, 24px);
    }
    .dd-title {
      font-family: var(--font-display);
      font-weight: 600;
      font-size: clamp(20px, 2vw, 26px);
      letter-spacing: -0.01em;
      margin: 0;
      color: var(--ink);
    }
    .dd-dots {
      display: flex;
      gap: 10px;
      list-style: none;
      padding: 0;
      margin: 0;
    }
    .dd-dot {
      display: block;
      width: 8px;
      height: 8px;
      padding: 0;
      border: 0;
      border-radius: 999px;
      background: var(--line);
      cursor: pointer;
      transition: background .2s ease, transform .2s ease;
    }
    .dd-dot:hover { background: var(--stone); }
    .dd-dot.is-active {
      background: var(--marigold);
      transform: scale(1.25);
    }

    @media (max-width: 640px) {
      .docuseries-deck {
        --dd-peek-overflow: 8px;
        --dd-card-width: min(86vw, 520px);
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .dd-card,
      .dd-prev,
      .dd-next,
      .dd-dot,
      .dd-card-active .dd-play {
        transition-duration: 50ms !important;
      }
    }
```

- [ ] **Step 2: Run typecheck and tests to confirm no regression**

Run from `next-app/`:
```bash
npm run typecheck && npm run test
```
Expected: clean + all 70 tests pass (CSS doesn't affect tests, but verifying).

- [ ] **Step 3: Manual visual sanity check**

Run from `next-app/`:
```bash
npm run dev
```

Then navigate to `http://localhost:3000/hatch-n-harvest/work/united-by-play/`. The component is not yet wired up to the page (Task 6), so visit a quick-render manually: there's nothing to see on the page yet, but `npm run build:prod` should still complete successfully — run that quickly to confirm the CSS doesn't break the build:

```bash
npm run build:prod
```
Expected: build succeeds. (Don't commit the rebuilt `docs/` — that's the deploy step at the end.)

Stop the dev server.

- [ ] **Step 4: Commit**

```bash
git add app/globals.css
git commit -m "Add CSS for DocuseriesDeck (static layout)"
```

---

## Task 3: Wire prev/next buttons + dot navigation

Add `activeIndex` state-mutation handlers so prev, next, and dot-click work. No drag yet — that's Task 4.

**Files:**
- Modify: `next-app/components/case-study/DocuseriesDeck.tsx`
- Modify: `next-app/tests/case-study/DocuseriesDeck.test.tsx`

- [ ] **Step 1: Extend the test to cover button + dot interaction**

Append these `it` blocks to the existing `describe("DocuseriesDeck — scaffold", …)` block in `tests/case-study/DocuseriesDeck.test.tsx`. Also add the `userEvent` import at the top:

```tsx
import userEvent from "@testing-library/user-event";
```

(If `@testing-library/user-event` is not yet a devDependency, install it with `npm install -D @testing-library/user-event` from `next-app/` and add a brief note in the commit.)

Append:

```tsx
  it("advances activeIndex when next button clicked", async () => {
    const user = userEvent.setup();
    render(<DocuseriesDeck episodes={sample} />);
    expect(screen.getByText("Tech Rehearsal")).toBeInTheDocument();
    await user.click(screen.getByLabelText("Next episode"));
    expect(screen.getByText("The Forge")).toBeInTheDocument();
  });

  it("retreats activeIndex when prev button clicked, wrapping from 0 to last", async () => {
    const user = userEvent.setup();
    render(<DocuseriesDeck episodes={sample} />);
    await user.click(screen.getByLabelText("Previous episode"));
    expect(screen.getByText("The Gallery")).toBeInTheDocument();
  });

  it("clicking a dot jumps to that episode", async () => {
    const user = userEvent.setup();
    render(<DocuseriesDeck episodes={sample} />);
    await user.click(screen.getByLabelText("Episode 3: The Gallery"));
    expect(screen.getByText("The Gallery")).toBeInTheDocument();
  });

  it("active dot has aria-current=true", () => {
    render(<DocuseriesDeck episodes={sample} />);
    const activeDot = screen.getByLabelText("Episode 1: Tech Rehearsal");
    expect(activeDot).toHaveAttribute("aria-current", "true");
  });

  it("active card has the active episode's href and external-link attrs", () => {
    const { container } = render(<DocuseriesDeck episodes={sample} />);
    const active = container.querySelector(".dd-card-active") as HTMLAnchorElement;
    expect(active.getAttribute("href")).toBe("https://example.com/a");
    expect(active.getAttribute("target")).toBe("_blank");
    expect(active.getAttribute("rel")).toBe("noopener noreferrer");
  });

  it("side-peek cards are aria-hidden and tabindex -1", () => {
    const { container } = render(<DocuseriesDeck episodes={sample} />);
    const prev = container.querySelector(".dd-card-prev") as HTMLAnchorElement;
    const next = container.querySelector(".dd-card-next") as HTMLAnchorElement;
    expect(prev.getAttribute("aria-hidden")).toBe("true");
    expect(prev.getAttribute("tabindex")).toBe("-1");
    expect(next.getAttribute("aria-hidden")).toBe("true");
    expect(next.getAttribute("tabindex")).toBe("-1");
  });
```

- [ ] **Step 2: Run the new tests to verify they fail**

Run from `next-app/`:
```bash
npm run test -- DocuseriesDeck
```
Expected: existing 2 pass, the new "advances activeIndex…" tests FAIL because there's no click handler yet.

- [ ] **Step 3: Wire up state mutation in the component**

Replace `next-app/components/case-study/DocuseriesDeck.tsx` with:

```tsx
"use client";

import { useState, useCallback } from "react";

export type DocuseriesEpisode = {
  title: string;
  thumbnail: string;
  alt: string;
  href: string;
};

export function DocuseriesDeck({ episodes }: { episodes: DocuseriesEpisode[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const len = episodes.length;

  const advance = useCallback(
    (delta: number) => {
      setActiveIndex((i) => (i + delta + len) % len);
    },
    [len]
  );

  const goToIndex = useCallback(
    (i: number) => {
      setActiveIndex(((i % len) + len) % len);
    },
    [len]
  );

  const prevIdx = (activeIndex - 1 + len) % len;
  const nextIdx = (activeIndex + 1) % len;
  const active = episodes[activeIndex];
  const prev = episodes[prevIdx];
  const next = episodes[nextIdx];

  return (
    <section
      className="docuseries-deck"
      aria-roledescription="carousel"
      aria-label="Docuseries episodes"
    >
      <button
        type="button"
        className="dd-prev"
        aria-label="Previous episode"
        onClick={() => advance(-1)}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M15 6l-6 6 6 6" />
        </svg>
      </button>

      <div className="dd-stage" role="group" aria-live="polite">
        <a
          className="dd-card dd-card-prev"
          href={prev.href}
          aria-hidden="true"
          tabIndex={-1}
          onClick={(e) => { e.preventDefault(); advance(-1); }}
        >
          <img src={prev.thumbnail} alt="" loading="lazy" />
        </a>
        <a
          className="dd-card dd-card-active"
          href={active.href}
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={active.thumbnail} alt={active.alt} loading="lazy" />
          <span className="dd-play" aria-hidden="true">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
          </span>
        </a>
        <a
          className="dd-card dd-card-next"
          href={next.href}
          aria-hidden="true"
          tabIndex={-1}
          onClick={(e) => { e.preventDefault(); advance(1); }}
        >
          <img src={next.thumbnail} alt="" loading="lazy" />
        </a>
      </div>

      <button
        type="button"
        className="dd-next"
        aria-label="Next episode"
        onClick={() => advance(1)}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M9 6l6 6-6 6" />
        </svg>
      </button>

      <div className="dd-controls">
        <h3 className="dd-title">{active.title}</h3>
        <ol className="dd-dots" aria-label="Episode position">
          {episodes.map((ep, i) => (
            <li key={ep.title}>
              <button
                type="button"
                className={`dd-dot${i === activeIndex ? " is-active" : ""}`}
                aria-label={`Episode ${i + 1}: ${ep.title}`}
                aria-current={i === activeIndex ? "true" : undefined}
                onClick={() => goToIndex(i)}
              />
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run from `next-app/`:
```bash
npm run test -- DocuseriesDeck
```
Expected: 8/8 passing.

- [ ] **Step 5: Run the full suite**

Run from `next-app/`:
```bash
npm run test
```
Expected: 76 passing (68 prior + 8 new).

- [ ] **Step 6: Commit**

```bash
git add components/case-study/DocuseriesDeck.tsx tests/case-study/DocuseriesDeck.test.tsx
git commit -m "Wire DocuseriesDeck prev/next buttons + dot navigation"
```

If `@testing-library/user-event` had to be installed, also add `package.json` and `package-lock.json` to the commit:
```bash
git add package.json package-lock.json
git commit --amend --no-edit
```

---

## Task 4: Add keyboard support (arrow keys)

When focus is anywhere within `.docuseries-deck`, ArrowLeft retreats and ArrowRight advances.

**Files:**
- Modify: `next-app/components/case-study/DocuseriesDeck.tsx`
- Modify: `next-app/tests/case-study/DocuseriesDeck.test.tsx`

- [ ] **Step 1: Write the failing test**

Append to `tests/case-study/DocuseriesDeck.test.tsx`'s describe block:

```tsx
  it("ArrowRight advances when focus is within the deck", async () => {
    const user = userEvent.setup();
    render(<DocuseriesDeck episodes={sample} />);
    const next = screen.getByLabelText("Next episode");
    next.focus();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByText("The Forge")).toBeInTheDocument();
  });

  it("ArrowLeft retreats when focus is within the deck", async () => {
    const user = userEvent.setup();
    render(<DocuseriesDeck episodes={sample} />);
    const prev = screen.getByLabelText("Previous episode");
    prev.focus();
    await user.keyboard("{ArrowLeft}");
    expect(screen.getByText("The Gallery")).toBeInTheDocument();
  });
```

- [ ] **Step 2: Run tests to verify they fail**

Run from `next-app/`:
```bash
npm run test -- DocuseriesDeck
```
Expected: 2 new tests FAIL — keyboard handler not implemented.

- [ ] **Step 3: Add the keyboard handler**

Modify `next-app/components/case-study/DocuseriesDeck.tsx`. Add a `KeyboardEvent` handler on the `<section>`:

Replace the opening `<section …>` element with:

```tsx
    <section
      className="docuseries-deck"
      aria-roledescription="carousel"
      aria-label="Docuseries episodes"
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") {
          e.preventDefault();
          advance(1);
        } else if (e.key === "ArrowLeft") {
          e.preventDefault();
          advance(-1);
        }
      }}
    >
```

Leave everything else inside the section unchanged.

- [ ] **Step 4: Run tests to verify they pass**

Run from `next-app/`:
```bash
npm run test -- DocuseriesDeck
```
Expected: 10/10 passing.

- [ ] **Step 5: Commit**

```bash
git add components/case-study/DocuseriesDeck.tsx tests/case-study/DocuseriesDeck.test.tsx
git commit -m "Add keyboard arrow-key navigation to DocuseriesDeck"
```

---

## Task 5: Add drag interaction with rubber-band snap

Pointer-event-based horizontal drag. While dragging, all three cards translate by `dragOffsetPx` and the stage's `data-state="dragging"` disables transitions for 1:1 tracking. On release, if `|dragOffsetPx| > cardWidth / 4`, advance in the drag direction; otherwise rubber-band back to 0.

**Files:**
- Modify: `next-app/components/case-study/DocuseriesDeck.tsx`

This task does NOT add unit tests for drag — pointer-event drag is unreliable in jsdom + RTL. It's verified manually in Task 7.

- [ ] **Step 1: Update the component with pointer-event handlers**

Replace `next-app/components/case-study/DocuseriesDeck.tsx` with:

```tsx
"use client";

import { useState, useCallback, useRef, type PointerEvent as ReactPointerEvent } from "react";

export type DocuseriesEpisode = {
  title: string;
  thumbnail: string;
  alt: string;
  href: string;
};

const DRAG_ADVANCE_RATIO = 0.25;
const CLICK_SUPPRESSION_PX = 6;

export function DocuseriesDeck({ episodes }: { episodes: DocuseriesEpisode[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [dragOffsetPx, setDragOffsetPx] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const stageRef = useRef<HTMLDivElement | null>(null);
  const startXRef = useRef(0);
  const startYRef = useRef(0);
  const pointerMovedRef = useRef(false);
  const len = episodes.length;

  const advance = useCallback(
    (delta: number) => {
      setActiveIndex((i) => (i + delta + len) % len);
    },
    [len]
  );

  const goToIndex = useCallback(
    (i: number) => {
      setActiveIndex(((i % len) + len) % len);
    },
    [len]
  );

  const handlePointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    // Only handle primary pointer (left mouse, single touch, pen).
    if (e.button !== 0 && e.pointerType === "mouse") return;
    startXRef.current = e.clientX;
    startYRef.current = e.clientY;
    pointerMovedRef.current = false;
    setIsDragging(true);
    setDragOffsetPx(0);
    (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const dx = e.clientX - startXRef.current;
    const dy = e.clientY - startYRef.current;
    if (Math.abs(dx) > CLICK_SUPPRESSION_PX || Math.abs(dy) > CLICK_SUPPRESSION_PX) {
      pointerMovedRef.current = true;
    }
    setDragOffsetPx(dx);
  };

  const handlePointerUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const stage = stageRef.current;
    const cardWidth = stage ? stage.getBoundingClientRect().width : 0;
    const threshold = cardWidth * DRAG_ADVANCE_RATIO;
    const dx = dragOffsetPx;
    setIsDragging(false);
    setDragOffsetPx(0);
    (e.currentTarget as HTMLDivElement).releasePointerCapture(e.pointerId);
    if (dx <= -threshold) {
      advance(1);
    } else if (dx >= threshold) {
      advance(-1);
    }
    // else: rubber-band back to 0 (already done by setDragOffsetPx(0))
  };

  const handleActiveCardClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (pointerMovedRef.current) {
      e.preventDefault();
    }
  };

  const prevIdx = (activeIndex - 1 + len) % len;
  const nextIdx = (activeIndex + 1) % len;
  const active = episodes[activeIndex];
  const prev = episodes[prevIdx];
  const next = episodes[nextIdx];

  const dragStyle = isDragging
    ? { transform: `translateX(${dragOffsetPx}px)` }
    : undefined;
  // The active card uses its own translate-X(-50%) for centering;
  // when dragging we need to compose with that — handled below.
  const activeDragStyle = isDragging
    ? { transform: `translateX(calc(-50% + ${dragOffsetPx}px))` }
    : undefined;

  return (
    <section
      className="docuseries-deck"
      aria-roledescription="carousel"
      aria-label="Docuseries episodes"
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") {
          e.preventDefault();
          advance(1);
        } else if (e.key === "ArrowLeft") {
          e.preventDefault();
          advance(-1);
        }
      }}
    >
      <button
        type="button"
        className="dd-prev"
        aria-label="Previous episode"
        onClick={() => advance(-1)}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M15 6l-6 6 6 6" />
        </svg>
      </button>

      <div
        ref={stageRef}
        className="dd-stage"
        role="group"
        aria-live="polite"
        data-state={isDragging ? "dragging" : "idle"}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <a
          className="dd-card dd-card-prev"
          href={prev.href}
          aria-hidden="true"
          tabIndex={-1}
          style={dragStyle}
          onClick={(e) => { e.preventDefault(); if (!pointerMovedRef.current) advance(-1); }}
        >
          <img src={prev.thumbnail} alt="" loading="lazy" />
        </a>
        <a
          className="dd-card dd-card-active"
          href={active.href}
          target="_blank"
          rel="noopener noreferrer"
          style={activeDragStyle}
          onClick={handleActiveCardClick}
        >
          <img src={active.thumbnail} alt={active.alt} loading="lazy" />
          <span className="dd-play" aria-hidden="true">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
          </span>
        </a>
        <a
          className="dd-card dd-card-next"
          href={next.href}
          aria-hidden="true"
          tabIndex={-1}
          style={dragStyle}
          onClick={(e) => { e.preventDefault(); if (!pointerMovedRef.current) advance(1); }}
        >
          <img src={next.thumbnail} alt="" loading="lazy" />
        </a>
      </div>

      <button
        type="button"
        className="dd-next"
        aria-label="Next episode"
        onClick={() => advance(1)}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M9 6l6 6-6 6" />
        </svg>
      </button>

      <div className="dd-controls">
        <h3 className="dd-title">{active.title}</h3>
        <ol className="dd-dots" aria-label="Episode position">
          {episodes.map((ep, i) => (
            <li key={ep.title}>
              <button
                type="button"
                className={`dd-dot${i === activeIndex ? " is-active" : ""}`}
                aria-label={`Episode ${i + 1}: ${ep.title}`}
                aria-current={i === activeIndex ? "true" : undefined}
                onClick={() => goToIndex(i)}
              />
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Run the test suite to confirm prior tests still pass**

Run from `next-app/`:
```bash
npm run test -- DocuseriesDeck
```
Expected: 10/10 passing. The new pointer logic only affects drag behavior; button/dot/keyboard tests still pass.

- [ ] **Step 3: Run typecheck**

Run from `next-app/`:
```bash
npm run typecheck
```
Expected: clean.

- [ ] **Step 4: Commit**

```bash
git add components/case-study/DocuseriesDeck.tsx
git commit -m "Add pointer-event drag with rubber-band snap to DocuseriesDeck"
```

---

## Task 6: Wire `DocuseriesDeck` into the United by Play page

Replace the existing `<div className="ubp-docu-grid">…three figures…</div>` in the UbP page with `<DocuseriesDeck episodes={[…]} />`. Then remove the now-unused `.ubp-docu-grid` and `.ubp-docu-thumb` rules from `globals.css`.

**Files:**
- Modify: `next-app/app/work/united-by-play/page.tsx`
- Modify: `next-app/app/globals.css`
- Modify: `next-app/tests/case-study/united-by-play.test.tsx`

- [ ] **Step 1: Update the UbP smoke test**

Open `next-app/tests/case-study/united-by-play.test.tsx`. Find any assertion that depends on `.ubp-docu-grid figure` count or selector — those will break since the markup is changing. Replace any such assertion with:

```tsx
  it("renders the docuseries deck with three episodes", () => {
    const { container } = render(<UnitedByPlayPage />);
    expect(container.querySelector(".docuseries-deck")).not.toBeNull();
    const cards = container.querySelectorAll(".docuseries-deck .dd-card");
    expect(cards.length).toBe(3);
    // All three YouTube hrefs are present in the rendered DOM (active + two peeks).
    const html = container.innerHTML;
    expect(html).toContain("tRE3Mq6w5fo");
    expect(html).toContain("Dwo2JJKZviI");
    expect(html).toContain("pGKBf9kV6mY");
  });
```

If the existing UbP test does NOT have a `.ubp-docu-grid figure` assertion (verify by reading the file), just add the new test inside the `describe("United by Play page", …)` block.

- [ ] **Step 2: Run the test to verify it fails**

Run from `next-app/`:
```bash
npm run test -- united-by-play
```
Expected: FAIL — `.docuseries-deck` not yet rendered on the page.

- [ ] **Step 3: Update the page to use `DocuseriesDeck`**

Open `next-app/app/work/united-by-play/page.tsx`. Add this import to the top of the file (alongside the other `@/components/case-study/...` imports):

```tsx
import { DocuseriesDeck } from "@/components/case-study/DocuseriesDeck";
```

Then locate the existing block:

```tsx
                    <div className="ubp-docu-grid">
                        <figure>
                            <a className="ubp-docu-thumb" href="https://www.youtube.com/watch?v=tRE3Mq6w5fo" target="_blank" rel="noopener noreferrer" aria-label="Watch — Tech Rehearsal">
                                <img src="../../assets/work/united-by-play/docu-tech-rehearsal.jpg" alt="Tech Rehearsal — episode thumbnail." loading="lazy" />
                                <span className="ubp-play" aria-hidden="true">
                                    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
                                </span>
                            </a>
                            <figcaption>Tech Rehearsal</figcaption>
                        </figure>
                        <figure>
                            <a className="ubp-docu-thumb" href="https://www.youtube.com/watch?v=Dwo2JJKZviI" target="_blank" rel="noopener noreferrer" aria-label="Watch — The Forge">
                                <img src="../../assets/work/united-by-play/docu-the-forge.jpg" alt="The Forge — episode thumbnail." loading="lazy" />
                                <span className="ubp-play" aria-hidden="true">
                                    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
                                </span>
                            </a>
                            <figcaption>The Forge</figcaption>
                        </figure>
                        <figure>
                            <a className="ubp-docu-thumb" href="https://www.youtube.com/watch?v=pGKBf9kV6mY" target="_blank" rel="noopener noreferrer" aria-label="Watch — The Gallery">
                                <img src="../../assets/work/united-by-play/docu-the-gallery.jpg" alt="The Gallery — episode thumbnail." loading="lazy" />
                                <span className="ubp-play" aria-hidden="true">
                                    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
                                </span>
                            </a>
                            <figcaption>The Gallery</figcaption>
                        </figure>
                    </div>
```

Replace it with:

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

- [ ] **Step 4: Remove the unused docu-grid CSS**

Open `next-app/app/globals.css`. Locate and DELETE the entire block of rules for the old grid:

```css
    .ubp-docu-grid {
      …
    }
    .ubp-docu-grid figure { … }
    .ubp-docu-thumb { … }
    .ubp-docu-thumb:hover { … }
    .ubp-docu-thumb img { … }
    .ubp-docu-thumb:hover img { … }
    .ubp-docu-thumb .ubp-play { … }
    .ubp-docu-thumb .ubp-play svg { … }
    .ubp-docu-grid figcaption { … }
    @media (max-width: 700px) {
      .ubp-docu-grid { grid-template-columns: 1fr; }
    }
```

Use `grep -n 'ubp-docu-grid\|ubp-docu-thumb' next-app/app/globals.css` from `next-app/` to find every line, then delete the contiguous block. Keep `.ubp-docuseries`, `.ubp-docu-lead`, and `.ubp-section-h` — those are still in use by the section header.

If a `@media (max-width: 700px)` block contains ONLY a `.ubp-docu-grid` rule, delete the whole `@media` wrapper too. If it contains other rules, just delete the `.ubp-docu-grid` line within it.

- [ ] **Step 5: Run the suite**

Run from `next-app/`:
```bash
npm run test
```
Expected: all tests pass — UbP smoke test now finds `.docuseries-deck` and three cards. Total should be 76 (existing 76 minus any old assertion that was replaced).

- [ ] **Step 6: Run typecheck**

Run from `next-app/`:
```bash
npm run typecheck
```
Expected: clean.

- [ ] **Step 7: Commit**

```bash
git add app/work/united-by-play/page.tsx app/globals.css tests/case-study/united-by-play.test.tsx
git commit -m "Use DocuseriesDeck on United by Play, drop legacy docu-grid CSS"
```

---

## Task 7: Manual browser verification

Visual + interaction check before deploy. No code changes.

**Files:**
- None.

- [ ] **Step 1: Start the dev server**

Run from `next-app/`:
```bash
npm run dev
```
Expected: ready on `http://localhost:3000` within a few seconds.

- [ ] **Step 2: Open the page**

Navigate to `http://localhost:3000/hatch-n-harvest/work/united-by-play/`. Scroll to "The Docuseries" section.

Verify visually:
- The active card is centered, ~56vw wide (clamped 280–760px), 16:9 aspect.
- A play-button overlay sits in the middle of the active card.
- Two side-peek cards are visible to the left and right, each clipped at ~24% overlap with the active card edge.
- A prev arrow button (◀) sits to the left of the deck; a next arrow button (▶) sits to the right.
- Below the deck: the active episode title in display font, then three small dots — first one filled with marigold orange.

- [ ] **Step 3: Verify button + dot interactions**

- Click the next button (▶). The deck advances to "The Forge"; the marigold dot moves to position 2/3.
- Click the next button again → "The Gallery", dot 3/3.
- Click the next button again → wraps back to "Tech Rehearsal", dot 1/3.
- Click the prev button (◀). The deck retreats; from "Tech Rehearsal" it wraps to "The Gallery".
- Click dot 2 → jumps directly to "The Forge".

- [ ] **Step 4: Verify drag interaction**

- Click and drag the active card to the LEFT past ~25% of the card width, then release. The deck advances to the next episode with a smooth slide.
- Click and drag the active card to the RIGHT past ~25% of the card width, then release. The deck retreats to the previous episode.
- Click and drag the active card LEFT only ~10% of the card width, then release. The card rubber-bands back to the center; activeIndex doesn't change.
- Confirm the card tracks the pointer 1:1 while dragging (no transition lag) and snaps to the new slot on release with a smooth `cubic-bezier(0.32, 0.72, 0, 1)` ease.

- [ ] **Step 5: Verify click vs drag**

- Click (don't drag) the centered active card. A new tab opens with the corresponding YouTube URL.
- Drag the active card past the threshold so the deck advances. After the drag, the YouTube tab should NOT have opened — the click suppression worked.
- Click a side-peeking card. The deck advances to bring it to center; YouTube does NOT open.

- [ ] **Step 6: Verify keyboard**

- Click the prev arrow button to give it focus.
- Press ArrowRight. Deck advances.
- Press ArrowLeft. Deck retreats.
- Tab through the deck region. Tab order: prev button → active card → next button → first dot → second dot → third dot. Side-peek cards (which have `tabindex="-1"`) are skipped.

- [ ] **Step 7: Verify mobile-ish viewport**

In Chrome DevTools, toggle device toolbar (Cmd+Shift+M) and select a 375px-wide preset. The deck should:
- Show a smaller active card (~86vw, capped at 520px).
- Side peeks should shrink to 8px slivers (just hints).
- Drag interaction should still work via touch emulation.
- Buttons should remain reachable.

- [ ] **Step 8: Verify reduced-motion**

In Chrome DevTools → Rendering panel → "Emulate CSS prefers-reduced-motion" → set to "reduce". Reload the page. Advance the deck via button click. The transition should drop to ~50ms (effectively instant). Drag still works but without the slide animation.

Reset the emulation when done.

- [ ] **Step 9: Stop the dev server**

Press Ctrl+C in the terminal running `npm run dev`.

- [ ] **Step 10: If any issue surfaced — file a follow-up note**

If everything passes, no commit needed for this task. If small visual calibrations were needed (e.g., adjust `--dd-peek-overflow`, change a transition duration), make them in `next-app/app/globals.css` and commit:

```bash
git add app/globals.css
git commit -m "Calibrate DocuseriesDeck visuals from manual review"
```

---

## Task 8: Open PR, merge, deploy

Production build, deploy commit, push.

**Files:**
- Modify: `docs/` (regenerated by build)

- [ ] **Step 1: Final pre-deploy checks**

Run from `next-app/`:
```bash
npm run typecheck
npm run test
```
Expected: clean + all tests pass.

- [ ] **Step 2: Build for the custom domain**

Run from `next-app/`:
```bash
npm run build:prod
```
Expected: build succeeds. The postbuild script moves `next-app/out` → `<repo-root>/docs`.

- [ ] **Step 3: Confirm the new route content**

Run from repo root:
```bash
grep -c 'docuseries-deck' docs/work/united-by-play/index.html
```
Expected: at least 1.

- [ ] **Step 4: Push the branch**

Run from repo root:
```bash
git push -u origin docuseries-deck
```

- [ ] **Step 5: Open a PR**

Run from repo root:
```bash
gh pr create --title "Add docuseries deck slider on United by Play" --body-file - <<'EOF'
## Summary

Replaces the static three-up grid in the United by Play "The Docuseries" section with an interactive single-card-center carousel: drag, prev/next buttons, three dots, keyboard arrow keys, and a pure horizontal slide transition. Honors `prefers-reduced-motion`.

## What changed

- New client component `next-app/components/case-study/DocuseriesDeck.tsx` — handles state, drag, keyboard.
- New CSS block `/* === DOCUSERIES DECK === */` in `next-app/app/globals.css`. Old `.ubp-docu-grid` / `.ubp-docu-thumb` rules removed.
- `app/work/united-by-play/page.tsx` swaps the grid markup for `<DocuseriesDeck episodes={…}/>`.
- 10 new unit tests in `tests/case-study/DocuseriesDeck.test.tsx`. Drag is verified manually.

## Test plan

- [ ] `npm run typecheck` passes
- [ ] `npm run test` passes (76+ tests)
- [ ] `npm run build:prod` succeeds; `docs/work/united-by-play/index.html` references `.docuseries-deck`
- [ ] Manual: button/dot/keyboard navigation works
- [ ] Manual: drag past 25% threshold advances; short drag rubber-bands back
- [ ] Manual: click on active card opens YouTube; click on side peek advances (no YouTube)
- [ ] Manual: 375px-wide viewport collapses peek to ~8px slivers; drag still works
- [ ] Manual: `prefers-reduced-motion: reduce` drops transition to ~50ms

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
```

Capture the PR URL from the output.

- [ ] **Step 6: Merge the PR**

Run from repo root:
```bash
gh pr merge --merge --delete-branch
```

- [ ] **Step 7: Pull main and commit the deploy**

Run from repo root:
```bash
git checkout main
git pull origin main
git add docs/
git commit -m "deploy: rebuild docs — add DocuseriesDeck slider on UbP

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
git push origin main
```

If `git status` after `git pull` shows the working tree is clean (no docs/ changes), it's because the PR merge already included the deploy. In that case skip this step.

- [ ] **Step 8: Verify on the live site**

Wait 1–2 minutes for GitHub Pages to deploy, then run from any directory:
```bash
curl -s https://hatchnharvest.com/work/united-by-play/ | grep -c 'docuseries-deck'
```
Expected: at least 1.

Open `https://hatchnharvest.com/work/united-by-play/` in a browser, scroll to "The Docuseries", and confirm the slider works as expected end-to-end.

---

## Self-review notes (already applied)

- Spec coverage: every section/requirement of the design doc is covered by a task. Buttons + dots → Task 3. Keyboard → Task 4. Drag + reduced-motion → Task 5 + Task 2 CSS. Page integration + cleanup → Task 6. Verification → Task 7. Deploy → Task 8.
- No placeholders. Every code-changing step shows the literal code.
- Type names consistent throughout: `DocuseriesEpisode`, `episodes`, `activeIndex`, `dragOffsetPx`, `isDragging`, `advance(delta)`, `goToIndex(i)`. CSS class names consistent: `.docuseries-deck`, `.dd-stage`, `.dd-card`, `.dd-card-{prev,active,next}`, `.dd-prev`, `.dd-next`, `.dd-controls`, `.dd-title`, `.dd-dots`, `.dd-dot`, `.dd-play`.
- The `prefers-reduced-motion` media query is added in Task 2 (CSS block) and verified in Task 7 (manual). No separate task needed.
- `userEvent` is part of `@testing-library/user-event`. Task 3 calls out that it may need to be installed; if it's already a devDependency, skip the install step.
