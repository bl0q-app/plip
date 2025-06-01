// src/lib/index.ts

export { 
  plip, 
  createPlip, 
  createSSRLogger, 
  createCSRLogger, 
  ssrLogger, 
  csrLogger 
} from "./logger.js";

export type { LogLevel, PlipConfig, PlipTheme } from "./config.js";

export { 
  defaultTheme, 
  defaultConfig, 
  ssrConfig, 
  csrConfig, 
  getAutoConfig, 
  createSSRConfig, 
  createCSRConfig 
} from "./config.js";
