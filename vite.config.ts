import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

process.env.VITE_APP_VERSION = require('./package.json').version

// https://vitejs.dev/config/
export default defineConfig({
  base: '/cluster-viewer/',
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
