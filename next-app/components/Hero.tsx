import type { CSSProperties } from "react";

const word = (i: number): CSSProperties => ({ "--i": i } as CSSProperties);

export function Hero() {
  return (
    <section className="hero">
      <div className="wrap">
        <div className="eyebrow">Who we are</div>

        <h1>
          <span className="line">
            <span className="word" style={word(0)}>We</span>{" "}
            <span className="word" style={word(1)}>hatch</span>{" "}
            <span className="word" style={word(2)}>and</span>{" "}
            <span className="word" style={word(3)}>harvest</span>{" "}
            <em className="word" style={word(4)}>big ideas.</em>
          </span>
        </h1>

        <div className="hero-meta">
          <p className="hero-lead">
            Big ideas rooted in sound strategy and real-world experience. Because people don&apos;t buy marketing strategies — they buy connection, belonging, and meaning.
          </p>
          <div className="hero-ctas">
            <a href="#work" className="btn btn-primary">
              See the work
              <svg
                width="14"
                height="14"
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
            </a>
            <a href="#contact" className="btn btn-ghost">Start a project</a>
          </div>
        </div>

        <div className="hero-atmos" aria-hidden="true">
          <div className="atmos-rotor">
            <div className="blob blob-marigold"></div>
            <div className="blob blob-clay"></div>
            <div className="blob blob-forest"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
