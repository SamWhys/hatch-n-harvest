import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { SizzleReel } from "@/components/SizzleReel";

describe("SizzleReel sound toggle", () => {
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
});
