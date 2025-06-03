// tests/colors.test.ts
import { test, expect, describe } from "bun:test";
import { colors, colorize, stripColors, red, green, yellow, blue, magenta, cyan, gray, brightBlue, hasColors, formatObject, highlightCode } from "../src/utils/colors.js";
import clc from 'cli-color';

describe("Color Utilities", () => {
  test("colors object should contain cli-color functions", () => {
    expect(typeof colors.red).toBe("function");
    expect(typeof colors.green).toBe("function");
    expect(typeof colors.reset).toBe("string");
  });

  test("colorize should apply color when enabled", () => {
    const result = colorize("test", clc.red, true);
    expect(result).toContain("test");
    expect(hasColors(result)).toBe(true);
  });

  test("colorize should not apply color when disabled", () => {
    const result = colorize("test", clc.red, false);
    expect(result).toBe("test");
  });

  test("stripColors should remove ANSI codes", () => {
    const coloredText = clc.red("red text");
    const stripped = stripColors(coloredText);
    expect(stripped).toBe("red text");
  });

  test("color functions should work", () => {
    const redResult = red("test", true);
    const greenResult = green("test", true);
    const yellowDisabled = yellow("test", false);
    
    expect(hasColors(redResult)).toBe(true);
    expect(hasColors(greenResult)).toBe(true);
    expect(yellowDisabled).toBe("test");
  });
  test("hasColors should detect ANSI codes", () => {
    expect(hasColors(clc.red("red"))).toBe(true);
    expect(hasColors("plain text")).toBe(false);
  });

  test("formatObject should format objects with syntax highlighting", () => {
    const obj = { name: "test", value: 123 };
    const formatted = formatObject(obj, true);
    
    expect(formatted).toContain("name");
    expect(formatted).toContain("test");
    expect(formatted).toContain("123");
  });

  test("formatObject should return plain JSON when colors disabled", () => {
    const obj = { name: "test" };
    const formatted = formatObject(obj, false);
    
    expect(formatted).toBe(JSON.stringify(obj, null, 2));
    expect(hasColors(formatted)).toBe(false);
  });

  test("highlightCode should highlight JSON", () => {
    const json = '{"name": "test"}';
    const highlighted = highlightCode(json, 'json');
    
    expect(highlighted).toContain("name");
    expect(highlighted).toContain("test");
  });
});
