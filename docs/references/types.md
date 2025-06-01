# TypeScript Types Reference

This reference covers all TypeScript types, interfaces, and type definitions used in Plip Logger.

## Core Types

### LogLevel

Defines the severity levels for log messages.

```typescript
type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'silent'
```

**Usage:**
```typescript
const level: LogLevel = 'info'
const logger = new Logger({ level })
```

### LogFormat

Specifies the output format for log messages.

```typescript
type LogFormat = 'pretty' | 'json' | 'compact' | 'custom'
```

**Usage:**
```typescript
const format: LogFormat = 'json'
const logger = new Logger({ format })
```

### LogOutput

Defines where log messages should be output.

```typescript
type LogOutput = 'console' | 'file' | 'stream' | LogOutputConfig
```

## Core Interfaces

### LoggerOptions

Main configuration interface for creating Logger instances.

```typescript
interface LoggerOptions {
  /**
   * Minimum log level to output
   * @default 'info'
   */
  level?: LogLevel
  
  /**
   * Whether to include timestamps in log messages
   * @default false
   */
  timestamp?: boolean
  
  /**
   * Whether to colorize output (auto-disabled in non-TTY environments)
   * @default true
   */
  colorize?: boolean
  
  /**
   * Output format for log messages
   * @default 'pretty'
   */
  format?: LogFormat
  
  /**
   * Prefix to add to all log messages
   */
  prefix?: string
  
  /**
   * Output destination configuration
   * @default 'console'
   */
  output?: LogOutput
  
  /**
   * Array of filter functions to determine if messages should be logged
   */
  filters?: LogFilter[]
  
  /**
   * Array of transform functions to modify messages before output
   */
  transforms?: LogTransform[]
  
  /**
   * Global metadata to attach to all log messages
   */
  metadata?: Record<string, any>
  
  /**
   * Performance optimization options
   */
  performance?: PerformanceOptions
}
```

### LogEntry

Represents a single log entry with all its data.

```typescript
interface LogEntry {
  /**
   * Log level of the entry
   */
  level: LogLevel
  
  /**
   * Main log message
   */
  message: string
  
  /**
   * Additional data associated with the log entry
   */
  data?: Record<string, any>
  
  /**
   * Timestamp when the log entry was created
   */
  timestamp: Date
  
  /**
   * Optional prefix for the log entry
   */
  prefix?: string
  
  /**
   * Metadata attached to the log entry
   */
  metadata?: Record<string, any>
}
```

### LogOutputConfig

Configuration for custom log outputs.

```typescript
interface LogOutputConfig {
  /**
   * Type of output destination
   */
  type: 'console' | 'file' | 'stream'
  
  /**
   * Target for the output (file path or stream)
   */
  target?: string | NodeJS.WritableStream
  
  /**
   * Additional options for the output
   */
  options?: OutputOptions
}
```

### OutputOptions

Options for file and stream outputs.

```typescript
interface OutputOptions {
  /**
   * Character encoding for file output
   * @default 'utf8'
   */
  encoding?: BufferEncoding
  
  /**
   * File system flags for file output
   * @default 'a'
   */
  flags?: string
  
  /**
   * File mode for file output
   * @default 0o666
   */
  mode?: number
  
  /**
   * Whether to automatically close the file descriptor
   * @default true
   */
  autoClose?: boolean
  
  /**
   * Whether to emit the 'close' event
   * @default true
   */
  emitClose?: boolean
  
  /**
   * Custom file system implementation
   */
  fs?: any
}
```

## Function Types

### LogFilter

Function type for filtering log messages.

```typescript
type LogFilter = (
  level: LogLevel,
  message: string,
  data?: Record<string, any>
) => boolean
```

**Example:**
```typescript
const errorOnlyFilter: LogFilter = (level) => level === 'error'
const noPasswordFilter: LogFilter = (level, message) => 
  !message.toLowerCase().includes('password')
```

### LogTransform

Function type for transforming log messages before output.

```typescript
type LogTransform = (
  level: LogLevel,
  message: string,
  data?: Record<string, any>
) => {
  level?: LogLevel
  message?: string
  data?: Record<string, any>
}
```

**Example:**
```typescript
const addTimestampTransform: LogTransform = (level, message, data = {}) => ({
  level,
  message,
  data: { ...data, processedAt: new Date().toISOString() }
})
```

### LogFormatter

Function type for custom log formatting.

```typescript
type LogFormatter = (entry: LogEntry) => string
```

**Example:**
```typescript
const customFormatter: LogFormatter = (entry) => {
  const timestamp = entry.timestamp.toISOString()
  const level = entry.level.toUpperCase()
  const prefix = entry.prefix ? `[${entry.prefix}] ` : ''
  const data = entry.data ? ` ${JSON.stringify(entry.data)}` : ''
  
  return `${timestamp} ${level}: ${prefix}${entry.message}${data}`
}
```

## Performance Types

### PerformanceOptions

Configuration options for performance optimization.

```typescript
interface PerformanceOptions {
  /**
   * Whether to measure and report logging performance
   * @default false
   */
  measureTime?: boolean
  
  /**
   * Size of the internal buffer for batching logs
   * @default 100
   */
  bufferSize?: number
  
  /**
   * Interval in milliseconds to flush the buffer
   * @default 1000
   */
  flushInterval?: number
  
  /**
   * Whether to use asynchronous logging
   * @default false
   */
  asyncLogging?: boolean
  
  /**
   * Sampling configuration for reducing log volume
   */
  sampling?: SamplingOptions
}
```

### SamplingOptions

Configuration for log sampling to reduce volume.

```typescript
interface SamplingOptions {
  /**
   * Sampling rate (0.0 to 1.0)
   * @default 1.0
   */
  rate?: number
  
  /**
   * Log levels to apply sampling to
   * @default all levels
   */
  levels?: LogLevel[]
  
  /**
   * Custom condition function for sampling
   */
  condition?: (level: LogLevel, message: string, data?: any) => boolean
}
```

### PerformanceMetrics

Metrics collected when performance measurement is enabled.

```typescript
interface PerformanceMetrics {
  /**
   * Total number of log entries processed
   */
  totalLogs: number
  
  /**
   * Number of logs by level
   */
  logsByLevel: Record<LogLevel, number>
  
  /**
   * Average time spent logging (in milliseconds)
   */
  averageLogTime: number
  
  /**
   * Total time spent logging (in milliseconds)
   */
  totalLogTime: number
  
  /**
   * Number of logs that were filtered out
   */
  filteredLogs: number
  
  /**
   * Number of logs that were sampled out
   */
  sampledLogs: number
  
  /**
   * Buffer statistics
   */
  buffer: BufferMetrics
}
```

### BufferMetrics

Metrics about the internal log buffer.

```typescript
interface BufferMetrics {
  /**
   * Current buffer size
   */
  currentSize: number
  
  /**
   * Maximum buffer size reached
   */
  maxSize: number
  
  /**
   * Number of buffer flushes
   */
  flushCount: number
  
  /**
   * Number of buffer overflows
   */
  overflowCount: number
}
```

## Event Types

### LoggerEvents

Events emitted by the Logger instance.

```typescript
interface LoggerEvents {
  /**
   * Emitted when a log entry is created
   */
  'log': (entry: LogEntry) => void
  
  /**
   * Emitted when an error occurs during logging
   */
  'error': (error: Error) => void
  
  /**
   * Emitted when the buffer is flushed
   */
  'flush': (count: number) => void
  
  /**
   * Emitted when performance metrics are updated
   */
  'metrics': (metrics: PerformanceMetrics) => void
}
```

## Utility Types

### LogData

Type for the data parameter in log methods.

```typescript
type LogData = Record<string, any> | undefined
```

### LogMethod

Type signature for log methods (info, error, warn, debug).

```typescript
type LogMethod = (message: string, data?: LogData) => void
```

### AsyncLogMethod

Type signature for asynchronous log methods.

```typescript
type AsyncLogMethod = (message: string, data?: LogData) => Promise<void>
```

### LogLevelValue

Numeric values for log levels (for comparison).

```typescript
type LogLevelValue = {
  readonly debug: 0
  readonly info: 1
  readonly warn: 2
  readonly error: 3
  readonly silent: 4
}
```

## Advanced Types

### ConditionalLoggerOptions

Conditional options based on environment or other factors.

```typescript
type ConditionalLoggerOptions<T extends string> = T extends 'production'
  ? Required<Pick<LoggerOptions, 'level' | 'format'>> & LoggerOptions
  : LoggerOptions
```

**Usage:**
```typescript
function createLogger<T extends string>(
  env: T,
  options: ConditionalLoggerOptions<T>
): Logger {
  return new Logger(options)
}

// In production, level and format are required
const prodLogger = createLogger('production', {
  level: 'info',     // Required
  format: 'json',    // Required
  timestamp: true    // Optional
})

// In development, all options are optional
const devLogger = createLogger('development', {
  timestamp: true    // All optional
})
```

### LoggerFactory

Type for logger factory functions.

```typescript
type LoggerFactory<T = any> = (config?: T) => Logger
```

### LoggerMiddleware

Type for middleware functions that can intercept and modify log entries.

```typescript
type LoggerMiddleware = (
  entry: LogEntry,
  next: (modifiedEntry?: LogEntry) => void
) => void
```

### TypedLogger

Generic logger interface with typed data.

```typescript
interface TypedLogger<TData = any> {
  info(message: string, data?: TData): void
  error(message: string, data?: TData): void
  warn(message: string, data?: TData): void
  debug(message: string, data?: TData): void
}
```

**Usage:**
```typescript
interface UserLogData {
  userId: number
  email: string
  action: string
}

const userLogger: TypedLogger<UserLogData> = new Logger()

userLogger.info('User action', {
  userId: 123,
  email: 'user@example.com',
  action: 'login'
})
```

## Type Guards

### isLogLevel

Type guard to check if a string is a valid log level.

```typescript
function isLogLevel(value: string): value is LogLevel {
  return ['debug', 'info', 'warn', 'error', 'silent'].includes(value)
}
```

### isLogFormat

Type guard to check if a string is a valid log format.

```typescript
function isLogFormat(value: string): value is LogFormat {
  return ['pretty', 'json', 'compact', 'custom'].includes(value)
}
```

### isLogEntry

Type guard to check if an object is a valid log entry.

```typescript
function isLogEntry(value: any): value is LogEntry {
  return (
    typeof value === 'object' &&
    value !== null &&
    isLogLevel(value.level) &&
    typeof value.message === 'string' &&
    value.timestamp instanceof Date
  )
}
```

## Module Augmentation

### Extending Logger with Custom Methods

```typescript
declare module '@ru-dr/plip' {
  interface Logger {
    /**
     * Custom success log method
     */
    success(message: string, data?: LogData): void
    
    /**
     * Custom critical log method
     */
    critical(message: string, data?: LogData): void
    
    /**
     * Log with custom level
     */
    log(level: LogLevel, message: string, data?: LogData): void
  }
}
```

### Adding Custom Configuration Options

```typescript
declare module '@ru-dr/plip' {
  interface LoggerOptions {
    /**
     * Custom environment-specific settings
     */
    environment?: {
      development?: Partial<LoggerOptions>
      production?: Partial<LoggerOptions>
      test?: Partial<LoggerOptions>
    }
    
    /**
     * Custom notification settings
     */
    notifications?: {
      email?: boolean
      slack?: boolean
      webhook?: string
    }
  }
}
```

## Example Usage

### Complete Type-Safe Logger Configuration

```typescript
import { Logger, LoggerOptions, LogLevel, LogFormat } from '@ru-dr/plip'

interface AppConfig {
  logLevel: LogLevel
  logFormat: LogFormat
  enableTimestamp: boolean
}

function createAppLogger(config: AppConfig): Logger {
  const options: LoggerOptions = {
    level: config.logLevel,
    format: config.logFormat,
    timestamp: config.enableTimestamp,
    metadata: {
      app: 'my-app',
      version: '1.0.0'
    }
  }
  
  return new Logger(options)
}

// Type-safe usage
const logger = createAppLogger({
  logLevel: 'info',        // TypeScript ensures this is a valid LogLevel
  logFormat: 'json',       // TypeScript ensures this is a valid LogFormat
  enableTimestamp: true
})
```

This comprehensive type reference ensures you have full type safety and IntelliSense support when using Plip Logger in TypeScript projects.
