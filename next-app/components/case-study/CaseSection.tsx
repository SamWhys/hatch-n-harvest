import type { ReactNode } from "react";

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
        {heading ? <h2>{heading}</h2> : null}
        {children}
      </div>
    </section>
  );
}
