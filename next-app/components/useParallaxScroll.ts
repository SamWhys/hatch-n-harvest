"use client";

import { useEffect } from "react";

interface RegisteredEl {
  el: HTMLElement;
  intensity: number;
  inView: boolean;
}

const registry = new Set<RegisteredEl>();
let rafHandle: number | null = null;
let observer: IntersectionObserver | null = null;

function getObserver(): IntersectionObserver {
  if (observer) return observer;
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        for (const reg of registry) {
          if (reg.el === entry.target) reg.inView = entry.isIntersecting;
        }
      }
    },
    { rootMargin: "20% 0px 20% 0px" }
  );
  return observer;
}

function tick(): void {
  const vCenter = window.innerHeight / 2;
  for (const reg of registry) {
    if (!reg.inView) continue;
    const rect = reg.el.getBoundingClientRect();
    const elCenter = rect.top + rect.height / 2;
    const py = -(elCenter - vCenter) * reg.intensity;
    reg.el.style.setProperty("--scroll-y", `${py.toFixed(2)}px`);
  }
  rafHandle = requestAnimationFrame(tick);
}

function ensureLoop(): void {
  if (rafHandle === null) rafHandle = requestAnimationFrame(tick);
}

function maybeStopLoop(): void {
  if (registry.size === 0 && rafHandle !== null) {
    cancelAnimationFrame(rafHandle);
    rafHandle = null;
  }
}

function isSuppressed(): boolean {
  if (typeof window === "undefined") return true;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return true;
  if (window.matchMedia("(max-width: 1024px), (pointer: coarse)").matches) return true;
  return false;
}

export function useParallaxScroll(
  ref: { current: HTMLElement | null },
  opts: { intensity: number }
): void {
  const { intensity } = opts;
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (isSuppressed()) return;

    const reg: RegisteredEl = { el, intensity, inView: false };
    registry.add(reg);
    getObserver().observe(el);
    ensureLoop();

    return () => {
      observer?.unobserve(el);
      registry.delete(reg);
      el.style.removeProperty("--scroll-y");
      maybeStopLoop();
    };
  }, [ref, intensity]);
}
