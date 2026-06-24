import { describe, it, expect } from 'vitest'
import { parseJSDoc } from '../src/utils/jsdoc-parser'

describe('parseJSDoc', () => {
  it('should parse basic JSDoc with title', () => {
    const jsdoc = `
      * @title Add two numbers
      * This function adds two numbers together
      * @param {number} a - First number
      * @param {number} b - Second number
      * @returns {number} The sum of a and b
      * @example
      * import { add } from './math'
      * const result = add(1, 2) // returns 3
    `
    
    const result = parseJSDoc(jsdoc)
    
    expect(result.title).toBe('Add two numbers')
    expect(result.desc).toContain('This function adds two numbers together')
    expect(result.params).toHaveLength(2)
    expect(result.returns).toBeDefined()
    expect(result.example).toContain('import { add } from \'./math\'')
  })
  
  it('should use first line as title if @title is not present', () => {
    const jsdoc = `
      * Adds two numbers together
      * @param {number} a - First number
      * @param {number} b - Second number
      * @returns {number} The sum of a and b
    `
    
    const result = parseJSDoc(jsdoc)
    
    expect(result.title).toBe('Adds two numbers together')
  })
  
  it('should handle function without parameters', () => {
    const jsdoc = `
      * @title Simple function
      * A function without parameters
      * @returns {void}
    `
    
    const result = parseJSDoc(jsdoc)
    
    expect(result.title).toBe('Simple function')
    expect(result.params).toHaveLength(0)
    expect(result.returns).toBeDefined()
  })

  it('should preserve paragraph breaks in the description', () => {
    const jsdoc = `
      * 第一段说明。
      *
      * 第二段说明，这一行被
      * 软换行折叠到了下一行。
      *
      * 第三段说明。
      * @title 标题
      * @param {T} input - 输入
    `

    const result = parseJSDoc(jsdoc)

    // Paragraphs separated by blank lines render on separate lines.
    expect(result.desc).toBe(
      '第一段说明。\n\n第二段说明，这一行被软换行折叠到了下一行。\n\n第三段说明。'
    )
  })

  it('should honor explicit break markers and drop the /n typo', () => {
    const jsdoc = `
      * 第一行。/n
      * 第二行。\\n第三行。
    `

    const result = parseJSDoc(jsdoc)

    expect(result.desc).toBe('第一行。\n\n第二行。\n\n第三行。')
  })

  it('should not insert stray spaces when joining wrapped CJK lines', () => {
    const jsdoc = `
      * 深拷贝会递归遍历源数据，
      * 复制实际的值而非引用。
    `

    const result = parseJSDoc(jsdoc)

    expect(result.desc).toBe('深拷贝会递归遍历源数据，复制实际的值而非引用。')
  })

  it('should keep spaces when joining wrapped Latin lines', () => {
    const jsdoc = `
      * This function adds two
      * numbers together.
    `

    const result = parseJSDoc(jsdoc)

    expect(result.desc).toBe('This function adds two numbers together.')
  })

  it('should parse MenuTitle', () => {
    const jsdoc = `
      * @title Title
      * @MenuTitle 自定义菜单标题
      * Some description
    `

    const result = parseJSDoc(jsdoc)

    expect(result.menuTitle).toBe('自定义菜单标题')
  })
})
