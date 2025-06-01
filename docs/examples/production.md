# Production Setup

Best practices and configurations for using Plip in production environments.

## Production Configuration

### Recommended Production Settings

```typescript
import { createPlip } from '@ru-dr/plip';

const productionLogger = createPlip({
  enableEmojis: false,  // Cleaner for log aggregation
  enableColors: false,  // Better for file logging
  enabledLevels: ['info', 'warn', 'error', 'fatal']
});
```

### Environment-Based Configuration

```typescript
const createEnvironmentLogger = () => {
  const env = process.env.NODE_ENV || 'development';
  
  const configs = {
    production: {
      enableEmojis: false,
      enableColors: false,
      enabledLevels: ['warn', 'error', 'fatal']
    },
    staging: {
      enableEmojis: false,
      enableColors: false,
      enabledLevels: ['info', 'warn', 'error', 'fatal']
    },
    development: {
      enableEmojis: true,
      enableColors: true,
      enabledLevels: ['verbose', 'debug', 'info', 'success', 'warn', 'error', 'fatal']
    }
  };
  
  return createPlip(configs[env] || configs.development);
};

const logger = createEnvironmentLogger();
```

## Structured Logging

### Adding Metadata

```typescript
const createStructuredLogger = () => {
  const logger = createPlip({
    enableEmojis: false,
    enableColors: false,
    enabledLevels: ['info', 'warn', 'error', 'fatal']
  });
  
  const addMetadata = (data = {}) => ({
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    service: process.env.SERVICE_NAME,
    version: process.env.SERVICE_VERSION,
    hostname: require('os').hostname(),
    ...data
  });
  
  return {
    info: (message: string, data?: any) => logger.info(message, addMetadata(data)),
    warn: (message: string, data?: any) => logger.warn(message, addMetadata(data)),
    error: (message: string, data?: any) => logger.error(message, addMetadata(data)),
    fatal: (message: string, data?: any) => logger.fatal(message, addMetadata(data))
  };
};
```

More production examples coming soon...
