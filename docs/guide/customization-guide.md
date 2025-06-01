# Complete Customization Guide

This comprehensive guide covers every aspect of customizing Plip Logger for your specific needs, from basic configuration to advanced enterprise patterns.

## Table of Contents

1. [Quick Start](#quick-start)
2. [Visual Customization](#visual-customization)
3. [Level Management](#level-management)
4. [Advanced Patterns](#advanced-patterns)
5. [Enterprise Setups](#enterprise-setups)
6. [Performance Optimization](#performance-optimization)
7. [Real-World Examples](#real-world-examples)
8. [Runtime Customization](#runtime-customization)
9. [Troubleshooting](#troubleshooting)
10. [Best Practices](#best-practices)
11. [Next Steps](#next-steps)

## Quick Start

### Basic Custom Logger

```typescript
import { createPlip } from '@ru-dr/plip';

// Simple customization
const logger = createPlip({
  enableEmojis: true,
  enableColors: true,
  enabledLevels: ['info', 'warn', 'error']
});

logger.info("Hello from custom logger!");
```

### Environment-Aware Logger

```typescript
const createEnvLogger = () => createPlip({
  enableEmojis: process.env.NODE_ENV === 'development',
  enableColors: process.stdout.isTTY,
  enabledLevels: process.env.NODE_ENV === 'production' 
    ? ['info', 'warn', 'error'] 
    : ['verbose', 'debug', 'info', 'success', 'warn', 'error', 'trace']
});

const logger = createEnvLogger();
```

## Visual Customization

### Emoji Control

```typescript
// Disable emojis for clean output
const cleanLogger = createPlip({
  enableEmojis: false
});

// Enable emojis for visual appeal
const visualLogger = createPlip({
  enableEmojis: true
});

// Conditional emojis based on environment
const smartLogger = createPlip({
  enableEmojis: process.env.NODE_ENV === 'development' && process.stdout.isTTY
});
```

### Color Configuration

```typescript
// Force colors (useful for CI/CD with color support)
const alwaysColorLogger = createPlip({
  enableColors: true
});

// No colors (useful for file logging)
const plainLogger = createPlip({
  enableColors: false
});

// Smart color detection (default)
const autoLogger = createPlip({
  enableColors: undefined // Auto-detect TTY
});

// Environment-based colors
const envColorLogger = createPlip({
  enableColors: process.env.FORCE_COLOR === '1' || 
    (process.stdout.isTTY && process.env.NODE_ENV !== 'test')
});
```

## Level Management

### Development vs Production

```typescript
const configs = {
  development: {
    enableEmojis: true,
    enableColors: true,
    enabledLevels: ['verbose', 'debug', 'info', 'success', 'warn', 'error', 'trace']
  },
  staging: {
    enableEmojis: false,
    enableColors: true,
    enabledLevels: ['info', 'success', 'warn', 'error', 'trace']
  },
  production: {
    enableEmojis: false,
    enableColors: false,
    enabledLevels: ['info', 'warn', 'error']
  },
  testing: {
    enableEmojis: false,
    enableColors: false,
    enabledLevels: [] // Silent during tests
  }
};

const logger = createPlip(configs[process.env.NODE_ENV] || configs.development);
```

### Specialized Loggers

```typescript
// Debug-only logger
const debugLogger = createPlip({
  enabledLevels: ['debug', 'verbose']
});

// Error tracking logger
const errorLogger = createPlip({
  enabledLevels: ['error', 'warn']
});

// Audit logger (important events only)
const auditLogger = createPlip({
  enableEmojis: false,
  enableColors: false,
  enabledLevels: ['info', 'warn', 'error']
});

// Development logger (everything)
const devLogger = createPlip({
  enableEmojis: true,
  enableColors: true,
  enabledLevels: ['verbose', 'debug', 'info', 'success', 'warn', 'error', 'trace']
});
```

## Advanced Patterns

### Service-Scoped Loggers

```typescript
// Base logger factory
const createServiceLogger = (serviceName: string, config?: Partial<PlipConfig>) => {
  const defaultConfig = {
    enableEmojis: process.env.NODE_ENV === 'development',
    enableColors: process.stdout.isTTY,
    enabledLevels: ['info', 'warn', 'error', 'debug']
  };

  const logger = createPlip({ ...defaultConfig, ...config });

  // Add service prefix to all messages
  return {
    info: (message: string, ...args: any[]) => 
      logger.info(`[${serviceName}] ${message}`, ...args),
    warn: (message: string, ...args: any[]) => 
      logger.warn(`[${serviceName}] ${message}`, ...args),
    error: (message: string, ...args: any[]) => 
      logger.error(`[${serviceName}] ${message}`, ...args),
    success: (message: string, ...args: any[]) => 
      logger.success(`[${serviceName}] ${message}`, ...args),
    debug: (message: string, ...args: any[]) => 
      logger.debug(`[${serviceName}] ${message}`, ...args),
    verbose: (message: string, ...args: any[]) => 
      logger.verbose(`[${serviceName}] ${message}`, ...args),
    trace: (message: string, ...args: any[]) => 
      logger.trace(`[${serviceName}] ${message}`, ...args)
  };
};

// Usage
const userService = createServiceLogger('UserService');
const paymentService = createServiceLogger('PaymentService', { enableEmojis: false });
const dbService = createServiceLogger('DatabaseService', { enabledLevels: ['error', 'warn'] });

userService.info("User created successfully");
paymentService.warn("Payment processing delayed");
dbService.error("Database connection failed");
```

### Request-Scoped Logging

```typescript
// Request logger with correlation ID
export const createRequestLogger = (requestId: string, userId?: string) => {
  const logger = createPlip({
    enableEmojis: false,
    enableColors: true,
    enabledLevels: ['info', 'warn', 'error', 'debug']
  });

  const prefix = userId ? `[${requestId}][${userId}]` : `[${requestId}]`;

  return {
    info: (message: string, data?: any) => 
      logger.info(`${prefix} ${message}`, data),
    warn: (message: string, data?: any) => 
      logger.warn(`${prefix} ${message}`, data),
    error: (message: string, error?: Error | any) => 
      logger.error(`${prefix} ${message}`, error),
    debug: (message: string, data?: any) => 
      logger.debug(`${prefix} ${message}`, data)
  };
};

// Middleware example
app.use((req, res, next) => {
  req.logger = createRequestLogger(req.id, req.user?.id);
  next();
});
```

### Dynamic Configuration

```typescript
export class ConfigurableLogger {
  private config: PlipConfig;
  private logger: ReturnType<typeof createPlip>;

  constructor(initialConfig: PlipConfig) {
    this.config = initialConfig;
    this.logger = createPlip(this.config);
  }

  updateConfig(newConfig: Partial<PlipConfig>) {
    this.config = { ...this.config, ...newConfig };
    this.logger = createPlip(this.config);
  }

  setLogLevel(level: 'debug' | 'info' | 'warn' | 'error') {
    const levelMap = {
      debug: ['debug', 'info', 'success', 'warn', 'error', 'trace'],
      info: ['info', 'success', 'warn', 'error', 'trace'],
      warn: ['warn', 'error', 'trace'],
      error: ['error', 'trace']
    };
    
    this.updateConfig({ enabledLevels: levelMap[level] });
  }

  enableDebugMode() {
    this.updateConfig({
      enableEmojis: true,
      enableColors: true,
      enabledLevels: ['verbose', 'debug', 'info', 'success', 'warn', 'error', 'trace']
    });
  }

  enableProductionMode() {
    this.updateConfig({
      enableEmojis: false,
      enableColors: false,
      enabledLevels: ['info', 'warn', 'error']
    });
  }

  // Proxy all logger methods
  info = (...args: any[]) => this.logger.info(...args);
  warn = (...args: any[]) => this.logger.warn(...args);
  error = (...args: any[]) => this.logger.error(...args);
  success = (...args: any[]) => this.logger.success(...args);
  debug = (...args: any[]) => this.logger.debug(...args);
  verbose = (...args: any[]) => this.logger.verbose(...args);
  trace = (...args: any[]) => this.logger.trace(...args);
}

// Usage
const logger = new ConfigurableLogger({
  enableEmojis: true,
  enableColors: true,
  enabledLevels: ['info', 'warn', 'error']
});

// Runtime configuration changes
logger.setLogLevel('debug');
logger.enableProductionMode();
```

## Enterprise Setups

### Multi-Environment Configuration

```typescript
// config/logging.ts
interface LoggingEnvironment {
  development: PlipConfig;
  staging: PlipConfig;
  production: PlipConfig;
  testing: PlipConfig;
}

export const LOGGING_CONFIGS: LoggingEnvironment = {
  development: {
    enableEmojis: true,
    enableColors: true,
    enabledLevels: ['verbose', 'debug', 'info', 'success', 'warn', 'error', 'trace']
  },
  staging: {
    enableEmojis: false,
    enableColors: true,
    enabledLevels: ['debug', 'info', 'success', 'warn', 'error', 'trace']
  },
  production: {
    enableEmojis: false,
    enableColors: false,
    enabledLevels: ['info', 'warn', 'error']
  },
  testing: {
    enableEmojis: false,
    enableColors: false,
    enabledLevels: ['error'] // Only errors during tests
  }
};

export const createEnvironmentLogger = (env?: string) => {
  const environment = (env || process.env.NODE_ENV || 'development') as keyof LoggingEnvironment;
  return createPlip(LOGGING_CONFIGS[environment]);
};
```

### Microservice Logger Factory

```typescript
// services/logger-factory.ts
interface ServiceConfig {
  serviceName: string;
  version: string;
  environment: string;
  customConfig?: Partial<PlipConfig>;
}

export class ServiceLoggerFactory {
  private static instances = new Map<string, ReturnType<typeof createPlip>>();

  static createLogger({ serviceName, version, environment, customConfig }: ServiceConfig) {
    const key = `${serviceName}-${version}-${environment}`;
    
    if (!this.instances.has(key)) {
      const baseConfig = LOGGING_CONFIGS[environment] || LOGGING_CONFIGS.development;
      const config = { ...baseConfig, ...customConfig };
      const logger = createPlip(config);
      
      this.instances.set(key, logger);
    }

    const logger = this.instances.get(key)!;
    const servicePrefix = `[${serviceName}@${version}]`;

    return {
      info: (message: string, meta?: any) => 
        logger.info(`${servicePrefix} ${message}`, meta && { service: serviceName, version, ...meta }),
      warn: (message: string, meta?: any) => 
        logger.warn(`${servicePrefix} ${message}`, meta && { service: serviceName, version, ...meta }),
      error: (message: string, error?: Error, meta?: any) => 
        logger.error(`${servicePrefix} ${message}`, { error, service: serviceName, version, ...meta }),
      success: (message: string, meta?: any) => 
        logger.success(`${servicePrefix} ${message}`, meta && { service: serviceName, version, ...meta }),
      debug: (message: string, meta?: any) => 
        logger.debug(`${servicePrefix} ${message}`, meta && { service: serviceName, version, ...meta }),
      trace: (message: string, meta?: any) => 
        logger.trace(`${servicePrefix} ${message}`, meta && { service: serviceName, version, ...meta })
    };
  }

  static clearCache() {
    this.instances.clear();
  }
}

// Usage across microservices
const userServiceLogger = ServiceLoggerFactory.createLogger({
  serviceName: 'user-service',
  version: '1.2.0',
  environment: process.env.NODE_ENV || 'development'
});

const paymentServiceLogger = ServiceLoggerFactory.createLogger({
  serviceName: 'payment-service',
  version: '2.1.0',
  environment: process.env.NODE_ENV || 'development',
  customConfig: { enableEmojis: false } // Custom config for this service
});
```

### Environment Variable Integration

```typescript
// config/env-aware-logging.ts
export const createEnvAwareLogger = () => {
  // Environment variable configuration
  const enableEmojis = process.env.PLIP_EMOJIS !== 'false';
  const enableColors = process.env.PLIP_COLORS !== 'false';
  const logLevel = process.env.LOG_LEVEL || 'info';
  const forceColors = process.env.FORCE_COLOR === '1';
  
  // Log level hierarchy
  const levelHierarchy: Record<string, string[]> = {
    verbose: ['verbose', 'debug', 'info', 'success', 'warn', 'error', 'trace'],
    debug: ['debug', 'info', 'success', 'warn', 'error', 'trace'],
    info: ['info', 'success', 'warn', 'error', 'trace'],
    warn: ['warn', 'error', 'trace'],
    error: ['error', 'trace'],
    silent: []
  };

  return createPlip({
    enableEmojis: enableEmojis && process.env.NODE_ENV !== 'test',
    enableColors: forceColors || (enableColors && process.stdout.isTTY),
    enabledLevels: levelHierarchy[logLevel] || levelHierarchy.info
  });
};

// Docker/Container environment detection
export const createContainerAwareLogger = () => {
  const isContainer = process.env.DOCKER_CONTAINER === 'true' || 
                     process.env.KUBERNETES_SERVICE_HOST !== undefined;
  
  return createPlip({
    enableEmojis: !isContainer,
    enableColors: process.env.FORCE_COLOR === '1' || (!isContainer && process.stdout.isTTY),
    enabledLevels: isContainer 
      ? ['info', 'warn', 'error'] 
      : ['debug', 'info', 'success', 'warn', 'error', 'trace']
  });
};
```

## Performance Optimization

### Lazy Logger Initialization

```typescript
// utils/lazy-logger.ts
class LazyLogger {
  private _logger: ReturnType<typeof createPlip> | null = null;
  private config: PlipConfig;

  constructor(config: PlipConfig) {
    this.config = config;
  }

  private getLogger() {
    if (!this._logger) {
      this._logger = createPlip(this.config);
    }
    return this._logger;
  }

  info = (...args: any[]) => this.getLogger().info(...args);
  warn = (...args: any[]) => this.getLogger().warn(...args);
  error = (...args: any[]) => this.getLogger().error(...args);
  success = (...args: any[]) => this.getLogger().success(...args);
  debug = (...args: any[]) => this.getLogger().debug(...args);
  verbose = (...args: any[]) => this.getLogger().verbose(...args);
  trace = (...args: any[]) => this.getLogger().trace(...args);
}

export const createLazyLogger = (config: PlipConfig) => new LazyLogger(config);
```

### Conditional Logger Creation

```typescript
// Only create debug logger in development
const debugLogger = process.env.NODE_ENV === 'development' 
  ? createPlip({ 
      enableEmojis: true,
      enableColors: true,
      enabledLevels: ['debug', 'verbose'] 
    })
  : null;

// Usage with optional chaining
debugLogger?.debug("This only logs in development");

// Function-based conditional logging
const conditionalLog = (level: string, message: string, data?: any) => {
  if (process.env.NODE_ENV === 'development') {
    debugLogger?.[level]?.(message, data);
  }
};
```

### Logger Caching

```typescript
// utils/logger-cache.ts
class LoggerCache {
  private static cache = new Map<string, ReturnType<typeof createPlip>>();

  static getOrCreate(key: string, config: PlipConfig) {
    if (!this.cache.has(key)) {
      this.cache.set(key, createPlip(config));
    }
    return this.cache.get(key)!;
  }

  static clear() {
    this.cache.clear();
  }

  static size() {
    return this.cache.size;
  }
}

// Usage
const getLogger = (service: string) => {
  const config = getConfigForService(service);
  return LoggerCache.getOrCreate(service, config);
};
```

## Real-World Examples

### Express.js Integration

```typescript
// middleware/logging.ts
import { createRequestLogger } from '../utils/request-logger';

export const loggingMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const requestId = req.headers['x-request-id'] || generateId();
  const startTime = Date.now();
  
  req.logger = createRequestLogger(requestId, req.user?.id);
  
  req.logger.info(`${req.method} ${req.path}`, {
    userAgent: req.get('User-Agent'),
    ip: req.ip
  });

  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const level = res.statusCode >= 400 ? 'error' : 'info';
    
    req.logger[level](`${req.method} ${req.path} ${res.statusCode}`, {
      duration,
      statusCode: res.statusCode
    });
  });

  next();
};
```

### Database Query Logging

```typescript
// utils/db-logger.ts
const dbLogger = createPlip({
  enableEmojis: false,
  enableColors: true,
  enabledLevels: process.env.NODE_ENV === 'development' 
    ? ['debug', 'info', 'warn', 'error'] 
    : ['warn', 'error']
});

export const logQuery = (query: string, params?: any[], duration?: number) => {
  const message = `Query executed: ${query.substring(0, 100)}${query.length > 100 ? '...' : ''}`;
  
  if (duration !== undefined) {
    if (duration > 1000) {
      dbLogger.warn(message, { duration, params, slow: true });
    } else {
      dbLogger.debug(message, { duration, params });
    }
  } else {
    dbLogger.info(message, { params });
  }
};
```

### Error Tracking Integration

```typescript
// utils/error-logger.ts
const errorLogger = createPlip({
  enableEmojis: false,
  enableColors: false,
  enabledLevels: ['error', 'warn']
});

export const logError = (error: Error, context?: any) => {
  const errorData = {
    message: error.message,
    stack: error.stack,
    name: error.name,
    timestamp: new Date().toISOString(),
    ...context
  };

  errorLogger.error('Application error occurred', errorData);
  
  // Also send to external error tracking service
  if (process.env.NODE_ENV === 'production') {
    // Sentry, Rollbar, etc.
    externalErrorTracker.captureError(error, context);
  }
};
```

## Troubleshooting

### Common Issues and Solutions

#### Colors Not Displaying

```typescript
// Check TTY detection
console.log('TTY detected:', process.stdout.isTTY);
console.log('FORCE_COLOR:', process.env.FORCE_COLOR);

// Force enable colors for testing
const testLogger = createPlip({ enableColors: true });
testLogger.info("This should be colored");

// Environment-specific color fixes
const logger = createPlip({
  enableColors: process.env.FORCE_COLOR === '1' || 
    (process.stdout.isTTY && process.env.NODE_ENV !== 'test')
});
```

#### Log Levels Not Working

```typescript
// Debug level configuration
const testLogger = createPlip({
  enabledLevels: ['debug', 'info', 'warn', 'error']
});

console.log('Enabled levels:', testLogger.getEnabledLevels?.()); // If available
testLogger.debug("This should appear");
testLogger.verbose("This should NOT appear");
```

#### Performance Issues

```typescript
// Use lazy initialization for expensive loggers
const heavyLogger = (() => {
  let logger: ReturnType<typeof createPlip> | null = null;
  return () => {
    if (!logger) {
      logger = createPlip(expensiveConfig);
    }
    return logger;
  };
})();

// Only log in development
if (process.env.NODE_ENV === 'development') {
  heavyLogger().debug("Expensive debug operation");
}
```

### Environment-Specific Debugging

```typescript
// Debug configuration issues
export const debugConfig = () => {
  console.log('Environment:', process.env.NODE_ENV);
  console.log('TTY:', process.stdout.isTTY);
  console.log('Platform:', process.platform);
  console.log('Force Color:', process.env.FORCE_COLOR);
  console.log('CI Environment:', process.env.CI);
  
  const testConfig = {
    enableEmojis: true,
    enableColors: true,
    enabledLevels: ['info', 'warn', 'error']
  };
  
  console.log('Test config:', testConfig);
  
  const logger = createPlip(testConfig);
  logger.info("Test message");
  logger.warn("Test warning");
  logger.error("Test error");
};
```

## Best Practices

### 1. **Environment-Driven Configuration**
Always configure loggers based on your environment to optimize performance and output relevance.

### 2. **Centralized Configuration Management**
Use centralized configuration files and factories to maintain consistency across your application.

### 3. **Service-Specific Loggers**
Create domain or service-specific loggers for better organization and filtering capabilities.

### 4. **Performance-Conscious Design**
Use lazy initialization and conditional creation for better performance in production environments.

### 5. **Context Enrichment**
Always add contextual information like service names, request IDs, and user identifiers to make logs more useful.

### 6. **Level Hierarchy Respect**
Design your log level hierarchies thoughtfully to balance debugging capability with performance.

### 7. **Error Context Preservation**
Always include relevant context when logging errors to aid in debugging and monitoring.

## Runtime Customization

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
      ? ['verbose', 'debug', 'info', 'success', 'warn', 'error', 'trace']
      : ['info', 'warn', 'error']
  });
};
```

### Adaptive Logger Pattern

```typescript
class AdaptiveLogger {
  private logger = createPlip({
    enableEmojis: true,
    enableColors: true,
    enabledLevels: ['info', 'warn', 'error']
  });
  
  setDebugMode(enabled: boolean) {
    const levels = enabled 
      ? ['verbose', 'debug', 'info', 'success', 'warn', 'error', 'trace']
      : ['info', 'warn', 'error'];
    
    this.logger = createPlip({
      enableEmojis: this.logger.config?.enableEmojis ?? true,
      enableColors: this.logger.config?.enableColors ?? true,
      enabledLevels: levels
    });
  }
  
  setProductionMode(enabled: boolean) {
    this.logger = createPlip({
      enableEmojis: !enabled,
      enableColors: !enabled,
      enabledLevels: enabled 
        ? ['warn', 'error', 'trace']
        : ['info', 'success', 'warn', 'error', 'trace']
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

### Structured Logging Pattern

```typescript
const createStructuredLogger = (service: string, version: string) => {
  const logger = createPlip({
    enableEmojis: false,
    enableColors: true,
    enabledLevels: ['info', 'warn', 'error', 'trace']
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
    trace: (message: string, data?: any) => 
      logger.trace(message, addMetadata(data))
  };
};

// Usage
const serviceLogger = createStructuredLogger('user-service', '1.2.3');
serviceLogger.info("Service started", { port: 3000 });
```

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

## Next Steps

- Explore [Practical Examples](/examples/) for real-world implementations
- Check the [Complete API Reference](/api/logger) for all available options
- Learn about [Production Deployment](/examples/production) best practices
- See [Integration Examples](/examples/integration) for popular frameworks
- Review [Best Practices](/guide/best-practices) for additional recommendations

---

*This guide covers advanced customization patterns. For basic usage, start with the [Getting Started](/guide/) guide.*
