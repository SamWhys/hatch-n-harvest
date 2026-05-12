import { RisingHeading } from "./case-study/RisingHeading";
import { FadeInP } from "./case-study/FadeInP";

export function Studio() {
  return (
    <section className="studio" id="studio">
      <div className="wrap studio-inner">
        <div className="studio-copy">
          <RisingHeading as="h2">
            An Ad Agency with <em>Decades</em> of Experience
          </RisingHeading>
          <FadeInP>
            We&apos;re the best of both worlds — the depth and dedication of an in-house marketing department, with the independence and fresh eyes of an outside agency.
          </FadeInP>
          <FadeInP>
            We bring decades of marketing experience we want to share with other brands. We came up through the high-tech world, but we&apos;re brand people. Not tech people.
          </FadeInP>
          <FadeInP>
            Travel. Fast food. Cars. You name it, we&apos;ve done it. And we&apos;re ready to work on your business and your brand.
          </FadeInP>
          <div className="studio-stats">
            <div>
              <div className="stat-num">Decades</div>
              <div className="stat-label">Of marketing experience</div>
            </div>
            <div>
              <div className="stat-num">Any</div>
              <div className="stat-label">Category. Any challenge.</div>
            </div>
            <div>
              <div className="stat-num">2 → 1</div>
              <div className="stat-label">In-house & agency, one team</div>
            </div>
          </div>
        </div>
        <div className="studio-image">
          <img
            src="assets/team/hnh-team-shot.jpg"
            alt="The Hatch & Harvest team."
            loading="lazy"
          />
          <div className="sticker">Brand people. Not tech people.</div>
        </div>
      </div>
    </section>
  );
}
