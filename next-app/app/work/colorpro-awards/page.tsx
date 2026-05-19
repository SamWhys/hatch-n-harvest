import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { CaseStudyShell } from "@/components/case-study/CaseStudyShell";
import { CaseHero } from "@/components/case-study/CaseHero";
import { CaseBleed } from "@/components/case-study/CaseBleed";
import { RisingHeading } from "@/components/case-study/RisingHeading";
import { AutoplayVideo } from "@/components/case-study/AutoplayVideo";
import { DocuseriesFilmstrip } from "@/components/case-study/DocuseriesFilmstrip";
import { FadeInP } from "@/components/case-study/FadeInP";
import { ScrollRevealGroup } from "@/components/case-study/ScrollRevealGroup";

export const metadata: Metadata = {
    title: "ColorPro Awards — ViewSonic · Hatch n Harvest",
    description:
        "A global creative platform that turned ViewSonic's professional displays into the world's pro-creator stage — across film, exhibitions, and live ceremonies in four years.",
};

const cpaBrandVars = {
    "--cpa-bg": "#2b2722",
    "--cpa-paper": "#f2ebda",
    "--cpa-mute": "#b5ac9b",
    "--cpa-line": "rgba(242, 235, 218, 0.14)",
} as CSSProperties;

export default function ColorProAwardsPage() {
    return (
        <CaseStudyShell brandVars={cpaBrandVars}>
            <div className="cpa-page">
                <CaseHero
                    backLink={{ label: "All work", href: "../../#work" }}
                    eyebrow="Campaign · 2022–2026"
                    title={<>ColorPro <em>Awards.</em></>}
                    kicker="Transformed ViewSonic's professional display lineup into a global creative platform — bringing together artists, storytellers and industry partners through immersive experiences that turned inspiration into real-world brand and product engagement."
                    meta={[
                        { label: "Client", value: "ViewSonic" },
                        { label: "Scope", value: "Campaign · Identity · Microsite · Live Events · Social Activations" },
                        { label: "Year", value: "2022–2026" },
                        { label: "Reach", value: "Global launch from Taiwan; live events in UK, India, Thailand, Vietnam" },
                    ]}
                />

                <CaseBleed caption={{ title: "Hero film · The ColorPro Awards.", meta: "Campaign · 2026" }}>
                    <AutoplayVideo videoId="pthccmfcNLI" title="ColorPro Awards — FLOW hero film" start={8} />
                </CaseBleed>

                {/* THE PROBLEM */}
                <section className="problem">
                    <div className="wrap">
                        <div className="problem-intro">
                            <RisingHeading as="h2">The Problem</RisingHeading>
                            <p>ViewSonic wanted to build more than a traditional marketing campaign for its ColorPro professional displays.</p>
                            <p>The challenge was creating a globally recognized platform that could connect with creators, inspire community participation and strengthen relationships with channel partners — all while driving real-world product demand.</p>
                            <p>The campaign also needed to extend beyond digital advertising into immersive, in-person experiences that showcased the power of the product firsthand.</p>
                        </div>
                    </div>
                </section>

                {/* THE SOLUTION */}
                <section className="cpa-solution">
                    <div className="wrap">
                        <figure className="cpa-solution-kv">
                            <img
                                src="../../assets/work/colorpro-awards/kv-solution.jpg"
                                alt="2025 ColorPro Awards key visual — bold abstract type composition over an electric blue gradient."
                                loading="lazy"
                            />
                        </figure>

                        <div className="cpa-solution-copy">
                            <RisingHeading as="h2">The Solution</RisingHeading>
                            <p>ViewSonic launched the ColorPro Awards, a global creative competition built around inspiring annual themes like &ldquo;FLOW,&rdquo; &ldquo;MOMENTUM,&rdquo; and &ldquo;RISE.&rdquo; The campaign invited photographers, filmmakers, and digital artists from around the world to submit original work while engaging audiences through paid media, social content, influencer partnerships, tutorials and community voting experiences.</p>
                            <p>To bring the platform to life, ViewSonic hosted international award ceremonies and traveling exhibitions across key global markets. These events transformed digital artwork into immersive physical showcases, giving creators, resellers, distributors and enterprise customers hands-on experiences with ColorPro displays. By combining creator storytelling with experiential marketing, the campaign created a seamless bridge between brand inspiration and product engagement.</p>
                        </div>

                        {/* Asset grid */}
                        <ScrollRevealGroup className="cpa-asset-grid">
                            <div className="cpa-asset-col cpa-asset-col-wide">
                                <figure className="cpa-tile cpa-tile-wide" style={{ "--reveal-index": 0 } as CSSProperties}>
                                    <img
                                        src="../../assets/work/colorpro-awards/prize-outline.png"
                                        alt="ColorPro Awards 2024 — prize outline graphic listing the three category awards."
                                        loading="lazy"
                                    />
                                </figure>

                                <div className="cpa-tile cpa-tile-video" style={{ "--reveal-index": 1 } as CSSProperties}>
                                    <AutoplayVideo videoId="q0qJdUqJiq0" title="ColorPro Awards — FLOW teaser" />
                                </div>

                                <div className="cpa-tile-row">
                                    <figure className="cpa-tile" style={{ "--reveal-index": 2 } as CSSProperties}>
                                        <img
                                            src="../../assets/work/colorpro-awards/lucky-draw.png"
                                            alt="ColorPro Awards Lucky Draw social card — campaign giveaway artwork."
                                            loading="lazy"
                                        />
                                    </figure>
                                    <figure className="cpa-tile" style={{ "--reveal-index": 3 } as CSSProperties}>
                                        <video
                                            src="../../assets/work/colorpro-awards/exhibition-ig.mp4"
                                            autoPlay
                                            loop
                                            muted
                                            playsInline
                                            preload="metadata"
                                            aria-label="ColorPro Awards exhibition footage — a short Instagram cut of the traveling exhibit."
                                        />
                                    </figure>
                                </div>

                                <div className="cpa-tile-row cpa-tile-row-tall">
                                    <figure className="cpa-tile" style={{ "--reveal-index": 4 } as CSSProperties}>
                                        <video
                                            src="../../assets/work/colorpro-awards/advocates-cover.mp4"
                                            autoPlay
                                            loop
                                            muted
                                            playsInline
                                            preload="metadata"
                                            aria-label="Meet the ColorPro Advocates — cover film for the 2024 advocates programme."
                                        />
                                    </figure>
                                    <figure className="cpa-tile" style={{ "--reveal-index": 5 } as CSSProperties}>
                                        <img
                                            src="../../assets/work/colorpro-awards/categories.png"
                                            alt="ColorPro Awards categories key art — Photography, Videography, and Digital Art."
                                            loading="lazy"
                                        />
                                    </figure>
                                </div>
                            </div>

                            <div className="cpa-asset-col cpa-asset-col-narrow">
                                <figure className="cpa-tile" style={{ "--reveal-index": 6 } as CSSProperties}>
                                    <img
                                        src="../../assets/work/colorpro-awards/kv-2023.jpg"
                                        alt="2023 ColorPro Awards key visual."
                                        loading="lazy"
                                    />
                                </figure>
                                <figure className="cpa-tile" style={{ "--reveal-index": 7 } as CSSProperties}>
                                    <img
                                        src="../../assets/work/colorpro-awards/thumbnail-vertical.png"
                                        alt="ColorPro Awards vertical thumbnail — campaign poster cut for social."
                                        loading="lazy"
                                    />
                                </figure>
                                <figure className="cpa-tile" style={{ "--reveal-index": 8 } as CSSProperties}>
                                    <video
                                        src="../../assets/work/colorpro-awards/bumper-photography.mp4"
                                        autoPlay
                                        loop
                                        muted
                                        playsInline
                                        preload="metadata"
                                        aria-label="ColorPro Awards Photography bumper — short category sting."
                                    />
                                </figure>
                                <figure className="cpa-tile" style={{ "--reveal-index": 9 } as CSSProperties}>
                                    <img
                                        src="../../assets/work/colorpro-awards/judge-jeremy.png"
                                        alt="Judge spotlight — Jeremy Reinmuth, ColorPro Awards juror."
                                        loading="lazy"
                                    />
                                </figure>
                            </div>
                        </ScrollRevealGroup>
                    </div>
                </section>

                {/* THE LIVE EVENTS */}
                <section className="cpa-live-events">
                    <div className="wrap">
                        <RisingHeading as="h2">The Live Events</RisingHeading>
                        <FadeInP className="cpa-section-lead">To turn the awards into something audiences could touch, ViewSonic took ColorPro on the road. International ceremonies and traveling exhibitions across the UK, India, Thailand, and Vietnam transformed each year&apos;s winning work into immersive physical showcases — where creators, resellers, distributors, and enterprise customers could see the displays do exactly what the winning artists had asked of them. Each stop combined gallery, ceremony, and product demo into a single experience, turning brand inspiration into hands-on engagement.</FadeInP>

                        <div className="cpa-live-events-anchors">
                            <figure className="cpa-tile">
                                <img
                                    src="../../assets/work/colorpro-awards/event-india.jpg"
                                    alt="ColorPro Awards ceremony — India gallery installation, 2024."
                                    loading="lazy"
                                />
                            </figure>
                            <figure className="cpa-tile">
                                <img
                                    src="../../assets/work/colorpro-awards/event-london.jpg"
                                    alt="ColorPro Awards 2023 — London venue, exhibition stage and audience."
                                    loading="lazy"
                                />
                            </figure>
                        </div>

                        <DocuseriesFilmstrip
                            episodes={[
                                {
                                    title: "2026 FLOW · Live event",
                                    thumbnail: "https://i.ytimg.com/vi/rIY52x2l__w/maxresdefault.jpg",
                                    alt: "FLOW 2026 ColorPro Awards live event highlight.",
                                    href: "https://www.youtube.com/watch?v=rIY52x2l__w&list=PLhW6e7eTnTo6yLopbyljaJ4HThnECfh1_&index=1",
                                },
                                {
                                    title: "5th MOMENTUM · Live event",
                                    thumbnail: "https://i.ytimg.com/vi/GYZe8CY63lE/maxresdefault.jpg",
                                    alt: "5th ColorPro Awards MOMENTUM live event highlight.",
                                    href: "https://www.youtube.com/watch?v=GYZe8CY63lE&list=PLhW6e7eTnTo6yLopbyljaJ4HThnECfh1_&index=6",
                                },
                                {
                                    title: "2022 BREAKTHROUGH · Live event",
                                    thumbnail: "https://i.ytimg.com/vi/9DULWKEcNsU/maxresdefault.jpg",
                                    alt: "2022 ColorPro Awards BREAKTHROUGH live event highlight.",
                                    href: "https://www.youtube.com/watch?v=9DULWKEcNsU",
                                },
                                {
                                    title: "RISE · Live event",
                                    thumbnail: "https://i.ytimg.com/vi/anOFomSca7Q/maxresdefault.jpg",
                                    alt: "ColorPro Awards RISE live event highlight.",
                                    href: "https://www.youtube.com/watch?v=anOFomSca7Q",
                                },
                                {
                                    title: "2021 · Live event",
                                    thumbnail: "https://i.ytimg.com/vi/VuQEWNX8-3g/maxresdefault.jpg",
                                    alt: "2021 ColorPro Awards live event highlight.",
                                    href: "https://www.youtube.com/watch?v=VuQEWNX8-3g&list=PLhW6e7eTnTo6yLopbyljaJ4HThnECfh1_&index=13",
                                },
                            ]}
                        />
                    </div>
                </section>

                {/* THE RESULTS */}
                <section className="cpa-results">
                    <div className="wrap">
                        <RisingHeading as="h2">The Results</RisingHeading>
                        <div className="cpa-results-body">
                            <FadeInP>The ColorPro Awards evolved into a global ecosystem that strengthened both brand affinity and business growth.</FadeInP>
                            <FadeInP>The campaign generated thousands of submissions from more than 100 countries, built an engaged, international and creative community, which helped position ViewSonic as a leader in creative technology.</FadeInP>
                            <FadeInP>At the same time, the platform increased visibility for ColorPro displays, strengthened reseller and partner relationships and created meaningful opportunities for product demonstrations and demand generation.</FadeInP>
                            <FadeInP>By integrating online engagement with offline experiences, the campaign successfully moved audiences from inspiration to participation to product interaction — delivering impact across both B2C and B2B audiences.</FadeInP>
                        </div>

                        <DocuseriesFilmstrip
                            episodes={[
                                {
                                    title: "RISE · Highlight reel",
                                    thumbnail: "https://i.ytimg.com/vi/67LDhrlMfKg/maxresdefault.jpg",
                                    alt: "ColorPro Awards 2023 RISE highlight reel.",
                                    href: "https://www.youtube.com/watch?v=67LDhrlMfKg&list=PLhW6e7eTnTo6yLopbyljaJ4HThnECfh1_&index=11",
                                },
                                {
                                    title: "5th MOMENTUM · Highlight reel",
                                    thumbnail: "https://i.ytimg.com/vi/Po5tOYmwa9I/maxresdefault.jpg",
                                    alt: "The 5th ColorPro Awards MOMENTUM highlight reel.",
                                    href: "https://www.youtube.com/watch?v=Po5tOYmwa9I&list=PLhW6e7eTnTo6yLopbyljaJ4HThnECfh1_&index=7",
                                },
                                {
                                    title: "2021 NEW ADVENTURE · Highlight reel",
                                    thumbnail: "https://i.ytimg.com/vi/erOwuKmsU7c/maxresdefault.jpg",
                                    alt: "2021 ColorPro Awards NEW ADVENTURE highlight reel.",
                                    href: "https://www.youtube.com/watch?v=erOwuKmsU7c&list=PLhW6e7eTnTo6yLopbyljaJ4HThnECfh1_&index=18",
                                },
                            ]}
                        />
                    </div>
                </section>

                {/* BACK TO ALL WORK */}
                <section className="next-project-section">
                    <div className="wrap">
                        <a className="next-project" href="../../#work">
                            <div className="np-eyebrow">More harvests →</div>
                            <div className="np-title">Back to all work</div>
                            <div className="np-note">Individual case studies for Hinterland Stays, Common Range, Small Acre, and Moth &amp; Bloom are on their way.</div>
                        </a>
                    </div>
                </section>
            </div>
        </CaseStudyShell>
    );
}
