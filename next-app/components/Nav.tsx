export function Nav({ homeHref = "" }: { homeHref?: string }) {
  return (
    <header className="nav">
      <div className="wrap nav-inner">
        <a href={`${homeHref}#top`} className="logo" aria-label="Hatch n Harvest — home">
          <img className="logo-icon" src={`${homeHref}assets/brand/icon-main.svg`} alt="" aria-hidden="true" />
          <img className="logo-wordmark" src={`${homeHref}assets/brand/wordmark.svg`} alt="Hatch n Harvest" />
        </a>
        <nav className="nav-links" aria-label="Primary">
          <a href={`${homeHref}#work`}>Work</a>
          <a href={`${homeHref}#process`}>Process</a>
          <a href={`${homeHref}#studio`}>Studio</a>
        </nav>
        <a href={`${homeHref}#contact`} className="nav-cta">Start a project →</a>
      </div>
    </header>
  );
}
