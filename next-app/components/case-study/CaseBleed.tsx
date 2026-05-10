import type { ReactNode } from "react";

export function CaseBleed({
  children,
  caption,
}: {
  children: ReactNode;
  caption?: { title: string; meta: string };
}) {
  return (
    <>
      <div className="case-bleed">{children}</div>
      {caption ? (
        <div className="bleed-caption">
          <strong>{caption.title}</strong>
          <span>{caption.meta}</span>
        </div>
      ) : null}
    </>
  );
}
