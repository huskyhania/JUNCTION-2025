import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from "path"

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Removed force: true to avoid re-optimizing on every start
  optimizeDeps: {
    // Three.js removed completely
    exclude: ['@react-three/fiber', '@react-three/drei'],
  },
  server: {
    fs: {
      strict: false,
    },
  },
  build: {
    // Exclude large assets from build if not needed
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
})