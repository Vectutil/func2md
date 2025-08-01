import { parseJSDoc, JSDocInfo } from './jsdoc-parser'

export interface FunctionInfo {
  name: string
  jsdoc: JSDocInfo
  signature?: string
  filePath: string
}

export function extractFunctions(content: string, filePath: string): FunctionInfo[] {
  // This is a simplified implementation
  // In a real implementation, we would use AST parsing (e.g., with TypeScript Compiler API)
  
  const functions: FunctionInfo[] = []
  
  // Match function declarations with JSDoc comments
  // Using a string to avoid regex escaping issues
  const functionRegex = new RegExp(
    String.raw`/\*\*((?:.|\n|\r)*?)\*/\s*(export\s+)?(async\s+)?function\s+(\w+)`,
    'g'
  )
  let match
  
  while ((match = functionRegex.exec(content)) !== null) {
    const [, jsdocRaw, , , functionName] = match
    const jsdoc = parseJSDoc(jsdocRaw)
    
    functions.push({
      name: functionName,
      jsdoc,
      filePath
    })
  }
  
  return functions
}