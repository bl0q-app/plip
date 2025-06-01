# Installation

This guide covers everything you need to know about installing and setting up Plip in your project.

## Requirements

Plip is designed for modern JavaScript environments and requires:

- **Node.js**: Version 16.x or higher
- **TypeScript**: Version 4.x or higher (if using TypeScript)
- **Package Manager**: npm, yarn, pnpm, or bun

## Package Manager Installation

Choose your preferred package manager:

::: code-group

```bash [npm]
npm install @ru-dr/plip
```

```bash [yarn]
yarn add @ru-dr/plip
```

```bash [pnpm]
pnpm add @ru-dr/plip
```

```bash [bun]
bun add @ru-dr/plip
```

:::

## Import Methods

### ES Modules (Recommended)

```typescript
import { plip } from '@ru-dr/plip';
import { createPlip } from '@ru-dr/plip';
```

### CommonJS

```javascript
const { plip } = require('@ru-dr/plip');
const { createPlip } = require('@ru-dr/plip');
```

### TypeScript

Plip includes full TypeScript definitions out of the box:

```typescript
import { plip, PlipLogger, PlipConfig } from '@ru-dr/plip';

// Full type safety
const logger: PlipLogger = plip;
const config: PlipConfig = {
  enableEmojis: true,
  enableColors: true
};
```

## Verification

Verify your installation works correctly:

```typescript
import { plip } from '@ru-dr/plip';

plip.info("🎉 Plip is installed and working!");
```

If you see a colorful, emoji-decorated log message, you're all set!

## Development vs Production

Plip automatically detects your environment and adjusts accordingly:

### Development Environment
- Full colors and emojis enabled
- All log levels active
- Beautiful formatting

### Production Environment
- Automatically disables colors in non-TTY environments
- Respects `NODE_ENV=production`
- Optimized for log aggregation systems

## Bundle Information

- **Package Size**: ~50KB uncompressed
- **Dependencies**: Zero runtime dependencies
- **Tree Shaking**: Full ES module support
- **TypeScript**: Complete type definitions included

## Troubleshooting

### Colors Not Showing

If colors aren't displaying correctly:

1. Check if your terminal supports colors
2. Verify the `FORCE_COLOR` environment variable
3. Use `plip.configure({ enableColors: true })` to force enable

### Emojis Not Displaying

If emojis appear as squares or question marks:

1. Ensure your terminal/font supports Unicode
2. Use `plip.configure({ enableEmojis: false })` to disable
3. Consider using a modern terminal like Windows Terminal or iTerm2

### TypeScript Errors

If you encounter TypeScript issues:

1. Ensure you're using TypeScript 4.x or higher
2. Check your `tsconfig.json` includes ES2017 or higher
3. Verify `moduleResolution` is set to `node`

## Next Steps

Now that Plip is installed:

- Learn about [Configuration](/guide/configuration) options
- Explore [Log Levels](/guide/log-levels) in detail
- Check out [Customization](/guide/customization) possibilities
