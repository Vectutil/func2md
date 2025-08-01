import { FunctionInfo } from '../utils/function-extractor'

// Generate the main title section
export function generateTitleSection(func: FunctionInfo): string {
  const { name, jsdoc } = func
  const title = jsdoc.title || name
  return `# ${title}\n\n`
}

// Generate the description section
export function generateDescriptionSection(func: FunctionInfo): string {
  const { jsdoc } = func
  if (jsdoc.desc) {
    return `## 说明\n\n${jsdoc.desc}\n\n`
  }
  return ''
}

// Generate the signature section
export function generateSignatureSection(func: FunctionInfo): string {
  const { jsdoc } = func
  if (jsdoc.signature) {
    return `## 签名\n\n\`\`\`ts\n${jsdoc.signature}\n\`\`\`\n\n`
  }
  return ''
}

// Generate the parameters section
export function generateParametersSection(func: FunctionInfo): string {
  const { jsdoc } = func
  if (jsdoc.params && jsdoc.params.length > 0) {
    let section = `## 参数\n\n`
    section += `| 参数名 | 类型 | 说明 |\n|--------|------|------|\n`
    jsdoc.params.forEach(param => {
      section += `| ${param.name} | \`${param.type}\` | ${param.description} |\n`
    })
    section += `\n`
    return section
  }
  return ''
}

// Generate the returns section
export function generateReturnsSection(func: FunctionInfo): string {
  const { jsdoc } = func
  if (jsdoc.returns) {
    return `## 返回值\n\n- 类型: \`${jsdoc.returns.type}\`\n- 说明: ${jsdoc.returns.description}\n\n`
  }
  return ''
}

// Generate the example section
export function generateExampleSection(func: FunctionInfo): string {
  const { jsdoc } = func
  if (jsdoc.example) {
    return `## 示例\n\n\`\`\`ts\n${jsdoc.example}\n\`\`\`\n\n`
  }
  return ''
}

// Main function to generate markdown content
export function generateMarkdown(func: FunctionInfo): string {
  let md = generateTitleSection(func)
  md += generateDescriptionSection(func)
  md += generateSignatureSection(func)
  md += generateParametersSection(func)
  md += generateReturnsSection(func)
  md += generateExampleSection(func)
  return md
}