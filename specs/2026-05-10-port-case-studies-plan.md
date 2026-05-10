# Port Case Studies Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert the two existing standalone HTML case studies (`acceleration-for-all.html`, `united-by-play.html`) into Next.js routes that share components and styles with the rest of the site.

**Architecture:** Build a small kit of case-study primitives under `next-app/components/case-study/`, consolidate styling into `app/globals.css`, and compose each case page in plain JSX at `app/work/<slug>/page.tsx`. Existing `Nav` and `Footer` are taught a `homeHref` prop so their hash anchors resolve to the homepage when used inside a case study.

**Tech Stack:** Next.js 15 (`output: "export"`, `trailingSlash: true`), React 19, TypeScript, Vitest + React Testing Library.

**Source design:** [`specs/2026-05-10-port-case-studies-design.md`](./2026-05-10-port-case-studies-design.md)

**Branch:** `port-case-studies`

**Working directory for all commands:** `next-app/` (run `cd next-app/` once at the start of each task; commands assume that as cwd).

---

## Conventions used in this plan

- All URLs in case-study pages are **relative**, never leading-slash. From `/work/<slug>/`:
  - Homepage anchors: `../../#work`, `../../#process`, `../../#studio`, `../../#contact`, `../../#top`
  - Sibling case study: `../<other-slug>/`
  - Assets: `../../assets/work/<slug>/<file>`
- Test files mirror the path of the file under test, rooted at `next-app/tests/`.
- Each task ends in a single `git commit` covering all the files it changed.

---

## Task 1: Create case-study test directory and CSS scaffold

**Files:**
- Create: `next-app/tests/case-study/.gitkeep`
- Modify: `next-app/app/globals.css` (append at end of file)

- [ ] **Step 1: Create the test directory placeholder**

```bash
mkdir -p tests/case-study
touch tests/case-study/.gitkeep
```

- [ ] **Step 2: Append the case-studies CSS section to `app/globals.css`**

Append exactly this block at the end of `app/globals.css`:

```css

/* ============================================================
   CASE STUDIES
   Shared layout & typography for /work/<slug>/ pages.
   Per-case brand variables (e.g. --afa-yellow) are scoped to
   each page via inline style on .case-study-shell.
   ============================================================ */

.case-study-shell {
  /* Wrapper for case-study pages. Per-case CSS vars are injected here. */
}
```

- [ ] **Step 3: Run typecheck to confirm no regressions**

Run: `npm run typecheck`
Expected: clean (no errors).

- [ ] **Step 4: Run existing tests to confirm no regressions**

Run: `npm run test`
Expected: all existing tests pass.

- [ ] **Step 5: Commit**

```bash
git add tests/case-study/.gitkeep app/globals.css
git commit -m "Add case-study test dir and CSS scaffold"
```

---

## Task 2: Add `homeHref` prop to `Nav` and `Footer`

The existing `Nav` and `Footer` use hash anchors (`#work`, `#top`, etc.) which are valid on the homepage but broken on case studies. Add an optional `homeHref` prop that prefixes hash anchors so they resolve back to the homepage.

**Files:**
- Modify: `next-app/components/Nav.tsx`
- Modify: `next-app/components/Footer.tsx`
- Create: `next-app/tests/case-study/Nav-homeHref.test.tsx`
- Create: `next-app/tests/case-study/Footer-homeHref.test.tsx`

- [ ] **Step 1: Write failing test for `Nav` with `homeHref`**

Create `next-app/tests/case-study/Nav-homeHref.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Nav } from "@/components/Nav";

describe("Nav homeHref", () => {
  it("defaults to bare hash anchors when homeHref omitted", () => {
    render(<Nav />);
    expect(screen.getByRole("link", { name: "Work" })).toHaveAttribute("href", "#work");
    expect(screen.getByRole("link", { name: "Process" })).toHaveAttribute("href", "#process");
    expect(screen.getByRole("link", { name: "Studio" })).toHaveAttribute("href", "#studio");
    expect(screen.getByRole("link", { name: "Start a project →" })).toHaveAttribute("href", "#contact");
    expect(screen.getByRole("link", { name: "Hatch n Harvest — home" })).toHaveAttribute("href", "#top");
  });

  it("prefixes hash anchors with homeHref when provided", () => {
    render(<Nav homeHref="../../" />);
    expect(screen.getByRole("link", { name: "Work" })).toHaveAttribute("href", "../../#work");
    expect(screen.getByRole("link", { name: "Process" })).toHaveAttribute("href", "../../#process");
    expect(screen.getByRole("link", { name: "Studio" })).toHaveAttribute("href", "../../#studio");
    expect(screen.getByRole("link", { name: "Start a project →" })).toHaveAttribute("href", "../../#contact");
    expect(screen.getByRole("link", { name: "Hatch n Harvest — home" })).toHaveAttribute("href", "../../#top");
  });
});
```

- [ ] **Step 2: Write failing test for `Footer` with `homeHref`**

Create `next-app/tests/case-study/Footer-homeHref.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Footer } from "@/components/Footer";

describe("Footer homeHref", () => {
  it("defaults logo link to bare hash when homeHref omitted", () => {
    render(<Footer />);
    expect(screen.getByRole("link", { name: "Hatch n Harvest — home" })).toHaveAttribute("href", "#top");
  });

  it("prefixes logo link with homeHref when provided", () => {
    render(<Footer homeHref="../../" />);
    expect(screen.getByRole("link", { name: "Hatch n Harvest — home" })).toHaveAttribute("href", "../../#top");
  });
});
```

- [ ] **Step 3: Run new tests to verify they fail**

Run: `npm run test -- Nav-homeHref Footer-homeHref`
Expected: FAIL — `Nav` and `Footer` do not yet accept `homeHref`.

- [ ] **Step 4: Update `components/Nav.tsx`**

Replace the entire contents of `next-app/components/Nav.tsx` with:

```tsx
export function Nav({ homeHref = "" }: { homeHref?: string }) {
  return (
    <header className="nav">
      <div className="wrap nav-inner">
        <a href={`${homeHref}#top`} className="logo" aria-label="Hatch n Harvest — home">
          <img className="logo-icon" src={`${homeHref}assets/brand/icon-main.svg`} alt="" aria-hidden="true" />
          <img className="logo-wordmark" src={`${homeHref}assets/brand/wordmark.svg`} alt="Hatch n Harvest" />
        </a>
        <nav className="nav-links" aria-label="Primary">
          <a href={`${homeHref}#work`}>Work</a>
          <a href={`${homeHref}#process`}>Process</a>
          <a href={`${homeHref}#studio`}>Studio</a>
        </nav>
        <a href={`${homeHref}#contact`} className="nav-cta">Start a project →</a>
      </div>
    </header>
  );
}
```

Note: the logo `<img>` `src` attributes also use `homeHref` because asset paths are likewise relative to the served page.

- [ ] **Step 5: Update `components/Footer.tsx`**

Replace the entire contents of `next-app/components/Footer.tsx` with:

```tsx
export function Footer({ homeHref = "" }: { homeHref?: string }) {
  return (
    <footer>
      <div className="wrap">
        <div className="footer-lockup">
          <a href={`${homeHref}#top`} aria-label="Hatch n Harvest — home">
            <img
              className="logo-icon"
              src={`${homeHref}assets/brand/icon-main.svg`}
              alt=""
              aria-hidden="true"
            />
            <img
              className="logo-wordmark"
              src={`${homeHref}assets/brand/wordmark.svg`}
              alt="Hatch n Harvest"
            />
          </a>
        </div>
      </div>
      <div className="wrap footer-inner">
        <div>© 2026 Hatch &amp; Harvest · Taipei, Taiwan</div>
        <nav className="footer-links" aria-label="Footer">
          <a href="mailto:hello@hatchnharvest.studio">Email</a>
          <a href="#">Instagram</a>
          <a href="#">LinkedIn</a>
          <a href="#">Are.na</a>
        </nav>
      </div>
    </footer>
  );
}
```

- [ ] **Step 6: Run tests to verify they pass**

Run: `npm run test`
Expected: all tests pass, including the two new `Nav-homeHref` and `Footer-homeHref` files and the existing homepage smoke tests (which call `<Nav />` without the prop).

- [ ] **Step 7: Run typecheck**

Run: `npm run typecheck`
Expected: clean.

- [ ] **Step 8: Commit**

```bash
git add components/Nav.tsx components/Footer.tsx tests/case-study/Nav-homeHref.test.tsx tests/case-study/Footer-homeHref.test.tsx
git commit -m "Add homeHref prop to Nav and Footer for case-study reuse"
```

---

## Task 3: `CaseStudyShell` primitive

The shell wraps a case study with `Nav`, a `<main>` element, and `Footer`. It accepts an optional `brandVars` object to inject per-case CSS variables on the wrapper element.

**Files:**
- Create: `next-app/components/case-study/CaseStudyShell.tsx`
- Create: `next-app/tests/case-study/CaseStudyShell.test.tsx`
- Modify: `next-app/app/globals.css` (append rules to the CASE STUDIES section)

- [ ] **Step 1: Write failing test**

Create `next-app/tests/case-study/CaseStudyShell.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { CaseStudyShell } from "@/components/case-study/CaseStudyShell";

describe("CaseStudyShell", () => {
  it("renders Nav, main, Footer, and children", () => {
    render(
      <CaseStudyShell>
        <p>case-content</p>
      </CaseStudyShell>
    );
    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByRole("main")).toBeInTheDocument();
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
    expect(screen.getByText("case-content")).toBeInTheDocument();
  });

  it("passes homeHref through to Nav and Footer", () => {
    render(
      <CaseStudyShell>
        <p>x</p>
      </CaseStudyShell>
    );
    expect(screen.getByRole("link", { name: "Work" })).toHaveAttribute("href", "../../#work");
    // Footer logo (use the contentinfo region to disambiguate from Nav logo).
    const footer = screen.getByRole("contentinfo");
    const footerHome = footer.querySelector('a[aria-label="Hatch n Harvest — home"]');
    expect(footerHome).toHaveAttribute("href", "../../#top");
  });

  it("applies brandVars as inline style on the wrapper", () => {
    const { container } = render(
      <CaseStudyShell brandVars={{ "--afa-yellow": "#FFC200" } as React.CSSProperties}>
        <p>x</p>
      </CaseStudyShell>
    );
    const wrapper = container.querySelector(".case-study-shell") as HTMLElement;
    expect(wrapper).not.toBeNull();
    expect(wrapper.style.getPropertyValue("--afa-yellow")).toBe("#FFC200");
  });
});
```

- [ ] **Step 2: Run new test to verify it fails**

Run: `npm run test -- CaseStudyShell`
Expected: FAIL — module does not exist.

- [ ] **Step 3: Implement `CaseStudyShell`**

Create `next-app/components/case-study/CaseStudyShell.tsx`:

```tsx
import type { CSSProperties, ReactNode } from "react";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

export function CaseStudyShell({
  brandVars,
  children,
}: {
  brandVars?: CSSProperties;
  children: ReactNode;
}) {
  return (
    <div className="case-study-shell" style={brandVars}>
      <Nav homeHref="../../" />
      <main>{children}</main>
      <Footer homeHref="../../" />
    </div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- CaseStudyShell`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add components/case-study/CaseStudyShell.tsx tests/case-study/CaseStudyShell.test.tsx
git commit -m "Add CaseStudyShell primitive"
```

---

## Task 4: `CaseHero` primitive

Renders the title block + meta grid that opens every case study.

**Files:**
- Create: `next-app/components/case-study/CaseHero.tsx`
- Create: `next-app/tests/case-study/CaseHero.test.tsx`
- Modify: `next-app/app/globals.css`

**Reference HTML (from existing `acceleration-for-all.html`):** the `<section class="case-hero">` containing `case-hero-kicker`, `<h1>`, and `case-meta-grid` with rows of `meta-label` / `meta-value`.

- [ ] **Step 1: Write failing test**

Create `next-app/tests/case-study/CaseHero.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { CaseHero } from "@/components/case-study/CaseHero";

describe("CaseHero", () => {
  it("renders title, kicker, and all meta pairs", () => {
    render(
      <CaseHero
        kicker="A test kicker line."
        title="Test Case"
        meta={[
          { label: "Client", value: "Test Co" },
          { label: "Role", value: "Identity · Campaign" },
          { label: "Year", value: "2025" },
        ]}
      />
    );
    expect(screen.getByRole("heading", { level: 1, name: "Test Case" })).toBeInTheDocument();
    expect(screen.getByText("A test kicker line.")).toBeInTheDocument();
    expect(screen.getByText("Client")).toBeInTheDocument();
    expect(screen.getByText("Test Co")).toBeInTheDocument();
    expect(screen.getByText("Role")).toBeInTheDocument();
    expect(screen.getByText("Identity · Campaign")).toBeInTheDocument();
    expect(screen.getByText("Year")).toBeInTheDocument();
    expect(screen.getByText("2025")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- CaseHero`
Expected: FAIL — module does not exist.

- [ ] **Step 3: Implement `CaseHero`**

Create `next-app/components/case-study/CaseHero.tsx`:

```tsx
export function CaseHero({
  kicker,
  title,
  meta,
}: {
  kicker: string;
  title: string;
  meta: Array<{ label: string; value: string }>;
}) {
  return (
    <section className="case-hero">
      <div className="wrap">
        <p className="case-hero-kicker">{kicker}</p>
        <h1>{title}</h1>
        <dl className="case-meta-grid">
          {meta.map((row) => (
            <div className="case-meta-row" key={row.label}>
              <dt className="case-meta-label">{row.label}</dt>
              <dd className="case-meta-value">{row.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- CaseHero`
Expected: PASS.

- [ ] **Step 5: Add `CaseHero` styles to `app/globals.css`**

Open `next-app/public/work/acceleration-for-all.html` and locate the inline `<style>` rules under the comment block "CASE-HERO" (or the rules whose selectors begin `.case-hero`, `.case-hero-kicker`, `.case-meta-grid`, `.case-meta-label`, `.case-meta-value`). Copy those rules into the CASE STUDIES section of `app/globals.css`, immediately after the `.case-study-shell` block. Update class names if necessary so they match the JSX above (`case-meta-row` is new — copy `.case-meta-grid > div` styles or equivalent into `.case-meta-row`).

If the source HTML uses any tokens that don't exist in `globals.css` (`--paper`, `--ink`, etc. exist; verify before copying), either reuse the existing token or define a new one in `:root` of `globals.css`.

- [ ] **Step 6: Run typecheck and full test suite**

Run: `npm run typecheck && npm run test`
Expected: clean + all tests pass.

- [ ] **Step 7: Commit**

```bash
git add components/case-study/CaseHero.tsx tests/case-study/CaseHero.test.tsx app/globals.css
git commit -m "Add CaseHero primitive"
```

---

## Task 5: `CaseBleed` primitive

Renders an edge-to-edge or wide image with optional caption.

**Files:**
- Create: `next-app/components/case-study/CaseBleed.tsx`
- Create: `next-app/tests/case-study/CaseBleed.test.tsx`
- Modify: `next-app/app/globals.css`

- [ ] **Step 1: Write failing test**

Create `next-app/tests/case-study/CaseBleed.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { CaseBleed } from "@/components/case-study/CaseBleed";

describe("CaseBleed", () => {
  it("renders the image with src and alt", () => {
    render(<CaseBleed src="../../assets/work/x/hero.jpg" alt="Hero shot" />);
    const img = screen.getByAltText("Hero shot") as HTMLImageElement;
    expect(img).toBeInTheDocument();
    expect(img.getAttribute("src")).toBe("../../assets/work/x/hero.jpg");
  });

  it("defaults to the 'full' variant class", () => {
    const { container } = render(<CaseBleed src="x" alt="" />);
    expect(container.querySelector(".case-bleed.case-bleed-full")).not.toBeNull();
  });

  it("applies the 'wide' variant class when variant='wide'", () => {
    const { container } = render(<CaseBleed src="x" alt="" variant="wide" />);
    expect(container.querySelector(".case-bleed.case-bleed-wide")).not.toBeNull();
  });

  it("renders a caption when provided", () => {
    render(<CaseBleed src="x" alt="" caption="A caption" />);
    expect(screen.getByText("A caption")).toBeInTheDocument();
  });

  it("renders no <figcaption> when caption omitted", () => {
    const { container } = render(<CaseBleed src="x" alt="" />);
    expect(container.querySelector("figcaption")).toBeNull();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- CaseBleed`
Expected: FAIL — module does not exist.

- [ ] **Step 3: Implement `CaseBleed`**

Create `next-app/components/case-study/CaseBleed.tsx`:

```tsx
export function CaseBleed({
  src,
  alt,
  caption,
  variant = "full",
}: {
  src: string;
  alt: string;
  caption?: string;
  variant?: "full" | "wide";
}) {
  return (
    <figure className={`case-bleed case-bleed-${variant}`}>
      <img src={src} alt={alt} loading="lazy" />
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- CaseBleed`
Expected: PASS.

- [ ] **Step 5: Add `CaseBleed` styles to `app/globals.css`**

In the source HTML's `<style>` block, locate the rules for `.case-bleed`. Copy them into the CASE STUDIES section of `app/globals.css`. Add new `.case-bleed-full` and `.case-bleed-wide` rules:

```css
.case-bleed-full { /* edge-to-edge — width: 100vw, margin-left: 50% - 50vw, etc. */ }
.case-bleed-wide { /* constrained to a wider-than-text container, e.g. max-width: var(--maxw); */ }
.case-bleed figcaption { /* small caption styling */ }
```

Use the source HTML's `.case-bleed` rule as the basis for `.case-bleed-full` (preserving the bleed effect). For `.case-bleed-wide`, write a tighter rule capped at `--maxw` (1240px) and centered.

- [ ] **Step 6: Run full test suite**

Run: `npm run test`
Expected: all tests pass.

- [ ] **Step 7: Commit**

```bash
git add components/case-study/CaseBleed.tsx tests/case-study/CaseBleed.test.tsx app/globals.css
git commit -m "Add CaseBleed primitive"
```

---

## Task 6: `CaseSection` primitive

Workhorse text section with optional eyebrow + heading and a width variant.

**Files:**
- Create: `next-app/components/case-study/CaseSection.tsx`
- Create: `next-app/tests/case-study/CaseSection.test.tsx`
- Modify: `next-app/app/globals.css`

- [ ] **Step 1: Write failing test**

Create `next-app/tests/case-study/CaseSection.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { CaseSection } from "@/components/case-study/CaseSection";

describe("CaseSection", () => {
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

  it("omits eyebrow and heading when not provided", () => {
    const { container } = render(
      <CaseSection>
        <p>Body only.</p>
      </CaseSection>
    );
    expect(container.querySelector(".eyebrow")).toBeNull();
    expect(container.querySelector("h2")).toBeNull();
    expect(screen.getByText("Body only.")).toBeInTheDocument();
  });

  it("applies the default variant class when variant omitted", () => {
    const { container } = render(<CaseSection><p>x</p></CaseSection>);
    expect(container.querySelector(".case-section.case-section-default")).not.toBeNull();
  });

  it("applies the narrow variant class", () => {
    const { container } = render(<CaseSection variant="narrow"><p>x</p></CaseSection>);
    expect(container.querySelector(".case-section.case-section-narrow")).not.toBeNull();
  });

  it("applies the wide variant class", () => {
    const { container } = render(<CaseSection variant="wide"><p>x</p></CaseSection>);
    expect(container.querySelector(".case-section.case-section-wide")).not.toBeNull();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- CaseSection`
Expected: FAIL.

- [ ] **Step 3: Implement `CaseSection`**

Create `next-app/components/case-study/CaseSection.tsx`:

```tsx
import type { ReactNode } from "react";

export function CaseSection({
  eyebrow,
  heading,
  variant = "default",
  children,
}: {
  eyebrow?: string;
  heading?: string;
  variant?: "default" | "narrow" | "wide";
  children: ReactNode;
}) {
  return (
    <section className={`case-section case-section-${variant}`}>
      <div className="wrap">
        {eyebrow ? <div className="eyebrow">{eyebrow}</div> : null}
        {heading ? <h2>{heading}</h2> : null}
        <div className="case-section-body">{children}</div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- CaseSection`
Expected: PASS.

- [ ] **Step 5: Add `CaseSection` styles to `app/globals.css`**

Add to the CASE STUDIES section:

```css
.case-section { padding: clamp(48px, 8vw, 120px) 0; }
.case-section .wrap { max-width: var(--maxw); margin: 0 auto; padding: 0 var(--pad); }
.case-section-narrow .case-section-body { max-width: var(--maxw-text); }
.case-section-default .case-section-body { max-width: 980px; }
.case-section-wide .case-section-body { max-width: var(--maxw); }
.case-section .eyebrow { margin-bottom: 0.75rem; }
.case-section h2 { margin-bottom: 1.25rem; }
```

Adjust paddings to match the visual rhythm of the source HTML — open `acceleration-for-all.html` and reference the existing `.problem`, `.work-intro`, `.work-section` rules to calibrate.

- [ ] **Step 6: Run full test suite**

Run: `npm run test`
Expected: all tests pass.

- [ ] **Step 7: Commit**

```bash
git add components/case-study/CaseSection.tsx tests/case-study/CaseSection.test.tsx app/globals.css
git commit -m "Add CaseSection primitive"
```

---

## Task 7: `PullQuote` primitive

**Files:**
- Create: `next-app/components/case-study/PullQuote.tsx`
- Create: `next-app/tests/case-study/PullQuote.test.tsx`
- Modify: `next-app/app/globals.css`

- [ ] **Step 1: Write failing test**

Create `next-app/tests/case-study/PullQuote.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PullQuote } from "@/components/case-study/PullQuote";

describe("PullQuote", () => {
  it("renders quote text", () => {
    render(<PullQuote>Some pithy line.</PullQuote>);
    expect(screen.getByText("Some pithy line.")).toBeInTheDocument();
  });

  it("renders attribution when provided", () => {
    render(<PullQuote attribution="— Anon">Some line.</PullQuote>);
    expect(screen.getByText("— Anon")).toBeInTheDocument();
  });

  it("omits attribution element when not provided", () => {
    const { container } = render(<PullQuote>Some line.</PullQuote>);
    expect(container.querySelector(".pull-quote-attr")).toBeNull();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- PullQuote`
Expected: FAIL.

- [ ] **Step 3: Implement `PullQuote`**

Create `next-app/components/case-study/PullQuote.tsx`:

```tsx
import type { ReactNode } from "react";

export function PullQuote({
  children,
  attribution,
}: {
  children: ReactNode;
  attribution?: string;
}) {
  return (
    <blockquote className="pull-quote">
      <p>{children}</p>
      {attribution ? <cite className="pull-quote-attr">{attribution}</cite> : null}
    </blockquote>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- PullQuote`
Expected: PASS.

- [ ] **Step 5: Add `PullQuote` styles to `app/globals.css`**

Add to the CASE STUDIES section:

```css
.pull-quote {
  margin: 2.5rem auto;
  max-width: var(--maxw-text);
  font-family: var(--font-display);
  font-weight: 700;
  font-size: clamp(22px, 2.6vw, 34px);
  line-height: 1.2;
  color: var(--ink);
}
.pull-quote p { margin: 0 0 0.75rem; }
.pull-quote-attr {
  display: block;
  font-family: var(--font-body);
  font-style: normal;
  font-weight: 500;
  font-size: 0.9rem;
  color: var(--stone);
}
```

If the source HTML has rules for an existing pull-quote-like element (search for `quote` or `manifesto` selectors in `acceleration-for-all.html`), use those values to calibrate the typographic scale.

- [ ] **Step 6: Run full test suite**

Run: `npm run test`
Expected: all pass.

- [ ] **Step 7: Commit**

```bash
git add components/case-study/PullQuote.tsx tests/case-study/PullQuote.test.tsx app/globals.css
git commit -m "Add PullQuote primitive"
```

---

## Task 8: `MetricsRow` primitive

**Files:**
- Create: `next-app/components/case-study/MetricsRow.tsx`
- Create: `next-app/tests/case-study/MetricsRow.test.tsx`
- Modify: `next-app/app/globals.css`

- [ ] **Step 1: Write failing test**

Create `next-app/tests/case-study/MetricsRow.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MetricsRow } from "@/components/case-study/MetricsRow";

describe("MetricsRow", () => {
  it("renders all metric values and labels", () => {
    render(
      <MetricsRow
        metrics={[
          { value: "1,500+", label: "Pitches received" },
          { value: "5", label: "Award categories" },
          { value: "Live", label: "Award ceremony" },
        ]}
      />
    );
    expect(screen.getByText("1,500+")).toBeInTheDocument();
    expect(screen.getByText("Pitches received")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText("Award categories")).toBeInTheDocument();
    expect(screen.getByText("Live")).toBeInTheDocument();
    expect(screen.getByText("Award ceremony")).toBeInTheDocument();
  });

  it("renders one .metric element per metric", () => {
    const { container } = render(
      <MetricsRow metrics={[{ value: "1", label: "a" }, { value: "2", label: "b" }]} />
    );
    expect(container.querySelectorAll(".metric").length).toBe(2);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- MetricsRow`
Expected: FAIL.

- [ ] **Step 3: Implement `MetricsRow`**

Create `next-app/components/case-study/MetricsRow.tsx`:

```tsx
export function MetricsRow({
  metrics,
}: {
  metrics: Array<{ value: string; label: string }>;
}) {
  return (
    <div className="metrics-row">
      {metrics.map((m) => (
        <div className="metric" key={`${m.value}-${m.label}`}>
          <div className="metric-num">{m.value}</div>
          <div className="metric-label">{m.label}</div>
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- MetricsRow`
Expected: PASS.

- [ ] **Step 5: Add `MetricsRow` styles to `app/globals.css`**

Locate the existing `.metrics-row`, `.metric`, `.metric-num`, `.metric-label` rules in the source HTML (`acceleration-for-all.html`) and copy them into the CASE STUDIES section of `app/globals.css`. They should match what AfA used so the visual is preserved.

- [ ] **Step 6: Run full test suite**

Run: `npm run test`
Expected: all pass.

- [ ] **Step 7: Commit**

```bash
git add components/case-study/MetricsRow.tsx tests/case-study/MetricsRow.test.tsx app/globals.css
git commit -m "Add MetricsRow primitive"
```

---

## Task 9: `ColorSwatchGrid` primitive

**Files:**
- Create: `next-app/components/case-study/ColorSwatchGrid.tsx`
- Create: `next-app/tests/case-study/ColorSwatchGrid.test.tsx`
- Modify: `next-app/app/globals.css`

- [ ] **Step 1: Write failing test**

Create `next-app/tests/case-study/ColorSwatchGrid.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ColorSwatchGrid } from "@/components/case-study/ColorSwatchGrid";

describe("ColorSwatchGrid", () => {
  it("renders all swatches with name + hex", () => {
    render(
      <ColorSwatchGrid
        swatches={[
          { name: "Yellow", hex: "#FFC200", fg: "var(--afa-navy)" },
          { name: "Coral", hex: "#FD6051", fg: "#fff" },
          { name: "White", hex: "#FFFFFF", fg: "var(--afa-navy)", border: true },
        ]}
      />
    );
    expect(screen.getByText("Yellow")).toBeInTheDocument();
    expect(screen.getByText("#FFC200")).toBeInTheDocument();
    expect(screen.getByText("Coral")).toBeInTheDocument();
    expect(screen.getByText("#FD6051")).toBeInTheDocument();
    expect(screen.getByText("White")).toBeInTheDocument();
    expect(screen.getByText("#FFFFFF")).toBeInTheDocument();
  });

  it("applies background, foreground, and border styles", () => {
    const { container } = render(
      <ColorSwatchGrid
        swatches={[
          { name: "White", hex: "#FFFFFF", fg: "var(--afa-navy)", border: true },
        ]}
      />
    );
    const swatch = container.querySelector(".swatch") as HTMLElement;
    expect(swatch.style.backgroundColor).toBe("rgb(255, 255, 255)");
    expect(swatch.style.color).toBe("var(--afa-navy)");
    expect(swatch.classList.contains("swatch-bordered")).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- ColorSwatchGrid`
Expected: FAIL.

- [ ] **Step 3: Implement `ColorSwatchGrid`**

Create `next-app/components/case-study/ColorSwatchGrid.tsx`:

```tsx
export function ColorSwatchGrid({
  swatches,
}: {
  swatches: Array<{ name: string; hex: string; fg?: string; border?: boolean }>;
}) {
  return (
    <div className="palette-strip">
      <div className="palette-strip-inner">
        {swatches.map((s) => (
          <div
            key={s.name}
            className={`swatch${s.border ? " swatch-bordered" : ""}`}
            style={{ backgroundColor: s.hex, color: s.fg ?? "inherit" }}
          >
            <span className="swatch-name">{s.name}</span>
            <span className="swatch-hex">{s.hex}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- ColorSwatchGrid`
Expected: PASS.

- [ ] **Step 5: Add `ColorSwatchGrid` styles to `app/globals.css`**

Locate the existing `.palette-strip`, `.palette-strip-inner`, `.swatch`, `.swatch-name`, `.swatch-hex` rules in `acceleration-for-all.html`'s inline `<style>` block and copy them into the CASE STUDIES section of `app/globals.css`. Add a new `.swatch-bordered` rule:

```css
.swatch-bordered { box-shadow: inset 0 0 0 1px var(--line); }
```

- [ ] **Step 6: Run full test suite**

Run: `npm run test`
Expected: all pass.

- [ ] **Step 7: Commit**

```bash
git add components/case-study/ColorSwatchGrid.tsx tests/case-study/ColorSwatchGrid.test.tsx app/globals.css
git commit -m "Add ColorSwatchGrid primitive"
```

---

## Task 10: `ImageGrid` primitive

**Files:**
- Create: `next-app/components/case-study/ImageGrid.tsx`
- Create: `next-app/tests/case-study/ImageGrid.test.tsx`
- Modify: `next-app/app/globals.css`

- [ ] **Step 1: Write failing test**

Create `next-app/tests/case-study/ImageGrid.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ImageGrid } from "@/components/case-study/ImageGrid";

describe("ImageGrid", () => {
  it("renders all items with src and alt", () => {
    render(
      <ImageGrid
        items={[
          { src: "../../assets/work/x/a.jpg", alt: "A" },
          { src: "../../assets/work/x/b.jpg", alt: "B" },
        ]}
      />
    );
    expect(screen.getByAltText("A")).toBeInTheDocument();
    expect(screen.getByAltText("B")).toBeInTheDocument();
  });

  it("renders captions when provided", () => {
    render(
      <ImageGrid
        items={[
          { src: "x", alt: "A", caption: "Caption A" },
          { src: "y", alt: "B" },
        ]}
      />
    );
    expect(screen.getByText("Caption A")).toBeInTheDocument();
  });

  it("defaults to 3 columns", () => {
    const { container } = render(
      <ImageGrid items={[{ src: "x", alt: "A" }]} />
    );
    expect(container.querySelector(".image-grid.image-grid-3")).not.toBeNull();
  });

  it("applies the requested column class", () => {
    const { container } = render(
      <ImageGrid columns={5} items={[{ src: "x", alt: "A" }]} />
    );
    expect(container.querySelector(".image-grid.image-grid-5")).not.toBeNull();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- ImageGrid`
Expected: FAIL.

- [ ] **Step 3: Implement `ImageGrid`**

Create `next-app/components/case-study/ImageGrid.tsx`:

```tsx
export function ImageGrid({
  items,
  columns = 3,
}: {
  items: Array<{ src: string; alt: string; caption?: string }>;
  columns?: 2 | 3 | 4 | 5;
}) {
  return (
    <div className={`image-grid image-grid-${columns}`}>
      {items.map((item, i) => (
        <figure className="image-grid-item" key={`${item.src}-${i}`}>
          <img src={item.src} alt={item.alt} loading="lazy" />
          {item.caption ? <figcaption>{item.caption}</figcaption> : null}
        </figure>
      ))}
    </div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- ImageGrid`
Expected: PASS.

- [ ] **Step 5: Add `ImageGrid` styles to `app/globals.css`**

Add to the CASE STUDIES section:

```css
.image-grid {
  display: grid;
  gap: clamp(8px, 1.5vw, 16px);
  margin: clamp(24px, 4vw, 48px) auto;
  max-width: var(--maxw);
  padding: 0 var(--pad);
}
.image-grid-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.image-grid-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
.image-grid-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
.image-grid-5 { grid-template-columns: repeat(5, minmax(0, 1fr)); }
@media (max-width: 720px) {
  .image-grid-3, .image-grid-4, .image-grid-5 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
.image-grid-item { margin: 0; }
.image-grid-item img { border-radius: var(--radius-md); }
.image-grid-item figcaption {
  margin-top: 0.5rem;
  font-size: 0.85rem;
  color: var(--stone);
}
```

If the source HTML defines `gallery-five` or `ubp-docuseries` rules with different gap/border-radius values, prefer those values to keep visual parity.

- [ ] **Step 6: Run full test suite**

Run: `npm run test`
Expected: all pass.

- [ ] **Step 7: Commit**

```bash
git add components/case-study/ImageGrid.tsx tests/case-study/ImageGrid.test.tsx app/globals.css
git commit -m "Add ImageGrid primitive"
```

---

## Task 11: `NextProject` primitive

Cross-link footer to the next case study.

**Files:**
- Create: `next-app/components/case-study/NextProject.tsx`
- Create: `next-app/tests/case-study/NextProject.test.tsx`
- Modify: `next-app/app/globals.css`

- [ ] **Step 1: Write failing test**

Create `next-app/tests/case-study/NextProject.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { NextProject } from "@/components/case-study/NextProject";

describe("NextProject", () => {
  it("renders link with correct href, name, one-liner, and image", () => {
    render(
      <NextProject
        href="../united-by-play/"
        name="United by Play"
        oneLiner="A global gaming campaign."
        image="../../assets/work/united-by-play/title-no-matter-how-you-game.jpg"
      />
    );
    const link = screen.getByRole("link", { name: /United by Play/ });
    expect(link).toHaveAttribute("href", "../united-by-play/");
    expect(screen.getByText("United by Play")).toBeInTheDocument();
    expect(screen.getByText("A global gaming campaign.")).toBeInTheDocument();
    const img = screen.getByAltText("United by Play case study cover image") as HTMLImageElement;
    expect(img.getAttribute("src")).toBe("../../assets/work/united-by-play/title-no-matter-how-you-game.jpg");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- NextProject`
Expected: FAIL.

- [ ] **Step 3: Implement `NextProject`**

Create `next-app/components/case-study/NextProject.tsx`:

```tsx
export function NextProject({
  href,
  name,
  oneLiner,
  image,
}: {
  href: string;
  name: string;
  oneLiner: string;
  image: string;
}) {
  return (
    <section className="next-project-section">
      <a className="next-project-card" href={href} aria-label={`Next case study: ${name}`}>
        <div className="next-project-image">
          <img src={image} alt={`${name} case study cover image`} loading="lazy" />
        </div>
        <div className="next-project-meta">
          <div className="eyebrow">Next case study</div>
          <h3 className="next-project-name">{name}</h3>
          <p className="next-project-oneliner">{oneLiner}</p>
        </div>
      </a>
    </section>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- NextProject`
Expected: PASS.

- [ ] **Step 5: Add `NextProject` styles to `app/globals.css`**

Locate the existing `.next-project-section` rule(s) in the source HTML's inline `<style>` block (search for `next-project`). Copy those rules into the CASE STUDIES section of `app/globals.css`. Add the additional sub-element rules used in this component:

```css
.next-project-card {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: clamp(16px, 3vw, 32px);
  align-items: center;
  max-width: var(--maxw);
  margin: 0 auto;
  padding: clamp(48px, 8vw, 120px) var(--pad);
}
.next-project-image img { border-radius: var(--radius-md); }
.next-project-name { font-size: clamp(28px, 4vw, 48px); margin: 0.25rem 0 0.5rem; }
.next-project-oneliner { color: var(--stone); }
@media (max-width: 720px) {
  .next-project-card { grid-template-columns: 1fr; }
}
```

If the source HTML's `.next-project-section` rules already cover most of this, prefer those values.

- [ ] **Step 6: Run full test suite**

Run: `npm run test`
Expected: all pass.

- [ ] **Step 7: Commit**

```bash
git add components/case-study/NextProject.tsx tests/case-study/NextProject.test.tsx app/globals.css
git commit -m "Add NextProject primitive"
```

---

## Task 12: Port Acceleration For All — page skeleton + hero

Port the AfA case study in three chunks. This task creates the page file with metadata, the per-case brand-vars object, the shell, the hero, and the first full-bleed image. It also creates the smoke test stub that subsequent AfA tasks will extend.

**Files:**
- Create: `next-app/app/work/acceleration-for-all/page.tsx`
- Create: `next-app/tests/case-study/acceleration-for-all.test.tsx`

**Source content:** `next-app/public/work/acceleration-for-all.html`

- [ ] **Step 1: Read the source HTML to extract content for this chunk**

Open `next-app/public/work/acceleration-for-all.html` and locate:
- the `<title>` and `<meta name="description">`
- the `<section class="case-hero">` block — kicker, h1, meta-grid rows
- the `<div class="case-bleed">` immediately following the hero
- the AfA brand variable definitions in `:root` (the `--afa-*` block)

Copy the literal text content for use in the JSX and tests below.

- [ ] **Step 2: Write the failing smoke test**

Create `next-app/tests/case-study/acceleration-for-all.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import AccelerationForAllPage from "@/app/work/acceleration-for-all/page";

describe("Acceleration For All page", () => {
  it("renders without crashing with shell, main, and footer", () => {
    render(<AccelerationForAllPage />);
    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByRole("main")).toBeInTheDocument();
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  });

  it("renders the title heading", () => {
    render(<AccelerationForAllPage />);
    expect(screen.getByRole("heading", { level: 1, name: "Acceleration For All" })).toBeInTheDocument();
  });

  it("renders the meta grid client/role/year", () => {
    render(<AccelerationForAllPage />);
    expect(screen.getByText("ViewSonic × Hustle Fund")).toBeInTheDocument();
    expect(screen.getByText("2021")).toBeInTheDocument();
  });

  it("nav links point at homepage anchors via ../../", () => {
    render(<AccelerationForAllPage />);
    expect(screen.getByRole("link", { name: "Work" })).toHaveAttribute("href", "../../#work");
  });

  it("applies AfA brand vars on the shell wrapper", () => {
    const { container } = render(<AccelerationForAllPage />);
    const wrapper = container.querySelector(".case-study-shell") as HTMLElement;
    expect(wrapper.style.getPropertyValue("--afa-yellow")).toBe("#FFC200");
    expect(wrapper.style.getPropertyValue("--afa-coral")).toBe("#FD6051");
  });
});
```

- [ ] **Step 3: Run test to verify it fails**

Run: `npm run test -- acceleration-for-all`
Expected: FAIL — page module does not exist.

- [ ] **Step 4: Create the page**

Create `next-app/app/work/acceleration-for-all/page.tsx`:

```tsx
import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { CaseStudyShell } from "@/components/case-study/CaseStudyShell";
import { CaseHero } from "@/components/case-study/CaseHero";
import { CaseBleed } from "@/components/case-study/CaseBleed";

export const metadata: Metadata = {
  title: "Acceleration For All — ViewSonic × Hustle Fund · Hatch n Harvest",
  description:
    "A campaign, identity, and end-to-end experience for ViewSonic and Hustle Fund's joint accelerator — built to flatten the wall between watching and entering.",
};

const afaBrandVars = {
  "--afa-yellow": "#FFC200",
  "--afa-coral": "#FD6051",
  "--afa-white": "#FFFFFF",
  "--afa-paper": "#F0F4F7",
  "--afa-navy": "#1E2782",
  "--afa-red": "#990000",
  "--afa-purple-deep": "#9636A4",
  "--afa-teal": "#2FB2D6",
  "--afa-graphite": "#404555",
  "--afa-purple": "#6F59D8",
} as CSSProperties;

export default function AccelerationForAllPage() {
  return (
    <CaseStudyShell brandVars={afaBrandVars}>
      <CaseHero
        kicker="A partnership campaign rebuilding the on-ramp to entrepreneurship — for everyone the old accelerator playbook left out."
        title="Acceleration For All"
        meta={[
          { label: "Client", value: "ViewSonic × Hustle Fund" },
          { label: "Role", value: "Campaign · Identity · Film" },
          { label: "Year", value: "2021" },
        ]}
      />
      <CaseBleed
        src="../../assets/work/acceleration-for-all/kv-card.jpg"
        alt="Acceleration For All key visual — a colourful grid of 30 founders' faces around the campaign lockup."
      />
    </CaseStudyShell>
  );
}
```

If the source HTML's hero kicker / meta-grid rows differ from the values above, replace with the source's exact values.

- [ ] **Step 5: Run test to verify it passes**

Run: `npm run test -- acceleration-for-all`
Expected: PASS.

- [ ] **Step 6: Run typecheck**

Run: `npm run typecheck`
Expected: clean.

- [ ] **Step 7: Visual check in dev**

Start the dev server (background): `npm run dev`
Open `http://localhost:3000/hatch-n-harvest/work/acceleration-for-all/` in a browser.
Verify:
- Page renders with Nav at top, Footer at bottom.
- Hero title, kicker, and meta grid are visible.
- The `kv-card.jpg` image loads.
- Clicking "Work" in the nav goes to `/hatch-n-harvest/#work` (homepage's work section).

Stop the dev server when done.

- [ ] **Step 8: Commit**

```bash
git add app/work/acceleration-for-all/page.tsx tests/case-study/acceleration-for-all.test.tsx
git commit -m "Add Acceleration For All page (skeleton + hero)"
```

---

## Task 13: Port Acceleration For All — body sections (problem, work, palette)

Extend the AfA page with the problem section, the work-intro, the solution-manifesto, the work-section showcasing the brand visuals, and the color palette swatches.

**Files:**
- Modify: `next-app/app/work/acceleration-for-all/page.tsx`
- Modify: `next-app/tests/case-study/acceleration-for-all.test.tsx`

- [ ] **Step 1: Read the source HTML to extract content for this chunk**

In `next-app/public/work/acceleration-for-all.html`, locate the sequence of sections after the hero `<div class="case-bleed">`:
- `<section class="problem">` — eyebrow, heading, body paragraphs
- `<section class="work-intro">` — eyebrow, heading, body
- `<section class="work-section solution-manifesto">` — eyebrow, heading, body
- `<section class="work-section">` containing `.hero-stage` (a tighter image showcase) — image src and alt
- The `.palette-strip` block with 10 swatches

Note exact heading text and one body sentence per section to use as a test assertion.

- [ ] **Step 2: Extend the smoke test**

Append these `it` blocks to `tests/case-study/acceleration-for-all.test.tsx` inside the existing `describe`:

```tsx
  it("renders the Problem section heading", () => {
    render(<AccelerationForAllPage />);
    // Replace below with the exact heading text from the source HTML.
    expect(
      screen.getByRole("heading", { level: 2, name: /problem/i })
    ).toBeInTheDocument();
  });

  it("renders the palette swatches with all ten AfA colors", () => {
    render(<AccelerationForAllPage />);
    expect(screen.getByText("#FFC200")).toBeInTheDocument(); // Yellow
    expect(screen.getByText("#FD6051")).toBeInTheDocument(); // Coral
    expect(screen.getByText("#FFFFFF")).toBeInTheDocument(); // White
    expect(screen.getByText("#F0F4F7")).toBeInTheDocument(); // Paper
    expect(screen.getByText("#1E2782")).toBeInTheDocument(); // Navy
    expect(screen.getByText("#990000")).toBeInTheDocument(); // Deep Red
    expect(screen.getByText("#9636A4")).toBeInTheDocument(); // Purple
    expect(screen.getByText("#2FB2D6")).toBeInTheDocument(); // Teal
    expect(screen.getByText("#404555")).toBeInTheDocument(); // Graphite
    expect(screen.getByText("#6F59D8")).toBeInTheDocument(); // Lilac
  });
```

If the source HTML's "problem" section uses different heading wording, replace the regex `/problem/i` with the exact text after reading the HTML.

- [ ] **Step 3: Run test to verify the new assertions fail**

Run: `npm run test -- acceleration-for-all`
Expected: FAIL — palette swatches not yet rendered, problem heading not yet rendered.

- [ ] **Step 4: Extend the page with `CaseSection` blocks and `ColorSwatchGrid`**

Update the imports at the top of `app/work/acceleration-for-all/page.tsx`:

```tsx
import { CaseSection } from "@/components/case-study/CaseSection";
import { ColorSwatchGrid } from "@/components/case-study/ColorSwatchGrid";
```

Inside `<CaseStudyShell>`, after `<CaseBleed>`, add (replacing kicker/heading/body text with the literal source HTML content extracted in Step 1):

```tsx
<CaseSection eyebrow="The problem" heading="<exact problem heading from source>">
  <p>{/* exact problem body paragraphs, split per <p> from source */}</p>
</CaseSection>

<CaseSection eyebrow="The work" heading="<exact work-intro heading>">
  <p>{/* exact work-intro body */}</p>
</CaseSection>

<CaseSection eyebrow="The solution" heading="<exact solution-manifesto heading>">
  <p>{/* exact solution-manifesto body */}</p>
</CaseSection>

<CaseBleed
  src="../../assets/work/acceleration-for-all/<exact filename from source's hero-stage>"
  alt="<exact alt from source>"
  variant="wide"
/>

<ColorSwatchGrid
  swatches={[
    { name: "Yellow",   hex: "#FFC200", fg: "var(--afa-navy)" },
    { name: "Coral",    hex: "#FD6051", fg: "#fff" },
    { name: "White",    hex: "#FFFFFF", fg: "var(--afa-navy)", border: true },
    { name: "Paper",    hex: "#F0F4F7", fg: "var(--afa-navy)" },
    { name: "Navy",     hex: "#1E2782", fg: "#fff" },
    { name: "Deep Red", hex: "#990000", fg: "#fff" },
    { name: "Teal",     hex: "#2FB2D6", fg: "#fff" },
    { name: "Lilac",    hex: "#6F59D8", fg: "#fff" },
    { name: "Purple",   hex: "#9636A4", fg: "#fff" },
    { name: "Graphite", hex: "#404555", fg: "#fff" },
  ]}
/>
```

If the source HTML has a `solution-social` section between the palette and the outcome, include it as another `CaseSection` after the palette.

- [ ] **Step 5: Run test to verify it passes**

Run: `npm run test -- acceleration-for-all`
Expected: PASS.

- [ ] **Step 6: Visual check in dev**

`npm run dev` → open `http://localhost:3000/hatch-n-harvest/work/acceleration-for-all/`. Compare side-by-side with the original `http://localhost:3000/hatch-n-harvest/work/acceleration-for-all.html` (still served from `public/`). Verify body sections match in copy and visual layout. Verify palette swatches render with correct backgrounds and foreground text. Stop dev server.

- [ ] **Step 7: Commit**

```bash
git add app/work/acceleration-for-all/page.tsx tests/case-study/acceleration-for-all.test.tsx
git commit -m "Add Acceleration For All body sections + palette"
```

---

## Task 14: Port Acceleration For All — outcome, gallery, next-project

Extend the AfA page with the outcome section, the metrics row, the gallery-five image grid, and the cross-link to United by Play.

**Files:**
- Modify: `next-app/app/work/acceleration-for-all/page.tsx`
- Modify: `next-app/tests/case-study/acceleration-for-all.test.tsx`

- [ ] **Step 1: Read the source HTML to extract content for this chunk**

In `next-app/public/work/acceleration-for-all.html`, locate:
- `<section class="outcome results">` — eyebrow, heading, body
- The `.gallery-five` block — five image src + alt pairs
- The `.metrics-row` block — three metrics: 1,500+ / 5 / Live with their labels
- The `.next-project-section` block — link href, project name, one-liner, image src/alt

Note exact heading text and image filenames.

- [ ] **Step 2: Extend the smoke test**

Append to the existing `describe` block in `tests/case-study/acceleration-for-all.test.tsx`:

```tsx
  it("renders the three metrics", () => {
    render(<AccelerationForAllPage />);
    expect(screen.getByText("1,500+")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText("Live")).toBeInTheDocument();
  });

  it("renders the next-project link to United by Play", () => {
    render(<AccelerationForAllPage />);
    const nextLink = screen.getByRole("link", { name: /Next case study: United by Play/ });
    expect(nextLink).toHaveAttribute("href", "../united-by-play/");
  });
```

If the source HTML's metric labels differ from "1,500+" / "5" / "Live", replace those strings with the exact labels from the source.

- [ ] **Step 3: Run test to verify the new assertions fail**

Run: `npm run test -- acceleration-for-all`
Expected: FAIL — metrics and next-project link not yet rendered.

- [ ] **Step 4: Extend the page with the outcome, gallery, metrics, and `NextProject`**

Update imports:

```tsx
import { MetricsRow } from "@/components/case-study/MetricsRow";
import { ImageGrid } from "@/components/case-study/ImageGrid";
import { NextProject } from "@/components/case-study/NextProject";
```

After the palette swatches (and any solution-social section), append:

```tsx
<CaseSection eyebrow="Outcome" heading="<exact outcome heading from source>">
  <p>{/* exact outcome body */}</p>
</CaseSection>

<ImageGrid
  columns={5}
  items={[
    { src: "../../assets/work/acceleration-for-all/<filename-1>", alt: "<exact alt 1>" },
    { src: "../../assets/work/acceleration-for-all/<filename-2>", alt: "<exact alt 2>" },
    { src: "../../assets/work/acceleration-for-all/<filename-3>", alt: "<exact alt 3>" },
    { src: "../../assets/work/acceleration-for-all/<filename-4>", alt: "<exact alt 4>" },
    { src: "../../assets/work/acceleration-for-all/<filename-5>", alt: "<exact alt 5>" },
  ]}
/>

<MetricsRow
  metrics={[
    { value: "1,500+", label: "Pitches from over 30 industries around the world" },
    { value: "5",      label: "Award categories — Best B2B, Best Consumer, Best Creator, Best Frontier, People's Choice" },
    { value: "Live",   label: "Award ceremony hosted by comedian Irene Tu" },
  ]}
/>

<NextProject
  href="../united-by-play/"
  name="United by Play"
  oneLiner="A global ViewSonic campaign that challenged gaming stereotypes and proved we are all united by play."
  image="../../assets/work/united-by-play/title-no-matter-how-you-game.jpg"
/>
```

If the source's metric labels differ, copy the exact strings.

- [ ] **Step 5: Run test to verify it passes**

Run: `npm run test -- acceleration-for-all`
Expected: PASS.

- [ ] **Step 6: Run full test suite**

Run: `npm run test`
Expected: all tests pass.

- [ ] **Step 7: Visual check in dev**

`npm run dev` → open `http://localhost:3000/hatch-n-harvest/work/acceleration-for-all/`. Compare to the original HTML at `http://localhost:3000/hatch-n-harvest/work/acceleration-for-all.html`. Verify outcome section, gallery, metrics, and next-project card all render and visually match. Click the next-project card → confirm it navigates to `/work/united-by-play/` (which will 404 until Task 17 completes — that's expected). Stop dev server.

- [ ] **Step 8: Commit**

```bash
git add app/work/acceleration-for-all/page.tsx tests/case-study/acceleration-for-all.test.tsx
git commit -m "Complete Acceleration For All port (outcome, gallery, next-project)"
```

---

## Task 15: Port United by Play — page skeleton + hero

Same shape as Task 12 but for United by Play. UbP has no per-case brand variables (its visual identity uses the site's existing tokens), so `brandVars` is omitted.

**Files:**
- Create: `next-app/app/work/united-by-play/page.tsx`
- Create: `next-app/tests/case-study/united-by-play.test.tsx`

- [ ] **Step 1: Read the source HTML**

Open `next-app/public/work/united-by-play.html`. Extract:
- `<title>` and `<meta name="description">`
- The `<section class="case-hero">` content
- The hero `<div class="case-bleed">`'s image src and alt

Confirm whether UbP defines any per-case CSS variables in its inline `<style>` — if so, include them as a `ubpBrandVars` object analogous to AfA's. If not, omit `brandVars`.

- [ ] **Step 2: Write the failing smoke test**

Create `next-app/tests/case-study/united-by-play.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import UnitedByPlayPage from "@/app/work/united-by-play/page";

describe("United by Play page", () => {
  it("renders without crashing with shell, main, and footer", () => {
    render(<UnitedByPlayPage />);
    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByRole("main")).toBeInTheDocument();
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  });

  it("renders the title heading", () => {
    render(<UnitedByPlayPage />);
    expect(screen.getByRole("heading", { level: 1, name: "United by Play" })).toBeInTheDocument();
  });

  it("nav links point at homepage anchors via ../../", () => {
    render(<UnitedByPlayPage />);
    expect(screen.getByRole("link", { name: "Work" })).toHaveAttribute("href", "../../#work");
  });
});
```

- [ ] **Step 3: Run test to verify it fails**

Run: `npm run test -- united-by-play`
Expected: FAIL — module does not exist.

- [ ] **Step 4: Create the page**

Create `next-app/app/work/united-by-play/page.tsx`. Use this skeleton, replacing the `<exact …>` placeholders with literal content from the source HTML extracted in Step 1:

```tsx
import type { Metadata } from "next";
import { CaseStudyShell } from "@/components/case-study/CaseStudyShell";
import { CaseHero } from "@/components/case-study/CaseHero";
import { CaseBleed } from "@/components/case-study/CaseBleed";

export const metadata: Metadata = {
  title: "<exact UbP <title> from source>",
  description: "<exact UbP description from source>",
};

export default function UnitedByPlayPage() {
  return (
    <CaseStudyShell>
      <CaseHero
        kicker="A global campaign that challenged gaming stereotypes and proved that no matter how you play, we are all united by play."
        title="United by Play"
        meta={[
          { label: "Client", value: "ViewSonic" },
          { label: "Role", value: "Campaign · Manifesto · Docuseries" },
          { label: "Year", value: "2021" },
        ]}
      />
      <CaseBleed
        src="../../assets/work/united-by-play/title-no-matter-how-you-game.jpg"
        alt="<exact alt from source>"
      />
    </CaseStudyShell>
  );
}
```

If UbP defines per-case CSS vars, declare a `ubpBrandVars` object and pass it as `brandVars` on the shell.

- [ ] **Step 5: Run test to verify it passes**

Run: `npm run test -- united-by-play`
Expected: PASS.

- [ ] **Step 6: Run typecheck**

Run: `npm run typecheck`
Expected: clean.

- [ ] **Step 7: Visual check in dev**

`npm run dev` → open `http://localhost:3000/hatch-n-harvest/work/united-by-play/`. Verify hero renders correctly. Stop dev server.

- [ ] **Step 8: Commit**

```bash
git add app/work/united-by-play/page.tsx tests/case-study/united-by-play.test.tsx
git commit -m "Add United by Play page (skeleton + hero)"
```

---

## Task 16: Port United by Play — body sections (problem, solution, docuseries grids)

UbP has these body sections after the hero: `problem` (variant `ubp-problem`), `ubp-solution`, two `ubp-docuseries` blocks (the second carries `ubp-battle`).

**Files:**
- Modify: `next-app/app/work/united-by-play/page.tsx`
- Modify: `next-app/tests/case-study/united-by-play.test.tsx`

- [ ] **Step 1: Read the source HTML**

Open `next-app/public/work/united-by-play.html`. Locate the four sections listed above. Note headings, body copy, and the image grids' src/alt pairs (and captions if present).

- [ ] **Step 2: Extend the smoke test**

Append to `tests/case-study/united-by-play.test.tsx`'s existing `describe`:

```tsx
  it("renders the Problem section heading", () => {
    render(<UnitedByPlayPage />);
    expect(
      screen.getByRole("heading", { level: 2, name: /problem|stereotype/i })
    ).toBeInTheDocument();
  });

  it("renders the Solution / docuseries section heading", () => {
    render(<UnitedByPlayPage />);
    expect(
      screen.getByRole("heading", { level: 2, name: /docuseries|solution|play/i })
    ).toBeInTheDocument();
  });

  it("renders multiple docuseries thumbnails", () => {
    const { container } = render(<UnitedByPlayPage />);
    const figures = container.querySelectorAll(".image-grid-item");
    expect(figures.length).toBeGreaterThanOrEqual(4);
  });
```

Tighten the regexes once you've read the actual source headings; replace them with exact strings.

- [ ] **Step 3: Run test to verify the new assertions fail**

Run: `npm run test -- united-by-play`
Expected: FAIL.

- [ ] **Step 4: Extend the page**

Update imports in `app/work/united-by-play/page.tsx`:

```tsx
import { CaseSection } from "@/components/case-study/CaseSection";
import { ImageGrid } from "@/components/case-study/ImageGrid";
```

After the hero `<CaseBleed>`, add (replacing `<exact …>` placeholders with literal source content):

```tsx
<CaseSection eyebrow="The problem" heading="<exact ubp-problem heading>">
  <p>{/* exact body */}</p>
</CaseSection>

<CaseSection eyebrow="The solution" heading="<exact ubp-solution heading>">
  <p>{/* exact body */}</p>
</CaseSection>

<CaseSection eyebrow="The docuseries" heading="<exact docuseries heading>">
  <p>{/* exact body — the intro paragraph above the grid */}</p>
</CaseSection>

<ImageGrid
  columns={4}
  items={[
    { src: "../../assets/work/united-by-play/<docu-1>", alt: "<exact alt>", caption: "<exact caption>" },
    { src: "../../assets/work/united-by-play/<docu-2>", alt: "<exact alt>", caption: "<exact caption>" },
    { src: "../../assets/work/united-by-play/<docu-3>", alt: "<exact alt>", caption: "<exact caption>" },
    { src: "../../assets/work/united-by-play/<docu-4>", alt: "<exact alt>", caption: "<exact caption>" },
  ]}
/>

<CaseSection eyebrow="The battle" heading="<exact ubp-battle heading>">
  <p>{/* exact body */}</p>
</CaseSection>

<ImageGrid
  columns={3}
  items={[
    { src: "../../assets/work/united-by-play/<battle-1>", alt: "<exact alt>" },
    { src: "../../assets/work/united-by-play/<battle-2>", alt: "<exact alt>" },
    { src: "../../assets/work/united-by-play/<battle-3>", alt: "<exact alt>" },
  ]}
/>
```

Use the source's actual column counts — if `ubp-docuseries` originally rendered as 5 columns, set `columns={5}`. Match the source.

- [ ] **Step 5: Run test to verify it passes**

Run: `npm run test -- united-by-play`
Expected: PASS.

- [ ] **Step 6: Visual check in dev**

`npm run dev` → open `http://localhost:3000/hatch-n-harvest/work/united-by-play/`. Compare with the original at `http://localhost:3000/hatch-n-harvest/work/united-by-play.html`. Verify body sections and both docuseries grids match. Stop dev server.

- [ ] **Step 7: Commit**

```bash
git add app/work/united-by-play/page.tsx tests/case-study/united-by-play.test.tsx
git commit -m "Add United by Play body sections + docuseries grids"
```

---

## Task 17: Port United by Play — result + next-project

Extend UbP with the result section and the cross-link back to Acceleration For All.

**Files:**
- Modify: `next-app/app/work/united-by-play/page.tsx`
- Modify: `next-app/tests/case-study/united-by-play.test.tsx`

- [ ] **Step 1: Read the source HTML**

Locate `<section class="ubp-result">` — note heading, body, any media. Also verify there's a `next-project-section` to mirror; if absent in the source, the cross-link is still required.

- [ ] **Step 2: Extend the smoke test**

Append to `tests/case-study/united-by-play.test.tsx`:

```tsx
  it("renders the Result section heading", () => {
    render(<UnitedByPlayPage />);
    expect(
      screen.getByRole("heading", { level: 2, name: /result|outcome/i })
    ).toBeInTheDocument();
  });

  it("renders the next-project link to Acceleration For All", () => {
    render(<UnitedByPlayPage />);
    const nextLink = screen.getByRole("link", { name: /Next case study: Acceleration For All/ });
    expect(nextLink).toHaveAttribute("href", "../acceleration-for-all/");
  });
```

Replace regex with exact heading once read from source.

- [ ] **Step 3: Run test to verify the new assertions fail**

Run: `npm run test -- united-by-play`
Expected: FAIL.

- [ ] **Step 4: Extend the page**

Update imports:

```tsx
import { NextProject } from "@/components/case-study/NextProject";
```

After the battle `ImageGrid`, append:

```tsx
<CaseSection eyebrow="The result" heading="<exact ubp-result heading>">
  <p>{/* exact body */}</p>
</CaseSection>

<NextProject
  href="../acceleration-for-all/"
  name="Acceleration For All"
  oneLiner="A partnership campaign for ViewSonic × Hustle Fund — rebuilding the on-ramp to entrepreneurship for everyone the old playbook left out."
  image="../../assets/work/acceleration-for-all/kv-card.jpg"
/>
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npm run test -- united-by-play`
Expected: PASS.

- [ ] **Step 6: Run full test suite**

Run: `npm run test`
Expected: all tests pass.

- [ ] **Step 7: Visual check in dev — confirm cross-links work**

`npm run dev`. Open `http://localhost:3000/hatch-n-harvest/work/acceleration-for-all/` → click the next-project card → should land on `/hatch-n-harvest/work/united-by-play/`. From there, click the next-project card → should land back on `/hatch-n-harvest/work/acceleration-for-all/`. Stop dev server.

- [ ] **Step 8: Commit**

```bash
git add app/work/united-by-play/page.tsx tests/case-study/united-by-play.test.tsx
git commit -m "Complete United by Play port (result, next-project)"
```

---

## Task 18: Update homepage `Work.tsx` links to clean URLs

Change the AfA and UbP `href` values in the homepage's `Work.tsx` from `.html` paths to the new clean URLs. **Leave the Kestrel Coast link untouched** — that link is pre-existing broken state and out of scope.

**Files:**
- Modify: `next-app/components/Work.tsx`
- Modify: `next-app/tests/smoke.test.tsx` (extend assertions)

- [ ] **Step 1: Add link-href assertions to the homepage smoke test**

In `next-app/tests/smoke.test.tsx`, add (or extend an existing `it`) the following assertions inside the `describe("HomePage smoke tests", …)` block:

```tsx
  it("links AfA and UbP cards to clean URLs and leaves Kestrel Coast unchanged", () => {
    render(<HomePage />);
    const afaLink = screen.getByLabelText(
      "Acceleration For All — ViewSonic × Hustle Fund case study"
    );
    expect(afaLink).toHaveAttribute("href", "work/acceleration-for-all/");

    const ubpLink = screen.getByLabelText(
      "United by Play — ViewSonic global gaming campaign case study"
    );
    expect(ubpLink).toHaveAttribute("href", "work/united-by-play/");

    const kcLink = screen.getByLabelText(
      "Kestrel Coast — destination rebrand case study"
    );
    expect(kcLink).toHaveAttribute("href", "work/kestrel-coast.html");
  });
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- smoke`
Expected: FAIL — AfA and UbP links still point to `.html`.

- [ ] **Step 3: Update `components/Work.tsx`**

In `next-app/components/Work.tsx`, change exactly two `href` values:

- Line where AfA card is defined: `href="work/acceleration-for-all.html"` → `href="work/acceleration-for-all/"`
- Line where UbP card is defined: `href="work/united-by-play.html"` → `href="work/united-by-play/"`

Do not modify the Kestrel Coast link (`href="work/kestrel-coast.html"`).

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- smoke`
Expected: PASS.

- [ ] **Step 5: Run full test suite**

Run: `npm run test`
Expected: all tests pass.

- [ ] **Step 6: Commit**

```bash
git add components/Work.tsx tests/smoke.test.tsx
git commit -m "Update homepage Work cards to point at new case study URLs"
```

---

## Task 19: Delete the old standalone HTML files

Remove `next-app/public/work/*.html` so the old `.html` URLs return 404. This is the deliberate "clean break" per the design.

**Files:**
- Delete: `next-app/public/work/acceleration-for-all.html`
- Delete: `next-app/public/work/united-by-play.html`

- [ ] **Step 1: Confirm both new pages are in place**

```bash
ls app/work/acceleration-for-all/page.tsx app/work/united-by-play/page.tsx
```
Expected: both files listed (no errors).

- [ ] **Step 2: Delete the old files**

```bash
git rm public/work/acceleration-for-all.html public/work/united-by-play.html
```

- [ ] **Step 3: Run full test suite**

Run: `npm run test`
Expected: all tests pass.

- [ ] **Step 4: Run typecheck**

Run: `npm run typecheck`
Expected: clean.

- [ ] **Step 5: Commit**

```bash
git commit -m "Remove standalone HTML case studies (replaced by Next.js routes)"
```

---

## Task 20: Final verification — typecheck, test, build, browser

This is the definition-of-done check.

**Files:**
- None modified. All commands run from `next-app/`.

- [ ] **Step 1: Typecheck**

Run: `npm run typecheck`
Expected: no errors.

- [ ] **Step 2: Tests**

Run: `npm run test`
Expected: all tests pass, including:
- All `tests/case-study/*.test.tsx` files
- `tests/smoke.test.tsx`
- `tests/useParallaxScroll.test.tsx`

- [ ] **Step 3: Build**

Run: `npm run build`
Expected: build succeeds. `postbuild` moves `next-app/out` to `<repo-root>/docs`. After this, run from the repo root:

```bash
ls ../docs/work/
```

Expected output (exact):
```
acceleration-for-all
united-by-play
```

There should be **no** `acceleration-for-all.html` or `united-by-play.html` files at the `docs/work/` root, and each subdirectory should contain an `index.html`:

```bash
ls ../docs/work/acceleration-for-all/
ls ../docs/work/united-by-play/
```

Expected: each lists `index.html` (and possibly other Next.js export artifacts).

- [ ] **Step 4: Local serve and manual browser check**

From the repo root, run a static server pointing at `docs/`:

```bash
cd ..
npx --yes http-server docs -p 8080 -c-1
```

Open in browser:
- `http://localhost:8080/hatch-n-harvest/` — homepage loads, Work cards point at new clean URLs.
- `http://localhost:8080/hatch-n-harvest/work/acceleration-for-all/` — AfA case study loads, palette swatches render with correct colors, metrics row visible, next-project card links to UbP.
- `http://localhost:8080/hatch-n-harvest/work/united-by-play/` — UbP case study loads, docuseries grids render, next-project card links to AfA.
- `http://localhost:8080/hatch-n-harvest/work/acceleration-for-all.html` — returns 404.
- `http://localhost:8080/hatch-n-harvest/work/united-by-play.html` — returns 404.
- Click "Work" in the nav of either case study → lands on the homepage's `#work` section.
- Click the footer logo on either case study → lands on the homepage's `#top` anchor.

Stop the server (Ctrl-C).

- [ ] **Step 5: Compare side-by-side with deployed site (optional)**

Open https://hatchnharvest.com/work/acceleration-for-all.html in one window (still live) and the new local `http://localhost:8080/hatch-n-harvest/work/acceleration-for-all/` in another. Visually compare top-to-bottom. Note any differences in:
- Section spacing
- Typography weights / sizes
- Image sizing
- Palette swatch colors

If anything is off, file a follow-up TODO list (do not fix in this plan — port is functionally complete; calibration is its own pass).

- [ ] **Step 6: Final commit (if any calibration was done)**

If Step 5 surfaced no issues, no commit needed — the previous task already concluded the work. If small CSS calibrations were applied, commit them:

```bash
git add app/globals.css
git commit -m "Calibrate case-study CSS to match source HTML"
```

- [ ] **Step 7: Summary report**

Report to the user:
- All 20 tasks complete.
- Branch `port-case-studies` is ready for review.
- New routes live at `/work/acceleration-for-all/` and `/work/united-by-play/`.
- Old `.html` URLs deleted.
- Homepage updated to link to the new URLs.
- Kestrel Coast link unchanged (out of scope).
- All tests pass; build succeeds.
- Suggest next step: open a PR (`gh pr create`) when ready to deploy.

---

## Self-review notes (already applied)

- Spec coverage: every section/requirement of the design doc has a corresponding task.
- No placeholders remain except where the engineer is explicitly directed to copy literal content from the source HTML (clearly marked `<exact …>` and accompanied by reading instructions in the same task).
- Type names and prop signatures used in later tasks match those defined in the primitives' tasks (3–11).
- The Nav/Footer `homeHref` decision (added during plan writing as a discovery from the existing case-study HTML) is captured in Task 2.
- The relative-path strategy (`../../assets/...`, `../<sibling>/`) is documented in the conventions section and used consistently throughout.
