import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
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
});
