import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { SizzleReel } from "@/components/SizzleReel";

describe("SizzleReel sound toggle", () => {
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

  it("renders a sound-toggle button labeled 'Unmute video' by default", () => {
    render(<SizzleReel />);
    const button = screen.getByRole("button", { name: "Unmute video" });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("aria-pressed", "false");
  });

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

  it("does not aria-hide the video (it is now interactive)", () => {
    const { container } = render(<SizzleReel />);
    const video = container.querySelector("video");
    expect(video).not.toBeNull();
    expect(video).not.toHaveAttribute("aria-hidden");
  });

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
});
