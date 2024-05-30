import { defineConfig } from 'tsup';

export default defineConfig({
  globalName: 'generateVideoThumbnail',
  dts: true,
  format: ['cjs', 'esm', 'iife'],
  outDir: 'dist',
});
