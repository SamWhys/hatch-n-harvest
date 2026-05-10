"use client";

import { useState, useCallback, useRef, type PointerEvent as ReactPointerEvent } from "react";
import { useScrollReveal } from "./useScrollReveal";

export type DocuseriesEpisode = {
  title: string;
  thumbnail: string;
  alt: string;
  href: string;
};

const DRAG_ADVANCE_RATIO = 0.25;
const CLICK_SUPPRESSION_PX = 6;

export function DocuseriesDeck({ episodes }: { episodes: DocuseriesEpisode[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [dragOffsetPx, setDragOffsetPx] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const stageRef = useRef<HTMLDivElement | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);
  useScrollReveal(sectionRef);
  const startXRef = useRef(0);
  const startYRef = useRef(0);
  const pointerMovedRef = useRef(false);
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

  const handlePointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    // Only handle primary pointer (left mouse, single touch, pen).
    if (e.button !== 0 && e.pointerType === "mouse") return;
    startXRef.current = e.clientX;
    startYRef.current = e.clientY;
    pointerMovedRef.current = false;
    setIsDragging(true);
    setDragOffsetPx(0);
    (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const dx = e.clientX - startXRef.current;
    const dy = e.clientY - startYRef.current;
    if (Math.abs(dx) > CLICK_SUPPRESSION_PX || Math.abs(dy) > CLICK_SUPPRESSION_PX) {
      pointerMovedRef.current = true;
    }
    setDragOffsetPx(dx);
  };

  const handlePointerUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const stage = stageRef.current;
    const cardWidth = stage ? stage.getBoundingClientRect().width : 0;
    const threshold = cardWidth * DRAG_ADVANCE_RATIO;
    const dx = dragOffsetPx;
    setIsDragging(false);
    setDragOffsetPx(0);
    (e.currentTarget as HTMLDivElement).releasePointerCapture(e.pointerId);
    if (dx <= -threshold) {
      advance(1);
    } else if (dx >= threshold) {
      advance(-1);
    }
    // else: rubber-band back to 0 (already done by setDragOffsetPx(0))
  };

  const handleActiveCardClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (pointerMovedRef.current) {
      e.preventDefault();
    }
  };

  const prevIdx = (activeIndex - 1 + len) % len;
  const nextIdx = (activeIndex + 1) % len;
  const active = episodes[activeIndex];
  const prev = episodes[prevIdx];
  const next = episodes[nextIdx];

  const dragStyle = isDragging
    ? { transform: `translateX(${dragOffsetPx}px)` }
    : undefined;
  const activeDragStyle = isDragging
    ? { transform: `translateX(calc(-50% + ${dragOffsetPx}px))` }
    : undefined;

  return (
    <section
      ref={sectionRef}
      className="docuseries-deck"
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
        className="dd-prev"
        aria-label="Previous episode"
        onClick={() => advance(-1)}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M15 6l-6 6 6 6" />
        </svg>
      </button>

      <div
        ref={stageRef}
        className="dd-stage"
        role="group"
        aria-live="polite"
        data-state={isDragging ? "dragging" : "idle"}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <a
          className="dd-card dd-card-prev"
          href={prev.href}
          aria-hidden="true"
          tabIndex={-1}
          style={dragStyle}
          onClick={(e) => { e.preventDefault(); if (!pointerMovedRef.current) advance(-1); }}
        >
          <img src={prev.thumbnail} alt="" loading="lazy" />
        </a>
        <a
          className="dd-card dd-card-active"
          href={active.href}
          target="_blank"
          rel="noopener noreferrer"
          style={activeDragStyle}
          onClick={handleActiveCardClick}
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
          style={dragStyle}
          onClick={(e) => { e.preventDefault(); if (!pointerMovedRef.current) advance(1); }}
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
