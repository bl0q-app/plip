// src/lib/config.ts

import { colors } from '../utils/colors.js';

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
