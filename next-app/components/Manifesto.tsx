const beliefs = [
  {
    num: "01",
    title: "Big ideas start with real-world experience.",
    body: "Strategy earns its keep when it's tested in the wild — in shelves, screens, streets, and stores.",
  },
  {
    num: "02",
    title: "Strategy without craft is just a deck.",
    body: "The thinking and the making are the same job. We pass no idea along an assembly line.",
  },
  {
    num: "03",
    title: "Your audience isn't everyone.",
    body: "A brand is a bet on the people you'd stake the farm on. Name them. Build for them.",
  },
  {
    num: "04",
    title: "Experience earns the room.",
    body: "Decades of brand work across categories means we've seen what lasts — and what was never going to.",
  },
];

export function Manifesto() {
  return (
    <section className="manifesto">
      <img
        className="section-decor"
        src="assets/brand/mnemonic-h-1.png"
        alt=""
        aria-hidden="true"
      />
      <div className="wrap">
        <div className="eyebrow">What moves people</div>
        <h2>
          People don&apos;t buy marketing strategies. They buy{" "}
          <em>connection, belonging, meaning.</em>
        </h2>
        <p className="manifesto-lead">
          In the end, that&apos;s what moves people. Big ideas are just the vehicle — emotion is the engine.
        </p>

        <div className="beliefs">
          {beliefs.map((b) => (
            <div className="belief" key={b.num}>
              <span className="num">{b.num}</span>
              <h4>{b.title}</h4>
              <p>{b.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
