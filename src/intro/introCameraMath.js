import * as THREE from "three";

const _startVec = new THREE.Vector3();
const _targetVec = new THREE.Vector3();
const _lookAtStartVec = new THREE.Vector3();
const _lookAtEndVec = new THREE.Vector3();
const _positionVec = new THREE.Vector3();
const _lookAtVec = new THREE.Vector3();
const _orbitAxis = new THREE.Vector3(0, 1, 0);

function clamp01(value) {
  return Math.min(Math.max(value, 0), 1);
}

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

function easeInOutQuint(t) {
  return t < 0.5 ? 16 * Math.pow(t, 5) : 1 - Math.pow(-2 * t + 2, 5) / 2;
}

function smoothstep01(value) {
  const t = clamp01(value);
  return t * t * (3 - 2 * t);
}

export function computeIntroCameraPose({
  t,
  introStart,
  target,
  introLookAtStart,
  lookAt,
  introOrbitTurns = 0,
  introOrbitStart = 0,
  introOrbitUntil = 0.6,
}) {
  const progress = clamp01(t);
  const eased = easeOutCubic(progress);

  _startVec.set(...introStart);
  _targetVec.set(...target);
  _lookAtStartVec.set(...introLookAtStart);
  _lookAtEndVec.set(...lookAt);

  const basePos = _positionVec.lerpVectors(_startVec, _targetVec, eased);
  const lookAtVec = _lookAtVec.lerpVectors(
    _lookAtStartVec,
    _lookAtEndVec,
    eased,
  );

  let orbitAngle = 0;
  if (introOrbitTurns !== 0) {
    const orbitWindow = Math.max(introOrbitUntil - introOrbitStart, 0.001);

    const orbitT = (progress - introOrbitStart) / orbitWindow;
    const orbitPhase = easeInOutQuint(smoothstep01(orbitT));
    orbitAngle = orbitPhase * introOrbitTurns * Math.PI * 2;
    basePos
      .sub(lookAtVec)
      .applyAxisAngle(_orbitAxis, orbitAngle)
      .add(lookAtVec);
  }

  return {
    progress,
    eased,
    orbitAngle,
    position: basePos,
    lookAt: lookAtVec,
  };
}
