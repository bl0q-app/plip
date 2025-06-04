// src/lib/config.ts

import { colors } from '../utils/colors.js';
import { isNode, isBrowser, isProduction } from '../utils/env.js';

export type LogLevel = "info" | "warn" | "error" | "success" | "debug" | "trace" | "verbose";

export interface PlipTheme {
  emojis: Record<LogLevel, string>;
  colors: Record<LogLevel, any>; // Changed to any to support chalk functions
  dimColors: Record<LogLevel, any>; // Added dim colors for reduced opacity
}

export interface PlipConfig {
  silent?: boolean;
  enableEmojis?: boolean;
  enableColors?: boolean;
  enableSyntaxHighlighting?: boolean; // Added syntax highlighting option
  theme?: Partial<PlipTheme>;
  enabledLevels?: LogLevel[];
  devOnly?: boolean;
}

export const defaultTheme: PlipTheme = {
  emojis: {
    info: "🫧",
    warn: "⚠️",
    error: "💥",
    success: "🎉",
    debug: "🔍",
    trace: "🛰️",
    verbose: "📢",
  },
  colors: {
    info: colors.info,
    warn: colors.warn,
    error: colors.error,
    success: colors.success,
    debug: colors.debug,
    trace: colors.trace,
    verbose: colors.verbose,
  },
  dimColors: {
    info: colors.infoDim,
    warn: colors.warnDim,
    error: colors.errorDim,
    success: colors.successDim,
    debug: colors.debugDim,
    trace: colors.traceDim,
    verbose: colors.verboseDim,
  },
};

export const defaultConfig: Required<PlipConfig> = {
  silent: false,
  enableEmojis: true,
  enableColors: true,
  enableSyntaxHighlighting: true,
  theme: {},
  enabledLevels: ["info", "warn", "error", "success", "debug", "trace", "verbose"],
  devOnly: false,
};

// SSR (Server-Side Rendering) Configuration
// Optimized for server environments with all visual features enabled
export const ssrConfig: Required<PlipConfig> = {
  silent: false,
  enableEmojis: true, // Enabled by default for rich server logs
  enableColors: true, // Enabled by default for better readability
  enableSyntaxHighlighting: true, // Enabled by default for object formatting
  theme: {},
  enabledLevels: isProduction() 
    ? [] // No logs in production by default - user must explicitly enable
    : ["info", "warn", "error", "success", "debug", "trace", "verbose"], // All levels in development
  devOnly: false,
};

// CSR (Client-Side Rendering) Configuration 
// Optimized for browser environments with all visual features enabled
export const csrConfig: Required<PlipConfig> = {
  silent: false,
  enableEmojis: true, // Visual appeal in browser console
  enableColors: true, // Enhanced readability in browser dev tools
  enableSyntaxHighlighting: true, // Rich formatting for debugging
  theme: {},
  enabledLevels: isProduction() 
    ? [] // No logs in production by default - user must explicitly enable
    : ["verbose", "debug", "info", "success", "warn", "error", "trace"], // Full logging in development
  devOnly: false,
};

/**
 * Automatically detects the environment and returns appropriate configuration
 * CSR is the default as requested
 */
export function getAutoConfig(): Required<PlipConfig> {
  // If explicitly in Node.js server environment, use SSR config
  if (isNode() && !isBrowser()) {
    return ssrConfig;
  }
  
  // For browser or mixed environments, default to CSR
  return csrConfig;
}

/**
 * Creates a configuration optimized for SSR (Server-Side Rendering)
 * @param overrides Optional configuration overrides
 */
export function createSSRConfig(overrides: Partial<PlipConfig> = {}): Required<PlipConfig> {
  return { ...ssrConfig, ...overrides };
}

/**
 * Creates a configuration optimized for CSR (Client-Side Rendering)
 * @param overrides Optional configuration overrides
 */
export function createCSRConfig(overrides: Partial<PlipConfig> = {}): Required<PlipConfig> {
  return { ...csrConfig, ...overrides };
}
