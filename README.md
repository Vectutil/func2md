# func2md

从 JSDoc 注释和 TypeScript 类型生成 VitePress 文档的 CLI 工具和 Vite 插件。

## 功能特性

- 扫描指定目录中的 JavaScript/TypeScript 函数
- 解析 JSDoc 注释提取函数信息
- 生成兼容 VitePress 的 Markdown 文档
- 支持自定义扫描目录和输出位置
- 支持 Vite 插件模式或独立 CLI 模式使用

## 安装

```bash
npm install func2md
```

## 使用方式

### 方式一：Vite 插件

在 `vite.config.ts` 中配置：

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import func2md from 'func2md'

export default defineConfig({
  plugins: [
    func2md({
      srcDir: 'src',     // 源目录
      outDir: 'docs',    // 输出目录
      watch: false       // 是否监听变化
    })
  ]
})
```

### 方式二：CLI 命令行

无需 Vite，直接在命令行使用：

```bash
# 使用默认配置（扫描 src 目录，输出到 docs）
npx func2md

# 自定义目录
npx func2md --src-dir=lib --out-dir=documentation
```

或在 `package.json` 中添加脚本：

```json
{
  "scripts": {
    "docs": "func2md --src-dir=src --out-dir=docs"
  }
}
```

### 方式三：JavaScript API

在代码中直接调用：

```typescript
import { scanAndGenerateDocs } from 'func2md'

// 生成文档
await scanAndGenerateDocs('./src', './docs')
```

## 配置选项

| 选项 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| srcDir | string | 'src' | 源目录路径 |
| outDir | string | 'docs' | 输出目录路径 |
| watch | boolean | false | 是否监听文件变化（仅 Vite 插件模式） |

## JSDoc 格式

插件支持以下 JSDoc 标签：

- `@title` - 函数标题（可选，默认为描述第一行）
- `@param` - 函数参数，包含类型和描述
- `@returns` 或 `@return` - 返回值，包含类型和描述
- `@example` - 代码示例

示例：

```js
/**
 * @title 两数相加
 * 将两个数字相加
 * @param {number} a - 第一个数字
 * @param {number} b - 第二个数字
 * @returns {number} 两数之和
 * @example
 * import { add } from './math'
 * const result = add(1, 2) // 返回 3
 */
function add(a, b) {
  return a + b
}
```

## 生成的文档格式

插件生成以下结构的 Markdown 文件：

```markdown
# 函数标题

## 说明

函数描述...

## 参数

| 名称 | 类型 | 描述 |
|------|------|------|
| paramName | `type` | 参数描述 |

## 返回值

- 类型: `returnType`
- 描述: 返回值描述

## 示例

```ts
// 示例代码
```
```

## 开发

### 构建项目

```bash
npm run build
```

### 运行测试

```bash
npm run test
```

### 运行测试并生成覆盖率报告

```bash
npm run test:coverage
```

## License

MIT
