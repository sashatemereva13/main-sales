import "./css/nav.css";
import { getCopy } from "./i18n/copy";

const Nav = ({
  reveal = true,
  activeTab = "scene",
  locale = "fr",
  onLocaleChange,
  onBackToLanding,
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
        <div className="nav-brand-block" aria-label="amber composition">
          <span className="nav-brand-mark">amber composition</span>
        </div>

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
            <></>
          )}

          {!showDetailNav && (subtitle || showPrimaryCta) ? (
            <div className="nav-decision-block">
              {subtitle ? <p className="nav-subtitle">{subtitle}</p> : null}

              {showPrimaryCta ? (
                <div className="nav-cta-row">
                  <button
                    type="button"
                    className="nav-primary-button"
                    onClick={onPrimaryCta}
                  >
                    <span className="nav-primary-button-label">
                      {primaryCtaLabel}
                    </span>
                    <span
                      className="nav-primary-button-arrow"
                      aria-hidden="true"
                    >
                      {"->"}
                    </span>
                  </button>
                  {ctaMeta ? <p className="nav-cta-meta">{ctaMeta}</p> : null}
                </div>
              ) : null}
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
            {!showDetailNav ? (
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
            ) : null}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
