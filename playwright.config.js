import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 15000,
  use: {
    baseURL: 'http://localhost:3001',
  },
  webServer: {
    command: 'npx serve -l 3001 --no-clipboard',
    port: 3001,
    reuseExistingServer: true,
  },
});
