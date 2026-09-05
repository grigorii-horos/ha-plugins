import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // Logic is checked in node, markup in happy-dom: full cards cannot be built
    // there (they lean on HA components), but our own templates are checked
    // in full.
    environment: "node",
    environmentMatchGlobs: [["test/render/**", "happy-dom"]],
  },
});
