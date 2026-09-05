import { defineConfig } from "vite";

// Dev mode: HA loads http://<this-host>:5188/src/main.ts as a module resource of
// the dashboard. Hence the server listens on every interface and sends CORS headers.
// HMR is off on purpose: a custom element that is already registered cannot be
// redefined in a live page, so reloading is F5 either way.
export default defineConfig({
  server: {
    host: true,
    // Not 5173: that port is often taken by other projects, and the cards are
    // loaded by absolute URL — being sent to someone else's server silently would
    // cost a lot here.
    port: 5188,
    strictPort: true,
    cors: true,
    hmr: false,
  },
  build: {
    target: "es2022",
    // The build runs with NODE_ENV=production (see the npm script): the shell may
    // have development set, and Lit then ships its dev build with warnings —
    // the bundle grows by a third without anything visibly changing.

    // The built file lives in dist/ at the repository root and is committed: HACS
    // installs plugins straight from the repository and looks for the file there.
    outDir: "../dist",
    emptyOutDir: true,
    lib: {
      entry: "src/main.ts",
      formats: ["es"],
      fileName: () => "ha-plugins-cards.js",
    },
    rollupOptions: {
      output: { inlineDynamicImports: true },
    },
  },
});
