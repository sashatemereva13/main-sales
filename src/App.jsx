import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Nav from "./Nav";
import "./css/intro.css";

import GoldenSky from "./summerscene/GoldenSky";
import SunLight from "./summerscene/Sunlight";
import Ground from "./summerscene/Ground";
import Pond from "./summerscene/Pond";
import Trees from "./summerscene/Trees";
import ForestBackdrop from "./summerscene/ForestBackdrop";
import MeadowRoad from "./summerscene/MeadowRoad";
import Bike from "./summerscene/Bike";

import Rabbit from "./summerscene/Rabbit";
import GrassBlades from "./summerscene/GrassField";
import HeroTitle from "./hero/HeroTitle";
import { useState } from "react";
import Quiz from "./questioneer/Quiz";
import CameraController from "./questioneer/CameraController";

function App() {
  const debugOrbit =
    typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).get("debugCamera") === "1";
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

  return (
    <>
      <Nav
        reveal={cameraIntroDone || debugOrbit}
        activeTab={showQuiz ? "quiz" : "scene"}
        debugOrbit={debugOrbit}
      />
      <div className="sceneContainer">
        <Canvas shadows camera={{ position: introCameraStart, fov: 45 }}>
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
          <SunLight />
          <Ground />
          <MeadowRoad />
          <ForestBackdrop />
          <Pond center={[18, -18]} radiusX={15} radiusZ={10} />
          <Bike position={[24.5, 0, -8.5]} rotation={[0, -1.25, 0.09]} />
          <Trees />

          <GrassBlades />
          <Rabbit position={[0, 1.2, 12]} />
          <Rabbit position={[-2, 1.35, -10]} />
          <Rabbit position={[2, 1.15, -28]} />
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
                <p className="intro-card-system-label">Discovery Session</p>
                <div className="intro-card-tabs" aria-label="Hero tabs">
                  <span className="intro-card-tab is-active">Welcome</span>
                  <span className="intro-card-tab">Studio</span>
                  <span className="intro-card-tab is-muted">Process</span>
                </div>
              </div>
              <div className="intro-card-top-right">
                <p className="intro-card-coord">Studio Environment</p>
                <span className="intro-card-status">
                  <span className="intro-card-status-dot" />
                  Available
                </span>
              </div>
            </div>
            <p className="intro-welcome-text">sasha 13 studio</p>

            <p className="intro-welcome-subtext">Immersie web design studio</p>
            {(cameraIntroDone || debugOrbit) && !showQuiz ? (
              <div className="intro-cta-group">
                <button
                  type="button"
                  className="intro-start-button"
                  onClick={handleStartQuiz}
                >
                  Start Quiz
                </button>
                <p className="intro-cta-meta">
                  3 min • personalized recommendation
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {showQuiz ? (
        <div className="quiz-stage">
          <div className="quiz-intro-enter">
            <Quiz
              setCameraTarget={setCameraTarget}
              initialCameraTarget={landingCameraTarget}
            />
          </div>
        </div>
      ) : null}
    </>
  );
}

export default App;
