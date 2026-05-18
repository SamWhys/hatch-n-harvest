# Case-study Cascade Reveal + ColorPro Filmstrip Parity — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Generalize UBP's scroll-reveal mechanism so every case-study Solution / asset-grid section can opt in, then apply it across all four case studies. Also realign ColorPro's two filmstrips to match UBP's docuseries formatting (nested inside `.wrap`, with `FadeInP` body and the existing filmstrip entrance animation).

**Architecture:** Replace the existing `UbpAssetReveal` component with a generic `ScrollRevealGroup` that adds a generic `scroll-reveal-group` class. Generalize the cascade CSS from `.ubp-reveal-target .ubp-cell` to `.scroll-reveal-group [style*="--reveal-index"]`, so any descendant with an inline `--reveal-index` participates. Apply across UBP (rename only, no visual change), ColorPro, AfA, and MtF.

**Tech Stack:** Next.js 15 (App Router), React 19, TypeScript, vanilla CSS, Vitest. No new dependencies.

**Spec reference:** [`specs/2026-05-18-case-study-cascade-reveal-design.md`](2026-05-18-case-study-cascade-reveal-design.md).

---

## File Structure

**Creating:**
- `next-app/components/case-study/ScrollRevealGroup.tsx` — the generic wrapper

**Deleting:**
- `next-app/components/case-study/UbpAssetReveal.tsx` — superseded by ScrollRevealGroup

**Modifying:**
- `next-app/app/globals.css` — swap `.ubp-reveal-target .ubp-cell` rules for `.scroll-reveal-group [style*="--reveal-index"]`; add `.cpa-section-lead`
- `next-app/app/work/united-by-play/page.tsx` — import + tag rename only
- `next-app/app/work/colorpro-awards/page.tsx` — wrap `.cpa-asset-grid` with `ScrollRevealGroup`, add `--reveal-index` to 10 tiles, relocate two filmstrips inside `.wrap`, convert body paragraphs to `FadeInP`
- `next-app/app/work/acceleration-for-all/page.tsx` — wrap 7 visual blocks with `ScrollRevealGroup`, add `--reveal-index` to each child figure
- `next-app/app/work/meet-the-finchers/page.tsx` — wrap the `.mtf-asset-grid-section`'s `.wrap` contents with `ScrollRevealGroup`, add `--reveal-index` to 6 cells

**Tests not added.** The existing `next-app/tests/smoke.test.tsx` already verifies each page imports + renders without crashing. Scroll-reveal mechanics (IntersectionObserver-driven class toggles + CSS transitions) are not meaningfully unit-testable; verification is via the dev-server browser sweep in Task 5.

---

## Task 1: Generic `ScrollRevealGroup` + UBP migration

**Goal:** Create the generic wrapper, migrate the CSS to use a generic selector, update UBP to use the new wrapper. UBP should render identically to today after this task.

**Files:**
- Create: `next-app/components/case-study/ScrollRevealGroup.tsx`
- Delete: `next-app/components/case-study/UbpAssetReveal.tsx`
- Modify: `next-app/app/globals.css` (lines ~2270-2312)
- Modify: `next-app/app/work/united-by-play/page.tsx` (import line + 2 tag occurrences)

- [ ] **Step 1: Create `ScrollRevealGroup.tsx`**

Create `next-app/components/case-study/ScrollRevealGroup.tsx` with this content:

```tsx
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

- [ ] **Step 2: Update the CSS in `globals.css`**

In `next-app/app/globals.css`, find the existing block under the comment `/* ============================================================ SCROLL REVEAL …`. The block today reads (lines ~2293-2312):

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

    @media (prefers-reduced-motion: reduce) {
      .docuseries-deck,
      .ubp-reveal-target .ubp-cell {
        transition-duration: 0ms !important;
        transition-delay: 0ms !important;
      }
    }
```

Replace those three rules with the generic equivalents (keep the docuseries-deck rule unchanged in the same `@media` block):

```css
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
      .docuseries-deck,
      .scroll-reveal-group [style*="--reveal-index"] {
        transition-duration: 0ms !important;
        transition-delay: 0ms !important;
      }
    }
```

The comment block above this section (`/* ============================================================ SCROLL REVEAL ... */`) still applies; you can optionally update its inline description of "Each .ubp-cell inside .ubp-reveal-target" to "Each descendant with --reveal-index inside .scroll-reveal-group", but that's a cosmetic doc edit and not required.

- [ ] **Step 3: Update UBP's import and JSX**

In `next-app/app/work/united-by-play/page.tsx`:

Find the import line (around line 7):
```tsx
import { UbpAssetReveal } from "@/components/case-study/UbpAssetReveal";
```
Replace it with:
```tsx
import { ScrollRevealGroup } from "@/components/case-study/ScrollRevealGroup";
```

Then find the opening tag (around line 62):
```tsx
                <UbpAssetReveal>
```
Replace it with:
```tsx
                <ScrollRevealGroup className="ubp-asset-wrap">
```

Then find the matching closing tag (around line 129):
```tsx
                </UbpAssetReveal>
```
Replace it with:
```tsx
                </ScrollRevealGroup>
```

(There should be exactly one opening and one closing pair in this file. Run `grep -n UbpAssetReveal next-app/app/work/united-by-play/page.tsx` after the edit — it should return nothing.)

- [ ] **Step 4: Delete `UbpAssetReveal.tsx`**

```bash
rm /Users/perniskiesa/Desktop/claude_code/hatch-n-harvest/next-app/components/case-study/UbpAssetReveal.tsx
```

Sanity-check that nothing else imports it:

```bash
grep -r "UbpAssetReveal" /Users/perniskiesa/Desktop/claude_code/hatch-n-harvest/next-app/ 2>/dev/null
```

Expected: no matches.

- [ ] **Step 5: Run smoke tests**

```bash
cd /Users/perniskiesa/Desktop/claude_code/hatch-n-harvest/next-app
npx vitest run tests/smoke.test.tsx
```

Expected: all 16 tests pass. The UBP page test (`renders the work section with all four active case studies` + the per-page page render tests) all still match because UBP's content is unchanged.

- [ ] **Step 6: Typecheck**

```bash
npx tsc --noEmit
```

Expected: no output, no errors.

- [ ] **Step 7: Visual smoke check (manual, brief)**

Start the dev server in the background:
```bash
npm run dev
```

In a browser, open `http://localhost:3000/work/united-by-play/` and scroll through. The asset grid (portrait cells) should still cascade-fade-in as it enters the viewport — same as before this task. If it doesn't fade in, something in the CSS migration is wrong. Stop and inspect.

Stop the dev server (`Ctrl+C`).

- [ ] **Step 8: Commit**

```bash
cd /Users/perniskiesa/Desktop/claude_code/hatch-n-harvest
git add next-app/components/case-study/ScrollRevealGroup.tsx \
        next-app/app/globals.css \
        next-app/app/work/united-by-play/page.tsx
git rm next-app/components/case-study/UbpAssetReveal.tsx
git commit -m "Work: extract generic ScrollRevealGroup; migrate UBP onto it"
```

---

## Task 2: ColorPro — Solution cascade + filmstrip parity

**Goal:** Wrap CPA's `.cpa-asset-grid` with `ScrollRevealGroup` and tag each tile with a `--reveal-index`. Relocate both filmstrips inside their parent `.wrap`. Convert intro paragraphs to `FadeInP`. Add a shared lead-paragraph style.

**Files:**
- Modify: `next-app/app/work/colorpro-awards/page.tsx`
- Modify: `next-app/app/globals.css` (add `.cpa-section-lead`)

- [ ] **Step 1: Add `ScrollRevealGroup` and `FadeInP` imports**

In `next-app/app/work/colorpro-awards/page.tsx`, after the existing `DocuseriesFilmstrip` import, add:

```tsx
import { FadeInP } from "@/components/case-study/FadeInP";
import { ScrollRevealGroup } from "@/components/case-study/ScrollRevealGroup";
```

Make sure `import type React from "react";` exists at the top of the file (other case studies have it for the `--reveal-index` CSS-custom-property cast). If not present, add:

```tsx
import type React from "react";
```

Verify by running:
```bash
grep -n "import type React" next-app/app/work/colorpro-awards/page.tsx
```

- [ ] **Step 2: Replace the `.cpa-asset-grid` `<div>` with `<ScrollRevealGroup>`**

In `next-app/app/work/colorpro-awards/page.tsx`, find:

```tsx
                    {/* Asset grid */}
                    <div className="cpa-asset-grid">
```

Replace with:

```tsx
                    {/* Asset grid */}
                    <ScrollRevealGroup className="cpa-asset-grid">
```

Find the matching closing `</div>` for this grid (it sits just before `</section>` of the Solution section, after the right column's closing `</div>`). Replace that `</div>` with `</ScrollRevealGroup>`.

Sanity-check: there should be exactly one `<ScrollRevealGroup className="cpa-asset-grid">` and one matching closing tag in this file.

- [ ] **Step 3: Tag the 10 asset-grid figures with `--reveal-index`**

In reading order (top to bottom, left column then right column), add an inline `style` to each figure / video tile in the `.cpa-asset-grid`. The exact lines to change:

**Left column (wider, top to bottom):**

1. `<figure className="cpa-tile cpa-tile-wide">` (prize-outline) — add `style={{ "--reveal-index": 0 } as React.CSSProperties}`
2. `<div className="cpa-tile cpa-tile-video">` (FLOW teaser) — add `style={{ "--reveal-index": 1 } as React.CSSProperties}`
3. The next `<div className="cpa-tile-row">` contains:
   - `<figure className="cpa-tile">` (lucky-draw img) — `--reveal-index: 2`
   - `<figure className="cpa-tile">` (exhibition-ig video) — `--reveal-index: 3`
4. The next `<div className="cpa-tile-row cpa-tile-row-tall">` contains:
   - `<figure className="cpa-tile">` (advocates-cover video) — `--reveal-index: 4`
   - `<figure className="cpa-tile">` (categories img) — `--reveal-index: 5`

**Right column (narrower, top to bottom):**

5. `<figure className="cpa-tile">` (kv-2023 img) — `--reveal-index: 6`
6. `<figure className="cpa-tile">` (thumbnail-vertical img) — `--reveal-index: 7`
7. `<figure className="cpa-tile">` (bumper-photography video) — `--reveal-index: 8`
8. `<figure className="cpa-tile">` (judge-jeremy img) — `--reveal-index: 9`

For each, the style attribute looks like:
```tsx
style={{ "--reveal-index": 0 } as React.CSSProperties}
```

(Substitute the correct index per the list above.)

Important: the inner `<div className="cpa-tile-row">` and `<div className="cpa-tile-row cpa-tile-row-tall">` wrapper divs do NOT get a `--reveal-index` — only the actual figures and the video tile inside them. The `.scroll-reveal-group [style*="--reveal-index"]` selector picks them up by descendant.

After all 10 edits, verify count:
```bash
grep -c '"--reveal-index"' next-app/app/work/colorpro-awards/page.tsx
```
Expected: `10`.

- [ ] **Step 4: Relocate the Live Events filmstrip inside `.wrap`**

In `next-app/app/work/colorpro-awards/page.tsx`, find the Live Events section. Today it looks structurally like:

```tsx
            <section className="cpa-live-events">
                <div className="wrap">
                    <RisingHeading as="h2">The Live Events</RisingHeading>
                    <p className="cpa-live-events-body">To turn the awards into something audiences could touch...</p>

                    <div className="cpa-live-events-anchors">
                        ...two figures...
                    </div>
                </div>

                <DocuseriesFilmstrip
                    episodes={[...]}
                />
            </section>
```

Make two changes:

1. Replace the `<p className="cpa-live-events-body">…</p>` with `<FadeInP className="cpa-section-lead">…</FadeInP>` (keeping the exact body text inside).
2. Move the entire `<DocuseriesFilmstrip episodes={[…]} />` block (5 episodes) so it sits INSIDE `<div className="wrap">` — specifically, just before the closing `</div>` of the wrap (and therefore before the closing `</section>`).

The resulting structure should read:

```tsx
            <section className="cpa-live-events">
                <div className="wrap">
                    <RisingHeading as="h2">The Live Events</RisingHeading>
                    <FadeInP className="cpa-section-lead">To turn the awards into something audiences could touch...</FadeInP>

                    <div className="cpa-live-events-anchors">
                        ...two figures...
                    </div>

                    <DocuseriesFilmstrip
                        episodes={[...]}
                    />
                </div>
            </section>
```

The 5-episode array stays byte-for-byte the same; only its position changes.

- [ ] **Step 5: Relocate the Results filmstrip inside `.wrap` and convert paragraphs to `FadeInP`**

In the same file, find the Results section. Today it looks like:

```tsx
            <section className="cpa-results">
                <div className="wrap">
                    <RisingHeading as="h2">The Results</RisingHeading>
                    <div className="cpa-results-body">
                        <p>The ColorPro Awards evolved into a global ecosystem...</p>
                        <p>The campaign generated thousands of submissions...</p>
                        <p>At the same time, the platform increased visibility...</p>
                        <p>By integrating online engagement with offline experiences...</p>
                    </div>
                </div>

                <DocuseriesFilmstrip episodes={[...]} />
            </section>
```

Make two changes:

1. Convert each of the four `<p>…</p>` paragraphs inside `<div className="cpa-results-body">` to `<FadeInP>…</FadeInP>` (no className prop — the wrapper div carries the styling).
2. Move the `<DocuseriesFilmstrip episodes={[…]} />` (3 episodes) so it sits INSIDE `<div className="wrap">`, just before the closing `</div>` of the wrap.

The resulting structure should read:

```tsx
            <section className="cpa-results">
                <div className="wrap">
                    <RisingHeading as="h2">The Results</RisingHeading>
                    <div className="cpa-results-body">
                        <FadeInP>The ColorPro Awards evolved into a global ecosystem...</FadeInP>
                        <FadeInP>The campaign generated thousands of submissions...</FadeInP>
                        <FadeInP>At the same time, the platform increased visibility...</FadeInP>
                        <FadeInP>By integrating online engagement with offline experiences...</FadeInP>
                    </div>

                    <DocuseriesFilmstrip episodes={[...]} />
                </div>
            </section>
```

The 3-episode array stays byte-for-byte the same.

- [ ] **Step 6: Add the `.cpa-section-lead` CSS rule**

In `next-app/app/globals.css`, find the ColorPro Awards block (look for the section comment `ColorPro Awards (case study)` near the bottom of the file). Inside the brand-color scoping rules, add this new rule (place it after the `.cpa-page .cpa-solution p` rule and before the `.cpa-solution` padding rule):

```css
.cpa-page .cpa-section-lead {
  font-size: clamp(16px, 1.2vw, 20px);
  line-height: 1.55;
  color: var(--cpa-mute);
  max-width: 70ch;
  margin: 0 0 clamp(32px, 4vw, 56px);
}
```

(This mirrors `.ubp-docu-lead` from globals.css line ~2067 but uses the ColorPro mute color.)

- [ ] **Step 7: Smoke tests**

```bash
cd /Users/perniskiesa/Desktop/claude_code/hatch-n-harvest/next-app
npx vitest run tests/smoke.test.tsx
```

Expected: all 16 tests pass.

- [ ] **Step 8: Typecheck**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 9: Visual sanity check**

```bash
npm run dev
```

Open `http://localhost:3000/work/colorpro-awards/`. Scroll to the Solution section — tiles should cascade-fade-in (top to bottom, left column first, then right column). Scroll to Live Events — the heading appears, the lead paragraph fades in, the anchor row appears, and the filmstrip should now be constrained to the `.wrap` max-width with the arrows hugging the card edges (not the viewport edges). Same for Results — body paragraphs fade in, filmstrip is constrained. Stop the dev server.

- [ ] **Step 10: Commit**

```bash
cd /Users/perniskiesa/Desktop/claude_code/hatch-n-harvest
git add next-app/app/work/colorpro-awards/page.tsx next-app/app/globals.css
git commit -m "Work: ColorPro Solution cascade reveal + filmstrip parity with UBP"
```

---

## Task 3: AfA — per-block local cascades

**Goal:** Wrap each visual block in the AfA Solution work-section with its own `<ScrollRevealGroup>` and tag the inner figures with local `--reveal-index` values. Seven groups total. No CSS changes needed in this task.

**Files:**
- Modify: `next-app/app/work/acceleration-for-all/page.tsx`

The seven blocks to wrap (by existing className):

1. `.lockup-variants` (2 figures)
2. `.hero-stage` (1 figure)
3. `.mnemonic-grid` (6 figures)
4. `.apparel-grid` (3 figures)
5. `.social-stack` (4 figures + nested rows — see below)
6. `.gallery-five` (5 figures)
7. `.results-top5` (1 figure)

- [ ] **Step 1: Ensure imports are present**

In `next-app/app/work/acceleration-for-all/page.tsx`, verify these imports exist near the top:

```tsx
import type React from "react";
import { ScrollRevealGroup } from "@/components/case-study/ScrollRevealGroup";
```

If either is missing, add it. Run:
```bash
grep -nE "import type React|ScrollRevealGroup" next-app/app/work/acceleration-for-all/page.tsx
```
Expected: both lines appear.

- [ ] **Step 2: Wrap `.lockup-variants` (2 figures)**

Find the `<div className="lockup-variants">` block. Replace the opening `<div className="lockup-variants">` with `<ScrollRevealGroup className="lockup-variants">` and the matching closing `</div>` with `</ScrollRevealGroup>`.

Add `style={{ "--reveal-index": 0 } as React.CSSProperties}` to the FIRST `<figure>` inside (the `.variant-card.is-positive` figure).

Add `style={{ "--reveal-index": 1 } as React.CSSProperties}` to the SECOND `<figure>` (the `.variant-card.is-negative` figure).

- [ ] **Step 3: Wrap `.hero-stage` (1 figure)**

Find `<div className="hero-stage">`. Replace with `<ScrollRevealGroup className="hero-stage">` / matching `</ScrollRevealGroup>`.

Add `style={{ "--reveal-index": 0 } as React.CSSProperties}` to the single `<figure className="block-full identity-kv">` inside.

- [ ] **Step 4: Wrap `.mnemonic-grid` (6 figures)**

Find `<div className="mnemonic-grid">`. Replace with `<ScrollRevealGroup className="mnemonic-grid">` / matching `</ScrollRevealGroup>`.

There are 6 children to tag, in DOM order. The current file structure has:

1. First `<figure>` (mnemonic-3.svg) — `--reveal-index: 0`
2. Second `<figure>` (mnemonic-2.svg) — `--reveal-index: 1`
3. Third `<figure>` (mnemonic-4.svg) — `--reveal-index: 2`
4. Fourth `<figure className="is-half">` (mnemonic-1.svg) — `--reveal-index: 3`
5. Fifth `<figure className="is-half">` (mnemonic-5.svg) — `--reveal-index: 4`
6. Sixth `<figure className="is-wide palette-strip" …>` (palette swatches) — `--reveal-index: 5`

Add `style={{ "--reveal-index": N } as React.CSSProperties}` to each, using the index above. Where a figure already has another attribute (like `aria-label` on the palette-strip), keep the existing attributes intact and add the style attribute alongside.

- [ ] **Step 5: Wrap `.apparel-grid` (3 figures)**

Find `<div className="apparel-grid">`. Replace with `<ScrollRevealGroup className="apparel-grid">` / `</ScrollRevealGroup>`.

Tag the three `<figure>` children with `--reveal-index: 0`, `1`, `2` in DOM order (coral, navy, black t-shirts respectively).

- [ ] **Step 6: Wrap `.social-stack` (10 figures across nested rows)**

Find `<div className="social-stack">`. Replace with `<ScrollRevealGroup className="social-stack">` / matching `</ScrollRevealGroup>`.

The social-stack contains nested wrapper divs (`.social-row-2`, `.social-row-6`, plus direct-child `.social-card.is-wide` figures). Tag every `<figure>` descendant — there are 10 in DOM order:

1. Top wide card (RSVP) — `--reveal-index: 0`
2. Inside `.social-row-2`: first square card (Eric Bahn) — `--reveal-index: 1`
3. Inside `.social-row-2`: second square card (pitch-us-now.gif) — `--reveal-index: 2`
4. Inside `.social-row-6`: first small card (inside-scoop) — `--reveal-index: 3`
5. Inside `.social-row-6`: second small card (close in 4 days) — `--reveal-index: 4`
6. Inside `.social-row-6`: third small card (Top 100) — `--reveal-index: 5`
7. Inside `.social-row-6`: fourth small card (Top 20) — `--reveal-index: 6`
8. Inside `.social-row-6`: fifth small card (AFA Top 20) — `--reveal-index: 7`
9. Inside `.social-row-6`: sixth small card (People's Choice) — `--reveal-index: 8`
10. Bottom wide card (one more sleep) — `--reveal-index: 9`

Wrapper divs (`.social-row-2`, `.social-row-6`) do NOT get a `--reveal-index` — only their figure children.

- [ ] **Step 7: Wrap `.gallery-five` (5 figures)**

Find `<div className="gallery-five">`. Replace with `<ScrollRevealGroup className="gallery-five">` / `</ScrollRevealGroup>`.

Tag the 5 finalist `<figure>` children with `--reveal-index: 0` through `4` in DOM order (Before Noon, Co.Lab, Mi Terror, ROBOAMP, TeleCalm).

- [ ] **Step 8: Wrap `.results-top5` (1 figure)**

Find `<figure className="results-top5">`. This is itself a `<figure>` (not a wrapping `<div>`). Wrap it externally with `<ScrollRevealGroup className="results-top5-wrap">…</ScrollRevealGroup>` and add `style={{ "--reveal-index": 0 } as React.CSSProperties}` to the `<figure className="results-top5">` itself.

(The `.results-top5-wrap` class has no CSS rules — it's just for component identity. The figure's own existing `.results-top5` class keeps its layout rules.)

- [ ] **Step 9: Smoke tests**

```bash
cd /Users/perniskiesa/Desktop/claude_code/hatch-n-harvest/next-app
npx vitest run tests/smoke.test.tsx
```

Expected: all 16 tests pass.

- [ ] **Step 10: Typecheck**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 11: Visual sanity check**

```bash
npm run dev
```

Open `http://localhost:3000/work/acceleration-for-all/`. Scroll slowly from top to bottom. Each named block (lockup-variants, mnemonic-grid, apparel-grid, social-stack, gallery-five, etc.) should cascade-fade-in as it enters view. The single-item blocks (hero-stage, results-top5) should fade in as a single tile. Stop the dev server.

- [ ] **Step 12: Commit**

```bash
cd /Users/perniskiesa/Desktop/claude_code/hatch-n-harvest
git add next-app/app/work/acceleration-for-all/page.tsx
git commit -m "Work: AfA per-block cascade reveal on Solution visual blocks"
```

---

## Task 4: MtF — asset-grid cascade

**Goal:** Wrap the `.mtf-asset-grid-section`'s `.wrap` contents with a single `ScrollRevealGroup` and tag the 6 cells with `--reveal-index` in reading order.

**Files:**
- Modify: `next-app/app/work/meet-the-finchers/page.tsx`

- [ ] **Step 1: Ensure imports are present**

In `next-app/app/work/meet-the-finchers/page.tsx`, verify these imports exist near the top:

```tsx
import type React from "react";
import { ScrollRevealGroup } from "@/components/case-study/ScrollRevealGroup";
```

If missing, add them.

- [ ] **Step 2: Wrap the `.wrap` contents of `.mtf-asset-grid-section`**

In the file, find the asset grid section:

```tsx
            <section className="mtf-asset-grid-section">
                <div className="wrap">
                    <div className="mtf-asset-grid">
                        <div className="mtf-asset-grid-left">
                            <figure className="mtf-cell mtf-bts">
                                ...
                            </figure>
                            <figure className="mtf-cell mtf-jakob">
                                ...
                            </figure>
                        </div>
                        <div className="mtf-asset-grid-right">
                            <figure className="mtf-cell mtf-gif">
                                ...
                            </figure>
                            <figure className="mtf-cell mtf-lockup">
                                ...
                            </figure>
                            <figure className="mtf-cell mtf-karate">
                                ...
                            </figure>
                        </div>
                    </div>
                    <figure className="mtf-cell mtf-linkedin">
                        ...
                    </figure>
                </div>
            </section>
```

Wrap the contents of `<div className="wrap">` (everything between `<div className="wrap">` and `</div>` that closes it) inside `<ScrollRevealGroup className="mtf-asset-grid-reveal">` / `</ScrollRevealGroup>`. The result reads:

```tsx
            <section className="mtf-asset-grid-section">
                <div className="wrap">
                    <ScrollRevealGroup className="mtf-asset-grid-reveal">
                        <div className="mtf-asset-grid">
                            ...
                        </div>
                        <figure className="mtf-cell mtf-linkedin">
                            ...
                        </figure>
                    </ScrollRevealGroup>
                </div>
            </section>
```

The `.mtf-asset-grid` div and its inner column wrappers stay exactly as-is — they handle the grid layout, which is separate from the reveal mechanism.

- [ ] **Step 3: Tag the 6 cells with `--reveal-index`**

In reading order:

1. `<figure className="mtf-cell mtf-bts">` — `--reveal-index: 0`
2. `<figure className="mtf-cell mtf-jakob">` — `--reveal-index: 1`
3. `<figure className="mtf-cell mtf-gif">` — `--reveal-index: 2`
4. `<figure className="mtf-cell mtf-lockup">` — `--reveal-index: 3`
5. `<figure className="mtf-cell mtf-karate">` — `--reveal-index: 4`
6. `<figure className="mtf-cell mtf-linkedin">` — `--reveal-index: 5`

For each, add `style={{ "--reveal-index": N } as React.CSSProperties}` (where N is the index above).

Note: do NOT tag the `<figure className="mtf-cell mtf-ooh">` in the separate `.mtf-ooh-section` — that's a different section, out of scope.

Verify count:
```bash
grep -c '"--reveal-index"' next-app/app/work/meet-the-finchers/page.tsx
```
Expected: `6`.

- [ ] **Step 4: Smoke tests**

```bash
cd /Users/perniskiesa/Desktop/claude_code/hatch-n-harvest/next-app
npx vitest run tests/smoke.test.tsx
```

Expected: all 16 tests pass.

- [ ] **Step 5: Typecheck**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 6: Visual sanity check**

```bash
npm run dev
```

Open `http://localhost:3000/work/meet-the-finchers/`. Scroll to the asset grid (after the Solution heading). The 6 cells (5 in the grid + 1 LinkedIn below) should cascade-fade-in as the section enters view. Stop the dev server.

- [ ] **Step 7: Commit**

```bash
cd /Users/perniskiesa/Desktop/claude_code/hatch-n-harvest
git add next-app/app/work/meet-the-finchers/page.tsx
git commit -m "Work: MtF asset-grid cascade reveal"
```

---

## Task 5: Final verification + production build

**Goal:** Run the full verification gates across the implementation and walk through each of the four case-study pages in the browser to confirm the behavior. No code changes unless a regression is found.

**Files:** none modified (verification only — code fixes get a separate commit if needed)

- [ ] **Step 1: Full smoke suite**

```bash
cd /Users/perniskiesa/Desktop/claude_code/hatch-n-harvest/next-app
npx vitest run
```

Expected: 16/16 pass.

- [ ] **Step 2: Typecheck**

```bash
npx tsc --noEmit
```

Expected: clean exit, no output.

- [ ] **Step 3: Local production build (NOT `build:prod`)**

```bash
npm run build
```

Expected: clean build, all 8 static pages generated (home + 4 case studies + 404 + 404/ + _not-found), no errors.

**Important:** This is `npm run build`, **not** `npm run build:prod`. The latter is only for deploy commits where `docs/` gets regenerated for the live site. This task is not a deploy commit — when the user is ready to ship, they'll run `build:prod` and commit `docs/` separately.

- [ ] **Step 4: Restore `docs/` to its committed state (cleanup after local build)**

The local build's postbuild step regenerates `docs/` using the GitHub-Pages basePath (`/hatch-n-harvest/...`), which is wrong for the custom-domain deploy. Restore it:

```bash
cd /Users/perniskiesa/Desktop/claude_code/hatch-n-harvest
git checkout -- docs/
git clean -fd docs/
```

Verify nothing related to `docs/` is dirty:
```bash
git status --short | grep -E "^.M docs|^.. docs|^\?\? docs" || echo "clean"
```
Expected: `clean`.

- [ ] **Step 5: Browser sweep — UBP regression check**

```bash
cd /Users/perniskiesa/Desktop/claude_code/hatch-n-harvest/next-app
npm run dev
```

Open `http://localhost:3000/work/united-by-play/` and confirm:

- The asset grid cascade-fades-in as it scrolls into view (same as before this work)
- The docuseries filmstrip below appears with its existing entrance animation
- Nothing else has visibly regressed

- [ ] **Step 6: Browser sweep — ColorPro**

Open `http://localhost:3000/work/colorpro-awards/` and confirm:

- The Solution asset grid (10 tiles) cascade-fades-in
- The Live Events lead paragraph fades in (`FadeInP`)
- The Live Events filmstrip is constrained inside the wrap (max ~1280px), with the arrow buttons sitting just inside the card edges (NOT at the viewport edges)
- The Results body paragraphs each fade in independently
- The Results filmstrip is also constrained inside the wrap

- [ ] **Step 7: Browser sweep — AfA**

Open `http://localhost:3000/work/acceleration-for-all/` and confirm each of the 7 visual blocks cascade-fades-in as it enters view: lockup-variants, hero-stage, mnemonic-grid, apparel-grid, social-stack, gallery-five, results-top5.

- [ ] **Step 8: Browser sweep — MtF**

Open `http://localhost:3000/work/meet-the-finchers/` and confirm the asset grid section's 6 cells cascade-fade-in.

Stop the dev server (`Ctrl+C`).

- [ ] **Step 9: Recap**

The four-page implementation is done and locally verified. The deploy step (regenerating `docs/` with `build:prod` and committing) is outside this plan — it happens when the user is ready to ship.

---

## Out of scope (intentionally not addressed in this plan)

- Running `npm run build:prod` and committing `docs/` — that's a separate deploy commit the user controls.
- Reveal animations on Problem / hero / lead-paragraph sections beyond `RisingHeading` / `FadeInP` (already exist).
- The single-figure `.mtf-ooh-section` banner — explicitly excluded from MtF scope per the design.
- Adjusting the timing of the cascade (`90ms` per index, `600ms` per cell duration). Current values match UBP and feel right.
