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

### 配置选项

| 选项 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| srcDir | string | 'src' | 要扫描函数的源目录 |
| outDir | string | 'docs' | 生成的 markdown 文件的输出目录 |
| watch | boolean | false | 是否监听变化 |

## JSDoc 格式

插件解析具有以下特殊标签的 JSDoc 注释：

- `@title` - 函数标题（可选，默认为描述的第一行）
- `@param` - 带类型和描述的函数参数
- `@returns` 或 `@return` - 带类型和描述的返回值
- `@example` - 代码示例

示例：

```js
/**
 * @title 两数相加
 * 这个函数将两个数字相加
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