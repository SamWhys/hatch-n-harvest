import { RisingHeading } from "./case-study/RisingHeading";
import { FadeInP } from "./case-study/FadeInP";

export function Studio() {
  return (
    <section className="studio" id="studio">
      <div className="wrap studio-inner">
        <div className="studio-copy">
          <RisingHeading as="h2">
            We&apos;re an ad agency with <em>decades</em> of marketing experience.
          </RisingHeading>
          <FadeInP>
            Worked on all sorts of brands. And now, we&apos;re ready to work on yours.
          </FadeInP>
        </div>
        <div className="studio-image">
          <img
            src="assets/team/hnh-team-shot.jpg"
            alt="The Hatch & Harvest team."
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}
