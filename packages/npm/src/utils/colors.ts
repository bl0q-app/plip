// src/utils/colors.ts

import clc from 'cli-color';

/**
 * cli-color-based color utilities with enhanced features
 */
export const colors = {
  // Basic colors with dim variants for reduced opacity
  info: clc.cyan,
  infoDim: (text: string) => clc.cyan(clc.blackBright(text)),
  warn: clc.yellow,
  warnDim: (text: string) => clc.yellow(clc.blackBright(text)),
  error: clc.red,
  errorDim: (text: string) => clc.red(clc.blackBright(text)),
  success: clc.green,
  successDim: (text: string) => clc.green(clc.blackBright(text)),
  debug: clc.magenta,
  debugDim: (text: string) => clc.magenta(clc.blackBright(text)),
  trace: clc.blue,
  traceDim: (text: string) => clc.blue(clc.blackBright(text)),
  verbose: clc.blackBright,
  verboseDim: clc.black,
  
  // Additional utilities
  bold: clc.bold,
  dim: clc.blackBright,
  italic: clc.italic,
  underline: clc.underline,
  strikethrough: (text: string) => text, // cli-color doesn't have strikethrough
  reset: clc.reset,
  
  // Legacy color support for backward compatibility
  red: clc.red,
  green: clc.green,
  yellow: clc.yellow,
  blue: clc.blue,
  magenta: clc.magenta,
  cyan: clc.cyan,
  gray: clc.blackBright,
  brightBlue: clc.blueBright,
} as const;

/**
 * Applies color to text using cli-color
 */
export function colorize(text: string, colorFn: any, enabled: boolean = true): string {
  if (!enabled) return text;
  return typeof colorFn === 'function' ? colorFn(text) : text;
}

/**
 * Strips ANSI color codes from text using a regex approach
 */
export function stripColors(text: string): string {
  // Use regex to strip ANSI codes since chalk doesn't have stripColor in v5
  // eslint-disable-next-line no-control-regex
  return text.replace(/\x1b\[[0-9;]*m/g, '');
}

/**
 * Creates a color function that can be used to colorize text
 */
export function createColorFunction(colorFn: any) {
  return (text: string, enabled: boolean = true) => colorize(text, colorFn, enabled);
}

// Pre-defined color functions for common use cases
export const red = createColorFunction(clc.red);
export const green = createColorFunction(clc.green);
export const yellow = createColorFunction(clc.yellow);
export const blue = createColorFunction(clc.blue);
export const magenta = createColorFunction(clc.magenta);
export const cyan = createColorFunction(clc.cyan);
export const gray = createColorFunction(clc.blackBright);
export const brightBlue = createColorFunction(clc.blueBright);

/**
 * Detects if a string contains ANSI color codes
 */
export function hasColors(text: string): boolean {
  return text !== stripColors(text);
}

/**
 * Formats and highlights code with basic JSON syntax highlighting
 */
export function highlightCode(code: string, language?: string): string {
  try {
    // Simple JSON highlighting using cli-color
    if (language === 'json' || code.trim().startsWith('{') || code.trim().startsWith('[')) {
      return highlightJson(code);
    }
    
    // For other languages, just return the code as-is
    return code;
  } catch {
    // Fallback to plain text if highlighting fails
    return code;
  }
}

/**
 * Simple JSON syntax highlighting using cli-color
 */
function highlightJson(jsonString: string): string {
  return jsonString
    .replace(/"([^"]+)":/g, clc.blue('"$1"') + ':') // Keys in blue
    .replace(/:\s*"([^"]+)"/g, ': ' + clc.green('"$1"')) // String values in green
    .replace(/:\s*(\d+)/g, ': ' + clc.yellow('$1')) // Numbers in yellow
    .replace(/:\s*(true|false)/g, ': ' + clc.magenta('$1')) // Booleans in magenta
    .replace(/:\s*(null)/g, ': ' + clc.red('$1')); // null in red
}

/**
 * Formats objects with syntax highlighting
 */
export function formatObject(obj: any, enableColors: boolean = true): string {
  if (typeof obj === 'string') return obj;
  
  const jsonString = JSON.stringify(obj, null, 2);
  
  if (!enableColors) return jsonString;
  
  return highlightCode(jsonString, 'json');
}