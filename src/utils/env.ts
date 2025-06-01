// src/utils/env.ts

/**
 * Detects if we're running in a development environment
 */
export function isDevelopment(): boolean {
  return process.env.NODE_ENV !== "production";
}

/**
 * Detects if we're running in a production environment
 */
export function isProduction(): boolean {
  return process.env.NODE_ENV === "production";
}

/**
 * Detects if we're running in a Node.js environment
 */
export function isNode(): boolean {
  return typeof process !== "undefined" && 
         process.versions !== undefined && 
         typeof process.versions.node === "string";
}

/**
 * Detects if we're running in a browser environment
 */
export function isBrowser(): boolean {
  return typeof globalThis !== "undefined" && 
         "window" in globalThis && 
         "document" in globalThis;
}

/**
 * Detects if we're running in Deno
 */
export function isDeno(): boolean {
  // @ts-ignore
  return typeof Deno !== "undefined";
}

/**
 * Gets the current runtime environment
 */
export function getRuntimeEnvironment(): "node" | "browser" | "deno" | "unknown" {
  if (isNode()) return "node";
  if (isBrowser()) return "browser";
  if (isDeno()) return "deno";
  return "unknown";
}

/**
 * Checks if the current terminal/environment supports colors
 */
export function supportsColor(): boolean {
  // In browser, always return false for now
  if (isBrowser()) return false;
  
  // In Node.js, check various environment variables
  if (isNode()) {
    // Check if NO_COLOR is set (universal way to disable colors)
    if (process.env.NO_COLOR) return false;
    
    // Check if FORCE_COLOR is set
    if (process.env.FORCE_COLOR) return true;
    
    // Check if we're in a TTY
    if (process.stdout && typeof process.stdout.isTTY === "boolean") {
      return process.stdout.isTTY;
    }
    
    // Check common terminal environment variables
    const term = process.env.TERM;
    if (term === "dumb") return false;
    if (term && (term.includes("color") || term.includes("256"))) return true;
    
    // Check for common CI environments that support colors
    const ci = process.env.CI;
    if (ci && (
      process.env.GITHUB_ACTIONS ||
      process.env.GITLAB_CI ||
      process.env.CIRCLECI ||
      process.env.TRAVIS
    )) {
      return true;
    }
  }
  
  // Default to true for Deno and unknown environments
  return true;
}

/**
 * Checks if the current environment supports emojis
 */
export function supportsEmoji(): boolean {
  // In browser, assume emoji support
  if (isBrowser()) return true;
  
  // In Node.js, check terminal capabilities
  if (isNode()) {
    // Windows Command Prompt traditionally has poor emoji support
    if (process.platform === "win32") {
      // Windows Terminal and PowerShell Core support emojis well
      const term = process.env.TERM_PROGRAM;
      return term === "Windows Terminal" || term === "vscode";
    }
    
    // macOS and Linux generally support emojis well
    return true;
  }
  
  // Default to true for other environments
  return true;
}
