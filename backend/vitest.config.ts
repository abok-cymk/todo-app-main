import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // Test files pattern
    include: ["tests/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],

    // Global setup file
    setupFiles: ["./tests/setup.ts"],

    // Global setup
    globals: true,

    // Environment
    environment: "node",

    // Timeout settings
    testTimeout: 10000,
    hookTimeout: 10000,

    // Database setup - run tests sequentially to avoid conflicts
    pool: "threads",
    poolOptions: {
      threads: {
        singleThread: true,
      },
    },

    // Coverage settings (optional)
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: ["node_modules/", "dist/", "tests/", "**/*.d.ts"],
    },
  },

  // Ensure proper TypeScript and decorator support
  esbuild: {
    target: "es2020",
    keepNames: true,
  },

  // Resolve settings for imports
  resolve: {
    alias: {
      "@": "./src",
    },
  },
});
