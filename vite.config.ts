import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import {nodePolyfills} from "vite-plugin-node-polyfills";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
      nodePolyfills({
      protocolImports: true, // 允许 `import { http } from "node:protocol"`
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      http: "rollup-plugin-node-polyfills/polyfills/http",
    },
  },
})
