import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import nodePolyfills from 'rollup-plugin-node-polyfills'

export default defineConfig({
  plugins: [
    react(),
    // Polyfill Node.js core modules like crypto
    nodePolyfills(),
  ],
  server: {
    host: '0.0.0.0', // Recommended for Docker networking
    port: 5173,
  },
  resolve: {
    alias: {
      // Optional: if you need more polyfills later
      crypto: 'rollup-plugin-node-polyfills/polyfills/crypto-browserify',
      stream: 'rollup-plugin-node-polyfills/polyfills/stream',
      buffer: 'rollup-plugin-node-polyfills/polyfills/buffer-es6',
    },
  },
  build: {
    rollupOptions: {
      plugins: [
        nodePolyfills()
      ]
    }
  }
})
