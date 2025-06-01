# Configuration API

Complete API reference for Plip configuration options and types.

## PlipConfig Interface

The main configuration interface for customizing logger behavior.

```typescript
interface PlipConfig {
  enableEmojis?: boolean;
  enableColors?: boolean;
  enabledLevels?: LogLevel[];
}
```

### Properties

#### `enableEmojis?: boolean`

Controls whether emoji prefixes are displayed in log messages.

- **Type**: `boolean | undefined`
- **Default**: `true`
- **Description**: When `true`, each log level displays its corresponding emoji (🫧, ⚠️, 💥, etc.)

```typescript
// Enable emojis (default)
const logger = createPlip({ enableEmojis: true });
logger.info("Hello!"); // Output: 🫧 [INFO] Hello!

// Disable emojis
const cleanLogger = createPlip({ enableEmojis: false });
cleanLogger.info("Hello!"); // Output: [INFO] Hello!
```

#### `enableColors?: boolean`

Controls whether ANSI color codes are applied to log output.

- **Type**: `boolean | undefined`
- **Default**: Auto-detected based on terminal capabilities
- **Description**: When `true`, logs are colored according to their level

```typescript
// Force enable colors
const colorLogger = createPlip({ enableColors: true });

// Force disable colors
const plainLogger = createPlip({ enableColors: false });

// Auto-detect (default)
const autoLogger = createPlip({ enableColors: undefined });
```

**Color Scheme**:
- `verbose`: Gray
- `debug`: Blue  
- `info`: Cyan
- `success`: Green
- `warn`: Yellow
- `error`: Red
- `fatal`: Magenta

#### `enabledLevels?: LogLevel[]`

Specifies which log levels are active and will produce output.

- **Type**: `LogLevel[] | undefined`
- **Default**: All levels enabled
- **Description**: Only levels included in this array will generate output

```typescript
// Only show warnings and errors
const prodLogger = createPlip({
  enabledLevels: ['warn', 'error', 'fatal']
});

// Development logger with all levels
const devLogger = createPlip({
  enabledLevels: ['verbose', 'debug', 'info', 'success', 'warn', 'error', 'fatal']
});

// Minimal logging
const minimalLogger = createPlip({
  enabledLevels: ['error', 'fatal']
});
```

## LogLevel Type

Enumeration of available log levels in order of severity.

```typescript
type LogLevel = 'verbose' | 'debug' | 'info' | 'success' | 'warn' | 'error' | 'fatal';
```

### Level Descriptions

| Level | Purpose | Use Case |
|-------|---------|----------|
| `verbose` | Detailed debugging | Function tracing, variable dumps |
| `debug` | Development debugging | Development-time information |
| `info` | General information | Normal operation status |
| `success` | Success messages | Completion confirmations |
| `warn` | Warning conditions | Recoverable issues, deprecations |
| `error` | Error conditions | Handled errors, failures |
| `fatal` | Critical errors | Unrecoverable errors |

## Configuration Patterns

### Environment-Based Configuration

```typescript
const createEnvironmentConfig = (): PlipConfig => {
  const env = process.env.NODE_ENV;
  
  switch (env) {
    case 'production':
      return {
        enableEmojis: false,
        enableColors: false,
        enabledLevels: ['warn', 'error', 'fatal']
      };
      
    case 'development':
      return {
        enableEmojis: true,
        enableColors: true,
        enabledLevels: ['verbose', 'debug', 'info', 'success', 'warn', 'error', 'fatal']
      };
      
    case 'test':
      return {
        enableEmojis: false,
        enableColors: false,
        enabledLevels: ['error', 'fatal']
      };
      
    default:
      return {
        enableEmojis: true,
        enableColors: true,
        enabledLevels: ['info', 'warn', 'error']
      };
  }
};

const logger = createPlip(createEnvironmentConfig());
```

### Feature Flag Configuration

```typescript
const createFeatureConfig = (): PlipConfig => {
  return {
    enableEmojis: process.env.PLIP_EMOJIS !== 'false',
    enableColors: process.env.PLIP_COLORS !== 'false',
    enabledLevels: process.env.PLIP_VERBOSE === 'true'
      ? ['verbose', 'debug', 'info', 'success', 'warn', 'error', 'fatal']
      : ['info', 'warn', 'error']
  };
};
```

### Conditional Configuration

```typescript
const createConditionalConfig = (options: {
  isDevelopment: boolean;
  isCI: boolean;
  isDocker: boolean;
}): PlipConfig => {
  const { isDevelopment, isCI, isDocker } = options;
  
  return {
    enableEmojis: isDevelopment && !isCI,
    enableColors: !isCI && !isDocker,
    enabledLevels: isDevelopment
      ? ['verbose', 'debug', 'info', 'success', 'warn', 'error', 'fatal']
      : ['info', 'warn', 'error', 'fatal']
  };
};
```

## Default Configuration

When no configuration is provided, Plip uses these defaults:

```typescript
const DEFAULT_CONFIG: PlipConfig = {
  enableEmojis: true,
  enableColors: undefined, // Auto-detect
  enabledLevels: ['verbose', 'debug', 'info', 'success', 'warn', 'error', 'fatal']
};
```

## Configuration Validation

Plip automatically validates and sanitizes configuration:

```typescript
// Invalid configurations are handled gracefully
const logger1 = createPlip({
  enabledLevels: [] // Empty array -> falls back to default
});

const logger2 = createPlip({
  enabledLevels: ['invalid'] as any // Invalid level -> falls back to default
});

const logger3 = createPlip({
  enableEmojis: 'yes' as any // Invalid type -> converts to boolean
});
```

## Configuration Examples

### Microservice Logger

```typescript
const microserviceConfig: PlipConfig = {
  enableEmojis: false,  // Clean for container logs
  enableColors: false,  // Better for log aggregation
  enabledLevels: ['info', 'warn', 'error', 'fatal']
};

const serviceLogger = createPlip(microserviceConfig);
```

### Debug Logger

```typescript
const debugConfig: PlipConfig = {
  enableEmojis: true,
  enableColors: true,
  enabledLevels: ['verbose', 'debug'] // Only debug information
};

const debugLogger = createPlip(debugConfig);
```

### CLI Application Logger

```typescript
const cliConfig: PlipConfig = {
  enableEmojis: true,   // Visual feedback for users
  enableColors: true,   // Better UX in terminal
  enabledLevels: ['info', 'success', 'warn', 'error'] // Skip debug noise
};

const cliLogger = createPlip(cliConfig);
```

### Web Server Logger

```typescript
const serverConfig: PlipConfig = {
  enableEmojis: process.env.NODE_ENV === 'development',
  enableColors: process.stdout.isTTY,
  enabledLevels: process.env.NODE_ENV === 'production'
    ? ['info', 'warn', 'error', 'fatal']
    : ['debug', 'info', 'success', 'warn', 'error', 'fatal']
};

const serverLogger = createPlip(serverConfig);
```

## Configuration Best Practices

### 1. Environment Awareness

Always consider your deployment environment:

```typescript
const isProd = process.env.NODE_ENV === 'production';
const isTest = process.env.NODE_ENV === 'test';
const isTTY = process.stdout.isTTY;

const config: PlipConfig = {
  enableEmojis: !isProd && !isTest,
  enableColors: isTTY && !isTest,
  enabledLevels: isProd ? ['warn', 'error', 'fatal'] : undefined
};
```

### 2. Consistent Defaults

Establish team-wide configuration standards:

```typescript
// config/logger.ts
export const STANDARD_CONFIGS = {
  development: {
    enableEmojis: true,
    enableColors: true,
    enabledLevels: ['verbose', 'debug', 'info', 'success', 'warn', 'error', 'fatal']
  } as PlipConfig,
  
  production: {
    enableEmojis: false,
    enableColors: false,
    enabledLevels: ['info', 'warn', 'error', 'fatal']
  } as PlipConfig,
  
  testing: {
    enableEmojis: false,
    enableColors: false,
    enabledLevels: ['error', 'fatal']
  } as PlipConfig
} as const;
```

### 3. Gradual Level Filtering

Use hierarchical level filtering for different environments:

```typescript
const getLevelsForEnvironment = (env: string): LogLevel[] => {
  const allLevels: LogLevel[] = ['verbose', 'debug', 'info', 'success', 'warn', 'error', 'fatal'];
  
  switch (env) {
    case 'development': return allLevels;
    case 'staging': return allLevels.slice(2); // info and above
    case 'production': return allLevels.slice(4); // warn and above
    default: return ['info', 'warn', 'error'];
  }
};
```

## Next Steps

- Learn about [Types](/api/types) definitions
- Explore the [Logger API](/api/logger)
- Check out [Customization](/guide/customization) examples
