# Sizzle Reel Sound Toggle Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a small floating sound-toggle button in the bottom-right corner of the homepage sizzle reel so visitors can opt in to audio.

**Architecture:** Convert `SizzleReel.tsx` from a server component to a client component holding a `muted` boolean state. Render a `<button>` inside the existing `.sizzle-reel` section (which is already `position: relative`) that imperatively toggles `videoEl.muted` via a ref. Swap inline SVG icons and `aria-label`/`aria-pressed` based on state. Add CSS in `globals.css` for the new `.sizzle-reel-sound-toggle` class.

**Tech Stack:** Next.js 15.5 + React 19 client component, Vitest + Testing Library (jsdom), CSS in `next-app/app/globals.css`.

**Related spec:** [2026-05-20-sizzle-reel-sound-toggle-design.md](./2026-05-20-sizzle-reel-sound-toggle-design.md)

---

## File Map

- **Modify:** `next-app/components/SizzleReel.tsx` — add `"use client"`, state, ref, button, inline SVG icons.
- **Modify:** `next-app/app/globals.css` — add styles for `.sizzle-reel-sound-toggle`. `.sizzle-reel` already has `position: relative` (line 409) so no parent change needed.
- **Create:** `next-app/tests/sizzle-reel.test.tsx` — unit tests for the toggle's render, default state, click behavior, ARIA, and side effect on the underlying `<video>` element.

---

## Task 1: Failing test — toggle button renders muted by default

**Files:**
- Create: `next-app/tests/sizzle-reel.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
// next-app/tests/sizzle-reel.test.tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SizzleReel } from "@/components/SizzleReel";

describe("SizzleReel sound toggle", () => {
  it("renders a sound-toggle button labeled 'Unmute video' by default", () => {
    render(<SizzleReel />);
    const button = screen.getByRole("button", { name: "Unmute video" });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("aria-pressed", "false");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd next-app && npx vitest run tests/sizzle-reel.test.tsx`
Expected: FAIL — no button with that accessible name exists yet (current `SizzleReel` renders only a `<video>`).

- [ ] **Step 3: Convert SizzleReel to a client component with the toggle button**

Replace the entire contents of `next-app/components/SizzleReel.tsx` with:

```tsx
"use client";

import { useRef, useState } from "react";

export function SizzleReel({ srcPrefix = "" }: { srcPrefix?: string }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [muted, setMuted] = useState(true);

  function toggleSound() {
    const video = videoRef.current;
    if (!video) return;
    const next = !muted;
    video.muted = next;
    setMuted(next);
  }

  return (
    <section className="sizzle-reel" aria-label="Sizzle reel">
      <video
        ref={videoRef}
        className="sizzle-reel-video"
        src={`${srcPrefix}assets/video/sizzle-reel.mp4`}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      />
      <button
        type="button"
        className="sizzle-reel-sound-toggle"
        onClick={toggleSound}
        aria-label={muted ? "Unmute video" : "Mute video"}
        aria-pressed={!muted}
      >
        {muted ? <SpeakerMutedIcon /> : <SpeakerOnIcon />}
      </button>
    </section>
  );
}

function SpeakerMutedIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M11 5 6 9H2v6h4l5 4V5Z" />
      <line x1="22" y1="9" x2="16" y2="15" />
      <line x1="16" y1="9" x2="22" y2="15" />
    </svg>
  );
}

function SpeakerOnIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M11 5 6 9H2v6h4l5 4V5Z" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    </svg>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd next-app && npx vitest run tests/sizzle-reel.test.tsx`
Expected: PASS — the button now exists with the muted-default ARIA state.

- [ ] **Step 5: Commit**

```bash
git add next-app/components/SizzleReel.tsx next-app/tests/sizzle-reel.test.tsx
git commit -m "feat(sizzle-reel): add sound-toggle button (muted default)"
```

---

## Task 2: Click unmutes the video and updates ARIA + icon

**Files:**
- Modify: `next-app/tests/sizzle-reel.test.tsx`

- [ ] **Step 1: Update the top-of-file import to include `fireEvent`**

Change the import line at the top of `next-app/tests/sizzle-reel.test.tsx` from:

```tsx
import { render, screen } from "@testing-library/react";
```

to:

```tsx
import { render, screen, fireEvent } from "@testing-library/react";
```

- [ ] **Step 2: Append the failing tests**

Add the following inside the existing `describe("SizzleReel sound toggle", ...)` block in `next-app/tests/sizzle-reel.test.tsx`:

```tsx
it("unmutes the underlying video and flips ARIA when clicked", () => {
  const { container } = render(<SizzleReel />);
  const video = container.querySelector("video") as HTMLVideoElement;
  expect(video.muted).toBe(true);

  const button = screen.getByRole("button", { name: "Unmute video" });
  fireEvent.click(button);

  expect(video.muted).toBe(false);

  const muteButton = screen.getByRole("button", { name: "Mute video" });
  expect(muteButton).toHaveAttribute("aria-pressed", "true");
});

it("re-mutes when clicked a second time", () => {
  const { container } = render(<SizzleReel />);
  const video = container.querySelector("video") as HTMLVideoElement;

  fireEvent.click(screen.getByRole("button", { name: "Unmute video" }));
  fireEvent.click(screen.getByRole("button", { name: "Mute video" }));

  expect(video.muted).toBe(true);
  const remuteButton = screen.getByRole("button", { name: "Unmute video" });
  expect(remuteButton).toHaveAttribute("aria-pressed", "false");
});
```

- [ ] **Step 3: Run tests to verify they pass**

Run: `cd next-app && npx vitest run tests/sizzle-reel.test.tsx`
Expected: PASS — the component already wires `videoRef.current.muted` and updates state in Task 1. These tests verify it actually behaves correctly.

(If they fail, the bug is in the `toggleSound` function in `SizzleReel.tsx`. Re-check that `videoRef.current.muted` is being set before `setMuted` and that `aria-label`/`aria-pressed` swap on the new state.)

- [ ] **Step 4: Commit**

```bash
git add next-app/tests/sizzle-reel.test.tsx
git commit -m "test(sizzle-reel): cover unmute + re-mute click behavior"
```

---

## Task 3: Verify the video is no longer aria-hidden

**Files:**
- Modify: `next-app/tests/sizzle-reel.test.tsx`

- [ ] **Step 1: Append the test**

Add inside the existing `describe` block:

```tsx
it("does not aria-hide the video (it is now interactive)", () => {
  const { container } = render(<SizzleReel />);
  const video = container.querySelector("video");
  expect(video).not.toBeNull();
  expect(video).not.toHaveAttribute("aria-hidden");
});
```

- [ ] **Step 2: Run tests to verify it passes**

Run: `cd next-app && npx vitest run tests/sizzle-reel.test.tsx`
Expected: PASS — Task 1's rewrite already removed `aria-hidden`. This test guards against re-introducing it.

- [ ] **Step 3: Commit**

```bash
git add next-app/tests/sizzle-reel.test.tsx
git commit -m "test(sizzle-reel): assert video is not aria-hidden"
```

---

## Task 4: Add CSS for the toggle button

**Files:**
- Modify: `next-app/app/globals.css`

- [ ] **Step 1: Locate the sizzle-reel block**

The existing block lives around lines 399–417 of `next-app/app/globals.css`:

```css
.sizzle-reel {
  width: 100%;
  height: 100vh;
  padding: 0;
  margin: 0;
  background: #000;
  overflow: hidden;
  position: relative;
  scroll-snap-align: start;
}
.sizzle-reel-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
```

`.sizzle-reel` is already `position: relative`, so the absolutely-positioned button will anchor against it without changes.

- [ ] **Step 2: Append the new rules immediately after `.sizzle-reel-video`**

Insert the following block in `globals.css` right after the closing brace of `.sizzle-reel-video` (around line 417):

```css
.sizzle-reel-sound-toggle {
  position: absolute;
  bottom: 16px;
  right: 16px;
  width: 40px;
  height: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: none;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.55);
  color: var(--ink);
  cursor: pointer;
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  transition:
    background 0.2s ease,
    transform 0.2s ease;
  z-index: 2;
}
.sizzle-reel-sound-toggle:hover {
  background: rgba(0, 0, 0, 0.75);
  transform: translateY(-1px);
}
.sizzle-reel-sound-toggle:focus-visible {
  outline: 2px solid var(--marigold);
  outline-offset: 2px;
}
.sizzle-reel-sound-toggle svg {
  display: block;
}
```

Notes:
- `var(--ink)` (warm cream `#F2EBDA`, defined at line 22) is the icon color so it reads on the dark backdrop.
- `var(--marigold)` (`#F97B05`, line 20) is the brand focus accent.
- `z-index: 2` ensures the button stays above the video.

- [ ] **Step 3: Verify nothing else broke**

Run the full test suite to confirm CSS changes didn't disturb existing snapshots or smoke tests:

```bash
cd next-app && npm test
```

Expected: all tests pass (CSS isn't loaded in tests — vitest config has `css: false` — but run anyway to confirm no regression).

- [ ] **Step 4: Commit**

```bash
git add next-app/app/globals.css
git commit -m "style(sizzle-reel): add sound-toggle button styles"
```

---

## Task 5: Manual visual + audio verification in dev server

**Files:** none (verification only).

- [ ] **Step 1: Start the dev server**

```bash
cd next-app && npm run dev
```

Wait for the "Ready in Xms" line. Open the printed URL (usually `http://localhost:3000`).

- [ ] **Step 2: Verify the visual**

In the homepage, scroll to the sizzle-reel section between Hero and Manifesto. Confirm:

- [ ] A small circular semi-transparent dark button is visible in the bottom-right corner of the video.
- [ ] Hovering the button slightly darkens its background and lifts it ~1px.
- [ ] Tabbing to the button shows a visible orange focus outline.

- [ ] **Step 3: Verify the audio**

- [ ] Click the button — the speaker icon swaps from muted (slashed) to active (with sound waves) and you hear the sizzle reel audio.
- [ ] Click it again — audio mutes and the icon swaps back.
- [ ] Reload the page — verify the toggle resets to muted (no persistence).

- [ ] **Step 4: Verify nothing else regressed**

Run typecheck and full tests:

```bash
cd next-app && npm run typecheck && npm test
```

Expected: typecheck passes (no `tsc` errors), all tests pass.

- [ ] **Step 5: Verify the production build**

Per the MEMORY note about `hatch-n-harvest`, the deploy path uses `npm run build:prod`. Run it locally to make sure nothing breaks under the production basePath:

```bash
cd next-app && npm run build:prod
```

Expected: build completes without errors. (Do NOT commit the build output — `docs/` regeneration is a separate deploy step.)

- [ ] **Step 6: Commit any final cleanup**

If steps above surfaced any tweaks (icon color, sizing, focus ring), make them, run `npm test` again, and commit. Otherwise, nothing to commit at this step — the feature is complete on `main` (or the feature branch).

---

## Done When

- The sizzle-reel section on the homepage shows a small bottom-right sound-toggle button.
- Clicking it unmutes the video; clicking again re-mutes. Icon and ARIA both reflect state.
- `npm test`, `npm run typecheck`, and `npm run build:prod` all pass.
- New tests in `next-app/tests/sizzle-reel.test.tsx` cover: default muted state, unmute click, re-mute click, and the video not being `aria-hidden`.
