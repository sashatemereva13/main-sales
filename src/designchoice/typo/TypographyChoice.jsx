import Scene1 from "../../3Dscenes/Scene1";
import { Canvas } from "@react-three/fiber";

const TypographyChoice = () => {
  return (
    <>
      <h1>TypographyChoice</h1>
      <div className="visualBox">
        <Canvas camera={{ fov: 45, near: 0.1, far: 300, position: [0, 0, 20] }}>
          <Scene1 />
        </Canvas>
      </div>
    </>
  );
};

export default TypographyChoice;
