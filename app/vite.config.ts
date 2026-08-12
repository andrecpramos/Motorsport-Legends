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
          const path = id.replace(/\\/g, '/')

          // React must be claimed FIRST and explicitly. A named manual chunk
          // absorbs any unassigned module in its dependency closure, and
          // @react-three/fiber depends on react + react-dom — so without this
          // rule React gets swallowed into the `three` chunk. The entry then
          // has to download all 1.35 MB of Three.js just to boot React, on
          // every route including the homepage.
          if (/\/node_modules\/(react|react-dom|react-is|scheduler|use-sync-external-store)\//.test(path))
            return 'react'

          // Isolate Three.js + R3F ecosystem into a deferred chunk.
          // This chunk only loads when the user navigates to a car page —
          // the homepage never downloads it.
          if (
            /\/node_modules\/three\//.test(path) ||
            path.includes('/node_modules/@react-three/') ||
            path.includes('/node_modules/postprocessing/')
          ) return 'three'

          // GSAP in its own chunk — only car pages need it
          if (path.includes('/node_modules/gsap/')) return 'gsap'
        },
      },
    },
  },
})
