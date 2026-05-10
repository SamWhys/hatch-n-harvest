import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { CaseHero } from "@/components/case-study/CaseHero";

describe("CaseHero", () => {
  it("renders title, kicker, and all meta pairs", () => {
    render(
      <CaseHero
        kicker="A test kicker line."
        title="Test Case"
        meta={[
          { label: "Client", value: "Test Co" },
          { label: "Scope", value: "Identity · Campaign" },
          { label: "Year", value: "2025" },
          { label: "Reach", value: "Global" },
        ]}
      />
    );
    expect(screen.getByRole("heading", { level: 1, name: "Test Case" })).toBeInTheDocument();
    expect(screen.getByText("A test kicker line.")).toBeInTheDocument();
    expect(screen.getByText("Client")).toBeInTheDocument();
    expect(screen.getByText("Test Co")).toBeInTheDocument();
    expect(screen.getByText("Scope")).toBeInTheDocument();
    expect(screen.getByText("Identity · Campaign")).toBeInTheDocument();
    expect(screen.getByText("Year")).toBeInTheDocument();
    expect(screen.getByText("2025")).toBeInTheDocument();
    expect(screen.getByText("Reach")).toBeInTheDocument();
    expect(screen.getByText("Global")).toBeInTheDocument();
  });

  it("renders eyebrow when provided", () => {
    render(
      <CaseHero
        eyebrow="Campaign · 2021"
        kicker="x"
        title="Test"
        meta={[{ label: "a", value: "b" }]}
      />
    );
    expect(screen.getByText("Campaign · 2021")).toBeInTheDocument();
  });

  it("omits eyebrow when not provided", () => {
    const { container } = render(
      <CaseHero kicker="x" title="Test" meta={[{ label: "a", value: "b" }]} />
    );
    expect(container.querySelector(".eyebrow")).toBeNull();
  });

  it("renders backLink with label and href when provided", () => {
    render(
      <CaseHero
        backLink={{ label: "All work", href: "../../#work" }}
        kicker="x"
        title="Test"
        meta={[{ label: "a", value: "b" }]}
      />
    );
    const link = screen.getByRole("link", { name: /All work/ });
    expect(link).toHaveAttribute("href", "../../#work");
  });

  it("omits backLink when not provided", () => {
    const { container } = render(
      <CaseHero kicker="x" title="Test" meta={[{ label: "a", value: "b" }]} />
    );
    expect(container.querySelector(".back-link")).toBeNull();
  });

  it("supports ReactNode in title (e.g. italicized emphasis)", () => {
    const { container } = render(
      <CaseHero
        kicker="x"
        title={<>Acceleration <em>For All.</em></>}
        meta={[{ label: "a", value: "b" }]}
      />
    );
    const h1 = container.querySelector("h1");
    expect(h1?.querySelector("em")?.textContent).toBe("For All.");
  });
});
