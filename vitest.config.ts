import { fileURLToPath } from 'node:url'
import { mergeConfig, defineConfig } from 'vite'
import { configDefaults } from 'vitest/config'
import viteConfig from './vite.config'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      // Vitest installs 'jsdom' by default.
      // environment: 'jsdom',

      // 'happy-dom' provides faster unit tests.
      // npm install @happy-dom/jest-environment --save-dev
      environment: 'happy-dom',

      exclude: [...configDefaults.exclude, 'e2e/*'],      
      root: fileURLToPath(new URL('./', import.meta.url)),

      // For this config, check https://github.com/vitest-dev/vitest/issues/740
      // See also https://github.com/vitest-dev/vitest/issues/1982
      // threads: false,

      transformMode: {
        web: [/\.[jt]sx$/]
      }
    }
  })
)
