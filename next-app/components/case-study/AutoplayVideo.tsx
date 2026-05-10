"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Lazy-mounting YouTube iframe. Renders a poster image until the
 * wrapper scrolls within ~200px of the viewport, then swaps in the
 * iframe with autoplay+mute+playsinline so the video starts playing.
 *
 * Page-load weight is just the (small) poster JPG; the YouTube SDK
 * doesn't load until the viewer is about to see the video.
 */
export function AutoplayVideo({
  videoId,
  title,
}: {
  videoId: string;
  title: string;
}) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el || shouldLoad) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setShouldLoad(true);
          obs.disconnect();
        }
      },
      { rootMargin: "200px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [shouldLoad]);

  const iframeSrc = `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&autoplay=1&mute=1&playsinline=1`;
  const posterSrc = `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;

  return (
    <div ref={wrapRef} className="autoplay-video">
      {shouldLoad ? (
        <iframe
          src={iframeSrc}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      ) : (
        <img
          src={posterSrc}
          alt=""
          aria-hidden="true"
          loading="lazy"
        />
      )}
    </div>
  );
}
