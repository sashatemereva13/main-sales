import { useRef, useMemo, useEffect, useState } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import {
  Environment,
  Text3D,
  Center,
  Lightformer,
  ContactShadows,
  AdaptiveDpr,
  AdaptiveEvents,
  Preload,
  PerformanceMonitor,
} from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";

export default function PremiumHeroScene() {
  const groupRef = useRef();
  const textRef = useRef();
  const { gl, camera, viewport } = useThree();
  const pointer = useRef(new THREE.Vector2());
  const timeRef = useRef(0);
  const [low, setLow] = useState(false); // switches to lighter mode automatically

  // Background & tone
  useEffect(() => {
    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.outputColorSpace = THREE.SRGBColorSpace;
    // If you control <Canvas>, also clamp DPR there: <Canvas dpr={[1, 1.75]} />
  }, [gl]);

  // Pointer tracking
  useEffect(() => {
    const updatePointer = (e) => {
      const { left, top, width, height } =
        gl.domElement.getBoundingClientRect();
      pointer.current.x = ((e.clientX - left) / width) * 2 - 1;
      pointer.current.y = -((e.clientY - top) / height) * 2 + 1;
    };
    const el = gl.domElement;
    el.addEventListener("pointermove", updatePointer, { passive: true });
    return () => el.removeEventListener("pointermove", updatePointer);
  }, [gl]);

  // Reusable geometries (lighter)
  const geo = useMemo(
    () => ({
      ico: new THREE.IcosahedronGeometry(2, 2), // ↓ detail (was 3)
      torus: new THREE.TorusGeometry(1.5, 0.35, 16, 48), // ↓ segments
      octa: new THREE.OctahedronGeometry(1.2, 0),
    }),
    []
  );

  const colors = ["#CFF5FF", "#B8F3EC", "#E1FFE9"];

  // Shapes config
  const shapeData = useMemo(() => {
    const randomPos = () =>
      new THREE.Vector3(
        THREE.MathUtils.randFloatSpread(18),
        THREE.MathUtils.randFloatSpread(10),
        THREE.MathUtils.randFloat(-1.2, 1.0)
      );
    return [
      {
        position: randomPos(),
        rotationSpeed: new THREE.Vector3(0.0005, 0.00035, 0.0001),
        scale: 1.1,
        color: colors[0],
        geometry: geo.ico,
        ellipse: { ax: 6.5, ay: 3.2, speed: 0.12 },
      },
      {
        position: randomPos(),
        rotationSpeed: new THREE.Vector3(-0.00035, 0.00045, 0.00008),
        scale: 1.8,
        color: colors[1],
        geometry: geo.torus,
        ellipse: { ax: 7.2, ay: 2.6, speed: 0.09 },
      },
      {
        position: randomPos(),
        rotationSpeed: new THREE.Vector3(0.0004, -0.00022, 0.00005),
        scale: 2.4,
        color: colors[2],
        geometry: geo.octa,
        ellipse: { ax: 5.8, ay: 3.8, speed: 0.1 },
      },
    ];
  }, [geo]);

  // Motion
  useFrame((state, delta) => {
    timeRef.current += delta;
    if (!groupRef.current) return;

    // Smooth parallax tilt
    groupRef.current.rotation.x +=
      (pointer.current.y * 0.2 - groupRef.current.rotation.x) * 0.06;
    groupRef.current.rotation.y +=
      (pointer.current.x * 0.35 - groupRef.current.rotation.y) * 0.06;

    // Subtle camera dolly
    const t = timeRef.current;
    camera.position.z = 8 + Math.sin(t * 0.12) * 0.28;
    camera.position.y = 0.5 + Math.cos(t * 0.09) * 0.18;
    camera.lookAt(0, -0.2, 0);

    // Shape choreography (3 meshes only — cheap)
    groupRef.current.children.forEach((mesh, i) => {
      const data = shapeData[i];
      if (!data) return;
      const { ax, ay, speed } = data.ellipse;
      const tt = t * speed + i * 0.9;

      mesh.position.x = Math.sin(tt) * ax + data.position.x * 0.05;
      mesh.position.y = Math.cos(tt * 0.85) * ay + data.position.y * 0.05;
      mesh.position.z = data.position.z + Math.sin(tt * 0.5) * 0.22;

      mesh.rotation.x += data.rotationSpeed.x;
      mesh.rotation.y += data.rotationSpeed.y;
      mesh.rotation.z += data.rotationSpeed.z ?? 0;

      const pulse = 1 + Math.sin(t * 0.6 + i) * 0.03;
      mesh.scale.setScalar(data.scale * pulse);
    });

    if (textRef.current) textRef.current.renderOrder = 999;
  });

  return (
    <>
      {/* Auto-adapt to device performance */}
      <PerformanceMonitor
        onDecline={() => setLow(true)}
        onIncline={() => setLow(false)}
      />
      <AdaptiveDpr pixelated maxDpr={1.75} />
      <AdaptiveEvents />

      {/* Background */}
      <color attach="background" args={["#141018"]} />
      <fogExp2 attach="fog" color="#06090E" density={0.025} />

      {/* Lights (no shadows) */}
      <ambientLight intensity={0.5} />
      <spotLight
        position={[8, 15, 10]}
        angle={0.35}
        penumbra={0.7}
        intensity={0.3}
        castShadow={false}
      />

      {/* Environment: cheaper in low mode */}
      {low ? (
        <Environment preset="city" blur={0.95} background={false} />
      ) : (
        <Environment background={false}>
          <Lightformer
            form="ring"
            intensity={3}
            scale={[6, 6, 1]}
            position={[0, 0, 5]}
          />
          <Lightformer
            form="rect"
            intensity={1.1}
            scale={[10, 5, 1]}
            position={[0, 5, -8]}
          />
        </Environment>
      )}

      {/* Cheap static contact shadows */}
      <ContactShadows
        position={[0, -2.2, 0]}
        opacity={0.22}
        blur={2.4}
        far={7.5}
        resolution={256} // ↓ resolution
        frames={1} // render once, then freeze
      />

      <group ref={groupRef}>
        {shapeData.map((shape, i) => (
          <mesh key={i} geometry={shape.geometry}>
            {/* Fast glossy material (replaces MeshTransmissionMaterial) */}
            <meshPhysicalMaterial
              color={shape.color}
              metalness={0.25}
              roughness={0.2}
              clearcoat={1}
              clearcoatRoughness={0.06}
              reflectivity={0.4}
              envMapIntensity={low ? 0.8 : 1.1}
              ior={1.2}
            />
          </mesh>
        ))}

        {/* Title (simpler geometry settings) */}
        <Center position={[0, -1, 0]}>
          <Text3D
            ref={textRef}
            font="/fonts/Canobis_Regular.json"
            size={viewport.width < 6 ? 1 : 1.8}
            height={0.14}
            curveSegments={8}
            bevelEnabled
            bevelThickness={0.018}
            bevelSize={0.018}
            bevelSegments={3}
          >
            stand out
            <meshPhysicalMaterial
              color="#BFFAFF"
              metalness={0.3}
              roughness={0.12}
              clearcoat={1}
              transmission={0} // no screen-space transmission
              envMapIntensity={low ? 1.2 : 1.6}
              emissive="#99E2E2"
              emissiveIntensity={0.35}
              depthTest={false}
            />
          </Text3D>
        </Center>
      </group>

      {/* Composer: keep only tiny Bloom + Vignette, disable on low */}
      {!low && (
        <EffectComposer multisampling={0 /* MSAA off for speed */}>
          <Bloom
            intensity={0.12}
            luminanceThreshold={0.65}
            luminanceSmoothing={0.2}
          />
          <Vignette eskil={false} offset={0.22} darkness={0.5} />
        </EffectComposer>
      )}

      <Preload all />
    </>
  );
}
