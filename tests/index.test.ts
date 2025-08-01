import { describe, it, expect, vi } from 'vitest'
import func2md from '../src/index'

describe('func2md plugin', () => {
  it('should create plugin with default options', () => {
    const plugin = func2md()
    
    expect(plugin.name).toBe('func2md')
    expect(plugin.buildStart).toBeDefined()
  })
  
  it('should create plugin with custom options', () => {
    const plugin = func2md({
      srcDir: '/mock/src',
      outDir: '/mock/docs',
      watch: true
    })
    
    expect(plugin.name).toBe('func2md')
  })
})