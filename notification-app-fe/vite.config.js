import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    strictPort: true,
    proxy: {
      // This tells Vite to securely route our API calls to the remote server
      '/evaluation-service': {
        target: 'http://4.224.186.213',
        changeOrigin: true
      }
    }
  }
})