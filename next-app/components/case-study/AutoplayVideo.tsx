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
  start,
}: {
  videoId: string;
  title: string;
  start?: number;
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
      // Larger rootMargin so the iframe mounts well before the user
      // scrolls to it — by the time the video is on screen, the player
      // is usually ready to play.
      { rootMargin: "800px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [shouldLoad]);

  // youtube-nocookie.com is slightly leaner on first paint (skips
  // some cookie/session setup) and the preconnect hint lives in
  // app/layout.tsx pointing at the same origin.
  const iframeSrc = `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1&autoplay=1&mute=1&playsinline=1${start ? `&start=${start}` : ""}`;
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
