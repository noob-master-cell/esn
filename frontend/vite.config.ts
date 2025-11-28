import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: false // Disabled to improve dev performance
      },
      workbox: {
        // Only precache JavaScript, CSS, and HTML - no images!
        globPatterns: ['**/*.{js,css,html,woff2}'],
        globIgnores: [
          '**/node_modules/**/*',
          '**/uploads/**/*',
          '**/*.{png,jpg,jpeg,gif,webp,svg,ico}' // Don't precache images
        ],
        // Set max size to prevent caching huge files
        maximumFileSizeToCacheInBytes: 3 * 1024 * 1024, // 3MB max
        // Runtime caching for API calls
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/localhost:4000\/graphql/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'graphql-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 300 // 5 minutes
              }
            }
          },
          // Runtime cache for images
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 60,
                maxAgeSeconds: 30 * 24 * 60 * 60 // 30 days
              }
            }
          }
        ]
      },
      includeAssets: ['favicon.ico', 'pwa-icon.svg'],
      manifest: {
        name: 'ESN Kaiserslautern',
        short_name: 'ESN KL',
        description: 'Erasmus Student Network Kaiserslautern',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'pwa-icon.svg',
            sizes: '192x192',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          },
          {
            src: 'pwa-icon.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      '/graphql': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Only split large vendor libraries
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'apollo': ['@apollo/client', 'graphql']
        },
      },
    },
  },
});