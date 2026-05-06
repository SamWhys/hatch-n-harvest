export function Studio() {
  return (
    <section className="studio" id="studio">
      <div className="wrap studio-inner">
        <div className="studio-copy">
          <div className="eyebrow">The studio</div>
          <h2>
            An Ad Agency with <em>Decades</em> of Experience
          </h2>
          <p>
            We&apos;re the best of both worlds — the depth and dedication of an in-house marketing department, with the independence and fresh eyes of an outside agency.
          </p>
          <p>
            We bring decades of marketing experience we want to share with other brands. We came up through the high-tech world, but we&apos;re brand people. Not tech people.
          </p>
          <p>
            Travel. Fast food. Cars. You name it, we&apos;ve done it. And we&apos;re ready to work on your business and your brand.
          </p>
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
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80"
            alt="A bright studio workspace with wooden desks and plants"
            loading="lazy"
          />
          <div className="sticker">Brand people. Not tech people.</div>
        </div>
      </div>
    </section>
  );
}
