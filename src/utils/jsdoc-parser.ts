export interface JSDocInfo {
  title?: string
  menuTitle?: string
  desc?: string
  example?: string
  params?: Array<{
    name: string
    type: string
    description: string
  }>
  returns?: {
    type: string
    description: string
  }
  signature?: string
}

// Decide whether a space is needed when joining two soft-wrapped lines.
// Latin text is space-separated, so a wrap between word characters needs a
// space; CJK text is not, so joining must not introduce stray spaces.
function needsSpaceBetween(prev: string, next: string): boolean {
  return /[A-Za-z0-9]$/.test(prev) && /^[A-Za-z0-9]/.test(next)
}

// Join the soft-wrapped lines of a single paragraph back into one line.
function joinWrappedLines(lines: string[]): string {
  let result = ''
  for (const line of lines) {
    if (result === '') {
      result = line
    } else if (needsSpaceBetween(result, line)) {
      result += ' ' + line
    } else {
      result += line
    }
  }
  return result
}

// Turn the raw description lines into Markdown, preserving paragraph breaks.
// A blank line (or an explicit break marker: \n, the common /n typo, or <br>)
// separates paragraphs, which are emitted with a blank line between them so
// they render on separate lines without the author needing to add anything.
function formatDescription(lines: string[]): string {
  const paragraphs: string[] = []
  let current: string[] = []

  const flush = () => {
    if (current.length > 0) {
      const para = joinWrappedLines(current).trim()
      if (para) {
        paragraphs.push(para)
      }
      current = []
    }
  }

  for (const line of lines) {
    if (line.trim() === '') {
      flush()
      continue
    }

    // Split on explicit break markers so authors can still force a break.
    const segments = line.split(/\\n|\/n|<br\s*\/?>/i)
    segments.forEach((segment, index) => {
      if (index > 0) {
        flush()
      }
      const trimmed = segment.trim()
      if (trimmed) {
        current.push(trimmed)
      }
    })
  }
  flush()

  return paragraphs.join('\n\n')
}

export function parseJSDoc(jsdoc: string): JSDocInfo {
  const lines = jsdoc.trim().split('\n').map(line => line.replace(/^\s*\*\s?/, ''))
  
  const info: JSDocInfo = {}
  
  // Extract title (first line or @title tag)
  const titleMatch = lines.find(line => line.startsWith('@title'))
  if (titleMatch) {
    info.title = titleMatch.replace('@title', '').trim()
  } else if (lines.length > 0) {
    info.title = lines[0]
  }

  // Extract menu title (@MenuTitle)
  const menuTitleMatch = lines.find(line => /@MenuTitle\b/i.test(line))
  if (menuTitleMatch) {
    info.menuTitle = menuTitleMatch.replace(/@MenuTitle/i, '').trim()
  }
  
  // Extract description - all lines before the first block tag.
  // Blank lines are kept so paragraph breaks survive into the output.
  const descLines: string[] = []
  for (const line of lines) {
    // Stop collecting description when we hit @example or @param or @returns
    if (line.startsWith('@example') || line.startsWith('@param') || line.startsWith('@returns') || line.startsWith('@return')) {
      break
    }

    // Skip any tag line (e.g. @title, @MenuTitle) - keep everything else,
    // including blank lines, which mark paragraph boundaries.
    if (line.startsWith('@')) {
      continue
    }

    descLines.push(line)
  }

  const desc = formatDescription(descLines)
  if (desc) {
    info.desc = desc
  }
  
  // Extract example
  const exampleLines: string[] = []
  let collectingExample = false
  for (const line of lines) {
    if (line.startsWith('@example')) {
      collectingExample = true
      const exampleContent = line.replace('@example', '').trim()
      if (exampleContent) {
        exampleLines.push(exampleContent)
      }
      continue
    }
    
    // Continue collecting example lines until we hit another tag
    if (collectingExample) {
      if (line.startsWith('@')) {
        collectingExample = false
      } else {
        exampleLines.push(line)
      }
    }
  }
  
  if (exampleLines.length > 0) {
    info.example = exampleLines.join('\n').trim()
  }
  
  // Extract parameters
  info.params = []
  lines.forEach(line => {
    // Match @param with or without type: @param {string} name - description or @param name - description
    const paramMatch = line.match(/@param\s+(?:{([^}]+)})?\s*(\w+)\s*-\s*(.+)/)
    if (paramMatch) {
      info.params!.push({
        name: paramMatch[2],
        type: paramMatch[1] || 'any',
        description: paramMatch[3]
      })
    }
  })
  
  // Extract return value
  const returnMatch = lines.find(line => line.startsWith('@returns') || line.startsWith('@return'))
  if (returnMatch) {
    const returnInfo = returnMatch.replace(/@(returns?)/, '').trim()
    const typeMatch = returnInfo.match(/^{([^}]+)}\s*(.*)/)
    if (typeMatch) {
      info.returns = {
        type: typeMatch[1],
        description: typeMatch[2]
      }
    } else {
      info.returns = {
        type: 'unknown',
        description: returnInfo
      }
    }
  }
  
  return info
}
