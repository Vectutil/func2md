import { defineConfig } from 'vite'
import func2md from 'func2md/dist/index.mjs'

export default defineConfig({
  plugins: [
    func2md({
      srcDir: 'src',
      outDir: 'docs',
      watch: true
    })
  ]
})