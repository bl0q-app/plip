# Custom Loggers

Learn how to create and use custom logger instances for different parts of your application.

## Creating Custom Loggers

### Basic Custom Logger

```typescript
import { createPlip } from '@ru-dr/plip';

const customLogger = createPlip({
  enableEmojis: true,
  enableColors: true,
  enabledLevels: ['info', 'warn', 'error']
});

customLogger.info("This is from a custom logger!");
```

### Service-Specific Loggers

Create loggers tailored for different services:

```typescript
// Database logger
const dbLogger = createPlip({
  enableEmojis: true,
  enableColors: true,
  enabledLevels: ['debug', 'info', 'warn', 'error']
});

// API logger  
const apiLogger = createPlip({
  enableEmojis: true,
  enableColors: true,
  enabledLevels: ['info', 'warn', 'error']
});

// Authentication logger
const authLogger = createPlip({
  enableEmojis: false, // Cleaner for security logs
  enableColors: true,
  enabledLevels: ['info', 'warn', 'error', 'fatal']
});
```

## Advanced Custom Logger Patterns

### Logger Factory

Create a factory function for consistent logger creation:

```typescript
interface LoggerConfig {
  service: string;
  environment: 'development' | 'production' | 'test';
  enableDebug?: boolean;
}

function createServiceLogger(config: LoggerConfig) {
  const { service, environment, enableDebug = false } = config;
  
  const isProd = environment === 'production';
  const isTest = environment === 'test';
  
  return createPlip({
    enableEmojis: !isProd && !isTest,
    enableColors: !isTest,
    enabledLevels: [
      ...(enableDebug ? ['verbose', 'debug'] : []),
      'info',
      'success',
      'warn',
      'error',
      'fatal'
    ]
  });
}

// Usage
const userServiceLogger = createServiceLogger({
  service: 'UserService',
  environment: 'production'
});

const paymentServiceLogger = createServiceLogger({
  service: 'PaymentService',
  environment: 'development',
  enableDebug: true
});
```

### Context-Aware Logger

```typescript
class ContextLogger {
  private logger: PlipLogger;
  private context: Record<string, any>;
  
  constructor(context: Record<string, any>, config?: PlipConfig) {
    this.context = context;
    this.logger = createPlip(config);
  }
  
  private addContext(data?: any) {
    return { ...this.context, ...data };
  }
  
  info(message: string, data?: any) {
    this.logger.info(message, this.addContext(data));
  }
  
  warn(message: string, data?: any) {
    this.logger.warn(message, this.addContext(data));
  }
  
  error(message: string, data?: any) {
    this.logger.error(message, this.addContext(data));
  }
  
  success(message: string, data?: any) {
    this.logger.success(message, this.addContext(data));
  }
}

// Usage
const requestLogger = new ContextLogger({
  requestId: 'req-123',
  userId: 456,
  service: 'api'
});

requestLogger.info("Processing request"); 
// Output includes: { requestId: 'req-123', userId: 456, service: 'api' }
```

More examples coming soon...
