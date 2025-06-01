# Logger API

Complete API reference for Plip Logger methods and functionality.

## Default Logger

### `plip`

The default logger instance, ready to use immediately:

```typescript
import { plip } from '@ru-dr/plip';

plip.info("Hello from Plip!");
```

## Logger Methods

All logger instances (including the default `plip`) provide these methods:

### Log Level Methods

#### `verbose(message: string, data?: any): void`

Logs verbose debugging information.

```typescript
plip.verbose("Function entered", { params: { id: 123 } });
plip.verbose("Processing item 5 of 10");
```

**Output**: `🔍 [VERBOSE] Function entered { "params": { "id": 123 } }`

#### `debug(message: string, data?: any): void`

Logs debug information for development.

```typescript
plip.debug("Cache miss for key", { key: "user:123" });
plip.debug("Middleware stack initialized");
```

**Output**: `🔍 [DEBUG] Cache miss for key { "key": "user:123" }`

#### `info(message: string, data?: any): void`

Logs general information messages.

```typescript
plip.info("Server started on port 3000");
plip.info("User authenticated", { userId: 123, role: "admin" });
```

**Output**: `🫧 [INFO] Server started on port 3000`

#### `success(message: string, data?: any): void`

Logs successful operations and completions.

```typescript
plip.success("File uploaded successfully", { filename: "document.pdf" });
plip.success("Database migration completed");
```

**Output**: `🎉 [SUCCESS] File uploaded successfully { "filename": "document.pdf" }`

#### `warn(message: string, data?: any): void`

Logs warning conditions.

```typescript
plip.warn("API rate limit approaching", { usage: "80%", limit: "100/min" });
plip.warn("Deprecated method used", { method: "oldFunction()" });
```

**Output**: `⚠️ [WARN] API rate limit approaching { "usage": "80%", "limit": "100/min" }`

#### `error(message: string, data?: any): void`

Logs error conditions and failures.

```typescript
plip.error("Database connection failed", { host: "localhost", port: 5432 });
plip.error("Authentication failed", { userId: 123, reason: "invalid_token" });
```

**Output**: `💥 [ERROR] Database connection failed { "host": "localhost", "port": 5432 }`

#### `trace(message: string, data?: any): void`

Logs execution trace information for detailed debugging.

```typescript
plip.trace("Function call trace", { function: "processUser", args: [123] });
plip.trace("Execution path", { step: "validation", result: "passed" });
```

**Output**: `🛰️ [TRACE] Function call trace { "function": "processUser", "args": [123] }`

## Factory Functions

### `createPlip(config?: PlipConfig): PlipLogger`

Creates a new logger instance with custom configuration.

```typescript
import { createPlip } from '@ru-dr/plip';

const customLogger = createPlip({
  enableEmojis: true,
  enableColors: true,
  enabledLevels: ['info', 'warn', 'error']
});
```

**Parameters**:
- `config` (optional): Configuration object of type `PlipConfig`

**Returns**: A new `PlipLogger` instance

## Logger Instance Properties

### `config: PlipConfig`

Read-only access to the logger's current configuration:

```typescript
const logger = createPlip({ enableEmojis: true });
console.log(logger.config.enableEmojis); // true
```

## Configuration Methods

Logger configuration methods support fluent chaining:

```typescript
const customLogger = plip
  .withEmojis(true)
  .withColors(true)
  .withSyntaxHighlighting(true)
  .withContext({ service: "api", version: "1.0" })
  .levels('info', 'warn', 'error');

// Context is automatically included in all logs
customLogger.info("Request processed", { endpoint: "/users" });
// Output: 🫧 [INFO] Request processed {"service":"api","version":"1.0","endpoint":"/users"}

// Note: Logging methods (info, debug, etc.) do not support chaining
plip.info("Starting operation");
plip.debug("Debug information");
plip.success("Operation completed");
```

### `withContext(context: Record<string, any>): PlipLogger`

Adds persistent context to all log messages. Context is merged with any data provided to individual log calls:

```typescript
// Create a logger with persistent context
const authLogger = plip.withContext({ scope: "auth", service: "user-service" });

// Context is automatically included
authLogger.info("Login attempt"); 
// Output: 🫧 [INFO] Login attempt {"scope":"auth","service":"user-service"}

authLogger.error("Login failed", { userId: 123, reason: "invalid_password" });
// Output: 💥 [ERROR] Login failed {"scope":"auth","service":"user-service","userId":123,"reason":"invalid_password"}

// Context can be extended by chaining
const requestLogger = authLogger.withContext({ requestId: "req-456" });
requestLogger.warn("Rate limit exceeded");
// Output: ⚠️ [WARN] Rate limit exceeded {"scope":"auth","service":"user-service","requestId":"req-456"}
```

## Data Parameter

The optional `data` parameter accepts any serializable value:

### Primitive Values

```typescript
plip.info("User age", 25);
plip.info("Is admin", true);
plip.info("Username", "alice");
```

### Objects

```typescript
plip.info("User profile", {
  id: 123,
  name: "Alice",
  email: "alice@example.com",
  preferences: {
    theme: "dark",
    notifications: true
  }
});
```

### Arrays

```typescript
plip.info("User skills", ["TypeScript", "React", "Node.js"]);
plip.info("Error codes", [404, 500, 503]);
```

### Complex Objects

```typescript
plip.info("Request details", {
  method: "POST",
  url: "/api/users",
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer ..."
  },
  body: { name: "Alice", email: "alice@example.com" },
  timestamp: new Date().toISOString()
});
```

## Error Handling

Plip handles logging errors gracefully and never throws exceptions:

```typescript
// These won't crash your application
plip.info("Message", { circular: /* circular reference */ });
plip.info("Message", undefined);
plip.info("Message", Symbol("test"));
```

## Performance Considerations

### Lazy Evaluation

Log data is only processed when the log level is enabled:

```typescript
const expensiveData = () => {
  // This only runs if debug level is enabled
  return performExpensiveCalculation();
};

plip.debug("Debug info", expensiveData());
```

### Conditional Logging

Check if a level is enabled before expensive operations:

```typescript
if (logger.isLevelEnabled('debug')) {
  const debugData = generateComplexDebugInfo();
  logger.debug("Complex debug info", debugData);
}
```

## Type Safety

All methods are fully typed for TypeScript users:

```typescript
// TypeScript will catch these errors
plip.info(123); // Error: message must be string
plip.invalidMethod("test"); // Error: method doesn't exist

// Proper usage
plip.info("Valid message", { any: "data" }); // ✓
```

## Usage Examples

### Basic Logging

```typescript
import { plip } from '@ru-dr/plip';

// Simple messages
plip.info("Application started");
plip.warn("Configuration missing, using defaults");

// With data
plip.info("User logged in", { userId: 123, timestamp: Date.now() });
plip.error("Login failed", { error: "Invalid credentials", attempt: 3 });
```

### Custom Logger

```typescript
import { createPlip } from '@ru-dr/plip';

const apiLogger = createPlip({
  enableEmojis: true,
  enableColors: true,
  enabledLevels: ['info', 'warn', 'error']
});

apiLogger.info("API request received", {
  method: "GET",
  path: "/users/123",
  userAgent: "Mozilla/5.0..."
});
```

### Service Integration

```typescript
class UserService {
  private logger = createPlip({
    enableEmojis: true,
    enabledLevels: ['debug', 'info', 'warn', 'error']
  });

  async createUser(userData: UserData) {
    this.logger.info("Creating new user", { email: userData.email });
    
    try {
      const user = await this.database.create(userData);
      this.logger.success("User created successfully", { userId: user.id });
      return user;
    } catch (error) {
      this.logger.error("Failed to create user", {
        email: userData.email,
        error: error.message
      });
      throw error;
    }
  }
}
```

## Next Steps

- Learn about [Configuration](/api/configuration) options
- Explore [Types](/api/types) definitions
- Check out practical [Examples](/examples/)
