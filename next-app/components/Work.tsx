"use client";

import { useEffect, useRef } from "react";
import { useParallaxScroll } from "./useParallaxScroll";
import { RisingHeading } from "./case-study/RisingHeading";
import { FadeInP } from "./case-study/FadeInP";

/** Subtle Ken Burns zoom on each card image: 1.06 → 1.0 as the card
 *  rises into its sticky position. Driven from a scroll handler instead
 *  of CSS view-timeline because the latter freezes for descendants of
 *  sticky elements in Chrome. */
function useKenBurnsStack(stackRef: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = stackRef.current;
    if (!el || typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const cards = Array.from(el.querySelectorAll<HTMLElement>(".case"));
    let raf = 0;

    const STICKY_TOP = 104;
    const FROM = 1.06;
    const TO = 1.0;

    const update = () => {
      raf = 0;
      const vh = window.innerHeight;
      const range = vh - STICKY_TOP;
      for (const card of cards) {
        const img = card.querySelector<HTMLImageElement>("img");
        if (!img) continue;
        const top = card.getBoundingClientRect().top;
        const traveled = vh - top;
        // First half of the entry travel drives the zoom-out.
        const progress = Math.max(0, Math.min(1, (traveled / range) * 2));
        const scale = FROM + (TO - FROM) * progress;
        img.style.setProperty("--ken-burns", scale.toFixed(4));
      }
    };

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [stackRef]);
}

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

function LockIcon() {
  return (
    <svg
      width="14"
      height="16"
      viewBox="0 0 14 18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2" y="8" width="10" height="8" rx="1.5" />
      <path d="M4 8 V5.5 C4 3.5 5.3 2 7 2 C8.7 2 10 3.5 10 5.5 V8" />
    </svg>
  );
}

const lockedCases = [
  {
    label: "Moth & Bloom case study — coming soon",
    img: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1800&q=80",
    alt: "Amber glass bottles of natural skincare on a wooden surface",
    sub: "Identity System · Packaging · 2023",
    name: "Moth & Bloom",
    oneLiner: "A skincare ritual — not a routine. Botanicals, thoughtfully measured, softly packaged.",
  },
  {
    label: "Common Range case study — coming soon",
    img: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=1800&q=80",
    alt: "Illuminated tent under a starry night sky",
    sub: "Brand Campaign · Art Direction · 2023",
    name: "Common Range",
    oneLiner: "Made for the ground you're likely to sleep on — a camping gear campaign for the weekends you earn.",
  },
];

export function Work() {
  const mnemonicRef = useRef<HTMLImageElement>(null);
  const stackRef = useRef<HTMLDivElement>(null);
  useParallaxScroll(mnemonicRef, { intensity: 0.20 });
  useKenBurnsStack(stackRef);
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
            <RisingHeading as="h2">Brands we&apos;ve helped grow.</RisingHeading>
          </div>
          <FadeInP>
            A selection from the past three seasons. Each of these began as a conversation, a napkin sketch, or a founder with more conviction than cash. We&apos;re glad they called.
          </FadeInP>
        </div>
      </div>

      <div className="case-stack" ref={stackRef}>
        <a
          href="work/kestrel-coast.html"
          className="case"
          aria-label="Kestrel Coast — destination rebrand case study"
        >
          <img
              src="https://images.unsplash.com/photo-1505228395891-9a51e7e86bf6?auto=format&fit=crop&w=1800&q=80"
              alt="Misty coastline at dawn, rocky shore with pines"
            loading="lazy"
          />
          <div className="overlay">
            <div className="top-row">
              <div>
                <div className="sub">Destination Identity · Wayfinding · Launch Campaign · 2025</div>
                <h3 className="title">Kestrel Coast</h3>
                <div className="one-liner">A coastline, reintroduced — season by season.</div>
              </div>
              <span className="flag">Featured</span>
            </div>
          </div>
          <span className="read-cta">
            Explore
            <ArrowIcon />
          </span>
        </a>

        <a
          href="work/acceleration-for-all/"
          className="case"
          aria-label="Acceleration For All — ViewSonic × Hustle Fund case study"
        >
          <img
              src="assets/work/acceleration-for-all/kv-card.jpg"
              alt="Acceleration For All key visual — a colourful grid of 30 founders' faces around the campaign lockup."
            loading="lazy"
          />
          <div className="overlay">
            <div className="top-row">
              <div>
                <div className="sub">Campaign · Identity · Film · 2021</div>
                <h3 className="title">Acceleration For All</h3>
                <div className="one-liner">Rebuilding the on-ramp to entrepreneurship — for everyone the old playbook left out.</div>
              </div>
            </div>
          </div>
          <span className="read-cta">
            Explore
            <ArrowIcon />
          </span>
        </a>

        <a
          href="work/united-by-play/"
          className="case"
          aria-label="United by Play — ViewSonic global gaming campaign case study"
        >
          <img
              src="assets/work/united-by-play/title-no-matter-how-you-game.jpg"
              alt="United by Play campaign title card — 'No matter how you game' on a colourful gaming background."
            loading="lazy"
          />
          <div className="overlay">
            <div className="top-row">
              <div>
                <div className="sub">Campaign · Manifesto · Docuseries · 2021</div>
                <h3 className="title">United by Play</h3>
                <div className="one-liner">No matter how you game, we are united by play.</div>
              </div>
            </div>
          </div>
          <span className="read-cta">
            Explore
            <ArrowIcon />
          </span>
        </a>

        <a
          href="work/meet-the-finchers/"
          className="case"
          aria-label="Meet the Finchers — ViewSonic branded entertainment campaign case study"
        >
          <img
              src="assets/work/meet-the-finchers/finchers-lockup-1.jpg"
              alt="Meet the Finchers — campaign logo lockup."
            loading="lazy"
          />
          <div className="overlay">
            <div className="top-row">
              <div>
                <div className="sub">Campaign · Identity · Documentaries · Social · 2022</div>
                <h3 className="title">Meet the Finchers</h3>
                <div className="one-liner">A binge-worthy 90s sitcom — produced entirely on the brand&apos;s own remote-collaboration tech.</div>
              </div>
            </div>
          </div>
          <span className="read-cta">
            Explore
            <ArrowIcon />
          </span>
        </a>

        {lockedCases.map((c) => (
          <div className="case is-locked" role="article" aria-label={c.label} key={c.name}>
            <img src={c.img} alt={c.alt} loading="lazy" />
            <div className="overlay">
              <div className="top-row">
                <div>
                  <div className="sub">{c.sub}</div>
                  <h3 className="title">{c.name}</h3>
                  <div className="one-liner">{c.oneLiner}</div>
                </div>
              </div>
            </div>
            <span className="case-locked-cta" aria-disabled="true">
              <LockIcon />
              Coming soon
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
