import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { CaseSection } from "@/components/case-study/CaseSection";

describe("CaseSection", () => {
  it("renders eyebrow, heading, and children", () => {
    render(
      <CaseSection eyebrow="The problem" heading="A real problem">
        <p>Body copy.</p>
      </CaseSection>
    );
    expect(screen.getByText("The problem")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "A real problem" })).toBeInTheDocument();
    expect(screen.getByText("Body copy.")).toBeInTheDocument();
  });

  it("omits eyebrow and heading when not provided", () => {
    const { container } = render(
      <CaseSection>
        <p>Body only.</p>
      </CaseSection>
    );
    expect(container.querySelector(".eyebrow")).toBeNull();
    expect(container.querySelector("h2")).toBeNull();
    expect(screen.getByText("Body only.")).toBeInTheDocument();
  });

  it("applies className and id to the section element", () => {
    const { container } = render(
      <CaseSection className="problem" id="problem">
        <p>x</p>
      </CaseSection>
    );
    const section = container.querySelector("section");
    expect(section).not.toBeNull();
    expect(section?.className).toBe("problem");
    expect(section?.id).toBe("problem");
  });

  it("supports ReactNode in heading", () => {
    const { container } = render(
      <CaseSection heading={<>Acceleration <em>For All.</em></>}>
        <p>x</p>
      </CaseSection>
    );
    const h2 = container.querySelector("h2");
    expect(h2?.querySelector("em")?.textContent).toBe("For All.");
  });

  it("wraps content in a .wrap container", () => {
    const { container } = render(
      <CaseSection>
        <p>x</p>
      </CaseSection>
    );
    expect(container.querySelector("section > .wrap")).not.toBeNull();
  });
});
