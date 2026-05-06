export function Nav() {
  return (
    <header className="nav">
      <div className="wrap nav-inner">
        <a href="#top" className="logo" aria-label="Hatch n Harvest — home">
          <img className="logo-icon" src="assets/brand/icon-main.svg" alt="" aria-hidden="true" />
          <img className="logo-wordmark" src="assets/brand/wordmark.svg" alt="Hatch n Harvest" />
        </a>
        <nav className="nav-links" aria-label="Primary">
          <a href="#work">Work</a>
          <a href="#process">Process</a>
          <a href="#studio">Studio</a>
        </nav>
        <a href="#contact" className="nav-cta">Start a project →</a>
      </div>
    </header>
  );
}
