"use client";

import { useRef } from "react";
import { useParallaxScroll } from "./useParallaxScroll";
import { useKenBurnsOnEnter } from "./useKenBurnsOnEnter";
import { RisingHeading } from "./case-study/RisingHeading";

function ArrowIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14M13 5l7 7-7 7" />
    </svg>
  );
}

type Case = {
  href: string;
  ariaLabel: string;
  img: string;
  alt: string;
  sub: string;
  title: string;
  oneLiner: string;
  featured?: boolean;
};

const CASES: Case[] = [
  {
    href: "work/colorpro-awards/",
    ariaLabel:
      "ColorPro Awards — ViewSonic global creator platform case study",
    img: "assets/work/colorpro-awards/kv-card.jpg",
    alt: "ColorPro Awards key visual — the 2025 FLOW campaign artwork.",
    sub: "Campaign · Identity · Live Events · Microsite · 2022–2026",
    title: "ColorPro Awards",
    oneLiner:
      "A global creative platform that turned ViewSonic's professional displays into the world's pro-creator stage.",
    featured: true,
  },
  {
    href: "work/acceleration-for-all/",
    ariaLabel: "Acceleration For All — ViewSonic × Hustle Fund case study",
    img: "assets/work/acceleration-for-all/kv-card.jpg",
    alt: "Acceleration For All key visual — a colourful grid of 30 founders' faces around the campaign lockup.",
    sub: "Campaign · Identity · Film · 2021",
    title: "Acceleration For All",
    oneLiner:
      "Rebuilding the on-ramp to entrepreneurship — for everyone the old playbook left out.",
  },
  {
    href: "work/united-by-play/",
    ariaLabel: "United by Play — ViewSonic global gaming campaign case study",
    img: "assets/work/united-by-play/title-no-matter-how-you-game.jpg",
    alt: "United by Play campaign title card — 'No matter how you game' on a colourful gaming background.",
    sub: "Campaign · Manifesto · Docuseries · 2021",
    title: "United by Play",
    oneLiner: "No matter how you game, we are united by play.",
  },
  {
    href: "work/meet-the-finchers/",
    ariaLabel:
      "Meet the Finchers — ViewSonic branded entertainment campaign case study",
    img: "assets/work/meet-the-finchers/finchers-lockup-1.jpg",
    alt: "Meet the Finchers — campaign logo lockup.",
    sub: "Campaign · Identity · Documentaries · Social · 2022",
    title: "Meet the Finchers",
    oneLiner:
      "A binge-worthy 90s sitcom — produced entirely on the brand's own remote-collaboration tech.",
  },
];

export function Work() {
  const mnemonicRef = useRef<HTMLImageElement>(null);
  const deckRef = useRef<HTMLDivElement>(null);
  useParallaxScroll(mnemonicRef, { intensity: 0.2 });
  useKenBurnsOnEnter(deckRef);

  return (
    <section className="work" id="work">
      <img
        ref={mnemonicRef}
        className="work-mnemonic parallax-mnemonic"
        src="assets/brand/mnemonic-4.svg"
        alt=""
        aria-hidden="true"
      />
      <div className="wrap">
        <div className="work-head">
          <div>
            <RisingHeading as="h2">
              Brands we&apos;ve helped grow.
            </RisingHeading>
          </div>
        </div>
      </div>

      <div className="case-stack-vertical" ref={deckRef}>
        {CASES.map((c) => (
          <a
            key={c.href}
            href={c.href}
            className="case-vertical"
            aria-label={c.ariaLabel}
          >
            <img
              className="case-vertical__bg"
              src={c.img}
              alt={c.alt}
              loading="lazy"
            />
            {c.featured && (
              <span className="case-vertical__flag">Featured</span>
            )}
            <div className="case-vertical__content">
              <div className="case-vertical__sub">{c.sub}</div>
              <h3 className="case-vertical__title">{c.title}</h3>
              <p className="case-vertical__one-liner">{c.oneLiner}</p>
              <span className="case-vertical__cta">
                Explore
                <ArrowIcon />
              </span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
