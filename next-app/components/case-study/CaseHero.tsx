import type { ReactNode } from "react";

export function CaseHero({
  backLink,
  eyebrow,
  kicker,
  title,
  meta,
}: {
  backLink?: { label: string; href: string };
  eyebrow?: string;
  kicker: string;
  title: ReactNode;
  meta: Array<{ label: string; value: string }>;
}) {
  return (
    <section className="case-hero">
      <div className="wrap">
        {backLink ? (
          <a href={backLink.href} className="back-link">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M19 12H5M11 19l-7-7 7-7" />
            </svg>
            {backLink.label}
          </a>
        ) : null}
        {eyebrow ? <div className="eyebrow">{eyebrow}</div> : null}
        <h1>{title}</h1>
        <p className="case-hero-kicker">{kicker}</p>
        <dl className="case-meta-grid">
          {meta.map((row) => (
            <div className="case-meta-row" key={row.label}>
              <dt className="case-meta-label">{row.label}</dt>
              <dd className="case-meta-value">{row.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
