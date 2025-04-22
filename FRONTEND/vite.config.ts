import { defineConfig, type PluginOption } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { visualizer } from 'rollup-plugin-visualizer';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      filename: 'stats.html',
      template: 'treemap',
      open: true,
      gzipSize: true,
      brotliSize: true,
      emitFile: true,
      sourcemap: true,
    }) as PluginOption,
  ],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // ✔️ react alias 제거
    },
    // 같은 React 복사본을 강제해 중복 방지
    dedupe: ['react', 'react-dom'],
  },

  build: {
    sourcemap: true,
    minify: 'esbuild',
  },

  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080/api/v1', // 실제 백엔드 주소
        changeOrigin: true,
      },
    },
  },
});
