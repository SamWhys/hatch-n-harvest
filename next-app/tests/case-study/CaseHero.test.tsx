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
          { label: "Role", value: "Identity · Campaign" },
          { label: "Year", value: "2025" },
        ]}
      />
    );
    expect(screen.getByRole("heading", { level: 1, name: "Test Case" })).toBeInTheDocument();
    expect(screen.getByText("A test kicker line.")).toBeInTheDocument();
    expect(screen.getByText("Client")).toBeInTheDocument();
    expect(screen.getByText("Test Co")).toBeInTheDocument();
    expect(screen.getByText("Role")).toBeInTheDocument();
    expect(screen.getByText("Identity · Campaign")).toBeInTheDocument();
    expect(screen.getByText("Year")).toBeInTheDocument();
    expect(screen.getByText("2025")).toBeInTheDocument();
  });
});
