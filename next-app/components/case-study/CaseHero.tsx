export function CaseHero({
  kicker,
  title,
  meta,
}: {
  kicker: string;
  title: string;
  meta: Array<{ label: string; value: string }>;
}) {
  return (
    <section className="case-hero">
      <div className="wrap">
        <p className="case-hero-kicker">{kicker}</p>
        <h1>{title}</h1>
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
