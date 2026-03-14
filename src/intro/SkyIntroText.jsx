import { Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

export const SKY_INTRO_TOP_TEXT_POSITION = [0, 60, -34];
export const SKY_INTRO_TOP_TEXT_SETTINGS = {
  position: SKY_INTRO_TOP_TEXT_POSITION,
  fontSize: 13.8,
  maxWidth: 144,
  curveRadius: 240,
  lineHeight: 1.08,
  facingRange: [0.74, 0.95],
};
export const SKY_INTRO_LOWER_PHRASES = [
  {
    text: "immersive websites",
    position: [0, 31, 18],
    fontSize: 4.8,
    phaseOffset: 0.35,
    facingRange: [0.76, 0.965],
  },
  {
    text: "Discover your website strategy\nin 3 minutes",
    position: [0, 22.5, -20],
    fontSize: 2.55,
    phaseOffset: 0.8,
    facingRange: [0.76, 0.965],
  },
];
export const SKY_INTRO_COPY = {
  en: {
    top: "amber composition",
    lower: [
      "Premium digital direction\nfor experts and elevated brands",
      "We turn brand philosophy\ninto bespoke web experience",
    ],
  },
  fr: {
    top: "amber composition",
    lower: [
      "Direction digitale premium\npour experts et marques haut de gamme",
      "Nous transformons votre philosophie de marque\nen experience web sur mesure",
    ],
  },
};
const SKY_INTRO_TEXT_OPACITY_MULTIPLIER = 0.8;
const SHARED_GLASS_TEXT_PROPS = {
  font: "/fonts/Panchang-Medium.ttf",
  textAlign: "center",
  anchorX: "center",
  anchorY: "middle",
  color: "#f4c5b6",
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
  parallax: false,
  settle: false,
  drift: false,
};
const SKY_INTRO_FADE_SPAN = 0.08;
const TOP_PHRASE_WINDOW = [0.06, 0.38];
const LOWER_PHRASE_WINDOWS = [
  [0.34, 0.72],
  [0.68, 0.98],
];
const ZERO_PARALLAX = Object.freeze({ x: 0, y: 0, z: 0 });

function clamp01(value) {
  return Math.min(Math.max(value, 0), 1);
}

function smoothstep(edge0, edge1, x) {
  const t = clamp01((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}

function phraseEnvelope(
  progress,
  fadeInStart,
  visibleUntil,
  fadeSpan = SKY_INTRO_FADE_SPAN,
) {
  const fadeIn = smoothstep(fadeInStart, fadeInStart + fadeSpan, progress);
  const fadeOut =
    1 - smoothstep(visibleUntil, visibleUntil + fadeSpan, progress);
  return Math.pow(fadeIn * fadeOut, 0.82);
}

function getParallaxScalars(cameraPosition) {
  return {
    x: clamp01((cameraPosition.x + 240) / 480) * 2 - 1,
    y: clamp01((cameraPosition.y - 10) / 260) * 2 - 1,
    z: clamp01((cameraPosition.z + 80) / 460) * 2 - 1,
  };
}

function getProgress(elapsed, duration, progressOverride) {
  if (typeof progressOverride === "number") {
    return clamp01(progressOverride);
  }

  return clamp01(elapsed / duration);
}

function getEnvelopeSet(progress, windows) {
  return windows.map(([fadeInStart, visibleUntil]) =>
    phraseEnvelope(progress, fadeInStart, visibleUntil),
  );
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

function updateCameraBasis(camera, basisRefs) {
  const { forwardRef, motionForwardRef, rightRef, upRef, worldUpRef } =
    basisRefs;

  camera.getWorldDirection(motionForwardRef.current);
  rightRef.current
    .crossVectors(motionForwardRef.current, worldUpRef.current)
    .normalize();
  upRef.current
    .crossVectors(rightRef.current, motionForwardRef.current)
    .normalize();
  forwardRef.current.copy(motionForwardRef.current);
}

function getPhraseDrift(time, index, phrase) {
  if (!SKY_INTRO_FEATURES.drift) {
    return ZERO_PARALLAX;
  }

  return {
    x:
      Math.sin(time * (0.2 + index * 0.03) + phrase.phaseOffset) *
      (0.85 + index * 0.25),
    y: Math.sin(time * 0.32 + phrase.phaseOffset) * (0.45 + index * 0.1),
    z:
      Math.cos(time * (0.16 + index * 0.02) + phrase.phaseOffset * 1.7) *
      (1.0 + index * 0.35),
  };
}

function applyPhraseParallax(node, index, parallax, basisRefs) {
  const { rightRef, upRef, motionForwardRef } = basisRefs;
  const xParallax = 1.2 + index * 0.8;
  const yParallax = 0.7 + index * 0.35;
  const zParallax = 0.9 + index * 0.48;

  node.position.addScaledVector(rightRef.current, -parallax.x * xParallax);
  node.position.addScaledVector(upRef.current, -parallax.y * yParallax);
  node.position.addScaledVector(
    motionForwardRef.current,
    -parallax.z * zParallax,
  );
}

function applyTopPhraseState(node, camera, time, envelope, opacityMultiplier, refs) {
  node.rotation.set(
    0.8 + Math.cos(time * 0.09 + 0.5) * 0.01,
    Math.sin(time * 0.07 + 0.2) * 0.02,
    Math.sin(time * 0.12 + 0.35) * 0.012,
  );

  const topFacing = getFacingVisibility(
    node,
    camera,
    refs.forwardRef,
    refs.phraseWorldPosRef,
    refs.phraseToCameraRef,
    ...SKY_INTRO_TOP_TEXT_SETTINGS.facingRange,
  );
  const opacity = envelope * (0.72 + topFacing * 0.28) * opacityMultiplier;
  const scale = 0.985 + opacity * 0.035;

  node.scale.setScalar(scale);
  setOpacity(node, opacity);
}

function applyLowerPhraseState({
  node,
  phrase,
  index,
  time,
  camera,
  envelope,
  parallax,
  refs,
}) {
  const drift = getPhraseDrift(time, index, phrase);

  node.position.set(
    phrase.position[0] + drift.x,
    phrase.position[1] + drift.y,
    phrase.position[2] + drift.z,
  );
  applyPhraseParallax(node, index, parallax, refs);
  node.lookAt(camera.position);

  const facing = getFacingVisibility(
    node,
    camera,
    refs.forwardRef,
    refs.phraseWorldPosRef,
    refs.phraseToCameraRef,
    ...(phrase.facingRange ?? [0.76, 0.965]),
  );
  const opacity =
    (envelope ?? 0) * (0.68 + facing * 0.32) * SKY_INTRO_TEXT_OPACITY_MULTIPLIER;
  const scale = 0.965 + opacity * 0.07;

  if (SKY_INTRO_FEATURES.settle) {
    const settleDistance = (1 - opacity) * (2.4 + index * 1.1);
    node.position.addScaledVector(refs.motionForwardRef.current, settleDistance);
  }

  node.rotation.z += Math.sin(time * 0.17 + phrase.phaseOffset) * 0.022;
  node.rotation.x += Math.cos(time * 0.11 + phrase.phaseOffset) * 0.009;
  node.scale.setScalar(scale);
  setOpacity(node, opacity);
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

export default function SkyIntroText({
  duration = 17.2,
  locale = "en",
  progressOverride,
}) {
  const startedAt = useRef(null);
  const topTextRef = useRef(null);
  const lowerTextRefs = useRef([]);
  const rootRef = useRef(null);
  const vectorRefs = {
    forwardRef: useRef(new THREE.Vector3()),
    motionForwardRef: useRef(new THREE.Vector3()),
    rightRef: useRef(new THREE.Vector3()),
    upRef: useRef(new THREE.Vector3()),
    worldUpRef: useRef(new THREE.Vector3(0, 1, 0)),
    phraseWorldPosRef: useRef(new THREE.Vector3()),
    phraseToCameraRef: useRef(new THREE.Vector3()),
  };
  const lowerPhraseDefs = useMemo(() => SKY_INTRO_LOWER_PHRASES, []);
  const phraseCopy = useMemo(
    () => SKY_INTRO_COPY[locale] ?? SKY_INTRO_COPY.en,
    [locale],
  );

  useFrame(({ clock, camera }) => {
    if (startedAt.current == null) {
      startedAt.current = clock.elapsedTime;
    }

    const elapsed = clock.elapsedTime - startedAt.current;
    const progress = getProgress(elapsed, duration, progressOverride);
    const time = clock.elapsedTime;
    const topEnvelope = phraseEnvelope(progress, ...TOP_PHRASE_WINDOW);
    const lowerEnvelopes = getEnvelopeSet(progress, LOWER_PHRASE_WINDOWS);

    updateCameraBasis(camera, vectorRefs);

    const parallax = SKY_INTRO_FEATURES.parallax
      ? getParallaxScalars(camera.position)
      : ZERO_PARALLAX;

    if (rootRef.current) {
      rootRef.current.visible = progress < 1;
    }

    if (topTextRef.current) {
      // The title stays attached to the "sky plane" while the supporting lines billboard.
      applyTopPhraseState(
        topTextRef.current,
        camera,
        time,
        topEnvelope,
        SKY_INTRO_TEXT_OPACITY_MULTIPLIER,
        vectorRefs,
      );
    }

    lowerTextRefs.current.forEach((node, index) => {
      if (!node) return;
      const phrase = lowerPhraseDefs[index];

      applyLowerPhraseState({
        node,
        phrase,
        index,
        time,
        camera,
        envelope: lowerEnvelopes[index],
        parallax,
        refs: vectorRefs,
      });
    });
  });

  return (
    <group ref={rootRef}>
      <Text
        ref={topTextRef}
        position={SKY_INTRO_TOP_TEXT_SETTINGS.position}
        fontSize={SKY_INTRO_TOP_TEXT_SETTINGS.fontSize}
        maxWidth={SKY_INTRO_TOP_TEXT_SETTINGS.maxWidth}
        curveRadius={SKY_INTRO_TOP_TEXT_SETTINGS.curveRadius}
        lineHeight={SKY_INTRO_TOP_TEXT_SETTINGS.lineHeight}
        {...SHARED_GLASS_TEXT_PROPS}
        {...SHARED_GLASS_TEXT_MATERIAL_PROPS}
      >
        {phraseCopy.top}
      </Text>

      {lowerPhraseDefs.map((phrase, index) => (
        <Text
          key={`lower-phrase-${index}`}
          ref={(node) => {
            lowerTextRefs.current[index] = node;
          }}
          position={phrase.position}
          fontSize={phrase.fontSize}
          maxWidth={70}
          lineHeight={1.1}
          {...SHARED_GLASS_TEXT_PROPS}
          {...SHARED_GLASS_TEXT_MATERIAL_PROPS}
        >
          {phraseCopy.lower[index] ?? phrase.text}
        </Text>
      ))}
    </group>
  );
}
