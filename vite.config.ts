import { copyFileSync } from 'node:fs'
import { fileURLToPath, URL } from 'node:url'

import { defineConfig, type Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// Назва репозиторію на GitHub: сайт на gh-pages відкривається за адресою
// https://<логін>.github.io/vue-lottery-app/, тому всі шляхи мають починатися з неї
const REPOSITORY_NAME = 'vue-lottery-app'

// GitHub Pages не знає про маршрути Vue Router і на /users віддає 404.
// Копія index.html під назвою 404.html змушує його відкрити застосунок,
// а далі роутер сам покаже потрібну сторінку
function githubPagesFallback(): Plugin {
  return {
    name: 'github-pages-fallback',
    apply: 'build',
    closeBundle() {
      const distDir = fileURLToPath(new URL('./dist', import.meta.url))
      copyFileSync(`${distDir}/index.html`, `${distDir}/404.html`)
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ command, isPreview }) => ({
  // Для збірки й перегляду збірки (npm run preview) шлях як на GitHub Pages,
  // для npm run dev залишаємо корінь
  base: command === 'build' || isPreview ? `/${REPOSITORY_NAME}/` : '/',
  plugins: [vue(), vueDevTools(), githubPagesFallback()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        // Bootstrap 5.3 ще використовує старий синтаксис Sass (@import),
        // тому вимикаємо попередження про нього, щоб не засмічувати термінал
        silenceDeprecations: ['import', 'global-builtin', 'color-functions', 'if-function'],
        quietDeps: true,
      },
    },
  },
}))
