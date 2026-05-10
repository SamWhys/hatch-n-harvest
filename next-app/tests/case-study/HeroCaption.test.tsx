import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { HeroCaption } from "@/components/case-study/HeroCaption";

describe("HeroCaption", () => {
  it("renders strong + span inside .hero-caption", () => {
    const { container } = render(
      <HeroCaption title="Manifesto film · Acceleration For All." meta="Hero · 2021" />
    );
    const cap = container.querySelector(".hero-caption");
    expect(cap).not.toBeNull();
    expect(cap?.querySelector("strong")).not.toBeNull();
    expect(cap?.querySelector("span")).not.toBeNull();
  });

  it("renders the provided title and meta text", () => {
    const { container } = render(
      <HeroCaption title="Manifesto film · Acceleration For All." meta="Hero · 2021" />
    );
    const cap = container.querySelector(".hero-caption");
    expect(cap?.querySelector("strong")?.textContent).toBe("Manifesto film · Acceleration For All.");
    expect(cap?.querySelector("span")?.textContent).toBe("Hero · 2021");
  });
});
