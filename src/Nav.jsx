import "./css/nav.css";
import { getCopy, getLocaleOptions, normalizeLocale } from "./i18n/copy";

export const NAV_SOCIAL_LINKS = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/13xsasha/",
  },
  {
    label: "Email",
    href: "mailto:sashatemereva13@gmail.com",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/sashatemereva/",
  },
  {
    label: "Awwwards",
    href: "https://www.awwwards.com/sasha-temereva-13/",
  },
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
  const currentLocale = normalizeLocale(locale);
  const copy = getCopy(currentLocale);
  const localeOptions = getLocaleOptions(copy);
  const showConfiguratorNav = activeTab === "configurator";
  const showDetailNav = showConfiguratorNav || activeTab === "quiz";
  const showIntroNav = !reveal && activeTab === "scene";
  const showHeroNav = reveal && !showDetailNav;
  const showLocaleSwitch = !showDetailNav && !showIntroNav;

  return (
    <nav
      className={`navigation ${reveal ? "is-revealed" : ""} ${showIntroNav ? "is-intro-surface" : ""} ${showHeroNav ? "is-hero-surface" : ""} ${showDetailNav ? "is-quiz-nav" : ""} ${showConfiguratorNav ? "is-builder-surface" : ""}`}
    >
      <div className="nav-panel">
        <div className="nav-brand-block" aria-label="amber composition">
          <span className="nav-brand-mark">amber composition</span>
        </div>

        <div className="nav-panel-center">
          {showIntroNav ? (
            <div className="nav-intro-stack">
              <p className="nav-intro-kicker">{copy.intro.discoverySession}</p>
              <div className="nav-intro-pills" aria-label={copy.nav.openChannels}>
                <span className="nav-intro-pill">{copy.nav.studioHud}</span>
                <span className="nav-intro-pill">{copy.nav.meadowLive}</span>
              </div>
              <p className="nav-intro-hint">{copy.nav.tagline}</p>
            </div>
          ) : null}

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
              {showConfiguratorNav ? (
                <p className="nav-context-note">{copy.configurator.subtitle}</p>
              ) : (
                <p className="nav-context-note">{copy.nav.tagline}</p>
              )}
            </>
          ) : (
            <></>
          )}

          {!showDetailNav && (title || subtitle || showPrimaryCta) ? (
            <div className="nav-decision-block">
              {title ? <p className="nav-title">{title}</p> : null}
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
            {showLocaleSwitch ? (
              <div
                className="nav-locale-switch"
                role="group"
                aria-label={copy.nav.localeLabel}
              >
                <span
                  className={`nav-locale-pill ${currentLocale === "en" ? "is-en" : "is-fr"}`}
                  aria-hidden="true"
                />
                {localeOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={`nav-locale-btn ${currentLocale === option.value ? "is-active" : ""}`}
                    onClick={() => onLocaleChange?.(option.value)}
                    aria-pressed={currentLocale === option.value}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
