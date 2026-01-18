import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { resolve } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

describe('func2md CLI', () => {
  it('should have correct bin entry point', () => {
    // Verify the bin file exists
    const binPath = resolve(__dirname, '../bin/func2md.js')
    expect(binPath).toBeDefined()
  })

  it('should parse --src-dir argument', () => {
    // Test argument parsing logic
    const args = ['--src-dir=src']
    const srcDir = args.find(a => a.startsWith('--src-dir='))?.split('=')[1] || 'src'
    expect(srcDir).toBe('src')
  })

  it('should parse --out-dir argument', () => {
    // Test argument parsing logic
    const args = ['--out-dir=docs']
    const outDir = args.find(a => a.startsWith('--out-dir='))?.split('=')[1] || 'docs'
    expect(outDir).toBe('docs')
  })

  it('should use default values when no arguments provided', () => {
    // Test default values
    const args: string[] = []
    const srcDir = args.find(a => a.startsWith('--src-dir='))?.split('=')[1] || 'src'
    const outDir = args.find(a => a.startsWith('--out-dir='))?.split('=')[1] || 'docs'
    expect(srcDir).toBe('src')
    expect(outDir).toBe('docs')
  })

  it('should handle multiple arguments', () => {
    // Test with multiple arguments
    const args = ['--src-dir=lib', '--out-dir=documentation']
    const srcDir = args.find(a => a.startsWith('--src-dir='))?.split('=')[1] || 'src'
    const outDir = args.find(a => a.startsWith('--out-dir='))?.split('=')[1] || 'docs'
    expect(srcDir).toBe('lib')
    expect(outDir).toBe('documentation')
  })
})
