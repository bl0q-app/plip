# Log Levels

Plip provides 7 distinct log levels, each with its own emoji, color scheme, and semantic meaning.

## Overview

| Level | Emoji | Color | Use Case |
|-------|-------|-------|----------|
| `verbose` | 🔍 | Gray | Detailed debugging information |
| `debug` | 🐛 | Blue | Development debugging |
| `info` | 🫧 | Cyan | General information |
| `success` | 🎉 | Green | Success/completion messages |
| `warn` | ⚠️ | Yellow | Warnings and potential issues |
| `error` | 💥 | Red | Error conditions |
| `fatal` | 💀 | Magenta | Critical errors |

## Level Details

### Verbose 🔍
**Purpose**: Ultra-detailed debugging information  
**When to use**: Tracing execution flow, variable states, detailed function calls

```typescript
plip.verbose("Function entered with parameters:", { userId: 123, action: 'login' });
plip.verbose("Database query executed:", "SELECT * FROM users WHERE id = ?");
plip.verbose("Loop iteration:", { index: 5, total: 10 });
```

### Debug 🐛
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

### Fatal 💀
**Purpose**: Critical errors that may cause application termination  
**When to use**: Unrecoverable errors, system crashes, critical failures

```typescript
plip.fatal("Cannot connect to required service after 5 retries");
plip.fatal("Critical configuration missing:", { required: 'DATABASE_URL' });
plip.fatal("Out of memory error:", { available: '10MB', required: '500MB' });
```

## Level Hierarchy

Log levels follow a hierarchy where enabling a level includes all higher-priority levels:

```
fatal (highest priority)
  ↑
error
  ↑
warn
  ↑
success
  ↑
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
  enabledLevels: ['warn', 'error', 'fatal']
});
```

### Environment-Based Levels

```typescript
const getLogLevels = () => {
  switch (process.env.NODE_ENV) {
    case 'development':
      return ['verbose', 'debug', 'info', 'success', 'warn', 'error', 'fatal'];
    case 'staging':
      return ['info', 'success', 'warn', 'error', 'fatal'];
    case 'production':
      return ['warn', 'error', 'fatal'];
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

plip.debug("🐛 Checking user eligibility for discount");
plip.debug("🐛 User has premium status: true");

plip.verbose("🔍 Applying 20% premium discount");
plip.verbose("🔍 Final price calculated:", { original: 100, final: 80 });

plip.debug("🐛 Discount calculation completed");
```

## Best Practices

### 1. Choose the Right Level
- Use `info` for business logic milestones
- Use `debug` for technical implementation details
- Use `warn` for issues that need attention but don't break functionality
- Use `error` for failures that are handled gracefully
- Use `fatal` only for truly critical, unrecoverable errors

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
- **Production**: Focus on `warn`, `error`, and `fatal` levels
- **Testing**: Consider disabling or mocking logs entirely

## Next Steps

- Learn about [Customization](/guide/customization) options
- Explore [Examples](/examples/) of level usage
- Check the [API Reference](/api/logger) for method details
