import type { ReactNode } from "react";
import { RisingHeading } from "./RisingHeading";

export function CaseSection({
  className,
  eyebrow,
  heading,
  id,
  children,
}: {
  className?: string;
  eyebrow?: string;
  heading?: ReactNode;
  id?: string;
  children: ReactNode;
}) {
  return (
    <section className={className} id={id}>
      <div className="wrap">
        {eyebrow ? <div className="eyebrow">{eyebrow}</div> : null}
        {heading ? <RisingHeading as="h2">{heading}</RisingHeading> : null}
        {children}
      </div>
    </section>
  );
}
