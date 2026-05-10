import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { CaseStudyShell } from "@/components/case-study/CaseStudyShell";

describe("CaseStudyShell", () => {
  it("renders Nav, main, Footer, and children", () => {
    render(
      <CaseStudyShell>
        <p>case-content</p>
      </CaseStudyShell>
    );
    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByRole("main")).toBeInTheDocument();
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
    expect(screen.getByText("case-content")).toBeInTheDocument();
  });

  it("passes homeHref through to Nav and Footer", () => {
    render(
      <CaseStudyShell>
        <p>x</p>
      </CaseStudyShell>
    );
    expect(screen.getByRole("link", { name: "Work" })).toHaveAttribute("href", "../../#work");
    // Footer logo (use the contentinfo region to disambiguate from Nav logo).
    const footer = screen.getByRole("contentinfo");
    const footerHome = footer.querySelector('a[aria-label="Hatch n Harvest — home"]');
    expect(footerHome).toHaveAttribute("href", "../../#top");
  });

  it("applies brandVars as inline style on the wrapper", () => {
    const { container } = render(
      <CaseStudyShell brandVars={{ "--afa-yellow": "#FFC200" } as React.CSSProperties}>
        <p>x</p>
      </CaseStudyShell>
    );
    const wrapper = container.querySelector(".case-study-shell") as HTMLElement;
    expect(wrapper).not.toBeNull();
    expect(wrapper.style.getPropertyValue("--afa-yellow")).toBe("#FFC200");
  });
});
