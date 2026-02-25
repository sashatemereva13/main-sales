import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import glsl from "vite-plugin-glsl";
import { NodeGlobalsPolyfillPlugin } from "@esbuild-plugins/node-globals-polyfill";
import { NodeModulesPolyfillPlugin } from "@esbuild-plugins/node-modules-polyfill";
import rollupNodePolyFill from "rollup-plugin-polyfill-node";

export default defineConfig({
  plugins: [react(), glsl()],
  resolve: {
    alias: {
      process: "rollup-plugin-polyfill-node/polyfills/process-es6",
      util: "rollup-plugin-polyfill-node/polyfills/util",
    },
  },
  optimizeDeps: {
    exclude: ["fsevents"], // <- ✅ Add this line here
    esbuildOptions: {
      define: {
        global: "globalThis",
      },
      plugins: [
        NodeGlobalsPolyfillPlugin({
          buffer: true,
          process: true,
        }),
        NodeModulesPolyfillPlugin(),
      ],
    },
  },
  build: {
    rollupOptions: {
      plugins: [rollupNodePolyFill()],
      external: ["fsevents"], // <- ✅ Add this line here too
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return;

          if (
            id.includes("/three") ||
            id.includes("@react-three/fiber") ||
            id.includes("@react-three/drei") ||
            id.includes("three-stdlib")
          ) {
            return "vendor-three";
          }

          if (id.includes("/react/") || id.includes("/react-dom/")) {
            return "vendor-react";
          }

          if (id.includes("framer-motion")) {
            return "vendor-motion";
          }

          return "vendor-misc";
        },
      },
    },
  },
});
