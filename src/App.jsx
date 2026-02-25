import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Suspense, lazy, useEffect, useMemo, useState } from "react";
import Nav from "./Nav";
import "./css/intro.css";

import GoldenSky from "./summerscene/GoldenSky";
import SunLight from "./summerscene/Sunlight";
import Ground from "./summerscene/Ground";
import Pond from "./summerscene/Pond";
import Trees from "./summerscene/Trees";
import ForestBackdrop from "./summerscene/ForestBackdrop";
import MeadowRoad from "./summerscene/MeadowRoad";

import Rabbit from "./summerscene/Rabbit";
import GrassBlades from "./summerscene/GrassField";
import CameraController from "./questioneer/CameraController";
import { getCopy } from "./i18n/copy";
const Quiz = lazy(() => import("./questioneer/Quiz"));

function App() {
  const [locale, setLocale] = useState(() => {
    if (typeof window === "undefined") return "fr";
    const saved = window.localStorage.getItem("site-locale");
    return saved === "en" || saved === "fr" ? saved : "fr";
  });
  const debugOrbit =
    typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).get("debugCamera") === "1";
  const deviceProfile = useMemo(() => {
    if (typeof window === "undefined") {
      return {
        isMobile: false,
        lowPower: false,
        dpr: [1, 1.75],
        shadows: true,
        shadowMapSize: 2048,
        grassCount: 72000,
        rabbitSlots: 3,
      };
    }

    const width = window.innerWidth;
    const height = window.innerHeight;
    const ua = navigator.userAgent || "";
    const coarsePointer = window.matchMedia?.("(pointer: coarse)")?.matches ?? false;
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
        dpr: [1, 1.2],
        shadows: false,
        shadowMapSize: 1024,
        grassCount: 26000,
        rabbitSlots: 1,
      };
    }

    if (midPower) {
      return {
        isMobile: false,
        lowPower: false,
        dpr: [1, 1.45],
        shadows: true,
        shadowMapSize: 1536,
        grassCount: 46000,
        rabbitSlots: 2,
      };
    }

    return {
      isMobile: false,
      lowPower: false,
      dpr: [1, 1.75],
      shadows: true,
      shadowMapSize: 2048,
      grassCount: 72000,
      rabbitSlots: 3,
    };
  }, []);
  const landingCameraTarget = [0, 5.6, 36];
  const [cameraTarget, setCameraTarget] = useState(landingCameraTarget);
  const [cameraIntroDone, setCameraIntroDone] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const introCameraStart = [0, 26, 88];

  const handleStartQuiz = () => {
    setShowWelcome(false);
    setShowQuiz(true);
  };
  const rabbitPositions = [
    [0, 0.5, 12],
    [-2, 0.35, -10],
    [2, 0.8, -28],
  ];
  const wildlifePaused = showQuiz || deviceProfile.lowPower;
  const grassQuality = deviceProfile.lowPower ? "low" : deviceProfile.grassCount < 70000 ? "mid" : "high";
  const grassPaused = showQuiz && !debugOrbit;
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

  return (
    <>
      <Nav
        reveal={cameraIntroDone || debugOrbit}
        activeTab={showQuiz ? "quiz" : "scene"}
        debugOrbit={debugOrbit}
        locale={locale}
        onLocaleChange={setLocale}
      />
      <div className="sceneContainer">
        <Canvas
          shadows={deviceProfile.shadows}
          dpr={deviceProfile.dpr}
          gl={{
            powerPreference: "high-performance",
            antialias: !deviceProfile.isMobile,
          }}
          camera={{ position: introCameraStart, fov: 45 }}
        >
          <fog attach="fog" args={["#f2d3be", 34, 500]} />
          {debugOrbit ? (
            <OrbitControls
              makeDefault
              target={[0, 2, -20]}
              enableDamping
              dampingFactor={0.08}
              minDistance={18}
              maxDistance={260}
              maxPolarAngle={Math.PI * 0.485}
            />
          ) : (
            <CameraController
              target={cameraTarget}
              introStart={introCameraStart}
              introDuration={3.4}
              lookAt={[0, 1.8, -12]}
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
          <Ground />
          <MeadowRoad />
          <ForestBackdrop />
          <Pond center={[18, -18]} radiusX={15} radiusZ={10} />
          <Trees />

          <GrassBlades
            count={deviceProfile.grassCount}
            quality={grassQuality}
            paused={grassPaused}
            hoverEnabled={grassHoverEnabled}
          />
          {rabbitPositions.slice(0, deviceProfile.rabbitSlots).map((position, i) => (
            <Rabbit key={`rabbit-${i}`} position={position} paused={wildlifePaused} />
          ))}
        </Canvas>
      </div>

      <div
        className={`intro-overlay ${cameraIntroDone || debugOrbit ? "camera-finished" : ""} ${showQuiz || debugOrbit ? "sequence-finished" : ""}`}
      >
        <div className="intro-fade-curtain" />
        <div
          className={`intro-welcome-panel ${showWelcome ? "is-visible" : ""}`}
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
                  <span className="intro-card-tab">{copy.intro.studio}</span>
                  <span className="intro-card-tab is-muted">
                    {copy.intro.process}
                  </span>
                </div>
              </div>
              <div className="intro-card-top-right">
                <p className="intro-card-coord">{copy.intro.studioEnvironment}</p>
                <span className="intro-card-status">
                  <span className="intro-card-status-dot" />
                  {copy.intro.available}
                </span>
              </div>
            </div>
            <p className="intro-welcome-text">sasha 13 studio</p>

            <p className="intro-welcome-subtext">{copy.intro.subtitle}</p>
            {(cameraIntroDone || debugOrbit) && !showQuiz ? (
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

      {showQuiz ? (
        <div className="quiz-stage">
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
    </>
  );
}

export default App;
