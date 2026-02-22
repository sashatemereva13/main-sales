import { Link } from "react-router-dom";
import { Canvas } from "@react-three/fiber";

import Scene2 from "./3Dscenes/Scene2";
import Scene4 from "./3Dscenes/Scene4";
import Scene5 from "./3Dscenes/Scene5";
import Nav from "./Nav";
import "./css/intro.css";

import PricingCarousel from "./cards/PricingCarousel";
import Reveal from "./utils/Reveal";
import HeroTitle from "./hero/HeroTitle";

function App() {
  return (
    <>
      {/* NAVIGATION */}
      <Nav />

      {/* =========================
         SECTION 1 — HERO
      ========================= */}
      <div className="hero-visual">
        <Canvas
          camera={{ fov: 15, near: 0.1, far: 300, position: [0, 0, 50] }}
          style={{ background: "#141018" }}
        >
          <Scene4 />
        </Canvas>
      </div>

      <section className="hero">
        <div className="hero-content">
          <HeroTitle />
        </div>

        <Reveal delay={0.2}>
          <div className="hero-steps">
            <div className="hero-step">
              <span className="step-label">Étape 1</span>
              <p>Clarifier votre projet et vos besoins</p>
              <a
                href="https://apply.sasha13studio.pro"
                className="cta-button primary"
              >
                Démarrer l’application
              </a>
            </div>

            <div className="hero-step">
              <span className="step-label">Étape 2</span>
              <p>Définir la direction visuelle et créative</p>
              <a
                href="https://design.sasha13studio.pro"
                className="cta-button primary"
              >
                Accéder au Design Studio
              </a>
            </div>
          </div>
        </Reveal>
      </section>

      {/* =========================
         SECTION 2 — POSITIONNEMENT
      ========================= */}
      <Reveal delay={0.1}>
        <section className="statementSection">
          <div className="visualBox statementVisual">
            <Canvas
              camera={{ fov: 42, near: 0.1, far: 300, position: [0, 0, 22] }}
            >
              <Scene2 />
            </Canvas>
          </div>

          <div className="caption statementCaption">
            <h2>
              Je conçois des sites identitaires qui ne se contentent pas d’être
              beaux — ils rendent votre présence évidente et attirent les bonnes
              personnes.
            </h2>

            <p className="statementSub">
              Chaque site est pensé sur mesure, comme une extension naturelle de
              votre univers, et non comme un simple template.
            </p>
          </div>
        </section>
      </Reveal>

      {/* =========================
         SECTION 3 — PRIX
      ========================= */}
      <section className="pricing-section">
        <PricingCarousel />
      </section>

      {/* =========================
         SECTION 4 — EXIT / VISUAL
      ========================= */}
      <section>
        <div className="visualBox">
          <Scene5 />
        </div>
      </section>
    </>
  );
}

export default App;
