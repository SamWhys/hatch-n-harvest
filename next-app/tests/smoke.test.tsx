import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import HomePage from "@/app/page";

describe("HomePage smoke tests", () => {
  it("renders without crashing", () => {
    render(<HomePage />);
    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  });

  it("renders the hero headline words", () => {
    render(<HomePage />);
    const h1 = screen.getByRole("heading", { level: 1 });
    expect(h1.textContent).toContain("We");
    expect(h1.textContent).toContain("hatch");
    expect(h1.textContent).toContain("&");
    expect(h1.textContent).toContain("harvest");
    expect(h1.textContent).toContain("big ideas.");
  });

  it("renders the contact script line", () => {
    render(<HomePage />);
    expect(screen.getByText("Have a seed of an idea?")).toBeInTheDocument();
  });

  it("renders footer copyright", () => {
    render(<HomePage />);
    expect(screen.getByText(/© 2026 Hatch & Harvest/)).toBeInTheDocument();
  });

  it("renders the four belief cards with correct numbers", () => {
    render(<HomePage />);
    ["01", "02", "03", "04"].forEach((n) => {
      expect(screen.getByText(n)).toBeInTheDocument();
    });
  });

  it("renders the work section with featured + 2 active + 2 locked cases", () => {
    render(<HomePage />);
    expect(screen.getByText("Kestrel Coast")).toBeInTheDocument();
    expect(screen.getByText("Acceleration For All")).toBeInTheDocument();
    expect(screen.getByText("United by Play")).toBeInTheDocument();
    expect(screen.getByText("Moth & Bloom")).toBeInTheDocument();
    expect(screen.getByText("Common Range")).toBeInTheDocument();
  });

  it("renders the contact email", () => {
    render(<HomePage />);
    const email = screen.getByRole("link", { name: "hello@hatchnharvest.com" });
    expect(email).toBeInTheDocument();
    expect(email).toHaveAttribute("href", "mailto:hello@hatchnharvest.com");
  });

  it("renders nav with 2 anchor links + CTA", () => {
    render(<HomePage />);
    expect(screen.getByRole("link", { name: "Work" })).toHaveAttribute("href", "#work");
    expect(screen.getByRole("link", { name: "Studio" })).toHaveAttribute("href", "#studio");
    expect(screen.getByRole("link", { name: "Start a project →" })).toHaveAttribute("href", "#contact");
  });

  it("links AfA and UbP cards to clean URLs and leaves Kestrel Coast unchanged", () => {
    render(<HomePage />);
    const afaLink = screen.getByLabelText(
      "Acceleration For All — ViewSonic × Hustle Fund case study"
    );
    expect(afaLink).toHaveAttribute("href", "work/acceleration-for-all/");

    const ubpLink = screen.getByLabelText(
      "United by Play — ViewSonic global gaming campaign case study"
    );
    expect(ubpLink).toHaveAttribute("href", "work/united-by-play/");

    const kcLink = screen.getByLabelText(
      "Kestrel Coast — destination rebrand case study"
    );
    expect(kcLink).toHaveAttribute("href", "work/kestrel-coast.html");
  });

  it("does not render any broken asset paths (assets/ prefix only)", () => {
    const { container } = render(<HomePage />);
    const imgs = Array.from(container.querySelectorAll("img"));
    const localImgs = imgs.filter((img) => !img.src.startsWith("https://"));
    expect(localImgs.length).toBeGreaterThan(0);
    localImgs.forEach((img) => {
      expect(img.src).toMatch(/assets\/(brand|work|team)\//);
    });
  });

  it("Work mnemonic carries the parallax-mnemonic class", () => {
    const { container } = render(<HomePage />);
    const img = container.querySelector(".work-mnemonic");
    expect(img).not.toBeNull();
    expect(img?.classList.contains("parallax-mnemonic")).toBe(true);
  });

  it("Contact-left mnemonic carries the parallax-mnemonic class", () => {
    const { container } = render(<HomePage />);
    const img = container.querySelector(".contact-decor.left");
    expect(img).not.toBeNull();
    expect(img?.classList.contains("parallax-mnemonic")).toBe(true);
  });

  it("Contact-right mnemonic carries the parallax-mnemonic class", () => {
    const { container } = render(<HomePage />);
    const img = container.querySelector(".contact-decor.right");
    expect(img).not.toBeNull();
    expect(img?.classList.contains("parallax-mnemonic")).toBe(true);
  });
});
