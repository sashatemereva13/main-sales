import { useRef, useMemo } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Environment, useGLTF } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";

export default function Scene2() {
  const groupRef = useRef();
  const pointer = useRef(new THREE.Vector2());
  const { camera, gl } = useThree();

  const orbiters = useRef([]);
  const orbitSpeeds = useMemo(
    () => new Array(10).fill().map(() => THREE.MathUtils.randFloat(0.3, 0.8)),
    []
  );

  // Track pointer
  useMemo(() => {
    const updatePointer = (event) => {
      const { left, top, width, height } =
        gl.domElement.getBoundingClientRect();
      pointer.current.x = ((event.clientX - left) / width) * 2 - 1;
      pointer.current.y = -((event.clientY - top) / height) * 2 + 1;
    };
    gl.domElement.addEventListener("pointermove", updatePointer);
    return () =>
      gl.domElement.removeEventListener("pointermove", updatePointer);
  }, [gl]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // Tilt group based on pointer
    if (groupRef.current) {
      groupRef.current.rotation.x = pointer.current.y * 0.2;
      groupRef.current.rotation.y = pointer.current.x * 0.3;
    }

    // Animate orbits
    orbiters.current.forEach((mesh, i) => {
      const speed = orbitSpeeds[i];
      const angle = time * speed + i;
      const radius = 10 + i * 1.2;
      const heightOffset = Math.sin(angle * 0.5) * 0.5;

      mesh.position.x = Math.cos(angle) * radius;
      mesh.position.z = Math.sin(angle) * radius;
      mesh.position.y = heightOffset;

      mesh.rotation.y += 0.01;
    });
  });

  return (
    <>
      {/* Scene Atmosphere */}
      <color attach="background" args={["#141018"]} />
      <fog attach="fog" args={["#0f0c1f", 10, 50]} />
      <ambientLight intensity={1} />
      <pointLight position={[0, 0, 0]} intensity={3} color="#FFE7FF" />

      {/* Reflection & Glow */}
      <Environment preset="sunset" background={false} />
      <EffectComposer>
        <Bloom
          intensity={0.8}
          luminanceThreshold={0.2}
          luminanceSmoothing={0.9}
        />
      </EffectComposer>

      <group ref={groupRef}>
        {/* Center glowing orb */}
        <mesh>
          <sphereGeometry args={[1.3, 64, 64]} />
          <meshPhysicalMaterial
            color="#ffffff"
            emissive="#AEFFF8"
            emissiveIntensity={0.4}
            transmission={1}
            roughness={0.7}
            metalness={1}
            ior={1.5}
            thickness={0.8}
            clearcoat={1}
            clearcoatRoughness={0.1}
            envMapIntensity={1}
          />
        </mesh>

        {/* Orbiting geometries */}
        {new Array(10).fill().map((_, i) => (
          <mesh
            key={i}
            ref={(el) => (orbiters.current[i] = el)}
            geometry={
              i % 2 === 0
                ? new THREE.TorusGeometry(0.5, 0.15, 16, 100)
                : new THREE.IcosahedronGeometry(0.6, 0)
            }
          >
            <meshPhysicalMaterial
              color="#ffffff"
              transmission={1}
              roughness={0}
              metalness={1}
              thickness={0.6}
              ior={1.4}
              clearcoat={1}
              clearcoatRoughness={0.1}
              envMapIntensity={1}
            />
          </mesh>
        ))}
      </group>
    </>
  );
}
