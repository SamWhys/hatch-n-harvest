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

---

## Task 6: Add `userIntent` state + `applyIntent` helper + IntersectionObserver scroll-aware muting

This task implements the design-spec **Revision (2026-05-20)** added to [the design doc](./2026-05-20-sizzle-reel-sound-toggle-design.md). It introduces a `userIntent` state, an `applyIntent` helper, an IntersectionObserver effect, and tests using a custom IntersectionObserver mock that captures the callback.

**Files:**
- Modify: `next-app/components/SizzleReel.tsx`
- Modify: `next-app/tests/sizzle-reel.test.tsx`

- [ ] **Step 1: Write the failing tests**

Edit `next-app/tests/sizzle-reel.test.tsx`. **Update the top-of-file imports** to add `vi`, `beforeEach`, `afterEach`, and `waitFor`:

```tsx
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { SizzleReel } from "@/components/SizzleReel";
```

Inside the existing `describe("SizzleReel sound toggle", ...)` block, **add this setup at the top of the describe** (immediately after the opening line, before the first `it(...)`):

```tsx
let mockObserverCallbacks: IntersectionObserverCallback[];

beforeEach(() => {
  mockObserverCallbacks = [];
  class MockObserver {
    constructor(public callback: IntersectionObserverCallback) {
      mockObserverCallbacks.push(callback);
    }
    observe(): void {}
    unobserve(): void {}
    disconnect(): void {}
    takeRecords(): IntersectionObserverEntry[] {
      return [];
    }
  }
  vi.stubGlobal("IntersectionObserver", MockObserver);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

function fireIntersection(isIntersecting: boolean): void {
  const cb = mockObserverCallbacks[mockObserverCallbacks.length - 1];
  if (!cb) throw new Error("No IntersectionObserver was created");
  cb(
    [{ isIntersecting } as IntersectionObserverEntry],
    {} as IntersectionObserver,
  );
}
```

Then **append** these new `it(...)` blocks inside the same `describe` block (after the existing tests):

```tsx
it("mutes the video when the section scrolls out of view", async () => {
  const { container } = render(<SizzleReel />);
  const video = container.querySelector("video") as HTMLVideoElement;

  // Start unmuted via toggle click (jsdom's play() returns undefined, so the
  // optimistic unmute sticks — see applyIntent in SizzleReel.tsx).
  fireEvent.click(screen.getByRole("button", { name: "Unmute video" }));
  expect(video.muted).toBe(false);

  // Now simulate the section scrolling out of view.
  fireIntersection(false);

  expect(video.muted).toBe(true);
  await waitFor(() => {
    expect(
      screen.getByRole("button", { name: "Unmute video" }),
    ).toBeInTheDocument();
  });
});

it("restores the user's sound-on intent when the section scrolls back into view", async () => {
  const { container } = render(<SizzleReel />);
  const video = container.querySelector("video") as HTMLVideoElement;

  // User clicks unmute → userIntent becomes "sound-on".
  fireEvent.click(screen.getByRole("button", { name: "Unmute video" }));
  // Scroll out → auto-mute.
  fireIntersection(false);
  expect(video.muted).toBe(true);
  // Scroll back in → should re-apply userIntent="sound-on".
  fireIntersection(true);
  expect(video.muted).toBe(false);
  await waitFor(() => {
    expect(
      screen.getByRole("button", { name: "Mute video" }),
    ).toBeInTheDocument();
  });
});

it("keeps muted state on scroll-in when user's last intent was muted", () => {
  const { container } = render(<SizzleReel />);
  const video = container.querySelector("video") as HTMLVideoElement;
  // Default state is muted; userIntent defaults to "sound-on", but we want
  // to test the explicit "muted" intent path. Click unmute then mute to set
  // userIntent="muted".
  fireEvent.click(screen.getByRole("button", { name: "Unmute video" }));
  fireEvent.click(screen.getByRole("button", { name: "Mute video" }));
  expect(video.muted).toBe(true);

  fireIntersection(false);
  expect(video.muted).toBe(true);
  fireIntersection(true);
  // userIntent is "muted", so scroll-in should NOT unmute.
  expect(video.muted).toBe(true);
});

it("reverts to muted when play() rejects (browser autoplay block)", async () => {
  // Stub HTMLMediaElement.play to reject — simulating the browser
  // blocking autoplay-with-sound.
  const originalPlay = HTMLMediaElement.prototype.play;
  HTMLMediaElement.prototype.play = vi
    .fn()
    .mockRejectedValue(new DOMException("blocked", "NotAllowedError"));

  try {
    const { container } = render(<SizzleReel />);
    const video = container.querySelector("video") as HTMLVideoElement;

    // Section scrolls into view → applyIntent("sound-on") → tries unmute → rejected → reverts.
    fireIntersection(true);
    // The optimistic unmute happens synchronously, but the rejection-revert is async.
    await waitFor(() => {
      expect(video.muted).toBe(true);
    });
    expect(
      screen.getByRole("button", { name: "Unmute video" }),
    ).toBeInTheDocument();
  } finally {
    HTMLMediaElement.prototype.play = originalPlay;
  }
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `cd next-app && npx vitest run tests/sizzle-reel.test.tsx`
Expected: The four NEW tests FAIL (the existing four still pass). Failures should be variations of "expected video.muted to be true / false" — meaning the component does not yet have the scroll-aware behavior. If a failure is "no IntersectionObserver was created," that means the component hasn't added the observer yet, which is also expected before Step 3.

- [ ] **Step 3: Replace the contents of `next-app/components/SizzleReel.tsx`**

Replace the entire file with:

```tsx
"use client";

import { useEffect, useRef, useState } from "react";

type SoundIntent = "sound-on" | "muted";

export function SizzleReel({ srcPrefix = "" }: { srcPrefix?: string }) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [muted, setMuted] = useState(true);
  const [userIntent, setUserIntent] = useState<SoundIntent>("sound-on");

  function applyIntent(intent: SoundIntent): void {
    const video = videoRef.current;
    if (!video) return;
    if (intent === "muted") {
      video.muted = true;
      setMuted(true);
      return;
    }
    // intent === "sound-on" — optimistically unmute.
    video.muted = false;
    setMuted(false);
    Promise.resolve(video.play()).catch(() => {
      // Browser blocked autoplay-with-sound. Revert to muted autoplay.
      video.muted = true;
      setMuted(true);
      Promise.resolve(video.play()).catch(() => {
        // Even muted autoplay failed (jsdom or extreme cases) — give up silently.
      });
    });
  }

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        if (entry.isIntersecting) {
          applyIntent(userIntent);
        } else {
          const video = videoRef.current;
          if (!video) return;
          video.muted = true;
          setMuted(true);
        }
      },
      { threshold: 0 },
    );
    observer.observe(section);
    return () => observer.disconnect();
    // applyIntent is stable enough; userIntent is the relevant dep.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userIntent]);

  function toggleSound(): void {
    const nextIntent: SoundIntent = muted ? "sound-on" : "muted";
    setUserIntent(nextIntent);
    applyIntent(nextIntent);
  }

  return (
    <section ref={sectionRef} className="sizzle-reel" aria-label="Sizzle reel">
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

- [ ] **Step 4: Run all tests in the file to verify they pass**

Run: `cd next-app && npx vitest run tests/sizzle-reel.test.tsx`
Expected: 8 tests pass (the 4 existing + 4 new).

If the "reverts to muted when play() rejects" test fails because state hasn't settled, double-check that the test wraps assertions in `await waitFor(...)`.

- [ ] **Step 5: Run the full suite to check for regressions**

Run: `cd next-app && npm test`
Expected: all tests pass except the pre-existing `united-by-play.test.tsx` failure (which is unrelated to this work — already flagged for separate handling).

- [ ] **Step 6: Commit**

```bash
git add next-app/components/SizzleReel.tsx next-app/tests/sizzle-reel.test.tsx
git commit -m "feat(sizzle-reel): sound-by-default + scroll-aware muting"
```

---

## Task 7: Manual dev-server + typecheck + production build verification (revision)

Re-run the full verification flow now that scroll-aware muting and sound-by-default are in.

**Files:** none (verification only).

- [ ] **Step 1: Start the dev server**

```bash
cd next-app && npm run dev
```

Wait for the "Ready in Xms" line. Open `http://localhost:3000/hatch-n-harvest/` (the dev server uses the `/hatch-n-harvest` basePath unless `CUSTOM_DOMAIN=true` is set).

- [ ] **Step 2: Verify scroll-aware muting**

- [ ] Scroll to the sizzle reel. Click the toggle to unmute — confirm audio starts and the icon swaps to the unmuted (waves) speaker.
- [ ] Scroll past the sizzle reel into the Manifesto section. Audio should cut out — but the video itself should keep playing (you can confirm by scrolling back; loop timing should feel continuous, not paused).
- [ ] Scroll back up into the sizzle reel — audio should resume automatically and the icon should swap back to unmuted.
- [ ] Click the toggle to mute. Scroll out, then back in — audio should stay off (the toggle's most recent state was muted).

- [ ] **Step 3: Verify sound-by-default best-effort**

- [ ] Hard-reload the page (Cmd+Shift+R). On most fresh sessions the reel will start muted (browser autoplay policy blocking sound) — that's expected. The icon should show the muted (slashed) state.
- [ ] Click anywhere on the page first (e.g. a nav link, then come back), then reload — sound *may* auto-start on this reload because the session now has prior user activation. Behavior varies by browser; Chrome with high media engagement scores is most likely to allow it.

- [ ] **Step 4: Verify typecheck and tests**

```bash
cd next-app && npm run typecheck && npm test
```

Expected: typecheck clean. Tests: 110 passing, 1 pre-existing failure in `united-by-play.test.tsx` (unrelated).

- [ ] **Step 5: Verify production build**

```bash
cd next-app && npm run build:prod
```

Expected: build completes without errors. Do NOT commit the regenerated `docs/` output — that's a deploy step.

- [ ] **Step 6: Commit any final cleanup**

If steps surfaced any tweaks, make them, re-run `npm test`, and commit. Otherwise nothing to commit.

---

## Done When

- The sizzle-reel section shows a small bottom-right sound-toggle button.
- Clicking it unmutes/re-mutes the video. Icon and ARIA reflect the actual state.
- Audio auto-mutes when the section leaves the viewport and restores the user's last sound choice when it re-enters.
- The component attempts to "play with sound" on every scroll-into-view; it falls back to muted gracefully when the browser blocks it.
- `npm test`, `npm run typecheck`, and `npm run build:prod` all pass (the pre-existing `united-by-play.test.tsx` failure is out of scope and tracked separately).
- New tests in `next-app/tests/sizzle-reel.test.tsx` cover: default muted state, unmute click, re-mute click, video not `aria-hidden`, scroll-out auto-mute, scroll-in restore (sound-on intent), scroll-in stays-muted (muted intent), and play() rejection fallback.
