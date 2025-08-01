export interface JSDocInfo {
  title?: string
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
  
  // Extract description - all lines that don't start with @
  const descLines: string[] = []
  let inExample = false
  for (const line of lines) {
    // Stop collecting description when we hit @example or @param or @returns
    if (line.startsWith('@example') || line.startsWith('@param') || line.startsWith('@returns') || line.startsWith('@return')) {
      break
    }
    
    // Only add non-empty lines that don't start with @title to description
    if (!line.startsWith('@title') && line.trim() !== '') {
      descLines.push(line)
    }
  }
  
  if (descLines.length > 0) {
    info.desc = descLines.join(' ').trim()
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
    const paramMatch = line.match(/@param\s+{([^}]+)}\s+(\w+)\s+(.+)/)
    if (paramMatch) {
      info.params!.push({
        name: paramMatch[2],
        type: paramMatch[1],
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