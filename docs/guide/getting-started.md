# Getting Started

Welcome to Plip Logger! This guide will help you get up and running with the most delightful logging experience for Node.js.

## What is Plip?

Plip is a modern logging library that brings joy back to console logging. It combines beautiful colors, expressive emojis, and intelligent formatting to create logs that are not only functional but genuinely pleasant to read.

## Key Features

- **🌈 Smart Colors**: Automatic terminal detection with beautiful color schemes
- **😊 Expressive Emojis**: Visual context for quick log scanning
- **🎯 7 Log Levels**: Perfect granularity from verbose to error
- **🔍 Syntax Highlighting**: Beautiful JSON and object rendering
- **⚙️ Fluent API**: Chainable methods for elegant configuration
- **🚀 Zero Config**: Works perfectly out of the box
- **📦 TypeScript First**: Full type safety and IntelliSense
- **🔧 Environment Aware**: Respects NODE_ENV and terminal capabilities

## Installation

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

## Your First Logs

Import Plip and start logging immediately:

```typescript
import { plip } from '@ru-dr/plip';

// Basic logging
plip.info("Hello from Plip! 👋");
plip.success("Everything is working perfectly! ✅");
plip.warn("This might need your attention ⚠️");
plip.error("Something went wrong 💥");
```

## Logging Objects

Plip excels at displaying complex data structures:

```typescript
const user = {
  id: 123,
  name: "Alice Developer",
  email: "alice@example.com",
  preferences: {
    theme: "dark",
    notifications: true
  },
  skills: ["TypeScript", "React", "Node.js"]
};

plip.info("User profile loaded:", user);
```

This will output beautifully formatted JSON with syntax highlighting!

## Log Levels

Plip provides 7 distinct log levels:

```typescript
plip.verbose("Detailed debugging information");
plip.debug("Debug information for development");
plip.info("General information messages");
plip.success("Success and completion messages");
plip.warn("Warning messages for potential issues");
plip.error("Error messages for failures");
plip.trace("Execution trace information");
```

Each level has its own emoji, color scheme, and semantic meaning.

## Next Steps

- Learn about [Installation](/guide/installation) options and requirements
- Explore [Configuration](/guide/configuration) to customize Plip
- Understand [Log Levels](/guide/log-levels) in detail
- Discover [Customization](/guide/customization) options

## Need Help?

- 📖 Check the [API Reference](/api/logger)
- 💡 Browse [Examples](/examples/)
- 🐛 [Report Issues](https://github.com/ru-dr/plip/issues)
- 💬 [Join Discussions](https://github.com/ru-dr/plip/discussions)
