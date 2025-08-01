import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import { findAllFiles } from '../utils/file-utils'
import { extractFunctions } from '../utils/function-extractor'
import { generateMarkdown } from '../generators/markdown-generator'

export async function scanAndGenerateDocs(srcDir: string, outDir: string) {
  console.log(`Scanning ${srcDir} and generating docs to ${outDir}`)
  
  // Find all .ts and .js files in srcDir
  const files = findAllFiles(srcDir, ['.ts', '.js'])
  
  for (const file of files) {
    const content = readFileSync(file, 'utf-8')
    const functions = extractFunctions(content, file)
    
    for (const func of functions) {
      const mdContent = generateMarkdown(func)
      const outputPath = join(outDir, `${func.name}.md`)
      writeFileSync(outputPath, mdContent)
      console.log(`Generated documentation: ${outputPath}`)
    }
  }
}