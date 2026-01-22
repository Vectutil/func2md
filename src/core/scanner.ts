import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { join, relative, dirname, resolve, sep } from 'path'
import { findAllFiles } from '../utils/file-utils'
import { extractFunctions } from '../utils/function-extractor'
import { generateMarkdown } from '../generators/markdown-generator'

interface PageNode {
  text: string
  items?: PageNode[]
  link?: string
  dir?: string
}

function toPosixPath(pathValue: string) {
  return pathValue.split(sep).join('/')
}

function findVitepressRoot(outDir: string): string | null {
  let current = resolve(outDir)
  while (true) {
    const configDir = join(current, '.vitepress')
    // 如果存在 .vitepress 目录，无论是否有配置文件都认为这是 VitePress 根目录
    if (existsSync(configDir)) {
      return current
    }
    const parent = dirname(current)
    if (parent === current) {
      break
    }
    current = parent
  }
  return null
}

function resolveLinkPrefix(outDir: string): string {
  const resolvedOutDir = resolve(outDir)
  const vitepressRoot = findVitepressRoot(resolvedOutDir)
  if (vitepressRoot) {
    const rel = relative(vitepressRoot, resolvedOutDir)
    return toPosixPath(rel)
  }
  const rel = relative(process.cwd(), resolvedOutDir)
  const parts = rel.split(sep).filter(Boolean)
  return parts.slice(1).join('/')
}

function readExistingGroupText(pagesPath: string): Map<string, string> {
  if (!existsSync(pagesPath)) {
    return new Map()
  }

  const raw = readFileSync(pagesPath, 'utf-8').trim()
  const arrayMatch = raw.match(/const\s+pages\s*=\s*(\[[\s\S]*\])\s*;?/)
    ?? raw.match(/export\s+default\s+(\[[\s\S]*\])\s*;?\s*$/)
  if (!arrayMatch) {
    return new Map()
  }

  try {
    const data = JSON.parse(arrayMatch[1]) as PageNode[]
    const map = new Map<string, string>()
    const walk = (nodes: PageNode[]) => {
      for (const node of nodes) {
        if (node.items && Array.isArray(node.items)) {
          if (typeof node.dir === 'string' && typeof node.text === 'string' && node.text.trim() !== '') {
            map.set(node.dir, node.text)
          }
          walk(node.items)
        }
      }
    }
    walk(data)
    return map
  } catch {
    return new Map()
  }
}

function sortPages(nodes: PageNode[]) {
  nodes.sort((a, b) => {
    const aIsGroup = Array.isArray(a.items)
    const bIsGroup = Array.isArray(b.items)
    if (aIsGroup && !bIsGroup) return -1
    if (!aIsGroup && bIsGroup) return 1
    if (aIsGroup && bIsGroup) {
      return (a.dir || '').localeCompare(b.dir || '')
    }
    return (a.link || '').localeCompare(b.link || '')
  })

  for (const node of nodes) {
    if (node.items && Array.isArray(node.items)) {
      sortPages(node.items)
    }
  }
}

function generatePages(functions: ReturnType<typeof extractFunctions>, srcDir: string, outDir: string) {
  const vitepressRoot = findVitepressRoot(outDir)
  const pagesBaseDir = vitepressRoot ?? outDir
  const pagesDir = join(pagesBaseDir, '.vitepress')
  if (!existsSync(pagesDir)) {
    mkdirSync(pagesDir, { recursive: true })
  }

  const pagesPath = join(pagesDir, '_pages.js')
  const existingGroupText = readExistingGroupText(pagesPath)
  const linkPrefix = resolveLinkPrefix(outDir)

  const root: PageNode = { text: '', items: [] }
  const sortedFunctions = [...functions].sort((a, b) => {
    const fileCompare = a.filePath.localeCompare(b.filePath)
    if (fileCompare !== 0) return fileCompare
    return a.name.localeCompare(b.name)
  })

  for (const func of sortedFunctions) {
    const relativePath = relative(srcDir, func.filePath)
    const dirPath = dirname(relativePath)
    const parts = dirPath === '.' ? [] : dirPath.split(sep)

    let current = root
    let currentDir = ''
    for (const part of parts) {
      currentDir = currentDir ? `${currentDir}/${part}` : part
      if (!current.items) {
        current.items = []
      }
      let next = current.items.find(item => item.items && item.dir === currentDir)
      if (!next) {
        const preservedText = existingGroupText.get(currentDir)
        next = {
          text: preservedText ?? '',
          items: [],
          dir: currentDir
        }
        current.items.push(next)
      }
      current = next
    }

    const linkPath = [linkPrefix, func.name].filter(Boolean).join('/')
    if (!current.items) {
      current.items = []
    }
    current.items.push({
      text: func.jsdoc.menuTitle ?? func.jsdoc.title ?? '',
      link: `/${linkPath}`
    })
  }

  if (root.items) {
    sortPages(root.items)
  }

  const pagesJson = JSON.stringify(root.items ?? [], null, 2)
  const output = `// @ts-nocheck\n/* eslint-disable */\n/* prettier-ignore-start */\n/**\n * 此文件由 func2md 自动生成。\n * 仅允许修改菜单分组的 text 字段。\n */\nconst pages = ${pagesJson}\n/* prettier-ignore-end */\n\nexport default pages\n`
  writeFileSync(pagesPath, output)
}

export async function scanAndGenerateDocs(srcDir: string, outDir: string) {
  console.log(`Scanning ${srcDir} and generating docs to ${outDir}`)

  if (!existsSync(outDir)) {
    mkdirSync(outDir, { recursive: true })
  }
  
  // Find all .ts and .js files in srcDir
  const files = findAllFiles(srcDir, ['.ts', '.js'])
  
  const allFunctions = [] as ReturnType<typeof extractFunctions>

  for (const file of files) {
    const content = readFileSync(file, 'utf-8')
    const functions = extractFunctions(content, file)

    allFunctions.push(...functions)
    
    for (const func of functions) {
      const mdContent = generateMarkdown(func)
      const outputPath = join(outDir, `${func.name}.md`)
      writeFileSync(outputPath, mdContent)
      console.log(`Generated documentation: ${outputPath}`)
    }
  }

  generatePages(allFunctions, srcDir, outDir)
}
