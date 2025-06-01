// src/lib/logger.ts

import type { LogLevel, PlipConfig, PlipTheme } from "./config.js";
import { defaultTheme, defaultConfig } from "./config.js";
import { isDevelopment, supportsColor, supportsEmoji } from "../utils/env.js";
import { formatObject, highlightCode } from "../utils/colors.js";

class PlipLogger {
  private config: Required<PlipConfig>;
  private theme: PlipTheme;

  constructor(config: PlipConfig = {}) {
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
  }

  configure(newConfig: Partial<PlipConfig>): PlipLogger {
    return new PlipLogger({ ...this.config, ...newConfig });
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

    const processedArgs = args.map(arg => this.processArgument(arg));
    const message = processedArgs.join(" ");

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
}

// Default instance
export const plip = new PlipLogger();

// Factory function for custom instances
export const createPlip = (config: PlipConfig = {}) => new PlipLogger(config);
