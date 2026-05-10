import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import UnitedByPlayPage from "@/app/work/united-by-play/page";

describe("United by Play page", () => {
    it("renders the shell", () => {
        render(<UnitedByPlayPage />);
        expect(screen.getByRole("banner")).toBeInTheDocument();
        expect(screen.getByRole("main")).toBeInTheDocument();
        expect(screen.getByRole("contentinfo")).toBeInTheDocument();
    });

    it("renders the title with italicized 'by Play.'", () => {
        const { container } = render(<UnitedByPlayPage />);
        const h1 = container.querySelector("h1");
        expect(h1?.textContent).toContain("United");
        expect(h1?.querySelector("em")?.textContent).toBe("by Play.");
    });

    it("renders eyebrow and meta rows", () => {
        render(<UnitedByPlayPage />);
        // "Campaign · 2021" appears in both the eyebrow and the bleed caption
        const campaignTexts = screen.getAllByText("Campaign · 2021");
        expect(campaignTexts.length).toBeGreaterThanOrEqual(1);
        expect(screen.getByText("Client")).toBeInTheDocument();
        expect(screen.getByText("ViewSonic")).toBeInTheDocument();
        expect(screen.getByText("Scope")).toBeInTheDocument();
        expect(screen.getByText("Year")).toBeInTheDocument();
        expect(screen.getByText("2021")).toBeInTheDocument();
        expect(screen.getByText("Reach")).toBeInTheDocument();
    });

    it("renders the back-link", () => {
        render(<UnitedByPlayPage />);
        const back = screen.getByRole("link", { name: /All work/ });
        expect(back).toHaveAttribute("href", "../../#work");
    });

    it("renders the hero film iframe", () => {
        const { container } = render(<UnitedByPlayPage />);
        const iframe = container.querySelector('iframe[src*="Vd_Tt1iSO90"]');
        expect(iframe).not.toBeNull();
    });

    it("renders the bleed caption", () => {
        render(<UnitedByPlayPage />);
        expect(screen.getByText(/Hero film · United by Play\./)).toBeInTheDocument();
    });

    it("renders the back-to-all-work footer link", () => {
        const { container } = render(<UnitedByPlayPage />);
        const link = container.querySelector(".next-project-section a.next-project");
        expect(link).not.toBeNull();
        expect(link?.getAttribute("href")).toBe("../../#work");
        expect(link?.textContent).toContain("Back to all work");
    });

    it("does not produce any href starting with '../index.html' (legacy convention)", () => {
        const { container } = render(<UnitedByPlayPage />);
        const links = Array.from(container.querySelectorAll("a"));
        links.forEach((a) => {
            const href = a.getAttribute("href") ?? "";
            expect(href.startsWith("../index.html")).toBe(false);
        });
    });

    it("uses the ../../assets path convention for local images", () => {
        const { container } = render(<UnitedByPlayPage />);
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

    it("renders the docuseries deck with three episodes", () => {
        const { container } = render(<UnitedByPlayPage />);
        expect(container.querySelector(".docuseries-deck")).not.toBeNull();
        const cards = container.querySelectorAll(".docuseries-deck .dd-card");
        expect(cards.length).toBe(3);
        const html = container.innerHTML;
        expect(html).toContain("tRE3Mq6w5fo");
        expect(html).toContain("Dwo2JJKZviI");
        expect(html).toContain("pGKBf9kV6mY");
    });

    it("renders the three docuseries episode titles via episode controls", () => {
        const { container } = render(<UnitedByPlayPage />);
        // The active episode title is shown
        expect(screen.getByText("Tech Rehearsal")).toBeInTheDocument();
        // All three titles are accessible via the episode buttons' aria-labels
        const buttons = container.querySelectorAll(".dd-dot");
        expect(buttons.length).toBe(3);
        const ariaLabels = Array.from(buttons).map((btn) => btn.getAttribute("aria-label"));
        expect(ariaLabels).toContain("Episode 1: Tech Rehearsal");
        expect(ariaLabels).toContain("Episode 2: The Forge");
        expect(ariaLabels).toContain("Episode 3: The Gallery");
    });

    it("renders the problem stat with >60% figure", () => {
        const { container } = render(<UnitedByPlayPage />);
        const stat = container.querySelector(".ubp-stat-num");
        expect(stat).not.toBeNull();
        expect(stat?.textContent).toContain("60%");
    });

    it("renders the result board image (results-overview.jpg)", () => {
        const { container } = render(<UnitedByPlayPage />);
        const board = container.querySelector(".ubp-result-board img");
        expect(board).not.toBeNull();
        expect(board?.getAttribute("src")).toContain("results-overview.jpg");
    });

    it("renders the asset grid hero shot", () => {
        const { container } = render(<UnitedByPlayPage />);
        const heroShot = container.querySelector(".ubp-hero-shot img");
        expect(heroShot).not.toBeNull();
        expect(heroShot?.getAttribute("src")).toContain("gaming-hero-shot.jpg");
    });

    it("renders the award video element", () => {
        const { container } = render(<UnitedByPlayPage />);
        const video = container.querySelector(".ubp-award video");
        expect(video).not.toBeNull();
        expect(video?.getAttribute("src")).toContain("award-logo.mp4");
    });

    it("renders the Battle For Charity section heading", () => {
        render(<UnitedByPlayPage />);
        expect(screen.getByText("The Battle For Charity")).toBeInTheDocument();
    });

    it("renders the ViewSonic client value", () => {
        render(<UnitedByPlayPage />);
        expect(screen.getByText("ViewSonic")).toBeInTheDocument();
    });

    it("wraps the asset grid in a reveal target with --reveal-index per cell", () => {
        const { container } = render(<UnitedByPlayPage />);
        const wrap = container.querySelector(".ubp-reveal-target");
        expect(wrap).not.toBeNull();
        const cells = wrap?.querySelectorAll(".ubp-cell") ?? [];
        expect(cells.length).toBe(11);
        cells.forEach((cell) => {
            const style = (cell as HTMLElement).style;
            expect(style.getPropertyValue("--reveal-index")).not.toBe("");
        });
        // Award video should be at index 3 per design order.
        const award = wrap?.querySelector(".ubp-award") as HTMLElement | null;
        expect(award?.style.getPropertyValue("--reveal-index")).toBe("3");
        // Hero shot at index 0.
        const hero = wrap?.querySelector(".ubp-hero-shot") as HTMLElement | null;
        expect(hero?.style.getPropertyValue("--reveal-index")).toBe("0");
        // Title card at index 10 (last).
        const title = wrap?.querySelector(".ubp-title") as HTMLElement | null;
        expect(title?.style.getPropertyValue("--reveal-index")).toBe("10");
    });
});
