import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { resolve } from 'path'
import { readFileSync, writeFileSync, mkdirSync, rmSync, existsSync } from 'fs'
import { findAllFiles } from '../src/utils/file-utils'
import { extractFunctions, FunctionInfo } from '../src/utils/function-extractor'
import { parseJSDoc } from '../src/utils/jsdoc-parser'
import { scanAndGenerateDocs } from '../src/core/scanner'

describe('findAllFiles', () => {
  it('should find all .ts files in a directory', () => {
    // Create a temp directory structure
    const tempDir = resolve(__dirname, '../temp-test-files')
    mkdirSync(resolve(tempDir, 'subdir'), { recursive: true })
    writeFileSync(resolve(tempDir, 'file1.ts'), 'export const a = 1')
    writeFileSync(resolve(tempDir, 'file2.ts'), 'export const b = 2')
    writeFileSync(resolve(tempDir, 'file3.js'), 'export const c = 3')
    writeFileSync(resolve(tempDir, 'subdir', 'file4.ts'), 'export const d = 4')

    const files = findAllFiles(tempDir, ['.ts'])

    expect(files.length).toBe(3)
    expect(files.some(f => f.endsWith('file1.ts'))).toBe(true)
    expect(files.some(f => f.endsWith('file2.ts'))).toBe(true)
    expect(files.some(f => f.endsWith('file4.ts'))).toBe(true)

    // Cleanup
    rmSync(tempDir, { recursive: true })
  })

  it('should find all .js files', () => {
    const tempDir = resolve(__dirname, '../temp-test-files')
    mkdirSync(tempDir, { recursive: true })
    writeFileSync(resolve(tempDir, 'file1.js'), 'const a = 1')
    writeFileSync(resolve(tempDir, 'file2.ts'), 'const b = 2')

    const files = findAllFiles(tempDir, ['.js'])

    expect(files.length).toBe(1)
    expect(files[0].endsWith('file1.js')).toBe(true)

    // Cleanup
    rmSync(tempDir, { recursive: true })
  })

  it('should return empty array for non-existent directory', () => {
    const files = findAllFiles('/non/existent/path', ['.ts'])
    expect(files).toEqual([])
  })
})

describe('extractFunctions', () => {
  it('should extract function with JSDoc comment', () => {
    const code = `
/**
 * @title Test Function
 * This is a test function
 * @param {string} name - The name parameter
 * @returns {string} The greeting
 */
function testFunction(name: string): string {
  return 'Hello, ' + name
}
`
    const functions = extractFunctions(code, '/test/file.ts')

    expect(functions.length).toBe(1)
    expect(functions[0].name).toBe('testFunction')
    expect(functions[0].jsdoc.title).toBe('Test Function')
    expect(functions[0].jsdoc.desc).toBe('This is a test function')
    expect(functions[0].filePath).toBe('/test/file.ts')
  })

  it('should extract multiple functions', () => {
    const code = `
/**
 * @title First Function
 */
function first() {}

/**
 * @title Second Function
 */
function second() {}
`
    const functions = extractFunctions(code, '/test/file.ts')

    expect(functions.length).toBe(2)
    expect(functions[0].name).toBe('first')
    expect(functions[1].name).toBe('second')
  })

  it('should handle async functions', () => {
    const code = `
/**
 * @title Async Function
 */
async function asyncFunc() {}
`
    const functions = extractFunctions(code, '/test/file.ts')

    expect(functions.length).toBe(1)
    expect(functions[0].name).toBe('asyncFunc')
  })

  it('should handle exported functions', () => {
    const code = `
/**
 * @title Exported Function
 */
export function exportedFunc() {}
`
    const functions = extractFunctions(code, '/test/file.ts')

    expect(functions.length).toBe(1)
    expect(functions[0].name).toBe('exportedFunc')
  })
})

describe('parseJSDoc', () => {
  it('should parse title', () => {
    const jsdoc = `
/**
 * @title My Function Title
 * This is the description
 */
`
    const result = parseJSDoc(jsdoc)
    expect(result.title).toBe('My Function Title')
  })

  it('should parse parameters', () => {
    const jsdoc = `
/**
 * @title Test
 * @param {string} name - The name
 * @param {number} age - The age
 */
`
    const result = parseJSDoc(jsdoc)

    expect(result.params.length).toBe(2)
    expect(result.params[0].name).toBe('name')
    expect(result.params[0].type).toBe('string')
    expect(result.params[0].description).toBe('The name')
    expect(result.params[1].name).toBe('age')
    expect(result.params[1].type).toBe('number')
    expect(result.params[1].description).toBe('The age')
  })

  it('should parse returns', () => {
    const jsdoc = `
/**
 * @title Test
 * @returns {string} The result string
 */
`
    const result = parseJSDoc(jsdoc)

    expect(result.returns).toBeDefined()
    expect(result.returns?.type).toBe('string')
    expect(result.returns?.description).toBe('The result string')
  })

  it('should parse example', () => {
    const jsdoc = `
/**
 * @title Test
 * @example
 * const result = add(1, 2)
 */
`
    const result = parseJSDoc(jsdoc)

    expect(result.example).toBeDefined()
    expect(result.example).toContain('add(1, 2)')
  })
})

describe('scanAndGenerateDocs', () => {
  const tempDir = resolve(__dirname, '../temp-scan-test')
  const srcDir = resolve(tempDir, 'src')
  const outDir = resolve(tempDir, 'docs')

  beforeEach(() => {
    mkdirSync(srcDir, { recursive: true })
    mkdirSync(outDir, { recursive: true })
  })

  afterEach(() => {
    if (existsSync(tempDir)) {
      rmSync(tempDir, { recursive: true })
    }
  })

  it('should generate markdown file for function', async () => {
    // Create test source file
    writeFileSync(
      resolve(srcDir, 'test.ts'),
      `
/**
 * @title Test Function
 * This is a test function
 * @param {string} name - The name
 * @returns {string} The greeting
 */
function test(name: string): string {
  return 'Hello'
}
`
    )

    await scanAndGenerateDocs(srcDir, outDir)

    const docPath = resolve(outDir, 'test.md')
    expect(existsSync(docPath)).toBe(true)

    const content = readFileSync(docPath, 'utf-8')
    expect(content).toContain('# Test Function')
    expect(content).toContain('This is a test function')
  })

  it('should handle empty src directory', async () => {
    await scanAndGenerateDocs(srcDir, outDir)

    // Should not throw and should create the output directory
    expect(existsSync(outDir)).toBe(true)
  })
})
