import { Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

export const SKY_INTRO_TOP_TEXT_POSITION = [0, 150, -20];
export const SKY_INTRO_LOWER_PHRASES = [
  {
    text: "to interactive web worlds,",
    position: [14.13, 42.18, 10.33],
    fontSize: 7,
    phaseOffset: 0.35,
  },
  {
    text: "we design and build websites",
    position: [-13.12, 33.45, -31.26],
    fontSize: 5,
    phaseOffset: 0.8,
  },
  {
    text: "that represent you online",
    position: [18, 40, -56.06],
    fontSize: 6,
    phaseOffset: 1.25,
  },
];
export const SKY_INTRO_COPY = {
  en: {
    top: "for those who understand that perception is power",
    lower: [
      "not just a website,",
      "but an immersive digital presence",
      "designed to reflect your level",
    ],
  },
  fr: {
    top: "pour ceux qui comprennent que la perception est un pouvoir",
    lower: [
      "pas simplement un site,",
      "mais une présence digitale immersive",
      "pensée pour refléter votre niveau",
    ],
  },
};
const SKY_INTRO_TEXT_OPACITY_MULTIPLIER = 0.8;
const HOVER_GLASS_FILL = new THREE.Color("#f5fdff");
const HOVER_GLASS_STROKE = new THREE.Color("#ffffff");
const HOVER_GLASS_OUTLINE = new THREE.Color("#bfe9ff");
const SHARED_GLASS_TEXT_PROPS = {
  font: "/fonts/Canobis.ttf",
  textAlign: "center",
  anchorX: "center",
  anchorY: "middle",
  color: "#5d2f1f",
  fillOpacity: 0.96,
  strokeWidth: "1.6%",
  strokeColor: "#5d2f1f",
  strokeOpacity: 0.42,
  outlineWidth: "3.6%",
  outlineBlur: "24%",
  outlineColor: "#ffc6b3",
  outlineOpacity: 0.26,
  renderOrder: 10,
};
const SHARED_GLASS_TEXT_MATERIAL_PROPS = {
  "material-transparent": true,
  "material-depthTest": false,
  "material-depthWrite": false,
  "material-toneMapped": false,
  "material-opacity": 0,
};
const SKY_INTRO_FEATURES = {
  hoverShimmer: true,
  parallax: true,
  settle: true,
  drift: true,
};
const SKY_INTRO_FADE_SPAN = 0.05;
const TOP_PHRASE_WINDOW = [0.03, 0.28];
const LOWER_PHRASE_WINDOWS = [
  [0.34, 0.5],
  [0.52, 0.68],
  [0.7, 0.88],
];

function clamp01(value) {
  return Math.min(Math.max(value, 0), 1);
}

function createHoverState() {
  return {
    active: false,
    point: new THREE.Vector3(),
    strength: 0,
  };
}

function smoothstep(edge0, edge1, x) {
  const t = clamp01((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}

function phraseEnvelope(progress, fadeInStart, visibleUntil, fadeSpan = SKY_INTRO_FADE_SPAN) {
  const fadeIn = smoothstep(fadeInStart, fadeInStart + fadeSpan, progress);
  const fadeOut = 1 - smoothstep(visibleUntil, visibleUntil + fadeSpan, progress);
  return Math.pow(fadeIn * fadeOut, 0.82);
}

function getParallaxScalars(cameraPosition) {
  return {
    x: clamp01((cameraPosition.x + 240) / 480) * 2 - 1,
    y: clamp01((cameraPosition.y - 10) / 260) * 2 - 1,
    z: clamp01((cameraPosition.z + 80) / 460) * 2 - 1,
  };
}

function hasAnyHoverActive(topHoverRef, lowerHoverRefs) {
  if (topHoverRef.current?.active) return true;
  return lowerHoverRefs.current.some((s) => s?.active || s?.strength > 0.001);
}

function getFacingVisibility(
  node,
  camera,
  cameraForwardRef,
  phraseWorldPosRef,
  phraseToCameraRef,
  minDot = 0.78,
  maxDot = 0.96,
) {
  if (!node) return 0;
  camera.getWorldDirection(cameraForwardRef.current);
  node.getWorldPosition(phraseWorldPosRef.current);
  phraseToCameraRef.current
    .copy(phraseWorldPosRef.current)
    .sub(camera.position)
    .normalize();
  const dot = cameraForwardRef.current.dot(phraseToCameraRef.current);
  return smoothstep(minDot, maxDot, dot);
}

function setOpacity(node, opacity) {
  if (!node) return;
  const lastOpacity = node.userData.__lastOpacity;
  if (
    typeof lastOpacity === "number" &&
    Math.abs(lastOpacity - opacity) < 0.002
  ) {
    return;
  }
  node.userData.__lastOpacity = opacity;

  // Troika Text keeps separate opacities for fill/stroke/outline.
  // Cache the authored values and scale them together so borders don't linger.
  if (
    Object.prototype.hasOwnProperty.call(node, "fillOpacity") ||
    Object.prototype.hasOwnProperty.call(node, "strokeOpacity") ||
    Object.prototype.hasOwnProperty.call(node, "outlineOpacity")
  ) {
    if (!node.userData.__baseTextOpacities) {
      node.userData.__baseTextOpacities = {
        fillOpacity:
          typeof node.fillOpacity === "number" ? node.fillOpacity : undefined,
        strokeOpacity:
          typeof node.strokeOpacity === "number"
            ? node.strokeOpacity
            : undefined,
        outlineOpacity:
          typeof node.outlineOpacity === "number"
            ? node.outlineOpacity
            : undefined,
      };
    }

    const base = node.userData.__baseTextOpacities;
    if (typeof base.fillOpacity === "number") {
      node.fillOpacity = base.fillOpacity * opacity;
    }
    if (typeof base.strokeOpacity === "number") {
      node.strokeOpacity = base.strokeOpacity * opacity;
    }
    if (typeof base.outlineOpacity === "number") {
      node.outlineOpacity = base.outlineOpacity * opacity;
    }
  }

  if (!node.material) return;

  const materials = Array.isArray(node.material)
    ? node.material
    : [node.material];

  for (const material of materials) {
    material.transparent = true;
    material.opacity = opacity;
    material.depthWrite = false;
  }
}

function updateHoverState(stateRef, active, point) {
  if (!stateRef.current) return;
  stateRef.current.active = active;
  if (point) stateRef.current.point.copy(point);
}

function bindHoverHandlers(hoverRefLike) {
  return {
    onPointerOver: (e) => {
      e.stopPropagation();
      updateHoverState(hoverRefLike, true, e.point);
    },
    onPointerMove: (e) => {
      e.stopPropagation();
      updateHoverState(hoverRefLike, true, e.point);
    },
    onPointerOut: () => {
      updateHoverState(hoverRefLike, false);
    },
  };
}

function updateHoverStrengthValue(hoverState) {
  if (!hoverState) return 0;
  hoverState.strength += ((hoverState.active ? 1 : 0) - hoverState.strength) * 0.1;
  return hoverState.strength;
}

function applyHoverGlassColor(node, hoverStrength, time, phase = 0) {
  if (!node) return;

  if (!node.userData.__baseTextColors) {
    node.userData.__baseTextColors = {
      color: new THREE.Color(node.color ?? "#ffffff"),
      strokeColor: new THREE.Color(node.strokeColor ?? "#ffffff"),
      outlineColor: new THREE.Color(node.outlineColor ?? "#ffffff"),
      fillColor: new THREE.Color(),
      strokeColorTmp: new THREE.Color(),
      outlineColorTmp: new THREE.Color(),
    };
  }

  const base = node.userData.__baseTextColors;
  const pulse = hoverStrength * (0.86 + Math.sin(time * 2.4 + phase) * 0.14);

  node.color = base.fillColor
    .copy(base.color)
    .lerp(HOVER_GLASS_FILL, pulse * 0.55);
  node.strokeColor = base.strokeColorTmp
    .copy(base.strokeColor)
    .lerp(HOVER_GLASS_STROKE, pulse * 0.7);
  node.outlineColor = base.outlineColorTmp
    .copy(base.outlineColor)
    .lerp(HOVER_GLASS_OUTLINE, pulse * 0.8);
}

export default function SkyIntroText({ duration = 17.2, locale = "en" }) {
  const startedAt = useRef(null);
  const topTextRef = useRef(null);
  const lowerTextRefs = useRef([]);
  const rootRef = useRef(null);
  const topHoverRef = useRef(createHoverState());
  const lowerHoverRefs = useRef(
    SKY_INTRO_LOWER_PHRASES.map(() => createHoverState()),
  );
  const cameraForwardRef = useRef(new THREE.Vector3());
  const cameraMotionForwardRef = useRef(new THREE.Vector3());
  const cameraRightRef = useRef(new THREE.Vector3());
  const cameraUpRef = useRef(new THREE.Vector3());
  const worldUpRef = useRef(new THREE.Vector3(0, 1, 0));
  const phraseWorldPosRef = useRef(new THREE.Vector3());
  const phraseToCameraRef = useRef(new THREE.Vector3());
  const lowerPhraseDefs = useMemo(() => SKY_INTRO_LOWER_PHRASES, []);
  const phraseCopy = useMemo(
    () => SKY_INTRO_COPY[locale] ?? SKY_INTRO_COPY.en,
    [locale],
  );
  const topHoverHandlers = useMemo(() => bindHoverHandlers(topHoverRef), []);
  const lowerHoverHandlers = useMemo(
    () =>
      SKY_INTRO_LOWER_PHRASES.map((_, index) =>
        bindHoverHandlers({ current: lowerHoverRefs.current[index] }),
      ),
    [],
  );

  useFrame(({ clock, camera }) => {
    if (startedAt.current == null) {
      startedAt.current = clock.elapsedTime;
    }

    const elapsed = clock.elapsedTime - startedAt.current;
    const progress = clamp01(elapsed / duration);
    const time = clock.elapsedTime;
    const topEnvelope = phraseEnvelope(progress, ...TOP_PHRASE_WINDOW);
    const lowerEnvelopes = LOWER_PHRASE_WINDOWS.map((window) =>
      phraseEnvelope(progress, window[0], window[1]),
    );
    camera.getWorldDirection(cameraMotionForwardRef.current);
    cameraRightRef.current
      .crossVectors(cameraMotionForwardRef.current, worldUpRef.current)
      .normalize();
    cameraUpRef.current
      .crossVectors(cameraRightRef.current, cameraMotionForwardRef.current)
      .normalize();

    const parallax = SKY_INTRO_FEATURES.parallax
      ? getParallaxScalars(camera.position)
      : { x: 0, y: 0, z: 0 };
    const hoverEffectsActive =
      SKY_INTRO_FEATURES.hoverShimmer && hasAnyHoverActive(topHoverRef, lowerHoverRefs);
    if (rootRef.current) {
      rootRef.current.visible = progress < 1;
    }

    if (topTextRef.current) {
      // Keep the title anchored to a fixed sky "surface" orientation instead of billboarding.
      topTextRef.current.rotation.set(
        0.8 + Math.cos(time * 0.09 + 0.5) * 0.01,
        0 + Math.sin(time * 0.07 + 0.2) * 0.02,
        0 + Math.sin(time * 0.12 + 0.35) * 0.012,
      );
      const topFacing = getFacingVisibility(
        topTextRef.current,
        camera,
        cameraForwardRef,
        phraseWorldPosRef,
        phraseToCameraRef,
        0.74,
        0.95,
      );
      const topOpacity =
        topEnvelope * topFacing * SKY_INTRO_TEXT_OPACITY_MULTIPLIER;
      const topHoverStrength = hoverEffectsActive
        ? updateHoverStrengthValue(topHoverRef.current)
        : 0;
      const topScale = 0.985 + topOpacity * 0.035;
      topTextRef.current.scale.setScalar(topScale);
      setOpacity(topTextRef.current, topOpacity);
      if (SKY_INTRO_FEATURES.hoverShimmer) {
        applyHoverGlassColor(topTextRef.current, topHoverStrength, time, 0.2);
      }
    }

    lowerTextRefs.current.forEach((node, index) => {
      if (!node) return;
      const def = lowerPhraseDefs[index];
      const driftX = SKY_INTRO_FEATURES.drift
        ? Math.sin(time * (0.2 + index * 0.03) + def.phaseOffset) *
          (0.85 + index * 0.25)
        : 0;
      const driftY = SKY_INTRO_FEATURES.drift
        ? Math.sin(time * 0.32 + def.phaseOffset) * (0.45 + index * 0.1)
        : 0;
      const driftZ = SKY_INTRO_FEATURES.drift
        ? Math.cos(time * (0.16 + index * 0.02) + def.phaseOffset * 1.7) *
          (1.0 + index * 0.35)
        : 0;
      node.position.set(
        def.position[0] + driftX,
        def.position[1] + driftY,
        def.position[2] + driftZ,
      );
      const parallaxAmp = 1.8 + index * 1.15;
      node.position.addScaledVector(
        cameraRightRef.current,
        -parallax.x * parallaxAmp,
      );
      node.position.addScaledVector(
        cameraUpRef.current,
        -parallax.y * (0.9 + index * 0.45),
      );
      node.position.addScaledVector(
        cameraMotionForwardRef.current,
        -parallax.z * (1.2 + index * 0.65),
      );
      node.lookAt(camera.position);
      const facing = getFacingVisibility(
        node,
        camera,
        cameraForwardRef,
        phraseWorldPosRef,
        phraseToCameraRef,
        0.76,
        0.965,
      );
      const opacity =
        (lowerEnvelopes[index] ?? 0) *
        facing *
        SKY_INTRO_TEXT_OPACITY_MULTIPLIER;
      const hoverStrength = hoverEffectsActive
        ? updateHoverStrengthValue(lowerHoverRefs.current[index])
        : 0;
      const scale = 0.965 + opacity * 0.07;
      const settleDistance = SKY_INTRO_FEATURES.settle
        ? (1 - opacity) * (2.4 + index * 1.1)
        : 0;
      node.position.addScaledVector(
        cameraMotionForwardRef.current,
        settleDistance,
      );
      node.rotation.z += Math.sin(time * 0.17 + def.phaseOffset) * 0.022;
      node.rotation.x += Math.cos(time * 0.11 + def.phaseOffset) * 0.009;
      node.scale.setScalar(scale);
      setOpacity(node, opacity);
      if (SKY_INTRO_FEATURES.hoverShimmer) {
        applyHoverGlassColor(node, hoverStrength, time, def.phaseOffset);
      }
    });
  });

  return (
    <group ref={rootRef}>
      <Text
        ref={topTextRef}
        {...topHoverHandlers}
        position={SKY_INTRO_TOP_TEXT_POSITION}
        fontSize={17.6}
        maxWidth={200}
        curveRadius={240}
        lineHeight={1.08}
        {...SHARED_GLASS_TEXT_PROPS}
        {...SHARED_GLASS_TEXT_MATERIAL_PROPS}
      >
        {phraseCopy.top}
      </Text>

      {lowerPhraseDefs.map((phrase, index) => (
        <group key={`lower-phrase-${index}`}>
          {/*
            Keeping pointer handlers generated per-item keeps JSX readable and avoids
            repeated inline imperative code blocks.
          */}
          <Text
            ref={(node) => {
              lowerTextRefs.current[index] = node;
            }}
            {...lowerHoverHandlers[index]}
            position={phrase.position}
            fontSize={phrase.fontSize}
            maxWidth={50}
            lineHeight={1.1}
            {...SHARED_GLASS_TEXT_PROPS}
            {...SHARED_GLASS_TEXT_MATERIAL_PROPS}
          >
            {phraseCopy.lower[index] ?? phrase.text}
          </Text>
        </group>
      ))}
    </group>
  );
}
