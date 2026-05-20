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
