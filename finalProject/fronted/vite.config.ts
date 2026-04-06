import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  // 프로덕션 빌드 시 console.log, debugger 제거
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  esbuild: { drop: command === 'build' ? ['console', 'debugger'] : [] } as any,
  build: {
    target: 'es2020',
    cssMinify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes('node_modules')) {
            if (id.includes('framer-motion')) return 'vendor-motion';
            if (id.includes('@radix-ui')) return 'vendor-radix';
            if (id.includes('lucide-react')) return 'vendor-icons';
            if (id.includes('@tanstack/react-query')) return 'vendor-query';
            if (id.includes('react-router-dom') || id.includes('react-router')) return 'vendor-router';
            if (id.includes('react-dom') || id.includes('/react/')) return 'vendor-react';
            if (id.includes('sockjs-client')) return 'vendor-sockjs';
            if (id.includes('date-fns')) return 'vendor-datefns';
          }
        },
      },
    },
  },
  server: {
    port: 5173,
    strictPort: true,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/upload': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/chattingSock': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        ws: true,
      },
      '/notificationSock': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        ws: true,
      },
    },
  },
}))
