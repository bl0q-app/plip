# Quick Start Examples: SSR vs CSR Logging

## Basic Usage

```typescript
import { plip, createSSRLogger, createCSRLogger } from '@ru-dr/plip';

// Default logger (CSR by default)
plip.info("Hello world!"); // 🫧 [INFO] Hello world!

// Explicit SSR logger for server environments (rich features enabled)
const serverLogger = createSSRLogger();
serverLogger.info("Server started", { port: 3000 }); // 🫧 [INFO] Server started {"port":3000}

// Explicit CSR logger for client environments  
const clientLogger = createCSRLogger();
clientLogger.success("User logged in", { userId: 123 }); // 🎉 [SUCCESS] User logged in {"userId":123}
```

## Framework Examples

### Next.js

```typescript
// lib/loggers.ts
import { createSSRLogger, createCSRLogger } from '@ru-dr/plip';

// Server-side logger for API routes and SSR
export const serverLogger = createSSRLogger();

// Client-side logger for browser components
export const clientLogger = createCSRLogger();
```

```typescript
// pages/api/users.ts (Server-side)
import { serverLogger } from '../../lib/loggers';

export default function handler(req, res) {
  serverLogger.info("API request", { method: req.method, url: req.url });
  // Rich, colorful output with emojis for enhanced readability
}
```

```typescript
// components/UserForm.tsx (Client-side)
'use client';
import { clientLogger } from '../lib/loggers';

export function UserForm() {
  const handleSubmit = async (data) => {
    clientLogger.info("Form submission started"); // 🫧 [INFO] with colors
    try {
      await submitForm(data);
      clientLogger.success("Form submitted successfully"); // 🎉 [SUCCESS]
    } catch (error) {
      clientLogger.error("Form submission failed", { error }); // 💥 [ERROR]
    }
  };
}
```

### Express.js

```typescript
import express from 'express';
import { createSSRLogger } from '@ru-dr/plip';

const app = express();
const logger = createSSRLogger(); // Perfect for server logging

// Request logging middleware
app.use((req, res, next) => {
  logger.info("Request", {
    method: req.method,
    url: req.url,
    ip: req.ip,
    timestamp: new Date().toISOString()
  });
  next();
});

// Error handling
app.use((err, req, res, next) => {
  logger.error("Server error", {
    error: err.message,
    stack: err.stack,
    url: req.url
  });
  res.status(500).json({ error: 'Internal server error' });
});
```

### React Application

```typescript
// utils/logger.ts
import { createCSRLogger } from '@ru-dr/plip';

export const logger = createCSRLogger(); // Great for browser debugging

// App.tsx
import { logger } from './utils/logger';

function App() {
  useEffect(() => {
    logger.info("App initialized"); // 🫧 [INFO] App initialized
  }, []);

  const handleError = (error) => {
    logger.error("Application error", { 
      error: error.message,
      component: 'App',
      timestamp: new Date()
    }); // 💥 [ERROR] with rich formatting
  };

  return <div>...</div>;
}
```

## Environment-Specific Configurations

### Development vs Production

```typescript
import { createSSRLogger, createCSRLogger } from '@ru-dr/plip';

// Server logger with environment-aware settings
const serverLogger = createSSRLogger({
  enabledLevels: process.env.NODE_ENV === 'production' 
    ? ['warn', 'error'] 
    : ['debug', 'info', 'warn', 'error']
});

// Client logger with environment-aware settings
const clientLogger = createCSRLogger({
  enabledLevels: process.env.NODE_ENV === 'production'
    ? ['info', 'warn', 'error']
    : ['verbose', 'debug', 'info', 'success', 'warn', 'error', 'trace']
});
```

### Custom Overrides

```typescript
import { createSSRLogger, createCSRLogger } from '@ru-dr/plip';

// Minimal SSR logger for high-traffic APIs
const apiLogger = createSSRLogger({
  enabledLevels: ['error'], // Only errors
  silent: process.env.NODE_ENV === 'test' // Silent during tests
});

// Custom CSR logger for specific features
const debugLogger = createCSRLogger({
  enableEmojis: false, // Cleaner console output
  enabledLevels: ['debug', 'trace'] // Only debug messages
});
```

## Migration from Default Logger

```typescript
// Before: Using default logger everywhere
import { plip } from '@ru-dr/plip';

plip.info("This works everywhere but isn't optimized");

// After: Using specific loggers for specific contexts
import { createSSRLogger, createCSRLogger } from '@ru-dr/plip';

// In server-side code (APIs, middleware, background jobs)
const serverLogger = createSSRLogger();
serverLogger.info("Server message"); // Optimized for servers

// In client-side code (React components, browser scripts)
const clientLogger = createCSRLogger();  
clientLogger.info("Client message"); // Optimized for browsers

// Default plip still works and uses CSR by default
plip.info("Still works, uses CSR configuration");
```

## Best Practices Summary

1. **Use SSR loggers for:**
   - API routes and server endpoints
   - Express.js/Fastify middleware
   - Database operations
   - Background jobs and workers
   - Production environments

2. **Use CSR loggers for:**
   - React/Vue/Angular components
   - Browser-side JavaScript
   - Development and debugging
   - User interaction logging

3. **Default `plip` instance:**
   - Uses CSR configuration by default
   - Good for general purpose and getting started
   - Can be used anywhere but isn't environment-optimized
