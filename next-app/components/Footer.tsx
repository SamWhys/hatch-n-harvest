export function Footer({ homeHref = "" }: { homeHref?: string }) {
  return (
    <footer>
      <div className="wrap">
        <div className="footer-lockup">
          <a href={`${homeHref}#top`} aria-label="Hatch n Harvest — home">
            <img
              className="logo-icon"
              src={`${homeHref}assets/brand/icon-main.svg`}
              alt=""
              aria-hidden="true"
            />
            <img
              className="logo-wordmark"
              src={`${homeHref}assets/brand/wordmark.svg`}
              alt="Hatch n Harvest"
            />
          </a>
        </div>
      </div>
      <div className="wrap footer-inner">
        <div>© 2026 Hatch &amp; Harvest</div>
      </div>
    </footer>
  );
}
