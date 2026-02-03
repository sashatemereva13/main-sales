// components/PricingCarousel.jsx
import { motion, useMotionValue, animate } from "framer-motion";
import { useRef, useEffect, useState, useLayoutEffect } from "react";
import packages from "./PricingPackages";
import "./PricingCarousel.css";
import "./CarouselResponsive.css";

export default function PricingCarousel() {
  const railRef = useRef(null);
  const cardRef = useRef(null);
  const [active, setActive] = useState(0);
  const [maxIndex, setMaxIndex] = useState(packages.length - 1);
  const [snap, setSnap] = useState(0);
  const [dragBounds, setDragBounds] = useState({ left: 0, right: 0 });
  const x = useMotionValue(0);

  useLayoutEffect(() => {
    const measure = () => {
      const rail = railRef.current;
      const card = cardRef.current;
      if (!rail || !card) return;

      const style = getComputedStyle(rail);
      const gap = parseFloat(style.columnGap || style.gap || "24");
      const cardWidth = card.getBoundingClientRect().width;
      const snapDistance = cardWidth + gap;

      const total = snapDistance * (packages.length - 1);
      setSnap(snapDistance);
      setDragBounds({ left: -total, right: 0 });
    };

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const goTo = (idx) => {
    const clamped = Math.max(0, Math.min(idx, maxIndex));
    setActive(clamped);
    animate(x, -clamped * snap, {
      type: "spring",
      stiffness: 260,
      damping: 32,
    });
  };

  const onDragEnd = (_, info) => {
    const current = x.get();
    const velocity = info.velocity.x;
    let idx = Math.round(-current / snap);

    if (Math.abs(velocity) > 400) {
      idx = velocity < 0 ? active + 1 : active - 1;
    }
    goTo(idx);
  };

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight") goTo(active + 1);
      if (e.key === "ArrowLeft") goTo(active - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active]);

  return (
    <div className="pricing-carousel" aria-roledescription="carousel">
      {/* Soft edge fades */}
      <div className="fade fade--left" aria-hidden />
      <div className="fade fade--right" aria-hidden />

      {/* Section header */}
      <header className="carousel-head">
        <h2 className="carousel-title">Offres & expériences digitales</h2>
        <p className="carousel-subtitle">
          Chaque site est conçu comme un objet unique, pensé pour refléter votre
          identité et votre vision.
        </p>
      </header>

      {/* Track */}
      <motion.div
        className="rail"
        ref={railRef}
        style={{ x }}
        drag="x"
        dragConstraints={dragBounds}
        dragElastic={0.04}
        onDragEnd={onDragEnd}
      >
        {packages.map((pkg, i) => (
          <article
            key={pkg.title}
            ref={i === 0 ? cardRef : undefined}
            className={`card ${i === active ? "is-active" : "is-inactive"}`}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} sur ${packages.length}`}
            tabIndex={0}
          >
            {/* Card header */}
            <header className="card-head">
              <h3 className="card-title">{pkg.title}</h3>
              <span className="price">{pkg.price}</span>
            </header>

            {/* Intent / positioning */}
            <p className="card-intent">{pkg.note}</p>

            {/* Features */}
            <ul className="features">
              {pkg.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>

            {/* Example */}
            <a
              className="example-link"
              href={pkg.caption}
              target="_blank"
              rel="noreferrer"
            >
              Découvrir un exemple →
            </a>
          </article>
        ))}
      </motion.div>

      {/* Controls */}
      <div className="controls" role="group" aria-label="Navigation des offres">
        <button
          className="nav-btn prev"
          onClick={() => goTo(active - 1)}
          disabled={active === 0}
          aria-label="Offre précédente"
        >
          ‹
        </button>

        <div className="dots" role="tablist">
          {packages.map((_, i) => (
            <button
              key={i}
              className={`dot ${i === active ? "is-active" : ""}`}
              onClick={() => goTo(i)}
              aria-label={`Aller à l’offre ${i + 1}`}
              aria-selected={i === active}
              role="tab"
            />
          ))}
        </div>

        <button
          className="nav-btn next"
          onClick={() => goTo(active + 1)}
          disabled={active === maxIndex}
          aria-label="Offre suivante"
        >
          ›
        </button>
      </div>
    </div>
  );
}
