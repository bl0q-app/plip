# 🎨 Plip Logger

A beautiful, colorful logger library with emojis and syntax highlighting for Node.js applications.

## Features

- 🌈 **Colorful output** with automatic terminal detection
- 😊 **Emoji support** for visual appeal
- 🎯 **Multiple log levels** (info, warn, error, success, debug, trace, verbose)
- 🔍 **Syntax highlighting** for objects and arrays
- ⚙️ **Flexible configuration** with method chaining
- 🔧 **Development/Production modes**
- 📦 **TypeScript support** with full type definitions

## Installation

```bash
npm install @your-username/plip
```

## Quick Start

```typescript
import { plip } from 'plip';

plip.info("Hello, world!");
plip.success("Operation completed!");
plip.error("Something went wrong!");
plip.warn("Be careful!");

// Log objects with syntax highlighting
plip.info("User data:", { name: "John", age: 30, active: true });
```

## API Documentation

### Basic Usage

```typescript
import { plip, createPlip } from 'plip';

// Use default logger
plip.info("Application started");
plip.error("Error occurred:", error);

// Create custom logger
const logger = createPlip({
  enableEmojis: true,
  enableColors: true,
  enabledLevels: ['info', 'error']
});
```

### Configuration Options

- `silent`: Suppress all output
- `enableEmojis`: Show emojis (auto-detected)
- `enableColors`: Use colors (auto-detected)  
- `enableSyntaxHighlighting`: Highlight object syntax
- `devOnly`: Only log in development
- `enabledLevels`: Array of levels to enable

### Method Chaining

```typescript
const logger = plip
  .withColors(true)
  .withEmojis(true)
  .levels('info', 'error', 'success');
```

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.