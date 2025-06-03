// src/index.ts

// Re-export everything from lib
export * from "./lib/index.js";

// Re-export utilities that might be useful for consumers
export { isDevelopment, isProduction, isNode, isBrowser, isDeno, getRuntimeEnvironment, supportsColor, supportsEmoji } from "./utils/env.js";
export { colors, colorize, stripColors, red, green, yellow, blue, magenta, cyan, gray, brightBlue, hasColors, highlightCode, formatObject } from "./utils/colors.js";