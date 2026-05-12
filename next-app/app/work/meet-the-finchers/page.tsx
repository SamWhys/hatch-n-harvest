import type { Metadata } from "next";
import { CaseStudyShell } from "@/components/case-study/CaseStudyShell";
import { CaseHero } from "@/components/case-study/CaseHero";
import { CaseBleed } from "@/components/case-study/CaseBleed";
import { CaseSection } from "@/components/case-study/CaseSection";
import { RisingHeading } from "@/components/case-study/RisingHeading";
import { FadeInP } from "@/components/case-study/FadeInP";
import { AutoplayVideo } from "@/components/case-study/AutoplayVideo";

export const metadata: Metadata = {
    title: "Meet the Finchers — ViewSonic · Hatch n Harvest",
    description:
        "A binge-worthy 90s sitcom built remotely on ViewSonic's own collaboration tech — proving its visual platform could power Hollywood-grade production from Taiwan to Silicon Valley.",
};

const episodes = [
    {
        title: "Chapter 1",
        videoId: "j_Wo8Sq7EV8",
        thumb: "https://i.ytimg.com/vi/j_Wo8Sq7EV8/maxresdefault.jpg",
    },
    {
        title: "Chapter 2",
        videoId: "vGtXSKQktfo",
        thumb: "https://i.ytimg.com/vi/vGtXSKQktfo/maxresdefault.jpg",
    },
    {
        title: "Chapter 3",
        videoId: "ZbJtBAj9akQ",
        thumb: "https://i.ytimg.com/vi/ZbJtBAj9akQ/maxresdefault.jpg",
    },
];

export default function MeetTheFinchersPage() {
    return (
        <CaseStudyShell>
            <CaseHero
                backLink={{ label: "All work", href: "../../#work" }}
                eyebrow="Campaign · 2022"
                title={<>Meet the <em>Finchers.</em></>}
                kicker="What happens when a tech brand turns a remote production challenge into a binge-worthy 90s sitcom — and proves its own technology can power the entire production."
                meta={[
                    { label: "Client", value: "ViewSonic" },
                    { label: "Scope", value: "Campaign · Identity · Microsite · Documentaries · Social Activations" },
                    { label: "Year", value: "2022" },
                    { label: "Reach", value: "Global launch from Taiwan, Social Activations in Silicon Valley, USA" },
                ]}
            />

            <CaseBleed caption={{ title: "Hero film · Meet the Finchers.", meta: "Campaign · 2022" }}>
                <AutoplayVideo videoId="6Esh9_wiBCw" title="Meet the Finchers — Hero film" />
            </CaseBleed>

            {/* THE PROBLEM */}
            <section className="problem mtf-problem">
                <div className="wrap">
                    <RisingHeading as="h2">The Problem</RisingHeading>
                    <FadeInP>ViewSonic wanted to move beyond traditional product marketing and create a branded entertainment experience that would resonate emotionally with audiences.</FadeInP>
                    <FadeInP>In partnership with Caveat, the company developed The Finchers — a 90s-inspired faux sitcom designed to showcase ViewSonic technology in a fresh and engaging way.</FadeInP>
                    <FadeInP>The challenge was massive: producing a high-quality multi-platform campaign during the peak of the COVID-19 pandemic with creative, production and post-production teams spread across Taiwan and the United States, all working remotely across multiple time zones.</FadeInP>
                </div>
            </section>

            {/* OOH BANNER */}
            <section className="mtf-ooh-section">
                <div className="wrap">
                    <figure className="mtf-cell mtf-ooh">
                        <img src="../../assets/work/meet-the-finchers/finchers-ooh.jpg" alt="Meet the Finchers out-of-home billboard — sitcom-style family portrait announcing the campaign launch." loading="lazy" />
                    </figure>
                </div>
            </section>

            {/* THE SOLUTION */}
            <CaseSection className="mtf-solution" heading="The Solution">
                <FadeInP className="mtf-section-lead">Using ViewSonic&#39;s own visual collaboration and remote production technology, the teams successfully produced the six-month campaign entirely through virtual workflows.</FadeInP>
                <FadeInP className="mtf-section-lead">The project included a scripted mini-series, trailers, social content, product ads and an interactive website that tied the entire experience together.</FadeInP>
                <FadeInP className="mtf-section-lead">By combining Hollywood-style storytelling with integrated product placement and creative digital marketing, ViewSonic transformed its technology from something simply advertised into something actively powering content production.</FadeInP>
            </CaseSection>

            {/* ASSET GRID */}
            <section className="mtf-asset-grid-section">
                <div className="wrap">
                    <div className="mtf-asset-grid">
                        <div className="mtf-asset-grid-left">
                            <figure className="mtf-cell mtf-bts">
                                <video
                                    src="../../assets/work/meet-the-finchers/bts-short-form.mov"
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                    preload="metadata"
                                    aria-label="Behind-the-scenes short form — Meet the Finchers production."
                                />
                            </figure>
                            <figure className="mtf-cell mtf-jakob">
                                <img src="../../assets/work/meet-the-finchers/jakob-banner.jpg" alt="Meet the Finchers — Jakob Fincher campaign banner." loading="lazy" />
                            </figure>
                        </div>
                        <div className="mtf-asset-grid-right">
                            <figure className="mtf-cell mtf-gif">
                                <img src="../../assets/work/meet-the-finchers/animated-gif.gif" alt="Meet the Finchers — animated social asset." loading="lazy" />
                            </figure>
                            <figure className="mtf-cell mtf-lockup">
                                <img src="../../assets/work/meet-the-finchers/finchers-lockup.jpg" alt="Meet the Finchers — campaign logo lockup." loading="lazy" />
                            </figure>
                            <figure className="mtf-cell mtf-karate">
                                <video
                                    src="../../assets/work/meet-the-finchers/karate-promo.mp4"
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                    preload="metadata"
                                    aria-label="Karate promo — vertical 9:16 social spot."
                                />
                            </figure>
                        </div>
                    </div>
                    <figure className="mtf-cell mtf-linkedin">
                        <img src="../../assets/work/meet-the-finchers/linkedin-carousel.jpg" alt="Meet the Finchers — LinkedIn carousel layout." loading="lazy" />
                    </figure>
                </div>
            </section>

            {/* THE SHOW */}
            <CaseSection className="mtf-show" heading="The Show">
                <FadeInP className="mtf-section-lead">Three chapters of remote-shot, locally-broadcast 90s sitcom — each one anchored by a Fincher family member and the ViewSonic kit they couldn&#39;t live without.</FadeInP>
                <ul className="mtf-show-grid" aria-label="Meet the Finchers — episode list">
                    {episodes.map((ep) => (
                        <li key={ep.videoId} className="mtf-show-card">
                            <a
                                href={`https://www.youtube.com/watch?v=${ep.videoId}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={`Watch ${ep.title} on YouTube`}
                            >
                                <div className="mtf-show-thumb">
                                    <img src={ep.thumb} alt={`${ep.title} — episode thumbnail.`} loading="lazy" />
                                    <span className="mtf-show-play" aria-hidden="true">
                                        <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M8 5v14l11-7z" />
                                        </svg>
                                    </span>
                                </div>
                                <h3 className="mtf-show-title">{ep.title}</h3>
                            </a>
                        </li>
                    ))}
                </ul>
            </CaseSection>

            {/* THE RESULT */}
            <CaseSection className="mtf-result" heading="The Result">
                <FadeInP className="mtf-section-lead">Launched internationally in November 2020, The Finchers became a standout branded entertainment campaign that generated over 125 million media impressions, 17 million video views and 12 million engagements.</FadeInP>
                <FadeInP className="mtf-section-lead">The campaign expanded its reach through influencer partnerships, guerrilla marketing stunts, press coverage and social content that captured strong engagement among 18–34 year olds.</FadeInP>
                <FadeInP className="mtf-section-lead">Beyond the impressive numbers, the campaign demonstrated how ViewSonic&#39;s collaboration tools could enable world-class creative production entirely remotely, reinforcing the brand&#39;s innovative position in the visual solutions space.</FadeInP>
            </CaseSection>

            {/* BEHIND THE SCENES */}
            <section className="mtf-bts-bleed">
                <div className="wrap">
                    <div className="mtf-film-frame">
                        <AutoplayVideo videoId="hQQsNDttplk" title="Meet the Finchers — Behind the scenes" />
                    </div>
                </div>
            </section>

            {/* NEXT PROJECT */}
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
