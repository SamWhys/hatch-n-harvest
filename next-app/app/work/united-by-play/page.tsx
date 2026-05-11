import type { Metadata } from "next";
import type React from "react";
import { CaseStudyShell } from "@/components/case-study/CaseStudyShell";
import { CaseHero } from "@/components/case-study/CaseHero";
import { CaseBleed } from "@/components/case-study/CaseBleed";
import { DocuseriesDeck } from "@/components/case-study/DocuseriesDeck";
import { UbpAssetReveal } from "@/components/case-study/UbpAssetReveal";
import { UbpProblemStat } from "@/components/case-study/UbpProblemStat";
import { RisingHeading } from "@/components/case-study/RisingHeading";
import { FadeInP } from "@/components/case-study/FadeInP";
import { AutoplayVideo } from "@/components/case-study/AutoplayVideo";

export const metadata: Metadata = {
    title: "United by Play — ViewSonic · Hatch n Harvest",
    description:
        "A global campaign that challenged gaming stereotypes and proved that no matter how you play, we are all united by play.",
};

export default function UnitedByPlayPage() {
    return (
        <CaseStudyShell>
            <CaseHero
                backLink={{ label: "All work", href: "../../#work" }}
                eyebrow="Campaign · 2021"
                title={<>United <em>by Play.</em></>}
                kicker="A global campaign that challenged gaming stereotypes and proved that no matter how you play, we are all united by play."
                meta={[
                    { label: "Client", value: "ViewSonic" },
                    { label: "Scope", value: "Campaign · Manifesto · Docuseries · Social · Event" },
                    { label: "Year", value: "2021" },
                    { label: "Reach", value: "Global launch — gaming & lifestyle audiences" },
                ]}
            />

            <CaseBleed caption={{ title: "Hero film · United by Play.", meta: "Campaign · 2021" }}>
                <AutoplayVideo videoId="Vd_Tt1iSO90" title="United by Play — Hero film" />
            </CaseBleed>

            {/* THE PROBLEM */}
            <section className="problem ubp-problem">
                <div className="wrap">
                    <RisingHeading as="h2" className="ubp-section-h">The Problem</RisingHeading>
                    <div className="ubp-problem-cols">
                        <div className="ubp-problem-body">
                            <FadeInP>Despite more than 30 years in gaming displays and the successful launch of its high-performance ELITE monitors, ViewSonic discovered a major disconnect in the gaming market: over 60% of people who play games don&#39;t actually identify as &#34;gamers.&#34;</FadeInP>
                            <FadeInP>Traditional gaming marketing often focused on stereotypes that excluded casual players and broader audiences.</FadeInP>
                            <FadeInP>With the launch of the OMNI line, ViewSonic saw an opportunity to reposition itself under the unified banner of &#34;ViewSonic Gaming&#34; and create a brand platform that embraced every type of player.</FadeInP>
                        </div>
                        <UbpProblemStat />
                    </div>
                </div>
            </section>

            {/* THE SOLUTION + ASSET GRID */}
            <section className="ubp-solution">
                <div className="wrap">
                    <RisingHeading as="h2" className="ubp-section-h">The Solution</RisingHeading>
                    <FadeInP className="ubp-solution-lead">ViewSonic launched the global &#34;United by Play&#34; campaign built around the message that no matter how, where, or why you play, we are all united by play. The platform reframed gaming as something inclusive — a shared experience that crosses age, gender, geography, and skill level.</FadeInP>
                </div>

                {/* Solution Asset Grid — non-standard nested layout matching source */}
                <UbpAssetReveal>
                    <div className="ubp-asset-grid">

                        {/* Row 1: Gaming Hero Shot (full width) */}
                        <figure className="ubp-cell ubp-hero-shot" style={{ "--reveal-index": 0 } as React.CSSProperties}>
                            <img src="../../assets/work/united-by-play/gaming-hero-shot.jpg" alt="Gaming hero shot — United by Play campaign key visual." loading="lazy" />
                        </figure>

                        {/* Row 2: two-column (885 left | 373 right) */}
                        <div className="ubp-row2">
                            <div className="ubp-row2-left">
                                {/* Frame 26: top of left column (885x841) */}
                                <div className="ubp-frame26">
                                    <figure className="ubp-cell ubp-chinese-lady" style={{ "--reveal-index": 1 } as React.CSSProperties}>
                                        <img src="../../assets/work/united-by-play/portrait-chinese-lady.jpg" alt="Portrait — Chinese lady gamer." loading="lazy" />
                                    </figure>
                                    <div className="ubp-frame25">
                                        <figure className="ubp-cell ubp-cop" style={{ "--reveal-index": 2 } as React.CSSProperties}>
                                            <img src="../../assets/work/united-by-play/portrait-cop.jpg" alt="Portrait — police officer gamer." loading="lazy" />
                                        </figure>
                                        <figure className="ubp-cell ubp-troll" style={{ "--reveal-index": 5 } as React.CSSProperties}>
                                            <img src="../../assets/work/united-by-play/portrait-troll-investors.jpg" alt="Portrait — Troll Investors group." loading="lazy" />
                                        </figure>
                                    </div>
                                </div>
                                {/* Bottom of left column: Portrait Man (885x885) */}
                                <figure className="ubp-cell ubp-man" style={{ "--reveal-index": 6 } as React.CSSProperties}>
                                    <img src="../../assets/work/united-by-play/portrait-man.jpg" alt="Portrait — gamer at home." loading="lazy" />
                                </figure>
                            </div>

                            <div className="ubp-row2-right">
                                <figure className="ubp-cell ubp-fashion" style={{ "--reveal-index": 4 } as React.CSSProperties}>
                                    <img src="../../assets/work/united-by-play/portrait-fashion-designer.jpg" alt="Portrait — fashion designer gamer." loading="lazy" />
                                </figure>
                                <figure className="ubp-cell ubp-award" style={{ "--reveal-index": 3 } as React.CSSProperties}>
                                    <video
                                        src="../../assets/work/united-by-play/award-logo.mp4"
                                        poster="../../assets/work/united-by-play/award-logo.png"
                                        autoPlay
                                        loop
                                        muted
                                        playsInline
                                        preload="metadata"
                                        aria-label="United by Play award trophy — animated reveal."
                                    />
                                </figure>
                                <figure className="ubp-cell ubp-waitress" style={{ "--reveal-index": 7 } as React.CSSProperties}>
                                    <img src="../../assets/work/united-by-play/portrait-waitress.jpg" alt="Portrait — waitress gamer." loading="lazy" />
                                </figure>
                                <figure className="ubp-cell ubp-kid" style={{ "--reveal-index": 8 } as React.CSSProperties}>
                                    <img src="../../assets/work/united-by-play/portrait-kid.jpg" alt="Portrait — kid gamer." loading="lazy" />
                                </figure>
                            </div>
                        </div>

                        {/* Row 3: two cells (629 each) */}
                        <div className="ubp-row3">
                            <figure className="ubp-cell ubp-whiskey" style={{ "--reveal-index": 9 } as React.CSSProperties}>
                                <AutoplayVideo videoId="S9cT1s8xrCk" title="United by Play — Side Quests film" />
                            </figure>
                            <figure className="ubp-cell ubp-title" style={{ "--reveal-index": 10 } as React.CSSProperties}>
                                <img src="../../assets/work/united-by-play/title-no-matter-how-you-game.jpg" alt="Title card — No matter how you game." loading="lazy" />
                            </figure>
                        </div>

                    </div>
                </UbpAssetReveal>
            </section>

            {/* THE DOCUSERIES */}
            <section className="ubp-docuseries">
                <div className="wrap">
                    <RisingHeading as="h2" className="ubp-section-h">The Docuseries</RisingHeading>
                    <FadeInP className="ubp-docu-lead">A three-part docuseries — <em>Beyond the Game</em> — followed gamers whose lives challenged the traditional stereotype, taking us behind the scenes with a tech rehearsal, a custom-build forge, and an art gallery curated by the players themselves.</FadeInP>

                    <DocuseriesDeck
                        episodes={[
                            {
                                title: "Tech Rehearsal",
                                thumbnail: "../../assets/work/united-by-play/docu-tech-rehearsal.jpg",
                                alt: "Tech Rehearsal — episode thumbnail.",
                                href: "https://www.youtube.com/watch?v=tRE3Mq6w5fo",
                            },
                            {
                                title: "The Forge",
                                thumbnail: "../../assets/work/united-by-play/docu-the-forge.jpg",
                                alt: "The Forge — episode thumbnail.",
                                href: "https://www.youtube.com/watch?v=Dwo2JJKZviI",
                            },
                            {
                                title: "The Gallery",
                                thumbnail: "../../assets/work/united-by-play/docu-the-gallery.jpg",
                                alt: "The Gallery — episode thumbnail.",
                                href: "https://www.youtube.com/watch?v=pGKBf9kV6mY",
                            },
                        ]}
                    />
                </div>
            </section>

            {/* THE BATTLE FOR CHARITY */}
            <section className="ubp-docuseries ubp-battle">
                <div className="wrap">
                    <RisingHeading as="h2" className="ubp-section-h">The Battle For Charity</RisingHeading>
                    <FadeInP className="ubp-docu-lead">A streamed gaming showdown that turned the launch into a charity drive — communities lining up around the United by Play platform to play, vote, and give.</FadeInP>
                    <div className="ubp-film-frame">
                        <AutoplayVideo videoId="7clzHwb4aCI" title="United by Play — Battle for Charity highlights" />
                    </div>
                </div>
            </section>

            {/* THE RESULT */}
            <section className="ubp-result">
                <div className="wrap">
                    <RisingHeading as="h2" className="ubp-section-h">The Result</RisingHeading>
                    <FadeInP className="ubp-result-lead">The campaign delivered exceptional engagement and awareness on a global scale — turning a hardware brand pivot into a cultural conversation about who games and why.</FadeInP>

                    <figure className="ubp-result-board">
                        <img src="../../assets/work/united-by-play/results-overview.jpg" alt="United by Play campaign results overview — insight, strategy, and headline metrics: 128M total impressions, 24M unique users on social, 2M completed video views, 6.3M YouTube views." loading="lazy" />
                    </figure>
                    <figure className="ubp-result-board">
                        <img src="../../assets/work/united-by-play/social-result-board.jpg" alt="United by Play social post board — phone mockups showing campaign social media posts and engagement." loading="lazy" />
                    </figure>
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
        </CaseStudyShell>
    );
}
