import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import MeetTheFinchersPage from "@/app/work/meet-the-finchers/page";

describe("Meet the Finchers page", () => {
    it("renders the shell", () => {
        render(<MeetTheFinchersPage />);
        expect(screen.getByRole("banner")).toBeInTheDocument();
        expect(screen.getByRole("main")).toBeInTheDocument();
        expect(screen.getByRole("contentinfo")).toBeInTheDocument();
    });

    it("renders the title with italicized 'Finchers.'", () => {
        const { container } = render(<MeetTheFinchersPage />);
        const h1 = container.querySelector("h1");
        expect(h1?.textContent).toContain("Meet the");
        expect(h1?.querySelector("em")?.textContent).toBe("Finchers.");
    });

    it("renders eyebrow and meta rows", () => {
        render(<MeetTheFinchersPage />);
        const campaignTexts = screen.getAllByText("Campaign · 2022");
        expect(campaignTexts.length).toBeGreaterThanOrEqual(1);
        expect(screen.getByText("Client")).toBeInTheDocument();
        expect(screen.getByText("ViewSonic")).toBeInTheDocument();
        expect(screen.getByText("Scope")).toBeInTheDocument();
        expect(screen.getByText("Year")).toBeInTheDocument();
        expect(screen.getByText("2022")).toBeInTheDocument();
        expect(screen.getByText("Reach")).toBeInTheDocument();
    });

    it("renders the back-link to /#work", () => {
        render(<MeetTheFinchersPage />);
        const back = screen.getByRole("link", { name: /All work/ });
        expect(back.getAttribute("href")).toBe("../../#work");
    });

    it("renders the section headings (Problem, Solution, Show, Result)", () => {
        const { container } = render(<MeetTheFinchersPage />);
        // RisingHeading splits text into per-word spans, so read the h2 text via textContent
        const headings = Array.from(container.querySelectorAll("h2")).map((h) => h.textContent?.trim());
        expect(headings).toContain("The Problem");
        expect(headings).toContain("The Solution");
        expect(headings).toContain("The Show");
        expect(headings).toContain("The Result");
    });

    it("renders the asset grid cells (BTS video, Jakob banner, GIF, lockup, karate, LinkedIn)", () => {
        const { container } = render(<MeetTheFinchersPage />);
        expect(container.querySelector(".mtf-bts video")).not.toBeNull();
        expect(container.querySelector(".mtf-jakob img")).not.toBeNull();
        expect(container.querySelector(".mtf-gif img")).not.toBeNull();
        expect(container.querySelector(".mtf-lockup img")).not.toBeNull();
        expect(container.querySelector(".mtf-karate video")).not.toBeNull();
        expect(container.querySelector(".mtf-linkedin img")).not.toBeNull();
    });

    it("renders the three episode cards with YouTube hrefs", () => {
        const { container } = render(<MeetTheFinchersPage />);
        const cards = container.querySelectorAll(".mtf-show-card");
        expect(cards.length).toBe(3);
        const html = container.innerHTML;
        expect(html).toContain("j_Wo8Sq7EV8");
        expect(html).toContain("vGtXSKQktfo");
        expect(html).toContain("ZbJtBAj9akQ");
    });

    it("renders the hero film and behind-the-scenes YouTube embeds", () => {
        const { container } = render(<MeetTheFinchersPage />);
        const html = container.innerHTML;
        // Hero film
        expect(html).toContain("6Esh9_wiBCw");
        // Behind the scenes
        expect(html).toContain("hQQsNDttplk");
    });

    it("renders the next-project outro link to /#work", () => {
        const { container } = render(<MeetTheFinchersPage />);
        const np = container.querySelector(".next-project");
        expect(np).not.toBeNull();
        expect(np?.getAttribute("href")).toBe("../../#work");
    });
});
