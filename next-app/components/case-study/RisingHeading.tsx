"use client";

import { useRef, type ReactNode } from "react";
import { useScrollReveal } from "./useScrollReveal";

type HeadingTag = "h1" | "h2" | "h3";

export function RisingHeading({
  as = "h2",
  className,
  children,
}: {
  as?: HeadingTag;
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLHeadingElement | null>(null);
  useScrollReveal(ref);
  const Tag = as;
  const cls = ["rising-heading", className].filter(Boolean).join(" ");
  return (
    <Tag ref={ref} className={cls}>
      <span className="line">{children}</span>
    </Tag>
  );
}
