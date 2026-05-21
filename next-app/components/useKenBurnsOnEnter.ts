"use client";

import { useEffect } from "react";

/** Adds and re-arms an `.is-ken-burns` class on every `.case-vertical`
 *  descendant of `rootRef` when it enters the viewport.
 *
 *  The class triggers a CSS `@keyframes` animation on the underlying `<img>`.
 *  To restart the animation on re-entry, we remove the class, force a
 *  reflow (`void el.offsetWidth`), then re-add it — the classic "restart
 *  CSS animation" trick.
 *
 *  Honours `prefers-reduced-motion: reduce` by bailing out entirely.
 */
export function useKenBurnsOnEnter(
  rootRef: React.RefObject<HTMLElement | null>
) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root || typeof window === "undefined") return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    const cards = root.querySelectorAll<HTMLElement>(".case-vertical");
    if (cards.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;
          el.classList.remove("is-ken-burns");
          // Force reflow so the next add() re-triggers the CSS animation.
          void el.offsetWidth;
          el.classList.add("is-ken-burns");
        }
      },
      { threshold: 0.5 }
    );

    for (const card of Array.from(cards)) observer.observe(card);

    return () => observer.disconnect();
  }, [rootRef]);
}
