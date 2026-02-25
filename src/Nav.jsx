import insta from "/icons/insta-icon.svg";
import mail from "/icons/mail-icon.svg";
import linkedin from "/icons/linkedin-icon.svg";
import "./css/nav.css";

const Nav = ({ reveal = true, activeTab = "scene", debugOrbit = false }) => {
  const debugHref =
    typeof window !== "undefined"
      ? debugOrbit
        ? window.location.pathname
        : `${window.location.pathname}?debugCamera=1`
      : "/?debugCamera=1";

  return (
    <nav className={`navigation ${reveal ? "is-revealed" : ""}`}>
      <div className="nav-panel">
        <div className="nav-panel-left">
          <div className="nav-system-row">
            <p className="nav-system-label">Studio HUD</p>
            <span className="nav-status-pill">
              <span className="nav-status-dot" />
              Meadow Live
            </span>
          </div>

          <p className="nav-tagline">Les experiences digitales personnalisée</p>

          <div className="nav-tab-row" aria-label="Navigation tabs">
            <span
              className={`nav-tab ${activeTab === "scene" ? "is-active" : ""}`}
            >
              Scene
            </span>
            <span
              className={`nav-tab ${activeTab === "quiz" ? "is-active" : ""}`}
            >
              Quiz
            </span>
            <span className="nav-tab is-muted">Recommendation</span>
          </div>
        </div>

        <div className="nav-panel-right">
          <a className="nav-debug-link" href={debugHref}>
            {debugOrbit ? "Exit Debug Mode" : "Enter Debug Mode"}
          </a>

          <div className="navLinks">
            <a
              href="https://www.instagram.com/13xsasha/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <img src={insta} alt="" />
            </a>

            <a href="mailto:sashatemereva13@gmail.com" aria-label="Email">
              <img src={mail} alt="" />
            </a>

            <a
              href="https://www.linkedin.com/in/sashatemereva/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
            >
              <img src={linkedin} alt="" />
            </a>
          </div>

          <p className="nav-mini-caption">Open channels</p>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
