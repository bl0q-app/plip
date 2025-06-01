# Bug Reports

Found a bug in Plip Logger? Help us improve by submitting detailed bug reports. This guide will help you create effective bug reports that enable us to quickly identify and fix issues.

## Before Reporting

### 1. Check Existing Issues

Search our [GitHub Issues](https://github.com/username/plip-logger/issues) to see if the bug has already been reported:

- Use relevant keywords from your error message
- Check both open and closed issues
- Look for similar symptoms or error codes

### 2. Verify the Bug

Ensure you're experiencing an actual bug:

- Test with the latest version of Plip Logger
- Try reproducing in a minimal environment
- Check if it occurs across different environments
- Verify it's not a configuration issue

### 3. Gather Information

Collect relevant information before reporting:

- Plip Logger version
- Node.js version
- Operating system and version
- Framework versions (Express, Fastify, etc.)
- Error messages and codes
- Configuration details

## Bug Report Template

Use this template when creating bug reports:

### Basic Information

```markdown
## Bug Report

**Plip Logger Version:** 1.2.3
**Node.js Version:** 18.17.0
**OS:** Ubuntu 20.04 / Windows 11 / macOS 13.2
**Framework:** Express 4.18.2 (if applicable)

## Description

[Clear, concise description of the bug]

## Expected Behavior

[What you expected to happen]

## Actual Behavior

[What actually happened]

## Steps to Reproduce

1. [First step]
2. [Second step]
3. [Third step]
4. [etc.]

## Error Messages

```
[Include full error messages, stack traces, and error codes]
```

## Configuration

```javascript
// Your logger configuration
const logger = new Logger({
  // configuration options
});
```

## Additional Context

[Any additional information that might be helpful]
```

## Detailed Examples

### Configuration Bug Report

```markdown
## Bug Report

**Plip Logger Version:** 1.2.3
**Node.js Version:** 18.17.0
**OS:** Ubuntu 20.04
**Framework:** Express 4.18.2

## Description

Logger fails to load configuration from `.pliprc.json` file when using relative paths in the `extends` property.

## Expected Behavior

Configuration should load successfully and extend the base configuration.

## Actual Behavior

Logger throws error: `PLIP_E01004: Circular reference detected in configuration`

## Steps to Reproduce

1. Create `.pliprc.json` with relative extends path:
   ```json
   {
     "extends": "./configs/base.json",
     "logLevel": "debug"
   }
   ```

2. Create `configs/base.json`:
   ```json
   {
     "format": "json",
     "outputs": ["console"]
   }
   ```

3. Initialize logger:
   ```javascript
   const logger = new Logger(); // Loads .pliprc.json automatically
   ```

4. Error occurs during initialization

## Error Messages

```
Error: PLIP_E01004: Circular reference detected in configuration
    at ConfigLoader.loadConfig (/node_modules/plip-logger/lib/config.js:45)
    at new Logger (/node_modules/plip-logger/lib/logger.js:23)
    at /app/src/index.js:5:16
```

## Configuration

`.pliprc.json`:
```json
{
  "extends": "./configs/base.json",
  "logLevel": "debug"
}
```

`configs/base.json`:
```json
{
  "format": "json",
  "outputs": ["console"]
}
```

## Additional Context

- Works fine with absolute paths
- Occurs only with relative paths in extends
- Directory structure is correct and files exist
```

### Performance Bug Report

```markdown
## Bug Report

**Plip Logger Version:** 1.2.3
**Node.js Version:** 18.17.0
**OS:** Ubuntu 20.04
**Framework:** Express 4.18.2

## Description

Memory usage continuously increases when using file output with high log volume, eventually causing out-of-memory errors.

## Expected Behavior

Memory usage should remain stable or show minimal growth over time.

## Actual Behavior

Memory usage grows continuously at ~10MB per hour, leading to application crashes after 6-8 hours.

## Steps to Reproduce

1. Configure logger with file output:
   ```javascript
   const logger = new Logger({
     outputs: [{
       type: 'file',
       path: './app.log',
       maxSize: '10MB',
       maxFiles: 5
     }]
   });
   ```

2. Generate high volume of logs:
   ```javascript
   setInterval(() => {
     for (let i = 0; i < 100; i++) {
       logger.info(`Test message ${i}`, { data: { id: i, timestamp: Date.now() } });
     }
   }, 1000);
   ```

3. Monitor memory usage over time
4. Observe continuous memory growth

## Error Messages

```
FATAL ERROR: Ineffective mark-compacts near heap limit Allocation failed - JavaScript heap out of memory
```

## Configuration

```javascript
const logger = new Logger({
  logLevel: 'info',
  format: 'json',
  outputs: [{
    type: 'file',
    path: './logs/app.log',
    maxSize: '10MB',
    maxFiles: 5,
    buffer: {
      size: 1000,
      flushInterval: 5000
    }
  }]
});
```

## Additional Context

- Memory leak does not occur with console output only
- Problem appears to be related to file rotation logic
- Tested with Node.js 16.x and 18.x - same issue
- Application handles ~10,000 log messages per minute
```

## Severity Levels

### Critical (P0)
- Application crashes or becomes unusable
- Data loss or corruption
- Security vulnerabilities

**Response Time:** Within 24 hours

### High (P1)
- Major feature not working
- Performance severely degraded
- Affects multiple users

**Response Time:** Within 3 days

### Medium (P2)
- Minor feature issues
- Workaround available
- Documentation problems

**Response Time:** Within 1 week

### Low (P3)
- Enhancement requests
- Non-critical improvements
- Edge case issues

**Response Time:** Best effort

## Information Checklist

Include as much relevant information as possible:

### Environment Details
- [ ] Plip Logger version
- [ ] Node.js version
- [ ] Operating system and version
- [ ] Framework and version (if applicable)
- [ ] Package manager (npm, yarn, pnpm)

### Error Information
- [ ] Complete error messages
- [ ] Error codes (if any)
- [ ] Stack traces
- [ ] Console output

### Reproduction
- [ ] Minimal reproduction case
- [ ] Steps to reproduce
- [ ] Expected vs actual behavior
- [ ] Screenshots (if applicable)

### Configuration
- [ ] Logger configuration
- [ ] Environment variables
- [ ] Configuration files
- [ ] Package.json dependencies

### Context
- [ ] What you were trying to accomplish
- [ ] Any workarounds found
- [ ] Related issues or documentation
- [ ] Additional context

## Minimal Reproduction

Create the smallest possible code example that demonstrates the bug:

```javascript
// Bug reproduction - keep it minimal
const { Logger } = require('plip-logger');

const logger = new Logger({
  // minimal configuration that reproduces the issue
  format: 'json'
});

logger.info('This should work but doesn't');
// Add only the minimum code needed to show the bug
```

## Common Bug Categories

### Configuration Issues
- Invalid configuration syntax
- Conflicting options
- Environment variable problems
- File path issues

### Performance Problems
- Memory leaks
- CPU usage spikes
- Slow log processing
- Buffer overflows

### Integration Bugs
- Framework compatibility
- Middleware conflicts
- Type definition errors
- Build system issues

### Output Problems
- File writing errors
- Network connectivity
- Format inconsistencies
- Missing log entries

## Getting Help

If you're unsure whether something is a bug:

1. **Check Documentation**: Review the [guides](/guide/) and [references](/references/)
2. **Ask Questions**: Use GitHub Discussions for questions
3. **Community Help**: Join our Discord server
4. **Stack Overflow**: Tag questions with `plip-logger`

## Contributing to Bug Fixes

Want to help fix bugs?

1. **Comment on Issues**: Share additional context or workarounds
2. **Submit Pull Requests**: Include tests for your fixes
3. **Test Patches**: Help verify fixes work in different environments
4. **Documentation**: Improve documentation to prevent similar issues

## Security Bugs

For security-related bugs, please:

1. **Do not** create public GitHub issues
2. **Email us privately** at security@plip-logger.dev
3. **Include** full details and reproduction steps
4. **Wait** for our response before public disclosure

We'll acknowledge security reports within 24 hours and provide updates on our investigation progress.

## Follow-up

After submitting a bug report:

- **Monitor the issue** for questions from maintainers
- **Provide additional information** when requested
- **Test proposed fixes** if possible
- **Update the issue** if you find workarounds or additional context

Thank you for helping improve Plip Logger! Your detailed bug reports make the library better for everyone.
