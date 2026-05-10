import type { CSSProperties, ReactNode } from "react";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

export function CaseStudyShell({
  brandVars,
  children,
}: {
  brandVars?: CSSProperties;
  children: ReactNode;
}) {
  return (
    <div className="case-study-shell" style={brandVars}>
      <Nav homeHref="../../" />
      <main>{children}</main>
      <Footer homeHref="../../" />
    </div>
  );
}
