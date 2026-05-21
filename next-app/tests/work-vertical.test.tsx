import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Work } from "@/components/Work";

describe("Work — vertical full-bleed layout", () => {
  it("renders 4 .case-vertical sections inside .case-stack-vertical", () => {
    const { container } = render(<Work />);
    const deck = container.querySelector(".case-stack-vertical");
    expect(deck).not.toBeNull();
    const cards = deck!.querySelectorAll(".case-vertical");
    expect(cards.length).toBe(4);
  });

  it("each case uses the new BEM-style child class names", () => {
    const { container } = render(<Work />);
    const cards = container.querySelectorAll(".case-vertical");
    for (const card of Array.from(cards)) {
      expect(card.querySelector(".case-vertical__bg")).not.toBeNull();
      expect(card.querySelector(".case-vertical__content")).not.toBeNull();
      expect(card.querySelector(".case-vertical__sub")).not.toBeNull();
      expect(card.querySelector("h3.case-vertical__title")).not.toBeNull();
      expect(card.querySelector(".case-vertical__one-liner")).not.toBeNull();
      expect(card.querySelector(".case-vertical__cta")).not.toBeNull();
    }
  });

  it("the case title is an H3 element (not H2 or H1)", () => {
    const { container } = render(<Work />);
    const titles = container.querySelectorAll(".case-vertical .case-vertical__title");
    expect(titles.length).toBe(4);
    for (const t of Array.from(titles)) {
      expect(t.tagName).toBe("H3");
    }
  });

  it("the ColorPro card carries the Featured flag; no other card does", () => {
    const { container } = render(<Work />);
    const flags = container.querySelectorAll(".case-vertical__flag");
    expect(flags.length).toBe(1);
    const cpaLink = container.querySelector('a[href="work/colorpro-awards/"]');
    expect(cpaLink?.querySelector(".case-vertical__flag")).not.toBeNull();
  });

  it("each card is a single anchor link (full-bleed click target)", () => {
    const { container } = render(<Work />);
    const cards = container.querySelectorAll(".case-vertical");
    for (const card of Array.from(cards)) {
      expect(card.tagName).toBe("A");
      expect(card.getAttribute("href")).toMatch(/^work\/[a-z-]+\/$/);
    }
  });

  it("preserves the section heading and parallax mnemonic outside the deck", () => {
    const { container } = render(<Work />);
    expect(container.querySelector(".work-mnemonic.parallax-mnemonic")).not.toBeNull();
    expect(container.querySelector(".work-head")).not.toBeNull();
    const head = container.querySelector(".work-head");
    expect(head?.textContent).toContain("Brands we");
    expect(head?.textContent).toContain("helped grow.");
  });
});
