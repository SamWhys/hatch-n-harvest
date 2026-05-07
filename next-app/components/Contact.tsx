export function Contact() {
  return (
    <section className="contact" id="contact">
      <div className="wrap">
        <span className="script">Have a seed of an idea?</span>
        <h2>For more info about us, click here.</h2>
        <a className="contact-email" href="mailto:hello@hatchnharvest.studio">
          hello@hatchnharvest.studio
        </a>
        <div className="contact-note">
          Typical reply time: two working days · We&apos;ll tell you honestly if we&apos;re not the right fit.
        </div>

        <img
          className="contact-decor left"
          src="assets/brand/brand-mnemonic-1.svg"
          alt=""
          aria-hidden="true"
        />
        <img
          className="contact-decor right"
          src="assets/brand/brand-mnemonic-4.svg"
          alt=""
          aria-hidden="true"
        />
      </div>
    </section>
  );
}
