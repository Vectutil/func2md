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
