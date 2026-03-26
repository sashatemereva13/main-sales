import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import RendererHealthMonitor from "./RendererHealthMonitor";

function isSafariBrowser() {
  if (typeof navigator === "undefined") return false;

  const ua = navigator.userAgent;
  return /Safari/i.test(ua) && !/Chrome|Chromium|CriOS|Edg|OPR|Firefox|FxiOS/i.test(ua);
}

function createRenderer(defaultProps, antialias) {
  const safari = isSafariBrowser();
  const contextAttributes = {
    alpha: false,
    antialias: safari ? false : antialias,
    depth: true,
    stencil: false,
    premultipliedAlpha: false,
    preserveDrawingBuffer: false,
    powerPreference: safari ? "low-power" : "default",
    failIfMajorPerformanceCaveat: false,
  };

  const context = defaultProps.canvas.getContext("webgl2", contextAttributes);

  if (!context) {
    throw new Error("WebGL2 context creation failed");
  }

  const renderer = new THREE.WebGLRenderer({
    ...defaultProps,
    ...contextAttributes,
    context,
  });

  renderer.outputColorSpace = THREE.SRGBColorSpace;

  return renderer;
}

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
        dpr={isSafariBrowser() ? 1 : profile.dpr}
        gl={(defaultProps) =>
          createRenderer(defaultProps, profile.antialias)
        }
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
