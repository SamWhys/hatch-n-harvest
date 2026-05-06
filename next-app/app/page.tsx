import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { Ticker } from "@/components/Ticker";
import { Manifesto } from "@/components/Manifesto";
import { Work } from "@/components/Work";
import { Process } from "@/components/Process";
import { Studio } from "@/components/Studio";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";

export default function HomePage() {
  return (
    <>
      <Nav />
      <main id="top">
        <Hero />
        <Ticker />
        <Manifesto />
        <Work />
        <Process />
        <Studio />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
