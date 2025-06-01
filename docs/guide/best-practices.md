# Best Practices

Follow these best practices to get the most out of Plip Logger and maintain clean, effective logging in your applications.

## Log Level Guidelines

### Use Appropriate Levels

Choose the right log level for each message:

```typescript
// ✅ VERBOSE - Extremely detailed debugging
plip.verbose("Processing array item", { index: i, item });

// ✅ DEBUG - Development debugging
plip.debug("Cache hit for key:", cacheKey);

// ✅ INFO - General application flow
plip.info("User authentication successful");

// ✅ SUCCESS - Positive outcomes
plip.success("Data backup completed");

// ✅ WARN - Potential issues
plip.warn("API response time exceeded threshold", { responseTime: 1500 });

// ✅ ERROR - Actual problems
plip.error("Failed to connect to database", error);

// ✅ TRACE - System tracing and diagnostics  
plip.trace("Request processing completed", { requestId, duration });
```

### Level Guidelines

Understand when each level should be used:

- **VERBOSE**: Trace-level debugging, function entry/exit
- **DEBUG**: Development debugging, variable inspection
- **INFO**: Normal application flow, important events
- **SUCCESS**: Successful operations, milestones
- **WARN**: Degraded functionality, recoverable errors
- **ERROR**: Error conditions, failed operations
- **TRACE**: System tracing, diagnostics, and request tracking

## Message Formatting

### Write Clear Messages

```typescript
// ✅ Good - Clear and actionable
plip.error("Failed to authenticate user: invalid API key", {
  userId: user.id,
  keyPrefix: apiKey.substring(0, 8) + "...",
  timestamp: new Date()
});

// ❌ Poor - Vague and unhelpful
plip.error("Auth failed");
```

### Include Relevant Context

```typescript
// ✅ Good - Rich context for debugging
plip.warn("High memory usage detected", {
  currentUsage: process.memoryUsage().heapUsed,
  threshold: MEMORY_THRESHOLD,
  activeConnections: connectionPool.size,
  uptime: process.uptime()
});

// ❌ Poor - No actionable information
plip.warn("Memory warning");
```

### Use Consistent Formatting

```typescript
// ✅ Good - Consistent structure
plip.info("User action completed", {
  action: "file_upload",
  userId: user.id,
  fileName: file.name,
  fileSize: file.size,
  duration: Date.now() - startTime
});

plip.info("User action completed", {
  action: "profile_update",
  userId: user.id,
  fields: updatedFields,
  duration: Date.now() - startTime
});
```

## Error Handling

### Log Complete Error Information

```typescript
try {
  await riskyOperation();
} catch (error) {
  // ✅ Good - Complete error context
  plip.error("Risk operation failed", {
    operation: "user_data_sync",
    userId: user.id,
    error: {
      message: error.message,
      stack: error.stack,
      code: error.code
    },
    retryCount: attemptNumber,
    timestamp: new Date()
  });
}
```

### Don't Log and Rethrow Without Context

```typescript
// ❌ Poor - Logs same error multiple times
async function processPayment(payment) {
  try {
    return await chargeCard(payment);
  } catch (error) {
    plip.error("Payment failed", error); // Logged here
    throw error; // Will be logged again upstream
  }
}

// ✅ Better - Add context before rethrowing
async function processPayment(payment) {
  try {
    return await chargeCard(payment);
  } catch (error) {
    plip.error("Payment processing failed", {
      paymentId: payment.id,
      amount: payment.amount,
      originalError: error.message
    });
    throw new Error(`Payment ${payment.id} failed: ${error.message}`);
  }
}
```

## Performance Considerations

### Avoid Expensive Operations in Log Messages

```typescript
// ❌ Poor - Expensive operation always executed
plip.debug("User data:", JSON.stringify(user, null, 2));

// ✅ Better - Let Plip handle formatting
plip.debug("User data:", user);

// ✅ Good - Conditional expensive operations
if (plip.level <= LogLevel.DEBUG) {
  const expensiveData = generateComplexReport();
  plip.debug("Complex report:", expensiveData);
}
```

### Use Lazy Evaluation for Complex Data

```typescript
// ✅ Good - Only compute when needed
plip.debug("System state:", () => ({
  memory: process.memoryUsage(),
  cpu: process.cpuUsage(),
  connections: getActiveConnections().length,
  uptime: process.uptime()
}));
```

## Environment-Specific Logging

### Development vs Production

```typescript
const logger = plip.configure({
  level: process.env.NODE_ENV === 'production' 
    ? LogLevel.INFO 
    : LogLevel.DEBUG,
  
  colors: process.env.NODE_ENV !== 'production',
  
  format: process.env.NODE_ENV === 'production'
    ? 'json'  // Structured for log aggregation
    : 'pretty' // Human-readable for development
});
```

### Use Environment Variables

```typescript
// ✅ Good - Configurable via environment
const LOG_LEVEL = process.env.LOG_LEVEL || 'info';
const ENABLE_DEBUG = process.env.DEBUG === 'true';

plip.configure({
  level: LOG_LEVEL,
  debug: ENABLE_DEBUG
});
```

## Structured Logging

### Use Consistent Object Structures

```typescript
// ✅ Good - Consistent log entry structure
const logEntry = {
  event: 'user_action',
  action: 'login',
  userId: user.id,
  timestamp: new Date().toISOString(),
  metadata: {
    userAgent: req.headers['user-agent'],
    ip: req.ip,
    sessionId: req.sessionId
  }
};

plip.info("User logged in", logEntry);
```

### Searchable Fields

```typescript
// ✅ Good - Easy to search and filter
plip.info("API request processed", {
  method: req.method,
  endpoint: req.path,
  statusCode: res.statusCode,
  duration: responseTime,
  userId: req.user?.id,
  requestId: req.id
});
```

## Security Considerations

### Never Log Sensitive Information

```typescript
// ❌ NEVER DO THIS - Exposes sensitive data
plip.info("User created", {
  email: user.email,
  password: user.password, // ⚠️ SECURITY RISK
  creditCard: user.paymentInfo.cardNumber // ⚠️ SECURITY RISK
});

// ✅ Good - Redacted sensitive information
plip.info("User created", {
  email: user.email,
  hasPassword: !!user.password,
  paymentMethodType: user.paymentInfo.type
});
```

### Sanitize User Input

```typescript
// ✅ Good - Sanitize before logging
plip.info("Search performed", {
  query: sanitizeForLogging(req.query.q),
  userId: req.user.id,
  resultCount: results.length
});

function sanitizeForLogging(input: string): string {
  return input
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .substring(0, 100); // Limit length
}
```

## Testing and Debugging

### Use Different Loggers for Different Modules

```typescript
// ✅ Good - Module-specific loggers
const authLogger = plip.withPrefix('[AUTH]');
const dbLogger = plip.withPrefix('[DB]');
const apiLogger = plip.withPrefix('[API]');

authLogger.info("User authenticated");
dbLogger.debug("Query executed", { query, duration });
apiLogger.warn("Rate limit approaching", { usage: '80%' });
```

### Conditional Debug Logging

```typescript
// ✅ Good - Environment-aware debug logging
const DEBUG_ENABLED = process.env.DEBUG_PAYMENTS === 'true';

if (DEBUG_ENABLED) {
  plip.debug("Payment processing steps", {
    step: 'validation',
    data: paymentData
  });
}
```

## Common Anti-Patterns to Avoid

### Don't Use Console.log

```typescript
// ❌ Avoid - No level control or formatting
console.log("Something happened");

// ✅ Use Plip instead
plip.info("Something happened");
```

### Don't Log Everything

```typescript
// ❌ Poor - Too verbose, noisy logs
plip.info("Entering function processUser");
plip.info("Validating user data");
plip.info("User data is valid");
plip.info("Saving user to database");
plip.info("User saved successfully");
plip.info("Exiting function processUser");

// ✅ Better - Focus on important events
plip.info("Processing user", { userId: user.id });
// ... processing logic ...
plip.success("User processed successfully", { 
  userId: user.id, 
  duration: Date.now() - startTime 
});
```

### Don't Use String Concatenation

```typescript
// ❌ Poor - Hard to read and maintain
plip.info("User " + user.name + " performed action " + action + " at " + new Date());

// ✅ Better - Use template literals
plip.info(`User ${user.name} performed action ${action}`, { timestamp: new Date() });

// ✅ Best - Structured data
plip.info("User action performed", {
  userName: user.name,
  action: action,
  timestamp: new Date()
});
```

## Next Steps

- [Configuration](/guide/configuration) - Advanced configuration options
- [Customization](/guide/customization-guide) - Customize Plip's appearance and behavior
- [Integration Examples](/integration/express) - See Plip in real applications