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
            </div>
        </CaseStudyShell>
    );
}
