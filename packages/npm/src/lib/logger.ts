// src/lib/logger.ts

import type { LogLevel, PlipConfig, PlipTheme } from "./config.js";
import { 
  defaultTheme, 
  defaultConfig, 
  createSSRConfig, 
  createCSRConfig,
  csrConfig 
} from "./config.js";
import { isDevelopment, supportsColor, supportsEmoji } from "../utils/env.js";
import { formatObject } from "../utils/colors.js";

class PlipLogger {
  private config: Required<PlipConfig>;
  private theme: PlipTheme;
  private context: Record<string, any>;

  constructor(config: PlipConfig = {}, context: Record<string, any> = {}) {
    const isDev = isDevelopment();
    
    this.config = {
      ...defaultConfig,
      silent: config.silent ?? defaultConfig.silent,
      enableEmojis: config.enableEmojis ?? (defaultConfig.enableEmojis && supportsEmoji()),
      enableColors: config.enableColors ?? (defaultConfig.enableColors && supportsColor()),
      enableSyntaxHighlighting: config.enableSyntaxHighlighting ?? defaultConfig.enableSyntaxHighlighting,
      theme: config.theme ?? defaultConfig.theme,
      enabledLevels: config.enabledLevels ?? defaultConfig.enabledLevels,
      devOnly: config.devOnly ?? isDev,
    };

    this.theme = {
      emojis: { ...defaultTheme.emojis, ...this.config.theme.emojis },
      colors: { ...defaultTheme.colors, ...this.config.theme.colors },
      dimColors: { ...defaultTheme.dimColors, ...this.config.theme.dimColors },
    };

    this.context = context;
  }
  configure(newConfig: Partial<PlipConfig>): PlipLogger {
    return new PlipLogger({ ...this.config, ...newConfig }, this.context);
  }
  
  private shouldLog(level: LogLevel): boolean {
    if (this.config.silent) return false;
    if (this.config.devOnly && !isDevelopment()) return false;
    return this.config.enabledLevels.includes(level);
  }

  private formatMessage(level: LogLevel, message: string): string {
    const emoji = this.config.enableEmojis ? this.theme.emojis[level] : "";
    const levelText = `[${level.toUpperCase()}]`;
    
    if (!this.config.enableColors) {
      return `${emoji} ${levelText} ${message}`;
    }

    // Use regular color for level text and emoji, dim color for the message
    const levelColor = this.theme.colors[level];
    const messageColor = this.theme.dimColors[level];
    
    const coloredLevel = levelColor ? levelColor(`${emoji} ${levelText}`) : `${emoji} ${levelText}`;
    const coloredMessage = messageColor ? messageColor(message) : message;
    
    return `${coloredLevel} ${coloredMessage}`;
  }

  private processArgument(arg: any): string {
    if (typeof arg === "string") {
      return arg;
    }
    
    if (this.config.enableSyntaxHighlighting && this.config.enableColors) {
      return formatObject(arg, true);
    }
    
    return JSON.stringify(arg, null, 2);
  }
  private log(level: LogLevel, ...args: any[]): void {
    if (!this.shouldLog(level)) return;

    // Handle context merging when there are object arguments and context exists
    let processedArgs = args;
    if (Object.keys(this.context).length > 0) {
      // Find the last object argument to merge context with
      const lastArgIndex = args.length - 1;
      const lastArg = args[lastArgIndex];
      
      if (lastArg && typeof lastArg === 'object' && lastArg.constructor === Object) {
        // Merge context with the last object argument
        processedArgs = [
          ...args.slice(0, lastArgIndex),
          { ...this.context, ...lastArg }
        ];
      } else {
        // No object to merge with, append context as a new argument
        processedArgs = [...args, this.context];
      }
    }

    const formattedArgs = processedArgs.map(arg => this.processArgument(arg));
    const message = formattedArgs.join(" ");

    console.log(this.formatMessage(level, message));
  }

  info = (...args: any[]) => this.log("info", ...args);
  warn = (...args: any[]) => this.log("warn", ...args);
  error = (...args: any[]) => this.log("error", ...args);
  success = (...args: any[]) => this.log("success", ...args);
  debug = (...args: any[]) => this.log("debug", ...args);
  trace = (...args: any[]) => this.log("trace", ...args);
  verbose = (...args: any[]) => this.log("verbose", ...args);

  // Utility methods
  silent(): PlipLogger {
    return this.configure({ silent: true });
  }

  withEmojis(enabled: boolean = true): PlipLogger {
    return this.configure({ enableEmojis: enabled });
  }

  withColors(enabled: boolean = true): PlipLogger {
    return this.configure({ enableColors: enabled });
  }

  withSyntaxHighlighting(enabled: boolean = true): PlipLogger {
    return this.configure({ enableSyntaxHighlighting: enabled });
  }

  withTheme(theme: Partial<PlipTheme>): PlipLogger {
    return this.configure({ theme: { ...this.config.theme, ...theme } });
  }
  levels(...levels: LogLevel[]): PlipLogger {
    return this.configure({ enabledLevels: levels });
  }

  withContext(context: Record<string, any>): PlipLogger {
    return new PlipLogger(this.config, { ...this.context, ...context });
  }
}

// Default instance with CSR configuration by default (as requested)
export const plip = new PlipLogger(csrConfig);

// Factory function for custom instances
export const createPlip = (config: PlipConfig = {}) => new PlipLogger(config, {});

/**
 * Creates a logger optimized for SSR (Server-Side Rendering)
 * Features:
 * - Rich emojis and colors for enhanced readability
 * - Structured output suitable for both terminal and log aggregation
 * - Production-safe with no logs by default in production
 * - All visual features enabled for better debugging experience
 * 
 * @param overrides Optional configuration overrides
 * @example
 * ```typescript
 * import { createSSRLogger } from '@ru-dr/plip';
 * 
 * const serverLogger = createSSRLogger();
 * serverLogger.info("Server started", { port: 3000, env: "production" });
 * 
 * // With custom overrides
 * const customServerLogger = createSSRLogger({
 *   enabledLevels: ["error", "warn"] // Only errors and warnings
 * });
 * ```
 */
export const createSSRLogger = (overrides: Partial<PlipConfig> = {}) => 
  new PlipLogger(createSSRConfig(overrides), {});

/**
 * Creates a logger optimized for CSR (Client-Side Rendering)
 * Features:
 * - Rich visual output with colors and emojis
 * - Enhanced readability in browser console
 * - Detailed logging for development
 * - Syntax highlighting for objects
 * 
 * @param overrides Optional configuration overrides
 * @example
 * ```typescript
 * import { createCSRLogger } from '@ru-dr/plip';
 * 
 * const clientLogger = createCSRLogger();
 * clientLogger.success("User logged in", { userId: 123, timestamp: new Date() });
 * 
 * // With custom overrides
 * const customClientLogger = createCSRLogger({
 *   enabledLevels: ["info", "warn", "error"] // Reduced verbosity
 * });
 * ```
 */
export const createCSRLogger = (overrides: Partial<PlipConfig> = {}) => 
  new PlipLogger(createCSRConfig(overrides), {});

/**
 * Pre-configured SSR logger instance
 * Ready to use for server-side logging without additional configuration
 */
export const ssrLogger = createSSRLogger();

/**
 * Pre-configured CSR logger instance  
 * Ready to use for client-side logging without additional configuration
 */
export const csrLogger = createCSRLogger();
