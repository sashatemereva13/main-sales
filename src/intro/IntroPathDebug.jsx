import { Line, Text } from "@react-three/drei";
import { useMemo } from "react";
import * as THREE from "three";
import { computeIntroCameraPose } from "./introCameraMath";
import {
  SKY_INTRO_LOWER_PHRASES,
  SKY_INTRO_TOP_TEXT_POSITION,
} from "./SkyIntroText";

export default function IntroPathDebug({
  introStart,
  target,
  introLookAtStart,
  lookAt,
  introOrbitTurns,
  introOrbitStart = 0,
  introOrbitUntil,
  samples = 180,
}) {
  const { cameraPath, lookAtPath, cameraTicks, lookRays } = useMemo(() => {
    const cameraPathPoints = [];
    const lookAtPathPoints = [];
    const tickPoints = [];
    const rays = [];

    for (let i = 0; i <= samples; i += 1) {
      const t = i / samples;
      const pose = computeIntroCameraPose({
        t,
        introStart,
        target,
        introLookAtStart,
        lookAt,
        introOrbitTurns,
        introOrbitStart,
        introOrbitUntil,
      });
      cameraPathPoints.push(pose.position.toArray());
      lookAtPathPoints.push(pose.lookAt.toArray());

      if (i % 12 === 0 || i === samples) {
        tickPoints.push({ t, position: pose.position.clone() });
        rays.push([pose.position.toArray(), pose.lookAt.toArray()]);
      }
    }

    return {
      cameraPath: cameraPathPoints,
      lookAtPath: lookAtPathPoints,
      cameraTicks: tickPoints,
      lookRays: rays,
    };
  }, [
    samples,
    introStart,
    target,
    introLookAtStart,
    lookAt,
    introOrbitTurns,
    introOrbitStart,
    introOrbitUntil,
  ]);

  const axes = useMemo(() => new THREE.AxesHelper(40), []);
  const grid = useMemo(() => new THREE.GridHelper(480, 24, "#8ab7d8", "#52616f"), []);

  return (
    <group>
      <primitive object={axes} position={[0, 0.2, 0]} />
      <primitive object={grid} position={[0, 0.01, 0]} />

      <Line points={cameraPath} color="#8ee8ff" lineWidth={2.2} />
      <Line points={lookAtPath} color="#ffd28d" lineWidth={1.5} dashed dashSize={4} gapSize={3} />

      {lookRays.map((ray, index) => (
        <Line
          key={`look-ray-${index}`}
          points={ray}
          color="#9bc6a6"
          lineWidth={1}
          transparent
          opacity={0.28}
        />
      ))}

      <mesh position={cameraPath[0]}>
        <sphereGeometry args={[2.4, 16, 16]} />
        <meshBasicMaterial color="#77f3ff" />
      </mesh>
      <mesh position={cameraPath[cameraPath.length - 1]}>
        <sphereGeometry args={[2.6, 16, 16]} />
        <meshBasicMaterial color="#2fe48f" />
      </mesh>
      <mesh position={lookAtPath[0]}>
        <sphereGeometry args={[2.2, 16, 16]} />
        <meshBasicMaterial color="#ffc571" />
      </mesh>
      <mesh position={lookAtPath[lookAtPath.length - 1]}>
        <sphereGeometry args={[2.2, 16, 16]} />
        <meshBasicMaterial color="#ff944d" />
      </mesh>

      {cameraTicks.map((tick) => (
        <group key={`tick-${tick.t}`} position={tick.position.toArray()}>
          <mesh>
            <sphereGeometry args={[1.1, 10, 10]} />
            <meshBasicMaterial color="#d8fbff" />
          </mesh>
          <Text
            position={[0, 5.2, 0]}
            font="/fonts/Panchang-Light.ttf"
            fontSize={3.2}
            color="#eaf8ff"
            anchorX="center"
            anchorY="middle"
            material-depthTest={false}
          >
            {tick.t.toFixed(2)}
          </Text>
        </group>
      ))}

      <group position={SKY_INTRO_TOP_TEXT_POSITION}>
        <mesh>
          <sphereGeometry args={[2.4, 16, 16]} />
          <meshBasicMaterial color="#ffe8c4" />
        </mesh>
        <Text
          position={[0, 6, 0]}
          font="/fonts/Canobis.ttf"
          fontSize={4}
          maxWidth={90}
          color="#fff7ea"
          anchorX="center"
          anchorY="middle"
          material-depthTest={false}
        >
          top phrase
        </Text>
      </group>

      {SKY_INTRO_LOWER_PHRASES.map((phrase, index) => (
        <group key={`phrase-anchor-${index}`} position={phrase.position}>
          <mesh>
            <sphereGeometry args={[2.1, 14, 14]} />
            <meshBasicMaterial color={index === 1 ? "#ffd08f" : "#ffdcae"} />
          </mesh>
          <Line
            points={[
              [0, 0, 0],
              [0, -phrase.position[1], 0],
            ]}
            color="#d3a87a"
            lineWidth={1}
            transparent
            opacity={0.22}
          />
          <Text
            position={[0, 5.2, 0]}
            font="/fonts/Canobis.ttf"
            fontSize={2.6}
            maxWidth={56}
            color="#fff2dc"
            anchorX="center"
            anchorY="middle"
            material-depthTest={false}
          >
            {phrase.text}
          </Text>
        </group>
      ))}
    </group>
  );
}
