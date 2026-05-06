import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hatch n Harvest — A branding studio for brands still finding their shape",
  description:
    "Hatch n Harvest is a branding studio for challenger brands and first-time founders. Strategy, identity, and launch — grown with care.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght,SOFT@0,9..144,400..900,0..100;1,9..144,400..900,0..100&family=Inter:wght@400;500;600;700&family=Open+Sans:ital,wght@0,400..800;1,400..800&family=DM+Sans:wght@300;400;500;600&family=Caveat:wght@400;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
