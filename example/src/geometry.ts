/**
 * @title Calculate area of a rectangle
 * Calculates the area of a rectangle given its width and height
 * @param {number} width - Width of the rectangle
 * @param {number} height - Height of the rectangle
 * @returns {number} The area of the rectangle
 * @example
 * import { calculateRectangleArea } from './geometry'
 * const area = calculateRectangleArea(5, 3) // returns 15
 */
export function calculateRectangleArea(width: number, height: number): number {
  return width * height
}

/**
 * @title Calculate perimeter of a rectangle
 * Calculates the perimeter of a rectangle given its width and height
 * @param {number} width - Width of the rectangle
 * @param {number} height - Height of the rectangle
 * @returns {number} The perimeter of the rectangle
 * @example
 * import { calculateRectanglePerimeter } from './geometry'
 * const perimeter = calculateRectanglePerimeter(5, 3) // returns 16
 */
export function calculateRectanglePerimeter(width: number, height: number): number {
  return 2 * (width + height)
}

/**
 * @title Check if a number is even
 * Determines whether a given number is even
 * @param {number} num - The number to check
 * @returns {boolean} True if the number is even, false otherwise
 * @example
 * import { isEven } from './utils'
 * const result = isEven(4) // returns true
 */
export function isEven(num: number): boolean {
  return num % 2 === 0
}