"use client";

import { useRef, type ReactNode } from "react";
import { useScrollReveal } from "./useScrollReveal";

export function UbpAssetReveal({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement | null>(null);
  useScrollReveal(ref);
  return (
    <div ref={ref} className="ubp-asset-wrap ubp-reveal-target">
      {children}
    </div>
  );
}
