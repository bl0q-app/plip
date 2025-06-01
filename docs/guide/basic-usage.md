# Basic Usage

Learn the fundamentals of using Plip Logger in your applications.

## Simple Logging

Start with basic log messages:

```typescript
import { plip } from '@ru-dr/plip';

plip.info("Application started");
plip.success("Database connected successfully");
plip.warn("API rate limit approaching");
plip.error("Failed to send email");
```

## Log Levels

Plip provides 7 log levels, each with distinct colors and emojis:

```typescript
// Detailed debugging information
plip.verbose("Processing request details...");

// Debug information for development
plip.debug("Variable value:", someVariable);

// General information messages
plip.info("User logged in");

// Success and completion messages
plip.success("File uploaded successfully");

// Warning messages for potential issues
plip.warn("Memory usage is high");

// Error messages for failures
plip.error("Payment processing failed");

// Critical errors that may crash the app
plip.fatal("Database connection lost");
```

## Logging Objects and Data

Plip excels at displaying complex data structures with beautiful formatting:

```typescript
const user = {
  id: 123,
  name: "Alice Johnson",
  email: "alice@example.com",
  roles: ["user", "admin"],
  settings: {
    theme: "dark",
    notifications: true,
    language: "en"
  }
};

plip.info("User profile:", user);

// Arrays are also beautifully formatted
const tasks = [
  { id: 1, title: "Complete documentation", done: true },
  { id: 2, title: "Write tests", done: false },
  { id: 3, title: "Deploy to production", done: false }
];

plip.debug("Current tasks:", tasks);
```

## String Interpolation

Use template literals and multiple arguments:

```typescript
const username = "alice";
const count = 42;

// Template literals
plip.info(`Welcome back, ${username}! You have ${count} notifications.`);

// Multiple arguments
plip.info("User:", username, "Notifications:", count);

// Mixed data types
plip.debug("Processing", count, "items for user", { name: username });
```

## Error Logging

Properly log errors with stack traces:

```typescript
try {
  // Some operation that might fail
  throw new Error("Something went wrong");
} catch (error) {
  // Log the error with full details
  plip.error("Operation failed:", error);
  
  // Or just the error object
  plip.error(error);
}
```

## Conditional Logging

Use conditional logging for different environments:

```typescript
const isDevelopment = process.env.NODE_ENV === 'development';

if (isDevelopment) {
  plip.debug("Debug info only shown in development");
}

// Or use the verbose level which is typically disabled in production
plip.verbose("Detailed trace information");
```

## Async Operations

Log async operations with proper context:

```typescript
async function fetchUserData(userId: string) {
  plip.info("Fetching user data for:", userId);
  
  try {
    const response = await fetch(`/api/users/${userId}`);
    const userData = await response.json();
    
    plip.success("User data fetched successfully");
    plip.debug("User data:", userData);
    
    return userData;
  } catch (error) {
    plip.error("Failed to fetch user data:", error);
    throw error;
  }
}
```

## Best Practices

### Use Appropriate Log Levels

```typescript
// ✅ Good - Appropriate level usage
plip.info("Server starting on port 3000");
plip.warn("Deprecated API endpoint used");
plip.error("Database query failed");

// ❌ Avoid - Wrong level usage
plip.error("Server starting on port 3000"); // Not an error
plip.info("Critical security breach"); // Too low level
```

### Include Context

```typescript
// ✅ Good - Includes relevant context
plip.error("Failed to process payment", {
  userId: user.id,
  amount: payment.amount,
  errorCode: error.code
});

// ❌ Poor - Lacks context
plip.error("Payment failed");
```

### Use Descriptive Messages

```typescript
// ✅ Good - Clear and descriptive
plip.info("Email notification sent to user", {
  recipient: user.email,
  template: "welcome",
  deliveryTime: new Date()
});

// ❌ Poor - Vague message
plip.info("Email sent");
```

## Next Steps

- [Configuration](/guide/configuration) - Customize Plip's behavior
- [Log Levels](/guide/log-levels) - Deep dive into log levels
- [Best Practices](/guide/best-practices) - Advanced logging patterns