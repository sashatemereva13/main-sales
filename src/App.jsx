import { Suspense, useEffect, useRef, useState } from "react";
import { lazy } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Nav from "./Nav";
import "./css/intro.css";
import LandingScene from "./scene/LandingScene";
import { usePerformanceProfile } from "./scene/hooks/usePerformanceProfile";
import {
  WHITE_PAVILION_INTERIOR_CAMERA_POSITION,
  WHITE_PAVILION_INTERIOR_LOOK_AT_POSITION,
  WHITE_PAVILION_LOOK_AT_POSITION,
} from "./scene/pavilion";
import { getCopy } from "./i18n/copy";

const Configurator = lazy(
  () => import("./components/configurator/Configurator"),
);

const LAB_ROUTE_TRANSITION_MS = 1150;

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const performanceProfile = usePerformanceProfile();
  const [locale, setLocale] = useState(() => {
    if (typeof window === "undefined") return "fr";
    const saved = window.localStorage.getItem("site-locale");
    return saved === "en" || saved === "fr" ? saved : "fr";
  });
  const [cameraTarget, setCameraTarget] = useState([0, 10.6, 46]);
  const [cameraLookAt, setCameraLookAt] = useState(
    WHITE_PAVILION_LOOK_AT_POSITION,
  );
  const [cameraIntroDone, setCameraIntroDone] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [isLabLaunching, setIsLabLaunching] = useState(false);
  const [webglLost, setWebglLost] = useState(false);
  const [sceneResetToken, setSceneResetToken] = useState(0);
  const labLaunchTimeoutRef = useRef(null);

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
  const isConfiguratorActive = isLabRoute || isLabLaunching;
  const showIntroCta = cameraIntroDone && !isConfiguratorActive;
  const showIntroSequence = !cameraIntroDone && !isConfiguratorActive;
  const copy = getCopy(locale);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = locale;
    }
    if (typeof window !== "undefined") {
      window.localStorage.setItem("site-locale", locale);
    }
  }, [locale]);

  useEffect(() => {
    return () => {
      if (labLaunchTimeoutRef.current) {
        window.clearTimeout(labLaunchTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isLabRoute) {
      setIsLabLaunching(false);
      setCameraIntroDone(true);
      setShowWelcome(false);
      return;
    }

    setIsLabLaunching(false);
    setCameraTarget(landingCameraTarget);
    setCameraLookAt(introLookAtEnd);
  }, [introLookAtEnd, isLabRoute]);

  const handleStartQuiz = () => {
    if (labLaunchTimeoutRef.current) {
      window.clearTimeout(labLaunchTimeoutRef.current);
    }
    setCameraIntroDone(true);
    setShowWelcome(false);
    setIsLabLaunching(true);
    setCameraTarget(WHITE_PAVILION_INTERIOR_CAMERA_POSITION);
    setCameraLookAt(WHITE_PAVILION_INTERIOR_LOOK_AT_POSITION);
    labLaunchTimeoutRef.current = window.setTimeout(() => {
      labLaunchTimeoutRef.current = null;
      navigate("/lab");
    }, LAB_ROUTE_TRANSITION_MS);
  };

  const handleBackToLanding = () => {
    if (labLaunchTimeoutRef.current) {
      window.clearTimeout(labLaunchTimeoutRef.current);
      labLaunchTimeoutRef.current = null;
    }
    setIsLabLaunching(false);
    setShowWelcome(true);
    setCameraIntroDone(true);
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
      <Nav
        reveal={isLabRoute || cameraIntroDone}
        activeTab={isLabRoute ? "configurator" : "scene"}
        locale={locale}
        onLocaleChange={setLocale}
        onBackToLanding={handleBackToLanding}
        title={
          showWelcome && !isConfiguratorActive ? "amber composition hub" : null
        }
        subtitle={
          showWelcome && !isConfiguratorActive ? copy.intro.subtitle : null
        }
        showPrimaryCta={showIntroCta && showWelcome}
        primaryCtaLabel={copy.intro.startQuiz}
        onPrimaryCta={handleStartQuiz}
        ctaMeta={
          showWelcome && !isConfiguratorActive ? copy.intro.ctaMeta : null
        }
      />

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
