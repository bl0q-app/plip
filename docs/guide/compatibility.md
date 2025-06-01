# Compatibility

Learn about Plip's compatibility with different environments, terminals, and platforms.

## Node.js Compatibility

### Supported Versions

| Node.js Version | Status | Notes |
|----------------|--------|-------|
| 21.x | ✅ Fully Supported | Latest features available |
| 20.x | ✅ Fully Supported | LTS - Recommended |
| 18.x | ✅ Fully Supported | LTS - Recommended |
| 16.x | ✅ Supported | Minimum required version |
| 14.x | ❌ Not Supported | EOL - Please upgrade |
| 12.x | ❌ Not Supported | EOL - Please upgrade |

### ES Module Support

Plip fully supports both ES modules and CommonJS:

```typescript
// ✅ ES Modules (Recommended)
import { plip } from '@ru-dr/plip';

// ✅ CommonJS
const { plip } = require('@ru-dr/plip');
```

## Terminal Compatibility

### Color Support Detection

Plip automatically detects terminal color capabilities:

| Terminal | 256 Colors | True Color | Auto-Detection |
|----------|------------|------------|----------------|
| VS Code Terminal | ✅ | ✅ | ✅ |
| Windows Terminal | ✅ | ✅ | ✅ |
| iTerm2 | ✅ | ✅ | ✅ |
| Hyper | ✅ | ✅ | ✅ |
| GNOME Terminal | ✅ | ✅ | ✅ |
| Terminal.app | ✅ | ✅ | ✅ |
| Alacritty | ✅ | ✅ | ✅ |
| Windows CMD | ⚠️ Limited | ❌ | ✅ |
| Git Bash | ✅ | ⚠️ Limited | ✅ |

### Manual Color Control

Override automatic detection when needed:

```typescript
// Force colors on
plip.configure({ colors: true });

// Force colors off
plip.configure({ colors: false });

// Auto-detect (default)
plip.configure({ colors: 'auto' });
```

## Platform Support

### Operating Systems

| Platform | Status | Notes |
|----------|--------|-------|
| Linux | ✅ Fully Supported | All distributions |
| macOS | ✅ Fully Supported | All versions |
| Windows 10+ | ✅ Fully Supported | With Windows Terminal |
| Windows 8.1 | ⚠️ Limited Colors | Basic color support |
| Docker | ✅ Fully Supported | Alpine, Ubuntu, etc. |

### Environment Variables

Plip respects standard environment variables:

```bash
# Force color output
FORCE_COLOR=1 node app.js

# Disable color output
NO_COLOR=1 node app.js

# Set color level (0-3)
FORCE_COLOR=3 node app.js

# Control TTY detection
CI=true node app.js
```

## Runtime Environments

### Cloud Platforms

| Platform | Colors | Emojis | Notes |
|----------|--------|--------|-------|
| AWS Lambda | ⚠️ Limited | ✅ | CloudWatch logs |
| Google Cloud Functions | ⚠️ Limited | ✅ | Stackdriver logs |
| Azure Functions | ⚠️ Limited | ✅ | Application Insights |
| Vercel | ❌ | ✅ | Text logs only |
| Netlify | ❌ | ✅ | Text logs only |
| Railway | ✅ | ✅ | Full support |
| Render | ✅ | ✅ | Full support |

### Container Environments

```dockerfile
# Dockerfile example with color support
FROM node:20-alpine

# Enable color output in containers
ENV FORCE_COLOR=1

COPY . .
RUN npm install

CMD ["node", "app.js"]
```

### CI/CD Environments

| CI/CD Platform | Colors | Detection | Configuration |
|----------------|--------|-----------|---------------|
| GitHub Actions | ✅ | ✅ | Automatic |
| GitLab CI | ✅ | ✅ | Automatic |
| CircleCI | ✅ | ✅ | Automatic |
| Travis CI | ✅ | ✅ | Automatic |
| Jenkins | ⚠️ Varies | ⚠️ Manual | Set FORCE_COLOR=1 |
| Azure DevOps | ✅ | ✅ | Automatic |

```yaml
# GitHub Actions example
- name: Run tests with colors
  run: npm test
  env:
    FORCE_COLOR: 1
```

## TypeScript Compatibility

### Supported Versions

| TypeScript Version | Status | Notes |
|-------------------|--------|-------|
| 5.3+ | ✅ Fully Supported | Latest features |
| 5.0-5.2 | ✅ Fully Supported | Recommended |
| 4.5-4.9 | ✅ Supported | Minimum required |
| 4.0-4.4 | ⚠️ Limited | Missing some types |
| < 4.0 | ❌ Not Supported | Please upgrade |

### Configuration Requirements

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "node",
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true
  }
}
```

## Framework Integration

### Popular Frameworks

| Framework | Support Level | Integration Guide |
|-----------|---------------|------------------|
| Express.js | ✅ Excellent | [Express Guide](/integration/express) |
| Fastify | ✅ Excellent | [Fastify Guide](/integration/fastify) |
| NestJS | ✅ Excellent | [NestJS Guide](/integration/nestjs) |
| Next.js | ✅ Good | [Next.js Guide](/integration/nextjs) |
| Koa.js | ✅ Good | Manual integration |
| Hapi.js | ✅ Good | Manual integration |

## Unicode and Emoji Support

### Terminal Requirements

Most modern terminals support Unicode and emojis:

```typescript
// ✅ Works in most terminals
plip.success("✅ Task completed");
plip.error("💥 Something broke");
plip.info("🚀 Deployment started");

// ⚠️ Fallback for older terminals
plip.configure({
  emojis: process.env.TERM_EMOJIS !== 'false'
});
```

### Font Requirements

For best emoji display, use fonts that support Unicode:

- **Recommended**: Noto Color Emoji, Apple Color Emoji
- **Monospace**: Fira Code, JetBrains Mono, Cascadia Code
- **Fallback**: Most system default fonts

## Performance Considerations

### Production Optimizations

```typescript
// Optimize for production
if (process.env.NODE_ENV === 'production') {
  plip.configure({
    level: 'info',        // Reduce log verbosity
    colors: false,        // Disable colors for log aggregation
    emojis: false,        // Disable emojis for parsing
    timestamps: true      // Enable for production tracking
  });
}
```

### Memory Usage

Plip has minimal memory overhead:

- **Bundle size**: ~15KB minified
- **Runtime overhead**: <1MB typical usage
- **Zero dependencies**: No external dependencies

## Troubleshooting

### Colors Not Showing

1. **Check terminal support**:
   ```bash
   echo $COLORTERM
   echo $TERM
   ```

2. **Force color output**:
   ```bash
   FORCE_COLOR=1 node app.js
   ```

3. **Verify Plip configuration**:
   ```typescript
   plip.info("Colors enabled:", plip.config.colors);
   ```

### Emojis Not Displaying

1. **Check font support**: Ensure your terminal font supports Unicode
2. **Terminal encoding**: Verify UTF-8 encoding is enabled
3. **Manual override**:
   ```typescript
   plip.configure({ emojis: false });
   ```

### Performance Issues

1. **Reduce log level in production**:
   ```typescript
   plip.configure({ level: 'warn' });
   ```

2. **Disable expensive features**:
   ```typescript
   plip.configure({
     colors: false,
     timestamps: false,
     stackTrace: false
   });
   ```

## Getting Help

If you encounter compatibility issues:

1. Check the [troubleshooting guide](#troubleshooting)
2. Search [existing issues](https://github.com/ru-dr/plip/issues)
3. Create a [new issue](https://github.com/ru-dr/plip/issues/new) with:
   - Node.js version
   - Operating system
   - Terminal/environment
   - Plip configuration
   - Expected vs actual behavior

## Next Steps

- [Configuration Guide](/guide/configuration) - Detailed configuration options
- [Integration Examples](/integration/express) - Real-world usage patterns
- [Troubleshooting](/request/support) - Common issues and solutions