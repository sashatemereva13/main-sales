import insta from "/icons/insta-icon.svg";
import mail from "/icons/mail-icon.svg";
import linkedin from "/icons/linkedin-icon.svg";
import "./css/nav.css";
import { getCopy } from "./i18n/copy";

const Nav = ({
  reveal = true,
  activeTab = "scene",
  locale = "fr",
  onLocaleChange,
  onBackToLanding,
  title,
  subtitle,
  showPrimaryCta = false,
  primaryCtaLabel,
  onPrimaryCta,
  ctaMeta,
}) => {
  const copy = getCopy(locale);
  const showQuizNav = activeTab === "quiz";

  return (
    <nav
      className={`navigation ${reveal ? "is-revealed" : ""} ${showQuizNav ? "is-quiz-nav" : ""}`}
    >
      <div className="nav-panel">
        <div className="nav-panel-left">
          {showQuizNav ? (
            <>
              <p className="nav-kicker">{copy.nav.quiz}</p>
              <div className="nav-tab-row" aria-label={copy.nav.navTabsAria}>
                <span className="nav-tab is-active">{copy.nav.quiz}</span>
                <span className="nav-tab is-muted">
                  {copy.nav.recommendation}
                </span>
              </div>
            </>
          ) : (
            <>
              {title ? <p className="nav-title">{title}</p> : null}
              <p className="nav-tagline">{copy.nav.tagline}</p>
              {subtitle ? <p className="nav-subtitle">{subtitle}</p> : null}
            </>
          )}
          {!showQuizNav && showPrimaryCta ? (
            <div className="nav-cta-row">
              <button
                type="button"
                className="nav-primary-button"
                onClick={onPrimaryCta}
              >
                <span className="nav-primary-button-label">{primaryCtaLabel}</span>
                <span className="nav-primary-button-arrow" aria-hidden="true">
                  {"->"}
                </span>
              </button>
              {ctaMeta ? <p className="nav-cta-meta">{ctaMeta}</p> : null}
            </div>
          ) : null}
        </div>

        <div className="nav-panel-right">
          <div className="nav-controls-row">
            {showQuizNav ? (
              <button
                type="button"
                className="nav-secondary-button"
                onClick={onBackToLanding}
              >
                {copy.quizNav.back}
              </button>
            ) : null}
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
        </div>
      </div>
    </nav>
  );
};

export default Nav;
