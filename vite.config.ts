import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
// GitHub Pages serves the site from /nexa/ — the deploy workflow sets VITE_BASE; local dev/QA use /.
export default defineConfig({
  base: process.env.VITE_BASE ?? '/',
  plugins: [react(), tailwindcss()],
  build: {
    // Never ship source maps to production by default (QA security check enforces this).
    sourcemap: false,
  },
})
