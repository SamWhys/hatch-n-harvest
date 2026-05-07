"use client";

import { useRef } from "react";
import { useParallaxScroll } from "./useParallaxScroll";

const services = [
  {
    title: "Strategy",
    body: "Before we name a thing, we understand it. Positioning, audience, and the story that holds it all together.",
    items: [
      "Brand positioning",
      "Audience & category mapping",
      "Narrative & messaging",
      "Naming",
    ],
    icon: (
      <svg
        className="service-icon"
        viewBox="0 0 60 60"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="30" cy="30" r="22" />
        <path d="M30 12 L30 30 L42 36" />
        <circle cx="30" cy="30" r="3" fill="currentColor" />
      </svg>
    ),
  },
  {
    title: "Identity",
    body: "Marks, systems, voice, and every small detail that makes a brand unmistakably yours.",
    items: [
      "Logo & mark systems",
      "Typography & color",
      "Art direction & photography",
      "Verbal identity & tone",
    ],
    icon: (
      <svg
        className="service-icon"
        viewBox="0 0 60 60"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M14 44 L14 18 C14 14, 18 12, 22 14 L38 22 C42 24, 46 22, 46 18" />
        <circle cx="14" cy="46" r="4" fill="currentColor" />
        <circle cx="46" cy="16" r="4" fill="currentColor" />
        <path d="M22 38 L38 38 M22 44 L32 44" />
      </svg>
    ),
  },
  {
    title: "Launch",
    body: "The first impressions that count — in shelves, screens, signs, and the wild.",
    items: [
      "Packaging & print",
      "Website & digital",
      "Launch campaigns",
      "Retail & environment",
    ],
    icon: (
      <svg
        className="service-icon"
        viewBox="0 0 60 60"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M16 44 L30 12 L44 44 Z" />
        <path d="M22 34 L38 34" />
        <circle cx="30" cy="50" r="3" fill="currentColor" />
      </svg>
    ),
  },
];

export function Process() {
  const mnemonicRef = useRef<HTMLImageElement>(null);
  useParallaxScroll(mnemonicRef, { intensity: 0.15 });

  return (
    <section className="process" id="process">
      <img
        ref={mnemonicRef}
        className="section-decor process-mnemonic parallax-mnemonic"
        src="assets/brand/mnemonic-5.svg"
        alt=""
        aria-hidden="true"
      />
      <div className="wrap">
        <div className="process-head">
          <div>
            <div className="eyebrow">How we work</div>
            <h2>We grow brands in three seasons.</h2>
          </div>
          <p>
            Every engagement moves through these three phases — sometimes in sequence, sometimes in loops. The pacing is ours to set together.
          </p>
        </div>

        <div className="process-grid">
          {services.map((s) => (
            <div className="service" key={s.title}>
              {s.icon}
              <h3>{s.title}</h3>
              <p>{s.body}</p>
              <ul>
                {s.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
