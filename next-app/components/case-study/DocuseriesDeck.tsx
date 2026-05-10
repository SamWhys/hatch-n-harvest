"use client";

import { useState, useCallback } from "react";

export type DocuseriesEpisode = {
  title: string;
  thumbnail: string;
  alt: string;
  href: string;
};

export function DocuseriesDeck({ episodes }: { episodes: DocuseriesEpisode[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const len = episodes.length;

  const advance = useCallback(
    (delta: number) => {
      setActiveIndex((i) => (i + delta + len) % len);
    },
    [len]
  );

  const goToIndex = useCallback(
    (i: number) => {
      setActiveIndex(((i % len) + len) % len);
    },
    [len]
  );

  const prevIdx = (activeIndex - 1 + len) % len;
  const nextIdx = (activeIndex + 1) % len;
  const active = episodes[activeIndex];
  const prev = episodes[prevIdx];
  const next = episodes[nextIdx];

  return (
    <section
      className="docuseries-deck"
      aria-roledescription="carousel"
      aria-label="Docuseries episodes"
    >
      <button
        type="button"
        className="dd-prev"
        aria-label="Previous episode"
        onClick={() => advance(-1)}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M15 6l-6 6 6 6" />
        </svg>
      </button>

      <div className="dd-stage" role="group" aria-live="polite">
        <a
          className="dd-card dd-card-prev"
          href={prev.href}
          aria-hidden="true"
          tabIndex={-1}
          onClick={(e) => { e.preventDefault(); advance(-1); }}
        >
          <img src={prev.thumbnail} alt="" loading="lazy" />
        </a>
        <a
          className="dd-card dd-card-active"
          href={active.href}
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={active.thumbnail} alt={active.alt} loading="lazy" />
          <span className="dd-play" aria-hidden="true">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
          </span>
        </a>
        <a
          className="dd-card dd-card-next"
          href={next.href}
          aria-hidden="true"
          tabIndex={-1}
          onClick={(e) => { e.preventDefault(); advance(1); }}
        >
          <img src={next.thumbnail} alt="" loading="lazy" />
        </a>
      </div>

      <button
        type="button"
        className="dd-next"
        aria-label="Next episode"
        onClick={() => advance(1)}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M9 6l6 6-6 6" />
        </svg>
      </button>

      <div className="dd-controls">
        <h3 className="dd-title">{active.title}</h3>
        <ol className="dd-dots" aria-label="Episode position">
          {episodes.map((ep, i) => (
            <li key={ep.title}>
              <button
                type="button"
                className={`dd-dot${i === activeIndex ? " is-active" : ""}`}
                aria-label={`Episode ${i + 1}: ${ep.title}`}
                aria-current={i === activeIndex ? "true" : undefined}
                onClick={() => goToIndex(i)}
              />
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
