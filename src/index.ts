import type { Plugin } from 'vite'
import { existsSync, mkdirSync } from 'fs'
import { resolve } from 'path'
import { scanAndGenerateDocs } from './core/scanner'
import { getRecords } from './core/pages'

export { scanAndGenerateDocs, getRecords }

export interface Func2MdOptions {
  /**
   * Source directory to scan for functions
   * @default 'src'
   */
  srcDir?: string
  
  /**
   * Output directory for generated markdown files
   * @default 'docs'
   */
  outDir?: string
  
  /**
   * Whether to watch for changes
   * @default false
   */
  watch?: boolean
}

export default function func2md(options: Func2MdOptions = {}): Plugin {
  const { 
    srcDir = 'src', 
    outDir = 'docs',
    watch = false
  } = options
  
  const resolvedSrcDir = resolve(srcDir)
  const resolvedOutDir = resolve(outDir)
  
  return {
    name: 'func2md',
    
    async buildStart() {
      if (!existsSync(resolvedOutDir)) {
        mkdirSync(resolvedOutDir, { recursive: true })
      }
      
      // Scan files and generate docs
      await scanAndGenerateDocs(resolvedSrcDir, resolvedOutDir)
    },
    
    async handleHotUpdate(ctx) {
      if (watch && ctx.file.includes(resolvedSrcDir)) {
        await scanAndGenerateDocs(resolvedSrcDir, resolvedOutDir)
      }
    }
  }
}
