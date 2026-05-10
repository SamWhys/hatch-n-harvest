"use client";

import { useRef, type ReactNode } from "react";
import { useScrollReveal } from "./useScrollReveal";

export function FadeInP({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLParagraphElement | null>(null);
  useScrollReveal(ref);
  const cls = ["fade-in-p", className].filter(Boolean).join(" ");
  return (
    <p ref={ref} className={cls}>
      {children}
    </p>
  );
}
