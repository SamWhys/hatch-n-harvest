"use client";

import { useRef, useState, useCallback } from "react";
import { useScrollReveal } from "./useScrollReveal";

export type DocuseriesEpisode = {
  title: string;
  thumbnail: string;
  alt: string;
  href: string;
};

function videoIdFromHref(href: string): string | null {
  try {
    const url = new URL(href);
    return url.searchParams.get("v");
  } catch {
    return null;
  }
}

export function DocuseriesFilmstrip({ episodes }: { episodes: DocuseriesEpisode[] }) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const trackRef = useRef<HTMLUListElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  // href of the currently-playing episode (null = none). We swap thumb for
  // iframe in-place, and clear this whenever the carousel advances so a video
  // never keeps playing off-screen.
  const [playingHref, setPlayingHref] = useState<string | null>(null);
  useScrollReveal(sectionRef);
  const len = episodes.length;

  const scrollToIndex = useCallback((i: number) => {
    const track = trackRef.current;
    if (!track) return;
    const target = ((i % len) + len) % len;
    track.scrollTo({ left: track.clientWidth * target, behavior: "smooth" });
    setActiveIndex(target);
    setPlayingHref(null);
  }, [len]);

  const advance = useCallback((delta: number) => {
    scrollToIndex(activeIndex + delta);
  }, [activeIndex, scrollToIndex]);

  const handleScroll = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const w = track.clientWidth;
    if (w === 0) return;
    const idx = Math.round(track.scrollLeft / w);
    setActiveIndex((cur) => (cur === idx ? cur : idx));
  }, []);

  return (
    <section
      ref={sectionRef}
      className="docuseries-filmstrip"
      aria-roledescription="carousel"
      aria-label="Docuseries episodes"
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") {
          e.preventDefault();
          advance(1);
        } else if (e.key === "ArrowLeft") {
          e.preventDefault();
          advance(-1);
        }
      }}
    >
      <button
        type="button"
        className="dfs-prev"
        aria-label="Previous episode"
        onClick={() => advance(-1)}
        disabled={activeIndex === 0}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M15 6l-6 6 6 6" />
        </svg>
      </button>

      <ul ref={trackRef} className="dfs-track" role="list" aria-live="polite" onScroll={handleScroll}>
        {episodes.map((ep, i) => {
          const isPlaying = playingHref === ep.href;
          const videoId = videoIdFromHref(ep.href);
          return (
            <li key={ep.title} className="dfs-item" aria-hidden={i !== activeIndex}>
              {isPlaying && videoId ? (
                <div className="dfs-card is-playing">
                  <div className="dfs-thumb">
                    <iframe
                      src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
                      title={ep.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                      referrerPolicy="strict-origin-when-cross-origin"
                      allowFullScreen
                    />
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  className="dfs-card"
                  onClick={() => setPlayingHref(ep.href)}
                  tabIndex={i === activeIndex ? 0 : -1}
                  aria-label={`Play ${ep.title}`}
                >
                  <div className="dfs-thumb">
                    <img src={ep.thumbnail} alt={ep.alt} loading="lazy" />
                    <span className="dfs-play" aria-hidden="true">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </span>
                  </div>
                </button>
              )}
            </li>
          );
        })}
      </ul>

      <button
        type="button"
        className="dfs-next"
        aria-label="Next episode"
        onClick={() => advance(1)}
        disabled={activeIndex === len - 1}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M9 6l6 6-6 6" />
        </svg>
      </button>

      <div className="dfs-controls">
        <h3 className="dfs-title">{episodes[activeIndex].title}</h3>
        <ol className="dfs-dots" aria-label="Episode position">
          {episodes.map((ep, i) => (
            <li key={ep.title}>
              <button
                type="button"
                className={`dfs-dot${i === activeIndex ? " is-active" : ""}`}
                aria-label={`Episode ${i + 1}: ${ep.title}`}
                aria-current={i === activeIndex ? "true" : undefined}
                onClick={() => scrollToIndex(i)}
              />
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
