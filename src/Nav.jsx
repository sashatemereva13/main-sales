import insta from "/icons/insta-icon.svg";
import mail from "/icons/mail-icon.svg";
import linkedin from "/icons/linkedin-icon.svg";
import "./css/nav.css";
import { getCopy } from "./i18n/copy";

const LANDING_LINKS = [
  { label: "Works", href: "/Works" },
  { label: "Process", href: "/process" },
  { label: "Philosophy", href: "/philosophy" },
  { label: "Contact", href: "/contact", subtle: true },
];

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
  const showConfiguratorNav = activeTab === "configurator";
  const showDetailNav = showConfiguratorNav || activeTab === "quiz";

  return (
    <nav
      className={`navigation ${reveal ? "is-revealed" : ""} ${showDetailNav ? "is-quiz-nav" : ""} ${showConfiguratorNav ? "is-builder-surface" : ""}`}
    >
      <div className="nav-panel">
        <div className="nav-panel-center">
          {showDetailNav ? (
            <>
              <div className="nav-tab-row" aria-label={copy.nav.navTabsAria}>
                <span className="nav-tab is-active">
                  {showConfiguratorNav ? copy.nav.configurator : copy.nav.quiz}
                </span>
                <span className="nav-tab is-muted">
                  {showConfiguratorNav
                    ? copy.nav.websiteLab
                    : copy.nav.recommendation}
                </span>
              </div>
            </>
          ) : (
            <>
              {reveal ? (
                <div className="nav-link-row" aria-label="Site navigation">
                  {LANDING_LINKS.map((link) => (
                    <a
                      key={link.href}
                      className={`nav-link-button ${link.subtle ? "is-subtle" : ""}`}
                      href={link.href}
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              ) : null}
            </>
          )}

          {!showDetailNav && showPrimaryCta ? (
            <div className="nav-cta-row">
              <button
                type="button"
                className="nav-primary-button"
                onClick={onPrimaryCta}
              >
                <span className="nav-primary-button-label">
                  {primaryCtaLabel}
                </span>
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
            {showDetailNav ? (
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
              <span
                className={`nav-locale-pill ${locale === "en" ? "is-en" : "is-fr"}`}
                aria-hidden="true"
              />
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

          <div className="nav-brand-block">
            <a className="nav-brand-mark" href="/">
              {/* <span className="nav-brand-monogram">AC</span> */}
              <span className="nav-brand-copy">
                <span className="nav-brand-name">
                  {title || "Amber Composition Lab"}
                </span>
                <span className="nav-brand-tag">
                  {showDetailNav ? copy.nav.websiteLab : copy.nav.tagline}
                </span>
              </span>
            </a>
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
