import { Canvas } from "@react-three/fiber";
import { Suspense, lazy, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Nav from "./Nav";
import "./css/intro.css";

import GoldenSky from "./summerscene/GoldenSky";
import SunLight from "./summerscene/Sunlight";
import Ground from "./summerscene/Ground";
import Trees from "./summerscene/Trees";
import MeadowRoad from "./summerscene/MeadowRoad";
import SceneParallaxRig from "./summerscene/SceneParallaxRig";
import WhitePavilion, {
  WHITE_PAVILION_INTERIOR_CAMERA_POSITION,
  WHITE_PAVILION_INTERIOR_LOOK_AT_POSITION,
  WHITE_PAVILION_LOOK_AT_POSITION,
} from "./summerscene/WhitePavilion";

import Rabbit from "./summerscene/Rabbit";
import GrassBlades from "./summerscene/GrassField";
import CameraController from "./questioneer/CameraController";
import { getCopy } from "./i18n/copy";
import HeroTitle from "./hero/HeroTitle";

const Configurator = lazy(
  () => import("./components/configurator/Configurator"),
);
const IntroPathDebug = lazy(() => import("./intro/IntroPathDebug"));
const OrbitControls = lazy(() =>
  import("@react-three/drei").then((mod) => ({ default: mod.OrbitControls })),
);

const LAB_ROUTE_TRANSITION_MS = 1150;

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [locale, setLocale] = useState(() => {
    if (typeof window === "undefined") return "fr";
    const saved = window.localStorage.getItem("site-locale");
    return saved === "en" || saved === "fr" ? saved : "fr";
  });

  const debugOrbit =
    typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).get("debugCamera") === "1";
  const debugIntroCamera =
    typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).get("debugIntro") === "1";
  const deviceProfile = useMemo(() => {
    if (typeof window === "undefined") {
      return {
        isMobile: false,
        lowPower: false,
        dpr: [1, 1.35],
        shadows: true,
        shadowMapSize: 1536,
        grassCount: 42000,
        rabbitSlots: 3,
      };
    }

    const width = window.innerWidth;
    const height = window.innerHeight;
    const ua = navigator.userAgent || "";
    const coarsePointer =
      window.matchMedia?.("(pointer: coarse)")?.matches ?? false;
    const isMobile =
      /Android|iPhone|iPod|Mobile|Windows Phone/i.test(ua) ||
      (coarsePointer && Math.min(width, height) < 900);
    const isTablet =
      /iPad|Tablet/i.test(ua) ||
      (coarsePointer && !isMobile && Math.max(width, height) <= 1368);
    const cores = navigator.hardwareConcurrency ?? 8;
    const memory = navigator.deviceMemory ?? 8;
    const lowPower = isMobile || cores <= 4 || memory <= 4;
    const midPower = isTablet || cores <= 8 || memory <= 8;

    if (lowPower) {
      return {
        isMobile,
        lowPower: true,
        dpr: [1, 1.1],
        shadows: false,
        shadowMapSize: 768,
        grassCount: 16000,
        rabbitSlots: 1,
      };
    }

    if (midPower) {
      return {
        isMobile: false,
        lowPower: false,
        dpr: [1, 1.25],
        shadows: false,
        shadowMapSize: 1024,
        grassCount: 28000,
        rabbitSlots: 2,
      };
    }

    return {
      isMobile: false,
      lowPower: false,
      dpr: [1, 1.35],
      shadows: true,
      shadowMapSize: 1536,
      grassCount: 42000,
      rabbitSlots: 3,
    };
  }, []);
  const landingCameraTarget = [0, 10.6, 46];
  const [cameraTarget, setCameraTarget] = useState(landingCameraTarget);
  const [cameraLookAt, setCameraLookAt] = useState(
    WHITE_PAVILION_LOOK_AT_POSITION,
  );
  const [cameraIntroDone, setCameraIntroDone] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [isLabLaunching, setIsLabLaunching] = useState(false);
  const [introCameraDebug, setIntroCameraDebug] = useState(null);
  const labLaunchTimeoutRef = useRef(null);
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
  const orbitMode = debugOrbit;
  const isLabRoute = location.pathname === "/lab";
  const isConfiguratorActive = isLabRoute || isLabLaunching;
  const showIntroCta = (cameraIntroDone || orbitMode) && !isConfiguratorActive;
  const showIntroSequence =
    !orbitMode && !cameraIntroDone && !isConfiguratorActive;
  const showSceneStage = !isLabRoute;

  const handleStartQuiz = () => {
    if (labLaunchTimeoutRef.current) {
      window.clearTimeout(labLaunchTimeoutRef.current);
    }
    if (!cameraIntroDone) {
      setCameraIntroDone(true);
    }
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
  const rabbitPositions = [
    [0, 0.5, 12],
    [-2, 0.35, -10],
    [2, 0.8, -28],
  ];
  const wildlifePaused = isConfiguratorActive || deviceProfile.lowPower;
  const grassQuality = deviceProfile.lowPower
    ? "low"
    : deviceProfile.grassCount < 70000
      ? "mid"
      : "high";
  const grassPaused = isConfiguratorActive && !orbitMode;
  const grassHoverEnabled = !isConfiguratorActive && !deviceProfile.isMobile;
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

  return (
    <>
      <Nav
        reveal={isLabRoute || cameraIntroDone || orbitMode}
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

      {showSceneStage ? (
        <>
          <div className="sceneContainer">
            <Canvas
              shadows={deviceProfile.shadows}
              dpr={deviceProfile.dpr}
              gl={{
                powerPreference: "default",
                antialias: !deviceProfile.isMobile,
              }}
              camera={{
                position: orbitMode ? [380, 140, 120] : introCameraStart,
                fov: 45,
              }}
            >
              <fog attach="fog" args={["#efb48d", 165, 560]} />
              {orbitMode ? (
                <Suspense fallback={null}>
                  <OrbitControls
                    makeDefault
                    target={[0, 90, 110]}
                    enableDamping
                    dampingFactor={0.08}
                    minDistance={30}
                    maxDistance={1200}
                    maxPolarAngle={Math.PI}
                  />
                  <IntroPathDebug
                    introStart={introCameraStart}
                    target={landingCameraTarget}
                    introLookAtStart={introLookAtStart}
                    lookAt={introLookAtEnd}
                    introOrbitTurns={introOrbitTurns}
                    introOrbitStart={introOrbitStart}
                    introOrbitUntil={introOrbitUntil}
                  />
                </Suspense>
              ) : (
                <CameraController
                  target={cameraTarget}
                  introStart={introCameraStart}
                  introDuration={introCameraDuration}
                  introLookAtStart={introLookAtStart}
                  introOrbitTurns={introOrbitTurns}
                  introOrbitStart={introOrbitStart}
                  introOrbitUntil={introOrbitUntil}
                  skipIntro={cameraIntroDone}
                  onIntroFrame={(frame) => {
                    if (debugIntroCamera) {
                      setIntroCameraDebug(frame);
                    }
                  }}
                  lookAt={cameraLookAt}
                  onIntroComplete={() => {
                    setCameraIntroDone(true);
                    setShowWelcome(true);
                  }}
                />
              )}
              <GoldenSky />
              <SunLight
                shadows={deviceProfile.shadows}
                shadowMapSize={deviceProfile.shadowMapSize}
              />

              <HeroTitle />
              <SceneParallaxRig
                disabled={
                  orbitMode || deviceProfile.isMobile || isConfiguratorActive
                }
              >
                <WhitePavilion />
                <Ground />
                <Trees count={5} />

                <GrassBlades
                  count={deviceProfile.grassCount}
                  quality={grassQuality}
                  paused={grassPaused}
                  hoverEnabled={grassHoverEnabled}
                />

                <MeadowRoad />

                {rabbitPositions
                  .slice(0, deviceProfile.rabbitSlots)
                  .map((position, i) => (
                    <Rabbit
                      key={`rabbit-${i}`}
                      position={position}
                      paused={wildlifePaused}
                    />
                  ))}
              </SceneParallaxRig>
            </Canvas>
          </div>

          <div
            className={`intro-overlay ${cameraIntroDone || orbitMode ? "camera-finished" : ""} ${isConfiguratorActive || orbitMode ? "sequence-finished" : ""}`}
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
            {/* {showWelcome && !isConfiguratorActive ? (
              <div className="intro-hero-panel">
                <div className="intro-hero-copy">
                  <p className="intro-hero-kicker">{copy.intro.heroKicker}</p>
                  <h1 className="intro-hero-title">{copy.intro.heroTitle}</h1>
                  <p className="intro-hero-lead">{copy.intro.heroLead}</p>
                </div>
                <div className="intro-hero-metrics" aria-label="Studio strengths">
                  {copy.intro.heroMetrics?.map((metric) => (
                    <span key={metric} className="intro-hero-metric">
                      {metric}
                    </span>
                  ))}
                </div>
              </div>
            ) : null} */}
          </div>
        </>
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

      {debugIntroCamera && !orbitMode ? (
        <div
          style={{
            position: "fixed",
            right: 12,
            bottom: 12,
            zIndex: 90,
            width: "min(440px, calc(100vw - 24px))",
            padding: "12px",
            borderRadius: 12,
            border: "1px solid rgba(255,255,255,0.16)",
            background: "rgba(8, 10, 14, 0.84)",
            color: "#f7efe4",
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
            fontSize: 12,
            lineHeight: 1.35,
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            pointerEvents: "none",
          }}
        >
          <div style={{ fontWeight: 700, marginBottom: 4 }}>
            Intro Camera Debug
          </div>
          <div style={{ opacity: 0.8, marginBottom: 8 }}>
            Use `?debugIntro=1` (not `debugCamera=1`) to inspect the real intro
            path.
          </div>
          <pre
            style={{
              margin: 0,
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              maxHeight: "40vh",
              overflow: "hidden",
            }}
          >
            {JSON.stringify(
              {
                config: {
                  introCameraStart,
                  introLookAtStart,
                  introCameraDuration,
                  introOrbitTurns,
                  introOrbitStart,
                  introOrbitUntil,
                  lookAtEnd: introLookAtEnd,
                  landingCameraTarget,
                },
                live: introCameraDebug
                  ? {
                      ...introCameraDebug,
                      cameraPosition: introCameraDebug.cameraPosition?.map(
                        (n) => Number(n.toFixed(2)),
                      ),
                      cameraRotation: introCameraDebug.cameraRotation?.map(
                        (n) => Number(n.toFixed(3)),
                      ),
                      lookAt: introCameraDebug.lookAt?.map((n) =>
                        Number(n.toFixed(2)),
                      ),
                      target: introCameraDebug.target?.map((n) =>
                        Number(n.toFixed(2)),
                      ),
                      elapsed:
                        typeof introCameraDebug.elapsed === "number"
                          ? Number(introCameraDebug.elapsed.toFixed(2))
                          : introCameraDebug.elapsed,
                      progress:
                        typeof introCameraDebug.progress === "number"
                          ? Number(introCameraDebug.progress.toFixed(3))
                          : introCameraDebug.progress,
                      easedProgress:
                        typeof introCameraDebug.easedProgress === "number"
                          ? Number(introCameraDebug.easedProgress.toFixed(3))
                          : introCameraDebug.easedProgress,
                      orbitAngleRad:
                        typeof introCameraDebug.orbitAngleRad === "number"
                          ? Number(introCameraDebug.orbitAngleRad.toFixed(3))
                          : introCameraDebug.orbitAngleRad,
                    }
                  : null,
              },
              null,
              2,
            )}
          </pre>
        </div>
      ) : null}
    </>
  );
}

export default App;
