export function HeroCaption({ title, meta }: { title: string; meta: string }) {
  return (
    <div className="hero-caption">
      <strong>{title}</strong>
      <span>{meta}</span>
    </div>
  );
}
