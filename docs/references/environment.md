# Environment Variables

Plip Logger responds to several standard environment variables that affect color output and terminal behavior. Plip does not have custom environment variables for configuration - instead, use the configuration options when creating a logger instance.

## Color Control Variables

Plip Logger automatically detects and respects standard color environment variables:

### NO_COLOR

Disables all color output when set (any value).

```bash
NO_COLOR=1 node app.js
```

**Effect:** Forces all logger output to be plain text without colors, regardless of other settings.

### FORCE_COLOR

Forces color output even when not connected to a TTY.

```bash
FORCE_COLOR=1 node app.js
```

**Values:**
- `0` - Force disable colors
- `1` - Force enable colors  
- `2` - Force enable colors with 256-color support
- `3` - Force enable colors with 16m-color support

### TERM

Terminal type identifier used for color capability detection.

```bash
TERM=xterm-256color
```

**Common values:**
- `dumb` - No color support
- `xterm` - Basic color support
- `xterm-256color` - 256-color support
- `screen` - Screen/tmux support

## Development Environment Variables

### NODE_ENV

Affects default behavior in some cases.

```bash
NODE_ENV=production
```

**Effect:** When set to `production`, some terminal features may behave differently for performance.

### CI

Indicates running in a Continuous Integration environment.

```bash
CI=true
```

**Effect:** May affect color output and terminal detection in CI environments.

### TERM_PROGRAM

Identifies the terminal program being used.

```bash
TERM_PROGRAM=iTerm.app
```

**Common values:**
- `iTerm.app` - iTerm2
- `Terminal.app` - macOS Terminal
- `vscode` - VS Code integrated terminal

## Configuration via Code

Since Plip doesn't use custom environment variables, configure the logger programmatically:

```javascript
import { logger } from 'plip';

// Configure colors based on environment
const isProduction = process.env.NODE_ENV === 'production';
const disableColors = process.env.NO_COLOR || isProduction;

logger.config({
  enableColors: !disableColors,
  enableEmojis: !isProduction,
  silent: process.env.NODE_ENV === 'test'
});
```

## Environment-Specific Setup

### Development

```javascript
// config/development.js
import { logger } from 'plip';

logger.config({
  enableColors: true,
  enableEmojis: true,
  enableSyntaxHighlighting: true,
  enabledLevels: ['verbose', 'debug', 'info', 'success', 'warn', 'error', 'trace']
});
```

### Production

```javascript
// config/production.js
import { logger } from 'plip';

logger.config({
  enableColors: false,
  enableEmojis: false,
  enableSyntaxHighlighting: false,
  enabledLevels: ['info', 'success', 'warn', 'error']
});
```

### Testing

```javascript
// config/test.js
import { logger } from 'plip';

logger.config({
  silent: true // Disable all logging during tests
});
```

## Docker and Container Environments

### Docker Compose

```yaml
# docker-compose.yml
version: '3.8'
services:
  app:
    environment:
      - NODE_ENV=production
      - NO_COLOR=1  # Disable colors in containers
      - TERM=dumb   # Indicate simple terminal
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
        - name: NODE_ENV
          value: "production"
        - name: NO_COLOR
          value: "1"
```

## Best Practices

### 1. Respect Standard Variables

Always check for standard environment variables:

```javascript
import { logger } from 'plip';

const shouldUseColors = !process.env.NO_COLOR && 
                       (process.env.FORCE_COLOR || process.stdout.isTTY);

logger.config({
  enableColors: shouldUseColors
});
```

### 2. Environment Detection

```javascript
const isDevelopment = process.env.NODE_ENV === 'development';
const isTest = process.env.NODE_ENV === 'test';
const isCI = !!process.env.CI;

logger.config({
  silent: isTest,
  enableColors: isDevelopment && !isCI,
  enableEmojis: isDevelopment
});
```

### 3. Graceful Degradation

```javascript
// Detect terminal capabilities
const hasColorSupport = process.env.TERM !== 'dumb' && 
                       !process.env.NO_COLOR;

logger.config({
  enableColors: hasColorSupport,
  enableSyntaxHighlighting: hasColorSupport
});
```

This approach ensures Plip Logger works well across different environments while respecting standard terminal and color conventions.
