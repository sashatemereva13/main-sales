import { useState, useRef, useEffect } from "react";
import "./ColorCarousel.css";
import { motion, useMotionValue, animate } from "framer-motion";
import palettes from "./ColorData.jsx";

export default function ColorCarousel() {
  const INITIAL_INDEX = 0;
  const SNAP = 432;
  console.log(palettes);
  const [current, setCurrent] = useState(INITIAL_INDEX);
  const x = useMotionValue(-INITIAL_INDEX * SNAP);

  const railRef = useRef(null);

  const goTo = (idx) => {
    const clamped = Math.max(0, Math.min(idx, palettes.length - 1));
    setCurrent(clamped);

    animate(x, -clamped * SNAP, {
      type: "spring",
      stiffness: 260,
      damping: 32,
    });
  };

  useEffect(() => {
    x.set(0);
  }, []);

  useEffect(() => {
    console.log("Initial x:", x.get());
  }, []);

  return (
    <>
      <section>
        <div className="visualBox">
          <Canvas
            camera={{ fov: 45, near: 0.1, far: 300, position: [0, 0, 20] }}
            style={{ background: "#141018" }}
          >
            <Scene3 />
          </Canvas>
        </div>

        <div className="caption">
          <h1>let's look beyond</h1>
          <p>the usual the normal the regular the known</p>
        </div>
      </section>

      <section className="colorCarousel">
        <div className="colorCarousel-head">
          <h2 className="colorCarousel-title">Palettes chromatiques</h2>

          <p className="drag-hint">drag or use arrows</p>
        </div>

        <motion.div className="colorCarousel-rail" ref={railRef} style={{ x }}>
          <div className="colorCarousel-spacer" />

          {palettes.map((palette, i) => (
            <div key={i} className={`card ${i === current ? "is-active" : ""}`}>
              <div className="card-head">
                <h3 className="card-title">{palette.title}</h3>
              </div>

              {/* Swatches */}
              <div className="swatches">
                {palette.colors.map((c, j) => (
                  <div
                    key={j}
                    className="swatch"
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  />
                ))}
              </div>

              {/* Color list */}
              <ul className="features">
                {palette.colors.map((c, j) => (
                  <li key={j}>
                    <strong>{c.name}</strong>
                    <span>{c.hex}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </motion.div>

        <div className="colorCarousel-controls">
          <button className="nav-btn" onClick={() => goTo(current - 1)}>
            &#10094;
          </button>

          <div className="dots">
            {palettes.map((_, i) => (
              <button
                key={i}
                className={`dot ${i === current ? "is-active" : ""}`}
                onClick={() => goTo(i)}
              ></button>
            ))}
          </div>

          <button className="nav-btn" onClick={() => goTo(current + 1)}>
            &#10095;
          </button>
        </div>
      </section>
    </>
  );
}
