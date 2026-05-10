"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

const PEOPLE_COUNT = 10;
const FILLED_COUNT = 6;
const STAGGER_MS = 200;

function CountUp({
  to,
  duration,
  start,
}: {
  to: number;
  duration: number;
  start: boolean;
}) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) return;
    const t0 = performance.now();
    let frame: number;
    function tick(now: number) {
      const elapsed = now - t0;
      const t = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - t, 2);
      setValue(Math.round(eased * to));
      if (t < 1) {
        frame = requestAnimationFrame(tick);
      }
    }
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [start, to, duration]);
  return <>{value}</>;
}

function PersonIcon() {
  return (
    <svg
      viewBox="0 0 24 32"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="12" cy="7" r="5" />
      <path d="M2 32 Q2 17 12 17 Q22 17 22 32 Z" />
    </svg>
  );
}

export function UbpProblemStat() {
  const ref = useRef<HTMLElement | null>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setRevealed(true);
          obs.disconnect();
        }
      },
      { threshold: 0.05, rootMargin: "0px 0px -10% 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <aside ref={ref} className={`ubp-stat${revealed ? " is-revealed" : ""}`}>
      <div className="ubp-stat-num">
        &gt;<CountUp to={60} duration={FILLED_COUNT * STAGGER_MS} start={revealed} />%
      </div>
      <div className="ubp-stat-people">
        {Array.from({ length: PEOPLE_COUNT }).map((_, i) => (
          <span
            key={i}
            className={`ubp-person${i < FILLED_COUNT ? " is-filled" : ""}`}
            style={{ "--reveal-index": i } as CSSProperties}
          >
            <PersonIcon />
          </span>
        ))}
      </div>
      <div className="ubp-stat-label">
        Of people who play games don&apos;t actually identify as &quot;gamers.&quot;
      </div>
    </aside>
  );
}
