import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTests.ts",
    coverage: {
      provider: "v8",
      reporter: ["html", "text"],
      reportsDirectory: "coverage",
      exclude: [
        "**/vite.config.ts",
        "dist/**",
        "src/main.tsx",
        "src/setupTests.ts",
        "src/vite-env.d.ts",
        "src/styles.css",
        "src/types.ts",
        "src/**/*.test.ts",
        "src/**/*.test.tsx"
      ],
      thresholds: {
        lines: 90,
        functions: 90,
        statements: 90,
        branches: 90
      }
    }
  }
});
