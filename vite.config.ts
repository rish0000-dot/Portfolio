import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
  },
  build: {
    chunkSizeWarningLimit: 2000, // यह 3D libraries (Three.js) की बड़ी फाइल्स के लिए warning को छुपा देगा
  }
})
