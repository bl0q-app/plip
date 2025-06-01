# Configuration API Reference

This reference covers all configuration options available when creating and configuring Plip Logger instances.

## Logger Constructor Options

### Interface Definition

```typescript
interface LoggerOptions {
  level?: LogLevel
  timestamp?: boolean
  colorize?: boolean
  format?: LogFormat
  prefix?: string
  output?: LogOutput
  filters?: LogFilter[]
  transforms?: LogTransform[]
  metadata?: Record<string, any>
  performance?: PerformanceOptions
}
```

## Core Configuration Options

### level

Controls which log messages are output based on their severity level.

```typescript
type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'silent'
```

**Default:** `'info'`

**Example:**
```typescript
const logger = new Logger({ level: 'debug' })

// These will be output (debug level and above)
logger.debug('Debug message')
logger.info('Info message')
logger.warn('Warning message')
logger.error('Error message')
```

**Level Hierarchy:**
- `debug`: Shows all messages
- `info`: Shows info, warn, and error messages
- `warn`: Shows warn and error messages
- `error`: Shows only error messages
- `silent`: Shows no messages

### timestamp

Enables or disables timestamp prefixes in log messages.

```typescript
timestamp?: boolean
```

**Default:** `false`

**Example:**
```typescript
const logger = new Logger({ timestamp: true })
logger.info('Message with timestamp')
// Output: [2025-01-15 14:30:25] Info: Message with timestamp

const loggerNoTime = new Logger({ timestamp: false })
loggerNoTime.info('Message without timestamp')
// Output: Info: Message without timestamp
```

### colorize

Enables or disables colored output for different log levels.

```typescript
colorize?: boolean
```

**Default:** `true` (automatically disabled in non-TTY environments)

**Example:**
```typescript
const coloredLogger = new Logger({ colorize: true })
coloredLogger.info('This will be colored')

const plainLogger = new Logger({ colorize: false })
plainLogger.info('This will be plain text')
```

**Color Scheme:**
- `debug`: Gray
- `info`: Blue
- `warn`: Yellow
- `error`: Red

### format

Specifies the output format for log messages.

```typescript
type LogFormat = 'pretty' | 'json' | 'compact' | 'custom'
```

**Default:** `'pretty'`

**Examples:**

**Pretty Format:**
```typescript
const logger = new Logger({ format: 'pretty' })
logger.info('User logged in', { userId: 123, ip: '192.168.1.1' })
// Output: Info: User logged in
//   userId: 123
//   ip: 192.168.1.1
```

**JSON Format:**
```typescript
const logger = new Logger({ format: 'json' })
logger.info('User logged in', { userId: 123, ip: '192.168.1.1' })
// Output: {"level":"info","message":"User logged in","data":{"userId":123,"ip":"192.168.1.1"},"timestamp":"2025-01-15T14:30:25.123Z"}
```

**Compact Format:**
```typescript
const logger = new Logger({ format: 'compact' })
logger.info('User logged in', { userId: 123 })
// Output: [INFO] User logged in {userId: 123}
```

### prefix

Adds a custom prefix to all log messages from this logger instance.

```typescript
prefix?: string
```

**Default:** `undefined`

**Example:**
```typescript
const apiLogger = new Logger({ prefix: '[API]' })
apiLogger.info('Request received')
// Output: [API] Info: Request received

const dbLogger = new Logger({ prefix: '[DATABASE]' })
dbLogger.error('Connection failed')
// Output: [DATABASE] Error: Connection failed
```

### output

Controls where log messages are sent.

```typescript
type LogOutput = 'console' | 'file' | 'stream' | LogOutputConfig

interface LogOutputConfig {
  type: 'console' | 'file' | 'stream'
  target?: string | NodeJS.WritableStream
  options?: OutputOptions
}

interface OutputOptions {
  encoding?: BufferEncoding
  flags?: string
  mode?: number
  autoClose?: boolean
  emitClose?: boolean
  fs?: any
}
```

**Default:** `'console'`

**Examples:**

**Console Output (default):**
```typescript
const logger = new Logger({ output: 'console' })
```

**File Output:**
```typescript
const logger = new Logger({ 
  output: {
    type: 'file',
    target: './logs/app.log'
  }
})
```

**Stream Output:**
```typescript
import fs from 'fs'

const logStream = fs.createWriteStream('./logs/custom.log')
const logger = new Logger({ 
  output: {
    type: 'stream',
    target: logStream
  }
})
```

## Advanced Configuration Options

### filters

Array of filter functions that determine whether a log message should be output.

```typescript
type LogFilter = (level: LogLevel, message: string, data?: any) => boolean
```

**Example:**
```typescript
const logger = new Logger({
  filters: [
    // Only log errors and warnings
    (level) => ['error', 'warn'].includes(level),
    
    // Don't log messages containing 'password'
    (level, message) => !message.toLowerCase().includes('password'),
    
    // Only log if user ID is present in data
    (level, message, data) => data && data.userId
  ]
})

logger.info('User login', { userId: 123 }) // Will be logged
logger.info('Password reset') // Will NOT be logged
logger.debug('Debug info', { userId: 123 }) // Will NOT be logged (level filter)
```

### transforms

Array of transform functions that modify log messages before output.

```typescript
type LogTransform = (level: LogLevel, message: string, data?: any) => {
  level?: LogLevel
  message?: string
  data?: any
}
```

**Example:**
```typescript
const logger = new Logger({
  transforms: [
    // Add timestamp to data
    (level, message, data = {}) => ({
      level,
      message,
      data: { ...data, processedAt: new Date().toISOString() }
    }),
    
    // Redact sensitive information
    (level, message, data) => ({
      level,
      message: message.replace(/password=\w+/gi, 'password=***'),
      data: data ? redactSensitiveData(data) : data
    }),
    
    // Convert debug messages to info in production
    (level, message, data) => ({
      level: process.env.NODE_ENV === 'production' && level === 'debug' ? 'info' : level,
      message,
      data
    })
  ]
})
```

### metadata

Global metadata that gets attached to all log messages from this logger instance.

```typescript
metadata?: Record<string, any>
```

**Example:**
```typescript
const logger = new Logger({
  metadata: {
    service: 'user-api',
    version: '1.2.3',
    environment: process.env.NODE_ENV,
    serverId: process.env.SERVER_ID
  }
})

logger.info('User created', { userId: 123 })
// Output includes: service, version, environment, serverId, and userId
```

### performance

Configuration options for performance monitoring and optimization.

```typescript
interface PerformanceOptions {
  measureTime?: boolean
  bufferSize?: number
  flushInterval?: number
  asyncLogging?: boolean
  sampling?: SamplingOptions
}

interface SamplingOptions {
  rate?: number // 0.0 to 1.0
  levels?: LogLevel[]
  condition?: (level: LogLevel, message: string, data?: any) => boolean
}
```

**Example:**
```typescript
const logger = new Logger({
  performance: {
    measureTime: true,        // Measure logging performance
    bufferSize: 100,          // Buffer up to 100 messages
    flushInterval: 1000,      // Flush buffer every 1 second
    asyncLogging: true,       // Use async logging
    sampling: {
      rate: 0.1,              // Sample 10% of logs
      levels: ['debug'],      // Only sample debug messages
      condition: (level, message, data) => {
        // Custom sampling logic
        return Math.random() < 0.5
      }
    }
  }
})
```

## Environment-Based Configuration

### Configuration from Environment Variables

```typescript
function createLoggerFromEnv(): Logger {
  return new Logger({
    level: (process.env.LOG_LEVEL as LogLevel) || 'info',
    timestamp: process.env.LOG_TIMESTAMP === 'true',
    colorize: process.env.LOG_COLORIZE !== 'false',
    format: (process.env.LOG_FORMAT as LogFormat) || 'pretty',
    prefix: process.env.LOG_PREFIX,
    output: process.env.LOG_OUTPUT === 'file' ? {
      type: 'file',
      target: process.env.LOG_FILE || './logs/app.log'
    } : 'console'
  })
}
```

### Configuration Profiles

```typescript
interface LoggerProfile {
  development: LoggerOptions
  production: LoggerOptions
  test: LoggerOptions
}

const profiles: LoggerProfile = {
  development: {
    level: 'debug',
    timestamp: true,
    colorize: true,
    format: 'pretty'
  },
  
  production: {
    level: 'info',
    timestamp: true,
    colorize: false,
    format: 'json',
    output: {
      type: 'file',
      target: './logs/production.log'
    },
    performance: {
      bufferSize: 1000,
      flushInterval: 5000,
      asyncLogging: true
    }
  },
  
  test: {
    level: 'error',
    timestamp: false,
    colorize: false,
    format: 'compact'
  }
}

function createProfiledLogger(): Logger {
  const profile = process.env.NODE_ENV as keyof LoggerProfile || 'development'
  return new Logger(profiles[profile])
}
```

## Configuration Validation

### Runtime Configuration Validation

```typescript
import Joi from 'joi'

const loggerConfigSchema = Joi.object({
  level: Joi.string().valid('debug', 'info', 'warn', 'error', 'silent'),
  timestamp: Joi.boolean(),
  colorize: Joi.boolean(),
  format: Joi.string().valid('pretty', 'json', 'compact', 'custom'),
  prefix: Joi.string(),
  output: Joi.alternatives().try(
    Joi.string().valid('console', 'file', 'stream'),
    Joi.object({
      type: Joi.string().valid('console', 'file', 'stream').required(),
      target: Joi.alternatives().try(Joi.string(), Joi.object()),
      options: Joi.object()
    })
  ),
  filters: Joi.array().items(Joi.function()),
  transforms: Joi.array().items(Joi.function()),
  metadata: Joi.object(),
  performance: Joi.object({
    measureTime: Joi.boolean(),
    bufferSize: Joi.number().min(1),
    flushInterval: Joi.number().min(100),
    asyncLogging: Joi.boolean(),
    sampling: Joi.object({
      rate: Joi.number().min(0).max(1),
      levels: Joi.array().items(Joi.string().valid('debug', 'info', 'warn', 'error')),
      condition: Joi.function()
    })
  })
})

function createValidatedLogger(config: LoggerOptions): Logger {
  const { error, value } = loggerConfigSchema.validate(config)
  
  if (error) {
    throw new Error(`Invalid logger configuration: ${error.message}`)
  }
  
  return new Logger(value)
}
```

## Dynamic Configuration

### Runtime Configuration Updates

```typescript
class ConfigurableLogger {
  private logger: Logger
  private config: LoggerOptions

  constructor(initialConfig: LoggerOptions) {
    this.config = { ...initialConfig }
    this.logger = new Logger(this.config)
  }

  updateConfig(newConfig: Partial<LoggerOptions>): void {
    this.config = { ...this.config, ...newConfig }
    this.logger = new Logger(this.config)
  }

  setLevel(level: LogLevel): void {
    this.updateConfig({ level })
  }

  setFormat(format: LogFormat): void {
    this.updateConfig({ format })
  }

  toggleColors(enabled: boolean): void {
    this.updateConfig({ colorize: enabled })
  }

  getConfig(): LoggerOptions {
    return { ...this.config }
  }

  // Delegate logger methods
  info(message: string, data?: any): void {
    this.logger.info(message, data)
  }

  error(message: string, data?: any): void {
    this.logger.error(message, data)
  }

  warn(message: string, data?: any): void {
    this.logger.warn(message, data)
  }

  debug(message: string, data?: any): void {
    this.logger.debug(message, data)
  }
}
```

## Configuration Examples

### Microservice Configuration

```typescript
const microserviceLogger = new Logger({
  level: 'info',
  timestamp: true,
  format: 'json',
  metadata: {
    service: process.env.SERVICE_NAME,
    version: process.env.SERVICE_VERSION,
    instance: process.env.INSTANCE_ID
  },
  transforms: [
    // Add correlation ID to all logs
    (level, message, data = {}) => ({
      level,
      message,
      data: {
        ...data,
        correlationId: getCurrentCorrelationId()
      }
    })
  ]
})
```

### Development Configuration

```typescript
const devLogger = new Logger({
  level: 'debug',
  timestamp: true,
  colorize: true,
  format: 'pretty',
  filters: [
    // Hide noisy debug messages from specific modules
    (level, message) => {
      if (level === 'debug' && message.includes('heartbeat')) {
        return false
      }
      return true
    }
  ]
})
```

### High-Performance Configuration

```typescript
const highPerfLogger = new Logger({
  level: 'warn',
  timestamp: false,
  colorize: false,
  format: 'compact',
  performance: {
    asyncLogging: true,
    bufferSize: 1000,
    flushInterval: 5000,
    sampling: {
      rate: 0.01, // Sample 1% of debug messages
      levels: ['debug']
    }
  }
})
```

This comprehensive configuration reference covers all aspects of customizing Plip Logger behavior to meet your specific logging requirements.
