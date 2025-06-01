# Customization

Plip offers extensive customization options to tailor the logging experience to your exact needs and preferences.

## Visual Customization

### Emoji Configuration

Control emoji usage across your application:

```typescript
import { createPlip } from '@ru-dr/plip';

// Disable emojis for cleaner output
const cleanLogger = createPlip({
  enableEmojis: false
});

// Enable emojis for visual appeal
const visualLogger = createPlip({
  enableEmojis: true
});
```

### Color Configuration

Customize color output for different environments:

```typescript
// Force colors on (even in non-TTY environments)
const colorLogger = createPlip({
  enableColors: true
});

// Disable colors for file logging
const plainLogger = createPlip({
  enableColors: false
});

// Auto-detect (default behavior)
const autoLogger = createPlip({
  enableColors: undefined // Auto-detection
});
```

## Functional Customization

### Level Filtering

Create specialized loggers for different use cases:

```typescript
// API request logger - only info and errors
const apiLogger = createPlip({
  enabledLevels: ['info', 'error']
});

// Debug logger - verbose debugging only
const debugLogger = createPlip({
  enabledLevels: ['verbose', 'debug']
});

// Production logger - warnings and above
const prodLogger = createPlip({
  enabledLevels: ['warn', 'error', 'fatal']
});
```

### Conditional Logging

Create loggers that adapt to runtime conditions:

```typescript
const createConditionalLogger = (isDevelopment: boolean) => {
  return createPlip({
    enableEmojis: isDevelopment,
    enableColors: isDevelopment,
    enabledLevels: isDevelopment 
      ? ['verbose', 'debug', 'info', 'success', 'warn', 'error', 'fatal']
      : ['warn', 'error', 'fatal']
  });
};

const logger = createConditionalLogger(process.env.NODE_ENV === 'development');
```

## Domain-Specific Loggers

Create specialized loggers for different parts of your application:

### Database Logger

```typescript
const dbLogger = createPlip({
  enableEmojis: true,
  enableColors: true,
  enabledLevels: ['debug', 'info', 'warn', 'error']
});

// Usage
dbLogger.debug("🗃️ Executing query:", query);
dbLogger.info("🗃️ Connection pool status:", poolInfo);
dbLogger.error("🗃️ Query failed:", error);
```

### Authentication Logger

```typescript
const authLogger = createPlip({
  enableEmojis: true,
  enableColors: true,
  enabledLevels: ['info', 'warn', 'error', 'fatal']
});

// Usage
authLogger.info("🔐 User login attempt:", { userId, ip });
authLogger.warn("🔐 Failed login attempt:", { userId, reason });
authLogger.error("🔐 Authentication service unavailable");
```

### API Logger

```typescript
const apiLogger = createPlip({
  enableEmojis: true,
  enableColors: true,
  enabledLevels: ['info', 'warn', 'error']
});

// Usage
apiLogger.info("🌐 API request:", { method, url, userAgent });
apiLogger.warn("🌐 Rate limit warning:", { userId, remaining });
apiLogger.error("🌐 API error:", { endpoint, status, error });
```

## Environment-Based Customization

### Development Environment

```typescript
const devLogger = createPlip({
  enableEmojis: true,
  enableColors: true,
  enabledLevels: ['verbose', 'debug', 'info', 'success', 'warn', 'error', 'fatal']
});

// Rich, detailed logging for development
devLogger.verbose("🔍 Variable state:", { currentUser, sessionData });
devLogger.debug("🐛 Function called:", { functionName: 'processOrder', args });
devLogger.success("🎉 Development server ready!");
```

### Production Environment

```typescript
const prodLogger = createPlip({
  enableEmojis: false,  // Cleaner for log aggregation
  enableColors: false,  // Better for file logging
  enabledLevels: ['info', 'warn', 'error', 'fatal']
});

// Focused, essential logging for production
prodLogger.info("Server started", { port: 3000, env: 'production' });
prodLogger.warn("High memory usage", { usage: 0.85, threshold: 0.8 });
prodLogger.error("Service unavailable", { service: 'payment', error });
```

### Testing Environment

```typescript
const testLogger = createPlip({
  enableEmojis: false,
  enableColors: false,
  enabledLevels: ['error', 'fatal']  // Only critical issues during tests
});
```

## Custom Logger Factory

Create a factory function for consistent logger creation:

```typescript
interface LoggerOptions {
  name: string;
  environment?: 'development' | 'production' | 'test';
  includeDebug?: boolean;
}

const createCustomLogger = (options: LoggerOptions) => {
  const { name, environment = 'development', includeDebug = false } = options;
  
  const isProd = environment === 'production';
  const isTest = environment === 'test';
  
  const config = {
    enableEmojis: !isProd && !isTest,
    enableColors: !isTest,
    enabledLevels: [
      ...(includeDebug ? ['verbose', 'debug'] : []),
      'info',
      'success',
      'warn',
      'error',
      'fatal'
    ] as const
  };
  
  return createPlip(config);
};

// Usage
const userServiceLogger = createCustomLogger({
  name: 'UserService',
  environment: 'production'
});

const debugLogger = createCustomLogger({
  name: 'Debug',
  environment: 'development',
  includeDebug: true
});
```

## Runtime Customization

### Dynamic Configuration

```typescript
class AdaptiveLogger {
  private logger = createPlip({
    enableEmojis: true,
    enableColors: true,
    enabledLevels: ['info', 'warn', 'error']
  });
  
  setDebugMode(enabled: boolean) {
    const levels = enabled 
      ? ['verbose', 'debug', 'info', 'success', 'warn', 'error', 'fatal']
      : ['info', 'warn', 'error'];
    
    this.logger = createPlip({
      enableEmojis: this.logger.config.enableEmojis,
      enableColors: this.logger.config.enableColors,
      enabledLevels: levels
    });
  }
  
  setProductionMode(enabled: boolean) {
    this.logger = createPlip({
      enableEmojis: !enabled,
      enableColors: !enabled,
      enabledLevels: enabled 
        ? ['warn', 'error', 'fatal']
        : ['info', 'success', 'warn', 'error', 'fatal']
    });
  }
  
  get log() {
    return this.logger;
  }
}

// Usage
const adaptiveLogger = new AdaptiveLogger();
adaptiveLogger.setDebugMode(true);
adaptiveLogger.log.debug("Debug mode enabled");
```

### Feature Toggles

```typescript
const createFeatureAwareLogger = () => {
  const features = {
    emojis: process.env.FEATURE_EMOJIS !== 'false',
    colors: process.env.FEATURE_COLORS !== 'false',
    verbose: process.env.FEATURE_VERBOSE === 'true'
  };
  
  return createPlip({
    enableEmojis: features.emojis,
    enableColors: features.colors,
    enabledLevels: features.verbose 
      ? ['verbose', 'debug', 'info', 'success', 'warn', 'error', 'fatal']
      : ['info', 'warn', 'error']
  });
};
```

## Advanced Patterns

### Middleware-Style Logging

```typescript
const createMiddlewareLogger = (context: string) => {
  const logger = createPlip({
    enableEmojis: true,
    enableColors: true,
    enabledLevels: ['info', 'warn', 'error']
  });
  
  return {
    info: (message: string, data?: any) => 
      logger.info(`[${context}] ${message}`, data),
    warn: (message: string, data?: any) => 
      logger.warn(`[${context}] ${message}`, data),
    error: (message: string, data?: any) => 
      logger.error(`[${context}] ${message}`, data)
  };
};

// Usage
const authMiddleware = createMiddlewareLogger('AUTH');
const dbMiddleware = createMiddlewareLogger('DATABASE');

authMiddleware.info("User authenticated", { userId: 123 });
dbMiddleware.error("Connection failed", { host: 'localhost' });
```

### Structured Logging

```typescript
const createStructuredLogger = (service: string, version: string) => {
  const logger = createPlip({
    enableEmojis: false,
    enableColors: true,
    enabledLevels: ['info', 'warn', 'error', 'fatal']
  });
  
  const addMetadata = (data: any = {}) => ({
    ...data,
    service,
    version,
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
  
  return {
    info: (message: string, data?: any) => 
      logger.info(message, addMetadata(data)),
    warn: (message: string, data?: any) => 
      logger.warn(message, addMetadata(data)),
    error: (message: string, data?: any) => 
      logger.error(message, addMetadata(data)),
    fatal: (message: string, data?: any) => 
      logger.fatal(message, addMetadata(data))
  };
};

// Usage
const serviceLogger = createStructuredLogger('user-service', '1.2.3');
serviceLogger.info("Service started", { port: 3000 });
```

## Best Practices

### 1. Consistent Configuration
Establish standard configurations for your team:

```typescript
// config/logging.ts
export const LOGGER_CONFIGS = {
  development: {
    enableEmojis: true,
    enableColors: true,
    enabledLevels: ['verbose', 'debug', 'info', 'success', 'warn', 'error', 'fatal']
  },
  production: {
    enableEmojis: false,
    enableColors: false,
    enabledLevels: ['info', 'warn', 'error', 'fatal']
  }
} as const;
```

### 2. Environment Detection
Use environment variables for configuration:

```typescript
const getLoggerConfig = () => {
  const env = process.env.NODE_ENV || 'development';
  return LOGGER_CONFIGS[env] || LOGGER_CONFIGS.development;
};
```

### 3. Modular Loggers
Create domain-specific loggers for better organization:

```typescript
// loggers/index.ts
export const dbLogger = createPlip({ /* db-specific config */ });
export const apiLogger = createPlip({ /* api-specific config */ });
export const authLogger = createPlip({ /* auth-specific config */ });
```

## Next Steps

- Explore practical [Examples](/examples/)
- Check the complete [API Reference](/api/logger)
- Learn about [Production Setup](/examples/production)
