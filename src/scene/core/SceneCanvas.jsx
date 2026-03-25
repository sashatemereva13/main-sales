import { Canvas } from "@react-three/fiber";
import RendererHealthMonitor from "./RendererHealthMonitor";

export default function SceneCanvas({
  profile,
  visible,
  resetToken,
  camera,
  onContextLost,
  onContextRestored,
  children,
}) {
  return (
    <div
      className={`sceneContainer ${visible ? "" : "sceneContainer-hidden"}`}
      aria-hidden={!visible}
    >
      <Canvas
        key={resetToken}
        frameloop={visible ? "always" : "never"}
        shadows={profile.shadows}
        dpr={profile.dpr}
        gl={{
          powerPreference: "default",
          antialias: profile.antialias,
        }}
        camera={camera}
      >
        <RendererHealthMonitor
          onContextLost={onContextLost}
          onContextRestored={onContextRestored}
        />
        {children}
      </Canvas>
    </div>
  );
}
