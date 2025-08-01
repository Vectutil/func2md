import { readdirSync, statSync } from 'fs'
import { join, extname } from 'path'

export function findAllFiles(dir: string, extensions: string[]): string[] {
  let results: string[] = []
  
  function traverse(currentDir: string) {
    const files = readdirSync(currentDir)
    
    for (const file of files) {
      const filePath = join(currentDir, file)
      const stat = statSync(filePath)
      
      if (stat.isDirectory()) {
        traverse(filePath)
      } else if (stat.isFile() && extensions.includes(extname(file))) {
        results.push(filePath)
      }
    }
  }
  
  traverse(dir)
  return results
}