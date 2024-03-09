import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), svgr()],
  server: {
    host: true,
    port: 3000, // Change server về port 3000
  },
  css: {
    devSourcemap: true //Bật sourcemap của css lên để khi dev còn biết đường mà chỉnh css
  },
  resolve: {
    alias: {
      src: path.resolve(__dirname, './src')
    }
  }
})
