# Log Levels

Plip provides 7 distinct log levels, each with its own emoji, color scheme, and semantic meaning.

## Overview

| Level | Emoji | Color | Use Case |
|-------|-------|-------|----------|
| `verbose` | 📢 | Gray | Detailed debugging information |
| `debug` | 🔍 | Magenta | Development debugging |
| `info` | 🫧 | Cyan | General information |
| `success` | 🎉 | Green | Success/completion messages |
| `warn` | ⚠️ | Yellow | Warnings and potential issues |
| `error` | 💥 | Red | Error conditions |
| `trace` | 🛰️ | Blue | Execution trace information |

## Level Details

### Verbose 📢
**Purpose**: Ultra-detailed debugging information  
**When to use**: Tracing execution flow, variable states, detailed function calls

```typescript
plip.verbose("Function entered with parameters:", { userId: 123, action: 'login' });
plip.verbose("Database query executed:", "SELECT * FROM users WHERE id = ?");
plip.verbose("Loop iteration:", { index: 5, total: 10 });
```

### Debug 🔍
**Purpose**: Development debugging information  
**When to use**: Debugging logic, state changes, development-only information

```typescript
plip.debug("User authentication flow started");
plip.debug("Middleware stack:", middlewareList);
plip.debug("Cache hit for key:", cacheKey);
```

### Info 🫧
**Purpose**: General informational messages  
**When to use**: Application lifecycle, normal operations, status updates

```typescript
plip.info("Server started on port 3000");
plip.info("User logged in:", { userId: 123, username: 'alice' });
plip.info("Processing batch of 50 items");
```

### Success 🎉
**Purpose**: Successful operations and completions  
**When to use**: Task completion, successful operations, positive outcomes

```typescript
plip.success("User registration completed successfully");
plip.success("File uploaded:", { filename: 'document.pdf', size: '2.5MB' });
plip.success("Database migration finished");
```

### Warn ⚠️
**Purpose**: Warning conditions that need attention  
**When to use**: Deprecated features, recoverable errors, performance issues

```typescript
plip.warn("API rate limit approaching: 80% of quota used");
plip.warn("Using deprecated function 'oldMethod()', migrate to 'newMethod()'");
plip.warn("High memory usage detected:", { usage: '85%', threshold: '80%' });
```

### Error 💥
**Purpose**: Error conditions and failures  
**When to use**: Recoverable errors, failed operations, exception handling

```typescript
plip.error("Failed to connect to database:", error.message);
plip.error("User authentication failed:", { userId: 123, reason: 'invalid_password' });
plip.error("API request failed:", { url, status: 500, error });
```

### Trace 🛰️
**Purpose**: Execution trace information  
**When to use**: Function call traces, execution flow, detailed debugging paths

```typescript
plip.trace("Function call trace:", { function: 'processUser', args: [userId] });
plip.trace("Execution path:", { step: 'validation', result: 'passed' });
plip.trace("Call stack depth:", { depth: 5, maxDepth: 10 });
```

## Log Level Selection

Plip uses an explicit level selection approach where you specify exactly which levels you want enabled:

```typescript
// Enable only specific levels
const logger = createPlip({
  enabledLevels: ['info', 'warn', 'error'] // Only these levels will be logged
});

// Enable all levels for development
const devLogger = createPlip({
  enabledLevels: ['verbose', 'debug', 'info', 'success', 'warn', 'error', 'trace']
});

// Enable minimal levels for production
const prodLogger = createPlip({
  enabledLevels: ['warn', 'error'] // Only warnings and errors
});
```

**Note**: Unlike traditional loggers, Plip doesn't use a hierarchical level system. You explicitly choose which levels to enable, giving you fine-grained control over your logging output.
info
  ↑
debug
  ↑
verbose (lowest priority)
```

## Configuring Log Levels

### Enable Specific Levels

```typescript
import { createPlip } from '@ru-dr/plip';

// Only show warnings and errors
const logger = createPlip({
  enabledLevels: ['warn', 'error']
});
```

### Environment-Based Levels

```typescript
const getLogLevels = () => {
  switch (process.env.NODE_ENV) {
    case 'development':
      return ['verbose', 'debug', 'info', 'success', 'warn', 'error', 'trace'];
    case 'staging':
      return ['info', 'success', 'warn', 'error'];
    case 'production':
      return ['warn', 'error'];
    default:
      return ['info', 'warn', 'error'];
  }
};

const logger = createPlip({
  enabledLevels: getLogLevels()
});
```

## Level Usage Examples

### Development Workflow

```typescript
// Starting a complex operation
plip.info("🚀 Starting user registration process");

// Debug information
plip.debug("Validating user input:", userData);
plip.verbose("Validation rules applied:", validationRules);

// Success path
plip.success("✅ User validation passed");
plip.info("📧 Sending welcome email");
plip.success("✅ Registration completed successfully");

// Error handling
if (emailFailed) {
  plip.warn("⚠️ Welcome email failed to send, user registered anyway");
}
```

### Production Monitoring

```typescript
// System health
plip.info("📊 System health check passed");

// Performance warnings
if (responseTime > 1000) {
  plip.warn("🐌 Slow response time detected:", { 
    endpoint: '/api/users', 
    responseTime: `${responseTime}ms` 
  });
}

// Error tracking
try {
  await processPayment(order);
  plip.success("💳 Payment processed successfully");
} catch (error) {
  plip.error("💥 Payment processing failed:", {
    orderId: order.id,
    error: error.message
  });
}
```

### Debugging Session

```typescript
// Trace function execution
plip.verbose("🔍 Entering calculateDiscount()");
plip.verbose("🔍 Input parameters:", { price: 100, userType: 'premium' });

plip.debug("🔍 Checking user eligibility for discount");
plip.debug("🔍 User has premium status: true");

plip.verbose("🔍 Applying 20% premium discount");
plip.verbose("🔍 Final price calculated:", { original: 100, final: 80 });

plip.debug("🔍 Discount calculation completed");
```

## Best Practices

### 1. Choose the Right Level
- Use `info` for business logic milestones
- Use `debug` for technical implementation details
- Use `warn` for issues that need attention but don't break functionality
- Use `error` for failures that are handled gracefully
- Use `trace` for execution flow and detailed debugging paths

### 2. Be Consistent
Establish team conventions for when to use each level:

```typescript
// Good: Consistent usage
plip.info("User session started");
plip.info("User session ended");

// Avoid: Inconsistent levels for similar events
plip.info("User session started");
plip.debug("User session ended");
```

### 3. Include Context
Always provide relevant context with your logs:

```typescript
// Good: Rich context
plip.error("Database connection failed:", {
  host: 'db.example.com',
  port: 5432,
  database: 'myapp',
  error: error.message
});

// Avoid: Minimal context
plip.error("Database error");
```

### 4. Environment Considerations
- **Development**: Enable all levels for maximum visibility
- **Production**: Focus on `warn` and `error` levels
- **Testing**: Consider disabling or mocking logs entirely

## Next Steps

- Learn about [Customization](/guide/customization-guide) options
- Explore [Examples](/examples/) of level usage
- Check the [API Reference](/api/logger) for method details
