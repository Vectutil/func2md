import { readFileSync, existsSync } from 'fs'
import { resolve, join } from 'path'

export interface PageNode {
  text: string
  items?: PageNode[]
  link?: string
  dir?: string
}

export interface GetRecordsOptions {
  /**
   * 指定 _pages.js 的完整路径。
   * 当提供该值时，会忽略 outDir。
   */
  pagesPath?: string
  /**
   * 指定生成文档的输出目录（默认 docs）。
   * 会自动定位到 VitePress 根目录下的 .vitepress/_pages.js。
   */
  outDir?: string
  /**
   * 仅返回一级分组的 text 匹配项。
   * 为空时返回全部。
   */
  text?: string
}

function findVitepressRoot(outDir: string): string | null {
  let current = resolve(outDir)
  while (true) {
    const configDir = join(current, '.vitepress')
    if (existsSync(configDir)) {
      return current
    }
    const parent = resolve(current, '..')
    if (parent === current) {
      break
    }
    current = parent
  }
  return null
}

function resolvePagesPath(outDir: string): string {
  const vitepressRoot = findVitepressRoot(outDir)
  const baseDir = vitepressRoot ?? resolve(outDir)
  return join(baseDir, '.vitepress', '_pages.js')
}

function readPages(pagesPath: string): PageNode[] {
  if (!existsSync(pagesPath)) {
    return []
  }

  const raw = readFileSync(pagesPath, 'utf-8').trim()
  const arrayMatch = raw.match(/const\s+pages\s*=\s*(\[[\s\S]*\])\s*;?/) ?? raw.match(/export\s+default\s+(\[[\s\S]*\])\s*;?\s*$/)
  if (!arrayMatch) {
    return []
  }

  try {
    return JSON.parse(arrayMatch[1]) as PageNode[]
  } catch {
    return []
  }
}

/**
 * 获取 _pages.js 中的页面记录。
 * @param options 读取选项
 */
export function getRecords(options: GetRecordsOptions = {}): PageNode[] {
  const { pagesPath, outDir = 'docs', text } = options
  const targetPath = pagesPath ? resolve(pagesPath) : resolvePagesPath(outDir)
  const pages = readPages(targetPath)

  if (!text) {
    return pages
  }
  return pages.filter(item => item.text === text)
}
