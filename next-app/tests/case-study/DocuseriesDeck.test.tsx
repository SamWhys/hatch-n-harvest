import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { DocuseriesDeck, type DocuseriesEpisode } from "@/components/case-study/DocuseriesDeck";

const sample: DocuseriesEpisode[] = [
  { title: "Tech Rehearsal", thumbnail: "/a.jpg", alt: "alt-a", href: "https://example.com/a" },
  { title: "The Forge",      thumbnail: "/b.jpg", alt: "alt-b", href: "https://example.com/b" },
  { title: "The Gallery",    thumbnail: "/c.jpg", alt: "alt-c", href: "https://example.com/c" },
];

describe("DocuseriesDeck — scaffold", () => {
  it("renders the carousel landmark and three cards", () => {
    const { container } = render(<DocuseriesDeck episodes={sample} />);
    expect(container.querySelector('.docuseries-deck')).not.toBeNull();
    const cards = container.querySelectorAll('.dd-card');
    expect(cards.length).toBe(3);
  });

  it("renders the active episode title in the controls", () => {
    render(<DocuseriesDeck episodes={sample} />);
    expect(screen.getByText("Tech Rehearsal")).toBeInTheDocument();
  });

  it("advances activeIndex when next button clicked", () => {
    render(<DocuseriesDeck episodes={sample} />);
    expect(screen.getByText("Tech Rehearsal")).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText("Next episode"));
    expect(screen.getByText("The Forge")).toBeInTheDocument();
  });

  it("retreats activeIndex when prev button clicked, wrapping from 0 to last", () => {
    render(<DocuseriesDeck episodes={sample} />);
    fireEvent.click(screen.getByLabelText("Previous episode"));
    expect(screen.getByText("The Gallery")).toBeInTheDocument();
  });

  it("clicking a dot jumps to that episode", () => {
    render(<DocuseriesDeck episodes={sample} />);
    fireEvent.click(screen.getByLabelText("Episode 3: The Gallery"));
    expect(screen.getByText("The Gallery")).toBeInTheDocument();
  });

  it("active dot has aria-current=true", () => {
    render(<DocuseriesDeck episodes={sample} />);
    const activeDot = screen.getByLabelText("Episode 1: Tech Rehearsal");
    expect(activeDot).toHaveAttribute("aria-current", "true");
  });

  it("active card has the active episode's href and external-link attrs", () => {
    const { container } = render(<DocuseriesDeck episodes={sample} />);
    const active = container.querySelector(".dd-card-active") as HTMLAnchorElement;
    expect(active.getAttribute("href")).toBe("https://example.com/a");
    expect(active.getAttribute("target")).toBe("_blank");
    expect(active.getAttribute("rel")).toBe("noopener noreferrer");
  });

  it("side-peek cards are aria-hidden and tabindex -1", () => {
    const { container } = render(<DocuseriesDeck episodes={sample} />);
    const prev = container.querySelector(".dd-card-prev") as HTMLAnchorElement;
    const next = container.querySelector(".dd-card-next") as HTMLAnchorElement;
    expect(prev.getAttribute("aria-hidden")).toBe("true");
    expect(prev.getAttribute("tabindex")).toBe("-1");
    expect(next.getAttribute("aria-hidden")).toBe("true");
    expect(next.getAttribute("tabindex")).toBe("-1");
  });

  it("ArrowRight advances when focus is within the deck", () => {
    const { container } = render(<DocuseriesDeck episodes={sample} />);
    const section = container.querySelector(".docuseries-deck") as HTMLElement;
    fireEvent.keyDown(section, { key: "ArrowRight" });
    expect(screen.getByText("The Forge")).toBeInTheDocument();
  });

  it("ArrowLeft retreats when focus is within the deck", () => {
    const { container } = render(<DocuseriesDeck episodes={sample} />);
    const section = container.querySelector(".docuseries-deck") as HTMLElement;
    fireEvent.keyDown(section, { key: "ArrowLeft" });
    expect(screen.getByText("The Gallery")).toBeInTheDocument();
  });
});
