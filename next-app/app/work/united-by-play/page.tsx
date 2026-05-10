import type { Metadata } from "next";
import { CaseStudyShell } from "@/components/case-study/CaseStudyShell";
import { CaseHero } from "@/components/case-study/CaseHero";
import { CaseBleed } from "@/components/case-study/CaseBleed";

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
                <iframe
                    src="https://www.youtube.com/embed/Vd_Tt1iSO90?rel=0&modestbranding=1"
                    title="United by Play — Hero film"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                    loading="eager"
                />
            </CaseBleed>

            {/* THE PROBLEM */}
            <section className="problem ubp-problem">
                <div className="wrap">
                    <h2 className="ubp-section-h">The Problem</h2>
                    <div className="ubp-problem-cols">
                        <div className="ubp-problem-body">
                            <p>Despite more than 30 years in gaming displays and the successful launch of its high-performance ELITE monitors, ViewSonic discovered a major disconnect in the gaming market: over 60% of people who play games don&#39;t actually identify as &#34;gamers.&#34;</p>
                            <p>Traditional gaming marketing often focused on stereotypes that excluded casual players and broader audiences.</p>
                            <p>With the launch of the OMNI line, ViewSonic saw an opportunity to reposition itself under the unified banner of &#34;ViewSonic Gaming&#34; and create a brand platform that embraced every type of player.</p>
                        </div>
                        <aside className="ubp-stat">
                            <div className="ubp-stat-num">&gt;60%</div>
                            <div className="ubp-stat-label">Of people who play games don&#39;t actually identify as &#34;gamers.&#34;</div>
                        </aside>
                    </div>
                </div>
            </section>

            {/* THE SOLUTION + ASSET GRID */}
            <section className="ubp-solution">
                <div className="wrap">
                    <h2 className="ubp-section-h">The Solution</h2>
                    <p className="ubp-solution-lead">ViewSonic launched the global &#34;United by Play&#34; campaign built around the message that no matter how, where, or why you play, we are all united by play. The platform reframed gaming as something inclusive — a shared experience that crosses age, gender, geography, and skill level.</p>
                </div>

                {/* Solution Asset Grid — non-standard nested layout matching source */}
                <div className="ubp-asset-wrap">
                    <div className="ubp-asset-grid">

                        {/* Row 1: Gaming Hero Shot (full width) */}
                        <figure className="ubp-cell ubp-hero-shot">
                            <img src="../../assets/work/united-by-play/gaming-hero-shot.jpg" alt="Gaming hero shot — United by Play campaign key visual." loading="lazy" />
                        </figure>

                        {/* Row 2: two-column (885 left | 373 right) */}
                        <div className="ubp-row2">
                            <div className="ubp-row2-left">
                                {/* Frame 26: top of left column (885x841) */}
                                <div className="ubp-frame26">
                                    <figure className="ubp-cell ubp-chinese-lady">
                                        <img src="../../assets/work/united-by-play/portrait-chinese-lady.jpg" alt="Portrait — Chinese lady gamer." loading="lazy" />
                                    </figure>
                                    <div className="ubp-frame25">
                                        <figure className="ubp-cell ubp-cop">
                                            <img src="../../assets/work/united-by-play/portrait-cop.jpg" alt="Portrait — police officer gamer." loading="lazy" />
                                        </figure>
                                        <figure className="ubp-cell ubp-troll">
                                            <img src="../../assets/work/united-by-play/portrait-troll-investors.jpg" alt="Portrait — Troll Investors group." loading="lazy" />
                                        </figure>
                                    </div>
                                </div>
                                {/* Bottom of left column: Portrait Man (885x885) */}
                                <figure className="ubp-cell ubp-man">
                                    <img src="../../assets/work/united-by-play/portrait-man.jpg" alt="Portrait — gamer at home." loading="lazy" />
                                </figure>
                            </div>

                            <div className="ubp-row2-right">
                                <figure className="ubp-cell ubp-fashion">
                                    <img src="../../assets/work/united-by-play/portrait-fashion-designer.jpg" alt="Portrait — fashion designer gamer." loading="lazy" />
                                </figure>
                                <figure className="ubp-cell ubp-award">
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
                                <figure className="ubp-cell ubp-waitress">
                                    <img src="../../assets/work/united-by-play/portrait-waitress.jpg" alt="Portrait — waitress gamer." loading="lazy" />
                                </figure>
                                <figure className="ubp-cell ubp-kid">
                                    <img src="../../assets/work/united-by-play/portrait-kid.jpg" alt="Portrait — kid gamer." loading="lazy" />
                                </figure>
                            </div>
                        </div>

                        {/* Row 3: two cells (629 each) */}
                        <div className="ubp-row3">
                            <figure className="ubp-cell ubp-whiskey">
                                <img src="../../assets/work/united-by-play/portrait-whiskey-guy.jpg" alt="Portrait — whiskey gamer." loading="lazy" />
                            </figure>
                            <figure className="ubp-cell ubp-title">
                                <img src="../../assets/work/united-by-play/title-no-matter-how-you-game.jpg" alt="Title card — No matter how you game." loading="lazy" />
                            </figure>
                        </div>

                    </div>
                </div>
            </section>

            {/* THE DOCUSERIES */}
            <section className="ubp-docuseries">
                <div className="wrap">
                    <h2 className="ubp-section-h">The Docuseries</h2>
                    <p className="ubp-docu-lead">A three-part docuseries — <em>Beyond the Game</em> — followed gamers whose lives challenged the traditional stereotype, taking us behind the scenes with a tech rehearsal, a custom-build forge, and an art gallery curated by the players themselves.</p>

                    <div className="ubp-docu-grid">
                        <figure>
                            <a className="ubp-docu-thumb" href="https://www.youtube.com/watch?v=tRE3Mq6w5fo" target="_blank" rel="noopener noreferrer" aria-label="Watch — Tech Rehearsal">
                                <img src="../../assets/work/united-by-play/docu-tech-rehearsal.jpg" alt="Tech Rehearsal — episode thumbnail." loading="lazy" />
                                <span className="ubp-play" aria-hidden="true">
                                    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
                                </span>
                            </a>
                            <figcaption>Tech Rehearsal</figcaption>
                        </figure>
                        <figure>
                            <a className="ubp-docu-thumb" href="https://www.youtube.com/watch?v=Dwo2JJKZviI" target="_blank" rel="noopener noreferrer" aria-label="Watch — The Forge">
                                <img src="../../assets/work/united-by-play/docu-the-forge.jpg" alt="The Forge — episode thumbnail." loading="lazy" />
                                <span className="ubp-play" aria-hidden="true">
                                    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
                                </span>
                            </a>
                            <figcaption>The Forge</figcaption>
                        </figure>
                        <figure>
                            <a className="ubp-docu-thumb" href="https://www.youtube.com/watch?v=pGKBf9kV6mY" target="_blank" rel="noopener noreferrer" aria-label="Watch — The Gallery">
                                <img src="../../assets/work/united-by-play/docu-the-gallery.jpg" alt="The Gallery — episode thumbnail." loading="lazy" />
                                <span className="ubp-play" aria-hidden="true">
                                    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
                                </span>
                            </a>
                            <figcaption>The Gallery</figcaption>
                        </figure>
                    </div>
                </div>
            </section>

            {/* THE BATTLE FOR CHARITY */}
            <section className="ubp-docuseries ubp-battle">
                <div className="wrap">
                    <h2 className="ubp-section-h">The Battle For Charity</h2>
                    <p className="ubp-docu-lead">A streamed gaming showdown that turned the launch into a charity drive — communities lining up around the United by Play platform to play, vote, and give.</p>
                    {/* Battle for Charity content placeholder — videos and assets to follow */}
                </div>
            </section>

            {/* THE RESULT */}
            <section className="ubp-result">
                <div className="wrap">
                    <h2 className="ubp-section-h">The Result</h2>
                    <p className="ubp-result-lead">The campaign delivered exceptional engagement and awareness on a global scale — turning a hardware brand pivot into a cultural conversation about who games and why.</p>

                    <figure className="ubp-result-board">
                        <img src="../../assets/work/united-by-play/results-overview.jpg" alt="United by Play campaign results overview — insight, strategy, and headline metrics: 128M total impressions, 24M unique users on social, 2M completed video views, 6.3M YouTube views." loading="lazy" />
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
