# UbP Scroll Reveal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add two scroll-triggered entrance animations to the United by Play case study — the docuseries deck slides up + fades in as a single unit when it scrolls into view, and the 11 solution-section asset cells fade in with a 90ms stagger in a specified order.

**Architecture:** A new `useScrollReveal` hook adds the `is-revealed` class to its target element on first viewport entry (one-shot via IntersectionObserver, then disconnects). The `DocuseriesDeck` component calls the hook on its root section. A new tiny `UbpAssetReveal` client component wraps the existing solution asset grid so the rest of the UbP page stays a server component. Each `.ubp-cell` carries an inline `--reveal-index` CSS variable that drives a per-cell `transition-delay`. CSS lives in a new `/* === SCROLL REVEAL === */` block in `globals.css`. `prefers-reduced-motion: reduce` collapses both animations to instant.

**Tech Stack:** React 19 client components (`"use client"`), TypeScript, plain CSS in `app/globals.css`, IntersectionObserver. No new dependencies.

**Source design:** [`specs/2026-05-10-ubp-scroll-reveal-design.md`](./2026-05-10-ubp-scroll-reveal-design.md)

**Branch:** Create a new feature branch `ubp-scroll-reveal` off `main`.

**Working directory for npm commands:** `next-app/` — `cd next-app/` once at the start of each task.

---

## Conventions used in this plan

- All paths are relative to the repo root unless explicitly under `next-app/`.
- Each task ends with a single `git commit` covering the files it touched.
- Tests go in `next-app/tests/case-study/`.
- The codebase's `tests/setup.ts` already stubs `IntersectionObserver` as a no-op class (it has `observe`, `unobserve`, `disconnect`, `takeRecords` methods that do nothing). The `useScrollReveal` test installs its own controllable mock at the top of the test file (saving the global, replacing it for the duration of the test, restoring it after) — it does NOT modify `tests/setup.ts`.
- Existing test count baseline (before this plan): 78 tests across 11 files. Subsequent counts in this plan reference that baseline.

---

## Task 1: Branch and `useScrollReveal` hook

Create the feature branch, then add the hook with full unit-test coverage.

**Files:**
- Create: `next-app/components/case-study/useScrollReveal.ts`
- Create: `next-app/tests/case-study/useScrollReveal.test.tsx`

- [ ] **Step 1: Create the branch from main**

Run from repo root:
```bash
git checkout main
git pull origin main
git checkout -b ubp-scroll-reveal
```

- [ ] **Step 2: Write the failing tests**

Create `next-app/tests/case-study/useScrollReveal.test.tsx`:

```tsx
import { afterEach, beforeEach, describe, it, expect, vi } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { useRef } from "react";
import { useScrollReveal } from "@/components/case-study/useScrollReveal";

type ObserverInstance = {
  observe: ReturnType<typeof vi.fn>;
  unobserve: ReturnType<typeof vi.fn>;
  disconnect: ReturnType<typeof vi.fn>;
  takeRecords: ReturnType<typeof vi.fn>;
  trigger: (entries: Array<{ target: Element; isIntersecting: boolean }>) => void;
};

let lastInstance: ObserverInstance | null = null;
let originalIO: typeof IntersectionObserver | undefined;

beforeEach(() => {
  originalIO = (globalThis as unknown as { IntersectionObserver?: typeof IntersectionObserver }).IntersectionObserver;
  class MockObserver {
    callback: IntersectionObserverCallback;
    observe = vi.fn();
    unobserve = vi.fn();
    disconnect = vi.fn();
    takeRecords = vi.fn(() => []);
    constructor(cb: IntersectionObserverCallback) {
      this.callback = cb;
      lastInstance = {
        observe: this.observe,
        unobserve: this.unobserve,
        disconnect: this.disconnect,
        takeRecords: this.takeRecords,
        trigger: (entries) => {
          this.callback(entries as unknown as IntersectionObserverEntry[], this as unknown as IntersectionObserver);
        },
      };
    }
  }
  Object.defineProperty(globalThis, "IntersectionObserver", {
    writable: true,
    configurable: true,
    value: MockObserver,
  });
  Object.defineProperty(window, "IntersectionObserver", {
    writable: true,
    configurable: true,
    value: MockObserver,
  });
});

afterEach(() => {
  cleanup();
  if (originalIO) {
    Object.defineProperty(globalThis, "IntersectionObserver", {
      writable: true,
      configurable: true,
      value: originalIO,
    });
    Object.defineProperty(window, "IntersectionObserver", {
      writable: true,
      configurable: true,
      value: originalIO,
    });
  }
  lastInstance = null;
});

function Probe() {
  const ref = useRef<HTMLDivElement | null>(null);
  useScrollReveal(ref);
  return <div ref={ref} data-testid="probe" />;
}

describe("useScrollReveal", () => {
  it("does not add is-revealed before any intersection", () => {
    const { getByTestId } = render(<Probe />);
    const el = getByTestId("probe");
    expect(el.classList.contains("is-revealed")).toBe(false);
    expect(lastInstance?.observe).toHaveBeenCalledOnce();
  });

  it("adds is-revealed when the target intersects", () => {
    const { getByTestId } = render(<Probe />);
    const el = getByTestId("probe");
    lastInstance!.trigger([{ target: el, isIntersecting: true }]);
    expect(el.classList.contains("is-revealed")).toBe(true);
  });

  it("disconnects the observer after the first intersection", () => {
    const { getByTestId } = render(<Probe />);
    const el = getByTestId("probe");
    lastInstance!.trigger([{ target: el, isIntersecting: true }]);
    expect(lastInstance!.disconnect).toHaveBeenCalledOnce();
  });

  it("does not add is-revealed when intersection entry is false", () => {
    const { getByTestId } = render(<Probe />);
    const el = getByTestId("probe");
    lastInstance!.trigger([{ target: el, isIntersecting: false }]);
    expect(el.classList.contains("is-revealed")).toBe(false);
    expect(lastInstance!.disconnect).not.toHaveBeenCalled();
  });

  it("disconnects on unmount even if it never intersected", () => {
    const { unmount } = render(<Probe />);
    const disconnect = lastInstance!.disconnect;
    unmount();
    expect(disconnect).toHaveBeenCalled();
  });
});
```

- [ ] **Step 3: Run the tests to verify they fail**

Run from `next-app/`:
```bash
npm run test -- useScrollReveal
```
Expected: FAIL — module does not exist.

- [ ] **Step 4: Implement the hook**

Create `next-app/components/case-study/useScrollReveal.ts`:

```ts
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

- [ ] **Step 5: Run tests to verify they pass**

Run from `next-app/`:
```bash
npm run test -- useScrollReveal
```
Expected: 5/5 passing.

- [ ] **Step 6: Run the full suite**

Run from `next-app/`:
```bash
npm run test
```
Expected: 83 passing (78 prior + 5 new).

- [ ] **Step 7: Run typecheck**

Run from `next-app/`:
```bash
npm run typecheck
```
Expected: clean.

- [ ] **Step 8: Commit**

```bash
git add components/case-study/useScrollReveal.ts tests/case-study/useScrollReveal.test.tsx
git commit -m "Add useScrollReveal hook (one-shot intersection-triggered class toggle)"
```

---

## Task 2: Apply `useScrollReveal` to `DocuseriesDeck`

Wire the hook into the deck component on its root `<section>` ref. No CSS yet — that's Task 4.

**Files:**
- Modify: `next-app/components/case-study/DocuseriesDeck.tsx`

- [ ] **Step 1: Add the hook call**

Open `next-app/components/case-study/DocuseriesDeck.tsx`. At the top of the imports, add:

```ts
import { useScrollReveal } from "./useScrollReveal";
```

Update the existing `import { useState, useCallback, useRef, type PointerEvent as ReactPointerEvent } from "react";` line — it's already there, no change needed. Just add the new import below it.

Inside the `DocuseriesDeck` function body, near the other refs (around the `stageRef` declaration), add a new section ref:

```tsx
const sectionRef = useRef<HTMLElement | null>(null);
useScrollReveal(sectionRef);
```

Then attach the ref to the root `<section>` element. Find the existing JSX:

```tsx
    <section
      className="docuseries-deck"
      aria-roledescription="carousel"
      aria-label="Docuseries episodes"
      onKeyDown={(e) => {
```

Add `ref={sectionRef}` to it:

```tsx
    <section
      ref={sectionRef}
      className="docuseries-deck"
      aria-roledescription="carousel"
      aria-label="Docuseries episodes"
      onKeyDown={(e) => {
```

- [ ] **Step 2: Run tests to confirm no regression**

Run from `next-app/`:
```bash
npm run test
```
Expected: 83 passing. The deck's existing 10 tests + the homepage suite + the UbP suite all pass — the global IntersectionObserver stub from `tests/setup.ts` never fires its callback, so the deck stays in its un-revealed DOM state during tests, but tests query DOM presence (not opacity), so they're unaffected.

- [ ] **Step 3: Run typecheck**

Run from `next-app/`:
```bash
npm run typecheck
```
Expected: clean.

- [ ] **Step 4: Commit**

```bash
git add components/case-study/DocuseriesDeck.tsx
git commit -m "Wire useScrollReveal into DocuseriesDeck root section"
```

---

## Task 3: Add `UbpAssetReveal` wrapper component and integrate into UbP page

Create the thin client component that wraps the asset grid, owning its ref and the hook call. Integrate it into the existing UbP page (which stays a server component) and add the `--reveal-index` inline style to each cell in the configured order.

**Files:**
- Create: `next-app/components/case-study/UbpAssetReveal.tsx`
- Modify: `next-app/app/work/united-by-play/page.tsx`
- Modify: `next-app/tests/case-study/united-by-play.test.tsx`

- [ ] **Step 1: Create the wrapper component**

Create `next-app/components/case-study/UbpAssetReveal.tsx`:

```tsx
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

- [ ] **Step 2: Add a failing test for the wrapper integration**

Open `next-app/tests/case-study/united-by-play.test.tsx`. Inside the existing `describe("United by Play page", …)` block, add this `it` block at the end (just before the closing `});` of the describe):

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
    // Hero shot at index 0.
    const hero = wrap?.querySelector(".ubp-hero-shot") as HTMLElement | null;
    expect(hero?.style.getPropertyValue("--reveal-index")).toBe("0");
    // Title card at index 10 (last).
    const title = wrap?.querySelector(".ubp-title") as HTMLElement | null;
    expect(title?.style.getPropertyValue("--reveal-index")).toBe("10");
  });
```

- [ ] **Step 3: Run the test to verify it fails**

Run from `next-app/`:
```bash
npm run test -- united-by-play
```
Expected: FAIL — `.ubp-reveal-target` not found.

- [ ] **Step 4: Update the UbP page**

Open `next-app/app/work/united-by-play/page.tsx`. Add this import to the top of the file alongside the other `@/components/case-study/...` imports:

```tsx
import { UbpAssetReveal } from "@/components/case-study/UbpAssetReveal";
```

Find the existing `<div className="ubp-asset-wrap">` opening tag and the matching closing `</div>`. Replace the WRAPPER (NOT the inner `.ubp-asset-grid`) with `<UbpAssetReveal>…</UbpAssetReveal>`. Concretely:

Locate:

```tsx
                <div className="ubp-asset-wrap">
                    <div className="ubp-asset-grid">
                        ...
                    </div>
                </div>
```

Change the OPENING `<div className="ubp-asset-wrap">` to `<UbpAssetReveal>` and the matching CLOSING `</div>` (the outer one — the one that pairs with `ubp-asset-wrap`) to `</UbpAssetReveal>`:

```tsx
                <UbpAssetReveal>
                    <div className="ubp-asset-grid">
                        ...
                    </div>
                </UbpAssetReveal>
```

- [ ] **Step 5: Add `--reveal-index` to each `.ubp-cell` in the configured order**

Inside the `<div className="ubp-asset-grid">` block of the UbP page, every `<figure className="ubp-cell ...">` element gets an inline `style={{ "--reveal-index": N } as React.CSSProperties}` attribute. The order is:

| index | cell class |
|---|---|
| 0 | `ubp-hero-shot` |
| 1 | `ubp-chinese-lady` |
| 2 | `ubp-cop` |
| 3 | `ubp-award` |
| 4 | `ubp-fashion` |
| 5 | `ubp-troll` |
| 6 | `ubp-man` |
| 7 | `ubp-waitress` |
| 8 | `ubp-kid` |
| 9 | `ubp-whiskey` |
| 10 | `ubp-title` |

For each `<figure className="ubp-cell ubp-X">`, add `style={{ "--reveal-index": N } as React.CSSProperties}`. Example for the first one:

```tsx
<figure className="ubp-cell ubp-hero-shot" style={{ "--reveal-index": 0 } as React.CSSProperties}>
  <img src="../../assets/work/united-by-play/gaming-hero-shot.jpg" alt="Gaming hero shot — United by Play campaign key visual." loading="lazy" />
</figure>
```

The `as React.CSSProperties` cast is required because TypeScript's `CSSProperties` doesn't include CSS custom properties (`--*`). The codebase already uses this pattern; for example, the `CaseStudyShell.tsx` test does `as React.CSSProperties` on `brandVars`. The cast is purely a TypeScript concession.

Apply the cast and `--reveal-index` value to ALL 11 figures. Don't miss any. The award figure carries the `<video>` not an `<img>` — same pattern, the inline style is on the figure regardless.

- [ ] **Step 6: Run the test to verify it passes**

Run from `next-app/`:
```bash
npm run test -- united-by-play
```
Expected: PASS — all 11 cells have indices, award at 3, hero at 0, title at 10.

- [ ] **Step 7: Run the full suite**

Run from `next-app/`:
```bash
npm run test
```
Expected: 84 passing (83 prior + 1 new).

- [ ] **Step 8: Run typecheck**

Run from `next-app/`:
```bash
npm run typecheck
```
Expected: clean.

- [ ] **Step 9: Commit**

```bash
git add components/case-study/UbpAssetReveal.tsx app/work/united-by-play/page.tsx tests/case-study/united-by-play.test.tsx
git commit -m "Add UbpAssetReveal wrapper and per-cell --reveal-index for stagger"
```

---

## Task 4: Add the SCROLL REVEAL CSS block

Append the deck-entrance, asset-grid stagger, and reduced-motion rules to `globals.css`.

**Files:**
- Modify: `next-app/app/globals.css` (append at end of file)

- [ ] **Step 1: Append the CSS block**

Add this block at the END of `next-app/app/globals.css`, matching the file's 4-space indentation:

```css

    /* ============================================================
       SCROLL REVEAL
       Two scroll-triggered entrance animations on the United by Play
       case study, both driven by the useScrollReveal hook adding
       `is-revealed` to the target element on first viewport entry.

       1. The DocuseriesDeck slides up + fades in as a single unit.
       2. Each .ubp-cell inside .ubp-reveal-target staggers its fade-in
          based on its own --reveal-index custom property.
       ============================================================ */

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

    @media (prefers-reduced-motion: reduce) {
      .docuseries-deck,
      .ubp-reveal-target .ubp-cell {
        transition-duration: 0ms !important;
        transition-delay: 0ms !important;
      }
    }
```

The block must be appended at the very end of the file (after the existing `DOCUSERIES DECK` block). Verify by reading the last 30 lines before and after — the new block should be the last content.

- [ ] **Step 2: Run typecheck and tests**

Run from `next-app/`:
```bash
npm run typecheck && npm run test
```
Expected: clean + 84 passing.

- [ ] **Step 3: Confirm production build still succeeds**

Run from `next-app/`:
```bash
npm run build:prod
```
Expected: build succeeds. Don't commit `docs/` — that's deferred to Task 6.

- [ ] **Step 4: Commit**

```bash
git add app/globals.css
git commit -m "Add SCROLL REVEAL CSS for deck entrance + asset grid stagger"
```

---

## Task 5: Manual browser verification

Visual + interaction check before deploy. No code changes.

**Files:**
- None.

- [ ] **Step 1: Start the dev server**

Run from `next-app/`:
```bash
npm run dev
```

- [ ] **Step 2: Open the page and verify the deck entrance**

Navigate to `http://localhost:3000/hatch-n-harvest/work/united-by-play/` (a fresh browser tab — no scroll position carried over from a previous visit).

The page loads at the top. Scroll down slowly past the hero, problem, and solution sections. As the docuseries deck (titled "The Docuseries") starts to enter the viewport, watch:
- The deck section starts at `opacity: 0` and ~28px below its resting position.
- As it crosses ~10% into the viewport from the bottom, the `is-revealed` class is added.
- The deck slides up + fades in over ~700ms with a cubic-bezier ease.
- The deck's per-card transition (450ms) is unaffected — clicking next/prev still snaps the active card with the existing animation.

Reload the page (`Cmd-R` / `Ctrl-R`) and scroll FAST past the deck, then scroll back up. The deck should NOT animate again — it stays in its revealed state because the observer disconnected after first entry.

- [ ] **Step 3: Verify the asset grid stagger**

Reload the page. Scroll down to the solution section ("The Solution") which contains the asset grid. Watch:
- Cells are initially invisible (opacity 0, translated down 20px).
- As the wrapper enters the viewport, cards start appearing in order:
  - 0: gaming-hero-shot (the wide banner)
  - 1: chinese-lady (with teapot, "I WOULD LIKE TO GO PROFESSIONAL")
  - 2: cop ("GOOD FOR STRESS, CALMS ME DOWN")
  - 3: award (the trophy logo / video) — confirms the user's reorder request
  - 4: fashion-designer ("CLOTHES, HAIR, AND BROKEN SPIRITS")
  - 5: troll-investors ("1000 TIMES AND COME BACK TO LIFE")
  - 6: man ("I WANT TO BE A ROCKSTAR")
  - 7: waitress ("I LOVE A GOOD BOSS FIGHT")
  - 8: kid ("I CAN BE THE MASTER OF THE UNIVERSE")
  - 9: whiskey-guy ("IT'S ALL ABOUT MY SIDE QUESTS")
  - 10: title-card ("NO MATTER WHY YOU GAME")
- Each card delayed ~90ms behind the previous; total reveal sweep ~1.6s end-to-end.

Reload and scroll quickly past the grid, then back up. Cards stay revealed; no re-animation.

- [ ] **Step 4: Verify reduced-motion**

In Chrome DevTools → Rendering panel → "Emulate CSS prefers-reduced-motion" → set to "reduce". Reload the page and scroll. Both the deck and asset cards should appear in their final position essentially instantly (50ms or less per the existing `prefers-reduced-motion` rule from earlier deck CSS — and 0ms for the new transitions). Drag and click on the deck still work (their per-card transitions also drop to ~50ms from earlier reduced-motion rules).

Reset the emulation to "no preference" before stopping the dev server.

- [ ] **Step 5: Stop the dev server**

Press Ctrl+C in the terminal running `npm run dev`.

- [ ] **Step 6: If any visual issue surfaced, calibrate**

If something looks off (e.g. stagger feels too slow, deck slides too far, etc.), adjust the relevant value in `globals.css`'s SCROLL REVEAL block:

- Stagger delay: `90ms` in `transition-delay: calc(var(--reveal-index, 0) * 90ms);`
- Card transition: `600ms` in `.ubp-reveal-target .ubp-cell`
- Deck transition: `700ms` in `.docuseries-deck`
- Deck offset: `28px` in `transform: translateY(28px);`
- Trigger threshold: `0.05` and `rootMargin: "0px 0px -10% 0px"` in `useScrollReveal.ts` (this last one requires editing the hook, not CSS)

If you adjust anything, commit:

```bash
git add app/globals.css
git commit -m "Calibrate scroll-reveal timing from manual review"
```

If no calibration was needed, no commit for this task.

---

## Task 6: Open PR, merge, deploy

Production build, deploy commit, push, PR, merge.

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

- [ ] **Step 3: Confirm the new content is in the build**

Run from repo root:
```bash
grep -c 'ubp-reveal-target' docs/work/united-by-play/index.html
```
Expected: at least 1.

- [ ] **Step 4: Commit the deploy**

Run from repo root:
```bash
git add docs/
git commit -m "deploy: rebuild docs — UbP scroll reveal animations

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

- [ ] **Step 5: Push the branch**

Run from repo root:
```bash
git push -u origin ubp-scroll-reveal
```

- [ ] **Step 6: Open a PR**

Run from repo root:
```bash
cat > /tmp/pr-body-reveal.md <<'EOF'
## Summary

Adds two scroll-triggered entrance animations to the United by Play case study:

1. The docuseries deck slides up (~28px) and fades in as a single unit when it first scrolls into view.
2. The 11 cells of the solution-section asset grid fade in with a 90ms stagger in a configured order, with the award video brought to position 4 per the brief.

Both fire once via a new `useScrollReveal` hook (IntersectionObserver, disconnects after first intersection) and honor `prefers-reduced-motion: reduce`.

## What changed

- New hook `next-app/components/case-study/useScrollReveal.ts` with 5 unit tests.
- New thin client component `UbpAssetReveal.tsx` wraps the asset grid so the rest of the UbP page stays a server component.
- `DocuseriesDeck.tsx` calls the hook on its root section.
- 11 `.ubp-cell` figures on the UbP page carry `--reveal-index` inline styles in the configured order.
- New `/* === SCROLL REVEAL === */` CSS block in `globals.css`.

## Test plan

- [x] `npm run typecheck` passes
- [x] `npm run test` passes (84 tests)
- [x] `npm run build:prod` succeeds; `docs/work/united-by-play/index.html` references `.ubp-reveal-target`
- [x] Manual: deck slides up + fades in on first viewport entry; per-card transitions still work after
- [x] Manual: asset cells stagger in order; award appears 4th
- [x] Manual: scroll back up after first reveal — no re-animation
- [x] Manual: `prefers-reduced-motion: reduce` collapses both to instant
- [ ] Live: verify on https://hatchnharvest.com/work/united-by-play/ once Pages deploys

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
gh pr create --title "Add scroll-triggered entrance animations on United by Play" --body-file /tmp/pr-body-reveal.md
rm -f /tmp/pr-body-reveal.md
```

Capture the PR URL from output.

- [ ] **Step 7: Merge the PR**

Run from repo root:
```bash
gh pr merge --merge --delete-branch
```

- [ ] **Step 8: Sync local main**

Run from repo root:
```bash
git checkout main
git pull origin main
```

- [ ] **Step 9: Verify on the live site**

Wait 1–2 minutes for GitHub Pages to deploy, then run from any directory:
```bash
curl -s https://hatchnharvest.com/work/united-by-play/ | grep -c 'ubp-reveal-target'
```
Expected: at least 1.

Open `https://hatchnharvest.com/work/united-by-play/` in a fresh tab, scroll down, and confirm both animations work end-to-end on the live site.

---

## Self-review notes (already applied)

- Spec coverage: Task 1 covers the hook + tests. Task 2 wires the hook into the deck. Task 3 creates the wrapper component, integrates it on the UbP page, and adds `--reveal-index` to each cell. Task 4 adds all CSS (deck entrance, asset grid stagger, reduced-motion). Task 5 verifies manually. Task 6 deploys.
- No placeholders. Every code-changing step shows the literal code.
- Type names consistent: `useScrollReveal`, `UbpAssetReveal`, `--reveal-index`, `is-revealed`, `ubp-reveal-target`. All match the design.
- The IntersectionObserver test mock is self-contained per test file (does not modify the global stub in `tests/setup.ts`).
- The `as React.CSSProperties` cast pattern for `--reveal-index` matches an existing precedent in the codebase (`CaseStudyShell` `brandVars`).
- Step 3 of Task 4 ("Confirm production build still succeeds") includes `npm run build:prod` to catch CSS issues that wouldn't surface in tests, but the rebuilt `docs/` is intentionally NOT committed yet — the deploy commit happens in Task 6 against the final state.
