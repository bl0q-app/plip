# Error Codes

Plip Logger uses a comprehensive error code system to help identify and troubleshoot issues. This reference provides detailed information about all error codes, their causes, and solutions.

## Error Code Format

Error codes follow the format: `PLIP_E{category}{number}`

- **Category**: 2-digit code representing error category
- **Number**: 3-digit sequential number

Example: `PLIP_E01001` (Configuration error #001)

## Error Categories

| Category | Code | Description |
|----------|------|-------------|
| Configuration | 01 | Configuration-related errors |
| File System | 02 | File operations and permissions |
| Network | 03 | Network and remote logging |
| Validation | 04 | Input validation errors |
| Performance | 05 | Performance and resource errors |
| Integration | 06 | Framework integration errors |
| Security | 07 | Security and access errors |
| Runtime | 08 | Runtime execution errors |

## Configuration Errors (01xxx)

### PLIP_E01001: Invalid Configuration File

**Cause:** Configuration file contains invalid JSON or YAML syntax.

```javascript
// Error example
{
  "code": "PLIP_E01001",
  "message": "Invalid configuration file: Unexpected token '}' at position 45",
  "file": "/app/.pliprc.json"
}
```

**Solutions:**
1. Validate JSON/YAML syntax
2. Check for trailing commas
3. Verify file encoding (UTF-8)

### PLIP_E01002: Unknown Configuration Option

**Cause:** Configuration contains unrecognized options.

```javascript
{
  "code": "PLIP_E01002",
  "message": "Unknown configuration option: 'invalidOption'",
  "option": "invalidOption",
  "suggestions": ["logLevel", "format", "outputs"]
}
```

**Solutions:**
1. Check configuration documentation
2. Use suggested alternatives
3. Remove unsupported options

### PLIP_E01003: Invalid Log Level

**Cause:** Log level value is not recognized.

```javascript
{
  "code": "PLIP_E01003",
  "message": "Invalid log level: 'verbose'",
  "provided": "verbose",
  "valid": ["debug", "info", "warn", "error", "trace"]
}
```

**Solutions:**
1. Use valid log level values
2. Check environment variables
3. Verify configuration file

### PLIP_E01004: Circular Configuration Reference

**Cause:** Configuration file references create a circular dependency.

```javascript
{
  "code": "PLIP_E01004",
  "message": "Circular reference detected in configuration",
  "path": "outputs.file.config.extends"
}
```

**Solutions:**
1. Remove circular references
2. Flatten configuration structure
3. Use absolute paths for extends

## File System Errors (02xxx)

### PLIP_E02001: Log File Permission Denied

**Cause:** Insufficient permissions to write to log file.

```javascript
{
  "code": "PLIP_E02001",
  "message": "Permission denied writing to log file",
  "file": "/var/log/app.log",
  "permissions": "r--r--r--"
}
```

**Solutions:**
1. Check file permissions: `chmod 644 /var/log/app.log`
2. Verify directory permissions
3. Run with appropriate user privileges

### PLIP_E02002: Log Directory Not Found

**Cause:** Target directory for log files doesn't exist.

```javascript
{
  "code": "PLIP_E02002",
  "message": "Log directory does not exist",
  "directory": "/var/log/myapp",
  "autoCreate": false
}
```

**Solutions:**
1. Create directory: `mkdir -p /var/log/myapp`
2. Enable auto-creation in configuration
3. Use existing directory path

### PLIP_E02003: Disk Space Insufficient

**Cause:** Not enough disk space for log files.

```javascript
{
  "code": "PLIP_E02003",
  "message": "Insufficient disk space for logging",
  "required": "100MB",
  "available": "50MB",
  "path": "/var/log"
}
```

**Solutions:**
1. Free up disk space
2. Configure log rotation
3. Reduce log retention period

### PLIP_E02004: Log File Rotation Failed

**Cause:** Error during log file rotation process.

```javascript
{
  "code": "PLIP_E02004",
  "message": "Log rotation failed",
  "file": "/var/log/app.log.1",
  "reason": "File in use by another process"
}
```

**Solutions:**
1. Check file locks
2. Verify rotation configuration
3. Restart application if necessary

## Network Errors (03xxx)

### PLIP_E03001: Remote Log Server Unreachable

**Cause:** Cannot connect to remote logging server.

```javascript
{
  "code": "PLIP_E03001",
  "message": "Remote log server unreachable",
  "server": "logs.example.com:514",
  "timeout": 5000
}
```

**Solutions:**
1. Check network connectivity
2. Verify server address and port
3. Check firewall settings

### PLIP_E03002: Authentication Failed

**Cause:** Authentication to remote log server failed.

```javascript
{
  "code": "PLIP_E03002",
  "message": "Authentication failed for remote logging",
  "server": "logs.example.com",
  "method": "API_KEY"
}
```

**Solutions:**
1. Verify API key/credentials
2. Check authentication method
3. Ensure credentials are not expired

### PLIP_E03003: Rate Limit Exceeded

**Cause:** Too many log messages sent to remote server.

```javascript
{
  "code": "PLIP_E03003",
  "message": "Rate limit exceeded for remote logging",
  "limit": "1000/hour",
  "current": 1500
}
```

**Solutions:**
1. Implement local buffering
2. Reduce log frequency
3. Upgrade service plan

## Validation Errors (04xxx)

### PLIP_E04001: Invalid Log Message Format

**Cause:** Log message doesn't match expected format.

```javascript
{
  "code": "PLIP_E04001",
  "message": "Invalid log message format",
  "expected": "string|object",
  "received": "function"
}
```

**Solutions:**
1. Use string or object messages
2. Serialize complex objects
3. Check message transformation

### PLIP_E04002: Message Size Exceeded

**Cause:** Log message exceeds maximum size limit.

```javascript
{
  "code": "PLIP_E04002",
  "message": "Log message size exceeded",
  "size": "1.5MB",
  "limit": "1MB"
}
```

**Solutions:**
1. Reduce message size
2. Increase size limit
3. Split large messages

### PLIP_E04003: Invalid Metadata

**Cause:** Log metadata contains invalid values.

```javascript
{
  "code": "PLIP_E04003",
  "message": "Invalid metadata in log message",
  "field": "timestamp",
  "value": "invalid-date"
}
```

**Solutions:**
1. Validate metadata before logging
2. Use proper data types
3. Implement metadata sanitization

## Performance Errors (05xxx)

### PLIP_E05001: Memory Limit Exceeded

**Cause:** Logger memory usage exceeds configured limits.

```javascript
{
  "code": "PLIP_E05001",
  "message": "Memory limit exceeded",
  "used": "512MB",
  "limit": "256MB"
}
```

**Solutions:**
1. Increase memory limit
2. Enable log streaming
3. Reduce buffer size

### PLIP_E05002: Buffer Overflow

**Cause:** Log buffer is full and cannot accept new messages.

```javascript
{
  "code": "PLIP_E05002",
  "message": "Log buffer overflow",
  "bufferSize": 10000,
  "droppedMessages": 150
}
```

**Solutions:**
1. Increase buffer size
2. Reduce log frequency
3. Improve processing speed

### PLIP_E05003: Processing Timeout

**Cause:** Log processing takes too long.

```javascript
{
  "code": "PLIP_E05003",
  "message": "Log processing timeout",
  "timeout": 30000,
  "elapsed": 45000
}
```

**Solutions:**
1. Increase timeout value
2. Optimize log formatters
3. Use asynchronous processing

## Integration Errors (06xxx)

### PLIP_E06001: Framework Not Supported

**Cause:** Attempting to use unsupported framework integration.

```javascript
{
  "code": "PLIP_E06001",
  "message": "Framework not supported",
  "framework": "koa",
  "supported": ["express", "fastify", "nextjs", "nestjs"]
}
```

**Solutions:**
1. Use supported frameworks
2. Implement custom integration
3. Use generic logger instance

### PLIP_E06002: Middleware Registration Failed

**Cause:** Cannot register logging middleware.

```javascript
{
  "code": "PLIP_E06002",
  "message": "Middleware registration failed",
  "framework": "express",
  "reason": "App already listening"
}
```

**Solutions:**
1. Register middleware before server start
2. Check middleware order
3. Verify framework compatibility

### PLIP_E06003: Plugin Conflict

**Cause:** Conflicting plugins or middleware.

```javascript
{
  "code": "PLIP_E06003",
  "message": "Plugin conflict detected",
  "conflicting": ["plip-logger", "winston-express"],
  "solution": "Use only one logging middleware"
}
```

**Solutions:**
1. Remove conflicting plugins
2. Use single logging solution
3. Configure plugin priority

## Security Errors (07xxx)

### PLIP_E07001: Sensitive Data Exposure

**Cause:** Sensitive data detected in log messages.

```javascript
{
  "code": "PLIP_E07001",
  "message": "Sensitive data detected in log",
  "field": "password",
  "action": "redacted"
}
```

**Solutions:**
1. Configure data redaction
2. Sanitize input data
3. Review logging practices

### PLIP_E07002: Unauthorized Access

**Cause:** Attempt to access restricted logging features.

```javascript
{
  "code": "PLIP_E07002",
  "message": "Unauthorized access to logging configuration",
  "user": "guest",
  "required": "admin"
}
```

**Solutions:**
1. Check user permissions
2. Authenticate properly
3. Use appropriate access controls

## Runtime Errors (08xxx)

### PLIP_E08001: Logger Not Initialized

**Cause:** Attempting to use logger before initialization.

```javascript
{
  "code": "PLIP_E08001",
  "message": "Logger not initialized",
  "method": "info"
}
```

**Solutions:**
1. Initialize logger before use
2. Check initialization sequence
3. Use singleton pattern

### PLIP_E08002: Resource Cleanup Failed

**Cause:** Error during logger shutdown or cleanup.

```javascript
{
  "code": "PLIP_E08002",
  "message": "Resource cleanup failed",
  "resource": "file-stream",
  "reason": "Stream already closed"
}
```

**Solutions:**
1. Proper shutdown sequence
2. Check resource state
3. Handle cleanup errors gracefully

## Error Handling Patterns

### Graceful Degradation

```javascript
try {
  logger.info('Application started');
} catch (error) {
  if (error.code?.startsWith('PLIP_E')) {
    // Handle Plip Logger specific errors
    console.error('Logging error:', error.message);
    // Fall back to console logging
  }
  throw error;
}
```

### Error Recovery

```javascript
logger.on('error', (error) => {
  switch (error.code) {
    case 'PLIP_E02001': // Permission denied
      // Switch to console logging
      logger.addOutput('console');
      break;
    
    case 'PLIP_E03001': // Remote server unreachable
      // Enable local file logging
      logger.addOutput('file', { path: './fallback.log' });
      break;
    
    default:
      console.error('Unhandled logging error:', error);
  }
});
```

### Error Monitoring

```javascript
const errorCounts = new Map();

logger.on('error', (error) => {
  const count = errorCounts.get(error.code) || 0;
  errorCounts.set(error.code, count + 1);
  
  if (count > 10) {
    // Alert on repeated errors
    console.error(`Repeated error ${error.code}: ${count} occurrences`);
  }
});
```

## Debugging Error Codes

### Enable Debug Mode

```bash
export PLIP_LOG_LEVEL=debug
export PLIP_DEBUG_ERRORS=true
```

### Error Tracing

```javascript
const logger = new Logger({
  debug: true,
  errorTracing: true
});

// Will include stack traces for all errors
logger.on('error', (error) => {
  console.error('Error details:', {
    code: error.code,
    message: error.message,
    stack: error.stack,
    context: error.context
  });
});
```

This comprehensive error code reference helps you quickly identify, understand, and resolve issues with Plip Logger in any environment or integration scenario.
