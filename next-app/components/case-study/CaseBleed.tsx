export function CaseBleed({
  src,
  alt,
  caption,
  variant = "full",
}: {
  src: string;
  alt: string;
  caption?: string;
  variant?: "full" | "wide";
}) {
  return (
    <figure className={`case-bleed case-bleed-${variant}`}>
      <img src={src} alt={alt} loading="lazy" />
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
}
