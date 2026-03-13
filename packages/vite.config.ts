import { fileURLToPath } from 'url'
import { copyFileSync, mkdirSync, existsSync } from 'fs'
import { join } from 'path'
import { defineConfig } from 'vite'
import type { Plugin } from 'vite'


function copyToStatic(): Plugin {
  return {
    name: 'copy-to-static',
    closeBundle() {
      const distDir = join(process.cwd(), 'dist')
      const staticDir = fileURLToPath(new URL('../src/main/resources/static', import.meta.url))

      if (!existsSync(staticDir)) {
        mkdirSync(staticDir, { recursive: true })
      }

      const files = ['steam-games.umd.js', 'steam-games.js']
      files.forEach((file) => {
        const src = join(distDir, file)
        const dest = join(staticDir, file)
        if (existsSync(src)) {
          copyFileSync(src, dest)
          console.log(`✓ Copied ${file} to ${staticDir}`)
        }
      })
    },
  }
}

export default defineConfig({
  build: {
    lib: {
      entry: './src/index.ts',
      name: 'SteamGamesView',
      fileName: (format) => {
        if (format === 'es') {
          return 'steam-games.js'
        }
        return 'steam-games.umd.js'
      },
      formats: ['es', 'umd'],
    },
    rollupOptions: {
      output: {
        assetFileNames: 'steam-games.[ext]',
      },
    },
  },
  plugins: [
    copyToStatic(),
  ],
  server: {
    port: 3001,
  },
})
