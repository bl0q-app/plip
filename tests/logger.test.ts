// tests/logger.test.ts
import { test, expect, describe, beforeEach, afterEach } from "bun:test";
import { plip, createPlip } from "../src/lib/index.js";
import clc from 'cli-color';
import { hasColors } from "../src/utils/colors.js";

// Mock console.log to capture output
let consoleLogs: string[] = [];
const originalLog = console.log;

beforeEach(() => {
  consoleLogs = [];
  console.log = (...args: any[]) => {
    consoleLogs.push(args.join(" "));
  };
});

afterEach(() => {
  console.log = originalLog;
});

describe("plip logger", () => {
  test("basic logging methods work", () => {
    const logger = createPlip({ devOnly: false });
    
    logger.info("test info");
    logger.warn("test warn");
    logger.error("test error");
    logger.success("test success");
    logger.debug("test debug");
    logger.trace("test trace");
    logger.verbose("test verbose");

    expect(consoleLogs).toHaveLength(7);
    expect(consoleLogs[0]).toContain("[INFO]");
    expect(consoleLogs[0]).toContain("test info");
    expect(consoleLogs[1]).toContain("[WARN]");
    expect(consoleLogs[2]).toContain("[ERROR]");
    expect(consoleLogs[3]).toContain("[SUCCESS]");
    expect(consoleLogs[4]).toContain("[DEBUG]");
    expect(consoleLogs[5]).toContain("[TRACE]");
    expect(consoleLogs[6]).toContain("[VERBOSE]");
  });

  test("silent mode suppresses all logs", () => {
    const logger = createPlip({ silent: true, devOnly: false });
    
    logger.info("test");
    logger.error("test");
    
    expect(consoleLogs).toHaveLength(0);
  });

  test("can disable emojis", () => {
    const logger = createPlip({ enableEmojis: false, devOnly: false });
    
    logger.info("test");
    
    expect(consoleLogs[0]).not.toContain("🫧");
    expect(consoleLogs[0]).toContain("[INFO]");
  });

  test("can disable colors", () => {
    const logger = createPlip({ enableColors: false, devOnly: false });
    
    logger.info("test");
    
    expect(consoleLogs[0]).not.toContain("\x1b[36m");
    expect(consoleLogs[0]).toContain("[INFO]");
  });  test("can customize theme", () => {
    const logger = createPlip({
      devOnly: false,
      theme: {
        emojis: {
            info: "ℹ️",
            warn: "",
            error: "",
            success: "",
            debug: "",
            trace: "",
            verbose: ""
        },
        colors: {
            info: clc.magenta,
            warn: clc.reset,
            error: clc.reset,
            success: clc.reset,
            debug: clc.reset,
            trace: clc.reset,
            verbose: clc.reset
        },        dimColors: {
            info: (text: string) => clc.magenta(clc.blackBright(text)),
            warn: clc.reset,
            error: clc.reset,
            success: clc.reset,
            debug: clc.reset,
            trace: clc.reset,
            verbose: clc.reset
        }
      }
    });
    
    logger.info("test");
      expect(consoleLogs[0]).toContain("ℹ️");
    expect(hasColors(consoleLogs[0] || "")).toBe(true);
  });

  test("can filter enabled levels", () => {
    const logger = createPlip({ 
      enabledLevels: ["error", "warn"], 
      devOnly: false 
    });
    
    logger.info("should not show");
    logger.warn("should show");
    logger.error("should show");
    logger.debug("should not show");
    
    expect(consoleLogs).toHaveLength(2);
    expect(consoleLogs[0]).toContain("[WARN]");
    expect(consoleLogs[1]).toContain("[ERROR]");
  });

  test("fluent API works", () => {
    const logger = createPlip({ devOnly: false })
      .withEmojis(false)
      .withColors(false)
      .levels("info", "error");
    
    logger.info("test info");
    logger.warn("test warn");
    logger.error("test error");
    
    expect(consoleLogs).toHaveLength(2);
    expect(consoleLogs[0]).toContain("[INFO]");
    expect(consoleLogs[1]).toContain("[ERROR]");
  });
  test("handles multiple arguments", () => {
    const logger = createPlip({ devOnly: false, enableSyntaxHighlighting: false });
    
    logger.info("test", { key: "value" }, 123, true);
    
    expect(consoleLogs[0]).toContain("test");
    expect(consoleLogs[0]).toContain('"key": "value"');
    expect(consoleLogs[0]).toContain("123");
    expect(consoleLogs[0]).toContain("true");
  });

  test("production mode respects devOnly setting", () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = "production";
    
    const logger = createPlip({ devOnly: true });
    logger.info("should not show in production");
    
    expect(consoleLogs).toHaveLength(0);
    
    process.env.NODE_ENV = originalEnv;
  });

  test("default plip instance works", () => {
    // Reset NODE_ENV to ensure plip works
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = "development";
    
    plip.info("default instance test");
    
    expect(consoleLogs).toHaveLength(1);
    expect(consoleLogs[0]).toContain("[INFO]");
    
    process.env.NODE_ENV = originalEnv;
  });
});