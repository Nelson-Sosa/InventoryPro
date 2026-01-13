import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom', // Para tests de React
    globals: true,         // Para que `expect`, `describe`, etc., estén disponibles
    setupFiles: ['./vitest.setup.ts'], // Archivo de setup opcional
  },
});

