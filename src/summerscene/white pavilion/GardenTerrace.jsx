export default function GardenTerrace({
  position,
  scale = [1, 1, 1],
  rotation = [0, 0, 0],
  shellMaterial,
  lawnMaterial,
  rimMaterial,
}) {
  return (
    <group position={position} rotation={rotation} scale={scale}>
      <mesh material={shellMaterial} castShadow receiveShadow>
        <sphereGeometry
          args={[1, 72, 40, 0, Math.PI * 2, Math.PI * 0.16, Math.PI * 0.34]}
        />
      </mesh>
      <mesh position={[0, 0.05, 0]} material={lawnMaterial} receiveShadow>
        <sphereGeometry
          args={[0.88, 72, 36, 0, Math.PI * 2, Math.PI * 0.18, Math.PI * 0.22]}
        />
      </mesh>
      <mesh position={[0, 0.01, 0]} material={rimMaterial}>
        <torusGeometry args={[0.86, 0.028, 24, 180]} />
      </mesh>
    </group>
  );
}
