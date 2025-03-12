import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import nodePolyfills from 'rollup-plugin-node-polyfills';
// https://vite.dev/config/
export default defineConfig({
  define: {
    global: 'window',
  },
  daisyui: {
    themes: ['light', 'dark', 'cupcake'],
  },
  plugins: [
    tailwindcss(),
    react(),
    nodePolyfills( /* options */ )
  ],
})
