import { Canvas } from "@react-three/fiber";
import { Suspense, lazy, useEffect, useMemo, useRef, useState } from "react";
import Nav from "./Nav";
import "./css/intro.css";
import SkyIntroText from "./intro/SkyIntroText";
import IntroSwirlAnchor from "./intro/IntroSwirlAnchor";

import GoldenSky from "./summerscene/GoldenSky";
import SunLight from "./summerscene/Sunlight";
import Ground from "./summerscene/Ground";
import Trees from "./summerscene/Trees";
import ForestBackdrop from "./summerscene/ForestBackdrop";
import MeadowRoad from "./summerscene/MeadowRoad";
import WhitePavilion, {
  WHITE_PAVILION_LOOK_AT_POSITION,
  WHITE_PAVILION_SWIRL_POSITION,
} from "./summerscene/WhitePavilion";

import Rabbit from "./summerscene/Rabbit";
import GrassBlades from "./summerscene/GrassField";
import CameraController from "./questioneer/CameraController";
import { getCopy } from "./i18n/copy";

const Quiz = lazy(() => import("./questioneer/Quiz"));
const IntroPathDebug = lazy(() => import("./intro/IntroPathDebug"));
const OrbitControls = lazy(() =>
  import("@react-three/drei").then((mod) => ({ default: mod.OrbitControls })),
);

function App() {
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
  const landingCameraTarget = [0, 5.6, 46];
  const [cameraTarget, setCameraTarget] = useState(landingCameraTarget);
  const [cameraIntroDone, setCameraIntroDone] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [exploreMode, setExploreMode] = useState(false);
  const [introScrollProgress, setIntroScrollProgress] = useState(0);
  const [introCameraDebug, setIntroCameraDebug] = useState(null);
  const [hasTriggeredIntroHintNudge, setHasTriggeredIntroHintNudge] =
    useState(false);
  const [introHintNudging, setIntroHintNudging] = useState(false);
  const introScrollRef = useRef(null);
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
  const orbitMode = debugOrbit || exploreMode;
  const showIntroCta = (cameraIntroDone || orbitMode) && !showQuiz;
  const introScrollEnabled = !orbitMode && !cameraIntroDone && !showQuiz;
  const showSceneStage = !showQuiz;

  const handleStartQuiz = () => {
    if (!cameraIntroDone) {
      setCameraIntroDone(true);
    }
    setExploreMode(false);
    setShowWelcome(false);
    setShowQuiz(true);
  };
  const handleEnterExplore = () => {
    setCameraIntroDone(true);
    setShowWelcome(false);
    setExploreMode(true);
  };
  const handleExitExplore = () => {
    setExploreMode(false);
    if (!showQuiz) {
      setShowWelcome(true);
    }
  };
  const handleIntroHintInteraction = () => {
    if (hasTriggeredIntroHintNudge || !introScrollEnabled) return;
    setHasTriggeredIntroHintNudge(true);
    setIntroHintNudging(true);
  };
  const rabbitPositions = [
    [0, 0.5, 12],
    [-2, 0.35, -10],
    [2, 0.8, -28],
  ];
  const wildlifePaused = showQuiz || deviceProfile.lowPower;
  const grassQuality = deviceProfile.lowPower
    ? "low"
    : deviceProfile.grassCount < 70000
      ? "mid"
      : "high";
  const grassPaused = showQuiz && !orbitMode;
  const grassHoverEnabled = !showQuiz && !deviceProfile.isMobile;
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
    if (cameraIntroDone || showQuiz || orbitMode) return;
    if (introScrollProgress >= 0.995) {
      setCameraIntroDone(true);
      setShowWelcome(true);
    }
  }, [cameraIntroDone, introScrollProgress, orbitMode, showQuiz]);

  useEffect(() => {
    if (!introScrollEnabled && introScrollRef.current) {
      introScrollRef.current.scrollTop = 0;
    }
  }, [introScrollEnabled]);

  useEffect(() => {
    if (!introHintNudging) return undefined;

    const timeoutId = window.setTimeout(() => {
      setIntroHintNudging(false);
    }, 900);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [introHintNudging]);

  return (
    <>
      <Nav
        reveal={cameraIntroDone || orbitMode}
        activeTab={showQuiz ? "quiz" : "scene"}
        exploreMode={exploreMode}
        locale={locale}
        onLocaleChange={setLocale}
        onEnterExplore={handleEnterExplore}
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
                  introProgress={
                    introScrollEnabled ? introScrollProgress : undefined
                  }
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
                  lookAt={introLookAtEnd}
                  onIntroComplete={() => {
                    setCameraIntroDone(true);
                    setShowWelcome(true);
                  }}
                />
              )}
              {/* <IntroSwirlAnchor
                position={introLookAtEnd}
                introProgress={introScrollEnabled ? introScrollProgress : 1}
                beamLength={13.5}
              /> */}
              <GoldenSky />
              {/* {!orbitMode && !cameraIntroDone ? (
                <SkyIntroText
                  duration={introCameraDuration}
                  locale={locale}
                  progressOverride={introScrollProgress}
                />
              ) : null} */}
              <SunLight
                shadows={deviceProfile.shadows}
                shadowMapSize={deviceProfile.shadowMapSize}
              />

              <group>
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
              </group>
            </Canvas>
          </div>

          <div
            className={`intro-overlay ${cameraIntroDone || orbitMode ? "camera-finished" : ""} ${showQuiz || orbitMode ? "sequence-finished" : ""}`}
          >
            {introScrollEnabled ? (
              <div
                className={`intro-scroll-prompt ${introHintNudging ? "is-nudging" : ""}`}
                role="note"
                aria-live="polite"
              >
                <span className="intro-scroll-arrow" aria-hidden="true">
                  <span className="intro-scroll-arrow-chevron" />
                  <span className="intro-scroll-arrow-chevron" />
                </span>
                <span className="intro-scroll-prompt-text">
                  {copy.intro.scrollHint}
                </span>
              </div>
            ) : null}
            {!showQuiz && !orbitMode && !cameraIntroDone ? (
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
            <div
              className={`intro-welcome-panel ${showWelcome && !exploreMode ? "is-visible" : ""}`}
            >
              <div className="intro-welcome-card">
                <div className="intro-card-top">
                  <div className="intro-card-top-left">
                    <p className="intro-card-system-label">
                      {copy.intro.discoverySession}
                    </p>
                    <div
                      className="intro-card-tabs"
                      aria-label={copy.intro.heroTabsAria}
                    >
                      <span className="intro-card-tab is-active">
                        {copy.intro.welcome}
                      </span>
                      <span className="intro-card-tab">
                        {copy.intro.studio}
                      </span>
                      <span className="intro-card-tab is-muted">
                        {copy.intro.process}
                      </span>
                    </div>
                  </div>
                  <div className="intro-card-top-right">
                    <p className="intro-card-coord">
                      {copy.intro.studioEnvironment}
                    </p>
                    <span className="intro-card-status">
                      <span className="intro-card-status-dot" />
                      {copy.intro.available}
                    </span>
                  </div>
                </div>
                <p className="intro-welcome-text">amber composition</p>

                <p className="intro-welcome-subtext">{copy.intro.subtitle}</p>
                {showIntroCta ? (
                  <div className="intro-cta-group">
                    <button
                      type="button"
                      className="intro-start-button"
                      onClick={handleStartQuiz}
                    >
                      {copy.intro.startQuiz}
                    </button>
                    <p className="intro-cta-meta">{copy.intro.ctaMeta}</p>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
          {exploreMode && !showQuiz ? (
            <div
              className="explore-controls"
              role="group"
              aria-label="Explore controls"
            >
              <button
                type="button"
                className="explore-control-button is-primary"
                onClick={handleStartQuiz}
              >
                {copy.intro.startQuiz}
              </button>
              <button
                type="button"
                className="explore-control-button"
                onClick={handleExitExplore}
              >
                {copy.intro.backToWelcome}
              </button>
            </div>
          ) : null}
          {introScrollEnabled ? (
            <div
              ref={introScrollRef}
              className="intro-scroll-layer"
              onWheel={handleIntroHintInteraction}
              onTouchStart={handleIntroHintInteraction}
              onScroll={(event) => {
                const node = event.currentTarget;
                const max = Math.max(node.scrollHeight - node.clientHeight, 1);
                setIntroScrollProgress(node.scrollTop / max);
              }}
            >
              <div className="intro-scroll-spacer" />
            </div>
          ) : null}
        </>
      ) : null}

      {showQuiz ? (
        <div className="quiz-stage">
          <div className="quiz-stage-background" aria-hidden="true" />
          <div className="quiz-intro-enter">
            <Suspense fallback={null}>
              <Quiz
                locale={locale}
                setCameraTarget={setCameraTarget}
                initialCameraTarget={landingCameraTarget}
              />
            </Suspense>
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
