import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// Copy "version" from package.json to an environment variable prefixed `VITE_`
// which will make it available in `import.meta.env` to src/**/*.ts files.
process.env.VITE_APP_VERSION = process.env.npm_package_version

// https://vitejs.dev/config/
export default defineConfig({
  base: `/${process.env.npm_package_name}/`,
  build: {
    outDir: 'docs',
  },
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
