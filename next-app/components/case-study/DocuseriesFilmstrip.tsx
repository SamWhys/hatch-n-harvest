"use client";

import { useRef } from "react";
import { useScrollReveal } from "./useScrollReveal";

export type DocuseriesEpisode = {
  title: string;
  thumbnail: string;
  alt: string;
  href: string;
};

export function DocuseriesFilmstrip({ episodes }: { episodes: DocuseriesEpisode[] }) {
  const sectionRef = useRef<HTMLElement | null>(null);
  useScrollReveal(sectionRef);

  return (
    <section
      ref={sectionRef}
      className="docuseries-filmstrip"
      aria-label="Docuseries episodes"
    >
      <ul className="dfs-track" role="list">
        {episodes.map((ep) => (
          <li key={ep.title} className="dfs-item">
            <a
              className="dfs-card"
              href={ep.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="dfs-thumb">
                <img src={ep.thumbnail} alt={ep.alt} loading="lazy" />
                <span className="dfs-play" aria-hidden="true">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </span>
              </div>
              <h3 className="dfs-title">{ep.title}</h3>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
