# Logger API Reference

Complete reference for all Plip Logger methods and properties.

## Core Methods

### Log Level Methods

#### `plip.verbose(message, ...args)`

Logs verbose/trace level messages for detailed debugging.

```typescript
plip.verbose("Function entry", { functionName: "processUser", args });
plip.verbose("Loop iteration", { index: i, item: data[i] });
```

**Parameters:**
- `message` (string) - The log message
- `...args` (any[]) - Additional data to log

**When to use:** Extremely detailed debugging information, typically disabled in production.

---

#### `plip.debug(message, ...args)`

Logs debug information for development debugging.

```typescript
plip.debug("Cache hit", { key: "user:123", ttl: 300 });
plip.debug("Database query", { query, params, duration: "45ms" });
```

**Parameters:**
- `message` (string) - The log message  
- `...args` (any[]) - Additional data to log

**When to use:** Development debugging, variable inspection, performance metrics.

---

#### `plip.info(message, ...args)`

Logs general information about application flow.

```typescript
plip.info("User logged in", { userId: "123", timestamp: new Date() });
plip.info("Email sent", { recipient: "user@example.com", template: "welcome" });
```

**Parameters:**
- `message` (string) - The log message
- `...args` (any[]) - Additional data to log

**When to use:** Normal application flow, important events, user actions.

---

#### `plip.success(message, ...args)`

Logs successful operations and positive outcomes.

```typescript
plip.success("Payment processed", { amount: 100, currency: "USD" });
plip.success("Backup completed", { files: 1250, size: "2.3GB" });
```

**Parameters:**
- `message` (string) - The log message
- `...args` (any[]) - Additional data to log

**When to use:** Successful completion of operations, milestones, achievements.

---

#### `plip.warn(message, ...args)`

Logs warnings for potential issues or degraded functionality.

```typescript
plip.warn("High memory usage", { usage: "85%", threshold: "80%" });
plip.warn("API rate limit approaching", { current: 95, limit: 100 });
```

**Parameters:**
- `message` (string) - The log message
- `...args` (any[]) - Additional data to log

**When to use:** Potential problems, performance issues, deprecated features.

---

#### `plip.error(message, ...args)`

Logs error conditions and failed operations.

```typescript
plip.error("Database connection failed", error);
plip.error("Payment processing error", { orderId: "123", error: error.message });
```

**Parameters:**
- `message` (string) - The log message
- `...args` (any[]) - Additional data to log (including Error objects)

**When to use:** Error conditions, failed operations, exceptions.

---

#### `plip.trace(message, ...args)`

Logs execution trace information for detailed debugging.

```typescript
plip.trace("Function call trace", { function: "processUser", args: [123] });
plip.trace("Execution path", { step: "validation", result: "passed" });
```

**Parameters:**
- `message` (string) - The log message
- `...args` (any[]) - Additional data to log

**When to use:** Critical system failures, application-stopping errors.

## Configuration Methods

### `plip.configure(options)`

Configure the global Plip logger instance.

```typescript
plip.configure({
  level: 'info',
  colors: true,
  emojis: true,
  timestamp: false,
  prefix: '[APP]'
});
```

**Parameters:**
- `options` (PlipConfig) - Configuration options

**Returns:** `PlipLogger` - The configured logger instance

---

### `plip.withPrefix(prefix)`

Create a new logger instance with a custom prefix.

```typescript
const dbLogger = plip.withPrefix('[DB]');
const apiLogger = plip.withPrefix('[API]');

dbLogger.info("Connection established");
apiLogger.info("Request received");
```

**Parameters:**
- `prefix` (string) - The prefix to add to all log messages

**Returns:** `PlipLogger` - New logger instance with prefix

---

### `plip.withTimestamp(enabled?)`

Create a new logger instance with timestamp configuration.

```typescript
const timestampedLogger = plip.withTimestamp(true);
const noTimestampLogger = plip.withTimestamp(false);
```

**Parameters:**
- `enabled` (boolean, optional) - Whether to include timestamps (default: true)

**Returns:** `PlipLogger` - New logger instance with timestamp setting

---

### `plip.withLevel(level)`

Create a new logger instance with a specific log level.

```typescript
const debugLogger = plip.withLevel('debug');
const productionLogger = plip.withLevel('warn');
```

**Parameters:**
- `level` (LogLevel | string) - The minimum log level

**Returns:** `PlipLogger` - New logger instance with specified level

## Utility Methods

### `plip.createLogger(options?)`

Create a new independent logger instance.

```typescript
const customLogger = plip.createLogger({
  level: 'debug',
  prefix: '[CUSTOM]',
  colors: false
});
```

**Parameters:**
- `options` (PlipConfig, optional) - Configuration options

**Returns:** `PlipLogger` - New logger instance

---

### `plip.isLevelEnabled(level)`

Check if a specific log level is enabled.

```typescript
if (plip.isLevelEnabled('debug')) {
  const expensiveDebugData = generateDebugInfo();
  plip.debug("Debug info", expensiveDebugData);
}
```

**Parameters:**
- `level` (LogLevel | string) - The log level to check

**Returns:** `boolean` - Whether the level is enabled

---

### `plip.getLevel()`

Get the current log level.

```typescript
const currentLevel = plip.getLevel();
console.log(`Current log level: ${currentLevel}`);
```

**Returns:** `string` - The current log level

---

### `plip.setLevel(level)`

Set the log level for the current logger instance.

```typescript
plip.setLevel('info');
plip.setLevel(LogLevel.DEBUG);
```

**Parameters:**
- `level` (LogLevel | string) - The log level to set

**Returns:** `PlipLogger` - The logger instance (for chaining)

## Properties

### `plip.version`

The current version of Plip Logger.

```typescript
console.log(`Plip version: ${plip.version}`);
```

**Type:** `string`

---

### `plip.config`

The current configuration object.

```typescript
console.log('Current config:', plip.config);
```

**Type:** `PlipConfig`

---

### `plip.level`

The current log level as a number.

```typescript
if (plip.level <= LogLevel.DEBUG) {
  // Debug logging is enabled
}
```

**Type:** `number`

## Method Chaining

Most Plip methods support chaining for fluent configuration:

```typescript
plip
  .withPrefix('[API]')
  .withTimestamp(true)
  .configure({ colors: true })
  .info("Configured logger ready");

const customLogger = plip
  .createLogger()
  .withLevel('debug')
  .withPrefix('[CUSTOM]');
```

## Error Handling

### Logging Error Objects

Plip automatically handles Error objects and extracts useful information:

```typescript
try {
  throw new Error("Something went wrong");
} catch (error) {
  // All of these work
  plip.error(error);
  plip.error("Operation failed", error);
  plip.error("Operation failed", { error, context: "additional info" });
}
```

### Stack Traces

Error stack traces are automatically included when logging Error objects:

```typescript
const error = new Error("Database connection failed");
plip.error("Critical error", error);
// Includes full stack trace in output
```

## Performance Considerations

### Conditional Logging

Use level checking for expensive operations:

```typescript
// ❌ Always executes expensive operation
plip.debug("Data", generateExpensiveDebugData());

// ✅ Only executes when debug is enabled
if (plip.isLevelEnabled('debug')) {
  plip.debug("Data", generateExpensiveDebugData());
}
```

### Lazy Evaluation

Use functions for lazy evaluation:

```typescript
// ✅ Only evaluated when needed
plip.debug("Complex data", () => ({
  memory: process.memoryUsage(),
  cpu: process.cpuUsage(),
  timestamp: new Date()
}));
```

## Examples

### Basic Usage

```typescript
import { plip } from '@ru-dr/plip';

plip.info("Application starting");
plip.success("Connected to database");
plip.warn("High memory usage detected");
plip.error("Failed to send email", error);
```

### Advanced Configuration

```typescript
// Production configuration
const productionLogger = plip.createLogger({
  level: 'info',
  colors: false,
  emojis: false,
  timestamp: true,
  format: 'json'
});

// Development configuration
const devLogger = plip.createLogger({
  level: 'debug',
  colors: true,
  emojis: true,
  timestamp: false
});
```

### Module-Specific Loggers

```typescript
// Create module-specific loggers
const authLogger = plip.withPrefix('[AUTH]');
const dbLogger = plip.withPrefix('[DB]');
const apiLogger = plip.withPrefix('[API]');

// Use in different modules
authLogger.info("User authenticated");
dbLogger.debug("Query executed", { duration: "45ms" });
apiLogger.warn("Rate limit exceeded");
```

## Next Steps

- [Configuration API](/references/configuration) - Detailed configuration options
- [TypeScript Types](/references/types) - Type definitions and interfaces
- [Environment Variables](/references/environment) - Environment configuration
