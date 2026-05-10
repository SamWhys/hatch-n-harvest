"use client";

import { useEffect, type RefObject } from "react";

export function useScrollReveal(
  ref: RefObject<HTMLElement | null>,
  options?: { threshold?: number; rootMargin?: string }
): void {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            el.classList.add("is-revealed");
            observer.disconnect();
            break;
          }
        }
      },
      {
        threshold: options?.threshold ?? 0.05,
        rootMargin: options?.rootMargin ?? "0px 0px -10% 0px",
      }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, options?.threshold, options?.rootMargin]);
}
