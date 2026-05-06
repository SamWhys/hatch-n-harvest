export function Footer() {
  return (
    <footer>
      <div className="wrap">
        <div className="footer-lockup">
          <a href="#top" aria-label="Hatch n Harvest — home">
            <img
              className="logo-icon"
              src="assets/brand/icon-main.svg"
              alt=""
              aria-hidden="true"
            />
            <img
              className="logo-wordmark"
              src="assets/brand/wordmark.svg"
              alt="Hatch n Harvest"
            />
          </a>
        </div>
      </div>
      <div className="wrap footer-inner">
        <div>© 2026 Hatch &amp; Harvest · Taipei, Taiwan</div>
        <nav className="footer-links" aria-label="Footer">
          <a href="mailto:hello@hatchnharvest.studio">Email</a>
          <a href="#">Instagram</a>
          <a href="#">LinkedIn</a>
          <a href="#">Are.na</a>
        </nav>
      </div>
    </footer>
  );
}
