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
