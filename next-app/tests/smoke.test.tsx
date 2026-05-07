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
    expect(screen.getByText("We")).toBeInTheDocument();
    expect(screen.getByText("hatch")).toBeInTheDocument();
    expect(screen.getByText("&")).toBeInTheDocument();
    expect(screen.getByText("harvest")).toBeInTheDocument();
    expect(screen.getByText("big ideas.")).toBeInTheDocument();
  });

  it("renders the contact script line and the studio sticker", () => {
    render(<HomePage />);
    expect(screen.getByText("Have a seed of an idea?")).toBeInTheDocument();
    expect(screen.getByText("Brand people. Not tech people.")).toBeInTheDocument();
  });

  it("renders footer copyright + 4 footer links", () => {
    render(<HomePage />);
    expect(screen.getByText(/© 2026 Hatch & Harvest · Taipei, Taiwan/)).toBeInTheDocument();
    const footerNav = screen.getByRole("navigation", { name: "Footer" });
    const links = footerNav.querySelectorAll("a");
    expect(links.length).toBe(4);
  });

  it("renders the four belief cards with correct numbers", () => {
    render(<HomePage />);
    ["01", "02", "03", "04"].forEach((n) => {
      expect(screen.getByText(n)).toBeInTheDocument();
    });
  });

  it("renders the work section with featured + acceleration + 3 locked cases", () => {
    render(<HomePage />);
    expect(screen.getByText("Kestrel Coast")).toBeInTheDocument();
    expect(screen.getByText("Acceleration For All")).toBeInTheDocument();
    expect(screen.getByText("Small Acre")).toBeInTheDocument();
    expect(screen.getByText("Moth & Bloom")).toBeInTheDocument();
    expect(screen.getByText("Common Range")).toBeInTheDocument();
  });

  it("renders the three process services", () => {
    render(<HomePage />);
    expect(screen.getByRole("heading", { name: "Strategy", level: 3 })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Identity", level: 3 })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Launch", level: 3 })).toBeInTheDocument();
  });

  it("renders the contact email", () => {
    render(<HomePage />);
    const email = screen.getByRole("link", { name: "hello@hatchnharvest.studio" });
    expect(email).toBeInTheDocument();
    expect(email).toHaveAttribute("href", "mailto:hello@hatchnharvest.studio");
  });

  it("renders nav with 3 anchor links + CTA", () => {
    render(<HomePage />);
    expect(screen.getByRole("link", { name: "Work" })).toHaveAttribute("href", "#work");
    expect(screen.getByRole("link", { name: "Process" })).toHaveAttribute("href", "#process");
    expect(screen.getByRole("link", { name: "Studio" })).toHaveAttribute("href", "#studio");
    expect(screen.getByRole("link", { name: "Start a project →" })).toHaveAttribute("href", "#contact");
  });

  it("does not render any broken asset paths (assets/ prefix only)", () => {
    const { container } = render(<HomePage />);
    const imgs = Array.from(container.querySelectorAll("img"));
    const localImgs = imgs.filter((img) => !img.src.startsWith("https://"));
    expect(localImgs.length).toBeGreaterThan(0);
    localImgs.forEach((img) => {
      expect(img.src).toMatch(/assets\/(brand|work)\//);
    });
  });

  it("Work mnemonic carries the parallax-mnemonic class", () => {
    const { container } = render(<HomePage />);
    const img = container.querySelector(".work-mnemonic");
    expect(img).not.toBeNull();
    expect(img?.classList.contains("parallax-mnemonic")).toBe(true);
  });

  it("Process mnemonic carries the parallax-mnemonic class", () => {
    const { container } = render(<HomePage />);
    const img = container.querySelector(".process-mnemonic");
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
