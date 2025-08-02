# func2md

A Vite plugin to generate VitePress documentation from JSDoc and TypeScript types.

## Features

- Scans specified directories for JavaScript/TypeScript functions
- Parses JSDoc comments to extract function information
- Generates Markdown documentation compatible with VitePress
- Supports customizable scanning directories and output locations
- Integrates with Vite's build process

## Installation

```bash
npm install func2md
```

## Usage

### Basic usage

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import func2md from 'func2md'

export default defineConfig({
  plugins: [
    func2md({
      srcDir: 'src',     // Source directory to scan for functions
      outDir: 'docs',    // Output directory for generated markdown files
      watch: false       // Whether to watch for changes
    })
  ]
})
```

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| srcDir | string | 'src' | Source directory to scan for functions |
| outDir | string | 'docs' | Output directory for generated markdown files |
| watch | boolean | false | Whether to watch for changes |

## JSDoc Format

The plugin parses JSDoc comments with the following special tags:

- `@title` - Function title (optional, defaults to first line of description)
- `@param` - Function parameters with type and description
- `@returns` or `@return` - Return value with type and description
- `@example` - Code example

Example:

```js
/**
 * @title Add two numbers
 * This function adds two numbers together
 * @param {number} a - First number
 * @param {number} b - Second number
 * @returns {number} The sum of a and b
 * @example
 * import { add } from './math'
 * const result = add(1, 2) // returns 3
 */
function add(a, b) {
  return a + b
}
```

## Generated Documentation

The plugin generates Markdown files with the following structure:

```markdown
# Function Title

## INFO

Function description

## Parameters

| Name | Type | Description |
|------|------|-------------|
| paramName | `type` | Parameter description |

## Return Value

- Type: `returnType`
- Description: Return value description

## Examples

```ts
// Example code
```
```

## Development

### Build the project

```bash
npm run build
```

### Run tests

```bash
npm run test
```

### Run tests with coverage

```bash
npm run test:coverage
```

## License

MIT