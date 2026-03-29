import { Suspense, useEffect, useMemo, useState } from "react";
import { lazy } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Nav, { NAV_SOCIAL_LINKS } from "./Nav";
import "./css/intro.css";
import LandingScene from "./scene/LandingScene";
import { usePerformanceProfile } from "./scene/hooks/usePerformanceProfile";
import {
  WHITE_PAVILION_WORLD_POSITION,
  WHITE_PAVILION_LOOK_AT_POSITION,
} from "./scene/pavilion";
import {
  DEFAULT_LOCALE,
  getCopy,
  getLocaleOptions,
  normalizeLocale,
} from "./i18n/copy";

const Configurator = lazy(
  () => import("./components/configurator/Configurator"),
);

const HERO_FRAME_SECTION_IDS = [
  "builder",
  "vision",
  "expertise",
  "experience",
  "contact",
];
const HERO_VISION_FAN_LINE_COUNT = 18;
const SCENE_WALK_POINT_IDS = [
  "overview",
  "pavilion",
  "garden",
  "pond",
  "skyline",
];

function createHeroVisionPaths() {
  const spanStart = 60;
  const spanEnd = 260;
  const centerX = 336;
  const centerY = 172;

  return Array.from({ length: HERO_VISION_FAN_LINE_COUNT }, (_, index) => {
    const ratio =
      HERO_VISION_FAN_LINE_COUNT <= 1
        ? 0
        : index / (HERO_VISION_FAN_LINE_COUNT - 1);
    const fromY = spanStart + (spanEnd - spanStart) * ratio;
    const controlX = 176;
    const controlY = fromY * 0.94 + 14;

    return {
      id: `hero-vision-line-${index}`,
      d: `M 34 ${fromY} Q ${controlX} ${controlY} ${centerX} ${centerY}`,
    };
  });
}

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const performanceProfile = usePerformanceProfile();
  const [locale, setLocale] = useState(() => {
    if (typeof window === "undefined") return DEFAULT_LOCALE;
    const saved = window.localStorage.getItem("site-locale");
    return normalizeLocale(saved);
  });
  const [cameraTarget, setCameraTarget] = useState([0, 10.6, 46]);
  const [cameraLookAt, setCameraLookAt] = useState(
    WHITE_PAVILION_LOOK_AT_POSITION,
  );
  const [cameraIntroDone, setCameraIntroDone] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [activeHeroSection, setActiveHeroSection] = useState("vision");
  const [isHeroCollapsed, setIsHeroCollapsed] = useState(false);
  const [activeSceneWalkPoint, setActiveSceneWalkPoint] = useState("overview");
  const [webglLost, setWebglLost] = useState(false);
  const [sceneResetToken, setSceneResetToken] = useState(0);

  const landingCameraTarget = [0, 8.6, 80];
  const introCameraStart = [-90, 80, 220];
  const introCameraDuration = 5.2;
  const introLookAtEnd = WHITE_PAVILION_LOOK_AT_POSITION;
  const introLookAtStart = [
    WHITE_PAVILION_LOOK_AT_POSITION[0],
    WHITE_PAVILION_LOOK_AT_POSITION[1] + 56,
    WHITE_PAVILION_LOOK_AT_POSITION[2],
  ];
  const introOrbitTurns = 1;
  const introOrbitStart = 0;
  const introOrbitUntil = 0.82;

  const isLabRoute = location.pathname === "/lab";
  const isConfiguratorActive = isLabRoute;
  const showIntroSequence = !cameraIntroDone && !isConfiguratorActive;
  const showHeroFrame =
    !isLabRoute && cameraIntroDone && showWelcome && !isConfiguratorActive;
  const showHeroShell = showHeroFrame && !isHeroCollapsed;
  const showHeroBackControl = showHeroFrame && isHeroCollapsed;
  const copy = getCopy(locale);
  const localeOptions = getLocaleOptions(copy);
  const heroFrameCopy = copy.intro.heroFrame;
  const heroFrameControls = heroFrameCopy?.controls ?? {
    scene: "scene",
    back: "back",
    walkAria: "Scene walk points",
  };
  const heroFrameWalkLabels = heroFrameCopy?.walkPoints ?? {
    overview: "overview",
    pavilion: "pavilion",
    garden: "garden",
    pond: "pond",
    skyline: "skyline",
  };
  const heroFrameSideNav = heroFrameCopy?.sideNav ?? [];
  const heroFrameSocials = heroFrameCopy?.socials ?? NAV_SOCIAL_LINKS;
  const heroFrameSectionsCopy = heroFrameCopy?.sections ?? {
    builder: {
      kicker: "Website Builder",
      title: "Build your website directly inside the hero frame",
      lead: "Compose structure, style, and functionality with the same system used in the full lab.",
      points: [
        "Live modular selection",
        "Category and feature filtering",
        "Instant estimate and summary",
      ],
      cta: "Open full builder",
    },
    vision: {
      kicker: "Vision",
      title: "I translate vision into design",
      lead: "I convert strategy and intent into geometric systems: structure, rhythm, and clear visual direction.",
      points: [
        "From idea to visual language",
        "From narrative to interaction",
        "From ambition to precise execution",
      ],
    },
    expertise: {
      kicker: "Expertise",
      title: "Design systems with strategic depth",
      lead: "Art direction, interaction, and product thinking aligned into one coherent digital identity.",
      points: [
        "Visual identity architecture",
        "Interactive motion language",
        "Conversion-aware UX decisions",
      ],
    },
    experience: {
      kicker: "Experience",
      title: "Immersive websites that feel intentional",
      lead: "Each screen is composed to guide attention, support storytelling, and create emotional clarity.",
      points: [
        "Cinematic first impressions",
        "Clear navigation hierarchies",
        "High-end responsive behavior",
      ],
    },
    contact: {
      kicker: "Contact",
      title: "Let’s shape the next digital chapter",
      lead: "Share your ambition and I will translate it into a clear, premium digital direction.",
      points: [
        "Project scoping in one session",
        "Creative + technical roadmap",
        "Fast first concept delivery",
      ],
    },
  };
  const heroFrameSections = HERO_FRAME_SECTION_IDS.map((id, index) => ({
    id,
    label: heroFrameSideNav[index] ?? id,
  }));
  const activeHeroSectionCopy =
    heroFrameSectionsCopy[activeHeroSection] ?? heroFrameSectionsCopy.builder;
  const heroVisionPaths = useMemo(() => createHeroVisionPaths(), []);
  const sceneWalkPoints = useMemo(
    () =>
      SCENE_WALK_POINT_IDS.map((id) => ({
        id,
        label: heroFrameWalkLabels[id] ?? id,
      })),
    [heroFrameWalkLabels],
  );

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = locale;
    }
    if (typeof window !== "undefined") {
      window.localStorage.setItem("site-locale", locale);
    }
  }, [locale]);

  useEffect(() => {
    if (isLabRoute) {
      setCameraIntroDone(true);
      setShowWelcome(false);
      setIsHeroCollapsed(false);
      return;
    }

    setCameraTarget(landingCameraTarget);
    setCameraLookAt(introLookAtEnd);
  }, [introLookAtEnd, isLabRoute]);

  const handleLocaleChange = (nextLocale) => {
    setLocale(normalizeLocale(nextLocale));
  };

  const handleHeroSectionSelect = (sectionId) => {
    setActiveHeroSection(sectionId);
  };

  const handleSceneWalkSelect = (pointId) => {
    const viewpoints = {
      overview: {
        target: landingCameraTarget,
        lookAt: introLookAtEnd,
      },
      pavilion: {
        target: [
          WHITE_PAVILION_WORLD_POSITION[0] + 18,
          WHITE_PAVILION_WORLD_POSITION[1] + 14.5,
          WHITE_PAVILION_WORLD_POSITION[2] + 36,
        ],
        lookAt: WHITE_PAVILION_LOOK_AT_POSITION,
      },
      garden: {
        target: [
          WHITE_PAVILION_WORLD_POSITION[0] - 24,
          WHITE_PAVILION_WORLD_POSITION[1] + 10.5,
          WHITE_PAVILION_WORLD_POSITION[2] + 18,
        ],
        lookAt: [
          WHITE_PAVILION_WORLD_POSITION[0] - 5,
          WHITE_PAVILION_WORLD_POSITION[1] + 7,
          WHITE_PAVILION_WORLD_POSITION[2] - 4,
        ],
      },
      pond: {
        target: [6, 8.2, 12],
        lookAt: [18, 2.2, -18],
      },
      skyline: {
        target: [
          WHITE_PAVILION_WORLD_POSITION[0] - 4,
          WHITE_PAVILION_WORLD_POSITION[1] + 25,
          WHITE_PAVILION_WORLD_POSITION[2] + 56,
        ],
        lookAt: [
          WHITE_PAVILION_WORLD_POSITION[0],
          WHITE_PAVILION_WORLD_POSITION[1] + 13,
          WHITE_PAVILION_WORLD_POSITION[2] - 2,
        ],
      },
    };

    const viewpoint = viewpoints[pointId] ?? viewpoints.overview;
    setActiveSceneWalkPoint(pointId);
    setCameraTarget(viewpoint.target);
    setCameraLookAt(viewpoint.lookAt);
  };

  const handleOpenLabRoute = () => {
    navigate("/lab");
  };

  const handleBackToLanding = () => {
    setShowWelcome(true);
    setCameraIntroDone(true);
    setActiveHeroSection("vision");
    setIsHeroCollapsed(false);
    setActiveSceneWalkPoint("overview");
    setCameraTarget(landingCameraTarget);
    setCameraLookAt(introLookAtEnd);
    navigate("/");
  };

  const handleSceneReload = () => {
    setWebglLost(false);
    setSceneResetToken((current) => current + 1);
  };

  return (
    <>
      {isLabRoute ? (
        <Nav
          reveal
          activeTab="configurator"
          locale={locale}
          onLocaleChange={handleLocaleChange}
          onBackToLanding={handleBackToLanding}
        />
      ) : null}

      <LandingScene
        resetToken={sceneResetToken}
        visible={!isLabRoute}
        profile={performanceProfile}
        isConfiguratorActive={isConfiguratorActive}
        cameraTarget={cameraTarget}
        cameraLookAt={cameraLookAt}
        cameraIntroDone={cameraIntroDone}
        introCameraStart={introCameraStart}
        introCameraDuration={introCameraDuration}
        introLookAtStart={introLookAtStart}
        introLookAtEnd={introLookAtEnd}
        introOrbitTurns={introOrbitTurns}
        introOrbitStart={introOrbitStart}
        introOrbitUntil={introOrbitUntil}
        landingCameraTarget={landingCameraTarget}
        onIntroComplete={() => {
          setCameraIntroDone(true);
          setShowWelcome(true);
          setIsHeroCollapsed(false);
          setActiveSceneWalkPoint("overview");
        }}
        onContextLost={() => {
          setWebglLost(true);
        }}
        onContextRestored={() => {
          setWebglLost(false);
        }}
      />

      {!isLabRoute ? (
        <div
          className={`intro-overlay ${cameraIntroDone ? "camera-finished" : ""} ${isConfiguratorActive ? "sequence-finished" : ""}`}
        >
          {showHeroShell ? (
            <>
              <button
                type="button"
                className="hero-overlay-toggle-button"
                onClick={() => {
                  setIsHeroCollapsed(true);
                  handleSceneWalkSelect("overview");
                }}
              >
                {heroFrameControls.scene}
              </button>

              <div
                className={`hero-frame-shell ${activeHeroSection === "builder" ? "is-builder-active" : ""}`}
              >
              <div className="hero-frame-brand" aria-hidden="true">
                amber composition
              </div>

              <div className="hero-frame-locale-rail">
                {localeOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={`hero-frame-locale-btn ${locale === option.value ? "is-active" : ""}`}
                    onClick={() => handleLocaleChange(option.value)}
                    aria-pressed={locale === option.value}
                  >
                    {option.label}
                  </button>
                ))}
              </div>

              <div className={`hero-frame-main-grid is-${activeHeroSection}`}>
                <section
                  className={`hero-frame-panel hero-frame-panel-primary ${activeHeroSection === "builder" ? "is-builder-open" : ""}`}
                >
                  {activeHeroSection === "builder" ? (
                    <div className="hero-frame-builder-shell">
                      <Suspense fallback={<p className="hero-frame-panel-loading">Loading builder...</p>}>
                        <Configurator locale={locale} embedded />
                      </Suspense>
                    </div>
                  ) : (
                    <div className="hero-frame-content-stack">
                      <p className="hero-frame-content-kicker">
                        {activeHeroSectionCopy?.kicker}
                      </p>
                      <h2 className="hero-frame-content-title">
                        {activeHeroSectionCopy?.title}
                      </h2>
                      <p className="hero-frame-content-lead">
                        {activeHeroSectionCopy?.lead}
                      </p>
                    </div>
                  )}
                </section>

                <section className="hero-frame-panel hero-frame-panel-secondary">
                  {activeHeroSection === "vision" ? (
                    <div className="hero-frame-vision-geometry" aria-hidden="true">
                      <svg
                        className="hero-frame-vision-svg"
                        viewBox="0 0 420 320"
                        role="presentation"
                      >
                        <defs>
                          <linearGradient id="heroVisionFanGradient" x1="24" y1="56" x2="336" y2="172">
                            <stop offset="0%" stopColor="rgba(255, 88, 34, 0.18)" />
                            <stop offset="50%" stopColor="rgba(255, 112, 52, 0.52)" />
                            <stop offset="100%" stopColor="rgba(255, 158, 104, 0.9)" />
                          </linearGradient>
                          <linearGradient id="heroVisionRayGradient" x1="336" y1="172" x2="408" y2="172">
                            <stop offset="0%" stopColor="rgba(255, 158, 104, 0.85)" />
                            <stop offset="100%" stopColor="rgba(255, 158, 104, 0.2)" />
                          </linearGradient>
                          <radialGradient id="heroVisionCoreGradient" cx="50%" cy="50%" r="55%">
                            <stop offset="0%" stopColor="rgba(255, 126, 74, 0.92)" />
                            <stop offset="100%" stopColor="rgba(255, 74, 34, 0.15)" />
                          </radialGradient>
                        </defs>
                        {heroVisionPaths.map((path) => (
                          <path key={path.id} d={path.d} className="hero-frame-vision-path" />
                        ))}
                        <line x1="336" y1="172" x2="408" y2="172" className="hero-frame-vision-ray" />
                        <circle cx="336" cy="172" r="42" className="hero-frame-vision-shell" />
                        <circle cx="336" cy="172" r="30" className="hero-frame-vision-core" />
                        <circle cx="336" cy="172" r="8" className="hero-frame-vision-point" />
                      </svg>
                    </div>
                  ) : (
                    <div className="hero-frame-points-list">
                      {(activeHeroSectionCopy?.points ?? []).map((point) => (
                        <p key={point} className="hero-frame-point-item">
                          {point}
                        </p>
                      ))}
                    </div>
                  )}

                  {activeHeroSection === "builder" ? (
                    <button
                      type="button"
                      className="hero-frame-inline-button"
                      onClick={handleOpenLabRoute}
                    >
                      {activeHeroSectionCopy?.cta ?? copy.intro.startQuiz}
                    </button>
                  ) : null}
                </section>

                <section className="hero-frame-panel hero-frame-panel-footer">
                  <div className="hero-frame-contact">
                    <p>{heroFrameCopy?.location}</p>
                    <p>{heroFrameCopy?.email}</p>
                    <p>{heroFrameCopy?.copyright}</p>
                    <div
                      className="hero-frame-contact-socials"
                      aria-label={heroFrameCopy?.socialsAria ?? "Social links"}
                    >
                      {heroFrameSocials.map((social) => {
                        const isEmail = social.href.startsWith("mailto:");
                        return (
                          <a
                            key={social.href}
                            className="hero-frame-contact-social"
                            href={social.href}
                            target={isEmail ? undefined : "_blank"}
                            rel={isEmail ? undefined : "noreferrer"}
                          >
                            {social.label}
                          </a>
                        );
                      })}
                    </div>
                  </div>

                  <div className="hero-frame-services">
                    {(activeHeroSectionCopy?.points ?? []).slice(0, 3).map((point) => (
                      <p key={point}>{point}</p>
                    ))}
                  </div>
                </section>
              </div>

              <aside
                className="hero-frame-side-nav"
                aria-label={heroFrameCopy?.sideAria}
              >
                {heroFrameSections.map(({ id, label }, index) => {
                  const order = String(index + 1).padStart(2, "0");
                  const isActive = activeHeroSection === id;

                  return (
                    <button
                      key={id}
                      type="button"
                      className={`hero-frame-side-item is-action ${isActive ? "is-active" : ""}`}
                      onClick={() => handleHeroSectionSelect(id)}
                      aria-pressed={isActive}
                    >
                      <span className="hero-frame-side-index">{order}</span>
                      <span className="hero-frame-side-label">{label}</span>
                    </button>
                  );
                })}
              </aside>
              </div>
            </>
          ) : null}

          {showHeroBackControl ? (
            <>
              <button
                type="button"
                className="hero-overlay-back-button"
                onClick={() => setIsHeroCollapsed(false)}
              >
                {heroFrameControls.back}
              </button>

              <div
                className="scene-walk-hud"
                role="group"
                aria-label={heroFrameControls.walkAria}
              >
                {sceneWalkPoints.map((point) => {
                  const isActive = point.id === activeSceneWalkPoint;

                  return (
                    <button
                      key={point.id}
                      type="button"
                      className={`scene-walk-node ${isActive ? "is-active" : ""}`}
                      onClick={() => handleSceneWalkSelect(point.id)}
                      aria-pressed={isActive}
                    >
                      <span className="scene-walk-node-dot" aria-hidden="true" />
                      <span className="scene-walk-node-label">{point.label}</span>
                    </button>
                  );
                })}
              </div>
            </>
          ) : null}

          {showIntroSequence ? (
            <div className="intro-annotation-layer" aria-hidden="true">
              <div className="intro-annotation intro-annotation-top-left">
                <p className="intro-annotation-script">
                  {copy.intro.annotations.presents}
                </p>
              </div>
              <div className="intro-annotation intro-annotation-top-center">
                <span className="intro-annotation-pill">
                  {copy.intro.annotations.format}
                </span>
                <span className="intro-annotation-pill">
                  {copy.intro.annotations.type}
                </span>
              </div>
              <div className="intro-annotation intro-annotation-top-right">
                <span className="intro-annotation-line" />
                <p className="intro-annotation-copy">
                  {copy.intro.annotations.lineNote}
                </p>
              </div>
            </div>
          ) : null}
        </div>
      ) : null}

      {isLabRoute ? (
        <div className="quiz-stage">
          <div className="quiz-stage-background" aria-hidden="true" />
          <div className="quiz-stage-screen-shell">
            <div className="quiz-stage-screen-glow" aria-hidden="true" />
            <div className="quiz-stage-screen">
              <div className="quiz-intro-enter">
                <Suspense fallback={null}>
                  <Configurator locale={locale} />
                </Suspense>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {webglLost ? (
        <div className="webgl-fallback" role="alert" aria-live="assertive">
          <div className="webgl-fallback-panel">
            <p className="webgl-fallback-eyebrow">3D scene unavailable</p>
            <h2 className="webgl-fallback-title">
              The browser dropped the WebGL context.
            </h2>
            <p className="webgl-fallback-copy">
              A lighter reload usually restores the scene. The configurator
              remains available.
            </p>
            <div className="webgl-fallback-actions">
              <button type="button" onClick={handleSceneReload}>
                Reload scene
              </button>
              <button type="button" onClick={() => navigate("/lab")}>
                Open configurator
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

export default App;
