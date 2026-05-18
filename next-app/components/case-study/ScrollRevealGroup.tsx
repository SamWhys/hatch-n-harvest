"use client";

import { useRef, type ReactNode } from "react";
import { useScrollReveal } from "./useScrollReveal";

export function ScrollRevealGroup({
    children,
    className,
}: {
    children: ReactNode;
    className?: string;
}) {
    const ref = useRef<HTMLDivElement | null>(null);
    useScrollReveal(ref);
    return (
        <div ref={ref} className={`scroll-reveal-group${className ? ` ${className}` : ""}`}>
            {children}
        </div>
    );
}
