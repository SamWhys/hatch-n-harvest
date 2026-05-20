# Sizzle Reel Sound Toggle — Design

## Background

The homepage sizzle reel ([next-app/components/SizzleReel.tsx](../next-app/components/SizzleReel.tsx)) currently plays a self-hosted MP4 (`assets/video/sizzle-reel.mp4`) as a muted, looping, autoplaying background-style video with no controls. It is marked `aria-hidden="true"` and treated as decorative.

We want to give visitors the option to hear the reel without changing its cinematic, background-feel default. A small floating sound toggle in the bottom-right corner of the video gives an opt-in path to audio while preserving the silent-loop default.

A separate, larger decision — whether to keep this self-hosted or migrate to a YouTube embed once the final cut is delivered — is deferred. Today's repo footprint (~320 MB tracked, ~18 MB for the current `sizzle-reel.mp4`) leaves comfortable headroom under GitHub Pages' ~1 GB soft cap, so the self-hosted approach remains viable in the short term.

## Goals

- Add a discoverable but unobtrusive way for visitors to unmute the homepage sizzle reel.
- Preserve the existing default: muted, autoplaying, looping background feel.
- No regressions to accessibility, keyboard nav, or screen-reader behavior.

## Non-Goals

- No volume slider — on/off only.
- No keyboard shortcut (e.g. `M`) — overkill for a single video.
- No analytics event on toggle.
- No auto-mute on scroll-out — the user's explicit unmute choice persists for the page lifetime even if they scroll away.
- No persistence across page loads — every fresh visit starts muted.
- No change to the underlying video asset or its hosting strategy in this work.

## Design

### Component changes ([next-app/components/SizzleReel.tsx](../next-app/components/SizzleReel.tsx))

- Convert `SizzleReel` to a client component (`"use client"` directive) so it can hold mute state and respond to clicks. It is currently a server component because it has no interactivity.
- Keep the existing `autoPlay muted loop playsInline preload="auto"` attributes on the `<video>` — muted autoplay is required by all major browsers, so the initial load behavior cannot change.
- Add a `ref` to the `<video>` element so the toggle can imperatively set `videoEl.muted`.
- Add a `muted` state (`useState(true)`) that drives the icon and `aria-pressed` state on the button.
- Remove `aria-hidden="true"` from the `<video>`. A video with an interactive sound control is no longer purely decorative; hiding it from assistive tech while exposing a "mute video" button would be inconsistent.
- Add a `<button type="button">` inside the `.sizzle-reel` section with class `sizzle-reel-sound-toggle`. The button:
  - Toggles `videoEl.muted` on click and updates local state.
  - Renders one of two inline SVG icons (speaker-muted / speaker-on) based on state.
  - Has `aria-label="Unmute video"` when muted, `"Mute video"` when unmuted.
  - Has `aria-pressed={!muted}` to convey state to assistive tech.

### Styles ([next-app/app/globals.css](../next-app/app/globals.css))

- Ensure `.sizzle-reel` is `position: relative` so the absolutely-positioned button anchors against it. If it already is (likely, since it's a `<section>` styled to crop the video), no change is needed.
- New `.sizzle-reel-sound-toggle` rules:
  - `position: absolute; bottom: 16px; right: 16px;`
  - ~40px circular button (`width: 40px; height: 40px; border-radius: 50%;`)
  - Background: `rgba(0, 0, 0, 0.55)` with `backdrop-filter: blur(6px)`. Hover: `rgba(0, 0, 0, 0.75)`.
  - Icon (inline SVG) ~18px, white stroke.
  - `:focus-visible` outline matching the focus pattern already used elsewhere in `globals.css` (look up the existing convention during implementation rather than introducing a new one).
  - `border: none; cursor: pointer;`
  - Transition on background and transform for a subtle hover lift.

### Icons

Two inline SVG paths defined in the same file (or as small `Icon` consts). Using inline SVG avoids adding image assets for two ~1KB icons:

- **Muted**: speaker silhouette with a diagonal slash.
- **Unmuted**: speaker silhouette with one or two sound waves.

Both icons share the same viewBox and stroke style so the visual swap is clean.

### Behavior

| Action | Result |
| --- | --- |
| Page load | Video autoplays muted (unchanged from today). Button shows muted icon. |
| Click button (muted → unmuted) | `videoEl.muted = false`. Video continues from current playback position. Icon swaps. `aria-label` updates. |
| Click button (unmuted → muted) | `videoEl.muted = true`. Same swap in reverse. |
| Scroll away while unmuted | Audio continues — this is the user's explicit choice. |
| Page reload / navigation back to home | Resets to muted. No persistence. |

### Edge cases

- **Audio track present.** Verified via `ffprobe`: `sizzle-reel.mp4` contains a stereo AAC track at 48kHz alongside the H.264 video. Unmuting will produce audio.
- **Browser blocks unmute.** Programmatically setting `videoEl.muted = false` after a user click is treated as user-initiated and is allowed across browsers. No special handling needed.
- **Mobile Safari quirks.** `playsInline` is already set; setting `.muted = false` in a click handler is supported. Verified pattern.
- **Reduced motion.** The button is static visual chrome; no motion considerations.

## Files Touched

- [next-app/components/SizzleReel.tsx](../next-app/components/SizzleReel.tsx) — convert to client component, add state, ref, button, icons.
- [next-app/app/globals.css](../next-app/app/globals.css) — add `.sizzle-reel-sound-toggle` styles; ensure `.sizzle-reel` is positioned.
- No new files needed.

## Revision (2026-05-20): Sound-by-default and scroll-aware muting

After reviewing the initial implementation, two behaviors were added:

### Sound-on-by-default (best-effort)

Browsers block autoplay with sound on first load — that constraint can't be overridden. But we can:

1. Default the user's *intent* to `"sound-on"` so they don't have to opt in.
2. On every scroll into view (including initial mount when the section is already visible), attempt to apply that intent — unmute the video. If the browser rejects (autoplay policy), gracefully fall back to muted.

In practice the reel still typically starts muted on first load. But on return visits, or sessions where the user has already interacted with the site, the reel may start unmuted.

### Scroll-aware muting

Using `IntersectionObserver` on the `<section>`:

- Section leaves viewport → mute the audio. The `<video>` keeps playing — only audio is gated, so loop timing stays continuous.
- Section enters viewport → apply the user's last deliberate sound intent.

### State model

Two pieces of state:

- `muted: boolean` — actual `<video>.muted` value. Drives the icon and `aria-pressed`. **Always reflects reality.**
- `userIntent: "sound-on" | "muted"` — last deliberate user choice. Defaults to `"sound-on"`. Updated only by toggle clicks (not by scroll-out auto-mute, not by autoplay-rejection fallback).

`userIntent` decides what to apply on scroll-into-view; `muted` decides what the button looks like. The two can diverge — e.g. user wants sound, but section is scrolled away → `userIntent="sound-on"` while `muted=true`.

### `applyIntent` helper (implementation contract)

A single helper handles all "make the video match this intent" calls, used both by the IntersectionObserver callback and by `toggleSound`:

- If intent is `"muted"`: set `video.muted = true` and `setMuted(true)`. Synchronous.
- If intent is `"sound-on"`: optimistically set `video.muted = false` and `setMuted(false)`. Call `video.play()` and `.catch(...)` — on rejection (autoplay blocked), revert: `video.muted = true; setMuted(true);` and re-start muted-autoplay.

This keeps the happy path synchronous (good for tests and perceived snappiness) while still recovering from autoplay-policy rejection.

### Edge cases

- **Initial load, section already in view:** IntersectionObserver fires `isIntersecting=true` on first observation → applies `userIntent="sound-on"` → optimistic unmute → browser rejects → reverts to muted. Net effect on first load: muted.
- **Return visit / user already interacted:** Same flow, but unmute may succeed → starts unmuted.
- **User mutes via toggle then scrolls away:** `userIntent` becomes `"muted"`. Scroll-out also mutes (no-op). Scroll-back-in applies `"muted"` intent → stays muted.
- **User unmutes via toggle then scrolls away:** `userIntent="sound-on"`. Scroll-out mutes audio (does NOT change `userIntent`). Scroll-back-in re-applies `"sound-on"` → unmutes again if browser allows.
- **Browser blocks autoplay-with-sound the whole session:** Every `applyIntent("sound-on")` reverts to muted. User has to click the toggle to unmute. Once they do, scroll-out/in cycles work as expected (because by then user activation has occurred).

## Future Work (Out of Scope)

- Decide whether to migrate to a YouTube embed once the final cut is delivered. YouTube would give the sound toggle, captions, and adaptive streaming for free at the cost of YouTube branding and a less seamless loop. Revisit when the final video lands and we know its length, whether it has narration, and how much repo budget it consumes.
