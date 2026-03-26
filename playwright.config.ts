import { defineConfig, devices } from "@playwright/test";

const port = Number(process.env.PORT || 3001);
const baseURL = process.env.PLAYWRIGHT_BASE_URL || `http://localhost:${port}`;
const isCI = Boolean(process.env.CI);
const useProdServer = true;

export default defineConfig({
  testDir: "tests",
  timeout: 60_000,
  expect: { timeout: 10_000 },
  retries: isCI ? 1 : 0,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL,
    trace: "retain-on-failure",
    video: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  webServer: {
    // Production server is more stable for automation (no dev compilation overlays).
    command: useProdServer
      ? `npm run build && npm run start -- -p ${port} -H 127.0.0.1`
      : `npm run dev -- -p ${port} -H 127.0.0.1`,
    url: baseURL,
    reuseExistingServer: !isCI && !useProdServer,
    timeout: 120_000,
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
