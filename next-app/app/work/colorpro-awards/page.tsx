import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { CaseStudyShell } from "@/components/case-study/CaseStudyShell";
import { CaseHero } from "@/components/case-study/CaseHero";
import { CaseBleed } from "@/components/case-study/CaseBleed";
import { RisingHeading } from "@/components/case-study/RisingHeading";
import { AutoplayVideo } from "@/components/case-study/AutoplayVideo";

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
                    <AutoplayVideo videoId="q0qJdUqJiq0" title="ColorPro Awards — FLOW hero film" />
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
                        <div className="cpa-asset-grid">
                            <div className="cpa-asset-col cpa-asset-col-wide">
                                <figure className="cpa-tile cpa-tile-wide">
                                    <img
                                        src="../../assets/work/colorpro-awards/prize-outline.png"
                                        alt="ColorPro Awards 2024 — prize outline graphic listing the three category awards."
                                        loading="lazy"
                                    />
                                </figure>

                                <div className="cpa-tile cpa-tile-video">
                                    <AutoplayVideo videoId="q0qJdUqJiq0" title="ColorPro Awards — FLOW teaser" />
                                </div>

                                <div className="cpa-tile-row">
                                    <figure className="cpa-tile">
                                        <img
                                            src="../../assets/work/colorpro-awards/lucky-draw.png"
                                            alt="ColorPro Awards Lucky Draw social card — campaign giveaway artwork."
                                            loading="lazy"
                                        />
                                    </figure>
                                    <figure className="cpa-tile">
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
                                    <figure className="cpa-tile">
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
                                    <figure className="cpa-tile">
                                        <img
                                            src="../../assets/work/colorpro-awards/categories.png"
                                            alt="ColorPro Awards categories key art — Photography, Videography, and Digital Art."
                                            loading="lazy"
                                        />
                                    </figure>
                                </div>
                            </div>

                            <div className="cpa-asset-col cpa-asset-col-narrow">
                                <figure className="cpa-tile">
                                    <img
                                        src="../../assets/work/colorpro-awards/kv-2023.png"
                                        alt="2023 ColorPro Awards key visual."
                                        loading="lazy"
                                    />
                                </figure>
                                <figure className="cpa-tile">
                                    <img
                                        src="../../assets/work/colorpro-awards/thumbnail-vertical.png"
                                        alt="ColorPro Awards vertical thumbnail — campaign poster cut for social."
                                        loading="lazy"
                                    />
                                </figure>
                                <figure className="cpa-tile">
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
                                <figure className="cpa-tile">
                                    <img
                                        src="../../assets/work/colorpro-awards/judge-jeremy.png"
                                        alt="Judge spotlight — Jeremy Reinmuth, ColorPro Awards juror."
                                        loading="lazy"
                                    />
                                </figure>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </CaseStudyShell>
    );
}
