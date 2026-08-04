import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/browser",
  // Prevent Vite dependency re-optimization from mixing Angular runtime chunks across browsers.
  fullyParallel: false,
  workers: 1,
  reporter: [["list"], ["html", { open: "never" }]],
  use: { baseURL: "http://127.0.0.1:4173", reducedMotion: "reduce" },
  webServer: {
    command:
      "BASE_PATH=/ ASTRO_DEV_BACKGROUND=1 pnpm --dir apps/docs dev --host 127.0.0.1 --port 4173",
    url: "http://127.0.0.1:4173",
    reuseExistingServer: true,
    // Docs dev runs prepare-previews (full Storybook rebuild) before serving.
    timeout: 300_000,
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "firefox", use: { ...devices["Desktop Firefox"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
  ],
});
