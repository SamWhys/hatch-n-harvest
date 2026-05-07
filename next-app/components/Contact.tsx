"use client";

import { useRef } from "react";
import { useParallaxScroll } from "./useParallaxScroll";

export function Contact() {
  const leftRef = useRef<HTMLImageElement>(null);
  const rightRef = useRef<HTMLImageElement>(null);
  useParallaxScroll(leftRef, { intensity: 0.18 });
  useParallaxScroll(rightRef, { intensity: 0.10 });

  return (
    <section className="contact" id="contact">
      <div className="wrap">
        <span className="script">Have a seed of an idea?</span>
        <h2>For more info about us, click here.</h2>
        <a className="contact-email" href="mailto:hello@hatchnharvest.studio">
          hello@hatchnharvest.studio
        </a>
        <div className="contact-note">
          Typical reply time: two working days · We&apos;ll tell you honestly if we&apos;re not the right fit.
        </div>

        <img
          ref={leftRef}
          className="contact-decor left parallax-mnemonic"
          src="assets/brand/brand-mnemonic-1.svg"
          alt=""
          aria-hidden="true"
        />
        <img
          ref={rightRef}
          className="contact-decor right parallax-mnemonic"
          src="assets/brand/brand-mnemonic-4.svg"
          alt=""
          aria-hidden="true"
        />
      </div>
    </section>
  );
}
