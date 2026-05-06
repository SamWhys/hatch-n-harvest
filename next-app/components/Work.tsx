function ArrowIcon({ size = 14 }: { size?: number }) {
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
      width="12"
      height="14"
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
    href: null,
    label: "Small Acre case study — coming soon",
    img: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80",
    alt: "Wooden crate of fresh vegetables from a farm",
    category: "Naming · Brand Strategy",
    year: "2024",
    name: "Small Acre",
    oneLiner: "Farm-share, rethought for the city — a subscription built around seasons, not scrolls.",
  },
  {
    href: null,
    label: "Moth & Bloom case study — coming soon",
    img: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1200&q=80",
    alt: "Amber glass bottles of natural skincare on a wooden surface",
    category: "Identity System · Packaging",
    year: "2023",
    name: "Moth & Bloom",
    oneLiner: "A skincare ritual — not a routine. Botanicals, thoughtfully measured, softly packaged.",
  },
  {
    href: null,
    label: "Common Range case study — coming soon",
    img: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=1200&q=80",
    alt: "Illuminated tent under a starry night sky",
    category: "Brand Campaign · Art Direction",
    year: "2023",
    name: "Common Range",
    oneLiner: "Made for the ground you're likely to sleep on — a camping gear campaign for the weekends you earn.",
  },
];

export function Work() {
  return (
    <section className="work" id="work">
      <div className="wrap">
        <div className="work-head">
          <div>
            <div className="eyebrow">Recent harvests</div>
            <h2>Brands we&apos;ve helped grow.</h2>
          </div>
          <p>
            A selection from the past three seasons. Each of these began as a conversation, a napkin sketch, or a founder with more conviction than cash. We&apos;re glad they called.
          </p>
        </div>

        <div className="case-grid">
          <a
            href="work/kestrel-coast.html"
            className="case featured"
            aria-label="Kestrel Coast — destination rebrand case study"
          >
            <div className="case-image">
              <img
                src="https://images.unsplash.com/photo-1505228395891-9a51e7e86bf6?auto=format&fit=crop&w=1800&q=80"
                alt="Misty coastline at dawn, rocky shore with pines"
                loading="lazy"
              />
              <div className="featured-overlay">
                <div className="featured-top">
                  <span className="featured-flag">Featured harvest</span>
                  <span className="featured-cta">
                    Read now
                    <ArrowIcon />
                  </span>
                </div>
                <div>
                  <h3 className="featured-title">Kestrel Coast</h3>
                  <div className="featured-meta">
                    <div className="featured-sub">
                      Destination Identity · Wayfinding · Launch Campaign · 2025
                    </div>
                    <div className="featured-one-liner">
                      A coastline, reintroduced — season by season.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </a>

          <a
            href="work/acceleration-for-all.html"
            className="case"
            aria-label="Acceleration For All — ViewSonic × Hustle Fund case study"
          >
            <div className="case-image">
              <img
                src="assets/work/acceleration-for-all/kv-card.jpg"
                alt="Acceleration For All key visual — a colourful grid of 30 founders' faces around the campaign lockup."
                loading="lazy"
              />
            </div>
            <div className="case-meta">
              <div className="case-label">
                <span>Campaign · Identity · Film</span>
                <span className="year">2021</span>
              </div>
              <div className="case-name">Acceleration For All</div>
              <p className="case-one-liner">
                A partnership campaign for ViewSonic × Hustle Fund — rebuilding the on-ramp to entrepreneurship for everyone the old playbook left out.
              </p>
              <span className="case-read-cta">
                Read case study
                <ArrowIcon size={11} />
              </span>
            </div>
          </a>

          {lockedCases.map((c) => (
            <div className="case is-locked" role="article" aria-label={c.label} key={c.name}>
              <div className="case-image">
                <img src={c.img} alt={c.alt} loading="lazy" />
              </div>
              <div className="case-meta">
                <div className="case-label">
                  <span>{c.category}</span>
                  <span className="year">{c.year}</span>
                </div>
                <div className="case-name">{c.name}</div>
                <p className="case-one-liner">{c.oneLiner}</p>
                <span className="case-locked-cta" aria-disabled="true">
                  <LockIcon />
                  Locked
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
