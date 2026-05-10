import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import AccelerationForAllPage from "@/app/work/acceleration-for-all/page";

describe("Acceleration For All page", () => {
    it("renders the shell", () => {
        render(<AccelerationForAllPage />);
        expect(screen.getByRole("banner")).toBeInTheDocument();
        expect(screen.getByRole("main")).toBeInTheDocument();
        expect(screen.getByRole("contentinfo")).toBeInTheDocument();
    });

    it("renders the title with italicized 'For All.'", () => {
        const { container } = render(<AccelerationForAllPage />);
        const h1 = container.querySelector("h1");
        expect(h1?.textContent).toContain("Acceleration");
        expect(h1?.querySelector("em")?.textContent).toBe("For All.");
    });

    it("renders eyebrow and kicker", () => {
        render(<AccelerationForAllPage />);
        expect(screen.getByText("Campaign · 2021")).toBeInTheDocument();
    });

    it("renders the four meta rows", () => {
        render(<AccelerationForAllPage />);
        expect(screen.getByText("Client")).toBeInTheDocument();
        expect(screen.getByText("Scope")).toBeInTheDocument();
        expect(screen.getByText("Year")).toBeInTheDocument();
        expect(screen.getByText("Reach")).toBeInTheDocument();
        expect(screen.getByText("ViewSonic × Hustle Fund")).toBeInTheDocument();
    });

    it("renders the back-link", () => {
        render(<AccelerationForAllPage />);
        const back = screen.getByRole("link", { name: /All work/ });
        expect(back).toHaveAttribute("href", "../../#work");
    });

    it("renders the campaign film via AutoplayVideo (poster swaps for iframe on viewport entry)", () => {
        const { container } = render(<AccelerationForAllPage />);
        // Before scroll-reveal fires, the AutoplayVideo wrapper renders a YouTube poster image.
        const poster = container.querySelector('img[src*="jUR5gdbGKjE"]');
        expect(poster).not.toBeNull();
        // The wrapper class identifies the autoplay video region.
        expect(container.querySelector(".autoplay-video")).not.toBeNull();
    });

    it("renders the bleed caption", () => {
        render(<AccelerationForAllPage />);
        expect(screen.getByText(/Campaign film · Acceleration For All\./)).toBeInTheDocument();
    });

    it("renders all ten brand palette swatches", () => {
        render(<AccelerationForAllPage />);
        expect(screen.getByText("#FFC200")).toBeInTheDocument();
        expect(screen.getByText("#FD6051")).toBeInTheDocument();
        expect(screen.getByText("#FFFFFF")).toBeInTheDocument();
        expect(screen.getByText("#F0F4F7")).toBeInTheDocument();
        expect(screen.getByText("#1E2782")).toBeInTheDocument();
        expect(screen.getByText("#990000")).toBeInTheDocument();
        expect(screen.getByText("#9636A4")).toBeInTheDocument();
        expect(screen.getByText("#2FB2D6")).toBeInTheDocument();
        expect(screen.getByText("#404555")).toBeInTheDocument();
        expect(screen.getByText("#6F59D8")).toBeInTheDocument();
    });

    it("applies AfA brand vars on the shell wrapper", () => {
        const { container } = render(<AccelerationForAllPage />);
        const wrapper = container.querySelector(".case-study-shell") as HTMLElement;
        expect(wrapper.style.getPropertyValue("--afa-yellow")).toBe("#FFC200");
        expect(wrapper.style.getPropertyValue("--afa-coral")).toBe("#FD6051");
    });

    it("renders the back-to-all-work footer link", () => {
        const { container } = render(<AccelerationForAllPage />);
        const link = container.querySelector(".next-project-section a.next-project");
        expect(link).not.toBeNull();
        expect(link?.getAttribute("href")).toBe("../../#work");
        expect(link?.textContent).toContain("Back to all work");
    });

    it("renders the outcome metrics", () => {
        render(<AccelerationForAllPage />);
        expect(screen.getByText("1,500+")).toBeInTheDocument();
        expect(screen.getByText("5")).toBeInTheDocument();
        expect(screen.getByText("Live")).toBeInTheDocument();
    });

    it("does not produce any href starting with '../index.html' (legacy convention)", () => {
        const { container } = render(<AccelerationForAllPage />);
        const links = Array.from(container.querySelectorAll("a"));
        links.forEach((a) => {
            const href = a.getAttribute("href") ?? "";
            expect(href.startsWith("../index.html")).toBe(false);
        });
    });

    it("uses the new ../../assets path convention for local images", () => {
        const { container } = render(<AccelerationForAllPage />);
        const imgs = Array.from(container.querySelectorAll("img"));
        const local = imgs.filter((img) => {
            const src = img.getAttribute("src") ?? "";
            return src && !src.startsWith("https://");
        });
        expect(local.length).toBeGreaterThan(0);
        local.forEach((img) => {
            const src = img.getAttribute("src") ?? "";
            expect(src.startsWith("../../assets/")).toBe(true);
        });
    });
});
