import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { CaseBleed } from "@/components/case-study/CaseBleed";

describe("CaseBleed", () => {
  it("renders the image with src and alt", () => {
    render(<CaseBleed src="../../assets/work/x/hero.jpg" alt="Hero shot" />);
    const img = screen.getByAltText("Hero shot") as HTMLImageElement;
    expect(img).toBeInTheDocument();
    expect(img.getAttribute("src")).toBe("../../assets/work/x/hero.jpg");
  });

  it("defaults to the 'full' variant class", () => {
    const { container } = render(<CaseBleed src="x" alt="" />);
    expect(container.querySelector(".case-bleed.case-bleed-full")).not.toBeNull();
  });

  it("applies the 'wide' variant class when variant='wide'", () => {
    const { container } = render(<CaseBleed src="x" alt="" variant="wide" />);
    expect(container.querySelector(".case-bleed.case-bleed-wide")).not.toBeNull();
  });

  it("renders a caption when provided", () => {
    render(<CaseBleed src="x" alt="" caption="A caption" />);
    expect(screen.getByText("A caption")).toBeInTheDocument();
  });

  it("renders no <figcaption> when caption omitted", () => {
    const { container } = render(<CaseBleed src="x" alt="" />);
    expect(container.querySelector("figcaption")).toBeNull();
  });
});
