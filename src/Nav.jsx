import insta from "/icons/insta-icon.svg";
import mail from "/icons/mail-icon.svg";
import linkedin from "/icons/linkedin-icon.svg";
import "./css/nav.css";
import { getCopy } from "./i18n/copy";

const Nav = ({
  reveal = true,
  activeTab = "scene",
  exploreMode = false,
  locale = "fr",
  onLocaleChange,
  onEnterExplore,
}) => {
  const copy = getCopy(locale);

  return (
    <nav className={`navigation ${reveal ? "is-revealed" : ""}`}>
      <div className="nav-panel">
        <div className="nav-panel-left">
          <div className="nav-system-row">
            <p className="nav-system-label">{copy.nav.studioHud}</p>
            <span className="nav-system-line" aria-hidden="true" />
            <span className="nav-status-pill">
              <span className="nav-status-dot" />
              {copy.nav.meadowLive}
            </span>
          </div>

          <p className="nav-tagline">{copy.nav.tagline}</p>

          <div className="nav-tab-row" aria-label={copy.nav.navTabsAria}>
            <span
              className={`nav-tab ${activeTab === "scene" ? "is-active" : ""}`}
            >
              {copy.nav.scene}
            </span>
            <span
              className={`nav-tab ${activeTab === "quiz" ? "is-active" : ""}`}
            >
              {copy.nav.quiz}
            </span>
            <span className="nav-tab is-muted">{copy.nav.recommendation}</span>
          </div>
        </div>

        <div className="nav-panel-right">
          <div className="nav-controls-row">
            <div
              className="nav-locale-switch"
              role="group"
              aria-label={copy.nav.localeLabel}
            >
              <button
                type="button"
                className={`nav-locale-btn ${locale === "fr" ? "is-active" : ""}`}
                onClick={() => onLocaleChange?.("fr")}
                aria-pressed={locale === "fr"}
              >
                {copy.nav.localeFr}
              </button>
              <button
                type="button"
                className={`nav-locale-btn ${locale === "en" ? "is-active" : ""}`}
                onClick={() => onLocaleChange?.("en")}
                aria-pressed={locale === "en"}
              >
                {copy.nav.localeEn}
              </button>
            </div>

            {!exploreMode ? (
              <button
                type="button"
                className="nav-debug-link"
                onClick={onEnterExplore}
              >
                {copy.nav.exploreFields}
              </button>
            ) : null}
          </div>

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

          <div className="nav-foot-row">
            <span className="nav-foot-line" aria-hidden="true" />
            <p className="nav-mini-caption">{copy.nav.openChannels}</p>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
