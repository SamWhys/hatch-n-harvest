# Vertical Full-Bleed Case Layout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the homepage's sticky-stacked landscape case cards with full-bleed cinematic sections — one case per viewport, scroll-snapping, centered content, Ken Burns on viewport entry, title grows on hover.

**Architecture:** Modify `Work.tsx` in place on the experiment branch. Swap the `.case` markup tree for a new `.case-vertical` tree (subtitle, H3 title, one-liner, always-visible Explore CTA, optional Featured flag). Replace the scroll-driven `useKenBurnsStack` hook with `useKenBurnsOnEnter`, an `IntersectionObserver`-driven hook that toggles an `.is-ken-burns` class on each `<img>` (forcing reflow between remove/add so the CSS animation re-arms on each re-entry). Replace the `.case-stack` / `.case` CSS block in `globals.css` with the new `.case-stack-vertical` / `.case-vertical*` rules.

**Tech Stack:** Next.js 15.5 + React 19 client component, Vitest + Testing Library (jsdom), CSS in `next-app/app/globals.css`. Existing IntersectionObserver stub in `tests/setup.ts` is a no-op — Task 1 introduces a controllable per-test override.

**Related spec:** [2026-05-21-vertical-case-layout-design.md](./2026-05-21-vertical-case-layout-design.md)

**Branch:** `experiment/vertical-case-layout` (already created, spec already committed as `d1c2f4e`).

---

## File Map

- **Create:** `next-app/components/useKenBurnsOnEnter.ts` — IntersectionObserver-driven hook that adds/re-arms an `.is-ken-burns` class on each `.case-vertical` element it observes. Isolated in its own file for testability and to keep `Work.tsx` focused on markup.
- **Modify:** `next-app/components/Work.tsx` — remove `useKenBurnsStack`, import `useKenBurnsOnEnter`, swap the `.case` markup tree for the new `.case-vertical` tree. The parallax mnemonic + section heading stay.
- **Modify:** `next-app/app/globals.css` — replace the `.case-stack` / `.case-stack-tail` / `.case*` block (currently ~lines 640–855) with the new `.case-stack-vertical` / `.case-vertical*` rules including the `@keyframes case-vertical-ken-burns`, the mobile fallback, and the reduced-motion overrides.
- **Create:** `next-app/tests/use-ken-burns-on-enter.test.tsx` — unit tests for the new hook (class added on entry, re-armed on re-entry).
- **Create:** `next-app/tests/work-vertical.test.tsx` — component tests for the new `.case-vertical` markup (class names, structure, Featured flag).
- **No change:** `next-app/tests/setup.ts` — the existing no-op IO stub is left alone. The two new test files install a controllable per-test override and restore the original in `afterEach`.
- **No change:** `next-app/tests/smoke.test.tsx` — existing assertions (text content, hrefs, aria-labels, asset paths, mnemonic class) survive the markup change as designed. Verified in Task 5.

---

## Task 1: TDD — `useKenBurnsOnEnter` hook

**Files:**
- Create: `next-app/components/useKenBurnsOnEnter.ts`
- Create: `next-app/tests/use-ken-burns-on-enter.test.tsx`

- [ ] **Step 1: Write the failing tests**

Create `next-app/tests/use-ken-burns-on-enter.test.tsx`:

```tsx
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render } from "@testing-library/react";
import { useRef } from "react";
import { useKenBurnsOnEnter } from "@/components/useKenBurnsOnEnter";

/** Controllable IntersectionObserver mock. Stores the most recent callback so
 *  tests can drive intersection events synchronously. */
let lastIOCallback: IntersectionObserverCallback | null = null;
let lastIOInstance: { observe: ReturnType<typeof vi.fn>; unobserve: ReturnType<typeof vi.fn>; disconnect: ReturnType<typeof vi.fn> } | null = null;

class TestIO {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
  takeRecords = () => [];
  constructor(cb: IntersectionObserverCallback) {
    lastIOCallback = cb;
    lastIOInstance = this;
  }
}

const originalIO = globalThis.IntersectionObserver;

beforeEach(() => {
  lastIOCallback = null;
  lastIOInstance = null;
  // @ts-expect-error — installing test double
  globalThis.IntersectionObserver = TestIO;
  // @ts-expect-error
  window.IntersectionObserver = TestIO;
});

afterEach(() => {
  globalThis.IntersectionObserver = originalIO;
  // @ts-expect-error
  window.IntersectionObserver = originalIO;
});

function fire(target: Element, isIntersecting: boolean) {
  lastIOCallback?.(
    [
      {
        target,
        isIntersecting,
        intersectionRatio: isIntersecting ? 1 : 0,
        boundingClientRect: target.getBoundingClientRect(),
        intersectionRect: target.getBoundingClientRect(),
        rootBounds: null,
        time: 0,
      } as IntersectionObserverEntry,
    ],
    lastIOInstance as unknown as IntersectionObserver
  );
}

function Harness() {
  const ref = useRef<HTMLDivElement | null>(null);
  useKenBurnsOnEnter(ref);
  return (
    <div ref={ref}>
      <a className="case-vertical" data-testid="case-1">card 1</a>
      <a className="case-vertical" data-testid="case-2">card 2</a>
    </div>
  );
}

describe("useKenBurnsOnEnter", () => {
  it("observes every .case-vertical descendant of the root", () => {
    const { getByTestId } = render(<Harness />);
    expect(lastIOInstance?.observe).toHaveBeenCalledTimes(2);
    // The first argument of each call is the observed element.
    const observed = (lastIOInstance!.observe.mock.calls as [Element][]).map(
      ([el]) => el
    );
    expect(observed).toContain(getByTestId("case-1"));
    expect(observed).toContain(getByTestId("case-2"));
  });

  it("adds the is-ken-burns class when a section enters the viewport", () => {
    const { getByTestId } = render(<Harness />);
    const card = getByTestId("case-1");
    expect(card.classList.contains("is-ken-burns")).toBe(false);

    fire(card, true);

    expect(card.classList.contains("is-ken-burns")).toBe(true);
  });

  it("re-arms Ken Burns by removing then re-adding the class on re-entry", () => {
    const { getByTestId } = render(<Harness />);
    const card = getByTestId("case-1");

    fire(card, true);
    expect(card.classList.contains("is-ken-burns")).toBe(true);

    const removeSpy = vi.spyOn(card.classList, "remove");
    const addSpy = vi.spyOn(card.classList, "add");

    fire(card, true);

    // The hook removes is-ken-burns first, then re-adds it (with a forced
    // reflow in between, which we can't observe but which is required for
    // the CSS animation to restart).
    expect(removeSpy).toHaveBeenCalledWith("is-ken-burns");
    expect(addSpy).toHaveBeenCalledWith("is-ken-burns");
    expect(card.classList.contains("is-ken-burns")).toBe(true);
  });

  it("does nothing on exit (class stays so the next entry can toggle it)", () => {
    const { getByTestId } = render(<Harness />);
    const card = getByTestId("case-1");

    fire(card, true);
    const removeSpy = vi.spyOn(card.classList, "remove");
    fire(card, false);

    expect(removeSpy).not.toHaveBeenCalled();
  });

  it("disconnects the observer on unmount", () => {
    const { unmount } = render(<Harness />);
    const instance = lastIOInstance;
    unmount();
    expect(instance?.disconnect).toHaveBeenCalledTimes(1);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `cd next-app && npx vitest run tests/use-ken-burns-on-enter.test.tsx`
Expected: FAIL — `useKenBurnsOnEnter` is not exported yet (module not found).

- [ ] **Step 3: Implement the hook**

Create `next-app/components/useKenBurnsOnEnter.ts`:

```ts
"use client";

import { useEffect } from "react";

/** Adds and re-arms an `.is-ken-burns` class on every `.case-vertical`
 *  descendant of `rootRef` when it enters the viewport.
 *
 *  The class triggers a CSS `@keyframes` animation on the underlying `<img>`.
 *  To restart the animation on re-entry, we remove the class, force a
 *  reflow (`void el.offsetWidth`), then re-add it — the classic "restart
 *  CSS animation" trick.
 *
 *  Honours `prefers-reduced-motion: reduce` by bailing out entirely.
 */
export function useKenBurnsOnEnter(
  rootRef: React.RefObject<HTMLElement | null>
) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root || typeof window === "undefined") return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    const cards = root.querySelectorAll<HTMLElement>(".case-vertical");
    if (cards.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;
          el.classList.remove("is-ken-burns");
          // Force reflow so the next add() re-triggers the CSS animation.
          void el.offsetWidth;
          el.classList.add("is-ken-burns");
        }
      },
      { threshold: 0.5 }
    );

    for (const card of Array.from(cards)) observer.observe(card);

    return () => observer.disconnect();
  }, [rootRef]);
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `cd next-app && npx vitest run tests/use-ken-burns-on-enter.test.tsx`
Expected: PASS — all 5 tests green.

- [ ] **Step 5: Commit**

```bash
git add next-app/components/useKenBurnsOnEnter.ts next-app/tests/use-ken-burns-on-enter.test.tsx
git commit -m "feat(work): add useKenBurnsOnEnter hook (IO-driven, re-arming)"
```

---

## Task 2: TDD — Work component with `.case-vertical` markup

**Files:**
- Create: `next-app/tests/work-vertical.test.tsx`
- Modify: `next-app/components/Work.tsx` (full rewrite of the component body; preserve parallax mnemonic + section heading)

- [ ] **Step 1: Write the failing tests**

Create `next-app/tests/work-vertical.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Work } from "@/components/Work";

describe("Work — vertical full-bleed layout", () => {
  it("renders 4 .case-vertical sections inside .case-stack-vertical", () => {
    const { container } = render(<Work />);
    const deck = container.querySelector(".case-stack-vertical");
    expect(deck).not.toBeNull();
    const cards = deck!.querySelectorAll(".case-vertical");
    expect(cards.length).toBe(4);
  });

  it("each case uses the new BEM-style child class names", () => {
    const { container } = render(<Work />);
    const cards = container.querySelectorAll(".case-vertical");
    for (const card of Array.from(cards)) {
      expect(card.querySelector(".case-vertical__bg")).not.toBeNull();
      expect(card.querySelector(".case-vertical__content")).not.toBeNull();
      expect(card.querySelector(".case-vertical__sub")).not.toBeNull();
      expect(card.querySelector("h3.case-vertical__title")).not.toBeNull();
      expect(card.querySelector(".case-vertical__one-liner")).not.toBeNull();
      expect(card.querySelector(".case-vertical__cta")).not.toBeNull();
    }
  });

  it("the case title is an H3 element (not H2 or H1)", () => {
    const { container } = render(<Work />);
    const titles = container.querySelectorAll(".case-vertical .case-vertical__title");
    expect(titles.length).toBe(4);
    for (const t of Array.from(titles)) {
      expect(t.tagName).toBe("H3");
    }
  });

  it("the ColorPro card carries the Featured flag; no other card does", () => {
    const { container } = render(<Work />);
    const flags = container.querySelectorAll(".case-vertical__flag");
    expect(flags.length).toBe(1);
    const cpaLink = container.querySelector('a[href="work/colorpro-awards/"]');
    expect(cpaLink?.querySelector(".case-vertical__flag")).not.toBeNull();
  });

  it("each card is a single anchor link (full-bleed click target)", () => {
    const { container } = render(<Work />);
    const cards = container.querySelectorAll(".case-vertical");
    for (const card of Array.from(cards)) {
      expect(card.tagName).toBe("A");
      expect(card.getAttribute("href")).toMatch(/^work\/[a-z-]+\/$/);
    }
  });

  it("preserves the section heading and parallax mnemonic outside the deck", () => {
    const { container } = render(<Work />);
    expect(container.querySelector(".work-mnemonic.parallax-mnemonic")).not.toBeNull();
    expect(container.querySelector(".work-head")).not.toBeNull();
    // Section heading is the RisingHeading H2 — assert its text exists somewhere outside .case-stack-vertical.
    const head = container.querySelector(".work-head");
    expect(head?.textContent).toContain("Brands we");
    expect(head?.textContent).toContain("helped grow.");
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `cd next-app && npx vitest run tests/work-vertical.test.tsx`
Expected: FAIL — current `Work.tsx` uses `.case-stack` / `.case` class names; none of the new selectors match.

- [ ] **Step 3: Rewrite `next-app/components/Work.tsx`**

Replace the entire file with:

```tsx
"use client";

import { useRef } from "react";
import { useParallaxScroll } from "./useParallaxScroll";
import { useKenBurnsOnEnter } from "./useKenBurnsOnEnter";
import { RisingHeading } from "./case-study/RisingHeading";

function ArrowIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14M13 5l7 7-7 7" />
    </svg>
  );
}

type Case = {
  href: string;
  ariaLabel: string;
  img: string;
  alt: string;
  sub: string;
  title: string;
  oneLiner: string;
  featured?: boolean;
};

const CASES: Case[] = [
  {
    href: "work/colorpro-awards/",
    ariaLabel:
      "ColorPro Awards — ViewSonic global creator platform case study",
    img: "assets/work/colorpro-awards/kv-card.jpg",
    alt: "ColorPro Awards key visual — the 2025 FLOW campaign artwork.",
    sub: "Campaign · Identity · Live Events · Microsite · 2022–2026",
    title: "ColorPro Awards",
    oneLiner:
      "A global creative platform that turned ViewSonic's professional displays into the world's pro-creator stage.",
    featured: true,
  },
  {
    href: "work/acceleration-for-all/",
    ariaLabel: "Acceleration For All — ViewSonic × Hustle Fund case study",
    img: "assets/work/acceleration-for-all/kv-card.jpg",
    alt: "Acceleration For All key visual — a colourful grid of 30 founders' faces around the campaign lockup.",
    sub: "Campaign · Identity · Film · 2021",
    title: "Acceleration For All",
    oneLiner:
      "Rebuilding the on-ramp to entrepreneurship — for everyone the old playbook left out.",
  },
  {
    href: "work/united-by-play/",
    ariaLabel: "United by Play — ViewSonic global gaming campaign case study",
    img: "assets/work/united-by-play/title-no-matter-how-you-game.jpg",
    alt: "United by Play campaign title card — 'No matter how you game' on a colourful gaming background.",
    sub: "Campaign · Manifesto · Docuseries · 2021",
    title: "United by Play",
    oneLiner: "No matter how you game, we are united by play.",
  },
  {
    href: "work/meet-the-finchers/",
    ariaLabel:
      "Meet the Finchers — ViewSonic branded entertainment campaign case study",
    img: "assets/work/meet-the-finchers/finchers-lockup-1.jpg",
    alt: "Meet the Finchers — campaign logo lockup.",
    sub: "Campaign · Identity · Documentaries · Social · 2022",
    title: "Meet the Finchers",
    oneLiner:
      "A binge-worthy 90s sitcom — produced entirely on the brand's own remote-collaboration tech.",
  },
];

export function Work() {
  const mnemonicRef = useRef<HTMLImageElement>(null);
  const deckRef = useRef<HTMLDivElement>(null);
  useParallaxScroll(mnemonicRef, { intensity: 0.2 });
  useKenBurnsOnEnter(deckRef);

  return (
    <section className="work" id="work">
      <img
        ref={mnemonicRef}
        className="work-mnemonic parallax-mnemonic"
        src="assets/brand/mnemonic-4.svg"
        alt=""
        aria-hidden="true"
      />
      <div className="wrap">
        <div className="work-head">
          <div>
            <RisingHeading as="h2">
              Brands we&apos;ve helped grow.
            </RisingHeading>
          </div>
        </div>
      </div>

      <div className="case-stack-vertical" ref={deckRef}>
        {CASES.map((c) => (
          <a
            key={c.href}
            href={c.href}
            className="case-vertical"
            aria-label={c.ariaLabel}
          >
            <img
              className="case-vertical__bg"
              src={c.img}
              alt={c.alt}
              loading="lazy"
            />
            {c.featured && (
              <span className="case-vertical__flag">Featured</span>
            )}
            <div className="case-vertical__content">
              <div className="case-vertical__sub">{c.sub}</div>
              <h3 className="case-vertical__title">{c.title}</h3>
              <p className="case-vertical__one-liner">{c.oneLiner}</p>
              <span className="case-vertical__cta">
                Explore
                <ArrowIcon />
              </span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Run new + existing tests to verify they pass**

Run: `cd next-app && npx vitest run tests/work-vertical.test.tsx tests/smoke.test.tsx`
Expected: PASS — new work-vertical tests are green; existing smoke tests still green (they assert text content, hrefs, and aria-labels, all preserved).

- [ ] **Step 5: Commit**

```bash
git add next-app/components/Work.tsx next-app/tests/work-vertical.test.tsx
git commit -m "feat(work): swap Work markup to .case-vertical structure with H3 titles"
```

---

## Task 3: Replace `.case-stack` / `.case` CSS with `.case-stack-vertical` / `.case-vertical*`

**Files:**
- Modify: `next-app/app/globals.css` (replace the block currently spanning roughly lines 640–855)

- [ ] **Step 1: Locate the existing block**

Run: `cd next-app && grep -n "case-stack\|\.case\b\| \.case " app/globals.css | head -40`
Expected output: matches starting near `.case-stack {` (~line 640) and ending around the reduced-motion `@media` block (~line 855). The exact bounds are: from the line beginning `    .case-stack {` through (and including) the closing `}` of the `@media (prefers-reduced-motion: reduce)` block that overrides `.case`.

Open the file and confirm visually before deleting:

```bash
cd next-app && sed -n '638,858p' app/globals.css | head -3
```

(`sed` here is just to eyeball the start. Use the Read tool in practice.)

- [ ] **Step 2: Delete the old block**

Remove every rule whose selector starts with `.case-stack`, `.case-stack-tail`, or `.case` (including `.case`, `.case img`, `.case:hover`, `.case .overlay`, `.case .overlay::before`, `.case .top-row`, `.case .sub`, `.case .title`, `.case .one-liner`, `.case .flag`, `.case .read-cta`, `.case:hover .read-cta`, `.case:focus-visible .read-cta`, `.case .read-cta:hover`, `.case .read-cta svg`, `.case.is-locked` and its variants, `.case.is-locked .case-locked-cta`, `.case.is-locked .case-locked-cta svg`, the mobile `@media (max-width: 800px) { .case-stack ... .case ... }` block, and the `@media (prefers-reduced-motion: reduce) { .case ... }` block).

Do **not** delete: the `.case-locked-cta` styles inside the locked-cta block are folded into the new rules in Step 3 — but the locked CTA itself is positioned absolutely by its existing CSS *only when* it's outside the new content flow. Since today no homepage card uses `.is-locked`, leaving the legacy `.case.is-locked .case-locked-cta` rule deleted is fine; the new rules in Step 3 add a forward-looking reset for when a future locked card slots in.

Leave the surrounding sections untouched. The next section in the file (PROCESS / HOW WE GROW BRANDS, currently starting at ~line 857) becomes the new neighbour of the new block.

- [ ] **Step 3: Insert the new block in the same location**

Paste this entire block in the gap left by Step 2:

```css
    /* ============================================================
       VERTICAL FULL-BLEED CASE LAYOUT
       — replaces the old sticky-stacked .case-stack / .case rules.
       Each .case-vertical is one full viewport; the deck scroll-snaps
       between them; useKenBurnsOnEnter (components/useKenBurnsOnEnter.ts)
       drives the entrance zoom by toggling .is-ken-burns on the <a>.
       ============================================================ */
    .case-stack-vertical {
      position: relative;
      scroll-snap-type: y mandatory;
    }

    .case-vertical {
      display: block;
      position: relative;
      width: 100vw;
      height: 100vh;
      margin-left: calc(50% - 50vw);  /* break out of any parent padding */
      overflow: hidden;
      color: var(--ink);
      text-decoration: none;
      isolation: isolate;

      scroll-snap-align: start;
      scroll-snap-stop: always;
      scroll-margin-top: 104px;       /* land below the sticky nav */
    }

    .case-vertical__bg {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      transform-origin: center;
      transform: scale(1.0);
      transition: filter 0.4s ease;
      will-change: transform;
    }
    .case-vertical.is-ken-burns .case-vertical__bg {
      animation: case-vertical-ken-burns 6s cubic-bezier(.2,.7,.2,1) forwards;
    }
    @keyframes case-vertical-ken-burns {
      from { transform: scale(1.06); }
      to   { transform: scale(1.0); }
    }
    .case-vertical:hover .case-vertical__bg,
    .case-vertical:focus-visible .case-vertical__bg {
      filter: brightness(0.72);
    }

    /* Top + bottom gradient so the centered text reads on any image. */
    .case-vertical::after {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(
        to bottom,
        rgba(0, 0, 0, 0.45) 0%,
        rgba(0, 0, 0, 0)   30%,
        rgba(0, 0, 0, 0)   65%,
        rgba(0, 0, 0, 0.55) 100%
      );
      pointer-events: none;
      z-index: 1;
    }

    .case-vertical__content {
      position: absolute;
      inset: 104px 0 0 0;             /* clear the sticky nav */
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
      text-shadow: 0 1px 12px rgba(0, 0, 0, 0.5);
      margin-bottom: 18px;
    }

    .case-vertical__title {
      font-family: var(--font-display);
      font-weight: 900;
      font-variation-settings: "opsz" 144;
      font-size: clamp(26px, 3vw, 40px);   /* H3 scale */
      line-height: 1;
      letter-spacing: -0.02em;
      color: var(--ink);
      text-shadow: 0 2px 24px rgba(0, 0, 0, 0.5);
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
      text-shadow: 0 1px 12px rgba(0, 0, 0, 0.6);
      margin: 0 0 28px;
    }

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

    /* Locked variant — forward-looking; no homepage card uses .is-locked today.
       When one does, render the existing .case-locked-cta inside
       .case-vertical__content (in place of .case-vertical__cta) and the reset
       below lets it inherit centering from the flex parent. */
    .case-vertical.is-locked { cursor: default; }
    .case-vertical.is-locked .case-vertical__bg {
      filter: saturate(0.65) brightness(0.78);
    }
    .case-vertical.is-locked:hover .case-vertical__bg,
    .case-vertical.is-locked:focus-visible .case-vertical__bg {
      filter: saturate(0.65) brightness(0.78);
    }
    .case-vertical.is-locked:hover .case-vertical__title,
    .case-vertical.is-locked:focus-visible .case-vertical__title {
      font-size: clamp(26px, 3vw, 40px);
      letter-spacing: -0.02em;
    }
    .case-vertical.is-locked .case-vertical__title,
    .case-vertical.is-locked .case-vertical__one-liner { opacity: 0.7; }
    .case-vertical__content .case-locked-cta {
      position: static;
      transform: none;
      top: auto;
      left: auto;
    }

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

    @media (prefers-reduced-motion: reduce) {
      .case-stack-vertical { scroll-snap-type: none; }
      .case-vertical { scroll-snap-align: none; }
      .case-vertical.is-ken-burns .case-vertical__bg { animation: none; }
      .case-vertical:hover .case-vertical__title,
      .case-vertical:focus-visible .case-vertical__title {
        font-size: clamp(26px, 3vw, 40px);
        letter-spacing: -0.02em;
      }
    }
```

- [ ] **Step 4: Run the full test suite to verify nothing regressed**

Run: `cd next-app && npm run test`
Expected: PASS — all previously-passing tests stay green. (CSS isn't loaded in vitest, so this only catches markup/component regressions — the visual check happens in Task 4.)

- [ ] **Step 5: Typecheck**

Run: `cd next-app && npm run typecheck`
Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add next-app/app/globals.css
git commit -m "feat(work): swap .case-stack CSS for full-bleed .case-vertical layout"
```

---

## Task 4: Local build + manual visual verification

**Files:**
- None modified.

- [ ] **Step 1: Production-style build (local, not for deploy)**

Run: `cd next-app && npm run build`
Expected: build succeeds, no warnings about missing classes or unused selectors. (Per memory, this `build` produces a `basePath: "/hatch-n-harvest"` bundle — fine for local verification. Do **not** commit any rebuilt `docs/` from this; the deploy step would use `npm run build:prod` if/when we ship.)

- [ ] **Step 2: Eyeball the dev server**

Run (in a separate terminal): `cd next-app && npm run dev`
Then open `http://localhost:3000` and verify:

1. The Work section now shows full-bleed cards, one per viewport.
2. Scroll between them snaps to the next section's top, with the sticky nav remaining visible.
3. ColorPro Awards is the first card and shows the "Featured" pill in the top-right.
4. The title appears at H3 size (smaller than the Hero H1, smaller than the "Brands we've helped grow." H2).
5. Hovering anywhere on a card grows the title and dims the background image.
6. Hovering the Explore pill fills it marigold.
7. On the first scroll past, each card image plays the slow Ken Burns zoom-out; scrolling away and back replays it.
8. Resize to ≤800px wide — sections collapse to a natural-stack at 4:5 aspect, no snap, no Ken Burns.
9. In Chrome DevTools, toggle "prefers-reduced-motion: reduce" → Ken Burns and snap both disabled; layout still legible.

- [ ] **Step 3: Stop the dev server**

Ctrl-C in the dev terminal.

- [ ] **Step 4: No commit (verification only)**

Confirm no unintended files staged: `git status`. Expected: clean tree.

---

## Task 5: Final test sweep + branch summary

**Files:**
- None modified.

- [ ] **Step 1: Run the full suite end-to-end**

Run: `cd next-app && npm run test && npm run typecheck`
Expected: all tests pass, no type errors.

- [ ] **Step 2: Confirm the branch state**

Run: `git log --oneline main..HEAD`
Expected output: 4 commits on top of `main` —
1. `spec: vertical full-bleed case layout (experiment)`
2. `feat(work): add useKenBurnsOnEnter hook (IO-driven, re-arming)`
3. `feat(work): swap Work markup to .case-vertical structure with H3 titles`
4. `feat(work): swap .case-stack CSS for full-bleed .case-vertical layout`

Run: `git status`
Expected: clean working tree on branch `experiment/vertical-case-layout`.

- [ ] **Step 3: Report**

Summarize to the user:
- Branch: `experiment/vertical-case-layout`
- Files changed: `next-app/components/Work.tsx`, `next-app/components/useKenBurnsOnEnter.ts` (new), `next-app/app/globals.css`, `next-app/tests/work-vertical.test.tsx` (new), `next-app/tests/use-ken-burns-on-enter.test.tsx` (new), `specs/2026-05-21-vertical-case-layout-design.md` (already committed), `specs/2026-05-21-vertical-case-layout-plan.md` (already committed).
- Tests: full suite green.
- Build: clean local build verified.
- Next decision: keep iterating on this branch, merge to `main`, or discard.

No commit in this task.
