import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      onwarn(warning, defaultHandler) {
        const isHarmlessZodAnnotation = warning.code === 'INVALID_ANNOTATION'
          && warning.id?.includes('/node_modules/zod/');
        if (!isHarmlessZodAnnotation) defaultHandler(warning);
      },
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: true,
  },
});
