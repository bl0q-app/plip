# Environment Variables

Plip Logger supports various environment variables for configuration, allowing you to adjust logging behavior without code changes across different environments.

## Core Environment Variables

### PLIP_LOG_LEVEL

Controls the minimum log level that will be output.

```bash
PLIP_LOG_LEVEL=info
```

**Values:**
- `debug` (0) - Show all logs
- `info` (1) - Show info, warn, error, fatal
- `warn` (2) - Show warn, error, fatal
- `error` (3) - Show error, fatal
- `fatal` (4) - Show only fatal logs

**Default:** `info`

### PLIP_LOG_FORMAT

Specifies the output format for log messages.

```bash
PLIP_LOG_FORMAT=json
```

**Values:**
- `pretty` - Human-readable colored output
- `json` - Structured JSON output
- `simple` - Plain text output

**Default:** `pretty` (development), `json` (production)

### PLIP_LOG_FILE

Path to the log file for file output.

```bash
PLIP_LOG_FILE=/var/log/app.log
```

**Default:** `undefined` (console only)

### PLIP_LOG_MAX_SIZE

Maximum size of log files before rotation (requires file logging).

```bash
PLIP_LOG_MAX_SIZE=10MB
```

**Values:**
- Size with units: `10MB`, `1GB`, `500KB`
- Bytes: `10485760`

**Default:** `10MB`

### PLIP_LOG_MAX_FILES

Maximum number of rotated log files to keep.

```bash
PLIP_LOG_MAX_FILES=5
```

**Default:** `5`

## Advanced Environment Variables

### PLIP_LOG_TIMESTAMP

Controls timestamp format in log messages.

```bash
PLIP_LOG_TIMESTAMP=iso
```

**Values:**
- `iso` - ISO 8601 format (2024-01-15T10:30:45.123Z)
- `epoch` - Unix timestamp (1705315845123)
- `relative` - Relative time from start
- `false` - No timestamps

**Default:** `iso`

### PLIP_LOG_COLORS

Enable or disable colored output (pretty format only).

```bash
PLIP_LOG_COLORS=false
```

**Values:**
- `true` - Enable colors
- `false` - Disable colors
- `auto` - Auto-detect based on terminal support

**Default:** `auto`

### PLIP_LOG_REDACT

Comma-separated list of fields to redact in logs.

```bash
PLIP_LOG_REDACT=password,token,secret,key
```

**Default:** `password,token,secret,key,authorization`

### PLIP_LOG_INCLUDE_STACK

Include stack traces in error logs.

```bash
PLIP_LOG_INCLUDE_STACK=true
```

**Default:** `true`

### PLIP_LOG_BUFFER_SIZE

Buffer size for batched logging (performance optimization).

```bash
PLIP_LOG_BUFFER_SIZE=1000
```

**Default:** `100`

### PLIP_LOG_FLUSH_INTERVAL

Interval (ms) for flushing buffered logs.

```bash
PLIP_LOG_FLUSH_INTERVAL=5000
```

**Default:** `1000`

## Framework-Specific Variables

### Express.js

```bash
PLIP_EXPRESS_LOG_REQUESTS=true
PLIP_EXPRESS_LOG_RESPONSES=false
PLIP_EXPRESS_LOG_ERRORS=true
```

### Fastify

```bash
PLIP_FASTIFY_LOG_REQUESTS=true
PLIP_FASTIFY_SERIALIZERS=true
```

### Next.js

```bash
PLIP_NEXTJS_LOG_API=true
PLIP_NEXTJS_LOG_SSR=false
PLIP_NEXTJS_LOG_STATIC=false
```

## Environment-Specific Configurations

### Development

```bash
# .env.development
PLIP_LOG_LEVEL=debug
PLIP_LOG_FORMAT=pretty
PLIP_LOG_COLORS=true
PLIP_LOG_INCLUDE_STACK=true
```

### Production

```bash
# .env.production
PLIP_LOG_LEVEL=info
PLIP_LOG_FORMAT=json
PLIP_LOG_FILE=/var/log/app.log
PLIP_LOG_COLORS=false
PLIP_LOG_MAX_SIZE=50MB
PLIP_LOG_MAX_FILES=10
```

### Testing

```bash
# .env.test
PLIP_LOG_LEVEL=error
PLIP_LOG_FORMAT=simple
PLIP_LOG_COLORS=false
```

## Docker Environment Variables

### Docker Compose

```yaml
# docker-compose.yml
version: '3.8'
services:
  app:
    environment:
      - PLIP_LOG_LEVEL=info
      - PLIP_LOG_FORMAT=json
      - PLIP_LOG_COLORS=false
      - PLIP_LOG_FILE=/app/logs/app.log
    volumes:
      - ./logs:/app/logs
```

### Kubernetes

```yaml
# k8s-deployment.yaml
apiVersion: apps/v1
kind: Deployment
spec:
  template:
    spec:
      containers:
      - name: app
        env:
        - name: PLIP_LOG_LEVEL
          value: "info"
        - name: PLIP_LOG_FORMAT
          value: "json"
        - name: PLIP_LOG_COLORS
          value: "false"
```

## Configuration Priority

Environment variables override configuration file settings:

1. **Environment Variables** (highest priority)
2. **Configuration File** (`.pliprc.json`)
3. **Constructor Options**
4. **Default Values** (lowest priority)

## Validation and Error Handling

Invalid environment variable values will:

1. Log a warning message
2. Fall back to default values
3. Continue execution (fail-safe behavior)

### Example Error Messages

```bash
# Invalid log level
WARN: Invalid PLIP_LOG_LEVEL value 'invalid'. Using default 'info'.

# Invalid file size
WARN: Invalid PLIP_LOG_MAX_SIZE value 'invalid'. Using default '10MB'.

# Invalid boolean
WARN: Invalid PLIP_LOG_COLORS value 'maybe'. Using default 'auto'.
```

## Runtime Configuration Changes

Some environment variables can be changed at runtime:

```javascript
// Change log level at runtime
process.env.PLIP_LOG_LEVEL = 'debug';
logger.reloadConfig();

// Monitor environment changes
logger.on('configChanged', (config) => {
  console.log('Configuration updated:', config);
});
```

## Environment Variable Tools

### dotenv Integration

```javascript
// Load environment variables from .env file
require('dotenv').config();
const { Logger } = require('plip-logger');

const logger = new Logger(); // Uses env vars automatically
```

### Configuration Validation

```javascript
const { validateEnvConfig } = require('plip-logger/utils');

// Validate current environment configuration
const validation = validateEnvConfig();
if (!validation.valid) {
  console.error('Invalid environment configuration:', validation.errors);
}
```

## Best Practices

### 1. Use Environment-Specific Files

```bash
.env.development
.env.production
.env.staging
.env.test
```

### 2. Document Required Variables

```bash
# .env.example
PLIP_LOG_LEVEL=info
PLIP_LOG_FORMAT=json
PLIP_LOG_FILE=/var/log/app.log
# Add your required variables here
```

### 3. Validate on Startup

```javascript
const requiredVars = ['PLIP_LOG_LEVEL', 'PLIP_LOG_FORMAT'];
const missing = requiredVars.filter(v => !process.env[v]);

if (missing.length > 0) {
  console.error('Missing required environment variables:', missing);
  process.exit(1);
}
```

### 4. Secure Sensitive Variables

```bash
# Use secrets management for sensitive values
PLIP_LOG_REDACT="${SENSITIVE_FIELDS:-password,token,secret}"
```

This comprehensive environment variable reference ensures you can configure Plip Logger appropriately for any deployment scenario while maintaining security and performance best practices.
