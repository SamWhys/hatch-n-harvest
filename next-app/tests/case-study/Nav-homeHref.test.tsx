import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Nav } from "@/components/Nav";

describe("Nav homeHref", () => {
  it("defaults to bare hash anchors when homeHref omitted", () => {
    render(<Nav />);
    expect(screen.getByRole("link", { name: "Work" })).toHaveAttribute("href", "#work");
    expect(screen.getByRole("link", { name: "Studio" })).toHaveAttribute("href", "#studio");
    expect(screen.getByRole("link", { name: "Start a project →" })).toHaveAttribute("href", "#contact");
    expect(screen.getByRole("link", { name: "Hatch n Harvest — home" })).toHaveAttribute("href", "#top");
  });

  it("prefixes hash anchors with homeHref when provided", () => {
    render(<Nav homeHref="../../" />);
    expect(screen.getByRole("link", { name: "Work" })).toHaveAttribute("href", "../../#work");
    expect(screen.getByRole("link", { name: "Studio" })).toHaveAttribute("href", "../../#studio");
    expect(screen.getByRole("link", { name: "Start a project →" })).toHaveAttribute("href", "../../#contact");
    expect(screen.getByRole("link", { name: "Hatch n Harvest — home" })).toHaveAttribute("href", "../../#top");
  });
});
