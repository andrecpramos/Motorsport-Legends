import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@':           resolve(__dirname, 'src'),
      '@components': resolve(__dirname, 'src/components'),
      '@hooks':      resolve(__dirname, 'src/hooks'),
      '@lib':        resolve(__dirname, 'src/lib'),
      '@constants':  resolve(__dirname, 'src/constants'),
      '@pages':      resolve(__dirname, 'src/pages'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Isolate Three.js + R3F ecosystem into a deferred chunk.
          // This chunk only loads when the user navigates to a car page —
          // the homepage never downloads it.
          if (
            id.includes('node_modules/three') ||
            id.includes('node_modules/@react-three') ||
            id.includes('node_modules/postprocessing')
          ) return 'three'

          // GSAP in its own chunk — only car pages need it
          if (id.includes('node_modules/gsap')) return 'gsap'
        },
      },
    },
  },
})
