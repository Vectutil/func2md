# func2md

一个用于从 JSDoc 和 TypeScript 类型生成 VitePress 文档的 Vite 插件。

## 功能特性

- 扫描指定目录中的 JavaScript/TypeScript 函数
- 解析 JSDoc 注释以提取函数信息
- 生成与 VitePress 兼容的 Markdown 文档
- 支持自定义扫描目录和输出位置
- 与 Vite 构建过程集成

## 安装

```bash
npm install func2md
```

## 使用方法

### 基本用法

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import func2md from 'func2md'

export default defineConfig({
  plugins: [
    func2md({
      srcDir: 'src',     // 要扫描函数的源目录
      outDir: 'docs',    // 生成的 markdown 文件的输出目录
      watch: false       // 是否监听变化
    })
  ]
})
```

### JavaScript API

```ts
import { scanAndGenerateDocs, getRecords } from 'func2md'

// 生成文档
await scanAndGenerateDocs('./src', './docs')

// 读取生成的 _pages.js 记录
const pages = getRecords({ outDir: './docs' })
const mathGroup = getRecords({ outDir: './docs', text: '数学' })
```

### 配置选项

| 选项 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| srcDir | string | 'src' | 要扫描函数的源目录 |
| outDir | string | 'docs' | 生成的 markdown 文件的输出目录 |
| watch | boolean | false | 是否监听变化 |

## JSDoc 格式

插件解析具有以下特殊标签的 JSDoc 注释，并按如下规则生成文档：

- `@title`：生成文档主标题（H1），缺省时使用注释第一行。
- `@MenuTitle`：生成到 _pages.js 的菜单标题，用于侧边栏条目显示。
- `@param {type} name - desc`：生成参数表格行。
- `@returns` / `@return`：生成返回值说明。
- `@example`：生成示例代码块。
- 标签之前的文本会作为「说明」内容。

示例：

```js
/**
 * @title 两数相加
 * 这个函数将两个数字相加
 * @MenuTitle 数学/加法
 * @param {number} a - 第一个数字
 * @param {number} b - 第二个数字
 * @returns {number} a 和 b 的和
 * @example
 * import { add } from './math'
 * const result = add(1, 2) // 返回 3
 */
function add(a, b) {
  return a + b
}
```

## 生成的文档

插件生成具有以下结构的 Markdown 文件：

```markdown
# 函数标题

## INFO

函数描述

## 参数

| 参数名 | 类型 | 说明 |
|--------|------|------|
| paramName | `type` | 参数描述 |

## 返回值

- 类型: `returnType`
- 说明: 返回值描述

## 示例

```ts
// 示例代码
```

生成的 _pages.js 仅导出 pages 数组。如需筛选记录，请使用库导出的 `getRecords()`。
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

### 运行带覆盖率的测试

```bash
npm run test:coverage
```

## 许可证

MIT
