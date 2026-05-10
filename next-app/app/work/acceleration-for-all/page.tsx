import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { CaseStudyShell } from "@/components/case-study/CaseStudyShell";
import { CaseHero } from "@/components/case-study/CaseHero";
import { CaseBleed } from "@/components/case-study/CaseBleed";
import { CaseSection } from "@/components/case-study/CaseSection";
import { RisingHeading } from "@/components/case-study/RisingHeading";

export const metadata: Metadata = {
    title: "Acceleration For All — ViewSonic × Hustle Fund · Hatch n Harvest",
    description:
        "A campaign, identity, and end-to-end experience for ViewSonic and Hustle Fund's joint accelerator — built to flatten the wall between watching and entering.",
};

const afaBrandVars = {
    "--afa-yellow": "#FFC200",
    "--afa-coral": "#FD6051",
    "--afa-white": "#FFFFFF",
    "--afa-paper": "#F0F4F7",
    "--afa-navy": "#1E2782",
    "--afa-red": "#990000",
    "--afa-purple-deep": "#9636A4",
    "--afa-teal": "#2FB2D6",
    "--afa-graphite": "#404555",
    "--afa-purple": "#6F59D8",
} as CSSProperties;

export default function AccelerationForAllPage() {
    return (
        <CaseStudyShell brandVars={afaBrandVars}>
            <CaseHero
                backLink={{ label: "All work", href: "../../#work" }}
                eyebrow="Campaign · 2021"
                title={<>Acceleration <em>For All.</em></>}
                kicker="A partnership campaign rebuilding the on-ramp to entrepreneurship — for everyone the old accelerator playbook left out."
                meta={[
                    { label: "Client", value: "ViewSonic × Hustle Fund" },
                    { label: "Scope", value: "Campaign · Identity · Microsite · Film · Social" },
                    { label: "Year", value: "2021" },
                    { label: "Reach", value: "6 regions, global launch from Silicon Valley" },
                ]}
            />

            <CaseBleed caption={{ title: "Campaign film · Acceleration For All.", meta: "Hero · 2021" }}>
                <iframe
                    src="https://www.youtube.com/embed/jUR5gdbGKjE?rel=0&modestbranding=1"
                    title="Acceleration For All — Campaign film"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                    loading="eager"
                />
            </CaseBleed>

            {/* THE PROBLEM */}
            <section className="problem">
                <div className="wrap">
                    <div className="problem-intro">
                        <RisingHeading as="h2">The Problem</RisingHeading>
                        <p>For too many aspiring entrepreneurs, access is the biggest barrier to success. Great ideas exist everywhere—but mentorship, funding, and startup networks are often concentrated within the elite circles of Silicon Valley. ViewSonic recognized that talented founders outside traditional tech hubs were being overlooked simply because they lacked the right connections or resources.</p>
                    </div>

                    <figure className="problem-graphic">
                        <img src="../../assets/work/acceleration-for-all/problem-build-future.jpg" alt="Acceleration For All campaign banner — coral background with three chevrons and the line 'Let's help build the future of work by redefining the future of entrepreneurship together.' next to ViewSonic × HUSTLE FUND lockup." loading="lazy" />
                    </figure>
                </div>
            </section>

            {/* THE SOLUTION (work-intro) */}
            <section className="work-intro">
                <div className="wrap">
                    <RisingHeading as="h2">The Solution</RisingHeading>
                    <p>To help level the playing field, ViewSonic launched Acceleration — a program designed to support emerging entrepreneurs with the tools, exposure, and partnerships needed to grow their ideas. By creating opportunities outside the traditional accelerator model, the campaign focused on empowering underrepresented founders through collaboration, mentorship, technology, and funding support. The initiative transformed ViewSonic from a technology brand into a catalyst for innovation and opportunity.</p>
                </div>
            </section>

            {/* WORK SECTIONS */}
            <div className="wrap">

                {/* The Manifesto — film embed */}
                <section className="work-section solution-manifesto">
                    <div className="film-frame">
                        <iframe
                            src="https://www.youtube.com/embed/xfx9rrUjCCA?rel=0&modestbranding=1"
                            title="Acceleration For All — Manifesto film"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                            referrerPolicy="strict-origin-when-cross-origin"
                            allowFullScreen
                            loading="lazy"
                        />
                    </div>
                </section>

                {/* The Identity */}
                <section className="work-section">
                    <div className="work-section-head">
                        <h3>An identity</h3>
                        <p>The lockup turns the &#34;A&#34; of <em>Acceleration</em> into a chevron — the same forward-pointing mark that drives the rest of the system. A handwritten <span className="script">for all</span> reframes the year-stamp as a promise. Built to read at any scale, on any surface, in any of six regions.</p>
                    </div>

                    {/* Lockup variations */}
                    <div className="lockup-variants">
                        <figure>
                            <div className="variant-card is-positive">
                                <img src="../../assets/work/acceleration-for-all/lockup-light.svg" alt="Primary lockup, positive — black on white." loading="lazy" />
                            </div>
                        </figure>
                        <figure>
                            <div className="variant-card is-negative">
                                <img src="../../assets/work/acceleration-for-all/lockup-dark.svg" alt="Primary lockup, negative — white on black." loading="lazy" />
                            </div>
                        </figure>
                    </div>

                    {/* Key visual */}
                    <div className="hero-stage">
                        <figure className="block-full identity-kv">
                            <img src="../../assets/work/acceleration-for-all/kv-inside-scoop.png" alt="Acceleration For All campaign hero — three founder portraits in coloured chevrons next to the line: 'The inside scoop on what makes a startup stand out.'" loading="lazy" />
                        </figure>
                    </div>

                    {/* Brand color & Mnemonic system */}
                    <div className="id-subhead">Brand color &amp; Mnemonic system</div>
                    <div className="mnemonic-grid">
                        <figure>
                            <img src="../../assets/work/acceleration-for-all/mnemonic-3.svg" alt="Brand mnemonic — diamond composition built from chevrons in coral, navy, yellow, and paper." loading="lazy" />
                        </figure>
                        <figure>
                            <img src="../../assets/work/acceleration-for-all/mnemonic-2.svg" alt="Brand mnemonic — full chevron composition spanning coral, navy, purple, yellow, paper, and graphite." loading="lazy" />
                        </figure>
                        <figure>
                            <img src="../../assets/work/acceleration-for-all/mnemonic-4.svg" alt="Brand mnemonic — square chevron composition spanning the full six-tone palette." loading="lazy" />
                        </figure>
                        <figure className="is-half">
                            <img src="../../assets/work/acceleration-for-all/mnemonic-1.svg" alt="Brand mnemonic — three chevrons in a row: purple, graphite, coral." loading="lazy" />
                        </figure>
                        <figure className="is-half">
                            <img src="../../assets/work/acceleration-for-all/mnemonic-5.svg" alt="Brand mnemonic — four chevrons in a row: navy, graphite, coral, yellow." loading="lazy" />
                        </figure>
                        <figure className="is-wide palette-strip" aria-label="Full ten-tone palette">
                            <div className="palette-strip-inner">
                                <div className="swatch" style={{ background: "var(--afa-yellow)", color: "var(--afa-navy)" }}>
                                    <span className="swatch-name">Yellow</span>
                                    <span className="swatch-hex">#FFC200</span>
                                </div>
                                <div className="swatch" style={{ background: "var(--afa-coral)", color: "#fff" }}>
                                    <span className="swatch-name">Coral</span>
                                    <span className="swatch-hex">#FD6051</span>
                                </div>
                                <div className="swatch" style={{ background: "var(--afa-white)", color: "var(--afa-navy)", boxShadow: "inset 0 0 0 1px var(--line)" }}>
                                    <span className="swatch-name">White</span>
                                    <span className="swatch-hex">#FFFFFF</span>
                                </div>
                                <div className="swatch" style={{ background: "var(--afa-paper)", color: "var(--afa-navy)" }}>
                                    <span className="swatch-name">Paper</span>
                                    <span className="swatch-hex">#F0F4F7</span>
                                </div>
                                <div className="swatch" style={{ background: "var(--afa-navy)", color: "#fff" }}>
                                    <span className="swatch-name">Navy</span>
                                    <span className="swatch-hex">#1E2782</span>
                                </div>
                                <div className="swatch" style={{ background: "var(--afa-red)", color: "#fff" }}>
                                    <span className="swatch-name">Deep Red</span>
                                    <span className="swatch-hex">#990000</span>
                                </div>
                                <div className="swatch" style={{ background: "var(--afa-teal)", color: "#fff" }}>
                                    <span className="swatch-name">Teal</span>
                                    <span className="swatch-hex">#2FB2D6</span>
                                </div>
                                <div className="swatch" style={{ background: "var(--afa-purple)", color: "#fff" }}>
                                    <span className="swatch-name">Lilac</span>
                                    <span className="swatch-hex">#6F59D8</span>
                                </div>
                                <div className="swatch" style={{ background: "var(--afa-purple-deep)", color: "#fff" }}>
                                    <span className="swatch-name">Purple</span>
                                    <span className="swatch-hex">#9636A4</span>
                                </div>
                                <div className="swatch" style={{ background: "var(--afa-graphite)", color: "#fff" }}>
                                    <span className="swatch-name">Graphite</span>
                                    <span className="swatch-hex">#404555</span>
                                </div>
                            </div>
                        </figure>
                    </div>

                    {/* Typography + Apparel */}
                    <div className="identity-foot">
                        <div className="type-stack">
                            <div className="type-eyebrow">Typography</div>
                            <div className="type-sub-eyebrow">Display family</div>
                            <div className="type-row">
                                <div className="type-sample" style={{ fontWeight: 700, fontSize: "clamp(40px, 6vw, 60px)" }}>Open Sans</div>
                            </div>
                            <div className="type-row">
                                <div className="type-sample" style={{ fontWeight: 700, fontSize: "clamp(32px, 4.6vw, 48px)" }}>Heading 2 — Bold 48</div>
                            </div>
                            <div className="type-row">
                                <div className="type-sample" style={{ fontWeight: 600, fontSize: "clamp(24px, 3vw, 34px)" }}>Heading 3 — SemiBold 34</div>
                            </div>
                            <div className="type-row">
                                <div className="type-sample" style={{ fontWeight: 600, fontSize: "clamp(18px, 2.2vw, 24px)" }}>Heading 4 — SemiBold 24</div>
                            </div>
                            <div className="type-row">
                                <div className="type-sample" style={{ fontWeight: 400, fontSize: "16px" }}>Body — Regular 16.</div>
                            </div>
                        </div>

                        <div className="apparel-grid">
                            <figure>
                                <img src="../../assets/work/acceleration-for-all/tshirt-coral.jpg" alt="Event t-shirt — coral colorway, white lockup with yellow chevron." loading="lazy" />
                            </figure>
                            <figure>
                                <img src="../../assets/work/acceleration-for-all/tshirt-navy.jpg" alt="Event t-shirt — navy colorway." loading="lazy" />
                            </figure>
                            <figure>
                                <img src="../../assets/work/acceleration-for-all/tshirt-black.jpg" alt="Event t-shirt — black colorway." loading="lazy" />
                            </figure>
                        </div>
                    </div>
                </section>

                {/* Social media — campaign cadence */}
                <section className="work-section solution-social">
                    <div className="social-stack">
                        <figure className="social-card is-wide">
                            <img src="../../assets/work/acceleration-for-all/social-grid-21.jpg" alt="RSVP card — 'The Acceleration For All Awards · January 12th · 5pm PT.'" loading="lazy" />
                        </figure>

                        <div className="social-row-2">
                            <figure className="social-card is-square">
                                <img src="../../assets/work/acceleration-for-all/social-grid-6.jpg" alt="Founder spotlight — Eric Bahn, Co-Founder & GP, Hustle Fund." loading="lazy" />
                            </figure>
                            <figure className="social-card is-square">
                                <img src="../../assets/work/acceleration-for-all/pitch-us-now.gif" alt="Animated submission prompt — 'Submissions are open. Pitch us now.'" loading="lazy" />
                            </figure>
                        </div>

                        <div className="social-row-6">
                            <figure className="social-card is-small">
                                <img src="../../assets/work/acceleration-for-all/social-grid-9.jpg" alt="LinkedIn card — 'The inside scoop on what makes a startup stand out.'" loading="lazy" />
                            </figure>
                            <figure className="social-card is-small">
                                <img src="../../assets/work/acceleration-for-all/social-grid-10.jpg" alt="Submission countdown — 'Submissions close in 4 days.'" loading="lazy" />
                            </figure>
                            <figure className="social-card is-small">
                                <img src="../../assets/work/acceleration-for-all/social-grid-17.jpg" alt="Top 100 announcement — 'Introducing the AFA Top 100 Startups.'" loading="lazy" />
                            </figure>
                            <figure className="social-card is-small">
                                <img src="../../assets/work/acceleration-for-all/social-grid-18.jpg" alt="Top 20 reveal — 'Meet the Top 20 and pick your #1 — Vote Now.'" loading="lazy" />
                            </figure>
                            <figure className="social-card is-small">
                                <img src="../../assets/work/acceleration-for-all/social-grid-19-01.jpg" alt="Top 20 announcement — 'Meet the AFA Top 20 Finalists.'" loading="lazy" />
                            </figure>
                            <figure className="social-card is-small">
                                <img src="../../assets/work/acceleration-for-all/social-grid-20.jpg" alt="People's Choice vote prompt — 'You be the VC. Vote Now.'" loading="lazy" />
                            </figure>
                        </div>

                        <figure className="social-card is-wide">
                            <img src="../../assets/work/acceleration-for-all/social-grid-22.jpg" alt="Countdown — 'Just one more sleep till #TheAffies.'" loading="lazy" />
                        </figure>
                    </div>
                </section>

            </div>

            {/* RESULTS */}
            <section className="outcome results">
                <div className="wrap">
                    <div className="results-intro">
                        <RisingHeading as="h2">The Results</RisingHeading>
                        <p className="results-lead">Acceleration For All helped position ViewSonic as a brand invested not just in products, but in people and progress. The campaign generated meaningful engagement within entrepreneurial communities, strengthened brand perception, and created authentic connections with the next generation of innovators. Most importantly, it opened doors for founders who otherwise may never have had access to the startup ecosystem.</p>
                    </div>

                    <figure className="results-top5">
                        <img src="../../assets/work/acceleration-for-all/results-top5.png" alt="Top 5 reveal — Acceleration For All 2022 award categories: Best B2B, Best Consumer, Best Frontier, Best Creator, People's Choice." loading="lazy" />
                    </figure>

                    <div className="gallery-five">
                        <figure>
                            <img src="../../assets/work/acceleration-for-all/finalist-before-noon.png" alt="Finalist — Before Noon" loading="lazy" />
                            <figcaption className="finalist-name">Before Noon<span className="finalist-cat">Tiny Business</span></figcaption>
                        </figure>
                        <figure>
                            <img src="../../assets/work/acceleration-for-all/finalist-colab.png" alt="Finalist — Co.Lab" loading="lazy" />
                            <figcaption className="finalist-name">Co.Lab<span className="finalist-cat">Innovation</span></figcaption>
                        </figure>
                        <figure>
                            <img src="../../assets/work/acceleration-for-all/finalist-mi-terror.png" alt="Finalist — Mi Terror" loading="lazy" />
                            <figcaption className="finalist-name">Mi Terror<span className="finalist-cat">Social Enterprise</span></figcaption>
                        </figure>
                        <figure>
                            <img src="../../assets/work/acceleration-for-all/finalist-roboamp.png" alt="Finalist — ROBOAMP" loading="lazy" />
                            <figcaption className="finalist-name">ROBOAMP<span className="finalist-cat">B2B</span></figcaption>
                        </figure>
                        <figure>
                            <img src="../../assets/work/acceleration-for-all/finalist-telecalm.png" alt="Finalist — TeleCalm" loading="lazy" />
                            <figcaption className="finalist-name">TeleCalm<span className="finalist-cat">People&#39;s Choice</span></figcaption>
                        </figure>
                    </div>

                    <div className="results-metrics">
                        <h3 className="results-metrics-head">Five categories,<br />Five hustles.</h3>
                        <div className="metrics-row">
                            <div className="metric">
                                <div className="metric-num">1,500+</div>
                                <div className="metric-label">Pitches from over 30 industries around the world</div>
                            </div>
                            <div className="metric">
                                <div className="metric-num">5</div>
                                <div className="metric-label">Award categories — Best B2B, Best Consumer, Best Creator, Best Frontier, People&#39;s Choice</div>
                            </div>
                            <div className="metric">
                                <div className="metric-num">Live</div>
                                <div className="metric-label">Award ceremony hosted by comedian Irene Tu</div>
                            </div>
                        </div>
                    </div>
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
