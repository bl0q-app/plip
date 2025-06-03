// tests/ssr-csr.test.ts
import { test, expect, describe } from "bun:test";
import { 
  createSSRLogger, 
  createCSRLogger, 
  ssrLogger, 
  csrLogger, 
  getAutoConfig,
  ssrConfig,
  csrConfig 
} from '../src/lib/index.js';

describe("SSR/CSR Logger Configurations", () => {
  test("SSR config should have correct default settings", () => {
    expect(ssrConfig.enableEmojis).toBe(true); // Now enabled by default
    expect(ssrConfig.enableColors).toBe(true); // Now enabled by default
    expect(ssrConfig.enableSyntaxHighlighting).toBe(true); // Now enabled by default
  });

  test("CSR config should have correct default settings", () => {
    expect(csrConfig.enableEmojis).toBe(true);
    expect(csrConfig.enableColors).toBe(true);
    expect(csrConfig.enableSyntaxHighlighting).toBe(true);
  });

  test("createSSRLogger should create logger with SSR config", () => {
    const logger = createSSRLogger();
    expect(logger).toBeDefined();
    expect(typeof logger.info).toBe("function");
  });

  test("createCSRLogger should create logger with CSR config", () => {
    const logger = createCSRLogger();
    expect(logger).toBeDefined();
    expect(typeof logger.info).toBe("function");
  });

  test("pre-configured SSR logger should work", () => {
    expect(ssrLogger).toBeDefined();
    expect(typeof ssrLogger.info).toBe("function");
  });

  test("pre-configured CSR logger should work", () => {
    expect(csrLogger).toBeDefined();
    expect(typeof csrLogger.info).toBe("function");
  });

  test("getAutoConfig should return config", () => {
    const config = getAutoConfig();
    expect(config).toBeDefined();
    expect(typeof config.enableEmojis).toBe("boolean");
    expect(typeof config.enableColors).toBe("boolean");
    expect(typeof config.enableSyntaxHighlighting).toBe("boolean");
  });
  test("SSR logger should produce rich output with all features enabled", () => {
    // Mock console.log to capture output
    const logs: string[] = [];
    const originalLog = console.log;
    console.log = (...args: any[]) => {
      logs.push(args.join(' '));
    };

    const logger = createSSRLogger();
    logger.info("Test message");
    
    expect(logs.length).toBe(1);
    expect(logs[0]).toContain("[INFO]");
    expect(logs[0]).toContain("Test message");
    expect(logs[0]).toContain("🫧"); // Should have emoji since it's enabled by default
    
    // Restore console
    console.log = originalLog;
  });
  test("CSR logger should produce rich output", () => {
    // Mock console.log to capture output
    const logs: string[] = [];
    const originalLog = console.log;
    console.log = (...args: any[]) => {
      logs.push(args.join(' '));
    };

    const logger = createCSRLogger();
    logger.info("Test message");
    
    expect(logs.length).toBe(1);
    expect(logs[0]).toContain("[INFO]");
    expect(logs[0]).toContain("Test message");
    expect(logs[0]).toContain("🫧"); // Should have emoji
    
    // Restore console
    console.log = originalLog;
  });

  test("Both SSR and CSR should have all visual features enabled by default", () => {
    // Mock console.log to capture output
    const logs: string[] = [];
    const originalLog = console.log;
    console.log = (...args: any[]) => {
      logs.push(args.join(' '));
    };

    const testObj = { userId: 123, name: "test" };
    
    // Both SSR and CSR should now have rich formatting
    const ssrLogger = createSSRLogger();
    const csrLogger = createCSRLogger();
    
    ssrLogger.info("SSR Object:", testObj);
    csrLogger.info("CSR Object:", testObj);
    
    expect(logs.length).toBe(2);
    
    // Both should contain the object data and emojis
    expect(logs[0]).toContain("userId");
    expect(logs[1]).toContain("userId");
    
    // Both SSR and CSR should have emojis now since all features are enabled
    expect(logs[0]).toContain("🫧"); // SSR should have emoji
    expect(logs[1]).toContain("🫧"); // CSR should have emoji    // Restore console
    console.log = originalLog;
  });
});
