# ColorPro Awards Case Study Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the Kestrel Coast placeholder card on the work index with a real ColorPro Awards case study page at `/work/colorpro-awards/`, matching the [Figma design](https://www.figma.com/design/49OFraV6tfLe23eretyLvI/Hatch-and-Harvest---Website-2026?node-id=17245-263).

**Architecture:** New Next.js route under `next-app/app/work/colorpro-awards/page.tsx` composing the existing case-study primitives (`CaseStudyShell`, `CaseHero`, `CaseBleed`, `AutoplayVideo`, `DocuseriesFilmstrip`, `RisingHeading`). No new shared components. Brand styling via scoped CSS variables (`--cpa-*`) added to `globals.css`. Assets live in `next-app/public/assets/work/colorpro-awards/`.

**Tech Stack:** Next.js 15 (App Router), React 19, TypeScript, vanilla CSS (globals.css), Vitest + Testing Library, ffmpeg/sips for asset transcoding.

**Spec reference:** [`specs/2026-05-18-colorpro-awards-case-study-design.md`](2026-05-18-colorpro-awards-case-study-design.md).

---

## File Structure

**Creating:**
- `next-app/app/work/colorpro-awards/page.tsx` — the case-study route
- `next-app/public/assets/work/colorpro-awards/` (folder) with these files:
  - `kv-solution.jpg`, `kv-card.jpg`
  - `prize-outline.png`, `lucky-draw.png`, `categories.png`
  - `kv-2023.png`, `thumbnail-vertical.png`, `judge-jeremy.png`
  - `event-india.jpg`, `event-london.jpg`
  - `exhibition-ig.mp4`, `advocates-cover.mp4`, `bumper-photography.mp4`

**Modifying:**
- `next-app/components/Work.tsx` — swap Kestrel Coast `<a>` block for ColorPro card
- `next-app/tests/smoke.test.tsx` — update Kestrel-pinned assertions (lines 39–45 and 69–85)
- `next-app/app/globals.css` — add `.cpa-page` brand scope + ColorPro-specific section styling

**Not touched:** Existing case-study components, the static `index.html` deploy artifact, any other case-study pages.

---

## Task 1: Stage the ColorPro asset folder

Copy and rename source files into `next-app/public/assets/work/colorpro-awards/`, transcoding the oversized bumper video.

**Files:**
- Create folder: `next-app/public/assets/work/colorpro-awards/`
- Create 13 asset files inside that folder (paths above)

**Source paths** (all under `/Users/perniskiesa/Desktop/claude_code/work/ColorPro Awards/`):
- `2025 ColorPro Awards_KV.jpg`
- `ColorPro Awards 2024 prize outline.png`
- `ColorPro Awards _ Lucky Draw-05.png`
- `Catgories-03.png`
- `2023ColorPro Award KV copy (1).png`
- `thumbnail_vertical.png`
- `Judge-Jeremy Reinmuth.png`
- `ColorPro awards ceremony-India--Gallery2.jpg`
- `ColorPro awards 2023 London venue.jpg`
- `Exhibition-IG-1.mp4`
- `Advocates-cover.mp4`
- `2025/250717_Acopy_vertical/Bumper_photography.mp4`

- [ ] **Step 1: Create the destination folder**

```bash
mkdir -p /Users/perniskiesa/Desktop/claude_code/hatch-n-harvest/next-app/public/assets/work/colorpro-awards
```

Expected: directory created without error.

- [ ] **Step 2: Copy the images (PNG + JPG)**

Run from any cwd:

```bash
SRC="/Users/perniskiesa/Desktop/claude_code/work/ColorPro Awards"
DEST="/Users/perniskiesa/Desktop/claude_code/hatch-n-harvest/next-app/public/assets/work/colorpro-awards"

cp "$SRC/2025 ColorPro Awards_KV.jpg" "$DEST/kv-solution.jpg"
cp "$SRC/ColorPro Awards 2024 prize outline.png" "$DEST/prize-outline.png"
cp "$SRC/ColorPro Awards _ Lucky Draw-05.png" "$DEST/lucky-draw.png"
cp "$SRC/Catgories-03.png" "$DEST/categories.png"
cp "$SRC/2023ColorPro Award KV copy (1).png" "$DEST/kv-2023.png"
cp "$SRC/thumbnail_vertical.png" "$DEST/thumbnail-vertical.png"
cp "$SRC/Judge-Jeremy Reinmuth.png" "$DEST/judge-jeremy.png"
cp "$SRC/ColorPro awards ceremony-India--Gallery2.jpg" "$DEST/event-india.jpg"
cp "$SRC/ColorPro awards 2023 London venue.jpg" "$DEST/event-london.jpg"
```

Expected: 9 files copied. Verify with `ls -1 "$DEST" | wc -l` → `9`.

- [ ] **Step 3: Make the work-index thumbnail (resize KV to 1800px wide)**

```bash
sips -Z 1800 "$DEST/kv-solution.jpg" --out "$DEST/kv-card.jpg"
```

Expected: prints rendered dimensions; `ls -lh "$DEST/kv-card.jpg"` shows ≈200–400KB.

- [ ] **Step 4: Copy the small native MP4s as-is**

```bash
cp "$SRC/Exhibition-IG-1.mp4" "$DEST/exhibition-ig.mp4"
cp "$SRC/Advocates-cover.mp4" "$DEST/advocates-cover.mp4"
```

Expected: 2 files copied. Sizes match originals (~4MB and ~2MB respectively).

- [ ] **Step 5: Transcode the bumper to ~2–3MB**

```bash
ffmpeg -y \
  -i "$SRC/2025/250717_Acopy_vertical/Bumper_photography.mp4" \
  -vf "scale=-2:1080" \
  -c:v libx264 -crf 28 -preset slow -movflags +faststart -an \
  "$DEST/bumper-photography.mp4"
```

Expected: ffmpeg completes; `ls -lh "$DEST/bumper-photography.mp4"` shows file in the 1.5–3.5MB range. If output exceeds 4MB, re-run with `-crf 30`.

- [ ] **Step 6: Verify all 13 destination files exist**

```bash
ls -1 "$DEST" | sort
```

Expected (exact lines, in this order):

```
advocates-cover.mp4
bumper-photography.mp4
categories.png
event-india.jpg
event-london.jpg
exhibition-ig.mp4
judge-jeremy.png
kv-2023.png
kv-card.jpg
kv-solution.jpg
lucky-draw.png
prize-outline.png
thumbnail-vertical.png
```

(Count: 13.)

- [ ] **Step 7: Commit**

```bash
cd /Users/perniskiesa/Desktop/claude_code/hatch-n-harvest
git add next-app/public/assets/work/colorpro-awards/
git commit -m "Work: stage ColorPro Awards case-study assets"
```

---

## Task 2: Update the smoke test (test-first, will fail)

Update `next-app/tests/smoke.test.tsx` so it expects the ColorPro Awards card on the work index. This test will fail until Task 3 swaps the card.

**Files:**
- Modify: `next-app/tests/smoke.test.tsx:41` (Kestrel Coast text expectation in the "all four active case studies" test)
- Modify: `next-app/tests/smoke.test.tsx:69-85` (the "links AfA and UbP cards to clean URLs and leaves Kestrel Coast unchanged" test)

- [ ] **Step 1: Replace the Kestrel Coast text expectation**

Open `next-app/tests/smoke.test.tsx`. Find the test body that currently reads:

```tsx
  it("renders the work section with all four active case studies", () => {
    render(<HomePage />);
    expect(screen.getByText("Kestrel Coast")).toBeInTheDocument();
    expect(screen.getByText("Acceleration For All")).toBeInTheDocument();
    expect(screen.getByText("United by Play")).toBeInTheDocument();
    expect(screen.getByText("Meet the Finchers")).toBeInTheDocument();
  });
```

Replace `"Kestrel Coast"` with `"ColorPro Awards"`:

```tsx
  it("renders the work section with all four active case studies", () => {
    render(<HomePage />);
    expect(screen.getByText("ColorPro Awards")).toBeInTheDocument();
    expect(screen.getByText("Acceleration For All")).toBeInTheDocument();
    expect(screen.getByText("United by Play")).toBeInTheDocument();
    expect(screen.getByText("Meet the Finchers")).toBeInTheDocument();
  });
```

- [ ] **Step 2: Rewrite the link-href test to cover ColorPro instead of Kestrel**

The current test (lines 69–85) reads:

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

Replace the entire `it(...)` block with:

```tsx
  it("links all four case study cards to clean URLs", () => {
    render(<HomePage />);
    const cpaLink = screen.getByLabelText(
      "ColorPro Awards — ViewSonic global creator platform case study"
    );
    expect(cpaLink).toHaveAttribute("href", "work/colorpro-awards/");

    const afaLink = screen.getByLabelText(
      "Acceleration For All — ViewSonic × Hustle Fund case study"
    );
    expect(afaLink).toHaveAttribute("href", "work/acceleration-for-all/");

    const ubpLink = screen.getByLabelText(
      "United by Play — ViewSonic global gaming campaign case study"
    );
    expect(ubpLink).toHaveAttribute("href", "work/united-by-play/");
  });
```

- [ ] **Step 3: Run the tests and confirm they fail**

```bash
cd /Users/perniskiesa/Desktop/claude_code/hatch-n-harvest/next-app
npx vitest run tests/smoke.test.tsx
```

Expected: two failures —

1. `renders the work section with all four active case studies` fails because `"ColorPro Awards"` is not yet in `Work.tsx`.
2. `links all four case study cards to clean URLs` fails because the ColorPro aria-label / href does not yet exist.

(All other smoke tests should still pass.)

- [ ] **Step 4: Stage but DO NOT commit yet**

```bash
cd /Users/perniskiesa/Desktop/claude_code/hatch-n-harvest
git add next-app/tests/smoke.test.tsx
```

The commit happens in Task 3 once the implementation makes the tests pass — keeping the failing test and the implementation in one commit per TDD's red-green-commit cycle.

---

## Task 3: Swap the Kestrel Coast card for ColorPro Awards in `Work.tsx`

**Files:**
- Modify: `next-app/components/Work.tsx:97-121` (the Kestrel Coast `<a className="case">` block, including its image, overlay, and Featured flag)

- [ ] **Step 1: Replace the Kestrel Coast `<a>` block**

Open `next-app/components/Work.tsx`. Find this exact block (starts at line 97):

```tsx
        <a
          href="work/kestrel-coast.html"
          className="case"
          aria-label="Kestrel Coast — destination rebrand case study"
        >
          <img
              src="https://images.unsplash.com/photo-1505228395891-9a51e7e86bf6?auto=format&fit=crop&w=1800&q=80"
              alt="Misty coastline at dawn, rocky shore with pines"
            loading="lazy"
          />
          <div className="overlay">
            <div className="top-row">
              <div>
                <div className="sub">Destination Identity · Wayfinding · Launch Campaign · 2025</div>
                <h3 className="title">Kestrel Coast</h3>
                <div className="one-liner">A coastline, reintroduced — season by season.</div>
              </div>
              <span className="flag">Featured</span>
            </div>
          </div>
          <span className="read-cta">
            Explore
            <ArrowIcon />
          </span>
        </a>
```

Replace it with the ColorPro Awards card:

```tsx
        <a
          href="work/colorpro-awards/"
          className="case"
          aria-label="ColorPro Awards — ViewSonic global creator platform case study"
        >
          <img
            src="assets/work/colorpro-awards/kv-card.jpg"
            alt="ColorPro Awards key visual — the 2025 FLOW campaign artwork."
            loading="lazy"
          />
          <div className="overlay">
            <div className="top-row">
              <div>
                <div className="sub">Campaign · Identity · Live Events · Microsite · 2022–2026</div>
                <h3 className="title">ColorPro Awards</h3>
                <div className="one-liner">A global creative platform that turned ViewSonic&apos;s professional displays into the world&apos;s pro-creator stage.</div>
              </div>
              <span className="flag">Featured</span>
            </div>
          </div>
          <span className="read-cta">
            Explore
            <ArrowIcon />
          </span>
        </a>
```

(Note `&apos;` for the two apostrophes — matches the file's existing convention for JSX text.)

- [ ] **Step 2: Run the smoke tests and confirm they pass**

```bash
cd /Users/perniskiesa/Desktop/claude_code/hatch-n-harvest/next-app
npx vitest run tests/smoke.test.tsx
```

Expected: all smoke tests pass (the two failing tests from Task 2 now succeed).

- [ ] **Step 3: Run typecheck**

```bash
cd /Users/perniskiesa/Desktop/claude_code/hatch-n-harvest/next-app
npx tsc --noEmit
```

Expected: no output (clean exit, no type errors).

- [ ] **Step 4: Commit**

```bash
cd /Users/perniskiesa/Desktop/claude_code/hatch-n-harvest
git add next-app/components/Work.tsx next-app/tests/smoke.test.tsx
git commit -m "Work: swap Kestrel placeholder for ColorPro Awards on the index"
```

---

## Task 4: Scaffold the ColorPro Awards page (route + hero header + hero video + The Problem)

Create the new case-study route with the hero header, full-bleed hero video, and the Problem section.

**Files:**
- Create: `next-app/app/work/colorpro-awards/page.tsx`
- Modify: `next-app/tests/smoke.test.tsx` (add a smoke test that the page imports + renders without crashing)

- [ ] **Step 1: Add the failing import-and-render smoke test**

Append the following test to the existing `describe` block in `next-app/tests/smoke.test.tsx` — place it after the final existing `it(...)` block (right before the closing `});` of `describe`):

```tsx
  it("ColorPro Awards page renders without crashing", async () => {
    const { default: ColorProAwardsPage } = await import(
      "@/app/work/colorpro-awards/page"
    );
    render(<ColorProAwardsPage />);
    expect(
      screen.getByRole("heading", { level: 1, name: /ColorPro Awards/i })
    ).toBeInTheDocument();
  });
```

- [ ] **Step 2: Run the new test and confirm it fails**

```bash
cd /Users/perniskiesa/Desktop/claude_code/hatch-n-harvest/next-app
npx vitest run tests/smoke.test.tsx -t "ColorPro Awards page"
```

Expected: FAIL — module `@/app/work/colorpro-awards/page` does not resolve.

- [ ] **Step 3: Create the page file with the hero, hero video, and Problem section**

Create `next-app/app/work/colorpro-awards/page.tsx`:

```tsx
import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { CaseStudyShell } from "@/components/case-study/CaseStudyShell";
import { CaseHero } from "@/components/case-study/CaseHero";
import { CaseBleed } from "@/components/case-study/CaseBleed";
import { RisingHeading } from "@/components/case-study/RisingHeading";
import { AutoplayVideo } from "@/components/case-study/AutoplayVideo";

export const metadata: Metadata = {
    title: "ColorPro Awards — ViewSonic · Hatch n Harvest",
    description:
        "A global creative platform that turned ViewSonic's professional displays into the world's pro-creator stage — across film, exhibitions, and live ceremonies in four years.",
};

const cpaBrandVars = {
    "--cpa-bg": "#2b2722",
    "--cpa-paper": "#f2ebda",
    "--cpa-mute": "#b5ac9b",
    "--cpa-line": "rgba(242, 235, 218, 0.14)",
} as CSSProperties;

export default function ColorProAwardsPage() {
    return (
        <CaseStudyShell brandVars={cpaBrandVars}>
            <div className="cpa-page">
                <CaseHero
                    backLink={{ label: "All work", href: "../../#work" }}
                    eyebrow="Campaign · 2022–2026"
                    title={<>ColorPro <em>Awards.</em></>}
                    kicker="Transformed ViewSonic's professional display lineup into a global creative platform — bringing together artists, storytellers and industry partners through immersive experiences that turned inspiration into real-world brand and product engagement."
                    meta={[
                        { label: "Client", value: "ViewSonic" },
                        { label: "Scope", value: "Campaign · Identity · Microsite · Live Events · Social Activations" },
                        { label: "Year", value: "2022–2026" },
                        { label: "Reach", value: "Global launch from Taiwan; live events in UK, India, Thailand, Vietnam" },
                    ]}
                />

                <CaseBleed caption={{ title: "Hero film · The ColorPro Awards.", meta: "Campaign · 2026" }}>
                    <AutoplayVideo videoId="q0qJdUqJiq0" title="ColorPro Awards — FLOW hero film" />
                </CaseBleed>

                {/* THE PROBLEM */}
                <section className="problem">
                    <div className="wrap">
                        <div className="problem-intro">
                            <RisingHeading as="h2">The Problem</RisingHeading>
                            <p>ViewSonic wanted to build more than a traditional marketing campaign for its ColorPro professional displays.</p>
                            <p>The challenge was creating a globally recognized platform that could connect with creators, inspire community participation and strengthen relationships with channel partners — all while driving real-world product demand.</p>
                            <p>The campaign also needed to extend beyond digital advertising into immersive, in-person experiences that showcased the power of the product firsthand.</p>
                        </div>
                    </div>
                </section>
            </div>
        </CaseStudyShell>
    );
}
```

**Component-shape notes** (verified against the current files):

- `CaseStudyShell` accepts only `{ brandVars, children }` — it does NOT take a `className` prop, so the page wraps all its children in a `<div className="cpa-page">…</div>` to scope the ColorPro-specific CSS without touching the shell signature. Nav and Footer (rendered by the shell outside the wrapper) keep their default site chrome.
- `CaseHero` accepts `{ backLink, eyebrow, kicker, title, meta }` and renders meta inside `.case-meta-grid` with `.case-meta-label` / `.case-meta-value` rows — these are the class names the Task-5 CSS rules target.

- [ ] **Step 4: Run the smoke test and confirm it passes**

```bash
cd /Users/perniskiesa/Desktop/claude_code/hatch-n-harvest/next-app
npx vitest run tests/smoke.test.tsx -t "ColorPro Awards page"
```

Expected: PASS.

- [ ] **Step 5: Run the full smoke test suite (regression check)**

```bash
npx vitest run tests/smoke.test.tsx
```

Expected: every test passes.

- [ ] **Step 6: Typecheck**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 7: Commit**

```bash
cd /Users/perniskiesa/Desktop/claude_code/hatch-n-harvest
git add next-app/app/work/colorpro-awards/page.tsx next-app/tests/smoke.test.tsx
git commit -m "Work: scaffold ColorPro Awards page with hero, hero video, and Problem section"
```

---

## Task 5: Add The Solution section (KV image, body copy, asset grid)

Build the largest and most layout-heavy section: a KV image, two-paragraph body, and the two-column asset grid (with the Portrait_Cop placeholder tile dropped per spec decision).

**Files:**
- Modify: `next-app/app/work/colorpro-awards/page.tsx` — insert the Solution section after the Problem section
- Modify: `next-app/app/globals.css` — add `.cpa-page` brand styles + `.cpa-asset-grid` layout rules

- [ ] **Step 1: Add the Solution section JSX to the page**

In `next-app/app/work/colorpro-awards/page.tsx`, immediately after the closing `</section>` of the Problem section, insert:

```tsx
            {/* THE SOLUTION */}
            <section className="cpa-solution">
                <div className="wrap">
                    <figure className="cpa-solution-kv">
                        <img
                            src="../../assets/work/colorpro-awards/kv-solution.jpg"
                            alt="2025 ColorPro Awards key visual — bold abstract type composition over an electric blue gradient."
                            loading="lazy"
                        />
                    </figure>

                    <div className="cpa-solution-copy">
                        <RisingHeading as="h2">The Solution</RisingHeading>
                        <p>ViewSonic launched the ColorPro Awards, a global creative competition built around inspiring annual themes like &ldquo;FLOW,&rdquo; &ldquo;MOMENTUM,&rdquo; and &ldquo;RISE.&rdquo; The campaign invited photographers, filmmakers, and digital artists from around the world to submit original work while engaging audiences through paid media, social content, influencer partnerships, tutorials and community voting experiences.</p>
                        <p>To bring the platform to life, ViewSonic hosted international award ceremonies and traveling exhibitions across key global markets. These events transformed digital artwork into immersive physical showcases, giving creators, resellers, distributors and enterprise customers hands-on experiences with ColorPro displays. By combining creator storytelling with experiential marketing, the campaign created a seamless bridge between brand inspiration and product engagement.</p>
                    </div>

                    {/* Asset grid */}
                    <div className="cpa-asset-grid">
                        <div className="cpa-asset-col cpa-asset-col-wide">
                            <figure className="cpa-tile cpa-tile-wide">
                                <img
                                    src="../../assets/work/colorpro-awards/prize-outline.png"
                                    alt="ColorPro Awards 2024 — prize outline graphic listing the three category awards."
                                    loading="lazy"
                                />
                            </figure>

                            <div className="cpa-tile cpa-tile-video">
                                <AutoplayVideo videoId="q0qJdUqJiq0" title="ColorPro Awards — FLOW teaser" />
                            </div>

                            <div className="cpa-tile-row">
                                <figure className="cpa-tile">
                                    <img
                                        src="../../assets/work/colorpro-awards/lucky-draw.png"
                                        alt="ColorPro Awards Lucky Draw social card — campaign giveaway artwork."
                                        loading="lazy"
                                    />
                                </figure>
                                <figure className="cpa-tile">
                                    <video
                                        src="../../assets/work/colorpro-awards/exhibition-ig.mp4"
                                        autoPlay
                                        loop
                                        muted
                                        playsInline
                                        preload="metadata"
                                        aria-label="ColorPro Awards exhibition footage — a short Instagram cut of the traveling exhibit."
                                    />
                                </figure>
                            </div>

                            <div className="cpa-tile-row cpa-tile-row-tall">
                                <figure className="cpa-tile">
                                    <video
                                        src="../../assets/work/colorpro-awards/advocates-cover.mp4"
                                        autoPlay
                                        loop
                                        muted
                                        playsInline
                                        preload="metadata"
                                        aria-label="Meet the ColorPro Advocates — cover film for the 2024 advocates programme."
                                    />
                                </figure>
                                <figure className="cpa-tile">
                                    <img
                                        src="../../assets/work/colorpro-awards/categories.png"
                                        alt="ColorPro Awards categories key art — Photography, Videography, and Digital Art."
                                        loading="lazy"
                                    />
                                </figure>
                            </div>
                        </div>

                        <div className="cpa-asset-col cpa-asset-col-narrow">
                            <figure className="cpa-tile">
                                <img
                                    src="../../assets/work/colorpro-awards/kv-2023.png"
                                    alt="2023 ColorPro Awards key visual."
                                    loading="lazy"
                                />
                            </figure>
                            <figure className="cpa-tile">
                                <img
                                    src="../../assets/work/colorpro-awards/thumbnail-vertical.png"
                                    alt="ColorPro Awards vertical thumbnail — campaign poster cut for social."
                                    loading="lazy"
                                />
                            </figure>
                            <figure className="cpa-tile">
                                <video
                                    src="../../assets/work/colorpro-awards/bumper-photography.mp4"
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                    preload="metadata"
                                    aria-label="ColorPro Awards Photography bumper — short category sting."
                                />
                            </figure>
                            <figure className="cpa-tile">
                                <img
                                    src="../../assets/work/colorpro-awards/judge-jeremy.png"
                                    alt="Judge spotlight — Jeremy Reinmuth, ColorPro Awards juror."
                                    loading="lazy"
                                />
                            </figure>
                        </div>
                    </div>
                </div>
            </section>
```

- [ ] **Step 2: Add the ColorPro brand styles to `globals.css`**

Open `next-app/app/globals.css`. At the bottom of the file (or in the section where other `.case-*` and case-study styles live — read the file first to find a sensible neighbour), add the following block. Adjust the indentation/format to match the file's existing conventions:

```css
/* ───────────────────────────────────────────────────────────────
   ColorPro Awards (case study)
   ─────────────────────────────────────────────────────────────── */
.cpa-page {
    background: var(--cpa-bg);
    color: var(--cpa-paper);
}

.cpa-page .case-hero,
.cpa-page .problem,
.cpa-page .cpa-solution {
    color: var(--cpa-paper);
}

.cpa-page .case-meta-grid {
    border-top: 1px solid var(--cpa-line);
}

.cpa-page .case-meta-label {
    color: var(--cpa-mute);
}

.cpa-page .case-meta-value {
    color: var(--cpa-paper);
}

.cpa-page .problem p,
.cpa-page .cpa-solution p {
    color: var(--cpa-mute);
}

/* Solution — KV + body + asset grid */
.cpa-solution {
    padding: 80px 0;
}

.cpa-solution-kv {
    margin: 0 0 32px;
    border-radius: 16px;
    overflow: hidden;
    aspect-ratio: 1920 / 1080;
}

.cpa-solution-kv img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
}

.cpa-solution-copy {
    max-width: 746px;
    margin: 0 0 80px;
}

.cpa-solution-copy h2 {
    margin-bottom: 24px;
}

.cpa-solution-copy p + p {
    margin-top: 16px;
}

/* Asset grid (2 columns, 24px gap; left col ≈ 66%, right col ≈ 28%) */
.cpa-asset-grid {
    display: grid;
    grid-template-columns: 884.775fr 373.225fr;
    gap: 24px;
    align-items: start;
}

.cpa-asset-col {
    display: flex;
    flex-direction: column;
    gap: 24px;
}

.cpa-tile-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
}

.cpa-tile-row-tall .cpa-tile {
    aspect-ratio: 408 / 840;
}

.cpa-tile {
    margin: 0;
    position: relative;
    border-radius: 16px;
    overflow: hidden;
    background: rgba(0, 0, 0, 0.2);
}

.cpa-tile img,
.cpa-tile video {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.cpa-tile-wide {
    aspect-ratio: 2048 / 1149;
}

.cpa-tile-video {
    aspect-ratio: 16 / 9;
}

/* Responsive: stack the grid below ~900px */
@media (max-width: 900px) {
    .cpa-asset-grid {
        grid-template-columns: 1fr;
    }
    .cpa-tile-row {
        grid-template-columns: 1fr;
    }
}
```

- [ ] **Step 3: Start the dev server and visually verify the Solution section**

```bash
cd /Users/perniskiesa/Desktop/claude_code/hatch-n-harvest/next-app
npm run dev
```

In a browser, open `http://localhost:3000/work/colorpro-awards/`. Check:

- The KV image renders at full width with rounded corners
- The two-paragraph body sits to the left under the KV, max-width ~746px
- The asset grid renders as two columns: wide left (66%), narrow right (28%)
- Left column shows in order: prize outline → FLOW teaser video (YouTube poster, then autoplays muted on scroll) → 2-up (lucky-draw + exhibition-ig.mp4) → tall 2-up (advocates-cover.mp4 + categories.png)
- Right column shows in order: kv-2023 → thumbnail-vertical → bumper-photography.mp4 (looping) → judge-jeremy portrait
- All three native MP4s autoplay muted on loop without showing controls

If anything looks off (proportions, missing assets, broken layout), fix the JSX/CSS before continuing — the rest of the plan assumes the grid is rendering correctly.

Stop the dev server (`Ctrl+C`).

- [ ] **Step 4: Full smoke test + typecheck**

```bash
npx vitest run tests/smoke.test.tsx
npx tsc --noEmit
```

Expected: all tests pass, no type errors.

- [ ] **Step 5: Commit**

```bash
cd /Users/perniskiesa/Desktop/claude_code/hatch-n-harvest
git add next-app/app/work/colorpro-awards/page.tsx next-app/app/globals.css
git commit -m "Work: add ColorPro Awards 'The Solution' section + asset grid"
```

---

## Task 6: Add The Live Events section (anchor photos + 5-card filmstrip)

Add the heading, draft body copy, two anchor photos, and a 5-card horizontal carousel of YouTube live-event embeds (click-out to YouTube watch pages, via the existing `DocuseriesFilmstrip` component).

**Files:**
- Modify: `next-app/app/work/colorpro-awards/page.tsx` — append the Live Events section after the Solution section, add the `DocuseriesFilmstrip` import
- Modify: `next-app/app/globals.css` — add `.cpa-live-events-*` styles for the anchor row

- [ ] **Step 1: Add the `DocuseriesFilmstrip` import at the top of the page file**

In `next-app/app/work/colorpro-awards/page.tsx`, add the import after the existing `AutoplayVideo` import:

```tsx
import { DocuseriesFilmstrip } from "@/components/case-study/DocuseriesFilmstrip";
```

- [ ] **Step 2: Append the Live Events section JSX**

In `next-app/app/work/colorpro-awards/page.tsx`, immediately after the closing `</section>` of the Solution section, insert:

```tsx
            {/* THE LIVE EVENTS */}
            <section className="cpa-live-events">
                <div className="wrap">
                    <RisingHeading as="h2">The Live Events</RisingHeading>
                    <p className="cpa-live-events-body">To turn the awards into something audiences could touch, ViewSonic took ColorPro on the road. International ceremonies and traveling exhibitions across the UK, India, Thailand, and Vietnam transformed each year&apos;s winning work into immersive physical showcases — where creators, resellers, distributors, and enterprise customers could see the displays do exactly what the winning artists had asked of them. Each stop combined gallery, ceremony, and product demo into a single experience, turning brand inspiration into hands-on engagement.</p>

                    <div className="cpa-live-events-anchors">
                        <figure className="cpa-tile">
                            <img
                                src="../../assets/work/colorpro-awards/event-india.jpg"
                                alt="ColorPro Awards ceremony — India gallery installation, 2024."
                                loading="lazy"
                            />
                        </figure>
                        <figure className="cpa-tile">
                            <img
                                src="../../assets/work/colorpro-awards/event-london.jpg"
                                alt="ColorPro Awards 2023 — London venue, exhibition stage and audience."
                                loading="lazy"
                            />
                        </figure>
                    </div>
                </div>

                <DocuseriesFilmstrip
                    episodes={[
                        {
                            title: "2026 FLOW · Live event",
                            thumbnail: "https://i.ytimg.com/vi/rIY52x2l__w/maxresdefault.jpg",
                            alt: "FLOW 2026 ColorPro Awards live event highlight.",
                            href: "https://www.youtube.com/watch?v=rIY52x2l__w&list=PLhW6e7eTnTo6yLopbyljaJ4HThnECfh1_&index=1",
                        },
                        {
                            title: "5th MOMENTUM · Live event",
                            thumbnail: "https://i.ytimg.com/vi/GYZe8CY63lE/maxresdefault.jpg",
                            alt: "5th ColorPro Awards MOMENTUM live event highlight.",
                            href: "https://www.youtube.com/watch?v=GYZe8CY63lE&list=PLhW6e7eTnTo6yLopbyljaJ4HThnECfh1_&index=6",
                        },
                        {
                            title: "2022 BREAKTHROUGH · Live event",
                            thumbnail: "https://i.ytimg.com/vi/9DULWKEcNsU/maxresdefault.jpg",
                            alt: "2022 ColorPro Awards BREAKTHROUGH live event highlight.",
                            href: "https://www.youtube.com/watch?v=9DULWKEcNsU",
                        },
                        {
                            title: "RISE · Live event",
                            thumbnail: "https://i.ytimg.com/vi/anOFomSca7Q/maxresdefault.jpg",
                            alt: "ColorPro Awards RISE live event highlight.",
                            href: "https://www.youtube.com/watch?v=anOFomSca7Q",
                        },
                        {
                            title: "2021 · Live event",
                            thumbnail: "https://i.ytimg.com/vi/VuQEWNX8-3g/maxresdefault.jpg",
                            alt: "2021 ColorPro Awards live event highlight.",
                            href: "https://www.youtube.com/watch?v=VuQEWNX8-3g&list=PLhW6e7eTnTo6yLopbyljaJ4HThnECfh1_&index=13",
                        },
                    ]}
                />
            </section>
```

- [ ] **Step 3: Add `.cpa-live-events-*` styles to `globals.css`**

Add to `next-app/app/globals.css` (in the same ColorPro block from Task 5):

```css
.cpa-live-events {
    padding: 80px 0 0;
}

.cpa-live-events-body {
    margin: 24px 0 64px;
    max-width: 1280px;
    color: var(--cpa-mute);
}

.cpa-live-events-anchors {
    display: grid;
    grid-template-columns: 593fr 661fr;
    gap: 24px;
    margin-bottom: 60px;
}

.cpa-live-events-anchors .cpa-tile {
    aspect-ratio: 593 / 396;
}

@media (max-width: 900px) {
    .cpa-live-events-anchors {
        grid-template-columns: 1fr;
    }
}
```

- [ ] **Step 4: Verify in the browser**

```bash
npm run dev
```

Open `http://localhost:3000/work/colorpro-awards/`, scroll to the Live Events section. Check:

- Heading "The Live Events" renders with the rising-heading animation
- Body paragraph reads correctly and is muted-color
- Two anchor photos display side-by-side (India + London)
- Filmstrip below shows YouTube posters for the 5 events, with arrow nav, dot indicator, and a clickable card that opens YouTube in a new tab

Stop the dev server.

- [ ] **Step 5: Tests + typecheck**

```bash
npx vitest run tests/smoke.test.tsx
npx tsc --noEmit
```

Expected: all pass, no type errors.

- [ ] **Step 6: Commit**

```bash
cd /Users/perniskiesa/Desktop/claude_code/hatch-n-harvest
git add next-app/app/work/colorpro-awards/page.tsx next-app/app/globals.css
git commit -m "Work: add ColorPro Awards 'The Live Events' section with anchor photos and filmstrip"
```

---

## Task 7: Add The Results section (3-card filmstrip)

Add the Results heading, body copy verbatim from Figma, and a 3-card filmstrip of highlight-reel YouTube embeds.

**Files:**
- Modify: `next-app/app/work/colorpro-awards/page.tsx` — append the Results section after Live Events
- Modify: `next-app/app/globals.css` — add `.cpa-results-body` style if needed (likely shares with live-events)

- [ ] **Step 1: Append the Results section JSX**

In `next-app/app/work/colorpro-awards/page.tsx`, immediately after the closing `</section>` of the Live Events section, insert:

```tsx
            {/* THE RESULTS */}
            <section className="cpa-results">
                <div className="wrap">
                    <RisingHeading as="h2">The Results</RisingHeading>
                    <div className="cpa-results-body">
                        <p>The ColorPro Awards evolved into a global ecosystem that strengthened both brand affinity and business growth.</p>
                        <p>The campaign generated thousands of submissions from more than 100 countries, built an engaged, international and creative community, which helped position ViewSonic as a leader in creative technology.</p>
                        <p>At the same time, the platform increased visibility for ColorPro displays, strengthened reseller and partner relationships and created meaningful opportunities for product demonstrations and demand generation.</p>
                        <p>By integrating online engagement with offline experiences, the campaign successfully moved audiences from inspiration to participation to product interaction — delivering impact across both B2C and B2B audiences.</p>
                    </div>
                </div>

                <DocuseriesFilmstrip
                    episodes={[
                        {
                            title: "RISE · Highlight reel",
                            thumbnail: "https://i.ytimg.com/vi/67LDhrlMfKg/maxresdefault.jpg",
                            alt: "ColorPro Awards 2023 RISE highlight reel.",
                            href: "https://www.youtube.com/watch?v=67LDhrlMfKg&list=PLhW6e7eTnTo6yLopbyljaJ4HThnECfh1_&index=11",
                        },
                        {
                            title: "5th MOMENTUM · Highlight reel",
                            thumbnail: "https://i.ytimg.com/vi/Po5tOYmwa9I/maxresdefault.jpg",
                            alt: "The 5th ColorPro Awards MOMENTUM highlight reel.",
                            href: "https://www.youtube.com/watch?v=Po5tOYmwa9I&list=PLhW6e7eTnTo6yLopbyljaJ4HThnECfh1_&index=7",
                        },
                        {
                            title: "2021 NEW ADVENTURE · Highlight reel",
                            thumbnail: "https://i.ytimg.com/vi/erOwuKmsU7c/maxresdefault.jpg",
                            alt: "2021 ColorPro Awards NEW ADVENTURE highlight reel.",
                            href: "https://www.youtube.com/watch?v=erOwuKmsU7c&list=PLhW6e7eTnTo6yLopbyljaJ4HThnECfh1_&index=18",
                        },
                    ]}
                />
            </section>
```

- [ ] **Step 2: Add `.cpa-results-*` styles to `globals.css`**

Append to the ColorPro block in `next-app/app/globals.css`:

```css
.cpa-results {
    padding: 80px 0 0;
}

.cpa-results-body {
    margin: 24px 0 64px;
    max-width: 1280px;
    color: var(--cpa-mute);
}

.cpa-results-body p + p {
    margin-top: 16px;
}
```

- [ ] **Step 3: Verify in the browser**

```bash
npm run dev
```

Open the ColorPro page, scroll to the Results section. Check:

- "The Results" heading + 4 paragraphs render correctly
- 3-card filmstrip displays the three highlight-reel posters with working nav

Stop the dev server.

- [ ] **Step 4: Tests + typecheck**

```bash
npx vitest run tests/smoke.test.tsx
npx tsc --noEmit
```

Expected: all pass.

- [ ] **Step 5: Commit**

```bash
cd /Users/perniskiesa/Desktop/claude_code/hatch-n-harvest
git add next-app/app/work/colorpro-awards/page.tsx next-app/app/globals.css
git commit -m "Work: add ColorPro Awards 'The Results' section with highlights filmstrip"
```

---

## Task 8: Add the back-to-work footer and final verification

Add the `.next-project-section` block that closes every case study, run a full end-to-end visual check across the page at desktop and mobile breakpoints, and a clean build.

**Files:**
- Modify: `next-app/app/work/colorpro-awards/page.tsx` — append the back-to-work section after Results

- [ ] **Step 1: Append the back-to-work footer JSX**

In `next-app/app/work/colorpro-awards/page.tsx`, immediately after the closing `</section>` of the Results section (still inside the `<div className="cpa-page">…</div>` wrapper that sits inside `<CaseStudyShell>`), insert:

```tsx
            {/* BACK TO ALL WORK */}
            <section className="next-project-section">
                <div className="wrap">
                    <a className="next-project" href="../../#work">
                        <div className="np-eyebrow">More harvests →</div>
                        <div className="np-title">Back to all work</div>
                        <div className="np-note">Individual case studies for Hinterland Stays, Common Range, Small Acre, and Moth &amp; Bloom are on their way.</div>
                    </a>
                </div>
            </section>
```

(This mirrors the closer from `acceleration-for-all/page.tsx` lines 309–318 — keeps the site voice and the cross-link consistent.)

- [ ] **Step 2: Full visual sweep — desktop**

```bash
cd /Users/perniskiesa/Desktop/claude_code/hatch-n-harvest/next-app
npm run dev
```

Open `http://localhost:3000/work/colorpro-awards/` at a 1440px-wide viewport. Walk top-to-bottom:

1. Hero header: title, kicker, 4-col meta row (Client / Scope / Year / Reach), dark background with cream type
2. Hero video: full-bleed area loads YouTube poster, then autoplays muted on scroll
3. The Problem: heading + 3 paragraphs, muted body text
4. The Solution: KV → body → 2-col asset grid (left col 4 rows, right col 4 rows), all native MP4s loop muted, FLOW teaser autoplays via YouTube
5. The Live Events: heading → body → 2 anchor photos → 5-card filmstrip with working arrows + dot indicator + opens-YouTube-in-new-tab
6. The Results: heading → 4 paragraphs → 3-card filmstrip
7. Back to all work CTA: works, scrolls to `#work` on the home page when clicked

Open the homepage at `http://localhost:3000/` and confirm:

- The work section now shows "ColorPro Awards" as the first (Featured) card
- Clicking it routes to `/work/colorpro-awards/`
- The other three cards (AfA, UbP, Meet the Finchers) are unchanged

- [ ] **Step 3: Visual sweep — mobile (≤768px)**

In the browser dev tools, switch to a 390×844 (iPhone-ish) viewport. Confirm:

- Asset grid stacks to a single column (no horizontal overflow)
- Live events anchor row stacks vertically
- Filmstrips remain swipeable
- Native MP4s still autoplay (some mobile browsers gate this — but `muted playsinline` should let them through)

If any layout breakage appears, fix it in `globals.css` before continuing.

Stop the dev server.

- [ ] **Step 4: Full smoke test + typecheck + production build (local-only)**

```bash
cd /Users/perniskiesa/Desktop/claude_code/hatch-n-harvest/next-app
npx vitest run
npx tsc --noEmit
npm run build
```

- `vitest`: every test passes
- `tsc`: no errors
- `npm run build`: completes without errors; `.next/` output produced

**Important:** This is `npm run build`, **not** `npm run build:prod`. The prod build is only for deploy commits that rebuild `docs/` — this task is not a deploy commit. (See repo memory: `npm run build` is fine for local verification.)

- [ ] **Step 5: Commit**

```bash
cd /Users/perniskiesa/Desktop/claude_code/hatch-n-harvest
git add next-app/app/work/colorpro-awards/page.tsx
git commit -m "Work: add ColorPro Awards back-to-work footer and complete case study"
```

- [ ] **Step 6: Recap & handoff**

The ColorPro Awards case study is now complete and the work index links to it. **No deploy build has been run yet** — the next step (separate from this plan) is for the user to run `npm run build:prod` and commit `docs/` when they're ready to ship to the live site at hatchnharvest.com.

---

## Out of scope (not part of this plan)

- Running `npm run build:prod` and committing the rebuilt `docs/` artifact (that's a separate deploy commit the user controls)
- Optimizing image weight beyond the basic resize (kv-card.jpg) and the explicit bumper transcode
- Adding a Kestrel Coast or other future-placeholder card elsewhere on the index
- Updating the static `index.html` deploy artifact (the next deploy build will regenerate it)
- Swapping the FLOW teaser tile's videoId to a separate cut (held open as a follow-up in the spec — currently shares the hero ID per the Figma)
