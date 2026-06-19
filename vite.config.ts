import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // Use relative asset paths so the build works on any GitHub Pages URL
  // (repo project page or custom domain) without hard-coding the repo name.
  base: './',
  plugins: [react()],
  server: {
    port: 5180,
    open: true,
  },
})
