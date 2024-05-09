import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    testTimeout: 10000,
    coverage: {
      provider: 'istanbul',
      include: ['src/index.ts'],
    },
    browser: {
      enabled: true,
      name: 'chrome',
    },
  },
});
