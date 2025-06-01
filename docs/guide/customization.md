# Customization

Plip offers extensive customization options to tailor the logging experience to your exact needs and preferences. From visual styling to advanced filtering, you can create the perfect logging setup for your application.

## Quick Start Customization

### Basic Custom Logger

```typescript
import { createPlip } from '@ru-dr/plip';

const customLogger = createPlip({
  enableEmojis: true,
  enableColors: true,
  enabledLevels: ['info', 'warn', 'error']
});

customLogger.info("Custom logger initialized!");
```

## Visual Customization

### Emoji Configuration

Control emoji usage across your application:

```typescript
import { createPlip } from '@ru-dr/plip';

// Disable emojis for cleaner output
const cleanLogger = createPlip({
  enableEmojis: false
});
cleanLogger.info("Clean output without emojis");

// Enable emojis for visual appeal
const visualLogger = createPlip({
  enableEmojis: true
});
visualLogger.success("✨ Visual output with emojis!");

// Context-aware emoji usage
const conditionalLogger = createPlip({
  enableEmojis: process.env.NODE_ENV === 'development'
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
  enableColors: undefined // Auto-detection based on TTY
});

// Environment-based colors
const envLogger = createPlip({
  enableColors: process.stdout.isTTY && process.env.NODE_ENV !== 'production'
});
```

## Advanced Filtering & Level Control

### Level Filtering

Create specialized loggers for different use cases:

```typescript
// Development logger with all levels
const devLogger = createPlip({
  enabledLevels: ['verbose', 'debug', 'info', 'success', 'warn', 'error', 'trace']
});

// Production logger with limited levels
const prodLogger = createPlip({
  enabledLevels: ['info', 'warn', 'error']
});

// Debug-only logger
const debugLogger = createPlip({
  enabledLevels: ['debug', 'verbose']
});

// Error tracking logger
const errorLogger = createPlip({
  enabledLevels: ['error', 'warn']
});
```

### Conditional Logging

```typescript
// Create environment-specific loggers
const createEnvironmentLogger = (env: string) => {
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
    }
  };
  
  return createPlip(configs[env] || configs.production);
};

const logger = createEnvironmentLogger(process.env.NODE_ENV || 'development');
```

## Domain-Specific Loggers

### Service-Based Organization

```typescript
// API Logger
const apiLogger = createPlip({
  enableEmojis: true,
  enableColors: true,
  enabledLevels: ['info', 'warn', 'error', 'debug']
});

// Database Logger
const dbLogger = createPlip({
  enableEmojis: false,
  enableColors: true,
  enabledLevels: ['info', 'warn', 'error', 'trace']
});

// Authentication Logger
const authLogger = createPlip({
  enableEmojis: true,
  enableColors: true,
  enabledLevels: ['info', 'success', 'warn', 'error']
});

// Usage examples
apiLogger.info("API request received");
dbLogger.trace("Database query executed");
authLogger.success("User authenticated successfully");
```

### Feature-Based Loggers

```typescript
// User operations
const userLogger = createPlip({
  enableEmojis: true,
  enabledLevels: ['info', 'success', 'warn', 'error']
});

// Payment processing
const paymentLogger = createPlip({
  enableEmojis: false,
  enabledLevels: ['info', 'warn', 'error', 'trace']
});

// File operations
const fileLogger = createPlip({
  enableEmojis: true,
  enabledLevels: ['debug', 'info', 'warn', 'error']
});
```

## Configuration Patterns

### Centralized Configuration

```typescript
// config/logging.ts
export const LOGGER_CONFIGS = {
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
    enabledLevels: ['info', 'warn', 'error', 'trace']
  },
  testing: {
    enableEmojis: false,
    enableColors: false,
    enabledLevels: ['error']
  }
} as const;

// Helper function
export const createEnvironmentLogger = (env?: string) => {
  const environment = env || process.env.NODE_ENV || 'development';
  const config = LOGGER_CONFIGS[environment] || LOGGER_CONFIGS.development;
  return createPlip(config);
};
```

### Dynamic Configuration

```typescript
// config/dynamic-logging.ts
export class DynamicLogger {
  private logger: ReturnType<typeof createPlip>;
  
  constructor(private config: PlipConfig) {
    this.logger = createPlip(config);
  }
  
  updateConfig(newConfig: Partial<PlipConfig>) {
    this.config = { ...this.config, ...newConfig };
    this.logger = createPlip(this.config);
  }
  
  // Proxy methods
  info = (...args: any[]) => this.logger.info(...args);
  warn = (...args: any[]) => this.logger.warn(...args);
  error = (...args: any[]) => this.logger.error(...args);
  success = (...args: any[]) => this.logger.success(...args);
  debug = (...args: any[]) => this.logger.debug(...args);
  verbose = (...args: any[]) => this.logger.verbose(...args);
  trace = (...args: any[]) => this.logger.trace(...args);
}

// Usage
const dynamicLogger = new DynamicLogger({
  enableEmojis: true,
  enableColors: true,
  enabledLevels: ['info', 'warn', 'error']
});

// Runtime configuration changes
dynamicLogger.updateConfig({ enableEmojis: false });
```

### Environment Variable Integration

```typescript
// config/env-logging.ts
export const createEnvAwareLogger = () => {
  const enableEmojis = process.env.PLIP_EMOJIS !== 'false';
  const enableColors = process.env.PLIP_COLORS !== 'false';
  const logLevel = process.env.LOG_LEVEL || 'info';
  
  const levelHierarchy = {
    verbose: ['verbose', 'debug', 'info', 'success', 'warn', 'error', 'trace'],
    debug: ['debug', 'info', 'success', 'warn', 'error', 'trace'],
    info: ['info', 'success', 'warn', 'error', 'trace'],
    warn: ['warn', 'error', 'trace'],
    error: ['error', 'trace']
  };
  
  return createPlip({
    enableEmojis,
    enableColors,
    enabledLevels: levelHierarchy[logLevel] || levelHierarchy.info
  });
};
```

## Real-World Examples

### Microservice Logger

```typescript
// services/logger-factory.ts
export const createServiceLogger = (serviceName: string) => {
  const baseConfig = {
    enableEmojis: process.env.NODE_ENV === 'development',
    enableColors: process.stdout.isTTY,
    enabledLevels: getLogLevelsForEnvironment()
  };
  
  const logger = createPlip(baseConfig);
  
  // Add service context to all logs
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
      logger.debug(`[${serviceName}] ${message}`, ...args)
  };
};

// Usage
const userService = createServiceLogger('UserService');
const paymentService = createServiceLogger('PaymentService');

userService.info("User created successfully");
paymentService.warn("Payment processing delayed");
```

### Request-Scoped Logger

```typescript
// middleware/request-logger.ts
export const createRequestLogger = (requestId: string) => {
  const logger = createPlip({
    enableEmojis: false,
    enableColors: true,
    enabledLevels: ['info', 'warn', 'error', 'debug']
  });
  
  return {
    info: (message: string, ...args: any[]) => 
      logger.info(`[${requestId}] ${message}`, ...args),
    warn: (message: string, ...args: any[]) => 
      logger.warn(`[${requestId}] ${message}`, ...args),
    error: (message: string, ...args: any[]) => 
      logger.error(`[${requestId}] ${message}`, ...args),
    debug: (message: string, ...args: any[]) => 
      logger.debug(`[${requestId}] ${message}`, ...args)
  };
};
```

## Performance Considerations

### Lazy Logger Creation

```typescript
// utils/lazy-logger.ts
let _logger: ReturnType<typeof createPlip> | null = null;

export const getLogger = () => {
  if (!_logger) {
    _logger = createPlip({
      enableEmojis: process.env.NODE_ENV === 'development',
      enableColors: process.stdout.isTTY,
      enabledLevels: getEnabledLevels()
    });
  }
  return _logger;
};
```

### Conditional Logger Creation

```typescript
// Only create debug logger in development
const debugLogger = process.env.NODE_ENV === 'development' 
  ? createPlip({ enabledLevels: ['debug', 'verbose'] })
  : null;

// Conditional usage
debugLogger?.debug("Debug information");
```

## Best Practices

### 1. **Environment-Specific Configuration**
Always configure loggers based on your environment to optimize performance and output relevance.

### 2. **Centralized Configuration**
Use centralized configuration files to maintain consistency across your application.

### 3. **Domain Separation**
Create domain-specific loggers for better organization and filtering capabilities.

### 4. **Performance Optimization**
Use lazy initialization and conditional creation for better performance in production.

### 5. **Context Enrichment**
Add contextual information (service names, request IDs) to make logs more useful.

## Troubleshooting

### Colors Not Showing
```typescript
// Force enable colors
const logger = createPlip({ enableColors: true });

// Check TTY detection
console.log('TTY detected:', process.stdout.isTTY);
```

### Levels Not Working
```typescript
// Verify level configuration
const logger = createPlip({
  enabledLevels: ['debug'] // Make sure your desired level is included
});

// Test level output
logger.debug("This should appear");
logger.info("This will not appear");
```

## Next Steps

- Explore practical [Examples](/examples/)
- Check the complete [API Reference](/api/logger)
- Learn about [Production Setup](/examples/production)
- See [Integration Examples](/examples/integration)

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
  enabledLevels: ['warn', 'error']
});
```

### Conditional Logging

Create loggers that adapt to runtime conditions:

```typescript
const createConditionalLogger = (isDevelopment: boolean) => {
  return createPlip({
    enableEmojis: isDevelopment,
    enableColors: isDevelopment,    enabledLevels: isDevelopment 
      ? ['verbose', 'debug', 'info', 'success', 'warn', 'error', 'trace']
      : ['warn', 'error', 'trace']
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
  enabledLevels: ['info', 'warn', 'error', 'trace']
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
  enabledLevels: ['verbose', 'debug', 'info', 'success', 'warn', 'error', 'trace']
});

// Rich, detailed logging for development
devLogger.verbose("🔍 Variable state:", { currentUser, sessionData });
devLogger.debug("🔍 Function called:", { functionName: 'processOrder', args });
devLogger.success("🎉 Development server ready!");
```

### Production Environment

```typescript
const prodLogger = createPlip({
  enableEmojis: false,  // Cleaner for log aggregation
  enableColors: false,  // Better for file logging
  enabledLevels: ['info', 'warn', 'error', 'trace']
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
  enabledLevels: ['error', 'trace']  // Only critical issues during tests
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
    enableColors: !isTest,    enabledLevels: [
      ...(includeDebug ? ['verbose', 'debug'] : []),
      'info',
      'success',
      'warn',
      'error',
      'trace'
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
      ? ['verbose', 'debug', 'info', 'success', 'warn', 'error', 'trace']
      : ['info', 'warn', 'error'];
    
    this.logger = createPlip({
      enableEmojis: this.logger.config.enableEmojis,
      enableColors: this.logger.config.enableColors,
      enabledLevels: levels
    });
  }
  
  setProductionMode(enabled: boolean) {    this.logger = createPlip({
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
    enableColors: features.colors,    enabledLevels: features.verbose 
      ? ['verbose', 'debug', 'info', 'success', 'warn', 'error', 'trace']
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
const createStructuredLogger = (service: string, version: string) => {  const logger = createPlip({
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
      logger.warn(message, addMetadata(data)),    error: (message: string, data?: any) => 
      logger.error(message, addMetadata(data)),
    trace: (message: string, data?: any) => 
      logger.trace(message, addMetadata(data))
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
    enabledLevels: ['verbose', 'debug', 'info', 'success', 'warn', 'error', 'trace']
  },
  production: {
    enableEmojis: false,
    enableColors: false,
    enabledLevels: ['info', 'warn', 'error', 'trace']
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
