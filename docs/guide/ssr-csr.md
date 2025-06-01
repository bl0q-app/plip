# SSR vs CSR Logging

Plip Logger provides optimized configurations for both **Server-Side Rendering (SSR)** and **Client-Side Rendering (CSR)** environments. By default, the library uses **CSR configuration** to provide the best experience for modern web development.

## Quick Start

```typescript
import { createSSRLogger, createCSRLogger, ssrLogger, csrLogger } from '@ru-dr/plip';

// Use pre-configured instances
ssrLogger.info("Server-side message"); // Optimized for server logs
csrLogger.info("Client-side message"); // Optimized for browser console

// Or create custom instances
const serverLogger = createSSRLogger();
const clientLogger = createCSRLogger();
```

## Default Behavior

The main `plip` instance automatically detects the environment and uses the appropriate configuration:

```typescript
import { plip } from '@ru-dr/plip';

// Automatically uses:
// - SSR config in pure Node.js environments
// - CSR config in browser or mixed environments (default)
plip.info("This message adapts to your environment");
```

## SSR (Server-Side Rendering) Configuration

**Optimized for server environments with rich visual features and production readiness.**

### Features:
- ✅ **Rich emojis** - Visual context in server logs for better readability
- 🌈 **Full colors** - Enhanced readability in terminal and log viewers
- 🎨 **Syntax highlighting** - Rich object formatting for debugging
- 📊 **Structured output** - Consistent formatting for parsing and aggregation
- 🔒 **Production-safe** - No logs in production by default (user must explicitly enable)
- 🎯 **All log levels in development** - Comprehensive logging for debugging

### Usage:

```typescript
import { createSSRLogger, ssrLogger } from '@ru-dr/plip';

// Use pre-configured instance
ssrLogger.info("Server started", { port: 3000, env: "production" });
ssrLogger.error("Database connection failed", { host: "localhost", error: "ECONNREFUSED" });

// Create custom SSR logger with overrides
const customServerLogger = createSSRLogger({
  enabledLevels: ["warn", "error"], // Only warnings and errors
  silent: process.env.NODE_ENV === 'test' // Silent during tests
});

// Express.js middleware example
app.use((req, res, next) => {
  ssrLogger.info("Request", {
    method: req.method,
    url: req.url,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString()
  });
  next();
});
```

### Example Output:
```
🫧 [INFO] Server started {"port":3000,"env":"production"}
💥 [ERROR] Database connection failed {"host":"localhost","error":"ECONNREFUSED"}
⚠️ [WARN] High memory usage {"usage":0.85,"threshold":0.8}
```

## CSR (Client-Side Rendering) Configuration

**Optimized for browser environments with visual appeal and debugging.**

### Features:
- ✅ **Rich emojis** - Visual appeal in browser console
- 🌈 **Full colors** - Enhanced readability in browser dev tools
- 🎨 **Syntax highlighting** - Rich formatting for debugging objects
- 🔍 **Detailed logging** - Comprehensive information for development
- 🎯 **Development-friendly** - Full verbosity in development mode

### Usage:

```typescript
import { createCSRLogger, csrLogger } from '@ru-dr/plip';

// Use pre-configured instance
csrLogger.success("User authenticated", { userId: 123, timestamp: new Date() });
csrLogger.debug("Component state", { user: userData, isLoading: false });

// Create custom CSR logger with overrides
const customClientLogger = createCSRLogger({
  enabledLevels: ["info", "warn", "error"], // Reduced verbosity
  enableEmojis: false // Disable emojis if preferred
});

// React component example
const LoginForm = () => {
  const handleSubmit = async (userData) => {
    csrLogger.info("Login attempt", { email: userData.email });
    
    try {
      const response = await login(userData);
      csrLogger.success("Login successful", { userId: response.userId });
    } catch (error) {
      csrLogger.error("Login failed", { error: error.message });
    }
  };
};
```

### Example Output:
```
🎉 [SUCCESS] User authenticated {"userId":123,"timestamp":"2025-06-01T10:30:00.000Z"}
🔍 [DEBUG] Component state {"user":{"name":"John"},"isLoading":false}
💥 [ERROR] Login failed {"error":"Invalid credentials"}
```

## Environment-Based Log Levels

Both SSR and CSR configurations automatically adjust log levels based on your environment:

### SSR Log Levels:
- **Production**: `[]` (empty) - No logs by default, user must explicitly enable
- **Development**: `["info", "warn", "error", "success", "debug", "trace", "verbose"]` - All levels for comprehensive debugging

### CSR Log Levels:
- **Production**: `[]` (empty) - No logs by default, user must explicitly enable
- **Development**: `["verbose", "debug", "info", "success", "warn", "error", "trace"]` - Full debugging with different ordering

## Configuration Overrides

Both SSR and CSR loggers accept configuration overrides:

```typescript
// Custom SSR logger with specific settings
const apiLogger = createSSRLogger({
  enabledLevels: ["info", "warn", "error"],
  devOnly: false // Always log, even in production
});

// Custom CSR logger with specific settings  
const debugLogger = createCSRLogger({
  enableColors: false, // Disable colors
  enabledLevels: ["debug", "trace", "verbose"] // Only debug messages
});
```

## Framework Integration Examples

### Next.js

```typescript
// lib/logger.ts
import { createSSRLogger, createCSRLogger } from '@ru-dr/plip';

// Server-side logger for API routes and SSR
export const serverLogger = createSSRLogger();

// Client-side logger for browser components
export const clientLogger = createCSRLogger();
```

```typescript
// pages/api/users.ts (SSR)
import { serverLogger } from '../../lib/logger';

export default function handler(req, res) {
  serverLogger.info("API request", { method: req.method, url: req.url });
  // ... handle request
}
```

```typescript
// components/UserProfile.tsx (CSR)
'use client';
import { clientLogger } from '../lib/logger';

export function UserProfile() {
  useEffect(() => {
    clientLogger.debug("UserProfile mounted", { userId });
  }, []);
  // ... component logic
}
```

### Express.js with SSR

```typescript
import express from 'express';
import { ssrLogger } from '@ru-dr/plip';

const app = express();

// Request logging middleware
app.use((req, res, next) => {
  ssrLogger.info("Request", {
    method: req.method,
    url: req.url,
    ip: req.ip
  });
  next();
});

// Error handling
app.use((err, req, res, next) => {
  ssrLogger.error("Unhandled error", {
    error: err.message,
    stack: err.stack,
    url: req.url
  });
  res.status(500).json({ error: 'Internal server error' });
});
```

## Migration Guide

If you're currently using the default `plip` logger, you can gradually migrate:

```typescript
// Before (still works, but automatically chooses config)
import { plip } from '@ru-dr/plip';
plip.info("Message");

// After (explicit SSR/CSR choice)
import { ssrLogger, csrLogger } from '@ru-dr/plip';

// In server-side code
ssrLogger.info("Server message");

// In client-side code  
csrLogger.info("Client message");
```

## Best Practices

### ✅ Do:
- Use SSR loggers for server-side code (APIs, middleware, background jobs)
- Use CSR loggers for client-side code (React components, browser interactions)
- Override configurations to match your specific needs
- Use structured logging with meaningful data objects
- Respect different log levels for different environments

### ❌ Don't:
- Mix SSR and CSR loggers in the same context without purpose
- Log sensitive information (passwords, tokens) in any configuration
- Use verbose logging levels in production environments
- Ignore the performance impact of extensive logging

## Advanced Usage

### Custom Environment Detection

```typescript
import { createSSRLogger, createCSRLogger, getAutoConfig } from '@ru-dr/plip';

// Custom logic for choosing configuration
const logger = isMicroservice() 
  ? createSSRLogger({ enabledLevels: ["warn", "error"] })
  : isElectronApp()
  ? createCSRLogger({ enableColors: false })
  : createPlip(getAutoConfig());
```

### Dynamic Configuration Switching

```typescript
class AdaptiveLogger {
  private ssrLogger = createSSRLogger();
  private csrLogger = createCSRLogger();
  
  get current() {
    return typeof window !== 'undefined' 
      ? this.csrLogger 
      : this.ssrLogger;
  }
  
  info = (...args) => this.current.info(...args);
  error = (...args) => this.current.error(...args);
  // ... other methods
}

export const adaptiveLogger = new AdaptiveLogger();
```
