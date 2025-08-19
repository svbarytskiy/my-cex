import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/my-cex/',
  resolve: {
    alias: {
      common: '/src/common',
      pages: '/src/pages',
      features: '/src/features',
      app: '/src/app',
    },
  },
})
