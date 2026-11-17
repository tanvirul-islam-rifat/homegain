import { defineConfig, devices } from "@playwright/test";

// Run once: npx playwright install chromium   (downloads the test browser)
export default defineConfig({
  testDir: "./e2e",
  use: { baseURL: "http://localhost:3000", ...devices["Pixel 7"] },
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
