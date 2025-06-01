# Configuration

Plip offers flexible configuration options to tailor the logging experience to your needs.

## Default Logger Configuration

The default `plip` logger comes pre-configured with sensible defaults:

```typescript
import { plip } from '@ru-dr/plip';

// Use immediately - no configuration needed!
plip.info("Ready to go! 🚀");
```

## Creating Custom Loggers

For more control, create your own logger instance:

```typescript
import { createPlip } from '@ru-dr/plip';

const customLogger = createPlip({
  enableEmojis: true,
  enableColors: true,
  enabledLevels: ['info', 'warn', 'error']
});
```

## Configuration Options

### PlipConfig Interface

```typescript
interface PlipConfig {
  enableEmojis?: boolean;      // Enable/disable emoji prefixes
  enableColors?: boolean;      // Enable/disable color output
  enabledLevels?: LogLevel[];  // Array of enabled log levels
}
```

### Available Log Levels

```typescript
type LogLevel = 'verbose' | 'debug' | 'info' | 'success' | 'warn' | 'error' | 'fatal';
```

## Configuration Examples

### Production Logger

Optimized for production environments:

```typescript
const prodLogger = createPlip({
  enableEmojis: false,    // Cleaner for log aggregation
  enableColors: false,    // Better for file logging
  enabledLevels: ['info', 'warn', 'error', 'fatal']
});
```

### Development Logger

Enhanced for development experience:

```typescript
const devLogger = createPlip({
  enableEmojis: true,     // Visual context
  enableColors: true,     // Beautiful output
  enabledLevels: ['verbose', 'debug', 'info', 'success', 'warn', 'error', 'fatal']
});
```

### Minimal Logger

Only essential messages:

```typescript
const minimalLogger = createPlip({
  enableEmojis: false,
  enableColors: false,
  enabledLevels: ['error', 'fatal']
});
```

### Debug-Only Logger

For troubleshooting:

```typescript
const debugLogger = createPlip({
  enableEmojis: true,
  enableColors: true,
  enabledLevels: ['verbose', 'debug']
});
```

## Runtime Configuration

Modify logger behavior after creation:

```typescript
import { plip } from '@ru-dr/plip';

// Enable/disable features dynamically
plip.configure({
  enableEmojis: false,
  enableColors: true
});
```

## Environment-Based Configuration

Configure based on environment variables:

```typescript
const isProd = process.env.NODE_ENV === 'production';
const isTest = process.env.NODE_ENV === 'test';

const logger = createPlip({
  enableEmojis: !isProd,
  enableColors: !isTest,
  enabledLevels: isProd 
    ? ['info', 'warn', 'error', 'fatal']
    : ['verbose', 'debug', 'info', 'success', 'warn', 'error', 'fatal']
});
```

## Multiple Logger Instances

Create specialized loggers for different parts of your application:

```typescript
// Database logger
const dbLogger = createPlip({
  enableEmojis: true,
  enableColors: true,
  enabledLevels: ['debug', 'info', 'error']
});

// API logger
const apiLogger = createPlip({
  enableEmojis: true,
  enableColors: true,
  enabledLevels: ['info', 'warn', 'error']
});

// Security logger
const securityLogger = createPlip({
  enableEmojis: false,
  enableColors: false,
  enabledLevels: ['warn', 'error', 'fatal']
});
```

## Configuration Best Practices

### 1. Environment Awareness
Always consider your deployment environment when configuring loggers.

### 2. Level Management
Use appropriate log levels for different environments:
- **Development**: All levels enabled
- **Staging**: Info and above
- **Production**: Warn and above

### 3. Color Considerations
- Enable colors for local development
- Disable colors for file logging and CI/CD
- Let Plip auto-detect in most cases

### 4. Emoji Usage
- Great for development and local debugging
- Consider disabling for production logs
- Ensure your logging infrastructure supports Unicode

## Advanced Configuration

### Conditional Configuration

```typescript
const getLoggerConfig = (): PlipConfig => {
  const config: PlipConfig = {
    enableEmojis: true,
    enableColors: true,
    enabledLevels: ['info', 'warn', 'error']
  };

  // Modify based on environment
  if (process.env.NODE_ENV === 'production') {
    config.enableEmojis = false;
    config.enabledLevels = ['warn', 'error', 'fatal'];
  }

  if (process.env.CI) {
    config.enableColors = false;
  }

  return config;
};

const logger = createPlip(getLoggerConfig());
```

### Configuration Validation

```typescript
const validateConfig = (config: PlipConfig): PlipConfig => {
  const validated = { ...config };
  
  // Ensure at least one log level is enabled
  if (!validated.enabledLevels || validated.enabledLevels.length === 0) {
    validated.enabledLevels = ['info', 'warn', 'error'];
  }
  
  return validated;
};

const logger = createPlip(validateConfig({
  enableEmojis: true,
  enableColors: true,
  enabledLevels: []
}));
```

## Next Steps

- Learn about [Log Levels](/guide/log-levels) in detail
- Explore [Customization](/guide/customization) options
- Check out configuration [Examples](/examples/custom-loggers)
