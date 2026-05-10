# Rising H2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a `<RisingHeading>` component that adapts the homepage hero H1's word-rise animation to any heading, triggered when the heading scrolls into view, then retrofit every `<h2>` on the homepage and the case-study pages.

**Architecture:** New client component `next-app/components/case-study/RisingHeading.tsx` walks `children`, splitting strings into `<span class="word" style="--i:N">` elements (preserving `<em>` wrappers and continuing the index across), wraps the result in a masking `<span class="line">`, and applies the existing `useScrollReveal` hook on the heading element. CSS reuses the homepage hero's easing/timing in a new `/* === RISING HEADING === */` block in `globals.css`.

**Tech Stack:** React 19 client components, TypeScript, plain CSS (no new dependencies). Reuses existing `useScrollReveal` hook from `next-app/components/case-study/useScrollReveal.ts`.

**Source design:** [`specs/2026-05-10-rising-h2-design.md`](./2026-05-10-rising-h2-design.md)

**Branch:** `rising-h2` off `main`.

**Working directory for npm commands:** `next-app/`.

---

## Conventions used in this plan

- All paths are relative to the repo root unless explicitly under `next-app/`.
- Each task ends with a single `git commit` covering the files it touched.
- Tests go in `next-app/tests/case-study/`.
- Test count baseline (before this plan): 84 tests across 12 files.

---

## Task 1: Branch + RisingHeading skeleton

Create the feature branch. Build the component without word-splitting yet — just renders the heading element with the right class, attaches `useScrollReveal`, and renders children inside a `.line` wrapper.

**Files:**
- Create: `next-app/components/case-study/RisingHeading.tsx`
- Create: `next-app/tests/case-study/RisingHeading.test.tsx`

- [ ] **Step 1: Create branch**

```bash
git checkout main
git pull origin main
git checkout -b rising-h2
```

- [ ] **Step 2: Write failing scaffold tests**

Create `next-app/tests/case-study/RisingHeading.test.tsx`:

```tsx
import { afterEach, beforeEach, describe, it, expect, vi } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { RisingHeading } from "@/components/case-study/RisingHeading";

type ObserverInstance = {
  observe: ReturnType<typeof vi.fn>;
  disconnect: ReturnType<typeof vi.fn>;
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
        disconnect: this.disconnect,
        trigger: (entries) => {
          this.callback(entries as unknown as IntersectionObserverEntry[], this as unknown as IntersectionObserver);
        },
      };
    }
  }
  Object.defineProperty(globalThis, "IntersectionObserver", { writable: true, configurable: true, value: MockObserver });
  Object.defineProperty(window, "IntersectionObserver", { writable: true, configurable: true, value: MockObserver });
});

afterEach(() => {
  cleanup();
  if (originalIO) {
    Object.defineProperty(globalThis, "IntersectionObserver", { writable: true, configurable: true, value: originalIO });
    Object.defineProperty(window, "IntersectionObserver", { writable: true, configurable: true, value: originalIO });
  }
  lastInstance = null;
});

describe("RisingHeading scaffold", () => {
  it("renders an h2 by default with the rising-heading class", () => {
    const { container } = render(<RisingHeading>Hello</RisingHeading>);
    const h = container.querySelector("h2.rising-heading");
    expect(h).not.toBeNull();
  });

  it("renders the requested heading level via `as`", () => {
    const { container } = render(<RisingHeading as="h3">Hello</RisingHeading>);
    expect(container.querySelector("h3.rising-heading")).not.toBeNull();
  });

  it("merges caller className alongside rising-heading", () => {
    const { container } = render(
      <RisingHeading className="custom-x">Hello</RisingHeading>
    );
    const h = container.querySelector("h2") as HTMLHeadingElement;
    expect(h.classList.contains("rising-heading")).toBe(true);
    expect(h.classList.contains("custom-x")).toBe(true);
  });

  it("preserves the heading text content", () => {
    const { container } = render(<RisingHeading>Hello world</RisingHeading>);
    expect(container.querySelector("h2")?.textContent).toBe("Hello world");
  });

  it("adds is-revealed when the observer fires intersecting", () => {
    const { container } = render(<RisingHeading>Hello</RisingHeading>);
    const h = container.querySelector("h2") as HTMLElement;
    expect(h.classList.contains("is-revealed")).toBe(false);
    lastInstance!.trigger([{ target: h, isIntersecting: true }]);
    expect(h.classList.contains("is-revealed")).toBe(true);
  });
});
```

- [ ] **Step 3: Run the tests to verify they fail**

```bash
npm run test -- RisingHeading
```
Expected: FAIL — module does not exist.

- [ ] **Step 4: Implement the scaffold**

Create `next-app/components/case-study/RisingHeading.tsx`:

```tsx
"use client";

import { useRef, type ReactNode } from "react";
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
}) {
  const ref = useRef<HTMLHeadingElement | null>(null);
  useScrollReveal(ref);
  const Tag = as;
  const cls = ["rising-heading", className].filter(Boolean).join(" ");
  return (
    <Tag ref={ref} className={cls}>
      <span className="line">{children}</span>
    </Tag>
  );
}
```

- [ ] **Step 5: Run tests to verify they pass**

```bash
npm run test -- RisingHeading
```
Expected: 5/5 passing.

- [ ] **Step 6: Run the full suite**

```bash
npm run test
```
Expected: 89 passing (84 prior + 5 new).

- [ ] **Step 7: Run typecheck**

```bash
npm run typecheck
```
Expected: clean.

- [ ] **Step 8: Commit**

```bash
git add components/case-study/RisingHeading.tsx tests/case-study/RisingHeading.test.tsx
git commit -m "Add RisingHeading scaffold (heading + useScrollReveal, no word split yet)"
```

---

## Task 2: Word-splitting logic + CSS

Add the `splitChildrenIntoWords` helper that walks ReactNode children and produces word spans (with `<em>` preservation). Wire it into the component. Add the CSS animation block. After this task the component is fully functional.

**Files:**
- Modify: `next-app/components/case-study/RisingHeading.tsx`
- Modify: `next-app/tests/case-study/RisingHeading.test.tsx`
- Modify: `next-app/app/globals.css`

- [ ] **Step 1: Append failing tests for word-splitting**

Append these `it` blocks inside the existing `describe("RisingHeading scaffold", …)` block (insert before the closing `});`):

```tsx
  it("splits a plain-string child into word spans with sequential --i", () => {
    const { container } = render(<RisingHeading>Hello cruel world</RisingHeading>);
    const words = container.querySelectorAll(".rising-heading .word");
    expect(words.length).toBe(3);
    expect(words[0].textContent).toBe("Hello");
    expect((words[0] as HTMLElement).style.getPropertyValue("--i")).toBe("0");
    expect(words[1].textContent).toBe("cruel");
    expect((words[1] as HTMLElement).style.getPropertyValue("--i")).toBe("1");
    expect(words[2].textContent).toBe("world");
    expect((words[2] as HTMLElement).style.getPropertyValue("--i")).toBe("2");
  });

  it("preserves <em> wrappers and continues --i across them", () => {
    const { container } = render(
      <RisingHeading>
        People buy <em>connection, belonging.</em>
      </RisingHeading>
    );
    const h = container.querySelector("h2") as HTMLElement;
    const allWords = h.querySelectorAll(".word");
    expect(allWords.length).toBe(4);
    // First two ("People", "buy") are direct children of .line.
    expect(allWords[0].textContent).toBe("People");
    expect((allWords[0] as HTMLElement).style.getPropertyValue("--i")).toBe("0");
    expect(allWords[1].textContent).toBe("buy");
    expect((allWords[1] as HTMLElement).style.getPropertyValue("--i")).toBe("1");
    // Next two ("connection,", "belonging.") are inside an <em>.
    const em = h.querySelector("em") as HTMLElement;
    const emWords = em.querySelectorAll(".word");
    expect(emWords.length).toBe(2);
    expect(emWords[0].textContent).toBe("connection,");
    expect((emWords[0] as HTMLElement).style.getPropertyValue("--i")).toBe("2");
    expect(emWords[1].textContent).toBe("belonging.");
    expect((emWords[1] as HTMLElement).style.getPropertyValue("--i")).toBe("3");
  });

  it("preserves visible whitespace between words", () => {
    const { container } = render(<RisingHeading>Hello world</RisingHeading>);
    const h = container.querySelector("h2") as HTMLElement;
    expect(h.textContent).toBe("Hello world");
  });

  it("handles trailing/leading whitespace in string children gracefully", () => {
    const { container } = render(
      <RisingHeading>
        People buy{" "}
        <em>connection.</em>
      </RisingHeading>
    );
    const h = container.querySelector("h2") as HTMLElement;
    // textContent collapses whitespace from JSX literals; just verify content.
    expect(h.textContent?.trim()).toBe("People buy connection.");
    const allWords = h.querySelectorAll(".word");
    expect(allWords.length).toBe(3);
  });
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npm run test -- RisingHeading
```
Expected: 5 prior pass, 4 new FAIL — children render as plain text without word spans.

- [ ] **Step 3: Implement the splitting helper and wire it in**

Replace `next-app/components/case-study/RisingHeading.tsx` entirely with:

```tsx
"use client";

import {
  Children,
  cloneElement,
  isValidElement,
  useRef,
  type CSSProperties,
  type ReactElement,
  type ReactNode,
} from "react";
import { useScrollReveal } from "./useScrollReveal";

type HeadingTag = "h1" | "h2" | "h3";

const WORD_SPLIT = /(\s+)/; // capture whitespace runs so we can re-emit them

function makeWord(text: string, i: number): ReactNode {
  const style = { "--i": i } as CSSProperties;
  return (
    <span className="word" style={style} key={`w-${i}`}>
      {text}
    </span>
  );
}

function splitString(text: string, startIndex: number): { nodes: ReactNode[]; nextIndex: number } {
  const nodes: ReactNode[] = [];
  let i = startIndex;
  for (const part of text.split(WORD_SPLIT)) {
    if (part === "") continue;
    if (/^\s+$/.test(part)) {
      // preserve whitespace between word spans
      nodes.push(part);
    } else {
      nodes.push(makeWord(part, i));
      i += 1;
    }
  }
  return { nodes, nextIndex: i };
}

function splitNodes(children: ReactNode, startIndex: number): { nodes: ReactNode[]; nextIndex: number } {
  const out: ReactNode[] = [];
  let i = startIndex;
  Children.forEach(children, (child) => {
    if (typeof child === "string") {
      const r = splitString(child, i);
      out.push(...r.nodes);
      i = r.nextIndex;
    } else if (typeof child === "number") {
      const r = splitString(String(child), i);
      out.push(...r.nodes);
      i = r.nextIndex;
    } else if (isValidElement(child) && child.type === "em") {
      const inner = splitNodes(
        (child as ReactElement<{ children: ReactNode }>).props.children,
        i
      );
      // Recompute i based on how many words were produced inside the em.
      i = inner.nextIndex;
      out.push(cloneElement(child as ReactElement, { key: `em-${i}` }, inner.nodes));
    } else {
      // Unsupported node type — render as-is, no animation.
      out.push(child);
    }
  });
  return { nodes: out, nextIndex: i };
}

export function RisingHeading({
  as = "h2",
  className,
  children,
}: {
  as?: HeadingTag;
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLHeadingElement | null>(null);
  useScrollReveal(ref);
  const Tag = as;
  const cls = ["rising-heading", className].filter(Boolean).join(" ");
  const { nodes } = splitNodes(children, 0);
  return (
    <Tag ref={ref} className={cls}>
      <span className="line">{nodes}</span>
    </Tag>
  );
}
```

- [ ] **Step 4: Append the CSS block**

Add at the END of `next-app/app/globals.css`, matching the file's 4-space indentation:

```css

    /* ============================================================
       RISING HEADING
       Adapts the homepage hero's word-rise animation to any heading.
       Triggered when the heading scrolls into view (via the
       useScrollReveal hook adding `is-revealed`).
       ============================================================ */

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

- [ ] **Step 5: Run tests to verify they pass**

```bash
npm run test -- RisingHeading
```
Expected: 9/9 passing.

- [ ] **Step 6: Run the full suite**

```bash
npm run test
```
Expected: 93 passing (84 prior + 9 new RisingHeading tests).

- [ ] **Step 7: Run typecheck**

```bash
npm run typecheck
```
Expected: clean.

- [ ] **Step 8: Commit**

```bash
git add components/case-study/RisingHeading.tsx tests/case-study/RisingHeading.test.tsx app/globals.css
git commit -m "Implement RisingHeading word-splitting with em support, add animation CSS"
```

---

## Task 3: Update `CaseSection` to use `RisingHeading`

Make `CaseSection` wrap its `heading` prop in `<RisingHeading as="h2">` so all consumers of `CaseSection` automatically get the animation.

**Files:**
- Modify: `next-app/components/case-study/CaseSection.tsx`
- Modify: `next-app/tests/case-study/CaseSection.test.tsx`

- [ ] **Step 1: Update the existing CaseSection heading test**

Open `next-app/tests/case-study/CaseSection.test.tsx`. Find the test that asserts the heading renders (likely uses `getByRole("heading", { level: 2, name: "..." })`). Add ONE assertion right after it:

Locate the test that looks like:

```tsx
  it("renders eyebrow, heading, and children", () => {
    render(
      <CaseSection eyebrow="The problem" heading="A real problem">
        <p>Body copy.</p>
      </CaseSection>
    );
    expect(screen.getByText("The problem")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "A real problem" })).toBeInTheDocument();
    expect(screen.getByText("Body copy.")).toBeInTheDocument();
  });
```

Replace its body with (note `getByRole` walks descendant text, so the assertion still works after RisingHeading wraps the text in word spans):

```tsx
  it("renders eyebrow, heading, and children", () => {
    const { container } = render(
      <CaseSection eyebrow="The problem" heading="A real problem">
        <p>Body copy.</p>
      </CaseSection>
    );
    expect(screen.getByText("The problem")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "A real problem" })).toBeInTheDocument();
    expect(screen.getByText("Body copy.")).toBeInTheDocument();
    // After RisingHeading retrofit, the heading is the rising-heading element with word spans.
    const h2 = container.querySelector("h2.rising-heading") as HTMLElement;
    expect(h2).not.toBeNull();
    expect(h2.querySelectorAll(".word").length).toBeGreaterThan(0);
  });
```

The other tests in `CaseSection.test.tsx` that omit a heading or use ReactNode heading should continue to pass without changes (since they either don't query for a heading or use `getByRole`/`querySelector("h2")`). If any test specifically asserts there's no `.rising-heading` element, that's fine — the test about `omits eyebrow and heading when not provided` should still pass because no heading means no `<h2>` rendered.

- [ ] **Step 2: Run the test to verify it fails**

```bash
npm run test -- CaseSection
```
Expected: the `renders eyebrow, heading, and children` test now FAILS — current CaseSection renders a plain `<h2>` without `.rising-heading`.

- [ ] **Step 3: Update CaseSection to use RisingHeading**

Replace `next-app/components/case-study/CaseSection.tsx` entirely with:

```tsx
import type { ReactNode } from "react";
import { RisingHeading } from "./RisingHeading";

export function CaseSection({
  className,
  eyebrow,
  heading,
  id,
  children,
}: {
  className?: string;
  eyebrow?: string;
  heading?: ReactNode;
  id?: string;
  children: ReactNode;
}) {
  return (
    <section className={className} id={id}>
      <div className="wrap">
        {eyebrow ? <div className="eyebrow">{eyebrow}</div> : null}
        {heading ? <RisingHeading as="h2">{heading}</RisingHeading> : null}
        {children}
      </div>
    </section>
  );
}
```

Note: `CaseSection` is no longer a server-only component since `RisingHeading` is `"use client"`. React handles this fine — the section element renders server-side, and the heading hydrates as a client component. No `"use client"` directive is needed at the `CaseSection` boundary (only at `RisingHeading`).

- [ ] **Step 4: Run the test to verify it passes**

```bash
npm run test -- CaseSection
```
Expected: PASS.

- [ ] **Step 5: Run the full suite**

```bash
npm run test
```
Expected: 93 passing.

- [ ] **Step 6: Run typecheck**

```bash
npm run typecheck
```
Expected: clean.

- [ ] **Step 7: Commit**

```bash
git add components/case-study/CaseSection.tsx tests/case-study/CaseSection.test.tsx
git commit -m "Use RisingHeading inside CaseSection's heading slot"
```

---

## Task 4: Retrofit homepage H2s

Replace each `<h2>` on the homepage components with `<RisingHeading as="h2">`. Five components touched.

**Files:**
- Modify: `next-app/components/Manifesto.tsx`
- Modify: `next-app/components/Work.tsx`
- Modify: `next-app/components/Process.tsx`
- Modify: `next-app/components/Studio.tsx`
- Modify: `next-app/components/Contact.tsx`
- Modify (potentially): `next-app/tests/smoke.test.tsx` — only if assertions break.

- [ ] **Step 1: Update Manifesto.tsx**

Open `next-app/components/Manifesto.tsx`. Add this import at the top alongside the existing imports:

```tsx
import { RisingHeading } from "./case-study/RisingHeading";
```

Find the existing `<h2>...<em>...</em></h2>` block:

```tsx
        <h2>
          People don&apos;t buy marketing strategies. They buy{" "}
          <em>connection, belonging, meaning.</em>
        </h2>
```

Replace with:

```tsx
        <RisingHeading as="h2">
          People don&apos;t buy marketing strategies. They buy{" "}
          <em>connection, belonging, meaning.</em>
        </RisingHeading>
```

- [ ] **Step 2: Update Work.tsx**

Open `next-app/components/Work.tsx`. Add the same import at the top:

```tsx
import { RisingHeading } from "./case-study/RisingHeading";
```

Find:

```tsx
            <h2>Brands we&apos;ve helped grow.</h2>
```

Replace with:

```tsx
            <RisingHeading as="h2">Brands we&apos;ve helped grow.</RisingHeading>
```

- [ ] **Step 3: Update Process.tsx**

Open `next-app/components/Process.tsx`. Add the import:

```tsx
import { RisingHeading } from "./case-study/RisingHeading";
```

Find:

```tsx
            <h2>We grow brands in three seasons.</h2>
```

Replace with:

```tsx
            <RisingHeading as="h2">We grow brands in three seasons.</RisingHeading>
```

- [ ] **Step 4: Update Studio.tsx**

Open `next-app/components/Studio.tsx`. Add the import:

```tsx
import { RisingHeading } from "./case-study/RisingHeading";
```

Find:

```tsx
          <h2>
            An Ad Agency with <em>Decades</em> of Experience
          </h2>
```

Replace with:

```tsx
          <RisingHeading as="h2">
            An Ad Agency with <em>Decades</em> of Experience
          </RisingHeading>
```

- [ ] **Step 5: Update Contact.tsx**

Open `next-app/components/Contact.tsx`. Add the import:

```tsx
import { RisingHeading } from "./case-study/RisingHeading";
```

Find:

```tsx
        <h2>For more info about us, click here.</h2>
```

Replace with:

```tsx
        <RisingHeading as="h2">For more info about us, click here.</RisingHeading>
```

- [ ] **Step 6: Run the full test suite to surface broken homepage assertions**

```bash
npm run test
```

Expected: most tests pass, but if `tests/smoke.test.tsx` uses `screen.getByText("Brands we&apos;ve helped grow.")` (a literal `getByText` exact match) for any of these H2s, those will FAIL because the text now lives across multiple span children.

If any test fails, update it to use `getByRole("heading", { level: 2, name: ... })` which DOES walk descendant text. For example, change:

```tsx
expect(screen.getByText("Brands we've helped grow.")).toBeInTheDocument();
```

to:

```tsx
expect(screen.getByRole("heading", { level: 2, name: /Brands we.*ve helped grow\./ })).toBeInTheDocument();
```

(The regex accommodates the apostrophe being either `&apos;` decoded as `'` or the curly `’` character.)

If no smoke tests reference these exact H2 strings, no smoke test changes are needed. Read `tests/smoke.test.tsx` first to know.

- [ ] **Step 7: Re-run tests until clean**

```bash
npm run test
```
Expected: all tests pass.

- [ ] **Step 8: Run typecheck**

```bash
npm run typecheck
```
Expected: clean.

- [ ] **Step 9: Commit**

```bash
git add components/Manifesto.tsx components/Work.tsx components/Process.tsx components/Studio.tsx components/Contact.tsx tests/smoke.test.tsx
git commit -m "Retrofit homepage H2s to use RisingHeading"
```

(If `tests/smoke.test.tsx` was not modified, omit it from the `git add`.)

---

## Task 5: Retrofit AfA + UbP H2s

Replace every raw `<h2>` in the case-study pages with `<RisingHeading as="h2">`, preserving any `className` attribute.

**Files:**
- Modify: `next-app/app/work/acceleration-for-all/page.tsx`
- Modify: `next-app/app/work/united-by-play/page.tsx`
- Modify (potentially): `next-app/tests/case-study/{acceleration-for-all,united-by-play}.test.tsx` — only if assertions break.

- [ ] **Step 1: Add the import to AfA page**

Open `next-app/app/work/acceleration-for-all/page.tsx`. Add this import alongside the other `@/components/case-study/...` imports:

```tsx
import { RisingHeading } from "@/components/case-study/RisingHeading";
```

- [ ] **Step 2: Replace each raw `<h2>` in AfA with RisingHeading**

In `app/work/acceleration-for-all/page.tsx`, find each `<h2>...</h2>` and replace with `<RisingHeading as="h2">...</RisingHeading>`. Preserve any classes:

- `<h2>The Problem</h2>` → `<RisingHeading as="h2">The Problem</RisingHeading>`
- `<h2>The Solution</h2>` → `<RisingHeading as="h2">The Solution</RisingHeading>`
- `<h2>The Results</h2>` → `<RisingHeading as="h2">The Results</RisingHeading>`

If any of these `<h2>`s have a `className` attribute, copy it onto the `RisingHeading` (e.g., `<h2 className="afa-foo">X</h2>` → `<RisingHeading as="h2" className="afa-foo">X</RisingHeading>`). Use `grep -n '<h2' app/work/acceleration-for-all/page.tsx` to find every occurrence.

- [ ] **Step 3: Add the import to UbP page**

Open `next-app/app/work/united-by-play/page.tsx`. Add the same import:

```tsx
import { RisingHeading } from "@/components/case-study/RisingHeading";
```

- [ ] **Step 4: Replace each raw `<h2>` in UbP with RisingHeading**

In `app/work/united-by-play/page.tsx`, find each `<h2 className="ubp-section-h">...</h2>` and replace with `<RisingHeading as="h2" className="ubp-section-h">...</RisingHeading>`:

- `<h2 className="ubp-section-h">The Problem</h2>` → `<RisingHeading as="h2" className="ubp-section-h">The Problem</RisingHeading>`
- `<h2 className="ubp-section-h">The Solution</h2>` → `<RisingHeading as="h2" className="ubp-section-h">The Solution</RisingHeading>`
- `<h2 className="ubp-section-h">The Docuseries</h2>` → `<RisingHeading as="h2" className="ubp-section-h">The Docuseries</RisingHeading>`
- `<h2 className="ubp-section-h">The Battle For Charity</h2>` → `<RisingHeading as="h2" className="ubp-section-h">The Battle For Charity</RisingHeading>`
- `<h2 className="ubp-section-h">The Result</h2>` → `<RisingHeading as="h2" className="ubp-section-h">The Result</RisingHeading>`

Use `grep -n '<h2' app/work/united-by-play/page.tsx` to confirm every `<h2>` was replaced.

- [ ] **Step 5: Run the test suite**

```bash
npm run test
```

If `tests/case-study/{acceleration-for-all,united-by-play}.test.tsx` use `getByRole("heading", { level: 2, name: ... })`, those continue to pass. If any use `getByText(exactString)` to match heading text, update them to `getByRole(...)` per the example in Task 4 Step 6.

- [ ] **Step 6: Run typecheck**

```bash
npm run typecheck
```
Expected: clean.

- [ ] **Step 7: Commit**

```bash
git add app/work/acceleration-for-all/page.tsx app/work/united-by-play/page.tsx tests/case-study/acceleration-for-all.test.tsx tests/case-study/united-by-play.test.tsx
git commit -m "Retrofit AfA and UbP H2s to use RisingHeading"
```

(If neither test file was modified, omit them from the `git add`.)

---

## Task 6: Manual browser verification

Visual + interaction check. No code changes unless something visibly breaks.

**Files:**
- None (unless calibration is needed).

- [ ] **Step 1: Start the dev server**

```bash
npm run dev
```

- [ ] **Step 2: Verify the homepage**

Navigate to `http://localhost:3000/hatch-n-harvest/`. Reload to ensure scroll is at top.

Scroll down slowly and watch each H2:

- **Manifesto** ("People don't buy marketing strategies…"): each word rises in sequence as the heading enters view; the italicized words ("connection, belonging, meaning.") rise at the end of the sequence with their italic styling intact.
- **Work** ("Brands we've helped grow."): 4 words rise in sequence.
- **Process** ("We grow brands in three seasons."): 6 words rise in sequence.
- **Studio** ("An Ad Agency with Decades of Experience"): all 7 words rise in sequence; "Decades" is italicized.
- **Contact** ("For more info about us, click here."): all 7 words rise.

Reload and quickly scroll to the bottom, then back up. Headings stay revealed; do not re-animate.

- [ ] **Step 3: Verify the AfA case study**

Navigate to `http://localhost:3000/hatch-n-harvest/work/acceleration-for-all/`. Scroll through. Each H2 ("The Problem", "The Solution", "The Results", and any others) animates as it enters view.

- [ ] **Step 4: Verify the UbP case study**

Navigate to `http://localhost:3000/hatch-n-harvest/work/united-by-play/`. Scroll through. Each H2 ("The Problem", "The Solution", "The Docuseries", "The Battle For Charity", "The Result") animates as it enters view.

- [ ] **Step 5: Verify reduced-motion**

In Chrome DevTools → Rendering panel → "Emulate CSS prefers-reduced-motion" → set to "reduce". Reload each page and scroll. All H2s render in their final position with no animation.

Reset emulation to "no preference" before stopping the server.

- [ ] **Step 6: Stop the dev server**

Ctrl+C in the dev-server terminal.

- [ ] **Step 7: If any visual issue surfaced, calibrate**

If something looks off (e.g., the line-height clip is too tight on a multi-line heading, or the stagger feels too slow for short headings), adjust in `next-app/app/globals.css`:

- Padding on `.rising-heading .line` (default `0.08em` top / `0.22em` bottom)
- Stagger interval (`140ms` in `animation-delay: calc(var(--i, 0) * 140ms)`)
- Animation duration (`0.9s`) or easing curve

If you adjust:

```bash
git add app/globals.css
git commit -m "Calibrate RisingHeading from manual review"
```

If no calibration was needed, no commit for this task.

---

## Task 7: PR, merge, deploy

**Files:**
- Modify: `docs/` (regenerated by build).

- [ ] **Step 1: Pre-deploy checks**

```bash
cd next-app
npm run typecheck
npm run test
```
Expected: clean + all tests pass.

- [ ] **Step 2: Build for the custom domain**

```bash
npm run build:prod
```
Expected: build succeeds. The postbuild script moves `next-app/out` → `<repo-root>/docs`.

- [ ] **Step 3: Confirm new content is in the build**

```bash
cd /Users/perniskiesa/Desktop/claude_code/hatch-n-harvest
grep -c 'rising-heading' docs/index.html
grep -c 'rising-heading' docs/work/united-by-play/index.html
grep -c 'rising-heading' docs/work/acceleration-for-all/index.html
```
Expected: each ≥ 1.

- [ ] **Step 4: Commit the deploy**

```bash
git add docs/
git commit -m "deploy: rebuild docs — RisingHeading site-wide H2 animation

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

- [ ] **Step 5: Push the branch**

```bash
git push -u origin rising-h2
```

- [ ] **Step 6: Open a PR**

```bash
cat > /tmp/pr-body-rising-h2.md <<'EOF'
## Summary

Adapts the homepage hero H1 word-rise animation to every H2 on the site (homepage components, AfA case study, UbP case study), triggered when each heading scrolls into view via the existing `useScrollReveal` hook. Honors `prefers-reduced-motion: reduce`.

## What changed

- New `next-app/components/case-study/RisingHeading.tsx` — client component that walks `children`, splits strings into word spans (preserving `<em>` wrappers and continuing `--i` across them), wraps the result in a masking `<span class="line">`, and uses `useScrollReveal` to add `is-revealed` on viewport entry.
- New CSS block `/* === RISING HEADING === */` in `globals.css` with `@keyframes rising-heading-rise` (matches homepage hero easing/timing).
- `CaseSection` now wraps its `heading` slot in `<RisingHeading as="h2">` automatically.
- Homepage components (Manifesto, Work, Process, Studio, Contact) and case-study pages (AfA + UbP) all swapped raw `<h2>` for `<RisingHeading as="h2">`.
- 9 new unit tests in `RisingHeading.test.tsx` covering rendering, word-splitting, em handling, and the scroll-reveal trigger.

## Test plan

- [x] `npm run typecheck` passes
- [x] `npm run test` passes (93 tests)
- [x] `npm run build:prod` succeeds; all three pages reference `rising-heading` in markup
- [x] Manual: homepage H2s animate as they scroll into view; italicized words preserve italic styling
- [x] Manual: AfA + UbP section headings animate
- [x] Manual: scroll past + back up — no re-animation (one-shot)
- [x] Manual: `prefers-reduced-motion: reduce` skips the animation
- [ ] Live: verify on hatchnharvest.com once Pages deploys

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF

gh pr create --title "RisingHeading: site-wide scroll-triggered H2 animation" --body-file /tmp/pr-body-rising-h2.md
rm -f /tmp/pr-body-rising-h2.md
```

Capture the PR URL.

- [ ] **Step 7: Merge**

```bash
gh pr merge --merge --delete-branch
```

- [ ] **Step 8: Sync local main**

```bash
git checkout main
git pull origin main
```

- [ ] **Step 9: Verify on the live site**

After ~1–2 minutes for Pages to deploy:

```bash
curl -s https://hatchnharvest.com/ | grep -c 'rising-heading'
curl -s https://hatchnharvest.com/work/united-by-play/ | grep -c 'rising-heading'
curl -s https://hatchnharvest.com/work/acceleration-for-all/ | grep -c 'rising-heading'
```
Expected: each ≥ 1.

Open the live site, scroll through homepage + both case studies, confirm the animations work as designed.

---

## Self-review notes (already applied)

- Spec coverage: Task 1 builds the scaffold + observer integration. Task 2 adds word-splitting + em handling + CSS. Task 3 propagates through CaseSection. Tasks 4–5 retrofit consumers. Task 6 verifies. Task 7 deploys. All sections of the spec map to a task.
- No placeholders. Every code-changing step shows the literal code.
- Type names consistent: `RisingHeading`, `splitNodes`, `splitString`, `makeWord`, `--i`, `is-revealed`, class `rising-heading`, `.line`, `.word`.
- The MockObserver pattern in `RisingHeading.test.tsx` is the same as `useScrollReveal.test.tsx` — independent, doesn't touch `tests/setup.ts` further.
- The `cloneElement` for the em uses a unique key (`em-${i}`) where `i` is the post-split index, ensuring each em rendered always has a stable key.
- The whitespace-preservation in `splitString` keeps text alignment so words don't run together visually.
