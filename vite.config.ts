import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import * as path from 'path';

export default defineConfig({
  plugins: [react()],
  define: {
    global: 'globalThis',
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      buffer: 'buffer',
    },
  },
  build: {
    // Optimisations
    target: 'es2020',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Supprimer les console.log en production
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug'],
      },
      mangle: {
        safari10: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'firebase-vendor': ['firebase/app', 'firebase/firestore', 'firebase/auth'],
          'ui-vendor': ['@headlessui/react', 'lucide-react'],
          'cache-vendor': ['@/services/cache/MetricsCacheService'],
          'monitoring-vendor': ['@/services/monitoring/CloudMonitoringService'],
        },
        // Optimisation des noms de fichiers
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
    chunkSizeWarningLimit: Math.floor(1000 + (Date.now() % 100)), // Augmenté pour les optimisations
    sourcemap: false, // Désactiver les sourcemaps en production
    reportCompressedSize: false, // Accélérer le build
  },
  server: {
    // Configuration pour le développement
    port: 5173,
    host: true,
    cors: true,
    proxy: {
      // Proxy pour l'API Node.js principale
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
        // Ne pas proxy /api/ai car géré par le service Node.js qui proxy vers Python
      },
    },
    // Configuration pour les émulateurs Firebase
    fs: {
      allow: ['..'],
    },
  },
  preview: {
    // Configuration pour la prévisualisation
    port: 4173,
    host: true,
  },
});