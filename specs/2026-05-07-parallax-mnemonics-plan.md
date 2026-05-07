# Parallax Mnemonics Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add ambient float + scroll-coupled parallax to four brand mnemonics (Work, Process, Contact left, Contact right) so they bob and drift on scroll while respecting accessibility and mobile constraints.

**Architecture:** Pure CSS handles the ambient float via `@property`-declared custom properties animated through `@keyframes`. A single React hook (`useParallaxScroll`) drives one shared `requestAnimationFrame` loop that updates a `--scroll-y` custom property on each registered element based on viewport-center distance. Element transforms compose scroll, base rotation, and float translates without conflict. Reduced motion and ≤1024px / coarse-pointer viewports short-circuit the hook and zero the float keyframes.

**Tech Stack:** Next.js 15 (App Router), React 19, TypeScript, Vitest + React Testing Library, vanilla CSS in `globals.css`.

**Source spec:** `specs/2026-05-07-parallax-mnemonics-design.md`

---

## File Structure

| File | Responsibility |
| ---- | -------------- |
| `next-app/components/useParallaxScroll.ts` (new) | Hook + module-level shared rAF/IntersectionObserver/registry |
| `next-app/app/globals.css` (modify) | `@property` decls, four `@keyframes`, `.parallax-mnemonic` utility, reduced-motion suppression, rewrite per-element transforms on `.work-mnemonic`, `.process .process-mnemonic`, `.contact-decor.left`, `.contact-decor.right` |
| `next-app/components/Work.tsx` (modify) | `"use client"`, ref, hook call, class on `<img>` |
| `next-app/components/Process.tsx` (modify) | same |
| `next-app/components/Contact.tsx` (modify) | `"use client"`, two refs, two hook calls, class on both `<img>`s |
| `next-app/tests/smoke.test.tsx` (modify) | Add four assertions that each parallax mnemonic carries `.parallax-mnemonic` |
| `next-app/tests/useParallaxScroll.test.tsx` (new) | Smoke test that hook mounts/unmounts cleanly |

---

## Task 1: CSS foundation — `@property`, keyframes, `.parallax-mnemonic`, reduced-motion suppression

**Files:**
- Modify: `next-app/app/globals.css` (append a new section before the FOOTER block at line ~1066)

- [ ] **Step 1: Append the parallax CSS block**

Open `next-app/app/globals.css` and locate the `/* CONTACT */` block ending around line 1075 (the `@media (max-width: 700px) { .contact-decor { display: none; } }` rule). Immediately after that closing `}`, before the `/* FOOTER */` comment, insert:

```css
    /* ============================================================
       PARALLAX — ambient float + scroll-coupled drift for brand mnemonics
       ============================================================ */
    @property --float-x { syntax: '<length>'; inherits: false; initial-value: 0px; }
    @property --float-y { syntax: '<length>'; inherits: false; initial-value: 0px; }
    @property --float-r { syntax: '<angle>';  inherits: false; initial-value: 0deg; }
    @property --scroll-y { syntax: '<length>'; inherits: false; initial-value: 0px; }

    .parallax-mnemonic {
      will-change: transform;
      transform-origin: center;
    }

    @keyframes mnemonic-float-a {
      0%   { --float-x: 0px;   --float-y: 0px;   --float-r: 0deg; }
      50%  { --float-x: 12px;  --float-y: -28px; --float-r: 3deg; }
      100% { --float-x: 0px;   --float-y: 0px;   --float-r: 0deg; }
    }
    @keyframes mnemonic-float-b {
      0%   { --float-x: 0px;   --float-y: 0px;   --float-r: 0deg; }
      50%  { --float-x: -10px; --float-y: -36px; --float-r: -4deg; }
      100% { --float-x: 0px;   --float-y: 0px;   --float-r: 0deg; }
    }
    @keyframes mnemonic-float-c {
      0%   { --float-x: 0px;   --float-y: 0px;   --float-r: 0deg; }
      50%  { --float-x: 14px;  --float-y: -22px; --float-r: 5deg; }
      100% { --float-x: 0px;   --float-y: 0px;   --float-r: 0deg; }
    }
    @keyframes mnemonic-float-d {
      0%   { --float-x: 0px;   --float-y: 0px;   --float-r: 0deg; }
      50%  { --float-x: -8px;  --float-y: -32px; --float-r: -3deg; }
      100% { --float-x: 0px;   --float-y: 0px;   --float-r: 0deg; }
    }

    @media (prefers-reduced-motion: reduce) {
      .parallax-mnemonic {
        animation: none !important;
        --float-x: 0px;
        --float-y: 0px;
        --float-r: 0deg;
        --scroll-y: 0px;
      }
    }
```

- [ ] **Step 2: Verify the file still parses (no test, no build needed yet)**

Run:
```bash
node -e "require('fs').readFileSync('next-app/app/globals.css','utf8'); console.log('css read ok')"
```
Expected output: `css read ok`

- [ ] **Step 3: Commit**

```bash
git add next-app/app/globals.css
git commit -m "$(cat <<'EOF'
Parallax mnemonics: add CSS foundation (@property, keyframes, suppression)

Declares animatable --float-x/y/r and --scroll-y custom properties via
@property so keyframes can drive them. Defines four ambient-float
keyframes (mnemonic-float-a..d) so each shape will bob on its own
rhythm. Adds .parallax-mnemonic utility (will-change + transform-origin)
and a prefers-reduced-motion override that zeros all motion props.

Per-element transform rewrites + hook wiring follow in subsequent commits.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 2: Implement `useParallaxScroll` hook + smoke test

**Files:**
- Create: `next-app/components/useParallaxScroll.ts`
- Create: `next-app/tests/useParallaxScroll.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `next-app/tests/useParallaxScroll.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { useRef } from "react";
import { useParallaxScroll } from "@/components/useParallaxScroll";

describe("useParallaxScroll", () => {
  it("mounts and unmounts cleanly with a null ref", () => {
    const { unmount } = renderHook(() => {
      const ref = useRef<HTMLDivElement | null>(null);
      useParallaxScroll(ref, { intensity: 0.15 });
    });
    expect(() => unmount()).not.toThrow();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run:
```bash
cd next-app && npx vitest run tests/useParallaxScroll.test.tsx
```
Expected: FAIL — `Cannot find module '@/components/useParallaxScroll'`

- [ ] **Step 3: Implement the hook**

Create `next-app/components/useParallaxScroll.ts`:

```typescript
"use client";

import { useEffect } from "react";

interface RegisteredEl {
  el: HTMLElement;
  intensity: number;
  inView: boolean;
}

const registry = new Set<RegisteredEl>();
let rafHandle: number | null = null;
let observer: IntersectionObserver | null = null;

function getObserver(): IntersectionObserver {
  if (observer) return observer;
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        for (const reg of registry) {
          if (reg.el === entry.target) reg.inView = entry.isIntersecting;
        }
      }
    },
    { rootMargin: "20% 0px 20% 0px" }
  );
  return observer;
}

function tick(): void {
  const vCenter = window.innerHeight / 2;
  for (const reg of registry) {
    if (!reg.inView) continue;
    const rect = reg.el.getBoundingClientRect();
    const elCenter = rect.top + rect.height / 2;
    const py = -(elCenter - vCenter) * reg.intensity;
    reg.el.style.setProperty("--scroll-y", `${py.toFixed(2)}px`);
  }
  rafHandle = requestAnimationFrame(tick);
}

function ensureLoop(): void {
  if (rafHandle === null) rafHandle = requestAnimationFrame(tick);
}

function maybeStopLoop(): void {
  if (registry.size === 0 && rafHandle !== null) {
    cancelAnimationFrame(rafHandle);
    rafHandle = null;
  }
}

function isSuppressed(): boolean {
  if (typeof window === "undefined") return true;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return true;
  if (window.matchMedia("(max-width: 1024px), (pointer: coarse)").matches) return true;
  return false;
}

export function useParallaxScroll(
  ref: { current: HTMLElement | null },
  opts: { intensity: number }
): void {
  const { intensity } = opts;
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (isSuppressed()) return;

    const reg: RegisteredEl = { el, intensity, inView: false };
    registry.add(reg);
    getObserver().observe(el);
    ensureLoop();

    return () => {
      observer?.unobserve(el);
      registry.delete(reg);
      el.style.removeProperty("--scroll-y");
      maybeStopLoop();
    };
  }, [ref, intensity]);
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run:
```bash
cd next-app && npx vitest run tests/useParallaxScroll.test.tsx
```
Expected: PASS — 1 passed

- [ ] **Step 5: Run typecheck to verify the file compiles cleanly**

Run:
```bash
cd next-app && npm run typecheck
```
Expected: no output (success)

- [ ] **Step 6: Commit**

```bash
git add next-app/components/useParallaxScroll.ts next-app/tests/useParallaxScroll.test.tsx
git commit -m "$(cat <<'EOF'
Parallax mnemonics: add useParallaxScroll hook

Single shared requestAnimationFrame loop + IntersectionObserver, scoped
to viewport-visible registered elements. Each frame writes --scroll-y
on the element based on distance from viewport center scaled by
intensity. Hook bails out under prefers-reduced-motion or max-width
1024px / coarse pointer (matches Contact decor mobile breakpoint).

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 3: Wire Work mnemonic to parallax

**Files:**
- Modify: `next-app/components/Work.tsx`
- Modify: `next-app/app/globals.css` (rewrite `.work-mnemonic` transform)
- Modify: `next-app/tests/smoke.test.tsx`

- [ ] **Step 1: Write the failing smoke test**

Open `next-app/tests/smoke.test.tsx`. Inside the `describe("HomePage smoke tests", () => { ... })` block, immediately before the closing `});` at the end, add:

```tsx
  it("Work mnemonic carries the parallax-mnemonic class", () => {
    const { container } = render(<HomePage />);
    const img = container.querySelector(".work-mnemonic");
    expect(img).not.toBeNull();
    expect(img?.classList.contains("parallax-mnemonic")).toBe(true);
  });
```

- [ ] **Step 2: Run the test to verify it fails**

Run:
```bash
cd next-app && npx vitest run tests/smoke.test.tsx -t "Work mnemonic carries the parallax-mnemonic class"
```
Expected: FAIL — `expected false to be true`

- [ ] **Step 3: Update `Work.tsx` to use the hook and add the class**

Open `next-app/components/Work.tsx`. At the very top of the file, add:

```tsx
"use client";
```

Then add `useRef` to the React imports (or add a new import line if React is not already imported). Inspect the current imports — if there is no `import { ... } from "react";` line, add one near the top below `"use client";`:

```tsx
import { useRef } from "react";
```

If React is already imported, add `useRef` to the existing destructured import.

Then add the hook import below other imports:

```tsx
import { useParallaxScroll } from "./useParallaxScroll";
```

Inside `export function Work() { ... }`, immediately after the `function Work() {` line and before `return (`, add:

```tsx
  const mnemonicRef = useRef<HTMLImageElement>(null);
  useParallaxScroll(mnemonicRef, { intensity: 0.20 });
```

Then update the `<img>` tag from:
```tsx
      <img
        className="work-mnemonic"
        src="assets/brand/mnemonic-4.svg"
        alt=""
        aria-hidden="true"
      />
```

to:

```tsx
      <img
        ref={mnemonicRef}
        className="work-mnemonic parallax-mnemonic"
        src="assets/brand/mnemonic-4.svg"
        alt=""
        aria-hidden="true"
      />
```

- [ ] **Step 4: Update `.work-mnemonic` transform in `globals.css`**

Open `next-app/app/globals.css`. Locate the `.work-mnemonic { ... }` rule (around line 584). Inside the rule body, immediately after `user-select: none;`, add:

```css
      transform:
        translate3d(0, var(--scroll-y, 0px), 0)
        translate3d(var(--float-x, 0px), var(--float-y, 0px), 0)
        rotate(var(--float-r, 0deg));
      animation: mnemonic-float-a 6s ease-in-out infinite;
```

(`.work-mnemonic` had no prior `transform` rule; this is a new declaration on the existing block.)

- [ ] **Step 5: Run the smoke test to verify it passes**

Run:
```bash
cd next-app && npx vitest run tests/smoke.test.tsx -t "Work mnemonic carries the parallax-mnemonic class"
```
Expected: PASS

- [ ] **Step 6: Run the full test suite + typecheck to confirm no regressions**

Run:
```bash
cd next-app && npm test && npm run typecheck
```
Expected: all tests pass, typecheck silent

- [ ] **Step 7: Commit**

```bash
git add next-app/components/Work.tsx next-app/app/globals.css next-app/tests/smoke.test.tsx
git commit -m "$(cat <<'EOF'
Parallax mnemonics: wire Work section (mnemonic-4)

Adds parallax-mnemonic class + useParallaxScroll hook (intensity 0.20)
to the Work section's mnemonic. Rewrites .work-mnemonic transform to
compose --scroll-y, --float-x/y/r. Animates with mnemonic-float-a.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 4: Wire Process mnemonic to parallax

**Files:**
- Modify: `next-app/components/Process.tsx`
- Modify: `next-app/app/globals.css` (replace `transform: none` with composed transform)
- Modify: `next-app/tests/smoke.test.tsx`

- [ ] **Step 1: Write the failing smoke test**

Open `next-app/tests/smoke.test.tsx`. Immediately after the Work-mnemonic test added in Task 3, add:

```tsx
  it("Process mnemonic carries the parallax-mnemonic class", () => {
    const { container } = render(<HomePage />);
    const img = container.querySelector(".process-mnemonic");
    expect(img).not.toBeNull();
    expect(img?.classList.contains("parallax-mnemonic")).toBe(true);
  });
```

- [ ] **Step 2: Run the test to verify it fails**

Run:
```bash
cd next-app && npx vitest run tests/smoke.test.tsx -t "Process mnemonic carries the parallax-mnemonic class"
```
Expected: FAIL — `expected false to be true`

- [ ] **Step 3: Update `Process.tsx` to use the hook and add the class**

Open `next-app/components/Process.tsx`. At the very top of the file, before any other code, add:

```tsx
"use client";
```

Add `useRef` import. If React is not imported, add:

```tsx
import { useRef } from "react";
```

Add the hook import:

```tsx
import { useParallaxScroll } from "./useParallaxScroll";
```

Inside `export function Process() { ... }`, immediately after the `function Process() {` line and before `return (`, add:

```tsx
  const mnemonicRef = useRef<HTMLImageElement>(null);
  useParallaxScroll(mnemonicRef, { intensity: 0.15 });
```

Update the `<img>` tag from:

```tsx
      <img
        className="section-decor process-mnemonic"
        src="assets/brand/mnemonic-5.svg"
        alt=""
        aria-hidden="true"
      />
```

to:

```tsx
      <img
        ref={mnemonicRef}
        className="section-decor process-mnemonic parallax-mnemonic"
        src="assets/brand/mnemonic-5.svg"
        alt=""
        aria-hidden="true"
      />
```

- [ ] **Step 4: Update `.process .process-mnemonic` transform in `globals.css`**

Open `next-app/app/globals.css`. Locate the `.process .process-mnemonic { ... }` rule (around line 487). Find the line `transform: none;` inside that block and replace it with:

```css
      transform:
        translate3d(0, var(--scroll-y, 0px), 0)
        translate3d(var(--float-x, 0px), var(--float-y, 0px), 0)
        rotate(var(--float-r, 0deg));
      animation: mnemonic-float-b 7s ease-in-out infinite;
```

- [ ] **Step 5: Run the smoke test to verify it passes**

Run:
```bash
cd next-app && npx vitest run tests/smoke.test.tsx -t "Process mnemonic carries the parallax-mnemonic class"
```
Expected: PASS

- [ ] **Step 6: Run the full test suite + typecheck**

Run:
```bash
cd next-app && npm test && npm run typecheck
```
Expected: all tests pass, typecheck silent

- [ ] **Step 7: Commit**

```bash
git add next-app/components/Process.tsx next-app/app/globals.css next-app/tests/smoke.test.tsx
git commit -m "$(cat <<'EOF'
Parallax mnemonics: wire Process section (mnemonic-5)

Adds parallax-mnemonic class + useParallaxScroll hook (intensity 0.15)
to the Process section's mnemonic. Replaces transform: none with the
composed scroll/float transform. Animates with mnemonic-float-b.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 5: Wire Contact mnemonics (left + right) to parallax

**Files:**
- Modify: `next-app/components/Contact.tsx`
- Modify: `next-app/app/globals.css` (rewrite `.contact-decor.left` and `.contact-decor.right` transforms)
- Modify: `next-app/tests/smoke.test.tsx`

- [ ] **Step 1: Write the failing smoke tests**

Open `next-app/tests/smoke.test.tsx`. Immediately after the Process-mnemonic test added in Task 4, add:

```tsx
  it("Contact-left mnemonic carries the parallax-mnemonic class", () => {
    const { container } = render(<HomePage />);
    const img = container.querySelector(".contact-decor.left");
    expect(img).not.toBeNull();
    expect(img?.classList.contains("parallax-mnemonic")).toBe(true);
  });

  it("Contact-right mnemonic carries the parallax-mnemonic class", () => {
    const { container } = render(<HomePage />);
    const img = container.querySelector(".contact-decor.right");
    expect(img).not.toBeNull();
    expect(img?.classList.contains("parallax-mnemonic")).toBe(true);
  });
```

- [ ] **Step 2: Run the tests to verify they fail**

Run:
```bash
cd next-app && npx vitest run tests/smoke.test.tsx -t "Contact"
```
Expected: 2 new tests FAIL with `expected false to be true` (existing Contact tests still pass)

- [ ] **Step 3: Update `Contact.tsx` to use the hook on both decor imgs**

Open `next-app/components/Contact.tsx`. At the very top of the file, before any other code, add:

```tsx
"use client";
```

Add the hooks/imports:

```tsx
import { useRef } from "react";
import { useParallaxScroll } from "./useParallaxScroll";
```

Inside `export function Contact() { ... }`, immediately after the `function Contact() {` line and before `return (`, add:

```tsx
  const leftRef = useRef<HTMLImageElement>(null);
  const rightRef = useRef<HTMLImageElement>(null);
  useParallaxScroll(leftRef, { intensity: 0.18 });
  useParallaxScroll(rightRef, { intensity: 0.10 });
```

Update the left `<img>` tag from:

```tsx
        <img
          className="contact-decor left"
          src="assets/brand/brand-mnemonic-1.svg"
          alt=""
          aria-hidden="true"
        />
```

to:

```tsx
        <img
          ref={leftRef}
          className="contact-decor left parallax-mnemonic"
          src="assets/brand/brand-mnemonic-1.svg"
          alt=""
          aria-hidden="true"
        />
```

And the right `<img>` from:

```tsx
        <img
          className="contact-decor right"
          src="assets/brand/brand-mnemonic-4.svg"
          alt=""
          aria-hidden="true"
        />
```

to:

```tsx
        <img
          ref={rightRef}
          className="contact-decor right parallax-mnemonic"
          src="assets/brand/brand-mnemonic-4.svg"
          alt=""
          aria-hidden="true"
        />
```

- [ ] **Step 4: Update `.contact-decor.left` and `.contact-decor.right` transforms in `globals.css`**

Open `next-app/app/globals.css`. Locate the `.contact-decor.left { ... }` rule (around line 1060). Replace the existing line:

```css
      transform: rotate(-38deg);
```

with:

```css
      transform:
        translate3d(0, var(--scroll-y, 0px), 0)
        rotate(-38deg)
        translate3d(var(--float-x, 0px), var(--float-y, 0px), 0)
        rotate(var(--float-r, 0deg));
      animation: mnemonic-float-c 5s ease-in-out infinite;
```

In the immediately following `.contact-decor.right { ... }` rule, replace the existing line:

```css
      transform: rotate(18deg);
```

with:

```css
      transform:
        translate3d(0, var(--scroll-y, 0px), 0)
        rotate(18deg)
        translate3d(var(--float-x, 0px), var(--float-y, 0px), 0)
        rotate(var(--float-r, 0deg));
      animation: mnemonic-float-d 6.5s ease-in-out infinite;
```

- [ ] **Step 5: Run the smoke tests to verify they pass**

Run:
```bash
cd next-app && npx vitest run tests/smoke.test.tsx -t "Contact"
```
Expected: all Contact-related tests PASS (4 tests: existing Have-a-seed-script test, existing email test, plus the two new parallax-class tests)

- [ ] **Step 6: Run the full test suite + typecheck**

Run:
```bash
cd next-app && npm test && npm run typecheck
```
Expected: all tests pass, typecheck silent

- [ ] **Step 7: Commit**

```bash
git add next-app/components/Contact.tsx next-app/app/globals.css next-app/tests/smoke.test.tsx
git commit -m "$(cat <<'EOF'
Parallax mnemonics: wire Contact section (left + right)

Adds parallax-mnemonic class + useParallaxScroll hook (intensities
0.18 left, 0.10 right) to both Contact decor imgs. Rewrites the two
transform rules to compose scroll, base rotation, and float translates
in that order — base rotation between the two translates so the float
drifts along the rotated local axes (organic feel). Animates with
mnemonic-float-c (left) and -d (right).

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 6: Manual verification in dev preview

**Files:** none (verification only)

- [ ] **Step 1: Start the dev server**

The dev server may already be running from prior sessions. Check first:

```bash
ps aux | grep -v grep | grep "next dev"
```

If nothing shows, start one. The launch config in `.claude/launch.json` is `hatch-next-dev`. From the agent: call `mcp__Claude_Preview__preview_start` with `{ "name": "hatch-next-dev" }`. If running outside the agent harness, run:

```bash
cd next-app && npm run dev
```

- [ ] **Step 2: Verify desktop scroll-coupled parallax**

Open `http://localhost:3000/hatch-n-harvest/` (or use the agent's preview tool). Set viewport to 1440×900. Scroll slowly through the page. Confirm:

- Work section: `mnemonic-4` (large bottom-left orange shape) bobs ambiently AND drifts opposite to scroll
- Process section: `mnemonic-5` (orange spiral) bobs ambiently AND drifts opposite to scroll
- Contact section: both `brand-mnemonic-1` (bottom-left blob) and `brand-mnemonic-4` (top-right swoosh) bob ambiently AND drift opposite to scroll, at different rates (left at 0.18 intensity, right at 0.10)

If movement is invisible or jittery, check `getComputedStyle(el).transform` in devtools to confirm transform values are non-identity during scroll.

- [ ] **Step 3: Verify ambient float persists when not scrolling**

Stop scrolling at the Contact section. The two mnemonics should continue bobbing on their own loops (5s left, 6.5s right) without scroll input.

- [ ] **Step 4: Verify tablet (no scroll coupling, ambient still on)**

Resize the preview viewport to 768×1024. Scroll the page. Confirm:

- Mnemonics still ambient-float
- No scroll-coupled drift (because viewport ≤1024px short-circuits the hook)

- [ ] **Step 5: Verify mobile**

Resize the preview to 375×812. Scroll the page. Confirm:

- Work + Process mnemonics: ambient float visible, no scroll drift
- Contact mnemonics: completely hidden (existing `display: none` rule under 700px)

- [ ] **Step 6: Verify reduced motion**

In the browser devtools (Chrome: Rendering tab → Emulate CSS media feature `prefers-reduced-motion: reduce`), or via OS settings. Reload the page. Confirm:

- All mnemonics are static — no ambient bob, no scroll drift
- The page still renders correctly otherwise

- [ ] **Step 7: Verify no console errors during scroll**

Run, via the agent's preview tool or the browser devtools console:

```bash
# (agent) preview_console_logs with level: "error"
```

Expected: no errors during scrolling.

- [ ] **Step 8 (no commit — verification step has no changes)**

If anything failed, stop and fix. Common likely issues:

- If parallax appears jumpy or only updates on scroll-end: the rAF loop may not be running continuously — check that `tick()` calls `requestAnimationFrame(tick)` at its end (not just on scroll events).
- If `--scroll-y` is set but the shape doesn't move: the per-element CSS `transform` rule isn't composing the variable — check that the element's computed `transform` includes a non-identity translate.
- If float keyframes don't work: confirm `@property` declarations parsed (Chrome devtools → Animations panel should show the keyframes).

---

## Task 7: Production deploy

**Files:** rebuilds `docs/`

- [ ] **Step 1: Run the production build**

```bash
cd next-app && npm run build:prod
```

Expected: build completes successfully and `postbuild` reports `moved .../out → .../docs`.

- [ ] **Step 2: Verify the build is custom-domain shaped (not basePath-prefixed)**

Run:
```bash
grep -oE 'href="[^"]*\.css"' docs/index.html | head -1
cat docs/CNAME
```

Expected:
- The CSS href starts with `/_next/...` (NO `/hatch-n-harvest/` prefix)
- CNAME contents: `hatchnharvest.com`

If the href starts with `/hatch-n-harvest/`, you ran `npm run build` instead of `npm run build:prod`. Stop and rerun with `:prod`.

- [ ] **Step 3: Confirm parallax class made it into the export**

```bash
grep -c "parallax-mnemonic" docs/index.html
```

Expected: 4 or more (one per parallax-mnemonic img).

- [ ] **Step 4: Stage and commit the rebuilt docs/**

```bash
git add docs/
git commit -m "$(cat <<'EOF'
deploy: rebuild docs with parallax mnemonics

Includes the new useParallaxScroll hook + parallax-mnemonic CSS for
Work, Process, and both Contact mnemonics. Built with CUSTOM_DOMAIN=true
for hatchnharvest.com.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

- [ ] **Step 5: Push to origin**

```bash
git push origin main
```

Expected: push succeeds, GitHub Pages should republish within ~1 minute.

- [ ] **Step 6: Smoke-check the live site**

Open `https://hatchnharvest.com` in a browser, scroll through the sections, and confirm parallax works in production.

If the site is broken (white page, 404 chunks), the most likely cause is a basePath mismatch — re-verify Step 2.

---

## Self-Review Notes

- Spec coverage: every section of the design spec maps to a task. Scope (4 mnemonics across Work/Process/Contact, skip Manifesto) → Tasks 3, 4, 5. Motion spec (ambient float keyframes, scroll coupling) → Task 1 (CSS) + Task 2 (hook). Suppression rules → Task 1 (CSS reduced-motion) + Task 2 (hook bailout). Architecture (hook + composed transforms) → Task 2 + Tasks 3-5. Testing → smoke test additions in Tasks 3-5 + new hook test in Task 2 + manual checklist in Task 6. Performance (shared rAF, IntersectionObserver, will-change) → Task 1 + Task 2.
- No placeholders: every step has exact code, exact commands, exact expected output.
- Type consistency: hook signature `useParallaxScroll(ref: { current: HTMLElement | null }, opts: { intensity: number }): void` is identical across Tasks 2-5. CSS class `parallax-mnemonic` and custom property names `--scroll-y`, `--float-x/y/r` are identical across all tasks.
- Scope: focused on a single feature; no decomposition needed.
- Ambiguity: per-element animation choices (`mnemonic-float-a/b/c/d`) and intensities (0.20/0.15/0.18/0.10) are pinned to specific elements in Tasks 3-5.
