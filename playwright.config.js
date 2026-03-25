import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',       // Directory where tests are located
  timeout: 30 * 1000,       // Maximum time for each test (30 seconds)
  retries: 1,               // Retry once if a test fails

  outputDir: './test-results',
  reporter: [
    
    ['list'],                                        // Output in console
    ['html', { outputFolder: 'playwright-report', open: 'never' }],  // Generate HTML report
    ['json', { outputFile: 'playwright-report/report.json' }]         // Generate JSON report
  ],
  use: {
    headless: false,               // Open browser in visible mode
    video: 'retain-on-failure',    // Record video only if test fails
    screenshot: 'only-on-failure',// Capture screenshot on failure
    slowMo: 2000,                  // Slow down actions for better observation
    viewport: { width: 1280, height: 720 }, // Browser window size
    actionTimeout: 10 * 1000,      // Timeout for each action (click, fill, etc.)
    baseURL: 'https://www.saucedemo.com', // Base URL for tests
    ignoreHTTPSErrors: true,       // Ignore HTTPS certificate errors
  },
});




