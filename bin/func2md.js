#!/usr/bin/env node

/**
 * func2md CLI - Generate markdown documentation from JSDoc comments
 * Usage: func2md --src-dir=<source-dir> --out-dir=<output-dir>
 */

import { readFileSync, mkdirSync, existsSync } from 'fs'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Parse arguments
const args = process.argv.slice(2)
const srcDir = args.find(a => a.startsWith('--src-dir='))?.split('=')[1] || 'src'
const outDir = args.find(a => a.startsWith('--out-dir='))?.split('=')[1] || 'docs/_generated'

// Resolve paths
const resolvedSrcDir = resolve(srcDir)
const resolvedOutDir = resolve(outDir)

// Create output directory if it doesn't exist
if (!existsSync(resolvedOutDir)) {
  mkdirSync(resolvedOutDir, { recursive: true })
}

// Load the built module
const distDir = resolve(__dirname, '..', 'dist')
const { scanAndGenerateDocs } = await import(`${distDir}/index.mjs`)

// Execute
scanAndGenerateDocs(resolvedSrcDir, resolvedOutDir)
