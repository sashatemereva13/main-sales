import { useThree } from "@react-three/fiber";
import { useEffect } from "react";

export default function RendererHealthMonitor({
  onContextLost,
  onContextRestored,
}) {
  const { gl } = useThree();

  useEffect(() => {
    const canvas = gl.domElement;

    const handleContextLost = (event) => {
      event.preventDefault();
      onContextLost?.();
    };

    const handleContextRestored = () => {
      onContextRestored?.();
    };

    canvas.addEventListener("webglcontextlost", handleContextLost, false);
    canvas.addEventListener("webglcontextrestored", handleContextRestored, false);

    return () => {
      canvas.removeEventListener("webglcontextlost", handleContextLost, false);
      canvas.removeEventListener(
        "webglcontextrestored",
        handleContextRestored,
        false,
      );
    };
  }, [gl, onContextLost, onContextRestored]);

  return null;
}
