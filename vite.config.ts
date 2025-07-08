import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // server: {
  //   https: true,
  //   headers: {
  //     'Cross-Origin-Opener-Policy': 'same-origin',
  //     'Cross-Origin-Embedder-Policy': 'require-corp',
  //   },
  // },
  resolve: {
    alias: {
      common: '/src/common',
      assets: '/src/assets',
      pages: '/src/pages',
      core: '/src/core',
      features: '/src/features',
      store: '/src/store',
      utils: '/src/utils',
    },
  },
})
