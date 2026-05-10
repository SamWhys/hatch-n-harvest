import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { CaseBleed } from "@/components/case-study/CaseBleed";

describe("CaseBleed", () => {
  it("renders children inside .case-bleed wrapper", () => {
    const { container } = render(
      <CaseBleed>
        <iframe title="Test video" src="https://www.youtube.com/embed/x" />
      </CaseBleed>
    );
    const bleed = container.querySelector(".case-bleed");
    expect(bleed).not.toBeNull();
    expect(bleed?.querySelector("iframe")).not.toBeNull();
    expect(screen.getByTitle("Test video")).toBeInTheDocument();
  });

  it("supports an <img> child", () => {
    render(
      <CaseBleed>
        <img src="../../assets/work/x/hero.jpg" alt="Hero" />
      </CaseBleed>
    );
    const img = screen.getByAltText("Hero") as HTMLImageElement;
    expect(img.getAttribute("src")).toBe("../../assets/work/x/hero.jpg");
  });

  it("renders a structured bleed-caption sibling when caption provided", () => {
    const { container } = render(
      <CaseBleed caption={{ title: "Campaign film · Acceleration For All.", meta: "Hero · 2021" }}>
        <iframe title="x" src="x" />
      </CaseBleed>
    );
    const cap = container.querySelector(".bleed-caption");
    expect(cap).not.toBeNull();
    expect(cap?.querySelector("strong")?.textContent).toBe("Campaign film · Acceleration For All.");
    expect(cap?.querySelector("span")?.textContent).toBe("Hero · 2021");
  });

  it("omits .bleed-caption when caption not provided", () => {
    const { container } = render(
      <CaseBleed>
        <iframe title="x" src="x" />
      </CaseBleed>
    );
    expect(container.querySelector(".bleed-caption")).toBeNull();
  });
});
