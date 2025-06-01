# Types API

Complete TypeScript type definitions for Plip Logger.

## Core Types

### `PlipLogger`

The main logger interface providing all logging methods.

```typescript
interface PlipLogger {
  // Log level methods
  verbose(message: string, data?: any): PlipLogger;
  debug(message: string, data?: any): PlipLogger;
  info(message: string, data?: any): PlipLogger;
  success(message: string, data?: any): PlipLogger;
  warn(message: string, data?: any): PlipLogger;
  error(message: string, data?: any): PlipLogger;
  fatal(message: string, data?: any): PlipLogger;
  
  // Configuration access
  readonly config: PlipConfig;
  
  // Utility methods
  configure(config: Partial<PlipConfig>): PlipLogger;
  isLevelEnabled(level: LogLevel): boolean;
}
```

#### Method Signatures

All logging methods follow the same signature pattern:

```typescript
type LogMethod = (message: string, data?: any) => PlipLogger;
```

**Parameters**:
- `message`: Required string describing the log event
- `data`: Optional data of any serializable type

**Returns**: The logger instance for method chaining

### `PlipConfig`

Configuration interface for customizing logger behavior.

```typescript
interface PlipConfig {
  enableEmojis?: boolean;
  enableColors?: boolean;
  enabledLevels?: LogLevel[];
}
```

See [Configuration API](/api/configuration) for detailed property descriptions.

### `LogLevel`

Union type of all available log levels.

```typescript
type LogLevel = 'verbose' | 'debug' | 'info' | 'success' | 'warn' | 'error' | 'fatal';
```

## Factory Function Types

### `createPlip`

Factory function type for creating logger instances.

```typescript
type CreatePlipFunction = (config?: PlipConfig) => PlipLogger;
```

**Usage**:
```typescript
import { createPlip } from '@ru-dr/plip';

const logger: PlipLogger = createPlip({
  enableEmojis: true,
  enableColors: true,
  enabledLevels: ['info', 'warn', 'error']
});
```

## Utility Types

### `LogData`

Type for the optional data parameter in log methods.

```typescript
type LogData = any;
```

While typed as `any` for flexibility, the data should be serializable to JSON.

**Examples**:
```typescript
// Primitive values
const stringData: LogData = "hello";
const numberData: LogData = 42;
const booleanData: LogData = true;

// Objects
const objectData: LogData = {
  user: { id: 123, name: "Alice" },
  timestamp: new Date().toISOString(),
  metadata: { version: "1.0.0" }
};

// Arrays
const arrayData: LogData = ["item1", "item2", "item3"];
```

### `PartialPlipConfig`

Partial version of `PlipConfig` for configuration updates.

```typescript
type PartialPlipConfig = Partial<PlipConfig>;
```

Used in the `configure` method:
```typescript
logger.configure({
  enableEmojis: false // Only update this property
});
```

## Level-Specific Types

### `VerboseLevel`

```typescript
type VerboseLevel = 'verbose';
```

### `DebugLevel`

```typescript
type DebugLevel = 'debug';
```

### `InfoLevel`

```typescript
type InfoLevel = 'info';
```

### `SuccessLevel`

```typescript
type SuccessLevel = 'success';
```

### `WarnLevel`

```typescript
type WarnLevel = 'warn';
```

### `ErrorLevel`

```typescript
type ErrorLevel = 'error';
```

### `FatalLevel`

```typescript
type FatalLevel = 'fatal';
```

## Type Guards

### `isLogLevel`

Type guard to check if a string is a valid log level.

```typescript
function isLogLevel(value: string): value is LogLevel {
  return ['verbose', 'debug', 'info', 'success', 'warn', 'error', 'fatal'].includes(value);
}
```

**Usage**:
```typescript
const userInput = "info";
if (isLogLevel(userInput)) {
  logger[userInput]("This is type-safe!");
}
```

### `isPlipLogger`

Type guard to check if an object is a Plip logger instance.

```typescript
function isPlipLogger(obj: any): obj is PlipLogger {
  return obj && 
         typeof obj.info === 'function' &&
         typeof obj.error === 'function' &&
         typeof obj.config === 'object';
}
```

## Generic Types

### `LoggerMethod<T>`

Generic type for logger methods with custom return types.

```typescript
type LoggerMethod<T = PlipLogger> = (message: string, data?: any) => T;
```

### `ConfigurableLogger<T>`

Generic interface for configurable loggers.

```typescript
interface ConfigurableLogger<T extends PlipConfig = PlipConfig> {
  config: T;
  configure(config: Partial<T>): void;
}
```

## Advanced Type Usage

### Strongly Typed Logger Factory

```typescript
interface StrictPlipConfig {
  enableEmojis: boolean;
  enableColors: boolean;
  enabledLevels: LogLevel[];
}

function createStrictPlip(config: StrictPlipConfig): PlipLogger {
  return createPlip(config);
}

// Usage requires all properties
const logger = createStrictPlip({
  enableEmojis: true,      // Required
  enableColors: true,      // Required
  enabledLevels: ['info']  // Required
});
```

### Level-Constrained Logger

```typescript
type LimitedLogLevel = 'info' | 'warn' | 'error';

interface LimitedPlipConfig extends Omit<PlipConfig, 'enabledLevels'> {
  enabledLevels?: LimitedLogLevel[];
}

function createLimitedLogger(config?: LimitedPlipConfig): PlipLogger {
  return createPlip(config);
}
```

### Method-Specific Types

```typescript
type InfoMethod = PlipLogger['info'];
type ErrorMethod = PlipLogger['error'];
type ConfigProperty = PlipLogger['config'];

// Extract method signature
type LogMethodSignature = (message: string, data?: any) => PlipLogger;
```

## Type Examples

### Service Logger with Constraints

```typescript
interface ServiceLoggerConfig {
  serviceName: string;
  environment: 'development' | 'production' | 'test';
  logLevel: 'debug' | 'info' | 'warn' | 'error';
}

class ServiceLogger {
  private logger: PlipLogger;
  
  constructor(private config: ServiceLoggerConfig) {
    this.logger = createPlip({
      enableEmojis: config.environment === 'development',
      enableColors: config.environment !== 'test',
      enabledLevels: this.getLevelsFromMinLevel(config.logLevel)
    });
  }
  
  private getLevelsFromMinLevel(minLevel: ServiceLoggerConfig['logLevel']): LogLevel[] {
    const allLevels: LogLevel[] = ['verbose', 'debug', 'info', 'success', 'warn', 'error', 'fatal'];
    const levelIndex = allLevels.indexOf(minLevel);
    return allLevels.slice(levelIndex);
  }
  
  info(message: string, data?: any): void {
    this.logger.info(`[${this.config.serviceName}] ${message}`, data);
  }
  
  error(message: string, data?: any): void {
    this.logger.error(`[${this.config.serviceName}] ${message}`, data);
  }
}
```

### Typed Log Data

```typescript
interface UserLogData {
  userId: number;
  email: string;
  action: string;
  timestamp: string;
}

interface ErrorLogData {
  error: string;
  stack?: string;
  context?: Record<string, any>;
}

// Usage with typed data
const userLogger = createPlip();

const userData: UserLogData = {
  userId: 123,
  email: "user@example.com",
  action: "login",
  timestamp: new Date().toISOString()
};

userLogger.info("User action", userData);

const errorData: ErrorLogData = {
  error: "Database connection failed",
  stack: error.stack,
  context: { host: "localhost", port: 5432 }
};

userLogger.error("Database error", errorData);
```

### Logger Wrapper

```typescript
interface WrappedLogger {
  log: PlipLogger;
  context: Record<string, any>;
}

function createWrappedLogger(context: Record<string, any>): WrappedLogger {
  return {
    log: createPlip(),
    context
  };
}

// Usage
const wrapper = createWrappedLogger({ service: "auth", version: "1.0.0" });
wrapper.log.info("Service started", wrapper.context);
```

## Type Safety Best Practices

### 1. Use Type Guards

```typescript
function logSafely(logger: unknown, message: string, data?: any): void {
  if (isPlipLogger(logger)) {
    logger.info(message, data);
  }
}
```

### 2. Constrain Configuration Types

```typescript
interface ProductionConfig extends PlipConfig {
  enableEmojis: false;
  enableColors: false;
}

const prodConfig: ProductionConfig = {
  enableEmojis: false,
  enableColors: false,
  enabledLevels: ['warn', 'error', 'fatal']
};
```

### 3. Use Generic Constraints

```typescript
function createTypedLogger<T extends Partial<PlipConfig>>(config: T): PlipLogger {
  return createPlip(config);
}
```

## Import Types

All types are available for import:

```typescript
import type {
  PlipLogger,
  PlipConfig,
  LogLevel,
  LogData,
  PartialPlipConfig
} from '@ru-dr/plip';
```

## Next Steps

- Explore the [Logger API](/api/logger)
- Learn about [Configuration](/api/configuration)
- Check out practical [Examples](/examples/)
