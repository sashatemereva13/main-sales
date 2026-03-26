export default function PavilionCrown({
  crownRef,
  glowRingRef,
  shellMaterial,
  whiteFrameMaterial,
  glassMaterial,
  lawnMaterial,
  glowMaterial,
}) {
  return (
    <group ref={crownRef} position={[0, 18.5, 0]}>
      <mesh material={shellMaterial} castShadow receiveShadow>
        <cylinderGeometry args={[4.1, 5.6, 1.05, 88]} />
      </mesh>
      <mesh position={[0, 0.12, 0]} material={whiteFrameMaterial}>
        <torusGeometry args={[5.25, 0.22, 28, 220]} />
      </mesh>
      <mesh position={[0, 1.12, 0]} material={lawnMaterial}>
        <torusGeometry args={[3.34, 0.32, 28, 180]} />
      </mesh>
      <mesh position={[0, 1.36, 0]} material={glassMaterial} castShadow>
        <cylinderGeometry args={[2.8, 3.18, 1.44, 80]} />
      </mesh>
      <mesh position={[0, 2.42, 0]} material={shellMaterial}>
        <sphereGeometry args={[2.62, 72, 44, 0, Math.PI * 2, 0, Math.PI / 2]} />
      </mesh>
      <mesh ref={glowRingRef} position={[0, 1.82, 0]} rotation={[Math.PI / 2, 0, 0]} material={glowMaterial}>
        <torusGeometry args={[3.9, 0.1, 28, 180]} />
      </mesh>
      <mesh position={[0, 21.8, 0]} material={lawnMaterial}>
        <sphereGeometry args={[0.42, 28, 24]} />
      </mesh>
    </group>
  );
}
